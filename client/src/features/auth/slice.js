import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, signupApi, refreshApi, initiateGoogleAuth } from "./api";

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
  console.log('Auth slice - Initializing authentication...');
  
  try {
    // Try to refresh on app load to restore session - use reduced retry
    const { data } = await refreshApi();
    console.log('Auth slice - InitAuth successful:', { hasToken: !!data?.accessToken, hasUser: !!data?.user });
    return data; // { accessToken, user? }
    
  } catch (error) {
    // If it's a 401 (no refresh token), this is normal for unauthenticated users
    if (error.response?.status === 401) {
      console.log('Auth slice - No valid refresh token found, proceeding as unauthenticated');
      return rejectWithValue({ type: 'AUTH_EXPIRED', silent: true });
    }
    
    // For timeout errors, don't spam retries
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn('Auth slice - Network timeout during auth init, proceeding as unauthenticated');
      return rejectWithValue({ type: 'NETWORK_ERROR', message: 'Connection timeout', silent: true });
    }
    
    // For other errors, show more details
    console.error('Auth slice - InitAuth failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    return rejectWithValue({ 
      type: 'GENERAL_ERROR', 
      message: error.response?.data?.message || error.message || 'Authentication initialization failed',
      silent: false 
    });
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
      console.log('Auth slice - initAuth fulfilled:', { 
        hasToken: !!s.accessToken, 
        hasUser: !!s.user, 
        userName: s.user?.name 
      });
    });
    
    b.addCase(initAuth.rejected, (s, { payload }) => {
      const errorData = payload || {};
      
      if (errorData.type === 'AUTH_EXPIRED') {
        // Token expired - clear auth state silently
        s.accessToken = null;
        s.user = null;
        s.status = "idle"; // Set to idle instead of failed
        s.error = null; // Don't show error for expired tokens
        console.log('Auth slice - Token expired, cleared auth state silently');
      } else if (errorData.type === 'NETWORK_ERROR') {
        // Network error - keep user authenticated, just log the issue
        s.status = "succeeded"; // Keep as succeeded to maintain auth state
        s.error = null; // Don't show error for network issues
        console.warn('Auth slice - Network error during init, keeping user authenticated');
      } else {
        // General error - clear auth state and show error
        s.accessToken = null;
        s.user = null;
        s.status = "failed";
        s.error = errorData.message || "Authentication failed";
        console.error('Auth slice - initAuth failed:', errorData.message);
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
