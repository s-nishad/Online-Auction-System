const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

function initialize(passport, getUserByEmail, getUserById, isApproved) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (user == null) {
      return done(null, false, {
        message: 'Email Address or Password is Incorrect.',
      });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        if (user.isApproved == true) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'User not approved yet' });
        }
      } else {
        return done(null, false, {
          message: 'Email Address or Password is Incorrect.',
        });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
