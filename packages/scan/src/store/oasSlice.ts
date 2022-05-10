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
  HttpResponsePayload,
  HttpErrorPayload,
  ScanConfig,
  ShowPayload,
  UpdateScanConfigPayload,
} from "@xliic/common/messages/scan";

type PageName =
  | "loading"
  | "scanOperation"
  | "scanConfiguration"
  | "scanReport"
  | "tryOperation"
  | "curlOperation"
  | "response"
  | "error";

export interface OasState {
  page: PageName;
  oas: BundledOpenApiSpec;
  path?: string;
  method?: HttpMethod;
  parameters: OperationParametersMap;
  config: ScanConfig;
  requestBody?: OasRequestBody;
  response?: HttpResponsePayload;
  error?: HttpErrorPayload;
  scanReport: any;
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
  scanReport: undefined,
};

export const parametersSlice = createSlice({
  name: "oas",
  initialState,
  reducers: {
    scanOperation: (state, action: PayloadAction<ShowPayload>) => {
      const { oas, path, method, config } = action.payload;

      const pathParameters = getPathItemParameters(oas, oas.paths[path]);
      const operation = getOperation(oas, path, method);
      const operationParameters = getOperationParameters(oas, operation);
      const parameters = mergeParameters(oas, pathParameters, operationParameters);

      state.page = "scanOperation";
      state.oas = oas;
      state.path = path;
      state.method = method;
      state.parameters = parameters;
      state.requestBody = deref(state.oas, operation?.requestBody);
      state.config = config;
    },

    tryOperation: (state, action: PayloadAction<ShowPayload>) => {
      const { oas, path, method, config } = action.payload;

      const pathParameters = getPathItemParameters(oas, oas.paths[path]);
      const operation = getOperation(oas, path, method);
      const operationParameters = getOperationParameters(oas, operation);
      const parameters = mergeParameters(oas, pathParameters, operationParameters);

      state.page = "tryOperation";
      state.oas = oas;
      state.path = path;
      state.method = method;
      state.parameters = parameters;
      state.requestBody = deref(state.oas, operation?.requestBody);
      state.config = config;
    },

    curlOperation: (state, action: PayloadAction<ShowPayload>) => {
      const { oas, path, method, config } = action.payload;

      const pathParameters = getPathItemParameters(oas, oas.paths[path]);
      const operation = getOperation(oas, path, method);
      const operationParameters = getOperationParameters(oas, operation);
      const parameters = mergeParameters(oas, pathParameters, operationParameters);

      state.page = "curlOperation";
      state.oas = oas;
      state.path = path;
      state.method = method;
      state.parameters = parameters;
      state.requestBody = deref(state.oas, operation?.requestBody);
      state.config = config;
    },

    showScanReport: (state, action: PayloadAction<any>) => {
      state.page = "scanReport";
      state.scanReport = action.payload;
    },

    showResponse: (state, action: PayloadAction<HttpResponsePayload>) => {
      state.page = "response";
      state.response = action.payload;
    },

    showError: (state, action: PayloadAction<HttpErrorPayload>) => {
      state.page = "error";
      state.error = action.payload;
    },

    goToPage: (state, action: PayloadAction<OasState["page"]>) => {
      state.page = action.payload;
    },

    // for listeners
    sendRequest: (state, action: PayloadAction<HttpRequestPayload>) => {},
    sendRequestCurl: (state, action: PayloadAction<CurlPayload>) => {},
    updateScanConfig: (state, action: PayloadAction<UpdateScanConfigPayload>) => {},
  },
});

export const {
  scanOperation,
  tryOperation,
  curlOperation,
  showResponse,
  showError,
  goToPage,
  sendRequest,
  sendRequestCurl,
  updateScanConfig,
  showScanReport,
} = parametersSlice.actions;

export default parametersSlice.reducer;
