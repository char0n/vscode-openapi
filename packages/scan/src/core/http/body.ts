import { BundledOpenApiSpec, OasRequestBody } from "@xliic/common/oas30";
import { TryitOperationBody } from "@xliic/common/messages/tryit";

type BodyFormatter = (
  body: TryitOperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
) => unknown;

const bodyFormatters: Record<string, BodyFormatter> = {
  "application/json": formatBodyJson,
  "application/x-www-form-urlencoded": formatBodyUrlEncoded,
};

export function formatBody(
  body: TryitOperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
): unknown {
  return bodyFormatters[body.mediaType](body, oas, requestBody);
}

export function formatBodyJson(
  body: TryitOperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
): unknown {
  return JSON.stringify(body.value);
}

export function formatBodyUrlEncoded(
  body: TryitOperationBody,
  oas: BundledOpenApiSpec,
  requestBody?: OasRequestBody
): unknown {
  return Object.entries(body.value as object)
    .map(([name, value]) => `${name}=${value}`)
    .join("&");
}
