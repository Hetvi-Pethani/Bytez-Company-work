const express = require('express');

const routes = express.Router()

const passport = require('passport')

const { viewSubcategory, addSubcategory, insertSubcategory, deleteSubcategory, editSubcategory, updateSubcategory, changeStatus } = require('../controllers/SubcategoryController');


routes.get('/',passport.checkUser, viewSubcategory)
routes.get('/addsubcategory',passport.checkUser, addSubcategory)
routes.post('/insertsubcategory', insertSubcategory)
routes.get('/deletesubcategory', deleteSubcategory)
routes.get('/editsubcategory', editSubcategory)
routes.post('/updatesubcategory', updateSubcategory)
routes.get('/changestatus',changeStatus)

module.exports = routes;