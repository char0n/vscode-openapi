import jsf from "json-schema-faker";

import {
  BundledOpenApiSpec,
  OasParameterLocation,
  OperationParametersMap,
  getPathItemParameters,
  getOperation,
  getOperationParameters,
  getParametersMap,
  OasRequestBody,
} from "@xliic/common/oas30";
import { OperationValues, ParameterValues } from "@xliic/common/messages/tryit";
import { HttpMethod } from "@xliic/common/http";

export function getParameters(
  oas: BundledOpenApiSpec,
  path: string,
  method: HttpMethod
): OperationParametersMap {
  const pathParameters = getPathItemParameters(oas, oas.paths[path]);
  const operation = getOperation(oas, path, method);
  const operationParameters = getOperationParameters(oas, operation);
  const result = getParametersMap(oas, pathParameters, operationParameters);
  return result;
}

export function generateParameterValues(parameters: OperationParametersMap): ParameterValues {
  const values: ParameterValues = {
    query: {},
    header: {},
    path: {},
    cookie: {},
  };

  const locations = Object.keys(parameters) as OasParameterLocation[];
  for (const location of locations) {
    for (const name of Object.keys(parameters[location])) {
      const parameter = parameters[location][name];
      if (parameter.schema) {
        values[location][name] = jsf.generate(parameter.schema as any);
      } else {
        values[location][name] = "";
      }
    }
  }

  return values;
}

export function wrapFormDefaults(values: OperationValues): Record<string, any> {
  const parameters: Record<string, any> = { query: {}, header: {}, path: {}, cookie: {} };
  const locations = Object.keys(values.parameters) as OasParameterLocation[];
  for (const location of locations) {
    for (const name of Object.keys(values.parameters[location])) {
      const value = values.parameters[location][name];
      parameters[location][name] = Array.isArray(value) ? wrap(value) : value;
    }
  }
  return {
    parameters,
    body: values.body,
    server: values.server,
  };
}

export function unwrapFormDefaults(
  oas: BundledOpenApiSpec,
  parameters: OperationParametersMap,
  values: Record<string, any>
): OperationValues {
  return {
    parameters: unwrapFormParameters(oas, parameters, values.parameters),
    body: values.body,
    server: values.server,
  };
}

export function unwrapFormParameters(
  oas: BundledOpenApiSpec,
  parameters: OperationParametersMap,
  values: Record<string, any>
): ParameterValues {
  const result: ParameterValues = { query: {}, header: {}, path: {}, cookie: {} };
  const locations = Object.keys(values) as OasParameterLocation[];
  for (const location of locations) {
    for (const name of Object.keys(values[location])) {
      const value = values[location][name];
      const parameter = parameters[location][name];
      result[location][name] = Array.isArray(value) ? unwrap(value) : value;
    }
  }
  return result;
}

// arrays must be wrapped for react form hook
function wrap(array: unknown[]): unknown {
  return array.map((value) => ({ value }));
}

function unwrap(array: unknown[]): unknown {
  return array.map((element) => (element as any)["value"]);
}
