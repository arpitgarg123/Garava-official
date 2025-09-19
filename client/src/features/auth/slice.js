import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, getProfileApi } from "../employees/api";
import { setAccessToken, clearAccessToken } from "../../shared/auth"; 

export const loginUser = createAsyncThunk("employee/login", async ({ email, password }, thunkAPI) => {
  try {
    const data = await loginApi(email, password);
    setAccessToken(data.token); 
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, thunkAPI) => {
//   try {
//     await logoutApi();
//     clearAccessToken();
//     return true;
//   } catch (error) {
//     return thunkAPI.rejectWithValue("Logout failed");
//   }
// });

// export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (id, thunkAPI) => {
//   try {
//     return await getProfileApi(id);
//   } catch (error) {
//     return thunkAPI.rejectWithValue("Failed to load profile");
//   }
// });

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.employee;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      // profile
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
