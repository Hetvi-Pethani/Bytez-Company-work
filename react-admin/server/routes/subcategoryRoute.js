const express = require('express');

const routes = express.Router()

const { categories, insertSubcategory, deleteSubcategory, editSubcategory, updateSubcategory, changeStatus, getSubcategories } = require('../controller/SubcategoryController');
const { verifyToken } = require('../middleware/Auth');




routes.get('/categories', verifyToken, categories)
routes.get('/getsubcategories', verifyToken, getSubcategories)
routes.get('/changestatus', changeStatus)
routes.post('/updatesubcategory', verifyToken, updateSubcategory)
routes.get('/editsubcategory',verifyToken, editSubcategory)
routes.post('/insertsubcategory', verifyToken, insertSubcategory)
routes.post('/deletesubcategory', deleteSubcategory)



module.exports = routes;