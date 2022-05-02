import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { BundledOpenApiSpec } from "@xliic/common";

import { HostApplication } from "./types";
import App from "./components/App";

import { initStore } from "./store/store";
import { changeTheme, ThemeState } from "@xliic/web-theme";
import { updateOas, focus } from "./store/oasSlice";
import createListener from "./store/listener";

import "bootstrap/dist/css/bootstrap.min.css";

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
    const message = event.data;
    switch (message.command) {
      case "updateOas":
        store.dispatch(updateOas(message.oas as BundledOpenApiSpec));
        break;
      case "focus":
        store.dispatch(
          focus({ path: message.path, method: message.method, config: message.config })
        );
        break;
      case "changeTheme":
        store.dispatch(
          changeTheme({
            kind: message.kind,
            foreground: message.foreground,
            background: message.background,
          })
        );
        break;
    }
  });
}

(window as any).renderWebView = renderWebView;
