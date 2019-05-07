import BlogList from './list.js';
import Blog from './blog.js';
import Blogs from './blogs.js';
import CreateBlog from './create.js';
import routes from './routes.js';

export default {
  components: {
    BlogList: BlogList,
    CreateBlog: CreateBlog,
    Blog: Blog
  },
  stores: {
    blogs: Blogs
  },
  routes: routes
};
