# Search Sale Order

Return list of Sale Order.

**GET** : `/api/order/sale?search=""&partnerCompanyId&partnerPersonId&startDate&endDate`

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
      "totalAmount": "number",
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
      "remark": ""
    }
  ]
}
```

# Create Sale Order

Create **Sale Order Note** for one company.

**POST** : `/api/order/sale`

**Form Data**

```json
{
  "name": "string (max 150)",
  "remark": "string",
  "partnerCompanyId": "bigInteger",
  "partnerPersonId": "bigInteger",
  "processedDate": "javascript date string, must smaller than current date time.",
  "details": [
    {
      "productId": "big integer",
      "unitId": "integer",
      "quantity": "decimal",
      "price": "decimal",
      "remark": ""
    }
  ]
}
```


**Process**

 - Validate input form.
 - Create assets. (store to Local Hard Disk with file name = UUID)
 - Create record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "totalAmount": "number",
  "partnerCompanyId": "number",
  "partnerPersonId": "number",
  "processedDate": "",
  "createdDate": "",
  "remark": ""
}
```

# Get Sale Order Note

Get **Sale Order**

**GET** : `/api/order/sale/{id}`

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "totalAmount": "number",
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
  "remark": "",
  "details": [
    {
      "product": {
        "id": "",
        "name": ""
      },
      "unit": {
        "id": "integer",
        "name": "string"
      },
      "quantity": "decimal",
      "price": "decimal",
      "remark": ""
    }
  ]
}
```

# Update Sale Order

Update **Sale Order**

**POST** : `/api/order/sale/{id}`

**Form Data**

```json
{
  "name": "string (max 150)",
  "remark": "string",
  "partnerCompanyId": "bigInteger",
  "partnerPersonId": "bigInteger",
  "processedDate": "javascript date string, must smaller than current date time.",
  "details": [
    {
      "productId": "big integer",
      "unitId": "integer",
      "quantity": "decimal",
      "price": "decimal",
      "remark": ""
    }
  ]
}
```

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Validate input form.
 - Create record.
 - Event for updating inventory.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "totalAmount": "number",
  "partnerCompanyId": "number",
  "partnerPersonId": "number",
  "processedDate": "",
  "createdDate": "",
  "remark": ""
}
```

# Delete Sale Order

Delete **Goods Receipt Note** for one company to one warehouse

**DELETE** : `/api/order/sale/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.
 - Event for updating inventory.

**Event**
 - Delete Inventory (receiptNote)

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "totalAmount": "number",
  "partnerCompanyId": "number",
  "partnerPersonId": "number",
  "processedDate": "",
  "createdDate": "",
  "remark": ""
}
```
