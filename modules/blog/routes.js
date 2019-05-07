export const routes = ({ routers: { $public, $authed }, database }) => {
  $public.get('/blogs', (req, res) => {
    const results = database.select({ type: 'blog' });
    
    res.status(200).json(results);
  });
  
  $public.get('/blog/:id', (req, res) => {
    const results = database.get({ type: 'blog', id: req.params.id });
    
    const blog = results[req.params.id];
    
    if (!blog) {
      return res.status(404).json({ error: 'not found' });
    }
    
    res.status(200).json(blog);
  });
  
  $authed.post('/blog', (req, res) => {
    const data = req.body;
    
    const errors = [];
    
    if (!data.title) { errors.push('title required'); }
    if (!data.content) { errors.push('content required'); }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    
    data.summary = data.summary || data.content.substring(0, data.content.indexOf('\n'));
    
    const result = database.put({
      type: 'blog',
      value: {
        ...data,
        author: req.user.username,
        created: Date.now()
      }
    });
    
    res.status(200).json(result);
  });
  
};
