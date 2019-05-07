export default class CreateBlog extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    const blog = document.createElement('div');
    blog.setAttribute('class', 'blog');


    const title = document.createElement('div');
    title.setAttribute('class', 'title');
    title.setAttribute('contentEditable', 'true');
    title.innerText = 'title';

    const subtitle = document.createElement('div');
    subtitle.setAttribute('class', 'subtitle');

    const author = document.createElement('div');
    author.setAttribute('class', 'author');
    author.innerText = 'moi';

    window.stores.user.attach(user => {
      if (user) {
        author.innerText = user.username;
      }
    });

    const created = document.createElement('div');
    created.setAttribute('class', 'created');
    created.innerText = (new Date(Date.now())).toDateString();
    const updateCreatedTime = () => setInterval(() => {
      created.innerText = (new Date(Date.now())).toDateString()
    }, 1000);
    let createdInternval = updateCreatedTime();

    subtitle.appendChild(author);
    subtitle.appendChild(created);

    const summary = document.createElement('div');
    summary.setAttribute('class', 'summary');
    summary.setAttribute('contentEditable', 'true');
    summary.innerText = 'summary';

    const body = document.createElement('div');
    body.setAttribute('class', 'body');
    body.setAttribute('contentEditable', 'true');
    body.innerText = 'body';

    const save = document.createElement('button');
    save.innerText = 'Save';
    save.addEventListener('click', () => {
      title.removeAttribute('contentEditable');
      summary.removeAttribute('contentEditable');
      body.removeAttribute('contentEditable');

      clearInterval(createdInternval);
      save.disabled = true;
      save.innerText = 'Saving...';

      fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.innerText,
          htmlTitle: title.innerHTML,
          summary: summary.innerText,
          htmlSummary: summary.innerHTML,
          content: body.innerText,
          htmlContent: body.innerHTML
        })
      })
        .then(res => { return res.json() })
        .then(res => {
          if (res.error || res.errors) {
            alert(JSON.stringify(res));
            title.setAttribute('contentEditable', 'true');
            summary.setAttribute('contentEditable', 'true');
            body.setAttribute('contentEditable', 'true');

            createdInternval = updateCreatedTime();
            save.disabled = false;
            save.innerText = 'Save';
          } else {
            window.stores.blogs.load();
            window.history.pushState(undefined, undefined, `/blog/${res}`);
          }
        });
    });

    blog.appendChild(title);
    blog.appendChild(subtitle);
    blog.appendChild(summary);
    blog.appendChild(body);
    blog.appendChild(save);

    container.appendChild(blog);

    shadow.appendChild(container);
  }
}
