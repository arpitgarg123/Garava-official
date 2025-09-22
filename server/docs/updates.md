# # work left 

📅 Book an Appointment
User-side

Book appointment (form submission: service type, date/time, contact info, notes).

View my appointments (past & upcoming).

Cancel my appointment (optional).

Notifications (email/SMS confirmation, optional).

Admin-side

View all appointments (list with filters: pending, confirmed, completed, cancelled).

Update appointment status (pending → confirmed/cancelled/completed).

Add notes or reschedule (optional).

Export/download appointment list (optional).

📰 Newsletter
User-side

Subscribe with email (public route, no login required).

Unsubscribe (click link in email or request endpoint).

Prevent duplicate subscriptions (check existing).

Confirmation email (optional double opt-in).

Admin-side

View subscriber list (with pagination).

Export subscribers (CSV/Excel).

Delete subscriber (GDPR-style compliance, optional).

Integration hooks (SendGrid/Mailchimp/Resend, optional).

✍️ Blogs
User-side

List all blog posts (with pagination + tags).

View blog detail by slug.

SEO-friendly meta (title, description, tags).

Share blog (social sharing links, optional).

Admin-side

Create blog post (title, slug, content, tags, cover image).

Update blog post.

Delete blog post.

Draft/Publish status toggle.

Schedule publish (optional).

Manage tags/categories.











# # next

User:   

POST /api/orders/checkout

POST /api/orders/:orderNumber/pay-callback (or webhook)

GET /api/user/orders

GET /api/user/orders/:orderNumber

POST /api/orders/:orderNumber/cancel

POST /api/orders/:orderNumber/returns

GET /api/products/sku/:sku (for cart validation)

Admin:

GET /api/admin/orders (filters)

GET /api/admin/orders/:id

PUT /api/admin/orders/:id (notes/status)

POST /api/admin/orders/:id/ship

POST /api/admin/orders/:id/refund

POST /api/admin/orders/bulk-ship / bulk-refund

GET /api/admin/reports/orders

Webhooks:

POST /webhooks/payments/razorpay

POST /webhooks/couriers/delhivery


📌 User Features (for Garava.in)


### View Orders (basic order history) ❌ testing of this route is panding

Endpoint: GET /api/user/orders

Shows list of orders placed by the user.

Helps customers track purchases.

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

User (Profile + Change Password + Addresses) ✅

Products (catalog browsing) ✅

Orders (checkout flow) ✅

Cart (shopping experience) ✅

📌 After Orders (Phase 6+)

Wishlist / Favorites (optional) ✅

Reviews & Ratings (social proof) ✅

Categories / Tags (filtering products better) 

Payment/Transactions (integrate Razorpay) ✅ testing is not done on this
