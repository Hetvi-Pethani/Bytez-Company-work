const express = require('express');

const port = 9000;

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');

const db = require('./db');

const cors = require('cors');

app.use(cors());


app.use('/', require('./routes/indexRoute'));


app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false;
    }
    console.log(`Server is running on port ${port}`);
})