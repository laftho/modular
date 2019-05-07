export default class LoggedIn extends HTMLElement {
  constructor(user) {
    super();
    
    const shadow = this.attachShadow({ mode: 'open' });
    
    const container = document.createElement('div');
    container.setAttribute('class', 'loggedin');
    
    const username = document.createElement('div');
    username.setAttribute('class', 'user');
    username.innerText = user.username;
    
    const logout = document.createElement('button');
    logout.innerText = 'logout';
    logout.addEventListener('click', () => {
      fetch(`/api/logout`).then((res) => { this.dispatchEvent(new Event('loggedout')); });
    });
    
    const createBlog = document.createElement('button');
    createBlog.innerText = 'Create Blog';
    createBlog.addEventListener('click', () => {
      history.pushState(undefined, undefined, '/blog');
    });
    
    container.appendChild(username);
    container.appendChild(logout);
    container.appendChild(createBlog);
    
    shadow.appendChild(container);
  }
}
