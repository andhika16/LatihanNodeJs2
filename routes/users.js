const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt')

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
            .then(email => {
                if (email) {
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

                    console.log(newUser);


                }
            })
            .catch(err => console.log(err));
    }


})


module.exports = router;