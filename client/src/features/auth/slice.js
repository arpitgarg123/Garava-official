import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, signupApi, refreshApi, initiateGoogleAuth } from "./api";
import { syncGuestData } from "../../shared/utils/syncGuestData.js";

export const login = createAsyncThunk("auth/login", async (payload) => {
  const { data } = await loginApi(payload);
  return data; // { accessToken, user }
});

export const signup = createAsyncThunk("auth/signup", async (payload) => {
  const { data } = await signupApi(payload);
  return data; // may or may not include accessToken depending on backend
});

export const doLogout = createAsyncThunk("auth/logout", async () => {
  await logoutApi();
});

export const googleLogin = createAsyncThunk("auth/googleLogin", async () => {
  // This will redirect to Google OAuth, so we don't return anything here
  // The actual auth completion happens via callback URL
  initiateGoogleAuth();
  return null;
});

export const initAuth = createAsyncThunk("auth/init", async (_, { rejectWithValue }) => {
  try {
    // Try to refresh on app load to restore session - use reduced retry
    const { data } = await refreshApi();
    return data; // { accessToken, user? }
    
  } catch (error) {
    // If it's a 401 (no refresh token), this is normal for unauthenticated users
    if (error.response?.status === 401) {
      return rejectWithValue({ type: 'AUTH_EXPIRED', silent: true });
    }
    
    // For timeout errors, don't spam retries
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return rejectWithValue({ type: 'NETWORK_ERROR', message: 'Connection timeout', silent: true });
    }
    
    // For other errors, show more details
    return rejectWithValue({ 
      type: 'GENERAL_ERROR', 
      message: error.response?.data?.message || error.message || 'Authentication initialization failed',
      silent: false 
    });
  }
});

export const loginWithSync = createAsyncThunk("auth/loginWithSync", async (payload, { dispatch, rejectWithValue }) => {
  try {
    // First perform the login
    const loginResult = await dispatch(login(payload)).unwrap();
    
    // Then sync guest data if login was successful
    try {
      await dispatch(syncGuestData()).unwrap();
    } catch (syncError) {
      // Don't fail the login if sync fails, just log it
      console.warn('Guest data sync failed after login:', syncError);
    }
    
    return loginResult;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const slice = createSlice({
  name: "auth",
  initialState: { accessToken: null, user: null, status: "idle", error: null },
  reducers: {
    setToken: (s, { payload }) => { s.accessToken = payload || null; },
    setTokens: (s, { payload }) => {
      s.accessToken = payload?.accessToken || null;
      // Note: refreshToken is handled by HTTP-only cookies, not stored in Redux
    },
    setUser: (s, { payload }) => { s.user = payload || null; },
    logout: (s) => { s.accessToken = null; s.user = null; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.status = "loading"; s.error = null; });
    b.addCase(login.fulfilled, (s, { payload }) => {
      s.status = "succeeded";
      s.accessToken = payload?.accessToken || null;
      s.user = payload?.user || null;
    });
    b.addCase(login.rejected, (s, { error }) => {
      s.status = "failed";
      s.error = error?.message || "Login failed";
    });

    b.addCase(loginWithSync.pending, (s) => { s.status = "loading"; s.error = null; });
    b.addCase(loginWithSync.fulfilled, (s, { payload }) => {
      s.status = "succeeded";
      s.accessToken = payload?.accessToken || null;
      s.user = payload?.user || null;
    });
    b.addCase(loginWithSync.rejected, (s, { error }) => {
      s.status = "failed";
      s.error = error?.message || "Login failed";
    });

    b.addCase(signup.pending, (s) => { s.status = "loading"; s.error = null; });
    b.addCase(signup.fulfilled, (s, { payload }) => {
      s.status = "succeeded";
      // If backend returns token, set it; else keep null and UI will show next step
      if (payload?.accessToken) s.accessToken = payload.accessToken;
      if (payload?.user) s.user = payload.user;
    });
    b.addCase(signup.rejected, (s, { error }) => {
      s.status = "failed";
      s.error = error?.message || "Signup failed";
    });

    b.addCase(doLogout.fulfilled, (s) => { s.accessToken = null; s.user = null; });

    b.addCase(initAuth.fulfilled, (s, { payload }) => {
      s.accessToken = payload?.accessToken || null;
      if (payload?.user) s.user = payload.user;
      s.status = "succeeded";
      s.error = null;
    });
    
    b.addCase(initAuth.rejected, (s, { payload }) => {
      const errorData = payload || {};
      
      if (errorData.type === 'AUTH_EXPIRED') {
        // Token expired - clear auth state silently
        s.accessToken = null;
        s.user = null;
        s.status = "idle"; // Set to idle instead of failed
        s.error = null; // Don't show error for expired tokens
      } else if (errorData.type === 'NETWORK_ERROR') {
        // Network error - keep user authenticated, just log the issue
        s.status = "succeeded"; // Keep as succeeded to maintain auth state
        s.error = null; // Don't show error for network issues
      } else {
        // General error - clear auth state and show error
        s.accessToken = null;
        s.user = null;
        s.status = "failed";
        s.error = errorData.message || "Authentication failed";
      }
    });
    
    b.addCase(initAuth.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
  },
});

export const { setToken, setTokens, setUser, logout } = slice.actions;
export default slice.reducer;
