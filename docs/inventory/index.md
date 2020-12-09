# Search Inventory

Return list of Warehouse Goods Receipt/Issue.

**GET** : `/api/inventory?warehouseId&title&startDate&endDate`

**Params**:

 - warehouseId: Select from List of company's warehouse
 - title: User input search string
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
      "purposeId": "integer",
      "relative": {
        "id": "",
        "name": ""
      },
      "createdDate": "",
      "totalProduct": "",
      "remark": "",
      "processedDate": ""
    }
  ]
}
```



# Inventory Summary

Return list of Inventory Goods.

**GET** : `/api/inventory/summary?warehouseId&productId`

**Params**:

 - warehouseId: Select from List of company's warehouse
 - productId: Select from List of Company's Product

**Success Response**
```json
{
  "count": "integer",
  "rows": [
    {
      "id": 123,
      "name": "",
      "warehouse": {
        "id": "integer",
        "name": "string"
      },
      "product": {
        "id": "integer",
        "name": "string"
      },
      "unit": {
        "id": "integer",
        "name": "string"
      },
      "quantity": "",
      "remark": "",
      "lastModifiedDate": ""
    }
  ]
}
```

# Get Detail Inventory Summary (Product of Warehouse)

Return list of Inventory Products.

**GET** : `/api/inventory/summary/{id}`

**Params**:

 - warehouseId: Select from List of company's warehouse
 - productId: Select from List of Company's Product

**Success Response**

```json
{
  "id": 123,
  "name": "",
  "warehouse": {
    "id": "integer",
    "name": "string"
  },
  "product": {
    "id": "integer",
    "name": "string"
  },
  "unit": {
    "id": "integer",
    "name": "string"
  },
  "serials": [
    {"serial":  "string", "quantity":  "integer"}
  ],
  "quantity": "",
  "remark": "",
  "lastModifiedDate": ""
}
```
