import modules from './modules/index.js';

Object.keys(modules.components)
  .forEach(name => customElements.define(`app-${name.toLowerCase()}`, modules.components[name]));

window.stores = Object.keys(modules.stores).reduce((stores, key) => {
  stores[key] = new (modules.stores[key])();

  return stores;
}, {});

(function (history) {
  const pushState = history.pushState;
  history.pushState = function (state) {
    const result = pushState.apply(history, arguments);

    if (typeof history.onpushstate == "function") {
      history.onpushstate(...arguments);
    }

    return result;
  };
})(window.history);

const routes = (location) => {
  const route = modules.routes.find(route => route.path(location));
  const content = document.getElementById('content');

  if (route) {
    content.replaceChild(new (route.component)(), content.firstChild);
  } else {
    const notfound = document.createElement('p');
    notfound.innerText = 'Not Found';
    content.replaceChild(notfound, content.firstChild);
  }
};

history.onpushstate = (state, _, location) => {
  routes(location);
};

function init() {
  const userControls = document.getElementById('usercontrols');
  userControls.appendChild(document.createElement('app-whoami'));

  const nav = document.getElementById('nav');
  nav.appendChild(document.createElement('app-bloglist'));

  routes(window.location.pathname);
}

window.app = {
  ...(window.app || {}),
  init: init
};
