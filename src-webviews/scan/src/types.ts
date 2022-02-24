export interface Issue {
  description: string;
  curl: string;
}

export interface OperationReport {
  issues: Issue[];
}

export interface ScanReport {
  summary: {
    issues: number;
  };
  paths: {
    [path: string]: {
      [operation: string]: OperationReport;
    };
  };
}

export interface HostApplication {
  postMessage(message: any): void;
}
