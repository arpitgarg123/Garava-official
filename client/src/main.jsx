import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.js";
import App from "./App.jsx";
import "./index.css";

import { bindAuth } from "./shared/api/http.js";
import { setToken, logout, initAuth } from "./features/auth/slice.js";
import ErrorBoundary from "./app/ErrorBoundary.jsx";

bindAuth({
  getToken: () => store.getState().auth?.accessToken,
  setToken: (t) => store.dispatch(setToken(t)),
  logout: () => store.dispatch(logout()),
});

// Bootstrap session (refresh cookie -> accessToken)
store.dispatch(initAuth());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
