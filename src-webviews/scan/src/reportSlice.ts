import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { patch } from "semver";
import { ScanReport } from "./types";

export interface ReportState {
  display: "loading";
  summary: ScanReport["summary"];
  report: ScanReport["report"];
  filter?: { path?: string; method?: string };
  filteredReport: ScanReport["report"];
}

const initialState: ReportState = {
  display: "loading",
  summary: {
    issues: 0,
  },
  report: [],
  filteredReport: [],
};

export const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    show: (state, action: PayloadAction<ScanReport>) => {
      console.log("sho", action);
      state.filter = undefined;
      state.summary = action.payload.summary;
      state.report = action.payload.report;
      state.filteredReport = action.payload.report;
    },
    focusOperation: (state, action: PayloadAction<{ path: string; method: string }>) => {
      const { path, method } = action.payload;
      state.filter = { path, method };
      state.filteredReport = state.report.filter((or) => or.path === path && or.method === method);
    },

    focusPath: (state, action: PayloadAction<string>) => {
      state.filter = { path: action.payload };
      console.log("fo pa", action.payload);
      state.filteredReport = state.report.filter((or) => or.path === action.payload);
    },
  },
});

export const { show, focusOperation, focusPath } = reportSlice.actions;
export default reportSlice.reducer;
