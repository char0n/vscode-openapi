import { createListenerMiddleware } from "@reduxjs/toolkit";
import { HostApplication } from "../types";
import { focus, scan } from "./oasSlice";

export default function createListener(host: HostApplication) {
  const listenerMiddleware = createListenerMiddleware();

  listenerMiddleware.startListening({
    actionCreator: focus,
    effect: async (action, listenerApi) => {
      //console.log("focused", action);
    },
  });

  listenerMiddleware.startListening({
    actionCreator: scan,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "scan", data: action.payload });
      //console.log("me scanning here", action, listenerApi);
    },
  });

  return listenerMiddleware;
}
