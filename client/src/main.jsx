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
import { initializeGuestMode, shouldInitializeGuestMode } from "./shared/utils/guestModeInit.js";

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
      tokenRefreshManager.startRefreshCycle(accessToken);
    } else {
      // Stop refresh cycle when user is logged out
      tokenRefreshManager.stop();
    }
  }
});

// Bootstrap session (refresh cookie -> accessToken)
// Initialize authentication on app startup
store.dispatch(initAuth()).then((result) => {
  // If auth initialization fails or user is not authenticated, initialize guest mode
  if (result.type === 'auth/init/rejected' || !store.getState().auth.accessToken) {
    setTimeout(() => {
      const authState = store.getState().auth;
      if (shouldInitializeGuestMode(authState)) {
        initializeGuestMode(store.dispatch, store.getState);
      }
    }, 100); // Small delay to ensure auth state is settled
  }
}).catch(error => {
  console.error('Auth initialization error:', error);
});

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
