/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import got, { Method, OptionsOfJSONResponseBody, RequestError } from "got";
import { WebView } from "../web-view";

import {
  ScanRequests,
  ScanResponses,
  ShowPayload,
  CurlPayload,
  HttpRequestPayload,
} from "@xliic/common/messages/scan";

export class ScanWebView extends WebView {
  private panel?: vscode.WebviewPanel;

  async scanOperation(payload: ShowPayload) {
    await this.ensurePanel();
    this.sendScanRequest({ command: "scanOperation", payload });
  }

  async tryOperation(payload: ShowPayload) {
    await this.ensurePanel();
    this.sendScanRequest({ command: "tryOperation", payload });
  }

  async curlOperation(payload: ShowPayload) {
    await this.ensurePanel();
    this.sendScanRequest({ command: "curlOperation", payload });
  }

  async ensurePanel(): Promise<void> {
    if (!this.panel) {
      this.panel = await this.createPanel();
      this.panel.onDidDispose(() => (this.panel = undefined));
      this.panel.webview.onDidReceiveMessage(async (message) => {
        const { command, payload } = message as ScanResponses;
        const handler = requestHandlers[command];
        if (handler) {
          const request = await handler(payload);
          if (request !== undefined) {
            this.sendScanRequest(request);
          }
        } else {
          throw new Error(`Unable to find handler for command: ${command}`);
        }
      });
    }
  }

  async sendScanRequest(message: ScanRequests) {
    this.panel!.webview.postMessage(message);
  }
}

const requestHandlers: Record<
  ScanResponses["command"],
  (payload: any) => Promise<ScanRequests | void>
> = {
  sendRequest,
  sendCurl,
};

async function sendCurl(payload: CurlPayload) {
  console.log("got curl command", payload);
  const terminal = vscode.window.createTerminal({});
  terminal.sendText(payload.curl);
  terminal.show();
}

async function sendRequest(payload: HttpRequestPayload): Promise<ScanRequests> {
  const { url, method, headers, body } = payload;

  try {
    const response = await got(url, {
      throwHttpErrors: false,
      method,
      body,
      headers: {
        "content-type": "application/json",
        ...headers,
      },
    });

    const responseHeaders: [string, string][] = [];
    for (let i = 0; i < response.rawHeaders.length; i += 2) {
      responseHeaders.push([response.rawHeaders[i], response.rawHeaders[i + 1]]);
    }

    console.log("got scan command", url, response);

    return {
      command: "showResponse",
      payload: {
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        body: response.body,
        httpVersion: response.httpVersion,
        headers: responseHeaders,
      },
    };
  } catch (e: unknown) {
    const { code, message } = e as RequestError;

    return {
      command: "showError",
      payload: {
        message,
      },
    };
  }
}
