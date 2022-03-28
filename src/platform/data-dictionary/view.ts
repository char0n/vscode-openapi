/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import { WebView } from "../web-view";

export class DataDictionaryWebView extends WebView {
  private panel?: vscode.WebviewPanel;

  async show(dictionaries: any) {
    this.panel = await this.createPanel();
    this.panel.webview.postMessage({ command: "loadDictionaries", dictionaries });
  }
}
