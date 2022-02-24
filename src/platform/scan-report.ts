/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as path from "path";
import * as vscode from "vscode";
import { readFileSync } from "fs";
import { Scan } from "./scan/foo";
import { Path } from "@xliic/preserving-json-yaml-parser";

export class ScanReportWebView {
  private panel?: vscode.WebviewPanel;
  private style: string;
  private script: vscode.Uri;

  constructor(extensionPath: string) {
    this.script = vscode.Uri.file(
      path.join(extensionPath, "webview", "generated", "scan", "index.js")
    );

    this.style = readFileSync(
      path.join(extensionPath, "webview", "generated", "scan", "style.css"),
      { encoding: "utf-8" }
    );
  }

  public show(report: Scan) {
    if (!this.panel) {
      this.panel = this.createPanel();
    }
    this.panel.webview.postMessage({ command: "show", report });
  }

  public focusOperation(path: Path) {
    this.panel?.webview.postMessage({ command: "focusOperation", path });
  }

  public focusPath(path: string) {
    this.panel?.webview.postMessage({ command: "focusPath", path });
  }

  private createPanel(): vscode.WebviewPanel {
    const panel = vscode.window.createWebviewPanel(
      "conformance-scan-report",
      "Conformance Scan Report",
      {
        viewColumn: vscode.ViewColumn.Two,
        preserveFocus: true,
      },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    panel.webview.html = this.getHtml(
      panel.webview.cspSource,
      panel.webview.asWebviewUri(this.script),
      this.style
    );

    panel.onDidDispose(() => (this.panel = undefined));

    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case "curl":
          console.log("run curl", message.curl);
          vscode.commands.executeCommand("openapi.platform.runCurl", message.curl);
          break;
      }
    });

    return panel;
  }

  private getHtml(cspSource: string, script: vscode.Uri, style: string): string {
    const themeKind =
      vscode.window.activeColorTheme.kind == vscode.ColorThemeKind.Light ? "light" : "dark";

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy"  content="default-src 'none';  img-src ${cspSource} https: data:; script-src ${cspSource} 'unsafe-inline'; style-src ${cspSource}  'unsafe-inline'; connect-src http: https:">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${style}</style>
      <style>
        :root {
          --audit-foreground: var(
            --audit-custom-foreground,
            var(--vscode-editor-foreground)
          );
          --audit-background: var(
            --audit-custom-background,
            var(--vscode-editor-background)
          );
        }
      </style>
    </head>
    <body>
    <div id="root"></div>  
    <script src="${script}"></script>
    <script>
    window.addEventListener("DOMContentLoaded", (event) => {
      console.log('content loaded');
      const vscode = acquireVsCodeApi();
      window.renderScanReport(vscode, {kind: "${themeKind}"});
      console.log("all done");
    });
    </script>
    </body>
    </html>`;
  }
}
