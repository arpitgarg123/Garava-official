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

# # product features for admin

### create product
**Endpoint:** `POST /api/admin/product/`  
**Description:** this route create a product and only used by the admin  

**Response:**
```json
{
    "success": true,
    "product": {
        "name": "GARAVA Sayonee",
        "type": "fragrance",
        "slug": "garava-something",
        "category": "Fragrance",
        "subcategory": "Perfume",
        "shortDescription": "A bold unisex fragrance with a rich oriental base.",
        "description": "Sayonee is crafted with the finest ingredients. A blend of floral and woody notes creates a long-lasting impression, perfect for evening wear.",
        "fragranceNotes": {
            "top": [
                "Bergamot"
            ],
            "middle": [
                "Rose"
            ],
            "base": [
                "Oud"
            ]
        },
        "ingredients": "Alcohol Denat., Parfum, Aqua, Limonene, Linalool",
        "caution": "Flammable. Keep away from heat and flames.",
        "storage": "Store in a cool, dry place away from direct sunlight.",
        "variants": [
            {
                "sku": "SAYO-10ML",
                "sizeLabel": "10ml",
                "price": 999,
                "mrp": 1299,
                "stock": 100,
                "stockStatus": "in_stock",
                "images": [],
                "isActive": true,
                "isDefault": true,
                "purchaseLimit": 0,
                "leadTimeDays": 0
            },
            {
                "sku": "SAYO-50ML",
                "sizeLabel": "50ml",
                "price": 3999,
                "mrp": 4499,
                "stock": 50,
                "stockStatus": "in_stock",
                "images": [],
                "isActive": true,
                "isDefault": false,
                "purchaseLimit": 0,
                "leadTimeDays": 0
            }
        ],
        "heroImage": {
            "url": "https://ik.imagekit.io/arpit321/products/hero/hero_1757790481915_WhatsApp_Image_2025-08-18_at_21.51.13_8a71bb95__WFX5b5iWI.jpg",
            "fileId": "68c5c1135c7cd75eb8ab10aa"
        },
        "gallery": [
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790485361_20250803_2312_Plain_Black_T-Shirt_remix_01k1rgatdrewxthn0yqygq1w0p_j8WkNv2gpi.png",
                "fileId": "68c5c1165c7cd75eb8ab1bcf",
                "_id": "68c5c1241df3f38491de83d1"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790488583_IMG-20250803-WA0056_X3hsFGJ5MU.jpg",
                "fileId": "68c5c11a5c7cd75eb8ab27de",
                "_id": "68c5c1241df3f38491de83d2"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790491682_IMG-20250803-WA0057_F6GgGv4Cr.jpg",
                "fileId": "68c5c11d5c7cd75eb8ab602a",
                "_id": "68c5c1241df3f38491de83d3"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790494754_IMG-20250803-WA0058_n5nDczVAd.jpg",
                "fileId": "68c5c1205c7cd75eb8ab98bb",
                "_id": "68c5c1241df3f38491de83d4"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790497848_IMG-20250803-WA0059_D-jM9svvf.jpg",
                "fileId": "68c5c1235c7cd75eb8abca03",
                "_id": "68c5c1241df3f38491de83d5"
            }
        ],
        "gstIncluded": true,
        "badges": [
            "New,Exclusive"
        ],
        "isFeatured": true,
        "status": "published",
        "isActive": true,
        "shippingInfo": {
            "complementary": true,
            "minDeliveryDays": 2,
            "maxDeliveryDays": 5,
            "codAvailable": true,
            "pincodeRestrictions": false
        },
        "expectedDeliveryText": "Delivery in 2-5 business days",
        "freeGiftWrap": false,
        "giftMessageAvailable": true,
        "purchaseLimitPerOrder": 0,
        "minOrderQty": 1,
        "callToOrder": {
            "enabled": false
        },
        "askAdvisor": true,
        "bookAppointment": false,
        "relatedProducts": [],
        "upsellProducts": [],
        "collections": [
            "Luxury Perfumes",
            "Unisex"
        ],
        "avgRating": 4.7,
        "reviewCount": 12,
        "returnPolicy": "Returns accepted within 7 days if sealed.",
        "warranty": "N/A",
        "metaTitle": "GARAVA Sayonee Perfume | Luxury Unisex Fragrance",
        "metaDescription": "Discover GARAVA Sayonee, a luxury unisex perfume with oriental notes. Free shipping and COD available.",
        "createdBy": "68c14a5392547c81864aed39",
        "updatedBy": "68c14a5392547c81864aed39",
        "_id": "68c5c1241df3f38491de83d0",
        "createdAt": "2025-09-13T19:08:20.913Z",
        "updatedAt": "2025-09-13T19:08:20.913Z",
        "__v": 0
    }
}
```

