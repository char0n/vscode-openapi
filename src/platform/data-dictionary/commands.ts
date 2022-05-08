/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import * as yaml from "js-yaml";
import { getDataDictionaries } from "../api";
import { DataDictionaryWebView } from "./view";
import { PlatformContext } from "../types";
import { Path } from "@xliic/preserving-json-yaml-parser";
import { Cache } from "../../cache";
import { replaceObject } from "../../edits/replace";
import { PlatformStore } from "../stores/platform-store";

export default (
  cache: Cache,
  platformContext: PlatformContext,
  store: PlatformStore,
  dataDictionaryView: DataDictionaryWebView
) => ({
  browseDataDictionaries: async () => {
    const formats = await store.getDataDictionaries();
    dataDictionaryView.show(formats);
  },

  editorDataDictionaryUpdateSchema: async (
    editor: vscode.TextEditor,
    edit: vscode.TextEditorEdit,
    format: string,
    node: object,
    nodePath: Path
  ) => {
    const document = editor.document;
    const parsed = cache.getParsedDocument(editor.document);
    const formats = await store.getDataDictionaryFormats();
    const found = formats.filter((f) => f.name === format).pop();

    const schemaProps = [
      "type",
      "readOnly",
      "writeOnly",
      "nullable",
      "example",
      "pattern",
      "minLength",
      "maxLength",
      "enum",
      "default",
      "exclusiveMinimum",
      "exclusiveMaximum",
      "minimum",
      "maximum",
      "multipleOf",
    ];

    if (parsed !== undefined && found !== undefined) {
      const updated: any = { ...node };
      for (const name of schemaProps) {
        delete updated[name];
        if ((found.format as any)[name] !== undefined) {
          updated[name] = (found.format as any)[name];
        }
      }

      let text = "";
      if (editor.document.languageId === "yaml") {
        text = yaml.dump(updated, { indent: 2 }).trimEnd();
      } else {
        text = JSON.stringify(updated, null, 1);
      }

      const edit = replaceObject(editor.document, parsed, nodePath, text);
      const workspaceEdit = new vscode.WorkspaceEdit();
      workspaceEdit.set(document.uri, [edit]);
      await vscode.workspace.applyEdit(workspaceEdit);
    }
  },
});
