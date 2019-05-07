export const routes = ({ routers: { $public, $authed }, database }) => {
  $public.get('/whoami', (req, res) => {
    res.status(200).json(req.user ? {
      username: req.user.username,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
    } : false);
  });
  
  $public.get('/user/:username', (req, res) => {
    const results = database.get({ type: 'user', id: req.param.username });
    
    const user = results[req.param.username];
    
    if (!user) {
      return res.status(404).json({
        error: 'not found'
      });
    }
    
    res.status(200).json({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    });
  });
  
  $authed.put('/user/:username', (req, res) => {
    const data = req.body;
    
    if (!data.email) {
      return res.status(400).json({
        error: 'email required'
      });
    }
    
    database.put({ type: 'user', id: req.param.username, value: {
      username: req.param.username,
      ...data
    } });
    
    res.status(204).end();
  });
  
  $public.post('/user', (req, res) => {
    const data = req.body;
    
    const errors = [];
    
    if (!data.username) { errors.push('username required'); }
    if (!data.password) { errors.push('password required'); }
    if (!data.email) { errors.push('email required'); }
    if (!data.firstname) { errors.push('firstname required'); }
    if (!data.lastname) { errors.push('lastname required'); }
    
    if (errors.length <= 0) {
      const results = database.get({ type: 'user', id: data.username });
      
      if (results[data.username]) { errors.push('username taken'); }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    
    database.put({ type: 'user', id: data.username, value: data });
    
    res.status(201).json({});
  });
};