### update product
**Endpoint:** `Put /api/admin/product/:id`  example  `Put /api/admin/product/68c5c1241df3f38491de83d0`
**Description:** this route update a product and only used by the admin  

**Response:**
```json
{
    "success": true,
    "product": {
        "fragranceNotes": {
            "top": [
                "Bergamot"
            ],
            "middle": [
                "Rose"
            ],
            "base": [
                "Oud"
            ]
        },
        "heroImage": {
            "url": "https://ik.imagekit.io/arpit321/products/hero/hero_1757790481915_WhatsApp_Image_2025-08-18_at_21.51.13_8a71bb95__WFX5b5iWI.jpg",
            "fileId": "68c5c1135c7cd75eb8ab10aa"
        },
        "callToOrder": {
            "enabled": false
        },
        "_id": "68c5c1241df3f38491de83d0",
        "name": "GARAVA something",
        "type": "fragrance",
        "slug": "garava-something",
        "category": "Fragrance",
        "subcategory": "Perfume",
        "shortDescription": "A bold unisex fragrance with a rich oriental base.",
        "description": "Sayonee is crafted with the finest ingredients. A blend of floral and woody notes creates a long-lasting impression, perfect for evening wear.",
        "ingredients": "Alcohol Denat., Parfum, Aqua, Limonene, Linalool",
        "caution": "Flammable. Keep away from heat and flames.",
        "storage": "Store in a cool, dry place away from direct sunlight.",
        "variants": [
            {
                "sku": "SAYO-10ML",
                "sizeLabel": "10ml",
                "price": 999,
                "mrp": 1299,
                "stock": 100,
                "stockStatus": "in_stock",
                "images": [],
                "isActive": true,
                "isDefault": true,
                "purchaseLimit": 0,
                "leadTimeDays": 0
            },
            {
                "sku": "SAYO-50ML",
                "sizeLabel": "50ml",
                "price": 3999,
                "mrp": 4499,
                "stock": 50,
                "stockStatus": "in_stock",
                "images": [],
                "isActive": true,
                "isDefault": false,
                "purchaseLimit": 0,
                "leadTimeDays": 0
            }
        ],
        "gallery": [
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790485361_20250803_2312_Plain_Black_T-Shirt_remix_01k1rgatdrewxthn0yqygq1w0p_j8WkNv2gpi.png",
                "fileId": "68c5c1165c7cd75eb8ab1bcf",
                "_id": "68c5c1241df3f38491de83d1"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790488583_IMG-20250803-WA0056_X3hsFGJ5MU.jpg",
                "fileId": "68c5c11a5c7cd75eb8ab27de",
                "_id": "68c5c1241df3f38491de83d2"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790491682_IMG-20250803-WA0057_F6GgGv4Cr.jpg",
                "fileId": "68c5c11d5c7cd75eb8ab602a",
                "_id": "68c5c1241df3f38491de83d3"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790494754_IMG-20250803-WA0058_n5nDczVAd.jpg",
                "fileId": "68c5c1205c7cd75eb8ab98bb",
                "_id": "68c5c1241df3f38491de83d4"
            },
            {
                "url": "https://ik.imagekit.io/arpit321/products/gallery/gallery_1757790497848_IMG-20250803-WA0059_D-jM9svvf.jpg",
                "fileId": "68c5c1235c7cd75eb8abca03",
                "_id": "68c5c1241df3f38491de83d5"
            }
        ],
        "gstIncluded": true,
        "badges": [
            "New,Exclusive"
        ],
        "isFeatured": true,
        "status": "published",
        "isActive": true,
        "shippingInfo": {
            "complementary": true,
            "minDeliveryDays": 2,
            "maxDeliveryDays": 5,
            "codAvailable": true,
            "pincodeRestrictions": false
        },
        "expectedDeliveryText": "Delivery in 2-5 business days",
        "freeGiftWrap": false,
        "giftMessageAvailable": true,
        "purchaseLimitPerOrder": 0,
        "minOrderQty": 1,
        "askAdvisor": true,
        "bookAppointment": false,
        "relatedProducts": [],
        "upsellProducts": [],
        "collections": [
            "Luxury Perfumes",
            "Unisex"
        ],
        "avgRating": 4.7,
        "reviewCount": 12,
        "returnPolicy": "Returns accepted within 7 days if sealed.",
        "warranty": "N/A",
        "metaTitle": "GARAVA Sayonee Perfume | Luxury Unisex Fragrance",
        "metaDescription": "Discover GARAVA Sayonee, a luxury unisex perfume with oriental notes. Free shipping and COD available.",
        "createdBy": "68c14a5392547c81864aed39",
        "updatedBy": "68c14a5392547c81864aed39",
        "createdAt": "2025-09-13T19:08:20.913Z",
        "updatedAt": "2025-09-13T19:17:47.900Z",
        "__v": 0
    }
}
```

