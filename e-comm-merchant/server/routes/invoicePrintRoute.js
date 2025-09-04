const express = require('express');


const { getInvoicePrintData } = require('../controller/InvoicePrintContoller');
const { verifyToken } = require('../middleware/Auth');

const router = express.Router();



router.post('/customerbillitem', verifyToken, getInvoicePrintData);

module.exports = router;