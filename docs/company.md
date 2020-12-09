# Company

When company purchase product or selling, we will work with a partner or client company. So we need a module to store this information.

## Search Company

Return list of Company.

**GET** : `/api/company?search=""&page&size&sorts`

**Params**:

 - search: Search By Name, Phone
 - page,size,sort: Paging Parameters

**Success Response**
```json
{
  "count": "integer",
  "rows": [
    {
      "id": 123,
      "name": "",
      "gsm": "",
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

# Create Company

Create **Company**.

**POST** : `/api/company`

**Form Data**

```json
{
  "name *": "string (max 150, required)",
  "remark": "string",
  "gsm": "",
  "address": ""
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
  "name": "",
  "gsm": "",
  "createdDate": "",
  "createdById": "",
  "remark": ""
}
```

# Get Company

Get **Company**

**GET** : `/api/company/{id}`

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "gsm": "",
  "createdDate": "",
  "createdById": "",
  "remark": ""
}
```

# Update Company

Update **Company**

**POST** : `/api/company/{id}`

**Form Data**

```json
{
  "name *": "string (max 150, required)",
  "remark": "string",
  "gsm": "",
  "address": ""
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
  "name": "",
  "gsm": "",
  "createdDate": "",
  "createdById": "",
  "remark": ""
}
```

# Delete Company

Delete **Company** for one company

**DELETE** : `/api/company/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "gsm": "",
  "createdDate": "",
  "createdById": "",
  "remark": ""
}
```
