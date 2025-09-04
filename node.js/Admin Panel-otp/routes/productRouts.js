const express = require('express');

const routes = express.Router()

const passport = require('passport')


const { viewProduct, addProduct, insertProduct, ajaxcategorywiseRecord, changeStatus, deleteProduct, editeProduct, updateProduct } = require('../controllers/ProductController');


const multer = require('multer');


const st = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const uniq = Math.floor(Math.random() * 100000000);
        cb(null, `${file.fieldname}-${uniq}`);
    }
})

const upload = multer({ storage: st }).single('image');


routes.get('/', passport.checkUser, viewProduct)
routes.get('/addproduct', passport.checkUser, addProduct)
routes.get('/ajaxcategorywiserecord', ajaxcategorywiseRecord)
routes.post('/insertproduct', upload, insertProduct)
routes.get('/deleteproduct', deleteProduct)
routes.get('/editeproduct', editeProduct)
routes.get('/changestatus', changeStatus)
routes.post('/updateproduct', upload, updateProduct)


module.exports = routes;