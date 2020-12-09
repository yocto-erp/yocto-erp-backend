# Search Warehouse

Return list of Warehouse for displaying on table.

**GET** : `/api/warehouse?search=`

**Params**:

 - name: User input search string

**Success Response**
```json
{
  "count": "integer",
  "rows": [
    {
      "id": 1,
      "name": "",
      "address": "",
      "userId": "",
      "companyId": ""
    }
  ]
}
```


# Create Warehouse

Create **Warehouse ** for one company to one warehouse

**POST** : `/api/warehouse`

**Form Data**

```json
{
  "name": "string (max 250)",
  "address": "string",
  "userId": "integer",
  "companyId": "integer"
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
  "address": "",
  "userId": "",
  "companyId": ""
}
```

**Process**

 - Validate input form.
 - Create record.
 - Event for updating warehouse.

**Success Response**

Code : `200`

```json
{
    "id": 123,
    "name": "abc",
    "address": "09 ung van khiem",
    "userId": 1,
    "companyId": 1
}
```

# Get Warehouse

Get ** Warehouse ** by ID

**GET** : `/api/warehouse/{id}`

**Success Response**

Code : `200`

```json
{
  "id": 123,
  "name": "abc",
  "address": "09 ung van khiem",
  "userId": 1,
  "companyId": 1
}
```

# Update Warehouse

Update ** Warehouse **

**POST** : `/api/warehouse/{id}`

**Form Data**

```json
{
  "name": "string (max 250)",
  "address": "string",
  "userId": "integer",
  "companyId": "integer"
}
```

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Validate input form.
 - Update record.
 - Event for updating warehouse.


**Success Response**

Code : `200`

```json
{
    "name": "string (max 250)",
    "address": "string",
    "userId": "integer",
    "companyId": "integer"
}
```

# Delete Warehouse

Delete **Warehouse**

**DELETE** : `/api/warehouse/{id}`

**Process**
 - Check user permission (check owner or full), if owner check id is belong to user or not.
 - Delete record.

**Event**
 - Delete Warehouse

**Success Response**

Code : `200`
