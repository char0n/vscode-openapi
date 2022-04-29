import { createListenerMiddleware } from "@reduxjs/toolkit";
import { HostApplication } from "../types";
import { focus, scan } from "./oasSlice";

export default function createListener(host: HostApplication) {
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
      host.postMessage({ command: "scan", data: "blah" });
      console.log("me scanning here", action, listenerApi);
    },
  });

  return listenerMiddleware;
}
