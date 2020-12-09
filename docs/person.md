# Person

Doing business, we can work with Corporation or Personal, if working with a corporation, we still work with one person. So need module to store Person information.

## Search Person

Return list of Person.

**GET** : `/api/person?search=""&page&size&sorts`

**Params**:

 - search: Search By First Name, Last Name, Phone, Email
 - page,size,sort: Paging Parameters

**Success Response**
```json
{
  "count": "integer",
  "rows": [
    {
      "id": 123,
      "firstName": "",
      "lastName": "",
      "gsm": "",
      "email": "",
      "address": "",
      "birthday": "",
      "sex": "",
      "createdDate": "",
      "createdBy": {
        "id": "number",
        "name": ""
      },
      "remark": ""
    }
  ]
}
```

# Create Person

Create **Person** (Customer, Partner, ...)

**POST** : `/api/person`

**Form Data**

```json
{
  "firstName *": "string (max 150, required)",
  "lastName *": "string (max 150, required)",
  "remark": "string",
  "gsm": "",
  "address": "",
  "email": "",
  "birthday": "",
  "sex": 0
}
```

**Process**

 - Validate Input Form.
 - Create record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "firstName": "",
  "lastName": "",
  "gsm": "",
  "email": "",
  "address": "",
  "birthday": "",
  "sex": "",
  "createdDate": "",
  "createdById": 0,
  "remark": ""
}
```

# Get Person

**GET** : `/api/company/{id}`

Get Person by Id

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "firstName": "",
  "lastName": "",
  "gsm": "",
  "email": "",
  "address": "",
  "birthday": "",
  "sex": "",
  "createdDate": "",
  "createdById": 0,
  "remark": ""
}
```

# Update Person

Update **Person**

**POST** : `/api/person/{id}`

**Form Data**

```json
{
  "firstName *": "string (max 150, required)",
  "lastName *": "string (max 150, required)",
  "remark": "string",
  "gsm": "",
  "address": "",
  "email": "",
  "birthday": "",
  "sex": 0
}
```

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Validate input form.
 - Create record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "firstName": "",
  "lastName": "",
  "gsm": "",
  "email": "",
  "address": "",
  "birthday": "",
  "sex": "",
  "createdDate": "",
  "createdById": 0,
  "remark": ""
}
```

# Delete Person

Delete **Person**

**DELETE** : `/api/person/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "firstName": "",
  "lastName": "",
  "gsm": "",
  "email": "",
  "address": "",
  "birthday": "",
  "sex": "",
  "createdDate": "",
  "createdById": 0,
  "remark": ""
}
```
