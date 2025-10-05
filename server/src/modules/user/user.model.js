import mongoose from 'mongoose';
import argon2 from 'argon2';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: function() {
        // Password is required only if no Google ID (i.e., not a Google OAuth user)
        return !this.googleId;
      },
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Google OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents without this field
    },
    profilePicture: {
      type: String,
    },

    phone: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },   
    refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  },
  { timestamps: true }
);

// pre hook for admin check
userSchema.pre('save', async function (next) {
  try {
    // if not creating new and role hasn't been changed to 'admin', skip check
    if (!this.isNew && !this.isModified('role')) return next();

    if (this.role === 'admin') {
      // exclude current doc (for updates)
      const existing = await this.constructor.findOne({ role: 'admin', _id: { $ne: this._id } }).lean();
      if (existing) {
        return next(new Error('Admin user already exists. Cannot create another.'));
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Pre-save hook for password hashing
 */

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    this.password = await argon2.hash(this.password, { type: argon2.argon2id });
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Pre-save hook for hashing refresh tokens
 */
userSchema.pre("save", async function (next) {
  if (this.isModified("refreshTokens")) {
    for (let tokenObj of this.refreshTokens) {
      if (tokenObj.token && !tokenObj.token.startsWith("$argon2")) {
        tokenObj.token = await argon2.hash(tokenObj.token, {
          type: argon2.argon2id,
        });
      }
    }
  }
  next();
});

/**
 * Compare password method
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    // User registered via Google OAuth, no password to compare
    return false;
  }
  return await argon2.verify(this.password, candidatePassword);
};

/**
 * Verify refresh token method
 */
userSchema.methods.verifyRefreshToken = async function (candidateToken) {
  if (!candidateToken || typeof candidateToken !== 'string') {
    return false;
  }
  
  for (let tokenObj of this.refreshTokens) {
    try {
      if (tokenObj.token && await argon2.verify(tokenObj.token, candidateToken)) {
        return true;
      }
    } catch (error) {
      console.log('User.verifyRefreshToken - Argon2 verification error:', error.message);
      continue; // Skip this token and try the next one
    }
  }
  return false;
};

// Invalidate all refresh sessions (after password reset/change)
userSchema.methods.invalidateAllSessions = async function () {
  this.refreshTokens = [];
  this.passwordChangedAt = new Date();
  await this.save();
};

// Clean up old refresh tokens (keep only the most recent 5)
userSchema.methods.cleanupOldTokens = async function () {
  if (this.refreshTokens.length > 5) {
    // Sort by createdAt and keep only the 5 most recent
    this.refreshTokens.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    this.refreshTokens = this.refreshTokens.slice(0, 5);
    await this.save();
  }
};

// Static method to clean up old tokens across all users
userSchema.statics.cleanupAllOldTokens = async function () {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 30); // Remove tokens older than 30 days
  
  const result = await this.updateMany(
    { "refreshTokens.createdAt": { $lt: cutoffDate } },
    { $pull: { refreshTokens: { createdAt: { $lt: cutoffDate } } } }
  );
  
  console.log('Cleaned up old refresh tokens:', result.modifiedCount, 'users affected');
  return result;
};

/** 
 * Remove sensitive fields when converting to JSON
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

// Create indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { sparse: true });
// Removed role, isVerified, and refreshTokens.createdAt indexes - rarely queried

const User = mongoose.model('User', userSchema);
export default User;
