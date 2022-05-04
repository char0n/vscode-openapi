/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import got, { Method, OptionsOfJSONResponseBody } from "got";
import { WebView } from "../web-view";

export class ScanWebView extends WebView {
  private panel?: vscode.WebviewPanel;

  async show(oas: any, path: string | number, method: string | number, config: any) {
    this.panel = await this.createPanel();

    this.panel.webview.postMessage({ command: "updateOas", oas });
    this.panel.webview.postMessage({
      command: "focus",
      path,
      method,
      config,
    });

    this.panel.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "scan":
          let { host, path, parameters, method, requestBody } = message.data;
          if (parameters.path) {
            for (const [name, value] of Object.entries(parameters.path)) {
              path = path.replaceAll(`{${name}}`, value);
            }
          }

          const url = host + path;

          const response = await got(url, {
            throwHttpErrors: false,
            method,
            body: requestBody,
            headers: {
              "content-type": "application/json",
            },
          });

          console.log("got scan command", url, response);
          this.showResponse({
            rawHeaders: response.rawHeaders,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            body: response.body,
            httpVersion: response.httpVersion,
          });
          return;
      }
    });
  }

  async showResponse(response: any) {
    if (!this.panel) {
      this.panel = await this.createPanel();
    }
    this.panel.webview.postMessage({ command: "showResponse", response });
  }

  async foo() {}
}
