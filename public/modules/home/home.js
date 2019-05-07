import BlogList from '../blog/list.js';

export default class Home extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.setAttribute('class', 'home');

    const loading = document.createElement('div');
    loading.innerText = 'Loading...';
    container.appendChild(loading);

    window.stores.blogs.attach(blogs => {
      const list = document.createElement('div');

      Object.keys(blogs).forEach(key => {
        const blog = blogs[key];
        const item = document.createElement('div');
        item.setAttribute('class', 'blogSummary');
        item.addEventListener('click', () => {
          history.pushState(undefined, undefined, `/blog/${key}`);
        });

        const title = document.createElement('div');
        title.setAttribute('class', 'title');
        title.innerText = blog.title;

        const summary = document.createElement('div');
        summary.setAttribute('class', 'summary');
        summary.innerText = blog.summary;

        item.appendChild(title);
        item.appendChild(summary);

        list.appendChild(item);
      });

      container.replaceChild(list, container.firstChild);
    });

    shadow.appendChild(container);
  }
}
