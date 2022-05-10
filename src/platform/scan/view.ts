/*
 Copyright (c) 42Crunch Ltd. All rights reserved.
 Licensed under the GNU Affero General Public License version 3. See LICENSE.txt in the project root for license information.
*/

import * as vscode from "vscode";
import got, { RequestError } from "got";
import { WebView } from "../web-view";

import {
  ScanRequests,
  ScanResponses,
  ShowPayload,
  CurlPayload,
  HttpRequestPayload,
  ScanConfig,
  UpdateScanConfigPayload,
} from "@xliic/common/messages/scan";

import { ScandConfiguration } from "@xliic/common";

import { readFileSync, writeFileSync } from "fs";

import { find } from "@xliic/common/jsonpointer";

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
  updateScanConfig,
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

async function updateScanConfig(payload: UpdateScanConfigPayload) {
  const debugConfiguration = {};

  const configFile = "/Users/anton/crunch/platform/src/daemon/scand/debug_configuration.json";
  const data = readFileSync(configFile, { encoding: "utf8" });
  const parsedConfig = JSON.parse(data);

  const config = find(parsedConfig, [
    "playbook",
    "paths",
    payload.path,
    payload.method,
    "happyPaths",
    "0",
    "requests",
    "0",
    "request",
    "request",
  ]) as ScandConfiguration;

  config.requestBody = payload.config.requestBody;

  console.log("scan config", config);

  const updatedConfigFile =
    "/Users/anton/crunch/platform/src/daemon/scand/updated_configuration.json";
  writeFileSync(updatedConfigFile, JSON.stringify(parsedConfig, null, 2));
}
