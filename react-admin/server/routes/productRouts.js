const express = require('express');

const routes = express.Router()

const multer = require('multer');


const { getexsubcategories, categories, getSubcategories, getproducts, ajaxcategorywiseRecord, insertProduct, editeProduct, updateProduct, changeStatus, deleteProduct,  } = require('../controller/ProductController');

const { verifyToken } = require('../middleware/Auth');

const st = multer.diskStorage({
    
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniq = Math.floor(Math.random() * 100000000);
        cb(null, `${file.fieldname}-${uniq}`);
    }
});

const upload = multer({ storage: st }).single('image');


routes.get('/getexsubcategories',verifyToken,getexsubcategories)
routes.get('/categories',verifyToken ,categories)
routes.get('/getsubcategories',verifyToken, getSubcategories)
routes.get('/getproducts', verifyToken,getproducts)
routes.get('/ajaxcategorywiseRecord', ajaxcategorywiseRecord)
routes.post('/insertproduct',verifyToken, upload, insertProduct)
routes.get('/editeproduct', editeProduct)
routes.post('/updateproduct', upload, updateProduct)
routes.get('/changestatus', changeStatus)
routes.post('/deleteproduct', deleteProduct)



module.exports = routes;