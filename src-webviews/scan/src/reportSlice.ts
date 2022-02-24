import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { patch } from "semver";
import { ScanReport } from "./types";

export interface ReportState {
  display: "loading";
  summary: ScanReport["summary"];
  paths: ScanReport["paths"];
  focusedPaths: ScanReport["paths"];
}

const initialState: ReportState = {
  display: "loading",
  summary: {
    issues: 0,
  },
  paths: {},
  focusedPaths: {},
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    show: (state, action: PayloadAction<ScanReport>) => {
      state.summary = action.payload.summary;
      state.paths = action.payload.paths;
      state.focusedPaths = action.payload.paths;
    },
    focusOperation: (state, action: PayloadAction<{ path: string; method: string }>) => {
      const { path, method } = action.payload;
      const operation = state.paths[path][method];
      state.focusedPaths = { [path]: { [method]: operation } };
    },

    focusPath: (state, action: PayloadAction<string>) => {
      console.log("focus path", action.payload);
    },
  },
});

export const { show, focusOperation, focusPath } = reportSlice.actions;
export default reportSlice.reducer;
