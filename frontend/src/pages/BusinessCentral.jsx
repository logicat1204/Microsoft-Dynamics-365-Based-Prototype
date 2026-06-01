import React, { useState, useEffect } from 'react';
import { businessCentralApi } from '../services/api';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const BusinessCentral = () => {
  const [activeTab, setActiveTab] = useState('finanzas');
  
  // Data states
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFields, setModalFields] = useState([]);
  const [modalInitialValues, setModalInitialValues] = useState({});
  const [editingId, setEditingId] = useState(null);

  // Load data
  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = () => {
    if (activeTab === 'finanzas') businessCentralApi.getChartOfAccounts().then(setChartOfAccounts);
    if (activeTab === 'crm') {
      businessCentralApi.getContacts().then(setContacts);
      businessCentralApi.getOpportunities().then(setOpportunities);
    }
    if (activeTab === 'logistica') {
      businessCentralApi.getInventory().then(setInventory);
      businessCentralApi.getPurchaseOrders().then(setPurchaseOrders);
    }
    if (activeTab === 'proyectos') businessCentralApi.getServiceOrders().then(setServiceOrders);
    if (activeTab === 'produccion') businessCentralApi.getProductionOrders().then(setProductionOrders);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalInitialValues({});
    
    if (activeTab === 'finanzas') {
      setModalTitle("Crear Cuenta del Plan");
      setModalFields([
        { name: 'account_no', label: 'Nº Cuenta', type: 'text', required: true, placeholder: 'Ej. 10100' },
        { name: 'name', label: 'Nombre de Cuenta', type: 'text', required: true, placeholder: 'Ej. Caja Chica' },
        { name: 'type', label: 'Tipo Registro', type: 'select', required: true, options: ['Posting', 'Heading', 'Total'], defaultValue: 'Posting' },
        { name: 'category', label: 'Categoría Financiera', type: 'select', required: true, options: ['Current Assets', 'Current Liabilities', 'Equity', 'Income', 'Expense'] },
        { name: 'balance', label: 'Saldo Disponible ($)', type: 'number', required: true, defaultValue: 0 },
        { name: 'dimension1', label: 'Dimensión Depto.', type: 'text', placeholder: 'Ej. DEPT-PROD' },
        { name: 'dimension2', label: 'Dimensión Proyecto', type: 'text', placeholder: 'Ej. PROY-VTE' }
      ]);
    } else if (activeTab === 'crm') {
      setModalTitle("Crear Ficha de Contacto CRM");
      setModalFields([
        { name: 'name', label: 'Nombre Completo', type: 'text', required: true, placeholder: 'Ej. Carlos Mendez' },
        { name: 'company', label: 'Empresa / Cuenta', type: 'text', placeholder: 'Ej. Silva Industries' },
        { name: 'email', label: 'Correo Electrónico', type: 'text', required: true, placeholder: 'carlos@silva.com' },
        { name: 'phone', label: 'Teléfono', type: 'text', required: true, placeholder: '+591-4-123456' },
        { name: 'type', label: 'Tipo Contacto', type: 'select', required: true, options: ['Customer', 'Vendor', 'Lead'], defaultValue: 'Customer' },
        { name: 'segment', label: 'Segmento Cliente', type: 'select', required: true, options: ['Enterprise', 'SMB', 'Partner'], defaultValue: 'SMB' }
      ]);
    } else if (activeTab === 'proyectos') {
      setModalTitle("Crear Orden de Servicio Técnico");
      setModalFields([
        { name: 'order_no', label: 'Número de Orden', type: 'text', required: true, placeholder: 'Ej. SO-003' },
        { name: 'customer', label: 'Cliente', type: 'text', required: true, placeholder: 'Ej. Acme Corp' },
        { name: 'description', label: 'Descripción de Falla / Trabajo', type: 'textarea', required: true },
        { name: 'assigned_to', label: 'Técnico Asignado', type: 'text', required: true, placeholder: 'Ej. Tech Team A' },
        { name: 'priority', label: 'Prioridad', type: 'select', required: true, options: ['High', 'Normal', 'Low'], defaultValue: 'Normal' },
        { name: 'scheduled_date', label: 'Fecha Programada', type: 'date', required: true },
        { name: 'status', label: 'Estado Servicio', type: 'select', required: true, options: ['Open', 'In Progress', 'Finished'], defaultValue: 'Open' }
      ]);
    } else if (activeTab === 'produccion') {
      setModalTitle("Crear Orden de Producción / Fabricación");
      setModalFields([
        { name: 'order_no', label: 'Nº Orden de Fabricación', type: 'text', required: true, placeholder: 'Ej. MO-003' },
        { name: 'product', label: 'Producto a Fabricar', type: 'text', required: true, placeholder: 'Ej. Widget C' },
        { name: 'quantity', label: 'Cantidad', type: 'number', required: true, min: 1 },
        { name: 'bom', label: 'Línea BOM Asociada', type: 'text', placeholder: 'Ej. BOM-WidgetC' },
        { name: 'route', label: 'Ruta de Producción', type: 'text', placeholder: 'Ej. RUTA-TornoAssembly' },
        { name: 'work_center', label: 'Centro de Trabajo', type: 'text', placeholder: 'Ej. Centro CNC' },
        { name: 'start_date', label: 'Fecha Programada Inicio', type: 'date', required: true },
        { name: 'due_date', label: 'Fecha Límite Entrega', type: 'date', required: true },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Planned', 'In Progress', 'Completed'], defaultValue: 'Planned' }
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
    
    if (activeTab === 'finanzas') {
      apiCall = editingId ? businessCentralApi.updateChartOfAccounts(editingId, formData) : businessCentralApi.createChartOfAccounts(formData);
    } else if (activeTab === 'crm') {
      apiCall = editingId ? businessCentralApi.updateContact(editingId, formData) : businessCentralApi.createContact(formData);
    } else if (activeTab === 'proyectos') {
      apiCall = editingId ? businessCentralApi.updateServiceOrder(editingId, formData) : businessCentralApi.createServiceOrder(formData);
    } else if (activeTab === 'produccion') {
      apiCall = editingId ? businessCentralApi.updateProductionOrder(editingId, formData) : businessCentralApi.createProductionOrder(formData);
    }

    apiCall.then(() => {
      setIsModalOpen(false);
      loadTabData();
    }).catch(err => alert("Error al guardar: " + err.message));
  };

  const handleDelete = (id) => {
    let apiCall;
    if (activeTab === 'finanzas') apiCall = businessCentralApi.deleteChartOfAccounts(id);
    if (activeTab === 'crm') apiCall = businessCentralApi.deleteContact(id);
    if (activeTab === 'proyectos') apiCall = businessCentralApi.deleteServiceOrder(id);
    if (activeTab === 'produccion') apiCall = businessCentralApi.deleteProductionOrder(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Helper delete for Logistica CRUD (reused from SC tables)
  const handleLogisticaDelete = (id, type) => {
    const apiCall = type === 'inventory' 
      ? businessCentralApi.deleteInventory(id) 
      : businessCentralApi.deletePurchaseOrder(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Render correct grid based on active tab
  const renderTabContent = () => {
    if (activeTab === 'finanzas') {
      return (
        <DataTable
          title="6.1 Plan de Cuentas & Dimensiones Analíticas"
          data={chartOfAccounts}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Nº Cuenta", accessor: "account_no", width: "12%" },
            { header: "Nombre Cuenta", accessor: "name" },
            { header: "Tipo Registro", accessor: "type", width: "15%" },
            { header: "Categoría", accessor: "category", width: "15%" },
            { header: "Saldo", accessor: "balance", type: "currency", width: "15%" },
            { header: "Dimensión Depto.", accessor: "dimension1", width: "15%" },
            { header: "Dimensión Proy.", accessor: "dimension2", width: "15%" }
          ]}
        />
      );
    }

    if (activeTab === 'crm') {
      return (
        <div className="flex flex-col gap-lg">
          <DataTable
            title="6.2 Fichas de Contactos y Cuentas de Clientes"
            data={contacts}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            columns={[
              { header: "Nombre Contacto", accessor: "name" },
              { header: "Empresa", accessor: "company", width: "20%" },
              { header: "Correo Electrónico", accessor: "email", width: "20%" },
              { header: "Teléfono", accessor: "phone", width: "18%" },
              { header: "Tipo", accessor: "type", width: "12%", cell: (row) => (
                <span className={`badge ${row.type.toLowerCase()}`}>{row.type}</span>
              )},
              { header: "Segmento", accessor: "segment", width: "12%" }
            ]}
          />

          <DataTable
            title="Embudo de Ventas & Oportunidades de Negocio"
            data={opportunities}
            columns={[
              { header: "Negocio / Oportunidad", accessor: "name" },
              { header: "Valor Estimado", accessor: "value", type: "currency", width: "20%" },
              { header: "Etapa", accessor: "stage", width: "18%", cell: (row) => (
                <span className="badge warning">{row.stage}</span>
              )},
              { header: "Probabilidad", accessor: "probability", width: "15%", cell: (row) => (
                <strong>{row.probability}%</strong>
              )},
              { header: "Responsable", accessor: "assigned_to", width: "20%" }
            ]}
          />
        </div>
      );
    }

    if (activeTab === 'logistica') {
      return (
        <div className="flex flex-col gap-lg">
          <DataTable
            title="6.3 Control de Stock en Múltiples Almacenes"
            data={inventory}
            onDelete={(id) => handleLogisticaDelete(id, 'inventory')}
            columns={[
              { header: "SKU", accessor: "sku", width: "15%" },
              { header: "Producto / Insumo", accessor: "name" },
              { header: "Cantidad", accessor: "quantity", width: "15%", cell: (row) => (
                <strong>{row.quantity} {row.unit}</strong>
              )},
              { header: "Costo Unitario", accessor: "unit_cost", type: "currency", width: "20%" },
              { header: "Lote de Trazabilidad", accessor: "lot_number" }
            ]}
          />

          <DataTable
            title="Órdenes de Compra y Aprovisionamiento Integrado"
            data={purchaseOrders}
            onDelete={(id) => handleLogisticaDelete(id, 'po')}
            columns={[
              { header: "Nº PO", accessor: "po_number", width: "20%" },
              { header: "Proveedor", accessor: "vendor" },
              { header: "Monto PO", accessor: "total", type: "currency", width: "20%" },
              { header: "Fecha Pedido", accessor: "order_date", width: "15%" },
              { header: "Estado Recepción", accessor: "status", width: "15%", cell: (row) => (
                <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
              )}
            ]}
          />
        </div>
      );
    }

    if (activeTab === 'proyectos') {
      return (
        <DataTable
          title="6.4 Órdenes de Servicio Técnico de Asistencia Posventa"
          data={serviceOrders}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Nº Orden", accessor: "order_no", width: "12%" },
            { header: "Cliente", accessor: "customer" },
            { header: "Falla / Descripción del Trabajo", accessor: "description" },
            { header: "Técnico Asignado", accessor: "assigned_to", width: "15%" },
            { header: "Prioridad", accessor: "priority", width: "12%", cell: (row) => (
              <span className={`badge ${row.priority.toLowerCase() === 'high' ? 'error' : 'success'}`}>
                {row.priority}
              </span>
            )},
            { header: "Fecha Programada", accessor: "scheduled_date", width: "15%" },
            { header: "Estado", accessor: "status", width: "12%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'produccion') {
      return (
        <DataTable
          title="6.5 Órdenes de Producción e Industrialización (BOM / Rutas)"
          data={productionOrders}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Nº Fabricación", accessor: "order_no", width: "15%" },
            { header: "Producto a Elaborar", accessor: "product" },
            { header: "Cantidad", accessor: "quantity", width: "12%", cell: (row) => `${row.quantity} units` },
            { header: "Línea BOM", accessor: "bom", width: "15%", cell: (row) => row.bom || 'Genérico' },
            { header: "Línea Ruta", accessor: "route", width: "15%", cell: (row) => row.route || 'Genérico' },
            { header: "Inicio Programado", accessor: "start_date", width: "15%" },
            { header: "Estado", accessor: "status", width: "12%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dynamics 365 Business Central</h1>
        <p className="page-description">ERP Unificado para Pequeñas y Medianas Empresas: contabilidad analítica por dimensiones, CRM y embudo integrado, logística en múltiples almacenes, mantenimiento posventa y manufacturación ligera.</p>
      </div>

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'finanzas' ? 'active' : ''}`} onClick={() => setActiveTab('finanzas')}>6.1 Gestión Financiera</button>
        <button className={`tab-btn ${activeTab === 'crm' ? 'active' : ''}`} onClick={() => setActiveTab('crm')}>6.2 Ventas & CRM</button>
        <button className={`tab-btn ${activeTab === 'logistica' ? 'active' : ''}`} onClick={() => setActiveTab('logistica')}>6.3 Logística & Compras</button>
        <button className={`tab-btn ${activeTab === 'proyectos' ? 'active' : ''}`} onClick={() => setActiveTab('proyectos')}>6.4 Servicio Técnico</button>
        <button className={`tab-btn ${activeTab === 'produccion' ? 'active' : ''}`} onClick={() => setActiveTab('produccion')}>6.5 Producción</button>
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

export default BusinessCentral;
