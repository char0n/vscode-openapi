import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import themeReducer, { ThemeState } from "@xliic/web-theme";
import parametersReducer from "./parametersSlice";
import { HostApplication } from "../types";

const reducer = {
  theme: themeReducer,
  parameters: parametersReducer,
};

export const initStore = (hostApplication: HostApplication, theme: ThemeState) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: hostApplication,
        },
      }),
    preloadedState: {
      theme,
    },
  });

export type RootState = StateFromReducersMapObject<typeof reducer>;
export type AppDispatch = ReturnType<typeof initStore>["dispatch"];
