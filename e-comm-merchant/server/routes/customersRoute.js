const express = require('express');

const { verifyToken } = require('../middleware/Auth');

const { viewCustomers, getCustomers,  changeStatus, deletecustomers, updatecustomers, editcustomers, importCustomers, exportsCustomers } = require('../controller/CustomersController');

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


routes.get('/', verifyToken, viewCustomers)
routes.get('/getcustomers', verifyToken, getCustomers)
// routes.post('/insertcustomers', verifyToken,  insertCustomers)
routes.post('/changestatus', changeStatus)
routes.post('/deletecustomers', deletecustomers)
routes.post('/updatecustomers', verifyToken, updatecustomers)
routes.get('/editcustomers', verifyToken, editcustomers)

routes.post ('/import',verifyToken,uploadCSV,importCustomers)
routes.get('/export', verifyToken, exportsCustomers);

module.exports = routes