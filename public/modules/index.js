import login from './login/index.js';
import blog from './blog/index.js';
import home from './home/index.js';

export default {
  components: {
    ...login.components,
    ...blog.components,
    ...home.components
  },
  routes: [
    ...blog.routes,
    ...home.routes
  ],
  stores: {
    ...blog.stores,
    ...login.stores
  }
};
