import {TaggingQueue} from "../../app/queue/tagging.queue";

describe('tagging.queue.js', () => {
  it('Create', async () => {
    const promise = [];
    for (let i = 0; i < 1; i += 1) {
      promise.push(new Promise(resolve => {
        TaggingQueue.push(null, function cb(err, result) {
          console.log('Result:', result);
          resolve(result);
        });
      }))
    }

    await Promise.all(promise);
  });
});
