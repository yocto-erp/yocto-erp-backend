# Yocto ERP BackEnd

## Paging Parameter

**GET** : `URL?search=""&page=1&size=10&sort=column:dir&other=""`

**Params**:

 - search: Search String
 - other: Other filter or search depend on each api support.
 - page: Current Page
 - size: Page Size
 - Sort: sort by column with direction (ASC or DESC)

## Error Response

**Condition** : Using for form request (Create or Update).

**Code** : `400`

**Content example**

```json
{
    "name": [
        "This field is required."
    ]
}
```

