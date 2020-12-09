# Process Internal Image

**GET** : `/api/image/{image_uuid}`

**Params**:

 - image_uuid: Image UUID (table assets.fileId)

**Process**
 - Check image id is valid, belong to current user and company.

**Success Response**
 - Content-type: image/{{file_type}}

**Reference**
 - https://stackoverflow.com/questions/5823722/how-to-serve-an-image-using-nodejs
