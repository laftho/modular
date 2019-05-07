import Blog from './blog.js';
import CreateBlog from './create.js';

export default [{
  path: location => location === '/blog',
  component: CreateBlog
}, {
  path: location => location.startsWith('/blog/'),
  component: Blog
}];
