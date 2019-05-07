import { DiskStorage } from './storage/index.js';
import uuidv4 from 'uuid/v4.js';

class Database {
  constructor({ storage = new DiskStorage() } = {}) {
    this.storage = storage;
  }
  
  async connect() {
    await this.storage.attach();
    
    this.store = this.storage.deserialize();
  }
  
  async disconnect() {
    this.sync();
    return this.storage.dettach();
  }
  
  sync() {
    this.storage.serialize(this.store);
  }
  
  put({ type, id = uuidv4(), value }) {
    if (!this.store[type]) {
      this.store[type] = {};
    }
    
    this.store[type][id] = value;
    
    this.sync();
    
    return id;
  }
  
  delete({ type, id } = {}) {
    if (!type) {
      this.store = {};
      
      return;
    }
    
    if (!this.store[type]) {
      return;
    }
    
    if (this.store[type] && !id) {
      delete this.store[type];
      
      return;
    }
    
    delete this.store[type][id];
    
    this.sync();
  }
  
  get({ type, id } = {}) {
    if (!id || !type || !this.store[type] || !this.store[type][id]) {
      return {};
    }
    
    return {
      [id]: this.store[type][id]
    };
  }
  
  select({ type, match } = {}) {
    if (!type) {
      return {};
    }
    
    if (!this.store[type]) {
      return {};
    }
    
    if (!match) {
      return this.store[type] || {};
    }
    
    const matchType = Array.isArray(match) ? 'array' : typeof match;
    const matchKeys = Object.keys(match);
    
    return Object.keys(this.store[type]).reduce((results, identity) => {
      const item = this.store[type][identity];
      
      switch(matchType) {
        case 'string':
        case 'boolean':
        case 'number':
          if (Object.keys(item).some(key => item[key] === match)) {
            results[identity] = item;
          } 
          break;
        case 'object':
          if (Object.keys(item).some(key => matchKeys.includes(key) && item[key] === match[key])) {
            results[identity] = item;
          }
          break;
        case 'array':
          if (Object.keys(item).some(key => match.includes(item[key]))) {
            results[identity] = item;
          }
          break;
        case 'function':
          if (Object.keys(item).some(key => match(key, item[key], item))) {
            results[identity] = item;
          }
        default: // unsupported type symbol|undefined
          return results;
      }
      
      return results;
    }, {});
  }
}

export default Database;
