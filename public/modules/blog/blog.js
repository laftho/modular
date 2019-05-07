export class Blogs {
  constructor() {
    this.list = {};
    this.listeners = {};
  }
  
  on(event, listener) {
    if (!this.listeners[event]) this.listeners[event] = {};
    
    this.listeners[event][listener] = listener;
  }
  
  remove(event, listener) {
    delete this.listeners[event][listener];
  }
  
  emit(event, args) {
    if (!this.listeners[event]) {
      return;
    }
    
    Object.values(this.listeners[event]).forEach(listener => {
      try {
        listener(args);
      } catch(e) {
        console.log(e);
      }
    });
  }
}

export function loadBlogs() {
  fetch(`/api/blogs`)
    .then(res => { return res.json() })
    .then(blogs => {
      window.blogs.list = blogs;
      window.blogs.emit('updated');
    });
}

export function blog() {
  const id = window.location.pathname.split('/blog/')[1];
  const content = document.getElementById('content');
  
  content.innerHTML = 'loading...';
  
  
  fetch(`/api/blog/${id}`)
    .then((res) => { return res.json() })
    .then(blog => {
      content.innerHTML = `
        <div id="title" class="title">${blog.htmlTitle}</div>
        <div class="subtitle">
          <div class="author">${blog.author}</div>
          <div class="created">${new Date(blog.created).toDateString()}</div>
        </div>
        <div id="summary" class="summary">${blog.htmlSummary}</div>
        <div id="body" class="body">${blog.htmlContent}</div>
      `;
    });
}

export function topBlogs() {
  window.blogs.on('updated', () => {
    const navitems = document.getElementById('navitems');
    
    navitems.innerHTML = Object.keys(window.blogs.list).reduce((acc, key) => {
      acc += `<li onClick="navTo('/blog/${key}')">${window.blogs.list[key].title}</li>`;
      return acc;
    }, '');
    
  });
}

export function makeBlog() {
  const content = document.getElementById('content');
  
  content.innerHTML = `
    <div id="title" class="title" contentEditable="true">Title</div>
    <div class="subtitle">
      <div class="author">moi</div>
    </div>
    <div id="summary" class="summary" contentEditable="true">summary</div>
    <div id="body" class="body" contentEditable="true">content</div>
    <button onClick='saveBlog()'>Save</button>
  `;
}

function saveBlog(id) {
  
  const title = document.getElementById('title');
  const summary = document.getElementById('summary');
  const content = document.getElementById('body');
  
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
      content: content.innerText,
      htmlContent: content.innerHTML
    })
  })
    .then(res => { return res.json() })
    .then(res => {
      if (res.error || res.errors) {
        alert(JSON.stringify(res));
      } else {
        navTo(`/blog/${res}`);
      }
    });
    
}
