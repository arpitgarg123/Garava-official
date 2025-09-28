import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, signupApi, refreshApi } from "./api";

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

export const initAuth = createAsyncThunk("auth/init", async (_, { rejectWithValue }) => {
  const maxRetries = 2;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Auth slice - Initializing authentication (attempt ${attempt}/${maxRetries})...`);
      
      // Try to refresh on app load to restore session
      const { data } = await refreshApi();
      console.log('Auth slice - InitAuth successful:', { hasToken: !!data?.accessToken, hasUser: !!data?.user });
      return data; // { accessToken, user? }
      
    } catch (error) {
      lastError = error;
      const isNetworkError = error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('Network Error');
      const isServerError = error.response?.status >= 500;
      
      console.error(`Auth slice - InitAuth attempt ${attempt} failed:`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        isNetworkError,
        isServerError
      });
      
      // Only retry on network errors or server errors, not on auth failures (401, 403)
      if ((isNetworkError || isServerError) && attempt < maxRetries) {
        console.log(`Auth slice - Retrying in ${attempt * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Progressive delay
        continue;
      }
      
      // If it's a client error (401, 403) or we've exhausted retries, handle appropriately
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Auth failure - token is invalid/expired, but don't show error to user
        console.log('Auth slice - Token expired/invalid, will proceed as unauthenticated');
        return rejectWithValue({ type: 'AUTH_EXPIRED', silent: true });
      }
      
      if (isNetworkError) {
        // Network timeout - don't logout user, just show warning
        console.warn('Auth slice - Network timeout during auth init, keeping user authenticated');
        return rejectWithValue({ type: 'NETWORK_ERROR', message: 'Connection timeout', silent: false });
      }
      
      break; // Exit retry loop for non-retryable errors
    }
  }
  
  const errorMessage = lastError?.response?.data?.message || lastError?.message || 'Authentication initialization failed';
  return rejectWithValue({ type: 'GENERAL_ERROR', message: errorMessage, silent: false });
});

const slice = createSlice({
  name: "auth",
  initialState: { accessToken: null, user: null, status: "idle", error: null },
  reducers: {
    setToken: (s, { payload }) => { s.accessToken = payload || null; },
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

export const { setToken, setUser, logout } = slice.actions;
export default slice.reducer;
