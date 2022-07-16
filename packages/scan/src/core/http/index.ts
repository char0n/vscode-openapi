import { BundledOpenApiSpec, OasRequestBody, getOperation } from "@xliic/common/oas30";
import { HttpMethod, HttpRequest } from "@xliic/common/http";
import { OperationBody, OperationValues } from "@xliic/common/messages/tryit";
import { deref } from "@xliic/common/jsonpointer";

export function makeHttpRequest(
  oas: BundledOpenApiSpec,
  method: HttpMethod,
  path: string,
  values: OperationValues
): HttpRequest {
  const operation = getOperation(oas, path, method);
  const requestBody = deref(oas, operation?.requestBody);

  const url = makeUrl(values.server, path, values?.parameters?.path);

  const headers: Record<string, string> = {};
  let body: unknown | undefined = undefined;

  if (values.body) {
    headers["content-type"] = values.body.mediaType;
    body = formatBody(values.body, oas, requestBody);
  }

  // FIXME add query string handling
  // FIXME add cookie params handling

  return {
    method,
    url,
    headers: { ...headers, ...(values.parameters?.header as HttpRequest["headers"]) },
    body,
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

type BodyFormatter = (
  body: OperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
) => unknown;

const bodyFormatters: Record<string, BodyFormatter> = {
  "application/json": formatBodyJson,
  "application/x-www-form-urlencoded": formatBodyUrlEncoded,
};

export function formatBody(
  body: OperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
): unknown {
  return bodyFormatters[body.mediaType](body, oas, requestBody);
}

export function formatBodyJson(
  body: OperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
): unknown {
  return JSON.stringify(body.value);
}

export function formatBodyUrlEncoded(
  body: OperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
): unknown {
  return Object.entries(body.value as object)
    .map(([name, value]) => `${name}=${value}`)
    .join("&");
}
