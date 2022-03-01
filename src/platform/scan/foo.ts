import * as vscode from "vscode";
import { format } from "util";
import { Cache } from "../../cache";

export interface Issue {
  description: string;
  curl: string;
}

export interface OperationReport {
  path: string;
  method: string;
  isSkipped: boolean;
  issues: Issue[];
}

export interface Scan {
  summary: {
    issues: number;
  };
  report: OperationReport[];
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

  const result: OperationReport[] = [];

  for (const [path, pathReport] of Object.entries<any>(report.paths)) {
    for (const [method, opReport] of Object.entries<any>(pathReport)) {
      const isSkipped = !opReport.checked;
      const operationReport: OperationReport = {
        path,
        method,
        issues: [],
        isSkipped,
      };
      result.push(operationReport);
      if (isSkipped) {
        operationReport.issues.push({
          description: opReport.skipReasonDetails,
          curl: "",
        });
      }
      if (opReport.issues) {
        for (const issue of report.paths[path][method].issues) {
          operationReport.issues.push({
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

  return { summary: { issues }, report: result };
}
