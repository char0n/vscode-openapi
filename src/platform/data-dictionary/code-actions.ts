/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import { findNodeAtOffset } from "@xliic/preserving-json-yaml-parser";
import { Cache } from "../../cache";
import { PlatformStore } from "../stores/platform-store";
import { findByPath } from "@xliic/preserving-json-yaml-parser";

export class DataDictionaryCodeActions implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];
  constructor(private cache: Cache, private store: PlatformStore) {}
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const line = document.lineAt(range.start).text;
    if (line.includes("format")) {
      const parsed = this.cache.getParsedDocument(document);
      if (parsed !== undefined) {
        const [node, nodePath] = findNodeAtOffset(parsed, document.offsetAt(range.start));
        if (nodePath[nodePath.length - 1] === "format") {
          nodePath.pop();
        }
        const targetNode = findByPath(parsed, nodePath);

        if (!targetNode?.format.startsWith("o:")) {
          return [];
        }

        const action = new vscode.CodeAction(
          "Add or update schema constraints from Data Dictionary",
          vscode.CodeActionKind.QuickFix
        );

        action.command = {
          command: "openapi.platform.editorDataDictionaryUpdateSchema",
          title: "Updates schema to reflect Data Dictionary",
          arguments: [targetNode.format, targetNode, nodePath],
        };
        action.isPreferred = true;

        return [action];
      }
    }
    return [];
  }
}
