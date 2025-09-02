# # here every feature is listed by the api name and router and test field which is used during the postmen test

# # auth Feature 

### Signup User
**Endpoint:** `POST /api/auth/signup`  
**Description:** Registers a new user account.  

**Request Body:**
```json
{
  "name": "Arpit",
  "email": "arpit@arpit.com",
  "password": "87654321"
}
```

### login user
**Endpoint:** `POST /api/auth/login`  
**Description:** login the user   

**Request Body:**
```json
{
  "email": "arpit@arpit.com",
  "password": "87654321"
}
```

### logout user
**Endpoint:** `POST /api/auth/logout`  
**Description:** login the user   

### refresh token
**Endpoint:** `POST /api/auth/refresh`  
**Description:** used to revoke the refresh token in db   
**imp:** this route is called automatically via frontend if 401 error is hit 