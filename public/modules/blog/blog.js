export default class Blog extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    const loading = document.createElement('div');
    loading.innerText = 'Loading...';
    container.appendChild(loading);

    const notfound = () => {
      const el = document.createElement('div');
      el.innerText = 'Blog does not exist';
      container.replaceChild(el, container.firstChild);
    };

    window.stores.blogs.attach(blogs => {
      if (!window.location.pathname.startsWith('/blog')) {
        notfound();
        return;
      }

      const id = window.location.pathname.split('/blog/')[1];

      const blog = blogs[id];

      if (!blog) {
        notfound();
        return;
      }

      const blogel = document.createElement('div');
      blogel.setAttribute('class', 'blog');


      const title = document.createElement('div');
      title.setAttribute('class', 'title');
      title.innerHTML = blog.htmlTitle;

      const subtitle = document.createElement('div');
      subtitle.setAttribute('class', 'subtitle');

      const author = document.createElement('div');
      author.setAttribute('class', 'author');
      author.innerText = blog.author;

      const created = document.createElement('div');
      created.setAttribute('class', 'created');
      created.innerText = new Date(blog.created).toDateString();

      subtitle.appendChild(author);
      subtitle.appendChild(created);

      const summary = document.createElement('div');
      summary.setAttribute('class', 'summary');
      summary.innerHTML = blog.htmlSummary;

      const body = document.createElement('div');
      body.setAttribute('class', 'body');
      body.innerHTML = blog.htmlContent;

      blogel.appendChild(title);
      blogel.appendChild(subtitle);
      blogel.appendChild(summary);
      blogel.appendChild(body);

      const controls = document.createElement('div');
      const empty = document.createElement('div');
      controls.appendChild(empty);

      blogel.appendChild(controls);

      window.stores.user.attach(user => {
        if (!user || user.username !== blog.author) {
          controls.replaceChild(empty, controls.firstChild);
          return;
        }

        const del = document.createElement('button');
        del.innerText = 'Delete';
        del.addEventListener('click', async () => {
          del.disabled = true;
          del.innerText = 'Deleting...';
          await fetch(`/api/blog/${id}`, {
            method: 'DELETE'
          });

          window.stores.blogs.load();
          window.history.pushState(undefined, undefined, '/');
        });

        controls.replaceChild(del, controls.firstChild);
      });

      container.replaceChild(blogel, container.firstChild);
    });

    shadow.appendChild(container);
  }
}
