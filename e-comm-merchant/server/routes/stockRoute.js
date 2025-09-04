const express = require('express');

const routes = express.Router()

const { verifyToken } = require('../middleware/Auth');

const { categories, getSubcategories, getproducts, ajaxcategorywiseRecord, insertStock, editeStock, updateStock, changeStatus, deleteStock, getstocks, getsizes, getcolors, importStocks, exportStocks } = require('../controller/StockController');


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

const uploadImage = multer({ storage: st }).single('image');
const uploadCSV = multer({ storage: st }).single('file');


routes.get('/categories', verifyToken, categories)
routes.get('/getsubcategories', verifyToken, getSubcategories)
routes.get('/getsizes', verifyToken, getsizes)
routes.get('/getcolors', verifyToken, getcolors)
routes.get('/getproducts', verifyToken, getproducts)
routes.get('/getstocks', verifyToken, getstocks)
routes.get('/ajaxcategorywiseRecord', ajaxcategorywiseRecord)
routes.post('/insertstock', verifyToken, uploadImage, insertStock)
routes.get('/editestock', editeStock)
routes.post('/updatestock', verifyToken, uploadImage, updateStock)
routes.get('/changestatus', changeStatus)
routes.post('/deletestock', deleteStock)

routes.post ('/import',verifyToken,uploadCSV,importStocks)
routes.get('/export', verifyToken, exportStocks);



module.exports = routes;