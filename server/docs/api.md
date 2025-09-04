# # here every feature is listed by the api name and router and test field which is used during the postmen test

# # auth features api list

### Signup User
**Endpoint:** `POST /api/auth/signup`  
**Description:** Registers a new user account.  

**Request Body:**
```json
{
    "name" : "arpit garg",
    "email" : "arpitgarg424@gmail.com",
    "password" : "87654321"
}
```

### login user
**Endpoint:** `POST /api/auth/login`  
**Description:** login the user   

**Request Body:**
```json
{
    "email" : "arpitgarg424@gmail.com",
    "password" : "87654321"
}
```

### logout user
**Endpoint:** `POST /api/auth/logout`  
**Description:** login the user   

### refresh token
**Endpoint:** `POST /api/auth/refresh`  
**Description:** used to revoke the refresh token in db   
**imp:** this route is called automatically via frontend if 401 error is hit 


### verify email
**Endpoint:** `POST /api/auth/verify-email`  
**Description:** this route verify the email on the mail

### resend-verification email
**Endpoint:** `POST /api/auth/resend-verification`  
**Description:** this route resend the email for the email-verification
**Request Body:**
```json
{
    "email" : "arpitgarg424@gmail.com"
}
```

### forgot-password
**Endpoint:** `POST /api/auth/forgot-password`  
**Description:** this route send the password to the email to forget the password
**Request Body:**
```json
{
    "email" : "arpitgarg424@gmail.com"
}
```

### reset-password
**Endpoint:** `POST /api/auth/reset-password`  
**Description:** this route sets the new password 
**Request Body:**
```json
{
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjllNjNlYjM1MTEzYzFiNmI3NmRlMCIsImVtYWlsIjoiYXJwaXRnYXJnNDI0QGdtYWlsLmNvbSIsImlhdCI6MTc1NzAxNzAzNSwiZXhwIjoxNzU3MDE4ODM1fQ.jaYJMVvLWG6NWzRoZjQ7NP-XeBftFenFjY_6OpKRfkU",
    "newPassword" : "12345678"
}
```