import {asyncHandler} from '../../shared/utils/asyncHandler.js';
import { loginUser, logoutUser, refreshSessionService, signupUser } from './auth.service.js';
import { clearAuthCookies, setAuthCookies } from './token.service.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await loginUser(email, password);

  setAuthCookies(res, accessToken, refreshToken);
  res.json({ accessToken, refreshToken, user });
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await signupUser({ name, email, password });

  res.status(201).json({
    message: 'User created successfully',
    user: newUser,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const userId = req.user?.id;

  const result = await logoutUser(userId, refreshToken);
  clearAuthCookies(res);
  res.json(result);
});
  
export const refreshSession = asyncHandler(async (req, res) => {
  const rawToken = req.cookies.refreshToken || req.body.refreshToken;

  const { accessToken, refreshToken } = await refreshSessionService(
    rawToken,
    res
  );

  res.json({
    success: true,
    accessToken,
    refreshToken,
  });
});