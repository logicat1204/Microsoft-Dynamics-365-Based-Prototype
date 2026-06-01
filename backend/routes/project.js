const express = require('express');
const router = express.Router();
const { createCrudRoutes } = require('./crudHelper');

createCrudRoutes(router, '/projects', 'project_projects');
createCrudRoutes(router, '/resources', 'project_resources');
createCrudRoutes(router, '/timesheets', 'project_timesheets');
createCrudRoutes(router, '/invoices', 'project_invoices');
createCrudRoutes(router, '/contracts', 'project_contracts');

module.exports = router;
