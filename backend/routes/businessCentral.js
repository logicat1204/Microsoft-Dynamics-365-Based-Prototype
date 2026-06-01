const express = require('express');
const router = express.Router();
const { createCrudRoutes } = require('./crudHelper');

// 6.1 Advanced Financial Management
createCrudRoutes(router, '/financial/chart-of-accounts', 'bc_chart_of_accounts');

// 6.2 CRM
createCrudRoutes(router, '/crm/contacts', 'bc_contacts');
createCrudRoutes(router, '/crm/opportunities', 'bc_opportunities');

// 6.3 Supply Chain (Logistics)
// Reuses sc_inventory and sc_purchase_orders from supply chain module
createCrudRoutes(router, '/scm/inventory', 'sc_inventory');
createCrudRoutes(router, '/scm/purchase-orders', 'sc_purchase_orders');

// 6.4 Project & Service Management
createCrudRoutes(router, '/projects/service-orders', 'bc_service_orders');

// 6.5 Manufacturing
createCrudRoutes(router, '/manufacturing/production-orders', 'bc_production_orders');

module.exports = router;
