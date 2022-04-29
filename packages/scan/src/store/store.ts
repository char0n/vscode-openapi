import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import logger from "redux-logger";

import themeReducer, { ThemeState } from "@xliic/web-theme";
import oasSlice from "./oasSlice";
import type { HostApplication } from "../types";

const reducer = {
  theme: themeReducer,
  oas: oasSlice,
};

export const initStore = (hostApplication: HostApplication, theme: ThemeState) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: hostApplication,
        },
      }).concat(logger),
    preloadedState: {
      theme,
    },
  });

export type RootState = StateFromReducersMapObject<typeof reducer>;
export type AppDispatch = ReturnType<typeof initStore>["dispatch"];
