const express = require('express');
const router = express.Router();
const { createCrudRoutes } = require('./crudHelper');

createCrudRoutes(router, '/products', 'commerce_products');
createCrudRoutes(router, '/pos-transactions', 'commerce_pos_transactions');
createCrudRoutes(router, '/promotions', 'commerce_promotions');
createCrudRoutes(router, '/loyalty', 'commerce_loyalty');

module.exports = router;
