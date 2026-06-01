const API_BASE = '/api';

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  // Handle DELETE or 204 No Content
  if (response.status === 204) return null;
  
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

// Module-specific endpoints
export const financeApi = {
  getAccounts: () => api.get('/finance/accounts'),
  createAccount: (data) => api.post('/finance/accounts', data),
  updateAccount: (id, data) => api.put(`/finance/accounts/${id}`, data),
  deleteAccount: (id) => api.delete(`/finance/accounts/${id}`),

  getReceivables: () => api.get('/finance/receivables'),
  createReceivable: (data) => api.post('/finance/receivables', data),
  updateReceivable: (id, data) => api.put(`/finance/receivables/${id}`, data),
  deleteReceivable: (id) => api.delete(`/finance/receivables/${id}`),

  getPayables: () => api.get('/finance/payables'),
  createPayable: (data) => api.post('/finance/payables', data),
  updatePayable: (id, data) => api.put(`/finance/payables/${id}`, data),
  deletePayable: (id) => api.delete(`/finance/payables/${id}`),

  getBudgets: () => api.get('/finance/budgets'),
  createBudget: (data) => api.post('/finance/budgets', data),
  updateBudget: (id, data) => api.put(`/finance/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/finance/budgets/${id}`),

  getCashflow: () => api.get('/finance/cashflow'),
  createCashflow: (data) => api.post('/finance/cashflow', data),
  updateCashflow: (id, data) => api.put(`/finance/cashflow/${id}`, data),
  deleteCashflow: (id) => api.delete(`/finance/cashflow/${id}`),

  getFixedAssets: () => api.get('/finance/fixed-assets'),
  createFixedAsset: (data) => api.post('/finance/fixed-assets', data),
  updateFixedAsset: (id, data) => api.put(`/finance/fixed-assets/${id}`, data),
  deleteFixedAsset: (id) => api.delete(`/finance/fixed-assets/${id}`),

  getBankReconciliation: () => api.get('/finance/bank-reconciliation'),
  createBankReconciliation: (data) => api.post('/finance/bank-reconciliation', data),
  updateBankReconciliation: (id, data) => api.put(`/finance/bank-reconciliation/${id}`, data),
  deleteBankReconciliation: (id) => api.delete(`/finance/bank-reconciliation/${id}`),

  getCurrencies: () => api.get('/finance/currencies'),
  createCurrency: (data) => api.post('/finance/currencies', data),
  updateCurrency: (id, data) => api.put(`/finance/currencies/${id}`, data),
  deleteCurrency: (id) => api.delete(`/finance/currencies/${id}`),

  getDashboard: () => api.get('/finance/dashboard'),
};

export const supplyChainApi = {
  getWarehouses: () => api.get('/supplychain/warehouses'),
  createWarehouse: (data) => api.post('/supplychain/warehouses', data),
  updateWarehouse: (id, data) => api.put(`/supplychain/warehouses/${id}`, data),
  deleteWarehouse: (id) => api.delete(`/supplychain/warehouses/${id}`),

  getInventory: () => api.get('/supplychain/inventory'),
  createInventory: (data) => api.post('/supplychain/inventory', data),
  updateInventory: (id, data) => api.put(`/supplychain/inventory/${id}`, data),
  deleteInventory: (id) => api.delete(`/supplychain/inventory/${id}`),

  getPurchaseOrders: () => api.get('/supplychain/purchase-orders'),
  createPurchaseOrder: (data) => api.post('/supplychain/purchase-orders', data),
  updatePurchaseOrder: (id, data) => api.put(`/supplychain/purchase-orders/${id}`, data),
  deletePurchaseOrder: (id) => api.delete(`/supplychain/purchase-orders/${id}`),

  getQualityChecks: () => api.get('/supplychain/quality-checks'),
  createQualityCheck: (data) => api.post('/supplychain/quality-checks', data),
  updateQualityCheck: (id, data) => api.put(`/supplychain/quality-checks/${id}`, data),
  deleteQualityCheck: (id) => api.delete(`/supplychain/quality-checks/${id}`),

  getMaintenance: () => api.get('/supplychain/maintenance'),
  createMaintenance: (data) => api.post('/supplychain/maintenance', data),
  updateMaintenance: (id, data) => api.put(`/supplychain/maintenance/${id}`, data),
  deleteMaintenance: (id) => api.delete(`/supplychain/maintenance/${id}`),
};

export const commerceApi = {
  getProducts: () => api.get('/commerce/products'),
  createProduct: (data) => api.post('/commerce/products', data),
  updateProduct: (id, data) => api.put(`/commerce/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/commerce/products/${id}`),

  getTransactions: () => api.get('/commerce/pos-transactions'),
  createTransaction: (data) => api.post('/commerce/pos-transactions', data),
  updateTransaction: (id, data) => api.put(`/commerce/pos-transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/commerce/pos-transactions/${id}`),

  getPromotions: () => api.get('/commerce/promotions'),
  createPromotion: (data) => api.post('/commerce/promotions', data),
  updatePromotion: (id, data) => api.put(`/commerce/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/commerce/promotions/${id}`),

  getLoyalty: () => api.get('/commerce/loyalty'),
  createLoyalty: (data) => api.post('/commerce/loyalty', data),
  updateLoyalty: (id, data) => api.put(`/commerce/loyalty/${id}`, data),
  deleteLoyalty: (id) => api.delete(`/commerce/loyalty/${id}`),
};

