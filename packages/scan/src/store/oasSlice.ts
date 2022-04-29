import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { BundledOpenApiSpec, HttpMethod, ParametersMap } from "@xliic/common";

import {
  getOperation,
  getOperationParameters,
  getPathItemParameters,
  mergeParameters,
  getPath,
} from "@xliic/common";

export interface OasState {
  oas: BundledOpenApiSpec;
  path?: string;
  method?: HttpMethod;
  parameters: ParametersMap;
}

const initialState: OasState = {
  oas: {
    openapi: "3.0.0",
    info: { title: "", version: "0.0" },
    paths: {},
  },
  parameters: {
    query: [],
    header: [],
    path: [],
    cookie: [],
  },
};

export const parametersSlice = createSlice({
  name: "oas",
  initialState,
  reducers: {
    updateOas: (state, action: PayloadAction<BundledOpenApiSpec>) => {
      state.oas = action.payload;
    },
    scan: (state, action: PayloadAction<string>) => {},
    focus: (state, action: PayloadAction<{ path: string; method: HttpMethod }>) => {
      const { path, method } = action.payload;

      const pathItem = getPath(state.oas, path);
      const operation = getOperation(state.oas, path, method as HttpMethod);
      const pathParameters = pathItem ? getPathItemParameters(state.oas, pathItem) : [];
      const opParameters = operation ? getOperationParameters(state.oas, operation) : [];
      const parameters = mergeParameters(pathParameters, opParameters);

      state.path = path;
      state.method = method;
      state.parameters = parameters;
    },
  },
});

export const { updateOas, focus, scan } = parametersSlice.actions;

export default parametersSlice.reducer;
