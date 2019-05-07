import fs from 'fs';
import path from 'path';

import Storage from './storage.js';
import { LatentPromiseChainQueue } from './queue.js';

export class DiskStorage extends Storage {
  constructor(options = {}) {
    super({
      ...options,
      path: options.path || process.cwd(),
      encoding: options.encoding || 'utf8'
    });
    
    this.file = path.join(this.options.path, './data/store.json');
    
    this.queue = new LatentPromiseChainQueue();
  }
  
  async attach() {
    const self = this;
    return new Promise((resolve, reject) => {
      fs.open(self.file, 'a+', (err, fd) => {
        if (err) {
          return reject(err);
        }

        fs.closeSync(fd);

        resolve();
      });
    });
  }
  
  async dettach() {
    return this.queue.sync();
  }
  
  serialize(data) {
    const self = this;
    this.queue.enqueue(new Promise((resolve, reject) => {
      const content = JSON.stringify(data);
      
      fs.writeFile(self.file, Buffer.from(content, this.options.encoding), err => {
        if (err) {
          console.log(err.message);
          return reject(err);
        }
        
        resolve();
      });
    }));
  }
  
  deserialize() {
    const content = fs.readFileSync(this.file, this.options.encoding) || '{}';
    
    try {
      return JSON.parse(content);
    } catch(e) {
      console.log(e.message);
      throw e;
    }
  }
}
