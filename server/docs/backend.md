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
 # forget password
 # reset password
