const express = require('express');


const { insertCustomerBillItem, deleteCustomerBillItem, updateCustomerBillItem, changeStatus, getcustomers, getCustomerBills, getstocks, getcustBillitems, importCustItems, exportCustItems } = require('../controller/CustomerBillItemController');
const { verifyToken } = require('../middleware/Auth');


const routes = express.Router();

const multer = require('multer');


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


routes.post('/insertcustomerbillitem', verifyToken, insertCustomerBillItem);
routes.post('/deletecustomerbillitem', verifyToken, deleteCustomerBillItem);
routes.post('/updatecustomerbillitem', verifyToken, updateCustomerBillItem);
routes.get('/getcustbillitems', verifyToken, getcustBillitems);
routes.post('/changestatus', verifyToken, changeStatus);
routes.get('/getcustomers', verifyToken, getcustomers);
routes.get('/getcustomerbills', verifyToken, getCustomerBills);
routes.get('/getstocks', verifyToken, getstocks);

routes.post('/import', verifyToken, uploadCSV, importCustItems)
routes.get('/export', verifyToken, exportCustItems);





module.exports = routes