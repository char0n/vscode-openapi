import * as vscode from "vscode";
import { format } from "util";
import { Cache } from "../../cache";

export interface Issue {
  description: string;
  curl: string;
}

export interface Operation {
  issues: Issue[];
}

export interface Scan {
  summary: {
    issues: number;
  };
  paths: {
    [path: string]: {
      [operation: string]: Operation;
    };
  };
}

export interface ScanContext {
  scans: {
    [uri: string]: Scan;
  };
}

export async function parseScanReport(
  cache: Cache,
  document: vscode.TextDocument,
  report: any
): Promise<Scan> {
  const index = report.index;
  const issues = report.summary.issues;

  const paths: Scan["paths"] = {};

  for (const path of Object.keys(report.paths)) {
    paths[path] = {};
    for (const operation of Object.keys(report.paths[path])) {
      paths[path][operation] = { issues: [] };
      if (report.paths[path][operation].issues) {
        for (const issue of report.paths[path][operation].issues) {
          paths[path][operation].issues.push({
            description: format(
              index.injectionDescriptions[issue.injectionDescription],
              ...issue.injectionDescriptionParams
            ),
            curl: issue.curl,
          });
        }
      }
    }
  }

  return { summary: { issues }, paths };
}
