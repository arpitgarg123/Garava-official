import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store.js";
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
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
