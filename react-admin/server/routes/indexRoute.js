const express = require('express');

const routes = express.Router();

routes.use('/', require('./authRoute'));
routes.use('/category',require('./categoryRoute'));
routes.use('/subcategory',require('./subcategoryRoute'));
routes.use('/exsubcategory',require('./exsubcategoryRoutes'));
routes.use('/product',require('./productRouts'))


module.exports = routes;
