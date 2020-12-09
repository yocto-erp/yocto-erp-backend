import {InventoryQueue} from "../../app/queue/inventory.queue";

describe('inventory.queue.js', () => {
  it('Create', async () => {
    const promise = [];
    for (let i = 0; i < 10; i += 1) {
      promise.push(new Promise(resolve => {
        InventoryQueue.push(i, function cb(err, result) {
          console.log(`Result: ${result}`);
          resolve(result);
        });
      }))
    }

    await Promise.all(promise);
  });
});
