import uuidv4 from 'uuid/v4.js';
import crypto from 'crypto';
import passport from 'passport';
import LocalStrategy from 'passport-local';

export const authentication = ({ app, routers: { $public, $authed }, database }) => {
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy.Strategy((username, password, done) => {
    const users = database.get({ type: 'user', id: username });
    
    const user = users[username];
    
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    
    const key = crypto.scryptSync(password, user.salt, 64);
    
    if (key.toString('hex') !== user.password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    
    return done(null, user);
  }));
  
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    done(undefined, database.get({ type: 'user', id: username })[username]);
  });

  $public.post('/login', passport.authenticate('local', { successRedirect: '/' }));
  
  $public.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
  
  $authed.use((req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ error: 'unauthorized' });
    }
    
    next();
  });
  
  $public.get('/salt/:name', (req, res) => {
    const results = database.get({ type: 'salt', id: req.params.name });
    
    let salt = results[req.params.name];
    
    if (!salt) {
      salt = uuidv4();
      
      database.put({ type: 'salt', id: req.params.name, value: salt });
    }

    res.status(200).json(salt);
  });
};

export default authentication;