### get all product
**Endpoint:** `get /api/admin/product/` 
**Description:** this route get all product and only used by the admin  

### add variant 
**Endpoint:** `post /api/admin/product/:id/variants`  example `post /api/admin/product/68c5c1241df3f38491de83d0/variants`
**Description:** this route add variats on the product and only used by the admin  

**Request Body:**
```json
 {
    "sku": "SAYO-100ML",
    "sizeLabel": "10ml",
    "price": 999,
    "mrp": 1299,
    "stock": 100,
    "stockStatus": "in_stock",
    "images": [],
    "isActive": true,
    "isDefault": true,
    "purchaseLimit": 0,
    "leadTimeDays": 0
}
```

### update variant 
**Endpoint:** `post /api/admin/product/:id/variants/:variantId`  example `post /api/admin/product/68c5cafba86abb6262ddf0dd/variants/68c5cafba86abb6262ddf0de`
**Description:** this route update variats on the product and only used by the admin  

**Request Body:**
```json
 {
    "sku": "SAYO-100ML",
    "sizeLabel": "10ml",
    "price": 999,
    "mrp": 1299,
    "stock": 100,
    "stockStatus": "in_stock",
    "images": [],
    "isActive": true,
    "isDefault": true,
    "purchaseLimit": 0,
    "leadTimeDays": 0
}
```

### update stock 
**Endpoint:** `patcn /api/admin/product/:id/stock`  example `patch /api/admin/product/68c5cafba86abb6262ddf0dd/stock`
**Description:** this route update stock of the varient on the product and only used by the admin  

**Request Body:**
```json
 {
    "variantSku" : "SAYO-100ML",
    "inc": -100

}
```

### soft delete
**Endpoint:** `delete /api/admin/product/:id`  example `post /api/admin/product/68c5cafba86abb6262ddf0dd`
**Description:** this route unactive the product and only used by the admin  


# # product features for user

### get all product
**Endpoint:** `get /api/product/` 
**Description:** this route get all product

### get  product by slug 
**Endpoint:** `get /api/product/:slug`  example `get /api/product/garava-something-else`
**Description:** this route get product by slug

### get  product by sku
**Endpoint:** `get /api/product/sku/:sku`  example `get /api/product/sku/SAYO-100ML`
**Description:** this route get product by sku

### check availability
**Endpoint:** `port /api/product/check-pincode`  
**Description:** this route check the product is available at that pincode or not

**Request Body:**
```json
{
    "productId" :"68c5cafba86abb6262ddf0dd",
    "variantId" :"68c5cafba86abb6262ddf0de",
    "pincode" :"462038"
}
```

# # orders features for user

### create order
**Endpoint:** `POST /api/order/checkout`  
**Description:** this route create a order 

**Request-body:**
```json
{
  "items": [
    { "variantId": "68c5cafba86abb6262ddf0de", "quantity": 1 }
  ],
  "shippingAddress": {
    "name": "Arpit Garg",
    "phone": "9876543210",
    "addressLine1": "123 Luxury St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay"
}
```

### get all order 
**Endpoint:** `GET /api/order/`  
**Description:** this route get all the order of the user

### get order by id
**Endpoint:** `GET /api/order/:orderId` example  `GET /api/order/68c6a7c10af47746b00367ab`
**Description:** this route get all the order of the user

### payment completing process ❌❌❌ testing is pending
**Endpoint:** `GET /api/order/webhooks/payments/razorpay` 
**Description:** this route compelete the payments


# # orders features for admin

### get all order 
**Endpoint:** `GET /api/admin/order`  
**Description:** this route get all the order of the user for admin

### get order by id
**Endpoint:** `GET /api/admin/order/:id` example  `GET /api/admin/order/68c6acdb036756fb9bc86882`
**Description:** this route get the order of the user by id for admin

### update order status 
**Endpoint:** `GET /api/admin/order/:id/status` example  `GET /api/admin/order/68c6acdb036756fb9bc86882/status`
**Description:** this route get update the status of the order by admin

