
const express = require('express');

const { getCustomerBills, updateCustomerBill, insertCustomerBill, deleteCustomerBill, changeStatus, importCustbills, exportCustbills, getCustomers } = require('../controller/CustomersBillController');

const { verifyToken } = require('../middleware/Auth');

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


routes.get('/getcustomers', verifyToken, getCustomers)
routes.get('/getcustomerbills', verifyToken, getCustomerBills);
routes.post('/insertcustomerbill', verifyToken, insertCustomerBill);
routes.post('/updatecustomerbill', verifyToken, updateCustomerBill);
routes.post('/deletecustomerbill', verifyToken, deleteCustomerBill);
routes.post('/changestatus', verifyToken, changeStatus);


routes.post('/import', verifyToken, uploadCSV, importCustbills)
routes.get('/export', verifyToken, exportCustbills);

module.exports = routes