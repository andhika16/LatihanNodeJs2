const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.port || 3000;
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// passport config

require('./config/passport')(passport);

// EJS
app.use(expressLayout);
app.set('view engine', 'ejs');
// body parser
app.use(express.urlencoded({
    extended: false
}));

// express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// passpot middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash

app.use(flash());

// global var
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

})


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// db config
const db = require('./config/keys').MonggoURI;

// connect to database
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        app.listen(port, () => {
            console.log(`mongodb connection on ${port}`);
        })
    })
    .catch(err => console.log(err))