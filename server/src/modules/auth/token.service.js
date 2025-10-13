import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'supersecretaccess';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefresh';
const JWT_EMAIL_SECRET = process.env.JWT_EMAIL_SECRET || "supersecretemail";
const JWT_RESET_SECRET   = process.env.JWT_RESET_SECRET;   // ✅ reset

export const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '24h' });
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' } // long expiry (30 days)
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.log('VerifyRefreshToken - Invalid token format');
      return null;
    }
    
    const decoded = jwt.verify(token.trim(), JWT_REFRESH_SECRET);
    
    // Validate token structure
    if (!decoded || !decoded.id) {
      console.log('VerifyRefreshToken - Token missing required fields');
      return null;
    }
    
    return decoded;
  } catch (err) {
    console.log('VerifyRefreshToken - JWT verification failed:', err.message);
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
  
  // Access token cookie (shorter lived)
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24h
    path: '/',
  });

  // Refresh token cookie (longer lived)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
    path: '/',
  });
};

export const clearAuthCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/'
  };
  
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
 