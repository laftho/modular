import Store from '../../store.js';

export default class User extends Store {
  constructor() {
    super({});

    this.load();
  }

  async load() {
    const res = await fetch(`/api/whoami`);
    const user = await res.json();

    await this.update(user);
  }
}
