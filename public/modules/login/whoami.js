import Login from './login.js';
import Logout from './logout.js';

export default class Whoami extends HTMLElement {
  constructor() {
    super();
    
    const shadow = this.attachShadow({ mode: 'open' });
    
    const loading = document.createElement('div');
    loading.innerText = 'loading...';
    shadow.appendChild(loading);

    window.stores.user.attach(user => {
      if (!user) {
        const login = new Login();
        login.addEventListener('loggedin', () => { window.stores.user.load(); });
        shadow.replaceChild(login, shadow.firstChild);
      } else {
        const logout = new Logout(user);
        logout.addEventListener('loggedout', () => { window.stores.user.load(); });
        shadow.replaceChild(logout, shadow.firstChild);
      }
    });
  }
}
