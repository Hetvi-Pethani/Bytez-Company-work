const express = require('express');

const port = 9000;

const app = express();

app.set('view engine', 'ejs');

const path = require('path');


const db = require('./config/db');


app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const cookieParser = require('cookie-parser');
app.use(cookieParser());

//authentication start passportjs
const passport = require('passport');
const passportLocal = require('./config/passportLocal');
const session = require('express-session');
app.use(session({
    secret: 'admin',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUser);
//authentication end passportjs


// flesh start
const flash = require('connect-flash');
const { addProduct } = require('./controllers/ProductController');
const { search } = require('./routes/authRoute');
app.use(flash( ))



app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});

// flash end


app.use(express.urlencoded());




app.use('/', require('./routes/indexRoute'));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log(`server is start on port :- ${port}`);

})