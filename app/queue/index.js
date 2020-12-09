/*
import {eventLog} from "../config/winston_new";

const Queue = require('bull');

const {setQueues} = require('bull-board');

const REDIS_URL = 'redis://127.0.0.1:6379';
const Redis = require('ioredis');

const client = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

export const QUEUE_OPTS = {
  createClient: function createClient(type) {
    switch (type) {
      case 'client':
        return client;
      case 'subscriber':
        return subscriber;
      default:
        return new Redis(REDIS_URL);
    }
  }
};


export function queueInit() {
  const testQueue = new Queue('test', QUEUE_OPTS);
  testQueue.process(function(job, done) {
    eventLog.info(`Process ${JSON.stringify(job.data)}`);
    done();
  });
  testQueue.on("global:completed", (job, result) => {

  });

  testQueue.on("global:failed", (job, error) => {

  });

  testQueue.on('global:stalled', (job) => {

  });

  setQueues([testQueue]);
}
*/
