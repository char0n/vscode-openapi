import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BundledOpenApiSpec,
  HttpMethod,
  OasRequestBody,
  OperationParametersMap,
  getOperation,
  getOperationParameters,
  getPathItemParameters,
  mergeParameters,
} from "@xliic/common/oas30";
import { deref } from "@xliic/common/jsonpointer";
import {
  CurlPayload,
  HttpRequestPayload,
  ScanConfig,
  ShowPayload,
} from "@xliic/common/messages/scan";

export interface OasState {
  page: "loading" | "request" | "response" | "error";
  oas: BundledOpenApiSpec;
  path?: string;
  method?: HttpMethod;
  parameters: OperationParametersMap;
  config: ScanConfig;
  requestBody?: OasRequestBody;
  response?: any;
  error?: any;
}

const initialState: OasState = {
  page: "loading",
  oas: {
    openapi: "3.0.0",
    info: { title: "", version: "0.0" },
    paths: {},
  },
  parameters: {
    query: {},
    header: {},
    path: {},
    cookie: {},
  },
  config: {
    host: "",
    parameters: {
      query: {},
      header: {},
      path: {},
      cookie: {},
    },
  },
  response: undefined,
  error: undefined,
};

export const parametersSlice = createSlice({
  name: "oas",
  initialState,
  reducers: {
    show: (state, action: PayloadAction<ShowPayload>) => {
      const { oas, path, method, config } = action.payload;

      const pathParameters = getPathItemParameters(oas, oas.paths[path]);
      const operation = getOperation(oas, path, method);
      const operationParameters = getOperationParameters(oas, operation);
      const parameters = mergeParameters(oas, pathParameters, operationParameters);

      state.page = "request";
      state.oas = oas;
      state.path = path;
      state.method = method;
      state.parameters = parameters;
      state.requestBody = deref(state.oas, operation?.requestBody);
      state.config = config;
    },

    showResponse: (state, action: PayloadAction<any>) => {
      state.page = "response";
      state.response = action.payload;
    },

    showError: (state, action: PayloadAction<{ message: string }>) => {
      state.page = "error";
      state.error = action.payload;
    },

    goToPage: (state, action: PayloadAction<OasState["page"]>) => {
      state.page = action.payload;
    },

    // for listeners
    sendRequest: (state, action: PayloadAction<HttpRequestPayload>) => {},
    sendRequestCurl: (state, action: PayloadAction<CurlPayload>) => {},
  },
});

export const { show, showResponse, showError, goToPage, sendRequest, sendRequestCurl } =
  parametersSlice.actions;

export default parametersSlice.reducer;
