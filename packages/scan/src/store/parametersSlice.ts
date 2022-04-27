import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OasParameter } from "@xliic/common/types-oas30";

export interface ParametersState {
  parameters: OasParameter[];
}

const initialState: ParametersState = {
  parameters: [],
};

export const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    showParameters: (state, action: PayloadAction<OasParameter[]>) => {
      state.parameters = action.payload;
    },
  },
});

export const { showParameters } = parametersSlice.actions;

export default parametersSlice.reducer;
