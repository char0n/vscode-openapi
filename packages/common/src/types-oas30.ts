export interface OpenApiSpec {
  openapi: string;
  info: OasInfo;
  tags?: OasTag[];
  servers?: OasServer[];
  externalDocs?: OasExternalDocumentation;
  paths: Record<string, OasPathItem>;
  webhooks?: Record<string, OasPathItem>;
  components?: OasComponents;
  security?: OasSecurityRequirement[];
}

export interface OasComponents {
  schemas?: { [name: string]: RefOr<OasSchema> };
  responses?: { [name: string]: RefOr<OasResponse> };
  parameters?: { [name: string]: RefOr<OasParameter> };
  examples?: { [name: string]: RefOr<OasExample> };
  requestBodies?: { [name: string]: RefOr<OasRequestBody> };
  headers?: { [name: string]: RefOr<OasHeader> };
  securitySchemes?: { [name: string]: RefOr<OasSecurityScheme> };
  links?: { [name: string]: RefOr<OasLink> };
  callbacks?: { [name: string]: RefOr<OasCallback> };
}

export interface OasPathItem {
  summary?: string;
  description?: string;
  get?: OasOperation;
  put?: OasOperation;
  post?: OasOperation;
  delete?: OasOperation;
  options?: OasOperation;
  head?: OasOperation;
  patch?: OasOperation;
  trace?: OasOperation;

  servers?: OasServer[];
  parameters?: Array<RefOr<OasParameter>>;
  $ref?: string;
}

export interface OasOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: OasExternalDocumentation;
  operationId?: string;
  parameters?: Array<RefOr<OasParameter>>;
  requestBody?: RefOr<OasRequestBody>;
  responses: OasResponses;
  callbacks?: { [name: string]: RefOr<OasCallback> };
  deprecated?: boolean;
  security?: OasSecurityRequirement[];
  servers?: OasServer[];
}

export interface OasParameter {
  name: string;
  in?: OasParameterLocation;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: OasParameterStyle;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: RefOr<OasSchema>;
  example?: any;
  examples?: { [media: string]: RefOr<OasExample> };
  content?: { [media: string]: OasMediaType };
  encoding?: Record<string, OasEncoding>;
  const?: any;
}

export interface OasSchema {
  type?: string;
  properties?: { [name: string]: OasSchema };
  additionalProperties?: boolean | OasSchema;
  description?: string;
  default?: any;
  items?: OasSchema;
  required?: string[];
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  format?: string;
  externalDocs?: OasExternalDocumentation;
  discriminator?: OasDiscriminator;
  nullable?: boolean;
  oneOf?: OasSchema[];
  anyOf?: OasSchema[];
  allOf?: OasSchema[];
  not?: OasSchema;
  title?: string;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean | number;
  minimum?: number;
  exclusiveMinimum?: boolean | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  enum?: any[];
  example?: any;
  const?: string;
  contentEncoding?: string;
  contentMediaType?: string;
}

export interface OasServer {
  url: string;
  description?: string;
  variables?: { [name: string]: OasServerVariable };
}

export interface OasServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

export interface OasExternalDocumentation {
  description?: string;
  url: string;
}

export interface OasRequestBody {
  description?: string;
  required?: boolean;
  content: { [mime: string]: OasMediaType };
}

export interface OasResponses {
  [code: string]: RefOr<OasResponse>;
}

export interface OasResponse {
  description?: string;
  headers?: { [name: string]: RefOr<OasHeader> };
  content?: { [mime: string]: OasMediaType };
  links?: { [name: string]: RefOr<OasLink> };
}

export interface OasMediaType {
  schema?: RefOr<OasSchema>;
  example?: any;
  examples?: { [name: string]: RefOr<OasExample> };
  encoding?: { [field: string]: OasEncoding };
}

export interface OasLink {
  operationRef?: string;
  operationId?: string;
  parameters?: { [name: string]: any };
  requestBody?: any;
  description?: string;
  server?: OasServer;
}

export interface OasSecurityScheme {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect";
  description?: string;
  name?: string;
  in?: "query" | "header" | "cookie";
  scheme: string;
  bearerFormat: string;
  flows: {
    implicit?: {
      refreshUrl?: string;
      scopes: { [name: string]: string };
      authorizationUrl: string;
    };
    password?: {
      refreshUrl?: string;
      scopes: { [name: string]: string };
      tokenUrl: string;
    };
    clientCredentials?: {
      refreshUrl?: string;
      scopes: { [name: string]: string };
      tokenUrl: string;
    };
    authorizationCode?: {
      refreshUrl?: string;
      scopes: { [name: string]: string };
      tokenUrl: string;
    };
  };
  openIdConnectUrl?: string;
}

export interface OasSecurityRequirement {
  [name: string]: string[];
}

export interface OasExample {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface OasDiscriminator {
  propertyName: string;
  mapping?: { [name: string]: string };
}

export interface OasEncoding {
  contentType: string;
  headers?: { [name: string]: RefOr<OasHeader> };
  style: OasParameterStyle;
  explode: boolean;
  allowReserved: boolean;
}

export interface OasTag {
  name: string;
  description?: string;
  externalDocs?: OasExternalDocumentation;
}

export interface OasCallback {
  [name: string]: OasPathItem;
}

export interface OasInfo {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: OasContact;
  license?: OasLicense;
  version: string;
}

export interface OasContact {
  name?: string;
  url?: string;
  email?: string;
}

export interface OasLicense {
  name: string;
  url?: string;
  identifier?: string;
}

export type HttpMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace";

export type OasHeader = Omit<OasParameter, "in" | "name">;

export type OasParameterLocation = "query" | "header" | "path" | "cookie";

export type OasParameterStyle =
  | "matrix"
  | "label"
  | "form"
  | "simple"
  | "spaceDelimited"
  | "pipeDelimited"
  | "deepObject";

export interface OasRef {
  $ref: string;
}

export type RefOr<T> = OasRef | T;

export interface BundledOpenApiSpec extends OpenApiSpec {
  paths: Record<string, BundledOasPathItem>;
  webhooks?: Record<string, BundledOasPathItem>;
  components?: BundledOasComponents;
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
