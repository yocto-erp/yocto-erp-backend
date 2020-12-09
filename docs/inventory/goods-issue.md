# Create Goods Issue Note

Create **Goods Issue Note** for one company to one warehouse

**POST** : `/api/inventory/goods-issue`

**Form Data**

```json
{
  "warehouseId": "bigInteger",
  "name": "string (max 250)",
  "remark": "string",
  "purposeId": "integer",
  "relativeId": "integer",
  "processedDate": "javascript date string, must smaller than current date time.",
  "details": [
    {
      "productId": "big integer",
      "unitId": "integer",
      "quantity": "decimal",
      "remark": ""
    }
  ]
}
```

**Process**

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
  "createdDate": "",
  "purposeId": "integer",
  "relativeId": "integer",
  "totalProduct": "",
  "remark": "",
  "processedDate": ""
}
```

# Get Goods Issue Note

Get **Goods Issue Note** by ID

**GET** : `/api/inventory/goods-issue/{id}`

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "createdDate": "",
  "purposeId": "integer",
  "relativeId": "integer",
  "relation": {
    "id": "integer",
    "name": "string",
    "more": "..."
  },
  "totalProduct": "",
  "remark": "",
  "processedDate": "",
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
      "remark": ""
    }
  ]
}
```

# Update Goods Receipt Note

Update **Goods Issuee Note** for one company to one warehouse

**POST** : `/api/inventory/goods-issue/{id}`

**Form Data**

```json
{
  "warehouseId": "bigInteger",
  "name": "string (max 250)",
  "remark": "string",
  "purposeId": "integer",
  "relativeId": "integer",
  "processedDate": "javascript date string, must smaller than current date time.",
  "details": [
    {
      "productId": "big integer",
      "unitId": "integer",
      "quantity": "decimal",
      "remark": ""
    }
  ]
}
```

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Validate input form.
 - Update record.
 - Event for updating inventory.

**Event**
 - Update Inventory (old, new)
 - Old: Old Goods Receipt Note
 - New: New Goods Receipt Note

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "createdDate": "",
  "purposeId": "integer",
  "relativeId": "integer",
  "totalProduct": "",
  "remark": "",
  "processedDate": ""
}
```

# Delete Goods Issue Note

Delete **Goods Issue Note** for one company to one warehouse

**DELETE** : `/api/inventory/goods-issue/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.
 - Event for updating inventory.

**Event**
 - Delete Inventory (issueNote)

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "type": "",
  "createdDate": "",
  "purposeId": "integer",
  "relativeId": "integer",
  "totalProduct": "",
  "remark": "",
  "processedDate": ""
}
```
