
## Build a basic version of PayTM

# Backend endpoints:
post : user/signup
{
    "username": "sam.wilson@example.com",
    "password": "safePassword789",
    "firstName": "Sam",
    "lastName": "Wilson"
}

post : user/signin
{
    "username": "jane.smith@example.com",
    "password": "strongPassword456"
}

put : user/
{
    "username": "notjane.smith@example.com",
}

get : user/bulk
{
    "lastName": "Wilson"
}

post : admin/signin
{
    "username" : "anvi.barde21@vit.edu",
      "password" : "12345678"
}

post : vendor/signup
{
    "username": "aryan.vikas@example.com",
    "password": "123456789",
    "application": [
        {
            "productId": "P1234",
            "quantity": 100,
            "shipmentDate": "2024-02-15"
        }
    ],
    "verified": false
}

get : admin/allvendors 
{
}

put : admin/vendorValid
{
    "username" : "aryan.vikas@example.com"
}

put : admin/vendor-discontinue
{
    "username" : "aryan.vikas@example.com"
}

get : admin/get-vendor-applications
{
    "username": "aryan.deshmukh@example.com"
}

get : account/balance
post : account/users-transfer
{
    "amount": 100,
    "username": "john.doe@example.com"
}
post : account/user-vendor
{
    "amount": 100,
    "username": "aryan.deshmukh@example.com"
}
