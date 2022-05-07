import { createListenerMiddleware } from "@reduxjs/toolkit";
import { HostApplication } from "../types";
import { sendRequest, sendRequestCurl } from "./oasSlice";

export default function createListener(host: HostApplication) {
  const listenerMiddleware = createListenerMiddleware();

  listenerMiddleware.startListening({
    actionCreator: sendRequest,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "sendRequest", payload: action.payload });
    },
  });

  listenerMiddleware.startListening({
    actionCreator: sendRequestCurl,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "sendCurl", payload: action.payload });
    },
  });

  return listenerMiddleware;
}
