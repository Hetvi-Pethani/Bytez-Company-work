const express = require('express');

const port = 8000;

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');

const db = require('./db');


const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use('/', require('./routes/indexRoute'));


app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`);
})