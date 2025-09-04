const express = require('express');

const { viewCategory, insertCategory, deleteCategory, editCategory, updateCategory, changeStatus, getcategories, importCategories, exportCategories } = require('../controller/CategoryController');
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

const uploadImage = multer({ storage: st }).single('image');
const uploadCSV = multer({ storage: st }).single('file');



routes.get('/', verifyToken, viewCategory)
routes.get('/getcategories', verifyToken, getcategories)
routes.post('/insertcategory', verifyToken,uploadImage, insertCategory)
routes.post('/changestatus', changeStatus)
routes.post('/deletecategory', deleteCategory)
routes.post('/updatecategory', verifyToken, uploadImage,updateCategory)
routes.get('/editcategory', verifyToken, editCategory)

routes.post ('/import',verifyToken,uploadCSV,importCategories)
routes.get('/export', verifyToken, exportCategories);


module.exports = routes