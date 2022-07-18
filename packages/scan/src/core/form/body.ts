import jsf from "json-schema-faker";

import {
  BundledOpenApiSpec,
  OasRequestBody,
  OasMediaType,
  OasOperation,
} from "@xliic/common/oas30";
import { TryitOperationBody } from "@xliic/common/messages/tryit";
import { deref } from "@xliic/common/jsonpointer";

export function createDefaultBody(
  oas: BundledOpenApiSpec,
  operation?: OasOperation,
  preferredMediaType?: string,
  preferredBodyValue?: unknown
): TryitOperationBody {
  const preferred = findPreferredBody(deref(oas, operation?.requestBody), preferredMediaType);

  if (!preferred) {
    return createBody(oas, "application/json", undefined);
  }

  return createBody(oas, preferred[0], preferred[1], preferredBodyValue);
}

export function createBody(
  oas: BundledOpenApiSpec,
  mediaType: string,
  mto?: OasMediaType,
  preferredBodyValue?: unknown
): TryitOperationBody {
  // use the preferred body value if it's provided
  if (preferredBodyValue !== undefined) {
    return { mediaType, value: preferredBodyValue };
  }

  // use example if available
  if (mto?.example) {
    return {
      mediaType,
      value: mto.example,
    };
  }

  // use any value from examples if available
  if (mto?.examples && Object.values(mto.examples).length > 0) {
    const example = Object.values(mto.examples)[0];
    return {
      mediaType,
      value: deref(oas, example)?.value ?? {},
    };
  }

  // generate value based on schema
  if (mto?.schema) {
    const schema = deref(oas, mto.schema);
    if (schema) {
      // FIXME should use? jsf.option("useExamplesValue", true);
      return {
        mediaType,
        value: jsf.generate(schema as any),
      };
    }
  }

  return {
    mediaType,
    value: "",
  };
}

export function serializeToFormText(body: TryitOperationBody): string {
  if (
    body.mediaType === "application/json" ||
    body.mediaType === "application/x-www-form-urlencoded"
  ) {
    return JSON.stringify(body.value, null, 2);
  }
  // text/plain
  return (body.value as any).toString();
}

export function parseFromFormText(mediaType: string, value: string): TryitOperationBody | Error {
  if (mediaType === "application/json" || mediaType === "application/x-www-form-urlencoded") {
    try {
      return {
        mediaType,
        value: JSON.parse(value),
      };
    } catch (e) {
      return new Error(`failed to convert: ${e}`);
    }
  }
  // text/plain
  return { mediaType, value };
}

function findPreferredBody(
  requestBody?: OasRequestBody,
  preferredMediaType?: string
): [string, OasMediaType] | undefined {
  if (!requestBody) {
    return undefined;
  }

  const preferredMediaTypes = ["application/json", "application/x-www-form-urlencoded"];
  if (preferredMediaType) {
    preferredMediaTypes.unshift(preferredMediaType);
  }

  for (const mediaType of preferredMediaTypes) {
    if (requestBody.content[mediaType]) {
      return [mediaType, requestBody.content[mediaType]];
    }
  }

  return undefined;
}
