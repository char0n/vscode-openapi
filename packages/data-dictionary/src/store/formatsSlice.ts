import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataDictionary, DataFormat, FlattenedDataFormat } from "../types";

export interface FullDataDictionary extends DataDictionary {
  formats: {
    [name: string]: DataFormat;
  };
}

export interface FormatsState {
  dictionaries: DataDictionary[];
  formats: FlattenedDataFormat[];
}

const initialState: FormatsState = {
  dictionaries: [],
  formats: [],
};

export const formatsSlice = createSlice({
  name: "formats",
  initialState,
  reducers: {
    loadDictionaries: (state, action: PayloadAction<FullDataDictionary[]>) => {
      const dictionaries: DataDictionary[] = [];
      const formats: FlattenedDataFormat[] = [];

      for (const dict of action.payload) {
        dictionaries.push({
          id: dict.id,
          name: dict.name,
          description: dict.description,
        });
        for (const format of Object.values(dict.formats)) {
          formats.push({
            ...format,
            dictionaryId: dict.id,
          });
        }
      }

      state.dictionaries = dictionaries;
      state.formats = formats;
    },
  },
});

export const { loadDictionaries } = formatsSlice.actions;

export default formatsSlice.reducer;
