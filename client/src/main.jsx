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
import { tokenRefreshManager } from "./shared/auth/tokenRefreshManager.js";

bindAuth({
  getToken: () => store.getState().auth?.accessToken,
  setToken: (t) => store.dispatch(setToken(t)),
  logout: () => {
    tokenRefreshManager.stop(); // Stop refresh timer on logout
    store.dispatch(logout());
  },
});

// Initialize token refresh manager
tokenRefreshManager.init(store);

// Subscribe to auth state changes to manage token refresh
let previousAuthState = null;
store.subscribe(() => {
  const state = store.getState();
  const { accessToken, user } = state.auth;
  
  // Only react to actual auth state changes, not every state change
  const currentAuthState = { accessToken, userId: user?.id };
  const authStateChanged = JSON.stringify(currentAuthState) !== JSON.stringify(previousAuthState);
  
  if (authStateChanged) {
    previousAuthState = currentAuthState;
    
    if (accessToken && user) {
      // Start refresh cycle when user is authenticated
      console.log('Store subscriber - User authenticated, starting token refresh cycle');
      tokenRefreshManager.startRefreshCycle(accessToken);
    } else {
      // Stop refresh cycle when user is logged out
      console.log('Store subscriber - User not authenticated, stopping token refresh cycle');
      tokenRefreshManager.stop();
    }
  }
});

// Bootstrap session (refresh cookie -> accessToken)
console.log('Main.jsx - Dispatching initAuth on app bootstrap');
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
