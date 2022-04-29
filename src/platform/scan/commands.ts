import * as vscode from "vscode";

import { parseJsonPointer, Path, simpleClone } from "@xliic/preserving-json-yaml-parser";
import { HttpMethod, BundledOpenApiSpec } from "@xliic/common";
import { find } from "@xliic/common/jsonpointer";
import {
  getOperation,
  getOperationParameters,
  getPathItemParameters,
  mergeParameters,
  getPath,
} from "@xliic/common";

import { Cache } from "../../cache";
import { writeFileSync, unlinkSync, fstat, existsSync, readFileSync } from "fs";
import { OpenApiVersion } from "../../types";
import { ScanWebView } from "./view";
import { Node } from "../../outline";

export default (cache: Cache, scanView: ScanWebView) => ({
  async runCurl(command: string): Promise<void> {
    // TODO use own?
    const terminal = vscode.window.activeTerminal;
    terminal?.sendText(command);
    terminal?.show();
  },

  async editorRunSingleOperationScan(
    editor: vscode.TextEditor,
    edit: vscode.TextEditorEdit,
    node: Node
  ): Promise<void> {
    const [path, method] = node.path;
    const bundle = await cache.getDocumentBundle(editor.document);
    if (bundle && !("errors" in bundle)) {
      const spec = bundle.value as BundledOpenApiSpec;

      const visited = new Set<string>();
      crawl(bundle.value, bundle.value["paths"][path][method], visited);
      const cloned: any = simpleClone(bundle.value);
      delete cloned["paths"];
      delete cloned["components"]["schemas"];
      cloned["paths"] = { [path]: { [method]: bundle.value["paths"][path][method] } };
      if (bundle.value["paths"][path]["parameters"]) {
        cloned["paths"][path]["parameters"] = bundle.value["paths"][path]["parameters"];
      }
      copyByPointer(bundle.value, cloned, Array.from(visited));
      //console.log("cloned", cloned, getPath(spec, ""));

      const json = JSON.stringify(cloned, null, 2);
      writeFileSync("/Users/anton/crunch/platform/src/daemon/scand/test.json", json);

      const configFile = "/Users/anton/crunch/platform/src/daemon/scand/debug_configuration.json";
      if (existsSync(configFile)) {
        unlinkSync(configFile);
      }

      const terminal = vscode.window.createTerminal({
        cwd: "/Users/anton/crunch/platform/src/daemon/scand",
      });
      terminal.sendText(
        "docker run --rm -it -w /asio/src/daemon/scand  -v /Users/anton/crunch/platform:/asio  platform-dev ./scand -default-configuration -oasfile single.json"
      );
      terminal.show();

      const configuration = await readWhenExists(configFile, 30);
      if (configuration === undefined) {
        return;
      }

      const parsedConfig = JSON.parse(configuration);

      const request = find(parsedConfig, [
        "playbook",
        "paths",
        "/api/register/{foo}/{bar}",
        "post",
        "happyPaths",
        "0",
        "requests",
        "0",
        "request",
        "request",
      ]);

      console.log("found", request);

      scanView.show(cloned, path, method);

      /*
      const pathItem = getPath(spec, path)!;
      const operation = getOperation(spec, path, method as HttpMethod)!;
      const pathParameters = getPathItemParameters(spec, pathItem);
      const opParameters = getOperationParameters(spec, operation);
      const parameters = mergeParameters(pathParameters, opParameters);
      */
      //scanView.show(parameters);
    }

    /*
    const bundle = await cache.getDocumentBundle(editor.document);
    const version = cache.getDocumentVersion(editor.document);
    if (bundle && !("errors" in bundle)) {
      const visited = new Set<string>();
      if (version === OpenApiVersion.V2) {
        crawl(bundle.value, bundle.value["paths"][path][method], visited);
        const cloned: any = simpleClone(bundle.value);
        delete cloned["paths"];
        delete cloned["definitions"];
        cloned["paths"] = { [path]: { [method]: bundle.value["paths"][path][method] } };
        copyByPointer(bundle.value, cloned, Array.from(visited));
        console.log("cloned", cloned);
        const json = JSON.stringify(cloned, null, 2);
        writeFileSync("/tmp/single.json", json);
      } else if (version === OpenApiVersion.V3) {
        crawl(bundle.value, bundle.value["paths"][path][method], visited);
        const cloned: any = simpleClone(bundle.value);
        delete cloned["paths"];
        delete cloned["components"]["schemas"];
        cloned["paths"] = { [path]: { [method]: bundle.value["paths"][path][method] } };
        copyByPointer(bundle.value, cloned, Array.from(visited));
        console.log("cloned", cloned);
        const json = JSON.stringify(cloned, null, 2);
        writeFileSync("/tmp/single.json", json);
      }
    }
    */
  },

  async runScan(token: string): Promise<void> {
    // TODO use own?
    token = "c7046e71-2b41-409e-b161-4f482977a713";
    const terminal = vscode.window.createTerminal({
      message: "running the scan",
      name: "scan",
      iconPath: { id: "checklist" },
    });

    terminal.sendText(
      `docker run --rm -e SCAN_TOKEN=${token} -e PLATFORM_SERVICE=services.dev.42crunch.com:8001 42crunch/scand-agent:latest`
    );
    //terminal.sendText("exit 3");

    terminal.show();

    /*
    vscode.window.onDidCloseTerminal((t) => {
      if (t === terminal && t.exitStatus && t.exitStatus.code) {
        vscode.window.showInformationMessage(`Exit code: ${t.exitStatus.code}`);
      }
    });
    */
  },
});

function crawl(root: any, current: any, visited: Set<string>) {
  if (typeof current !== "object") {
    return;
  }

  for (const [key, value] of Object.entries(current)) {
    if (key === "$ref") {
      const path = (<string>value).substring(1, (<string>value).length);
      visited.add(path);
      const ref = resolveRef(root, path);
      crawl(root, ref, visited);
    } else {
      crawl(root, value, visited);
    }
  }
}

function resolveRef(root: any, pointer: string) {
  const path = parseJsonPointer(pointer);
  let current = root;
  for (let i = 0; i < path.length; i++) {
    current = current[path[i]];
  }
  return current;
}

function copyByPointer(src: any, dest: any, pointers: string[]) {
  const sortedPointers = [...pointers];
  sortedPointers.sort();
  for (const pointer of sortedPointers) {
    const path = parseJsonPointer(pointer);
    copyByPath(src, dest, path);
  }
}

function copyByPath(src: any, dest: any, path: Path): void {
  let currentSrc = src;
  let currentDest = dest;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    currentSrc = currentSrc[key];
    if (currentDest[key] === undefined) {
      if (Array.isArray(currentSrc[key])) {
        currentDest[key] = [];
      } else {
        currentDest[key] = {};
      }
    }
    currentDest = currentDest[key];
  }
  const key = path[path.length - 1];
  // check if the last segment of the path that is being copied is already set
  // which might be the case if we've copied the parent of the path already
  if (currentDest[key] === undefined) {
    currentDest[key] = currentSrc[key];
  }
}

async function readWhenExists(filename: string, maxDelay: number): Promise<string | undefined> {
  let currentDelay = 0;
  while (currentDelay < maxDelay) {
    if (existsSync(filename)) {
      return readFileSync(filename, { encoding: "utf8" });
    }
    console.log("Waiting for", filename, "to become available");
    await delay(1000);
  }
  console.log("Failed to read", filename);
  return undefined;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
