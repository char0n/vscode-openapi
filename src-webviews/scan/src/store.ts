import { configureStore, StateFromReducersMapObject } from "@reduxjs/toolkit";
import reportReducer from "./reportSlice";
import themeReducer, { ThemeState } from "./themeSlice";
import { HostApplication } from "./types";

const reducer = {
  report: reportReducer,
  theme: themeReducer,
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
