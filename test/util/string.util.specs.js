import { paddingLeft } from '../../app/util/string.util';

describe('String test', () => {
  it('paddingLeft', async function testImage() {
    console.log(paddingLeft('', 6));
    console.log(paddingLeft('123456', 6));
    console.log(paddingLeft('1234567', 6));
  });
});
