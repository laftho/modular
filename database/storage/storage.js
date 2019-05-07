export default class Storage {
  constructor(options = {}) {
    this.options = options;
  }
  
  async attach() {
    throw new Error('Not implemented');
  }
  
  async dettach() {
    throw new Error('Not implemented');
  }
  
  serialize() {
    throw new Error('Not implemented');
  }
  
  deserialize() {
    throw new Error('Not implemented');
  }
}
