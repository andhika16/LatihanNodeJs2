const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Login'
    })
})
// Register Page
router.get('/register', (req, res) => {
    res.render('register')
})
// Register Handle
router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;

    const errors = [];

    // check fill input
    if (!name || !email || !password || !password2) {
        errors.push({
            msg: 'please fill the input'
        });
    }

    // check password match
    if (password !== password2) {
        errors.push({
            msg: 'Password Not Match !'
        });
    }

    // pass length
    if (password.length < 3) {
        errors.push({
            msg: 'Password to short !'
        })
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation passed
        User.findOne({
                email: email
            })
            .then(user => {
                if (user) {
                    // User exist
                    errors.push({
                        msg: 'Email already registered !'
                    })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;

                            newUser.save()
                                .then(result => {
                                    req.flash('success_msg',
                                        'You are now registered'
                                    )
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                    })

                }
            })
            .catch(err => console.log(err));
    }


});

// Login handle 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout handle

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
})



module.exports = router;