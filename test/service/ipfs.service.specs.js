import {addIPFS} from "../../app/service/ipfs.service";

describe('IPFS Service Test', () => {
  it('addIPFS', async function addIPFSTest() {
    console.log(await addIPFS({test: '12343948'}));
  });
});
