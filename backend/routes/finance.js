const express = require('express');
const router = express.Router();
const { createCrudRoutes } = require('./crudHelper');

createCrudRoutes(router, '/accounts', 'finance_accounts');
createCrudRoutes(router, '/receivables', 'finance_receivables');
createCrudRoutes(router, '/payables', 'finance_payables');
createCrudRoutes(router, '/budgets', 'finance_budgets');
createCrudRoutes(router, '/cashflow', 'finance_cashflow');
createCrudRoutes(router, '/fixed-assets', 'finance_fixed_assets');
createCrudRoutes(router, '/bank-reconciliation', 'finance_bank_reconciliation');
createCrudRoutes(router, '/currencies', 'finance_currencies');

// Dashboard summary
const db = require('../db');
router.get('/dashboard', (req, res) => {
  try {
    const totalAssets = db.prepare("SELECT COALESCE(SUM(balance),0) as v FROM finance_accounts WHERE type='Asset'").get().v;
    const totalLiabilities = db.prepare("SELECT COALESCE(SUM(balance),0) as v FROM finance_accounts WHERE type='Liability'").get().v;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(balance),0) as v FROM finance_accounts WHERE type='Revenue'").get().v;
    const pendingReceivables = db.prepare("SELECT COALESCE(SUM(amount),0) as v FROM finance_receivables WHERE status='Pending'").get().v;
    const pendingPayables = db.prepare("SELECT COALESCE(SUM(amount),0) as v FROM finance_payables WHERE status='Pending'").get().v;
    res.json({ totalAssets, totalLiabilities, totalRevenue, pendingReceivables, pendingPayables });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
