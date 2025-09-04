const express = require('express');

const routes = express.Router()

const { categories, getSubcategories, getproducts, ajaxcategorywiseRecord, insertProduct, editeProduct, updateProduct, changeStatus, deleteProduct, importProducts, exportProducts, } = require('../controller/ProductController');

const { verifyToken } = require('../middleware/Auth');

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
routes.get('/getproducts', verifyToken, getproducts)
routes.get('/ajaxcategorywiseRecord', ajaxcategorywiseRecord)
routes.post('/insertproduct', verifyToken, uploadImage, insertProduct)
routes.get('/editeproduct', editeProduct)
routes.post('/updateproduct', uploadImage, verifyToken, updateProduct)
routes.get('/changestatus', changeStatus)
routes.post('/deleteproduct', deleteProduct)
routes.post('/import', verifyToken, uploadCSV, importProducts)
routes.get('/export', verifyToken, exportProducts)



module.exports = routes;