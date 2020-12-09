Receipt, payment management in company.

# Search Receipt/Payment voucher

Return list of Receipt/Payment voucher.

**GET** : `/api/cost?search=""&partnerCompanyId&partnerPersonId&startDate&endDate`

**Params**:

 - search: Search By Name
 - partnerCompanyId: Filter by Partner CompanyId
 - partnerPersonId: Filter by Partner PersonId
 - startDate: Javascript date string
 - endDate:  Javascript date string

**Success Response**
```json
{
  "count": "integer",
  "rows": [
    {
      "id": 123,
      "name": "",
      "type": "",
      "amount": "number",
      "partnerCompany": {
        "id": "",
        "name": ""
      },
      "partnerPerson": {
        "id": "",
        "name": ""
      },
      "processedDate": "",
      "createdDate": "",
      "createdBy": {
        "id": "",
        "name": ""
      },
      "lastModifiedDate": "",
      "remark": ""
    }
  ]
}
```

# Create Receipt/Payment voucher

Create **Receipt/Payment voucher** for one company.

**POST** : `/api/cost`

**Form Data**

```json
{
  "name": "string (max 250)",
  "remark": "string",
  "type": "",
  "partnerCompanyId": "bigInteger",
  "partnerPersonId": "bigInteger",
  "processedDate": "javascript date string, must smaller than current date time.",
  "purposeId": "",
  "relativeId": "",
  "amount": "decimal",
   "assets": [
      {
        "name": "",
         "type": "",
         "size": "",
         "fileId": "Assets.fileId",
         "source": "server"
      }
    ]
}
```

**Process**

 - Validate input form.
 - Create record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "amount": "number",
  "partnerCompanyId": "number",
  "partnerPersonId": "number",
  "processedDate": "",
  "createdDate": "",
  "remark": ""
}
```

# Get Receipt/Payment voucher

Get **Receipt/Payment voucher**

**GET** : `/api/cost/{id}`

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "amount": "number",
  "partnerCompany": {
    "id": "",
    "name": ""
  },
  "partnerPerson": {
    "id": "",
    "name": ""
  },
  "processedDate": "",
  "createdDate": "",
  "lastModifiedDate": "",
  "remark": "",
    "assets": [
      {
        "name": "",
         "type": "",
         "size": "",
         "fileId": "Assets.fileId",
         "source": "server"
      }
    ]
}
```

# Update Receipt/Payment voucher

Update **Receipt/Payment voucher**

**POST** : `/api/cost/{id}`

**Form Data**

```json
{
  "name": "string (max 250)",
  "remark": "string",
  "type": "",
  "partnerCompanyId": "bigInteger",
  "partnerPersonId": "bigInteger",
  "processedDate": "javascript date string, must smaller than current date time.",
  "purposeId": "",
  "relativeId": "",
  "amount": "decimal",
   "assets": [
      {
        "name": "",
         "type": "",
         "size": "",
         "fileId": "Assets.fileId",
         "source": "server"
      }
   ]
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
  "type": "",
  "amount": "number",
  "purposeId": "number",
  "relativeId": "number",
  "partnerCompanyId": "number",
  "partnerPersonId": "number",
  "processedDate": "",
  "createdDate": "",
  "remark": ""
}
```

# Delete Receipt/Payment voucher

Delete **Receipt/Payment voucher**

**DELETE** : `/api/cost/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "amount": "number",
  "purposeId": "number",
  "relativeId": "number",
  "partnerCompanyId": "number",
  "partnerPersonId": "number",
  "processedDate": "",
  "createdDate": "",
  "remark": ""
}
```
