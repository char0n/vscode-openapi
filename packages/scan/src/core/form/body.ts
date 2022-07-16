import jsf from "json-schema-faker";

import {
  BundledOpenApiSpec,
  OasRequestBody,
  getOperation,
  OasMediaType,
  OasOperation,
} from "@xliic/common/oas30";
import { HttpMethod } from "@xliic/common/http";
import { OperationBody } from "@xliic/common/messages/tryit";
import { deref } from "@xliic/common/jsonpointer";

export function createDefaultBody(
  oas: BundledOpenApiSpec,
  operation?: OasOperation
): OperationBody {
  const preferred = findPreferredBody(deref(oas, operation?.requestBody));

  if (!preferred) {
    return createBody(oas, "application/json", undefined);
  }

  return createBody(oas, preferred[0], preferred[1]);
}

function findPreferredBody(requestBody?: OasRequestBody): [string, OasMediaType] | undefined {
  if (!requestBody) {
    return undefined;
  }

  const preferredMediaTypes = ["application/json", "application/x-www-form-urlencoded"];
  for (const mediaType of preferredMediaTypes) {
    if (requestBody.content[mediaType]) {
      return [mediaType, requestBody.content[mediaType]];
    }
  }

  return undefined;
}

export function createBody(
  oas: BundledOpenApiSpec,
  mediaType: string,
  mto?: OasMediaType
): OperationBody {
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
