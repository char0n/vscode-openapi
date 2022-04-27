import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { OasParameter } from "@xliic/common/types-oas30";

import { HostApplication } from "./types";
import App from "./components/App";

import { initStore } from "./store/store";
import { changeTheme, ThemeState } from "@xliic/web-theme";
import { showParameters } from "./store/parametersSlice";

import "bootstrap/dist/css/bootstrap.min.css";

function renderWebView(host: HostApplication, theme: ThemeState) {
  const store = initStore(host, theme);

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
      case "showParameters":
        store.dispatch(showParameters(message.parameters as OasParameter[]));
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
