import { BundledOpenApiSpec, getOperation } from "@xliic/common/oas30";
import { HttpMethod, HttpRequest } from "@xliic/common/http";
import { TryitOperationValues } from "@xliic/common/messages/tryit";
import { deref } from "@xliic/common/jsonpointer";
import { formatBody } from "./body";

export function makeHttpRequest(
  oas: BundledOpenApiSpec,
  method: HttpMethod,
  path: string,
  values: TryitOperationValues
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
