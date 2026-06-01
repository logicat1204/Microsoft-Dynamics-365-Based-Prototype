import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const Finance = () => {
  const [activeTab, setActiveTab] = useState('contabilidad');
  
  // Data states
  const [accounts, setAccounts] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [cashflow, setCashflow] = useState([]);
  const [assets, setAssets] = useState([]);
  const [reconciliations, setReconciliations] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFields, setModalFields] = useState([]);
  const [modalInitialValues, setModalInitialValues] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Load data for active tab
  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = () => {
    if (activeTab === 'contabilidad') financeApi.getAccounts().then(setAccounts);
    if (activeTab === 'cobros') financeApi.getReceivables().then(setReceivables);
    if (activeTab === 'pagos') financeApi.getPayables().then(setPayables);
    if (activeTab === 'presupuestos') financeApi.getBudgets().then(setBudgets);
    if (activeTab === 'caja') financeApi.getCashflow().then(setCashflow);
    if (activeTab === 'activos') financeApi.getFixedAssets().then(setAssets);
    if (activeTab === 'conciliacion') financeApi.getBankReconciliation().then(setReconciliations);
    if (activeTab === 'monedas') financeApi.getCurrencies().then(setCurrencies);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalInitialValues({});
    
    if (activeTab === 'contabilidad') {
      setModalTitle("Configurar Cuenta Contable");
      setModalFields([
        { name: 'code', label: 'Código de Cuenta', type: 'text', required: true, placeholder: 'Ej. 1100' },
        { name: 'name', label: 'Nombre de Cuenta', type: 'text', required: true, placeholder: 'Ej. Cuentas por Cobrar' },
        { name: 'type', label: 'Tipo', type: 'select', required: true, options: ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] },
        { name: 'balance', label: 'Saldo Inicial', type: 'number', required: true, defaultValue: 0 },
        { name: 'currency', label: 'Moneda', type: 'select', required: true, options: ['USD', 'BOB', 'EUR'], defaultValue: 'USD' }
      ]);
    } else if (activeTab === 'cobros') {
      setModalTitle("Crear Cuenta por Cobrar (Factura Emitida)");
      setModalFields([
        { name: 'customer', label: 'Cliente', type: 'text', required: true, placeholder: 'Ej. Acme Corp' },
        { name: 'invoice_number', label: 'Número de Factura', type: 'text', required: true, placeholder: 'Ej. INV-004' },
        { name: 'amount', label: 'Monto', type: 'number', required: true, min: 0 },
        { name: 'due_date', label: 'Fecha de Vencimiento', type: 'date', required: true },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Pending', 'Paid', 'Overdue'], defaultValue: 'Pending' }
      ]);
    } else if (activeTab === 'pagos') {
      setModalTitle("Crear Cuenta por Pagar (Factura Recibida)");
      setModalFields([
        { name: 'vendor', label: 'Proveedor', type: 'text', required: true, placeholder: 'Ej. SupplyChain Co' },
        { name: 'invoice_number', label: 'Número de Factura', type: 'text', required: true, placeholder: 'Ej. BILL-003' },
        { name: 'amount', label: 'Monto', type: 'number', required: true, min: 0 },
        { name: 'due_date', label: 'Fecha de Vencimiento', type: 'date', required: true },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Pending', 'Paid'], defaultValue: 'Pending' }
      ]);
    } else if (activeTab === 'presupuestos') {
      setModalTitle("Nuevo Presupuesto");
      setModalFields([
        { name: 'department', label: 'Departamento', type: 'text', required: true, placeholder: 'Ej. Marketing' },
        { name: 'category', label: 'Categoría', type: 'text', required: true, placeholder: 'Ej. Operations' },
        { name: 'allocated', label: 'Monto Asignado', type: 'number', required: true, min: 0 },
        { name: 'spent', label: 'Monto Gastado', type: 'number', defaultValue: 0 },
        { name: 'period', label: 'Período', type: 'text', required: true, placeholder: 'Ej. 2026-Q3' }
      ]);
    } else if (activeTab === 'caja') {
      setModalTitle("Registrar Movimiento de Caja");
      setModalFields([
        { name: 'description', label: 'Descripción', type: 'text', required: true, placeholder: 'Ej. Venta de productos' },
        { name: 'type', label: 'Tipo de Flujo', type: 'select', required: true, options: ['Inflow', 'Outflow'], defaultValue: 'Inflow' },
        { name: 'amount', label: 'Monto', type: 'number', required: true, min: 0 },
        { name: 'date', label: 'Fecha del Movimiento', type: 'date', required: true },
        { name: 'category', label: 'Categoría', type: 'text', required: true, placeholder: 'Ej. Ventas' }
      ]);
    } else if (activeTab === 'activos') {
      setModalTitle("Registrar Activo Fijo");
      setModalFields([
        { name: 'name', label: 'Nombre del Activo', type: 'text', required: true, placeholder: 'Ej. CNC Machine' },
        { name: 'category', label: 'Categoría', type: 'select', required: true, options: ['Machinery', 'Real Estate', 'Vehicles', 'IT Equipment'] },
        { name: 'acquisition_cost', label: 'Costo de Adquisición', type: 'number', required: true, min: 0 },
        { name: 'acquisition_date', label: 'Fecha de Adquisición', type: 'date', required: true },
        { name: 'depreciation_rate', label: 'Tasa de Amortización Anual (%)', type: 'number', required: true, defaultValue: 10, min: 0, max: 100 },
        { name: 'current_value', label: 'Valor Actual', type: 'number', required: true, min: 0 },
        { name: 'location', label: 'Ubicación', type: 'text', placeholder: 'Ej. Planta Principal' }
      ]);
    } else if (activeTab === 'conciliacion') {
      setModalTitle("Importar Conciliación Bancaria");
      setModalFields([
        { name: 'bank_account', label: 'Cuenta Bancaria', type: 'text', required: true, placeholder: 'Ej. BNB - Cta Corriente' },
        { name: 'statement_date', label: 'Fecha de Extracto', type: 'date', required: true },
        { name: 'statement_balance', label: 'Saldo de Extracto', type: 'number', required: true },
        { name: 'book_balance', label: 'Saldo Contable (Libro)', type: 'number', required: true },
        { name: 'difference', label: 'Diferencia', type: 'number', defaultValue: 0 },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Pending', 'Reconciled'], defaultValue: 'Pending' }
      ]);
    } else if (activeTab === 'monedas') {
      setModalTitle("Agregar Tipo de Cambio");
      setModalFields([
        { name: 'code', label: 'Código ISO', type: 'text', required: true, placeholder: 'Ej. BOB' },
        { name: 'name', label: 'Nombre de Moneda', type: 'text', required: true, placeholder: 'Ej. Boliviano' },
        { name: 'exchange_rate', label: 'Tasa respecto al USD', type: 'number', required: true, step: '0.0001', min: 0 }
      ]);
    }

    setIsModalOpen(true);
  };

  const handleOpenEdit = (row) => {
    handleOpenAdd();
    setEditingId(row.id);
    setModalInitialValues(row);
    setModalTitle(`Editar Registro #${row.id}`);
  };

  const handleFormSubmit = (formData) => {
    let apiCall;
    
    if (activeTab === 'contabilidad') {
      apiCall = editingId ? financeApi.updateAccount(editingId, formData) : financeApi.createAccount(formData);
    } else if (activeTab === 'cobros') {
      apiCall = editingId ? financeApi.updateReceivable(editingId, formData) : financeApi.createReceivable(formData);
    } else if (activeTab === 'pagos') {
      apiCall = editingId ? financeApi.updatePayable(editingId, formData) : financeApi.createPayable(formData);
    } else if (activeTab === 'presupuestos') {
      apiCall = editingId ? financeApi.updateBudget(editingId, formData) : financeApi.createBudget(formData);
    } else if (activeTab === 'caja') {
      apiCall = editingId ? financeApi.updateCashflow(editingId, formData) : financeApi.createCashflow(formData);
    } else if (activeTab === 'activos') {
      apiCall = editingId ? financeApi.updateFixedAsset(editingId, formData) : financeApi.createFixedAsset(formData);
    } else if (activeTab === 'conciliacion') {
      apiCall = editingId ? financeApi.updateBankReconciliation(editingId, formData) : financeApi.createBankReconciliation(formData);
    } else if (activeTab === 'monedas') {
      apiCall = editingId ? financeApi.updateCurrency(editingId, formData) : financeApi.createCurrency(formData);
    }

    apiCall.then(() => {
      setIsModalOpen(false);
      loadTabData();
    }).catch(err => alert("Error al guardar: " + err.message));
  };

  const handleDelete = (id) => {
    let apiCall;
    if (activeTab === 'contabilidad') apiCall = financeApi.deleteAccount(id);
    if (activeTab === 'cobros') apiCall = financeApi.deleteReceivable(id);
    if (activeTab === 'pagos') apiCall = financeApi.deletePayable(id);
    if (activeTab === 'presupuestos') apiCall = financeApi.deleteBudget(id);
    if (activeTab === 'caja') apiCall = financeApi.deleteCashflow(id);
    if (activeTab === 'activos') apiCall = financeApi.deleteFixedAsset(id);
    if (activeTab === 'conciliacion') apiCall = financeApi.deleteBankReconciliation(id);
    if (activeTab === 'monedas') apiCall = financeApi.deleteCurrency(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Render correct grid based on active tab
  const renderTabContent = () => {
    if (activeTab === 'contabilidad') {
      return (
        <DataTable
          title="Plan de Cuentas Contables"
          data={accounts}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Código", accessor: "code", width: "15%" },
            { header: "Nombre", accessor: "name" },
            { header: "Tipo", accessor: "type", width: "20%", cell: (row) => (
              <span className={`badge ${row.type.toLowerCase()}`}>{row.type}</span>
            )},
            { header: "Saldo", accessor: "balance", type: "currency", width: "20%" },
            { header: "Moneda", accessor: "currency", width: "10%" }
          ]}
        />
      );
    }

    if (activeTab === 'cobros') {
      return (
        <DataTable
          title="Cuentas por Cobrar (Facturas a Clientes)"
          data={receivables}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Cliente", accessor: "customer" },
            { header: "Factura", accessor: "invoice_number", width: "20%" },
            { header: "Monto", accessor: "amount", type: "currency", width: "20%" },
            { header: "Fecha Venc.", accessor: "due_date", width: "20%" },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'pagos') {
      return (
        <DataTable
          title="Cuentas por Pagar (Facturas de Proveedores)"
          data={payables}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Proveedor", accessor: "vendor" },
            { header: "Factura/Orden", accessor: "invoice_number", width: "20%" },
            { header: "Monto", accessor: "amount", type: "currency", width: "20%" },
            { header: "Fecha Venc.", accessor: "due_date", width: "20%" },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'presupuestos') {
      return (
        <DataTable
          title="Control y Gestión Presupuestaria"
          data={budgets}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Departamento", accessor: "department" },
            { header: "Categoría", accessor: "category" },
            { header: "Asignado", accessor: "allocated", type: "currency" },
            { header: "Consumido", accessor: "spent", type: "currency" },
            { header: "Período", accessor: "period", width: "15%" },
            { header: "Eficiencia", accessor: "utilization", width: "15%", cell: (row) => {
              const pct = Math.round((row.spent / row.allocated) * 100) || 0;
              const barColor = pct > 100 ? 'var(--error-color)' : pct > 80 ? 'var(--warning-color)' : 'var(--success-color)';
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{pct}%</span>
                  <div style={{ background: '#edebe9', height: '4px', width: '100%', borderRadius: '2px' }}>
                    <div style={{ background: barColor, height: '4px', width: `${Math.min(pct, 100)}%`, borderRadius: '2px' }}></div>
                  </div>
                </div>
              );
            }}
          ]}
        />
      );
    }

    if (activeTab === 'caja') {
      return (
        <DataTable
          title="Historial de Flujo de Caja (Cash Flow)"
          data={cashflow}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Descripción", accessor: "description" },
            { header: "Categoría", accessor: "category", width: "20%" },
            { header: "Tipo", accessor: "type", width: "15%", cell: (row) => (
              <span className={`badge ${row.type.toLowerCase() === 'inflow' ? 'success' : 'error'}`}>
                {row.type === 'Inflow' ? 'Entrada' : 'Salida'}
              </span>
            )},
            { header: "Monto", accessor: "amount", type: "currency", width: "20%" },
            { header: "Fecha", accessor: "date", width: "15%" }
          ]}
        />
      );
    }

    if (activeTab === 'activos') {
      return (
        <DataTable
          title="Control de Activos Fijos y Depreciaciones"
          data={assets}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Activo", accessor: "name" },
            { header: "Categoría", accessor: "category", width: "15%" },
            { header: "Costo Original", accessor: "acquisition_cost", type: "currency", width: "18%" },
            { header: "Amortización Anual", accessor: "depreciation_rate", width: "15%", cell: (row) => `${row.depreciation_rate}%` },
            { header: "Valor Actual", accessor: "current_value", type: "currency", width: "18%" },
            { header: "Ubicación", accessor: "location", width: "15%" }
          ]}
        />
      );
    }

    if (activeTab === 'conciliacion') {
      return (
        <DataTable
          title="Módulo de Conciliaciones Bancarias"
          data={reconciliations}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Cuenta Bancaria", accessor: "bank_account" },
            { header: "Fecha Extracto", accessor: "statement_date", width: "15%" },
            { header: "Saldo Extracto", accessor: "statement_balance", type: "currency" },
            { header: "Saldo Libros", accessor: "book_balance", type: "currency" },
            { header: "Diferencia", accessor: "difference", type: "currency", cell: (row) => {
              const diff = row.statement_balance - row.book_balance;
              return (
                <span style={{ color: diff === 0 ? 'var(--success-color)' : 'var(--error-color)', fontWeight: 600 }}>
                  ${diff.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                </span>
              );
            }},
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'monedas') {
      return (
        <DataTable
          title="Configuración de Multi-divisas"
          data={currencies}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Código Divisa", accessor: "code", width: "20%" },
            { header: "Nombre Moneda", accessor: "name" },
            { header: "Tipo de Cambio (a USD)", accessor: "exchange_rate", width: "30%", cell: (row) => (
              <span>1 USD = {row.exchange_rate} {row.code}</span>
            )}
          ]}
        />
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Finance Dynamics 365</h1>
        <p className="page-description">Módulo contable integral para la planeación financiera global, presupuestos, flujos de caja y conciliaciones.</p>
      </div>

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'contabilidad' ? 'active' : ''}`} onClick={() => setActiveTab('contabilidad')}>Contabilidad</button>
        <button className={`tab-btn ${activeTab === 'cobros' ? 'active' : ''}`} onClick={() => setActiveTab('cobros')}>Cuentas por Cobrar</button>
        <button className={`tab-btn ${activeTab === 'pagos' ? 'active' : ''}`} onClick={() => setActiveTab('pagos')}>Cuentas por Pagar</button>
        <button className={`tab-btn ${activeTab === 'presupuestos' ? 'active' : ''}`} onClick={() => setActiveTab('presupuestos')}>Presupuestos</button>
        <button className={`tab-btn ${activeTab === 'caja' ? 'active' : ''}`} onClick={() => setActiveTab('caja')}>Flujo de Caja</button>
        <button className={`tab-btn ${activeTab === 'activos' ? 'active' : ''}`} onClick={() => setActiveTab('activos')}>Activos Fijos</button>
        <button className={`tab-btn ${activeTab === 'conciliacion' ? 'active' : ''}`} onClick={() => setActiveTab('conciliacion')}>Conciliación Bancaria</button>
        <button className={`tab-btn ${activeTab === 'monedas' ? 'active' : ''}`} onClick={() => setActiveTab('monedas')}>Monedas</button>
      </div>

      {renderTabContent()}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        title={modalTitle}
        fields={modalFields}
        initialValues={modalInitialValues}
      />
    </div>
  );
};

export default Finance;
