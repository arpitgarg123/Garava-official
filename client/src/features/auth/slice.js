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

export const initAuth = createAsyncThunk("auth/init", async () => {
  // Try to refresh on app load to restore session
  const { data } = await refreshApi();
  return data; // { accessToken, user? }
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
    });
  },
});

export const { setToken, setUser, logout } = slice.actions;
export default slice.reducer;
