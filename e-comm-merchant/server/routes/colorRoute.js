const express = require('express');

const { verifyToken } = require('../middleware/Auth');
const { viewColor, getcolors, insertColor, changeStatus, deleteColor, editColor, updateColor, importColors, exportColors } = require('../controller/ColorController');


const multer = require('multer');

const routes = express.Router()


const st = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniq = Math.floor(Math.random() * 100000000);
        cb(null, `${file.fieldname}-${uniq}`);
    }
});

const uploadCSV = multer({ storage: st }).single('file');


routes.get('/', verifyToken, viewColor)
routes.get('/getcolors', verifyToken, getcolors)
routes.post('/insertcolor', verifyToken, insertColor)
routes.post('/changestatus', changeStatus)
routes.post('/deletecolor', deleteColor)
routes.post('/updatecolor', verifyToken, updateColor)
routes.get('/editcolor', verifyToken, editColor)


routes.post('/import', verifyToken, uploadCSV, importColors)
routes.get('/export', verifyToken, exportColors);



module.exports = routes