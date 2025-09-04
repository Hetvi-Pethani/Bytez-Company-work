const express = require('express');

const routes = express.Router();

const passport = require('passport')

const { viewExsubcategory, addExsubcategory, ajaxcategorywiseRecord, insertExsubcategory, deleteExsubcategory, changeStatus, editExsubcategory, updateExsubcategory } = require('../controllers/ExsubcategoryController');


routes.get('/',passport.checkUser,viewExsubcategory)
routes.get('/addexsubcategory',passport.checkUser,addExsubcategory)
routes.get('/ajaxcategorywiserecord',ajaxcategorywiseRecord)
routes.post('/insertexsubcategory',insertExsubcategory)
routes.get('/deleteexsubcategory',deleteExsubcategory)
routes.get('/editexsubcategory',editExsubcategory)
routes.get('/changestatus',changeStatus)
routes.post('/updateexsubcategory',updateExsubcategory)


module.exports = routes