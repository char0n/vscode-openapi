import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { ThemeRequests } from "@xliic/common/messages/theme";
import { ScanRequests } from "@xliic/common/messages/scan";

import App from "./components/App";

import { initStore } from "./store/store";
import { changeTheme, ThemeState } from "@xliic/web-theme";
import {
  showResponse,
  showError,
  scanOperation,
  tryOperation,
  curlOperation,
} from "./store/oasSlice";
import createListener from "./store/listener";
import { HostApplication } from "./types";

import "bootstrap/dist/css/bootstrap.min.css";

type WebAppRequest = ThemeRequests | ScanRequests;

const requestHandlers: Record<WebAppRequest["command"], Function> = {
  changeTheme,
  scanOperation,
  tryOperation,
  curlOperation,
  showResponse,
  showError,
};

function renderWebView(host: HostApplication, theme: ThemeState) {
  const store = initStore(createListener(host), theme);

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );

  window.addEventListener("message", (event) => {
    const { command, payload } = event.data as WebAppRequest;
    const handler = requestHandlers[command];
    if (handler) {
      store.dispatch(handler(payload));
    } else {
      throw new Error(`Unable to find handler for command: ${command}`);
    }
  });
}

(window as any).renderWebView = renderWebView;
