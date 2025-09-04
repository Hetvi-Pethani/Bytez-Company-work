const express = require('express');

const routes = express.Router();

routes.use('/', require('./authRoute'));
routes.use('/category', require('./categoryRoute'));
routes.use('/subcategory', require('./subcategoryRoute'));
routes.use('/product', require('./productRouts'));
routes.use('/merchant', require('./merchantRoute'));
routes.use('/customers', require('./customersRoute'));
routes.use('/size', require('./sizeRoute'));
routes.use('/color', require('./colorRoute'));
routes.use('/stock', require('./stockRoute'));
routes.use('/customerBill', require('./customersBillRoute'));
routes.use('/customerbillitem', require('./customerBillItemRoute'));
routes.use('/invoice', require('./invoiceRoute'));
routes.use('/invoiceprint', require('./invoicePrintRoute'));

module.exports = routes;
