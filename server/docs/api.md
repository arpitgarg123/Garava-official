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
**Endpoint:** `get /api/auth/verify-email`  
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

# # user features api list

### get-profile
**Endpoint:** `get /api/user/profile`  
**Description:** this route get the profile of the user who is logged in.

### update-profile
**Endpoint:** `put /api/user/profile/update`  
**Description:** this route update the user profile.
**Request Body:**
```json
{
    "name" : "arpit",
    "phone" :"9876543210"
}
```

### change-password
**Endpoint:** `post /api/user/change-password`  
**Description:** this route change the password of the login user
**Request Body:**
```json
{
    "oldPassword" : "12345678",
    "newPassword" : "87654321"
}
```

# # addresses api list handle by user only 

### create-address
**Endpoint:** `post /api/address/create`  
**Description:** this route create the address for the logged-in user
**Request Body:**
```json
{
  "label": "home",
  "fullName": "Arpit Garg",
  "phone": "9876543210",
  "addressLine1": "123 Luxury St",
  "addressLine2": "Floor 2",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": true
}
```

### get-list-of-address
**Endpoint:** `get /api/address/`  
**Description:** this route get the all address of  the user

### get-address-by-id
**Endpoint:** `get /api/address/:id` example `get /api/address/68bea9fbb1e7a939a7b5128b`
**Description:** this route get the address of the user by address id

### update-address-by-id
**Endpoint:** `put /api/address/update/:id` example `put /api/address/update/68bea9fbb1e7a939a7b5128b`
**Description:** this route update the address of the user by address id

### delete-address-by-id
**Endpoint:** `delete /api/address/delete/:id` example `delete /api/address/delete/68bea9fbb1e7a939a7b5128b`
**Description:** this route delete the address of the user by address id




