import Store from '../../store.js';

export default class Blogs extends Store {
  constructor() {
    super({});

    this.load();
  }

  async load() {
    const res = await fetch(`/api/blogs`);
    const blogs = await res.json();

    await this.update(blogs);
  }
}
