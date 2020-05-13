# NodeJs JWT Authentication API


### Environment vars to be updated
Update these env variables in `.env` file or platform specific environment
<pre> * - required env vars(if not set, will fallback to predefined defaults) </pre>
```
DB_CONN - remote db connection uri
JWT_SECRET* - secret for jwt
JWT_REFRESH_SECRET* - secret for refresh token
JWT_EXP - expiration time for jwt(s)
JWT_SECRET_EXP - expiration time for refresh token(s)
REDIS_HOST - redis db host uri
REDIS_PORT - redis db port
REDIS_PASS - redis db password
REDIS_EXP - Expiration for a Redis key
PORT - server port/default 3000
```
<p>
Redis & MongoDB should be installed either locally if remote connections are not provided & running in default configs.

```
Fallback defaults
MongoDB => db name - 'local', port - 27017
Redis => host - localhost, port - 6379
```
</p>

---

## Available endpoints
- ### Register - Validates & create new user
```json
POST
/user/register
{
    "name":"",
    "email":"",
    "password":""
}

response body - { user_id: created user's ID in DB }
```

- ### Login - returns a JWT
```json
POST
/user/login
{
    "email":"",
    "password":""
}

response body - { token: JWT, refreshtoken: refresh JWT } 
```

- ### Private routes - Can be accessed only via presenting valid token inside 'auth-token' custom header
```
test private Route:
/get

request header: 'auth-token: a valid JWT'
```