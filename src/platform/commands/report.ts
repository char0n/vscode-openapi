import * as vscode from "vscode";

import { PlatformStore } from "../stores/platform-store";
import { Cache } from "../../cache";
import { refreshAuditReport } from "../audit";
import { AuditContext } from "../../types";
import { makePlatformUri } from "../util";
import { AuditReportWebView } from "../../audit/report";
import { ScanReportWebView } from "../scan-report";
import { parseAuditReport, updateAuditContext } from "../../audit/audit";
import { setDecorations, updateDecorations } from "../../audit/decoration";
import { updateDiagnostics } from "../../audit/diagnostic";
import { parseScanReport, Scan, ScanContext } from "../scan/foo";
import { findLocationForJsonPointer, Parsed } from "@xliic/preserving-json-yaml-parser";
import { joinJsonPointer } from "../../pointer";

export default (
  context: vscode.ExtensionContext,
  store: PlatformStore,
  auditContext: AuditContext,
  scanContext: ScanContext,
  cache: Cache,
  reportWebView: AuditReportWebView,
  scanReportView: ScanReportWebView
) => ({
  openAuditReport: async (apiId: string) => {
    await vscode.window.withProgress<void>(
      {
        title: `Loading Audit Report for API ${apiId}`,
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
      },
      async () => {
        try {
          const uri = makePlatformUri(apiId);
          const document = await vscode.workspace.openTextDocument(uri);
          const audit = await refreshAuditReport(store, cache, auditContext, document);
          if (audit) {
            reportWebView.show(audit);
          }
        } catch (e) {
          vscode.window.showErrorMessage(`Unexpected error: ${e}`);
        }
      }
    );
  },

  editorLoadAuditReportFromFile: async (editor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {
    const selection = await vscode.window.showOpenDialog({
      title: "Load Security Audit report",
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      // TODO use language filter from extension.ts
      filters: {
        OpenAPI: ["json", "yaml", "yml"],
      },
    });

    if (selection) {
      const text = await vscode.workspace.fs.readFile(selection[0]);
      const report = JSON.parse(Buffer.from(text).toString("utf-8"));
      if (report?.aid && report?.tid && report.data?.assessmentVersion) {
        const uri = editor.document.uri.toString();
        const audit = await parseAuditReport(cache, editor.document, report.data, {
          value: { uri, hash: "" },
          children: {},
        });
        updateAuditContext(auditContext, uri, audit);
        updateDecorations(auditContext.decorations, audit.summary.documentUri, audit.issues);
        updateDiagnostics(auditContext.diagnostics, audit.filename, audit.issues);
        setDecorations(editor, auditContext);
        reportWebView.show(audit);
      } else {
        vscode.window.showErrorMessage(
          "Can't find 42Crunch Security Audit report in the selected file"
        );
      }
    }
  },

  openScanReport: async (apiId: string) => {
    await vscode.window.withProgress<void>(
      {
        title: `Loading Conformance Scan Report for API ${apiId}`,
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
      },
      async () => {
        try {
          const report = await store.getScanReport(apiId);
          const uri = makePlatformUri(apiId);
          const document = await vscode.workspace.openTextDocument(uri);
          const scan = await parseScanReport(cache, document, report);
          scanContext.scans[uri.toString()] = scan;
          const editor = vscode.window.activeTextEditor;
          if (editor?.document === document) {
            const parsed = cache.getParsedDocument(editor.document);
            const decorations = createDecoration(editor.document, parsed!, scan.report);

            const icon = context.asAbsolutePath("resources/42crunch_icon.svg");

            const decorationType = vscode.window.createTextEditorDecorationType({
              //borderWidth: "1px",
              //borderStyle: "solid",
              //overviewRulerColor: "blue",
              overviewRulerLane: vscode.OverviewRulerLane.Right,
              gutterIconPath: icon,
              light: {
                // this color will be used in light color themes
                //borderColor: "darkblue",
              },
              dark: {
                // this color will be used in dark color themes
                //borderColor: "lightblue",
              },
            });

            editor.setDecorations(decorationType, decorations);
          }

          scanReportView.show(scan);
        } catch (e) {
          vscode.window.showErrorMessage(`Unexpected error: ${e}`);
        }
      }
    );
  },
});

const decorationTypeX = vscode.window.createTextEditorDecorationType({
  borderWidth: "1px",
  borderStyle: "solid",
  overviewRulerColor: "blue",
  overviewRulerLane: vscode.OverviewRulerLane.Right,
  gutterIconPath: "./resources/42crunch_icon.svg",
  light: {
    // this color will be used in light color themes
    borderColor: "darkblue",
  },
  dark: {
    // this color will be used in dark color themes
    borderColor: "lightblue",
  },
});

function createDecoration(
  document: vscode.TextDocument,
  parsed: Parsed,
  issues: Scan["report"]
): vscode.DecorationOptions[] {
  const options: vscode.DecorationOptions[] = [];
  const renderOptions: vscode.DecorationInstanceRenderOptions = {
    light: { before: { backgroundColor: "red" }, after: { backgroundColor: "red" } },
  };

  const range = new vscode.Range(new vscode.Position(1, 0), new vscode.Position(1, 160));

  for (const issue of issues) {
    const pointer = joinJsonPointer(["paths", issue.path, issue.method]);
    const location = findLocationForJsonPointer(parsed, pointer);
    if (location?.key) {
      const range = new vscode.Range(
        document.positionAt(location.key.start),
        document.positionAt(location.key.end)
      );
      options.push({ range });
    }
  }
  return options;
}
