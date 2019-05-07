import Whoami from './whoami.js';
import NotLoggedIn from './login.js';
import LoggedIn from './logout.js';
import User from './user.js';

export default {
  components: {
    Whoami: Whoami,
    NotLoggedIn: NotLoggedIn,
    LoggedIn: LoggedIn
  },
  stores: {
    user: User
  }
};
