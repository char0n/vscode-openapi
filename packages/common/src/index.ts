import { find, Parsed, parseJsonPointer } from "@xliic/preserving-json-yaml-parser";
import { BundledOpenApiSpec } from "./types-bundled-oas30";
import { HttpMethod, OasOperation, OasParameter, OpenApiSpec } from "./types-oas30";

export function getPaths(oas: OpenApiSpec): string[] {
  return Object.keys(oas.paths).map((path) => parseJsonPointer(path).join("/"));
}

export function getOperation(
  oas: OpenApiSpec,
  path: string,
  method: HttpMethod
): OasOperation | undefined {
  // TODO ref
  return oas.paths[path][method];
}

export function getParameters(
  oas: BundledOpenApiSpec,
  path: string,
  method: HttpMethod
): OasParameter[] {
  const pathItem = oas.paths[path];
  const operation = pathItem?.[method];
  if (pathItem === undefined || operation == undefined) {
    return [];
  }

  const paramsOrRefs = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])];

  return paramsOrRefs.map((paramOrRef) => {
    if ("$ref" in paramOrRef) {
      return extractRef<OasParameter>(oas, paramOrRef.$ref);
    }
    return paramOrRef;
  });
}

function extractRef<T>(oas: BundledOpenApiSpec, ref: string): T {
  const target = find(oas as unknown as Parsed, ref);
  return target as T;
}
