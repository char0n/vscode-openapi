import * as vscode from "vscode";
import { Cache } from "../../cache";
import { BundledOpenApiSpec, getOperations } from "@xliic/common/oas30";
import { getLocation } from "@xliic/preserving-json-yaml-parser";

export class TryItCodelensProvider implements vscode.CodeLensProvider {
  onDidChangeCodeLenses?: vscode.Event<void>;
  constructor(private cache: Cache) {}

  async provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.CodeLens[]> {
    //const bundle = await this.cache.getDocumentBundle(document);
    const result = [];
    const parsed = this.cache.getParsedDocument(document);
    if (parsed) {
      const oas = parsed as unknown as BundledOpenApiSpec;
      const operations = getOperations(oas);

      for (const [path, method, operation] of operations) {
        const loc = getLocation(oas.paths[path], method);

        const position = document.positionAt(loc!.key!.start);
        const line = document.lineAt(position.line + 1);
        const range = new vscode.Range(
          new vscode.Position(position.line + 1, line.firstNonWhitespaceCharacterIndex),
          new vscode.Position(position.line + 1, line.range.end.character)
        );

        const scanOperationLens = new vscode.CodeLens(range, {
          title: `Scan`,
          tooltip: "Scan this operation",
          command: "openapi.platform.editorRunSingleOperationScan",
          arguments: [{ path: [path, method] }],
        });

        const tryItLens = new vscode.CodeLens(range, {
          title: `Try it`,
          tooltip: "Try this operation by sending a request",
          command: "openapi.platform.editorTryOperation",
          arguments: [{ path: [path, method] }],
        });

        const tryItCurlLens = new vscode.CodeLens(range, {
          title: `Curl`,
          tooltip: "Try this operation by sending a request with Curl command line",
          command: "openapi.platform.editorCurlOperation",
          arguments: [{ path: [path, method] }],
        });

        result.push(scanOperationLens);
        result.push(tryItLens);
        result.push(tryItCurlLens);
      }
    }
    /* FIXME   
    const uuidLens = new vscode.CodeLens(new vscode.Range(0, 0, 0, 100), {
      title: `${api.desc.id}`,
      tooltip: "API UUID",
      command: "openapi.platform.copyToClipboard",
      arguments: [api.desc.id, `Copied UUID ${api.desc.id} to clipboard`],
    });
    */

    return result;
  }
}
