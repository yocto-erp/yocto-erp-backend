import { listProduct } from '../../app/service/product/product.service';

describe('product.service', () => {
  it('list', async function renderTemplate() {
    console.log(JSON.stringify(await listProduct({companyId: 3}, {  }, { limit: 2, offset: 0, order: [['name', 'desc']] })));
  });
});
