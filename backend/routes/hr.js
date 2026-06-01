const express = require('express');
const router = express.Router();
const { createCrudRoutes } = require('./crudHelper');

createCrudRoutes(router, '/employees', 'hr_employees');
createCrudRoutes(router, '/timeoff', 'hr_timeoff');
createCrudRoutes(router, '/attendance', 'hr_attendance');
createCrudRoutes(router, '/recruitment', 'hr_recruitment');
createCrudRoutes(router, '/evaluations', 'hr_evaluations');

module.exports = router;
