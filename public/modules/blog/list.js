export default class BlogList extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');

    const loading = document.createElement('div');
    loading.innerText = 'loading...';

    container.appendChild(loading);

    window.stores.blogs.attach(blogs => {
      const list = document.createElement('ul');
      list.setAttribute('class', 'navitems');

      Object.keys(blogs).forEach(key => {
        const item = document.createElement('li');
        item.textContent = blogs[key].title;
        item.addEventListener('click', () => {
          history.pushState(undefined, undefined, `/blog/${key}`);
        });
        list.appendChild(item);
      });

      container.replaceChild(list, container.firstChild);
    });

    shadow.appendChild(container);
  }
}
