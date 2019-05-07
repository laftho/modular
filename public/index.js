import { Blogs, loadBlogs, topBlogs } from "./modules/blog/blog.js";
// import { whoami } from "./login.js";

import modules from './modules/index.js';

Object.keys(modules.components).forEach(name => customElements.define(`app-${name.toLowerCase()}`, modules.components[name]));

const routes = () => {
  if (window.location.pathname === '/blog' || window.location.pathname === '/blog/') {
    makeBlog();
  } else if (window.location.pathname.startsWith('/blog')) {
    blog();
  } else {
    home();
  }
};

function init() {
  window.blogs = new Blogs();
  loadBlogs();
  topBlogs();

  // whoami();
  
  const userControls = document.getElementById('usercontrols');
  userControls.appendChild(document.createElement('app-whoami'));

  routes();
}

function navTo(path) {
  history.pushState(undefined, undefined, path);
  init();
}

(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        // ... whatever else you want to do
        // maybe call onhashchange e.handler
        return pushState.apply(history, arguments);
    };
})(window.history);

history.onpushstate = event => {
  routes();
};


function home() {
  const content = document.getElementById('content');
  
  content.innerHTML = `<h2>Home</h2>`;
}

window.app = {
  ...(window.app || {}),
  init: init
};
