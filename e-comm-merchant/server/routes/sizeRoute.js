const express = require('express');

const { verifyToken } = require('../middleware/Auth');
const { viewSize, getsizes, insertSize, changeStatus, deleteSize, updateSize, editSize, importSizes, exportSizes } = require('../controller/sizeController');

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



routes.get('/', verifyToken, viewSize)
routes.get('/getsizes', verifyToken, getsizes)
routes.post('/insertsize', verifyToken, insertSize)
routes.post('/changestatus', changeStatus)
routes.post('/deletesize', deleteSize)
routes.post('/updatesize', verifyToken, updateSize)
routes.get('/editsize', verifyToken, editSize)

routes.post ('/import',verifyToken,uploadCSV,importSizes)
routes.get('/export', verifyToken, exportSizes);

module.exports = routes