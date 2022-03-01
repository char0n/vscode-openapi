import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { initStore } from "./store";
import { focusPath, focusOperation, show } from "./reportSlice";
import { changeTheme, ThemeState } from "./themeSlice";
import { HostApplication } from "./types";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./components/App";

function renderScanReport(host: HostApplication, theme: ThemeState) {
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
      case "show":
        window.scrollTo(0, 0);
        store.dispatch(show(message.report));
        break;
      case "focusOperation":
        window.scrollTo(0, 0);
        store.dispatch(focusOperation({ path: message.path, method: message.method }));
        break;
      case "focusPath":
        window.scrollTo(0, 0);
        store.dispatch(focusPath(message.path));
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

(window as any).renderScanReport = renderScanReport;
