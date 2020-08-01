const LocalStrategy = require('passport-local').Strategy;
const moongose = require('mongoose');
const bcrypt = require('bcrypt');

// load user model

const User = require('../model/User');



module.exports = function (passport) {

    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        (email, password, done) => {
            User.findOne({
                    email: email
                })
                .then(user => {
                    // match User
                    if (!user) {
                        return done(null, false, {
                            message: 'Email is not registered'
                        })
                    }

                    // match the password
                    bcrypt.compare(password, user.password, (err, match) => {
                        if (err) throw err;

                        if (match) {
                            return done(null, user)
                        } else {
                            return done(null, false, {
                                message: 'password incorect'
                            });
                        }
                    });
                });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}