const express = require('express');


const { categories, insertSubcategory, deleteSubcategory, editSubcategory, updateSubcategory, changeStatus, getSubcategories, ajaxcategorywiseRecord, importsubcategories, exportsubCategories  } = require('../controller/SubcategoryController');
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
        console.log(`${file.fieldname}-${uniq}`);
    }
});


const uploadImage = multer({ storage: st }).single('image');
const uploadCSV = multer({ storage: st }).single('file');


routes.get('/categories', verifyToken, categories)
routes.get('/getsubcategories', verifyToken, getSubcategories)
routes.get('/ajaxcategorywiseRecord',ajaxcategorywiseRecord)
routes.post('/insertsubcategory', verifyToken, uploadImage, insertSubcategory)
routes.get('/changestatus', changeStatus)
routes.post('/updatesubcategory', verifyToken, uploadImage,updateSubcategory)
routes.get('/editsubcategory', verifyToken, editSubcategory)
routes.post('/deletesubcategory', deleteSubcategory)

routes.post ('/import',verifyToken,uploadCSV, importsubcategories)
routes.get ('/export',verifyToken, exportsubCategories)



module.exports = routes;