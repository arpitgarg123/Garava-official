// Auth selectors
export const selectAuthState = (state) => state.auth;
export const selectUser = (state) => state.auth?.user;
export const selectAccessToken = (state) => state.auth?.accessToken;
export const selectIsAuthenticated = (state) => Boolean(state.auth?.accessToken && state.auth?.user);
export const selectAuthStatus = (state) => state.auth?.status || 'idle';
export const selectAuthError = (state) => state.auth?.error;
export const selectIsAuthLoading = (state) => state.auth?.status === 'loading';

// User role selectors
export const selectUserRole = (state) => state.auth?.user?.role;
export const selectIsAdmin = (state) => state.auth?.user?.role === 'admin';
export const selectIsUser = (state) => state.auth?.user?.role === 'user';

// User info selectors
export const selectUserName = (state) => state.auth?.user?.name;
export const selectUserEmail = (state) => state.auth?.user?.email;
export const selectIsEmailVerified = (state) => state.auth?.user?.isVerified;