const express = require('express');

const routes = express.Router()
const passport = require('passport');
const { viewCategory, addCategory, insertCategory, deleteCategory, updateCategory, changeStatus, editCategory } = require('../controllers/CategoryController');


routes.get('/',passport.checkUser, viewCategory)
routes.get('/addcategory',passport.checkUser,addCategory)
routes.post('/insertcategory',insertCategory)
routes.get('/deletecategory',deleteCategory)
routes.get('/editcategory',editCategory)


routes.post('/updatecategory',updateCategory)
routes.get('/changestatus',changeStatus)



module.exports = routes;