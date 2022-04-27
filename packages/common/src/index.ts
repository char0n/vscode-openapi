import { find, Parsed, parseJsonPointer } from "@xliic/preserving-json-yaml-parser";
import { Segment } from "jsonc-parser";
import { BundledOpenApiSpec } from "./types-bundled-oas30";
import {
  BundledOasPathItem,
  HttpMethod,
  OasOperation,
  OasParameter,
  OasPathItem,
  OpenApiSpec,
} from "./types-oas30";

export function getPaths(oas: BundledOpenApiSpec): string[] {
  return Object.keys(oas.paths).map((path) => parseJsonPointer(path).join("/"));
}

export function getPath(oas: BundledOpenApiSpec, path: Segment): BundledOasPathItem | undefined {
  // TODO ref
  return oas.paths[path];
}

export function getOperation(
  oas: OpenApiSpec,
  path: Segment,
  method: HttpMethod
): OasOperation | undefined {
  // TODO ref
  return oas.paths[path][method];
}

export function getPathItemParameters(
  oas: BundledOpenApiSpec,
  pathItem: OasPathItem
): OasParameter[] {
  const paramsOrRefs = pathItem.parameters ?? [];

  return paramsOrRefs.map((paramOrRef) => {
    if ("$ref" in paramOrRef) {
      return extractRef<OasParameter>(oas, paramOrRef.$ref);
    }
    return paramOrRef;
  });
}

export function getOperationParameters(
  oas: BundledOpenApiSpec,
  operation: OasOperation
): OasParameter[] {
  const paramsOrRefs = operation.parameters ?? [];

  return paramsOrRefs.map((paramOrRef) => {
    if ("$ref" in paramOrRef) {
      return extractRef<OasParameter>(oas, paramOrRef.$ref);
    }
    return paramOrRef;
  });
}

export function mergeParameters(path: OasParameter[], operation: OasParameter[]) {
  // TODO override path parameters with operation parameters
  return [...path, ...operation];
}

function extractRef<T>(oas: BundledOpenApiSpec, ref: string): T {
  const target = find(oas as unknown as Parsed, ref);
  return target as T;
}
