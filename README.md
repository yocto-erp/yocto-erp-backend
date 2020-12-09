[![Coverage Status](https://coveralls.io/repos/github/yocto-erp/backend/badge.svg?branch=master)](https://coveralls.io/github/yocto-erp/backend?branch=master)
[![Build Status](https://travis-ci.org/yocto-erp/backend.svg?branch=master)](https://travis-ci.org/yocto-erp/backend)

Simple ERP for small business.

 - NodeJS 12
 - MySQL

Define env variable
 - For local .env
 - For test in folder test/.env

```
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=12345678
DB_NAME=yocto_erp_test
MAILGUN_API_KEY=your mailgun key
MAILGUN_DOMAIN=your mailgun domain
WEB_URL=http://localhost:4201 (public web url)
RECAPTCHA=your google recaptcha key
NODE_ENV=test
```
