import {
  BundledOpenApiSpec,
  HttpMethod,
  OasParameterLocation,
  OperationParametersMap,
  OasRequestBody,
} from "@xliic/common/oas30";
import { HttpRequestPayload, ScanConfig } from "@xliic/common/messages/scan";
import { useAppDispatch } from "../store/hooks";
import { sendRequest } from "../store/oasSlice";

import Fo from "./Fo";

export default function TryOperation({
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

  const tryOperation = (data: Record<string, any>) => {
    const httpRequest = makeHttpRequest(method, path, data as RequestFormData);
    console.log("data", data);
    console.log("request", httpRequest);
    dispatch(sendRequest(httpRequest));
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
        onSubmit={tryOperation}
        buttonText="Try It"
      />
    </>
  );
}

interface RequestFormData {
  parameters?: Record<OasParameterLocation, Record<string, any>>;
  host: string;
  requestBody?: string;
}

function makeHttpRequest(
  method: HttpMethod,
  path: string,
  data: RequestFormData
): HttpRequestPayload {
  const url = makeUrl(data.host, path, data?.parameters?.path);

  const headers = {
    "content-type": "application/json",
    ...data?.parameters?.header,
  };

  return {
    method,
    url,
    headers,
    body: data.requestBody,
  };
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
