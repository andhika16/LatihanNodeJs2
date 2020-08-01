const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.port || 3000;
const expressLayout = require('express-ejs-layouts')
// EJS
app.use(expressLayout);
app.set('view engine', 'ejs');
// body parser
app.use(express.urlencoded({
    extended: false
}));
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// db config
const db = require('./config/keys').MonggoURI;

// connect to database
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then((result) => {
        app.listen(port, () => {
            console.log(`mongodb connection on ${port}`);
        })
    })
    .catch(err => console.log(err))