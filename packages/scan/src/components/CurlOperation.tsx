import {
  BundledOpenApiSpec,
  HttpMethod,
  OasParameterLocation,
  OperationParametersMap,
  OasRequestBody,
} from "@xliic/common/oas30";
import { HttpRequestPayload, ScanConfig } from "@xliic/common/messages/scan";
import { useAppDispatch } from "../store/hooks";
import { sendRequestCurl } from "../store/oasSlice";

import Fo from "./Fo";

export default function CurlOperation({
  parameters,
  requestBody,
  config,
  path,
  method,
  oas,
}: {
  oas: BundledOpenApiSpec;
  config: ScanConfig;
  parameters: OperationParametersMap;
  requestBody?: OasRequestBody;
  path: string;
  method: HttpMethod;
}) {
  const dispatch = useAppDispatch();

  const tryCurl = (data: Record<string, any>) => {
    const curl = makeCurlRequest(method, path, data as RequestFormData);
    dispatch(sendRequestCurl({ curl }));
  };

  return (
    <>
      <Fo
        oas={oas}
        parameters={parameters}
        requestBody={requestBody}
        config={config}
        path={path}
        method={method}
        onSubmit={tryCurl}
        buttonText="Run Curl"
      />
    </>
  );
}

interface RequestFormData {
  parameters?: Record<OasParameterLocation, Record<string, any>>;
  host: string;
  requestBody?: string;
}

function makeUrl(host: string, path: string, pathParameters?: Record<string, any>): string {
  const trimmedHost = host.endsWith("/") ? host.slice(0, -1) : host;
  const substitutedPath = pathParameters ? substitutePathParams(path, pathParameters) : path;
  return trimmedHost + substitutedPath;
}

function substitutePathParams(path: string, pathParameters: Record<string, any>) {
  let substituted = path;
  for (const [name, value] of Object.entries(pathParameters)) {
    substituted = substituted.replaceAll(`{${name}}`, value as string);
  }
  return substituted;
}

function makeCurlRequest(method: HttpMethod, path: string, data: RequestFormData): string {
  const substitutedPath = data?.parameters?.path
    ? substitutePathParams(path, data.parameters.path)
    : path;
  const url = makeUrl(data.host, path, data?.parameters?.path);
  const escape = (value: string) => value.replace(/'/g, "'\\''");
  const curl = makeCurl(method, url, escape);
  const headers = makeHeaders(data?.parameters?.header ?? {}, escape).join(" ");
  const body = makeBody(data.requestBody!, escape);
  return `${curl} ${headers} ${body}`;
}

// FIXME -H This option only changes the actual word used in the HTTP request, it does not alter the way curl behaves.
// So for example if you want to make a proper HEAD request, using -X HEAD will not suffice. You need to use the --head option.
function makeCurl(method: HttpMethod, url: string, escape: Function): string {
  return `curl -v -X ${method.toUpperCase()} '${escape(url)}'`;
}

function makeHeaders(headers: Record<string, any>, escape: Function): string[] {
  return Object.entries(headers).map(([key, value]) => `-H '${escape(key)}: ${escape(value)}'`);
}

function makeBody(body: string, escape: Function): string {
  return `-d '${escape(body)}'`;
}
