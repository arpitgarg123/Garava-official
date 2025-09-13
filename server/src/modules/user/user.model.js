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
      index: true,
      validate: {
        validator: (v) => /^\S+@\S+\.\S+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
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
  if (!this.isModified('password')) return next();
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
  return await argon2.verify(this.password, candidatePassword);
};

/**
 * Verify refresh token method
 */
userSchema.methods.verifyRefreshToken = async function (candidateToken) {
  for (let tokenObj of this.refreshTokens) {
    if (await argon2.verify(tokenObj.token, candidateToken)) {
      return true;
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

/** 
 * Remove sensitive fields when converting to JSON
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
