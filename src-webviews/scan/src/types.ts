export interface Issue {
  description: string;
  curl: string;
}

export interface OperationReport {
  path: string;
  method: string;
  issues: Issue[];
}

export interface ScanReport {
  summary: {
    issues: number;
  };
  report: OperationReport[];
}

export interface HostApplication {
  postMessage(message: any): void;
}
