import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'supersecretaccess';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefresh';
const JWT_EMAIL_SECRET = process.env.JWT_EMAIL_SECRET || "supersecretemail";
const JWT_RESET_SECRET   = process.env.JWT_RESET_SECRET;   // ✅ reset

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // long expiry (7 days)
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
};

// verification token
export const generateEmailVerificationToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_EMAIL_SECRET,
    { expiresIn: "1d" } // 24 hours expiry
  );
};
// password reset token
export const generatePasswordResetToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, JWT_RESET_SECRET, { expiresIn: "30m" });

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' in development for OAuth redirects
    maxAge: 15 * 60 * 1000, // 15m
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax', // Use 'lax' in development for OAuth redirects
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
  
  console.log('Auth cookies set:', {
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    environment: process.env.NODE_ENV
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
};
 