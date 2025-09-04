# # next

role-based access support (admin vs user).


📌 User Features (for Garava.in)

### Get Profile

Endpoint: GET /api/user/profile

Returns the logged-in user’s details (name, email, phone, verified status, etc.).

Requires authentication (token in cookies).

### Update Profile

Endpoint: PUT /api/user/profile

Allows user to update profile info (name, phone, etc.).

Email should generally remain immutable (or require re-verification if changed).

### Change Password

Endpoint: POST /api/user/change-password

Requires old password and new password.

Used by logged-in users who want to update credentials.

### View Orders (basic order history)

Endpoint: GET /api/user/orders

Shows list of orders placed by the user.

Helps customers track purchases.

### Manage Addresses (shipping/billing)

List Addresses: GET /api/user/addresses

Add Address: POST /api/user/addresses

Update Address: PUT /api/user/addresses/:id

Delete Address: DELETE /api/user/addresses/:id

### Wishlist / Favorites (optional, but common for e-commerce)

Endpoint: GET /api/user/wishlist

Endpoint: POST /api/user/wishlist (add/remove items).

### Account Deletion / Deactivation (optional, depends on client compliance needs)

Endpoint: DELETE /api/user/delete-account

Allows user to request full deletion of their account.


# # # update orders list

✅ Recommended Order of Development

User → to handle signup/login/auth.

Product → to display catalog.

Order → to checkout & track orders.

Cart → to improve shopping experience.

Address → needed for shipping.

Wishlist → optional but nice.

Review → for product trust.

Category/Tags → refine catalog structure.

Payment/Transaction → once payment integration is added.


# # # order of the phases wise features 

🎯 Priorities in order

Auth ✅ (done now)

User (Profile + Change Password + Addresses)

Products (catalog browsing)

Cart (shopping experience)

Orders (checkout flow)

📌 After Orders (Phase 6+)

Wishlist / Favorites (optional)

Reviews & Ratings (social proof)

Categories / Tags (filtering products better)

Payment/Transactions (integrate Razorpay, Stripe, etc.)