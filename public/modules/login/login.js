export default class Login extends HTMLElement {
  constructor() {
    super();
    
    const shadow = this.attachShadow({ mode: 'open' });
    
    const container = document.createElement('div');
    container.setAttribute('class', 'login');
    
    const username = document.createElement('input');
    username.type = 'text';
    username.placeholder = 'username';
    
    const password = document.createElement('input');
    password.type = 'password';
    password.placeholder = 'password';
    
    const login = document.createElement('button');
    login.innerText = 'login';
    login.addEventListener('click', () => {
      username.disabled = true;
      password.disabled = true;
      login.disabled = true;
      
      fetch(`/api/salt/${username.value}`)
        .then(res => res.json())
        .then(async (salt) => {
          const encoder = new TextEncoder('utf-8');

          const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password.value),
            'PBKDF2',
            false,
            ['deriveBits']
          );
          password.value = '';

          const token = await window.crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
            keyMaterial,
            64*8
          );

          const cipherHex = Array
            .from(new Uint8Array(token))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

          await fetch(`/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: username.value,
              password: cipherHex
            })
          });

          this.dispatchEvent(new Event('loggedin'));
        })
    });
    
    container.appendChild(username);
    container.appendChild(password);
    container.appendChild(login);
    
    shadow.appendChild(container);
  }
}
