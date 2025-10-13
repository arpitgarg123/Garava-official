import {asyncHandler} from '../../shared/utils/asyncHandler.js';
import { forgotPasswordService, loginUser, logoutUser, refreshSessionService, resendVerificationService, resetPasswordService, signupUser, verifyEmailService, googleAuthService } from './auth.service.js';
import { clearAuthCookies, setAuthCookies } from './token.service.js';
import passport from '../../config/passport.js';

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
  const refreshToken = req.cookies?.refreshToken;
  const userId = req.user?.id;

  const result = await logoutUser(userId, refreshToken);
  clearAuthCookies(res);
  res.json(result);
});
  
export const refreshSession = asyncHandler(async (req, res) => {
  try {
    let token = null;
    let tokenSource = 'none';
    
    // Extract token with better validation
    if (req.cookies?.refreshToken && req.cookies.refreshToken.trim()) {
      token = req.cookies.refreshToken.trim();
      tokenSource = 'cookies';
    } else if (req.body?.refreshToken && req.body.refreshToken.trim()) {
      token = req.body.refreshToken.trim();
      tokenSource = 'body';
    }
    
    console.log('Refresh session attempt:', {
      tokenSource,
      tokenLength: token?.length || 0,
      tokenPrefix: token?.substring(0, 20) + '...',
      userAgent: req.get('user-agent')?.substring(0, 50)
    });
    
    if (!token) {
      console.log('Refresh session - No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'No refresh token provided',
        code: 'NO_REFRESH_TOKEN'
      });
    }
    
    const result = await refreshSessionService(token, res);
    
    console.log('Refresh session - Success:', {
      hasAccessToken: !!result.accessToken,
      hasUser: !!result.user,
      userName: result.user?.name,
      tokenSource
    });

    res.json({
      success: true,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user
    });
  } catch (error) {
    console.error('Refresh session - Error:', {
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack?.split('\n')[0],
      tokenProvided: !!req.cookies?.refreshToken || !!req.body?.refreshToken
    });
    
    // Clear invalid cookies
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Send appropriate status code
    const statusCode = error.statusCode || 401;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Session expired. Please login again.',
      code: error.message === 'Refresh token not recognized' ? 'INVALID_REFRESH_TOKEN' : 'SESSION_EXPIRED'
    });
  }
});

// Verify email
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const result = await verifyEmailService(token);

  if (result.alreadyVerified) {
    return res.json({ message: "Email already verified" });
  }

  res.json({ success: true, message: "Email verified successfully" });
});


// Resend verification
export const resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await resendVerificationService(email);

  if (result.alreadyVerified) {
    return res.json({ message: "User already verified" });
  }

  res.json({ success: true, message: "Verification email resent" });
});

// Password reset request

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordService(email);
  // Generic response (avoid enumeration)
  res.json({ success: true, message: "If an account exists, a reset link has been sent." });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  await resetPasswordService({ token, newPassword });
  res.json({ success: true, message: "Password has been reset. Please log in again." });
});

// Google OAuth Routes
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = asyncHandler(async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    try {
      if (err) {
        console.error('Google OAuth Error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_error`);
      }

      if (!user) {
        console.error('Google OAuth - No user returned');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
      }

      // Generate tokens for the authenticated user
      const { accessToken, refreshToken, user: userData, isNewUser } = await googleAuthService(user);
      
      // Set auth cookies
      setAuthCookies(res, accessToken, refreshToken);

      // Redirect to frontend with success and tokens in URL for cross-origin compatibility
      const params = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
        ...(isNewUser && { welcome: 'true' })
      });
      
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?${params.toString()}`;
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('Google OAuth Callback Error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_error`);
    }
  })(req, res, next);
});