**Request Body:**
```json
{
  "status": "shipped",
  "tracking": {
    "courier": "BlueDart",
    "trackingNumber": "BD123456789",
    "url": "https://bluedart.com/track/BD123456789"
  }
}
```


# # cart Features

### add to cart
**Endpoint:** `POST /api/cart/` 
**Description:** this route add items into the carts

**Request Body:**
```json
{
  "productId": "68c5cafba86abb6262ddf0dd",
  "variantId": "68c5cafba86abb6262ddf0de", 
  "quantity": 2
}
```

### view cart
**Endpoint:** `GET /api/cart/` 
**Description:** this route get all items of the carts

### update cart
**Endpoint:** `PUT /api/cart/` 
**Description:** this route updates items of the carts

**Request Body:**
```json
{
  "productId": "68c5cafba86abb6262ddf0dd",
  "variantId": "68c5cafba86abb6262ddf0de",   // or use variantSku instead of variantId
  "quantity": 5
}
```

### remove item from cart
**Endpoint:** `DELETE /api/cart/item` example `DELETE /api/cart/item?productId=68c5cafba86abb6262ddf0dd&variantId=68c5cafba86abb6262ddf0de` 
**Description:** this route remove item from the carts

### clear cart
**Endpoint:** `DELETE /api/cart/`
**Description:** this route clear all the items from the cart

# # wishlist Features

### add to wishlist
**Endpoint:** `POST /api/wishlist/:productId` example `POST /api/wishlist/68c5cafba86abb6262ddf0dd`
**Description:** this route add the product to the wishlist


### remove to wishlist
**Endpoint:** `DELETE /api/wishlist/:productId` example `DELETE /api/wishlist/68c5cafba86abb6262ddf0dd`
**Description:** this route remove the product to the wishlist

### get wishlist
**Endpoint:** `GET /api/wishlist/` example `GET /api/wishlist/`
**Description:** this route get all the items of the wishlist


### toogle product items
**Endpoint:** `GET /api/wishlist/toggle/:productId` example `GET /api/wishlist/toggle/68c5cafba86abb6262ddf0dd`
**Description:** this route toggle the products of the wishlist if added remove and if not added it add it


# # Review Feature (Admin + User)

### list-reviews (user)
**Endpoint:** `get /api/reviews/`  
**Description:** lists reviews for a product. Supports pagination and sorting.  

### create-or-update-review (user)
**Endpoint:** `post /api/reviews/:productId`  
**Description:** creates or replaces the logged-in user’s review for the product.  
**Request Body:**
```json
{
  "rating": 5,
  "title": "Amazing fragrance",
  "body": "Long lasting and premium feel.",
  "photos": []
}
```

### update-review (user)
**Endpoint:** `put /api/reviews/:reviewId`  
**Description:** updates own review (partial update allowed).  
**Request Body**
```json
{
  "rating": 4,
  "title": "Updated title",
  "body": "Edited after a week of use.",
  "photos": []
}
```

### vote-helpful (user)
**Endpoint:** `post /api/reviews/:reviewId/vote`  
**Description:** marks a review as helpful (may accept a `type`).  
**Auth:** required  
**Request Body (optional):**
```json
{
  "type": "helpful"
}
```

### admin-list-reviews
**Endpoint:** `get /api/reviews/admin`  
**Description:** lists reviews with admin filters.  

### admin-moderate-review
**Endpoint:** `post /api/reviews/admin/:reviewId/moderate`  
**Description:** approve/deny/flag a review with optional note.  
**Auth:** admin required  
**Request Body:**
```json
{
  "approve": true,
  "deny": false,
  "flag": false,
  "note": "Meets guidelines"
}
```

### admin-delete-review

**Endpoint:** `delete /api/reviews/:reviewId`  
**Description:** deletes a review (typically soft-delete).


# # Appointment Feature (Admin + User)

### create-appointment (user)
**Endpoint:** `post /api/appointment/`  
**Description:** creates a appointment request even if the user is not logged in 
**Request Body:**
```json
{
    "name" : "arpit garg",
    "email" : "arpitgarg424@gmail.com",
    "phone"  : "6264450557",
    "serviceType" : "jewellery",
    "appointmentAt" : "2025-10-10T11:00:00.000Z",
    "notes" : "pleasae reply as soon as possible"
}
```
### get-appointment (user)
**Endpoint:** `get /api/appointment/me`  
**Description:** get an appointment if the user is logged in 

### get-appointment (admin)
**Endpoint:** `get /api/appointment/admin`  
**Description:** get an appointment if the user is logged in and it is a admin 

