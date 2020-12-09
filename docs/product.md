Manage all product in company, at the moment we only support:
  - Real product

# Search Product

Return list of product.

**GET** : `/api/product?search=""`

**Params**:

 - search: Search By Name

**Success Response**
```json
{
  "count": "integer",
  "rows": [
    {
      "id": 123,
      "name": "",
      "imageId": "",
      "priceBaseUnit": "number",
      "remark":"",
      "lastModifiedDate": "",
      "createdDate": "",
      "createdBy": {
        "id": "",
        "name": ""
      }
    }
  ]
}
```

# Create Product

Create **Product** for one company.

**POST** : `/api/product`

**Form Data**

```json
{
  "name": "string (max 250)",
  "remark": "string",
  "priceBaseUnit": "number",
  "assets": [
    {
      "name": "",
      "type": "",
      "ext": "",
      "size": "",
      "data": "base64_1"
    }, {
      "name": "",
      "type": "",
      "ext": "",
      "size": "",
      "data": "base64_2"
    }
  ],
  "units": [
    {"name": "Cai", "rate": 1},
    {"name": "Thung", "rate": 10}
  ]
}
```

 - Rate = 1: Mean base unit.

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
  "priceBaseUnit": "",
  "createdDate": "",
  "remark": ""
}
```

# Get Product

Get **Product**

**GET** : `/api/product/{id}`

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "priceBaseUnit": "",
  "createdDate": "",
  "remark": "",
  "assets": [
    {
      "name": "",
      "type": "",
      "size": "",
      "fileId": "Assets.fileId",
      "source": "server"
    }
  ],
  "units": [
    {"name": "", "rate": ""}
  ]
}
```

# Update Product

Update **Product**

**POST** : `/api/product/{id}`

**Form Data**

```json
{
  "name": "string (max 250)",
  "remark": "string",
  "priceBaseUnit": "number",
  "assets": [
    {
      "name": "",
      "type": "",
      "size": "",
      "data": "base64_1"
    }, {
      "name": "",
      "type": "",
      "size": "",
      "data": "base64_2"
    }
  ],
  "units": [
    {"name": "Cai", "rate": 1},
    {"name": "Thung", "rate": 10}
  ]
}
```

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Validate input form.
 - Update record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "priceBaseUnit": "",
  "createdDate": "",
  "remark": ""
}
```

# Update Product Units

**POST** : `/api/product/{id}/units`

**Form Data**

```json
[
  {"name": "Cai", "rate": 1},
  {"name": "Thung", "rate": 10}
]
```

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Validate form.
 - Update product units.

**Success Response**

Code : `200`

```json
[
  {"name": "Cai", "rate": 1},
  {"name": "Thung", "rate": 10}
]
```

# Delete Product

Delete **Product**

**DELETE** : `/api/product/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "",
  "priceBaseUnit": "",
  "createdDate": "",
  "remark": ""
}
```
