import {
  configureStore,
  createListenerMiddleware,
  StateFromReducersMapObject,
} from "@reduxjs/toolkit";
import logger from "redux-logger";

import themeReducer, { ThemeState } from "@xliic/web-theme";
import oasSlice, { focus, scan } from "./oasSlice";
import type { HostApplication } from "../types";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: focus,
  effect: async (action, listenerApi) => {
    console.log("me here", action, listenerApi);
  },
});

listenerMiddleware.startListening({
  actionCreator: scan,
  effect: async (action, listenerApi) => {
    console.log("me scanning here", action, listenerApi);
  },
});

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
      })
        .prepend(listenerMiddleware.middleware)
        .concat(logger),
    preloadedState: {
      theme,
    },
  });

export type RootState = StateFromReducersMapObject<typeof reducer>;
export type AppDispatch = ReturnType<typeof initStore>["dispatch"];