### update-appointment (admin)
**Endpoint:** `patch /api/appointment/admin/:id` emample : `patch /api/appointment/admin/68d0f087c03647de6945be26`  
**Description:** update the status of an appointment if the user is logged in and it is a admin 
**Request Body:**
```json
{
 "status" : "completed",
 "adminNotes" : "good person"
}
```
# # Newsletter Feature (Admin + User)

### subscribe newsletter (user)
**Endpoint:** `post /api/newsletter/subscribe`  
**Description:** this route subscribe the user to the newsletter
**Request Body:**
```json
{
    "email" : "arpitgarg424@gmail.com",
}
```
### unsubscribe newsletter (user)
**Endpoint:** `post /api/newsletter/unsubscribe`  
**Description:** this route unsubscribe the user to the newsletter
**Request Body:**
```json
{
    "email" : "arpitgarg424@gmail.com",
}
```
### get subscriber list (Admin)
**Endpoint:** `get /api/newsletter/admin`  
**Description:** this route unsubscribe the user to the newsletter

# # blog Feature (Admin)

### create-blog
**Endpoint:** `post /api/admin/blog/`  
**Description:** this route create the blog 
**response Body:**
```json
{
    "success": true,
    "post": {
        "title": "How to Layer Fragrances",
        "slug": "how-to-layer-fragrances",
        "content": "<p>Fragrance layering is an <strong>art</strong> of mixing perfumes.</p>",
        "coverImage": {
            "url": "https://ik.imagekit.io/arpit321/blogs/cover/blog_1759147235648_WhatsApp_Image_2025-09-27_at_00.59.39_412b2595__G3209gjfW.jpg",
            "fileId": "68da74e55c7cd75eb8ace86e",
            "alt": "How to Layer Fragrances"
        },
        "tags": [
            "perfume",
            "layering",
            "guide"
        ],
        "status": "published",
        "publishAt": null,
        "isActive": true,
        "metaTitle": "Fragrance Layering Guide",
        "metaDescription": "Learn how to combine perfumes for unique scents.",
        "readingTime": 1,
        "views": 0,
        "author": "68c14a5392547c81864aed39",
        "updatedBy": "68c14a5392547c81864aed39",
        "_id": "68da74e66adae6c05109188f",
        "createdAt": "2025-09-29T12:00:38.524Z",
        "updatedAt": "2025-09-29T12:00:38.524Z",
        "__v": 0
    }
}
```

### update-blog
**Endpoint:** `post /api/admin/blog/:id`   
**Description:** this route update the blog 
**response Body:**
```json
{
    "success": true,
    "post": {
        "_id": "68da74e66adae6c05109188f",
        "title": "How to Layer Fragrances new",
        "slug": "how-to-layer-fragrances",
        "content": "<p>Fragrance layering is an <strong>art</strong> of mixing perfumes.</p>",
        "coverImage": {
            "url": "https://ik.imagekit.io/arpit321/blogs/cover/blog_1759147235648_WhatsApp_Image_2025-09-27_at_00.59.39_412b2595__G3209gjfW.jpg",
            "fileId": "68da74e55c7cd75eb8ace86e",
            "alt": "How to Layer Fragrances"
        },
        "tags": [
            "perfume",
            "layering",
            "guide"
        ],
        "status": "published",
        "publishAt": null,
        "isActive": true,
        "metaTitle": "Fragrance Layering Guide",
        "metaDescription": "Learn how to combine perfumes for unique scents.",
        "readingTime": 1,
        "views": 0,
        "author": "68c14a5392547c81864aed39",
        "updatedBy": "68c14a5392547c81864aed39",
        "createdAt": "2025-09-29T12:00:38.524Z",
        "updatedAt": "2025-09-29T12:04:27.608Z",
        "__v": 0
    }
}
```

### get-blog
**Endpoint:** `get /api/admin/blog/`   
**Description:** this route gets all the blog 

### delete-blog
**Endpoint:** `delete /api/admin/blog/:id`   
**Description:** this route delete all the blog 

### update-status-blog
**Endpoint:** `patch /api/admin/blog/:id/status`   
**Description:** this route updates the status all the blog 
**resquest Body:**
```json
{
    "status" : "draft"
}
```

# # blogs Features (User)

### get-blog
**Endpoint:** `get /api/blog/`   
**Description:** this route gets all the blog on the user side
### get-blog-by-slug
**Endpoint:** `get /api/blog/:id`   
**Description:** this route get the blog by slug on the user side
