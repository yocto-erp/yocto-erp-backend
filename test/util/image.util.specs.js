import {isImageMimeType, isValidMimeType, MIME_TYPE} from "../../app/util/image.util";

describe('Image Test', () => {
  it('test Image', async function testImage() {
    console.log(isImageMimeType("image/gadfsif"));
  });
  it('test mul', ()=>{
    console.log(isValidMimeType(MIME_TYPE.CSV, [MIME_TYPE.AUDIO, MIME_TYPE.CSV]))
  })
});
