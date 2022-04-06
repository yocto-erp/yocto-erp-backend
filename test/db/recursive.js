import {removeAssets} from "../../app/service/asset/asset.service";

describe('recursive query.queue.js', () => {
  it('test', async () => {
    await removeAssets({companyId: 2}, 11)
  });
});
