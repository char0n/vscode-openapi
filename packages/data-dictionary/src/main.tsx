import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { HostApplication } from "./types";
import App from "./components/App";

import { initStore } from "./store/store";
import { changeTheme, ThemeState } from "@xliic/web-theme";
import { loadDictionaries } from "./store/formatsSlice";

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
      case "loadDictionaries":
        store.dispatch(loadDictionaries(message.dictionaries));
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
