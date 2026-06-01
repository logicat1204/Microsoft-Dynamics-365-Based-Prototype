const express = require('express');
const router = express.Router();
const { createCrudRoutes } = require('./crudHelper');

createCrudRoutes(router, '/warehouses', 'sc_warehouses');
createCrudRoutes(router, '/inventory', 'sc_inventory');
createCrudRoutes(router, '/purchase-orders', 'sc_purchase_orders');
createCrudRoutes(router, '/quality-checks', 'sc_quality_checks');
createCrudRoutes(router, '/maintenance', 'sc_maintenance');

module.exports = router;
