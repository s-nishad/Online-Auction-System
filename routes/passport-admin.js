// const pass = require('passport');
// const Strat = require('passport-local').Strategy;
// const path = require('path');
// const Admin = require(path.join(__dirname, '../models/index.js')).admin;

// //Local Strategy
// pass.use(
//   new Strat((email, password, done) => {
//     Admin.findOne({ email: email }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       // If any error
//       if (err) {
//         return done(err);
//       }

//       // If no user found
//       if (!user) {
//         return done(null, false, {
//           message: 'No user found.',
//         });
//       }

//       // Password not matched
//       if (user.password != password) {
//         return done(null, false, {
//           message: 'Password not matched.',
//         });
//       }
//       return done(null, user);
//     });
//   })
// );

// //Serialize and Deserialize
// pass.serializeUser((user, done) => {
//   done(null, user.id);
// });
// pass.deserializeUser((id, done) => {
//   Admin.findById(id, (err, user) => {
//     if (err) {
//       return done(err);
//     }
//     done(err, user);
//   });
// });

// module.exports = pass;
