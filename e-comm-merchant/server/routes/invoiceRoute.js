
const express = require('express');

const { verifyToken } = require('../middleware/Auth');

const { insertCustomers, getCustomers, insertCustomerBill, getCustomerBills, insertCustomerBillItem, getcustBillitems, getInvoices } = require('../controller/InvoiceController');


const routes = express.Router()


routes.get('/getInvoices', verifyToken, getInvoices)
routes.get('/getcustomers', verifyToken, getCustomers)
routes.post('/insertcustomers', verifyToken, insertCustomers)
routes.post('/insertcustomerbill', verifyToken, insertCustomerBill)
routes.get('/getcustomerbills', verifyToken, getCustomerBills)
routes.post('/insertcustomerbillitem', verifyToken, insertCustomerBillItem);
routes.get('/getcustbillitems', verifyToken, getcustBillitems);


module.exports = routes