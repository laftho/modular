export default class Store {
  constructor(data = null) {
    this.data = data;
    this.subscribers = {};
  }

  attach(subscriber) {
    this.subscribers[subscriber] = subscriber;

    const data = JSON.parse(JSON.stringify(this.data || null));

    subscriber(data);
  }

  async propagate() {
    const subscribers = this.subscribers;
    const data = JSON.parse(JSON.stringify(this.data || null));

    for(const subscriber of Object.values(subscribers)) {
      await subscriber(data);
    }
  }

  async update(data) {
    this.data = data;

    await this.propagate();
  }
}
