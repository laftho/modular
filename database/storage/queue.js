export class LatentPromiseChainQueue {
  constructor() {
    this.chain = Promise.resolve();
    this.pending = 0;
  }
  
  enqueue(promise) {
    const self = this;
    this.chain.then(async () => {
      self.pending += 1;
      await promise;
      self.pending -= 1;
    });
  }
  
  async sync(timeout = 3000) {
    const self = this;
    return new Promise((resolve, reject) => {
      const timeoutAt = Date.now() + timeout;
      const interval = setInterval(() => {
        if (self.pending <= 0) {
          clearInterval(interval);
          return resolve();
        }
        
        if (Date.now() > timeoutAt) {
          return reject(new Error('timed out '));
        }
      }, 1);
    });
  }
}
