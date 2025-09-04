const express = require('express');

const routes = express.Router();


const { categories, getSubcategories, ajaxcategorywiseRecord, insertExsubcategory, deleteExsubcategory, editExsubcategory, changeStatus, updateExsubcategory, getexsubcategories } = require('../controller/ExsubcategoryController');
const { verifyToken } = require('../middleware/Auth')

routes.get('/getsubcategories',verifyToken,getSubcategories)
routes.get ('/categories',verifyToken, categories)
routes.get ('/getexsubcategories',verifyToken, getexsubcategories)
routes.get('/ajaxcategorywiserecord',ajaxcategorywiseRecord)
routes.post('/insertexsubcategory',verifyToken,insertExsubcategory)

routes.post('/deleteexsubcategory',deleteExsubcategory)
routes.get('/editexsubcategory',verifyToken,editExsubcategory)
routes.get('/changestatus',changeStatus)
routes.post('/updateexsubcategory',verifyToken,updateExsubcategory)


module.exports = routes