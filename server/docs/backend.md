# # folder structure at backend

/server  → Node + Express
/src
 ├── modules/
 │    ├── auth/
 │    │    ├── auth.model.js        # User schema
 │    │    ├── auth.controller.js   # Register, login, logout
 │    │    ├── auth.routes.js       # Routes for /auth/*
 │    │    ├── auth.service.js      # Token generation, hashing
 │    │    └── auth.middleware.js   # JWT verify middleware
 │    ├── product/
 │    ├── order/
 │    ├── admin/
 │    └── ...
 ├── config/
 │    ├── db.js
 │    ├── env.js
 ├── app.js
 └── server.js

# # feature in this website

# # Auth Features
 # login
 # sign up
 # logout 
 # refresh token
 # resend-verification email
 # forget password
 # reset password

# # User Features
 # get-profile
 # update-profile
 # change-password

# # Address Features
 # create-address
 # get-all-address
 # get-address-by-id
 # delete-address

# # Product Features (Admin)
 # create-product
 # update-product
 # get-all-product
 # add-variant
 # update-variant
 # update-stock
 # soft delete

# # Product Features (User)
 # get-all-products
 # get-product-by-slug
 # get-product-by-sku
 # check-availability

# # Order Features (User)
 # create-order
 # get-all-order
 # get-order-by-id
 # payment-completing-process (razorpay but not tested yet)

# # Order Features (Admin)
 # get-all-order
 # get-order-by-id
 # update-order-status
 
# # Cart Features
 # add-to-cart
 # view-cart
 # update-cart
 # remove items from cart
 # clear cart
 