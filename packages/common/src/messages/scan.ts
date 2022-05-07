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

interface HttpErrorPayload {
  message: string;
}

// requests to scan web app
type ShowRequest = { command: "show"; payload: ShowPayload };
type ShowResponse = { command: "showResponse"; payload: HttpResponsePayload };
type ShowError = { command: "showError"; payload: HttpErrorPayload };
type ScanRequests = ShowRequest | ShowResponse | ShowError;

// responses sent from web app to the vs code extension
type SendHttpRequest = { command: "sendRequest"; payload: HttpRequestPayload };
type SendCurl = { command: "sendCurl"; payload: CurlPayload };
type ScanResponses = SendHttpRequest | SendCurl;

export type { ScanRequests, ScanResponses };
