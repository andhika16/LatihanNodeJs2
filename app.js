const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = process.env.port || 3000;
const mhs_routes = require('./routes/mhs_routes')

// middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}))
// connect to database
const db_mhs = 'mongodb+srv://andhika:dhika.12345@node-tuts.4yfq2.mongodb.net/daftar_mahasiswa?retryWrites=true&w=majority'
mongoose.connect(db_mhs, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((result) => {
        app.listen(port, () => {
            console.log(`mongodb connection on ${port}`)
        })
    })
    .catch(err => console.log(err))




app.get('/about', (req, res) => {
    res.render('about/about.ejs', {
        title: 'About'
    });
});

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});
app.use('/mahasiswa', mhs_routes);

app.use((req, res) => {
    res.status(404).render('404', {
        title: '404'
    });
});