export const projectApi = {
  getProjects: () => api.get('/project/projects'),
  createProject: (data) => api.post('/project/projects', data),
  updateProject: (id, data) => api.put(`/project/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/project/projects/${id}`),

  getResources: () => api.get('/project/resources'),
  createResource: (data) => api.post('/project/resources', data),
  updateResource: (id, data) => api.put(`/project/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/project/resources/${id}`),

  getTimesheets: () => api.get('/project/timesheets'),
  createTimesheet: (data) => api.post('/project/timesheets', data),
  updateTimesheet: (id, data) => api.put(`/project/timesheets/${id}`, data),
  deleteTimesheet: (id) => api.delete(`/project/timesheets/${id}`),

  getInvoices: () => api.get('/project/invoices'),
  createInvoice: (data) => api.post('/project/invoices', data),
  updateInvoice: (id, data) => api.put(`/project/invoices/${id}`, data),
  deleteInvoice: (id) => api.delete(`/project/invoices/${id}`),

  getContracts: () => api.get('/project/contracts'),
  createContract: (data) => api.post('/project/contracts', data),
  updateContract: (id, data) => api.put(`/project/contracts/${id}`, data),
  deleteContract: (id) => api.delete(`/project/contracts/${id}`),
};

export const hrApi = {
  getEmployees: () => api.get('/hr/employees'),
  createEmployee: (data) => api.post('/hr/employees', data),
  updateEmployee: (id, data) => api.put(`/hr/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/hr/employees/${id}`),

  getTimeoff: () => api.get('/hr/timeoff'),
  createTimeoff: (data) => api.post('/hr/timeoff', data),
  updateTimeoff: (id, data) => api.put(`/hr/timeoff/${id}`, data),
  deleteTimeoff: (id) => api.delete(`/hr/timeoff/${id}`),

  getAttendance: () => api.get('/hr/attendance'),
  createAttendance: (data) => api.post('/hr/attendance', data),
  updateAttendance: (id, data) => api.put(`/hr/attendance/${id}`, data),
  deleteAttendance: (id) => api.delete(`/hr/attendance/${id}`),

  getRecruitment: () => api.get('/hr/recruitment'),
  createRecruitment: (data) => api.post('/hr/recruitment', data),
  updateRecruitment: (id, data) => api.put(`/hr/recruitment/${id}`, data),
  deleteRecruitment: (id) => api.delete(`/hr/recruitment/${id}`),

  getEvaluations: () => api.get('/hr/evaluations'),
  createEvaluation: (data) => api.post('/hr/evaluations', data),
  updateEvaluation: (id, data) => api.put(`/hr/evaluations/${id}`, data),
  deleteEvaluation: (id) => api.delete(`/hr/evaluations/${id}`),
};

export const businessCentralApi = {
  getChartOfAccounts: () => api.get('/businesscentral/financial/chart-of-accounts'),
  createChartOfAccounts: (data) => api.post('/businesscentral/financial/chart-of-accounts', data),
  updateChartOfAccounts: (id, data) => api.put(`/businesscentral/financial/chart-of-accounts/${id}`, data),
  deleteChartOfAccounts: (id) => api.delete(`/businesscentral/financial/chart-of-accounts/${id}`),

  getContacts: () => api.get('/businesscentral/crm/contacts'),
  createContact: (data) => api.post('/businesscentral/crm/contacts', data),
  updateContact: (id, data) => api.put(`/businesscentral/crm/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/businesscentral/crm/contacts/${id}`),

  getOpportunities: () => api.get('/businesscentral/crm/opportunities'),
  createOpportunity: (data) => api.post('/businesscentral/crm/opportunities', data),
  updateOpportunity: (id, data) => api.put(`/businesscentral/crm/opportunities/${id}`, data),
  deleteOpportunity: (id) => api.delete(`/businesscentral/crm/opportunities/${id}`),

  getServiceOrders: () => api.get('/businesscentral/projects/service-orders'),
  createServiceOrder: (data) => api.post('/businesscentral/projects/service-orders', data),
  updateServiceOrder: (id, data) => api.put(`/businesscentral/projects/service-orders/${id}`, data),
  deleteServiceOrder: (id) => api.delete(`/businesscentral/projects/service-orders/${id}`),

  getProductionOrders: () => api.get('/businesscentral/manufacturing/production-orders'),
  createProductionOrder: (data) => api.post('/businesscentral/manufacturing/production-orders', data),
  updateProductionOrder: (id, data) => api.put(`/businesscentral/manufacturing/production-orders/${id}`, data),
  deleteProductionOrder: (id) => api.delete(`/businesscentral/manufacturing/production-orders/${id}`),

  // BC SCM endpoints (shares SC DB table, but BC route prefix)
  getInventory: () => api.get('/businesscentral/scm/inventory'),
  createInventory: (data) => api.post('/businesscentral/scm/inventory', data),
  updateInventory: (id, data) => api.put(`/businesscentral/scm/inventory/${id}`, data),
  deleteInventory: (id) => api.delete(`/businesscentral/scm/inventory/${id}`),

  getPurchaseOrders: () => api.get('/businesscentral/scm/purchase-orders'),
  createPurchaseOrder: (data) => api.post('/businesscentral/scm/purchase-orders', data),
  updatePurchaseOrder: (id, data) => api.put(`/businesscentral/scm/purchase-orders/${id}`, data),
  deletePurchaseOrder: (id) => api.delete(`/businesscentral/scm/purchase-orders/${id}`),
};
