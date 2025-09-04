const express = require('express');

const { viewCategory, insertCategory, deleteCategory, editCategory, updateCategory, changeStatus, getcategories } = require('../controller/CategoryController');
const { verifyToken } = require('../middleware/Auth');

const routes = express.Router()



routes.get('/', verifyToken, viewCategory)
routes.get('/getcategories', verifyToken, getcategories)
routes.post('/insertcategory', verifyToken, insertCategory)
routes.post('/changestatus', changeStatus)
routes.post('/deletecategory', deleteCategory)
routes.post('/updatecategory', verifyToken, updateCategory)
routes.get('/editcategory', verifyToken, editCategory)


module.exports = routes