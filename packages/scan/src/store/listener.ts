import { createListenerMiddleware } from "@reduxjs/toolkit";
import { HostApplication } from "../types";
import { sendRequest, createSchema, sendRequestCurl, updateScanConfig } from "./oasSlice";

export default function createListener(host: HostApplication) {
  const listenerMiddleware = createListenerMiddleware();

  listenerMiddleware.startListening({
    actionCreator: sendRequest,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "sendRequest", payload: action.payload.request });
    },
  });

  listenerMiddleware.startListening({
    actionCreator: createSchema,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "createSchema", payload: action.payload.response });
    },
  });

  listenerMiddleware.startListening({
    actionCreator: sendRequestCurl,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "sendCurl", payload: action.payload });
    },
  });

  listenerMiddleware.startListening({
    actionCreator: updateScanConfig,
    effect: async (action, listenerApi) => {
      host.postMessage({ command: "updateScanConfig", payload: action.payload });
    },
  });

  return listenerMiddleware;
}
