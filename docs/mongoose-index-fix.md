# Mongoose Duplicate Index Fix Summary

## Issue Description
The application was showing Mongoose warnings about duplicate schema indexes:
- Duplicate schema index on {"slug":1} found
- Duplicate schema index on {"user":1} found (multiple instances)
- Duplicate schema index on {"email":1} found

## Root Cause
These warnings occur when an index is defined both inline in the schema field definition (using `index: true` or `unique: true`) and also explicitly using `schema.index()`.

## Fixes Applied

### 1. Product Model (`server/src/modules/product/product.model.js`)
**Issue**: `slug` field had both `unique: true` in field definition and `productSchema.index({ slug: 1 }, { unique: true })`

**Fix**: Removed `unique: true` from field definition, kept explicit index:
```javascript
// Before
slug: { type: String, required: true, unique: true, lowercase: true },

// After  
slug: { type: String, required: true, lowercase: true },
```

### 2. User Model (`server/src/modules/user/user.model.js`)
**Issue**: `email` field had both `unique: true` and `index: true` in field definition

**Fix**: Removed `index: true` (kept `unique: true` as it's needed):
```javascript
// Before
email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  index: true,
  // ...
},

// After
email: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  // ...
},
```

### 3. Wishlist Model (`server/src/modules/wishlist/wishlist.model.js`)
**Issue**: `user` field had `unique: true` in field definition and also `wishlistSchema.index({ user: 1 })`

**Fix**: Removed the explicit index call:
```javascript
// Before
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
// ...
wishlistSchema.index({ user: 1 });

// After
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
// ...
// Index is already created by unique: true constraint above
```

### 4. Order Model (`server/src/modules/order/order.model.js`)
**Issue**: `user` field had both `index: true` in field definition and `orderSchema.index({ user: 1, createdAt: -1 })`

**Fix**: Removed `index: true` from field definition (kept compound index):
```javascript
// Before
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

// After
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
```

## Index Strategy Used

1. **Simple Indexes**: When only a simple index on one field is needed, use field-level options (`unique: true`, `index: true`)
2. **Compound Indexes**: Use `schema.index()` for multi-field indexes or when you need specific index options
3. **Unique Constraints**: `unique: true` automatically creates an index, so no need for additional `index: true`

## Result
After these changes, the Mongoose duplicate index warnings should no longer appear when starting the server.

## Best Practices for Future Development

1. Choose either field-level indexing OR explicit `schema.index()`, not both
2. Use field-level `unique: true` for unique constraints (it automatically creates an index)
3. Use `schema.index()` for compound indexes or when you need specific index options
4. Document your indexing strategy in comments when it might be unclear