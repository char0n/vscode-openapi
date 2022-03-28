import {
  OasCallback,
  OasExample,
  OasExternalDocumentation,
  OasHeader,
  OasInfo,
  OasLink,
  OasParameter,
  OasPathItem,
  OasRequestBody,
  OasResponse,
  OasSchema,
  OasSecurityRequirement,
  OasSecurityScheme,
  OasServer,
  OasTag,
} from "./types-oas30";

export interface BundledOpenApiSpec {
  openapi: string;
  info: OasInfo;
  tags?: OasTag[];
  servers?: OasServer[];
  externalDocs?: OasExternalDocumentation;
  paths: Record<string, BundledOasPathItem>;
  webhooks?: Record<string, BundledOasPathItem>;
  components?: BundledOasComponents;
  security?: OasSecurityRequirement[];
}

export interface BundledOasComponents {
  schemas?: Record<string, OasSchema>;
  responses?: Record<string, OasResponse>;
  parameters?: Record<string, OasParameter>;
  examples?: Record<string, OasExample>;
  requestBodies?: Record<string, OasRequestBody>;
  headers?: Record<string, OasHeader>;
  securitySchemes?: Record<string, OasSecurityScheme>;
  links?: Record<string, OasLink>;
  callbacks?: Record<string, OasCallback>;
}

export type BundledOasPathItem = Omit<OasPathItem, "$ref">;
