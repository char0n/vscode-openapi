import type { OasParameterLocation, HttpMethod, BundledOpenApiSpec } from "../oas30";

export interface HttpRequestPayload {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: string;
}

export interface HttpResponsePayload {
  httpVersion: string;
  statusCode: number;
  statusMessage?: string;
  headers: [string, string][];
  body?: string;
}

export interface CurlPayload {
  curl: string;
}

export interface ScanConfig {
  parameters: Record<OasParameterLocation, Record<string, unknown>>;
  requestBody?: unknown;
  host: string;
}

export interface ShowPayload {
  oas: BundledOpenApiSpec;
  path: string;
  method: HttpMethod;
  config: ScanConfig;
}

export interface HttpErrorPayload {
  message: string;
}

export interface UpdateScanConfigPayload {
  path: string;
  method: HttpMethod;
  config: ScanConfig;
}

// requests to scan web app
type ScanOperation = { command: "scanOperation"; payload: ShowPayload };
type TryOperation = { command: "tryOperation"; payload: ShowPayload };
type CurlOperation = { command: "curlOperation"; payload: ShowPayload };
type ShowResponse = { command: "showResponse"; payload: HttpResponsePayload };
type ShowError = { command: "showError"; payload: HttpErrorPayload };
type ShowScanReport = { command: "showScanReport"; payload: any };
type ScanRequests =
  | ScanOperation
  | TryOperation
  | CurlOperation
  | ShowResponse
  | ShowError
  | ShowScanReport;

// responses sent from web app to the vs code extension
type UpdateScanConfig = { command: "updateScanConfig"; payload: UpdateScanConfigPayload };
type SendHttpRequest = { command: "sendRequest"; payload: HttpRequestPayload };
type SendCurl = { command: "sendCurl"; payload: CurlPayload };
type ScanResponses = SendHttpRequest | SendCurl | UpdateScanConfig;

export type { ScanRequests, ScanResponses };
