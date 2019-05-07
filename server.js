import fs from 'fs';
import express from 'express';
import session from 'express-session';
import Database from 'modular.database';
import authenication from './authentication.js';
import modules from './modules/index.js';

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(session({ secret: 'asdf' }));
app.use(express.json());
app.use('/static', express.static('./public'));

const database = new Database();

const routers = {
  $public: express.Router(),
  $authed: express.Router()
};

const context = {
  app: app,
  routers: routers,
  database: database
};

authenication(context);

Object.keys(modules).forEach(key => modules[key].routes(context));

app.use('/api', routers.$public);
app.use('/api', routers.$authed);

app.use((req, res, next) => {
  res.type('html').status(200).send(fs.readFileSync('./public/index.html', 'utf8'));
  
  next();
}); 

const shutdown = (eventType, exitCode) => {
  console.log(eventType);
  const timeout = setTimeout(() => { process.exit(); }, 5000);
  console.log('flushing db memory');
  
  database
    .disconnect()
    .then(() => {
      clearTimeout(timeout);
      console.log('flushed');
      process.exit();
    })
    .catch((e) => {
      clearTimeout(timeout);
      console.log('err but flushed');
      console.log(e);
      process.exit();
    });
};

[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, shutdown.bind(null, eventType));
});

database.connect().then(() => {
  database.put({
    type: 'user',
    id: 'admin',
    value: {
      username: 'admin',
      salt: 'c64b84d3-f75b-48c1-ac00-d8272e214037',
      password: '4e440fe3e1d2b9ea58f94c7a7679760012e8e53b64c8b8fdf30a7ab7c80f07c61ae394cd1667c45786766a1dc796d8888bc4e7d9ef31c81da95b6cfa37d1ebe8',
      firstname: 'admin',
      lastname: 'admin',
      email: 'admin'
    }
  });
  
  database.put({
    type: 'salt',
    id: 'admin',
    value: 'b3ece49e-acf9-44de-af63-4f1460dd2d55'
  });
  
  app.listen(app.get('port'), () => {
    console.log(`listening:${app.get('port')}... `);
  });
}).catch(e => {
  console.error(e);
});
