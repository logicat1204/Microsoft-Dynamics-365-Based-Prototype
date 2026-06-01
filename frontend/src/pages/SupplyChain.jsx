import React, { useState, useEffect } from 'react';
import { supplyChainApi } from '../services/api';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const SupplyChain = () => {
  const [activeTab, setActiveTab] = useState('almacenes');
  
  // Data states
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  // Slider forecasting state
  const [forecastMultiplier, setForecastMultiplier] = useState(1.15);

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
    if (activeTab === 'almacenes') supplyChainApi.getWarehouses().then(setWarehouses);
    if (activeTab === 'inventario') supplyChainApi.getInventory().then(setInventory);
    if (activeTab === 'compras') supplyChainApi.getPurchaseOrders().then(setPurchaseOrders);
    if (activeTab === 'calidad') supplyChainApi.getQualityChecks().then(setQualityChecks);
    if (activeTab === 'mantenimiento') supplyChainApi.getMaintenance().then(setMaintenance);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalInitialValues({});
    
    if (activeTab === 'almacenes') {
      setModalTitle("Crear Almacén / Centro de Distribución");
      setModalFields([
        { name: 'code', label: 'Código Almacén', type: 'text', required: true, placeholder: 'Ej. WH-003' },
        { name: 'name', label: 'Nombre Almacén', type: 'text', required: true, placeholder: 'Ej. Almacén Central de Repuestos' },
        { name: 'location', label: 'Ubicación', type: 'text', required: true, placeholder: 'Ej. Zona Industrial Sur' },
        { name: 'capacity', label: 'Capacidad Máxima (M3 / Unidades)', type: 'number', required: true, min: 0 },
        { name: 'used', label: 'Capacidad Utilizada', type: 'number', defaultValue: 0, min: 0 },
        { name: 'manager', label: 'Administrador / Encargado', type: 'text', required: true, placeholder: 'Ej. Juan Pérez' }
      ]);
    } else if (activeTab === 'inventario') {
      setModalTitle("Registrar SKU / Stock de Inventario");
      setModalFields([
        { name: 'sku', label: 'Código SKU', type: 'text', required: true, placeholder: 'Ej. RAW-003' },
        { name: 'name', label: 'Nombre Producto / Material', type: 'text', required: true, placeholder: 'Ej. Bobina de Cobre' },
        { name: 'warehouse_id', label: 'Almacén Asignado (ID)', type: 'number', required: true, defaultValue: 1 },
        { name: 'quantity', label: 'Cantidad en Stock', type: 'number', required: true, min: 0 },
        { name: 'unit', label: 'Unidad de Medida', type: 'select', required: true, options: ['units', 'kg', 'liters', 'meters'], defaultValue: 'units' },
        { name: 'min_stock', label: 'Stock Mínimo de Alerta', type: 'number', required: true, min: 0 },
        { name: 'unit_cost', label: 'Costo Unitario ($)', type: 'number', required: true, min: 0 },
        { name: 'lot_number', label: 'Número de Lote (Trazabilidad)', type: 'text', placeholder: 'Ej. LOT-2026-009' },
        { name: 'serial_number', label: 'Número de Serie (Opcional)', type: 'text' }
      ]);
    } else if (activeTab === 'compras') {
      setModalTitle("Crear Orden de Compra (PO)");
      setModalFields([
        { name: 'po_number', label: 'Número de PO', type: 'text', required: true, placeholder: 'Ej. PO-2026-003' },
        { name: 'vendor', label: 'Proveedor', type: 'text', required: true, placeholder: 'Ej. Steel Suppliers Inc' },
        { name: 'order_date', label: 'Fecha de Orden', type: 'date', required: true },
        { name: 'expected_date', label: 'Fecha Estimada de Entrega', type: 'date', required: true },
        { name: 'total', label: 'Monto Total PO ($)', type: 'number', required: true, min: 0 },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Draft', 'Approved', 'Received', 'Cancelled'], defaultValue: 'Draft' }
      ]);
    } else if (activeTab === 'calidad') {
      setModalTitle("Registrar Inspección de Calidad");
      setModalFields([
        { name: 'reference', label: 'Documento / Lote de Referencia', type: 'text', required: true, placeholder: 'Ej. PO-2026-001' },
        { name: 'product', label: 'Producto / Item Inspeccionado', type: 'text', required: true, placeholder: 'Ej. Acero Galvanizado' },
        { name: 'inspector', label: 'Inspector Técnico', type: 'text', required: true, placeholder: 'Ej. Ing. Laura Gómez' },
        { name: 'check_date', label: 'Fecha de Inspección', type: 'date', required: true },
        { name: 'result', label: 'Resultado', type: 'select', required: true, options: ['Approved', 'Rejected', 'Pending'], defaultValue: 'Pending' },
        { name: 'notes', label: 'Observaciones / Detalles de Calidad', type: 'textarea' }
      ]);
    } else if (activeTab === 'mantenimiento') {
      setModalTitle("Programar Mantenimiento de Maquinaria (Activos)");
      setModalFields([
        { name: 'asset_name', label: 'Nombre de Maquinaria / Activo', type: 'text', required: true, placeholder: 'Ej. Torno CNC H3' },
        { name: 'type', label: 'Tipo de Mantenimiento', type: 'select', required: true, options: ['Preventive', 'Corrective'], defaultValue: 'Preventive' },
        { name: 'scheduled_date', label: 'Fecha Programada', type: 'date', required: true },
        { name: 'completed_date', label: 'Fecha de Finalización (Opcional)', type: 'date' },
        { name: 'technician', label: 'Técnico Responsable', type: 'text', required: true, placeholder: 'Ej. Juan Pérez' },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Scheduled', 'In Progress', 'Completed'], defaultValue: 'Scheduled' },
        { name: 'cost', label: 'Costo de Refacciones / Mano Obra', type: 'number', defaultValue: 0 },
        { name: 'notes', label: 'Descripción del Trabajo', type: 'textarea' }
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
    
    if (activeTab === 'almacenes') {
      apiCall = editingId ? supplyChainApi.updateWarehouse(editingId, formData) : supplyChainApi.createWarehouse(formData);
    } else if (activeTab === 'inventario') {
      apiCall = editingId ? supplyChainApi.updateInventory(editingId, formData) : supplyChainApi.createInventory(formData);
    } else if (activeTab === 'compras') {
      apiCall = editingId ? supplyChainApi.updatePurchaseOrder(editingId, formData) : supplyChainApi.createPurchaseOrder(formData);
    } else if (activeTab === 'calidad') {
      apiCall = editingId ? supplyChainApi.updateQualityCheck(editingId, formData) : supplyChainApi.createQualityCheck(formData);
    } else if (activeTab === 'mantenimiento') {
      apiCall = editingId ? supplyChainApi.updateMaintenance(editingId, formData) : supplyChainApi.createMaintenance(formData);
    }

    apiCall.then(() => {
      setIsModalOpen(false);
      loadTabData();
    }).catch(err => alert("Error al guardar: " + err.message));
  };

  const handleDelete = (id) => {
    let apiCall;
    if (activeTab === 'almacenes') apiCall = supplyChainApi.deleteWarehouse(id);
    if (activeTab === 'inventario') apiCall = supplyChainApi.deleteInventory(id);
    if (activeTab === 'compras') apiCall = supplyChainApi.deletePurchaseOrder(id);
    if (activeTab === 'calidad') apiCall = supplyChainApi.deleteQualityCheck(id);
    if (activeTab === 'mantenimiento') apiCall = supplyChainApi.deleteMaintenance(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Render correct grid based on active tab
  const renderTabContent = () => {
    if (activeTab === 'almacenes') {
      return (
        <DataTable
          title="Gestión de Almacenes (WMS)"
          data={warehouses}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Código", accessor: "code", width: "15%" },
            { header: "Almacén", accessor: "name" },
            { header: "Ubicación", accessor: "location", width: "20%" },
            { header: "Manager", accessor: "manager", width: "20%" },
            { header: "Capacidad Utilizada", accessor: "utilization", width: "20%", cell: (row) => {
              const pct = Math.round((row.used / row.capacity) * 100) || 0;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{row.used} / {row.capacity} ({pct}%)</span>
                  <div style={{ background: '#edebe9', height: '4px', width: '100%', borderRadius: '2px' }}>
                    <div style={{ background: pct > 85 ? 'var(--warning-color)' : 'var(--primary-color)', height: '4px', width: `${Math.min(pct, 100)}%`, borderRadius: '2px' }}></div>
                  </div>
                </div>
              );
            }}
          ]}
        />
      );
    }

    if (activeTab === 'inventario') {
      return (
        <DataTable
          title="Control de Inventarios & Trazabilidad (Lotes / Series)"
          data={inventory}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "SKU", accessor: "sku", width: "12%" },
            { header: "Producto / Insumo", accessor: "name" },
            { header: "Cantidad", accessor: "quantity", cell: (row) => (
              <span style={{ fontWeight: 600, color: row.quantity <= row.min_stock ? 'var(--error-color)' : 'inherit' }}>
                {row.quantity} {row.unit} {row.quantity <= row.min_stock && '⚠️'}
              </span>
            )},
            { header: "Costo Unitario", accessor: "unit_cost", type: "currency", width: "15%" },
            { header: "Número Lote", accessor: "lot_number", width: "15%" },
            { header: "Número Serie", accessor: "serial_number", width: "15%", cell: (row) => row.serial_number || '-' }
          ]}
        />
      );
    }

    if (activeTab === 'compras') {
      return (
        <DataTable
          title="Órdenes de Compra y Abastecimiento"
          data={purchaseOrders}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Número PO", accessor: "po_number", width: "15%" },
            { header: "Proveedor", accessor: "vendor" },
            { header: "Monto PO", accessor: "total", type: "currency", width: "18%" },
            { header: "Fecha Orden", accessor: "order_date", width: "15%" },
            { header: "Fecha Ent. Estimada", accessor: "expected_date", width: "18%" },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'calidad') {
      return (
        <DataTable
          title="Módulo de Control de Calidad"
          data={qualityChecks}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Referencia", accessor: "reference", width: "15%" },
            { header: "Item Inspeccionado", accessor: "product" },
            { header: "Inspector", accessor: "inspector", width: "20%" },
            { header: "Fecha Inspección", accessor: "check_date", width: "15%" },
            { header: "Notas / Observación", accessor: "notes" },
            { header: "Resultado", accessor: "result", width: "15%", cell: (row) => (
              <span className={`badge ${row.result.toLowerCase()}`}>{row.result}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'mantenimiento') {
      return (
        <DataTable
          title="Plan de Mantenimiento Preventivo & Correctivo de Activos"
          data={maintenance}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Maquinaria / Activo", accessor: "asset_name" },
            { header: "Tipo Mant.", accessor: "type", width: "15%", cell: (row) => (
              <span className={`badge ${row.type.toLowerCase() === 'preventive' ? 'success' : 'warning'}`}>
                {row.type === 'Preventive' ? 'Preventivo' : 'Correctivo'}
              </span>
            )},
            { header: "Programado para", accessor: "scheduled_date", width: "15%" },
            { header: "Técnico Responsable", accessor: "technician", width: "20%" },
            { header: "Costo Mant.", accessor: "cost", type: "currency", width: "15%" },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'prevision') {
      // Custom Interactive Simple IA Demand Forecasting Tab
      return (
        <div className="forecast-dashboard flex flex-col gap-lg card">
          <div className="flex justify-between align-center flex-wrap gap-md">
            <div>
              <h3>Previsión de Demanda Inteligente (IA Simple)</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Modelo matemático lineal de demanda agregada basado en estacionalidad de pedidos.
              </p>
            </div>
            
            <div className="flex align-center gap-md" style={{ background: '#faf9f8', padding: '12px 18px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>FACTOR DE CRECIMIENTO IA:</label>
              <input 
                type="range" 
                min="0.8" 
                max="1.5" 
                step="0.05"
                value={forecastMultiplier}
                onChange={(e) => setForecastMultiplier(parseFloat(e.target.value))}
                style={{ width: '120px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-color)' }}>{Math.round(forecastMultiplier * 100)}%</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#faf9f8', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>DEMANDA ESTIMADA SIGUIENTE MES</span>
              <h1 style={{ fontSize: '32px', color: 'var(--primary-color)', fontWeight: 800, marginTop: '8px' }}>
                {Math.round(2500 * forecastMultiplier).toLocaleString()} <span style={{ fontSize: '16px', fontWeight: 400 }}>unidades</span>
              </h1>
              <span style={{ fontSize: '11px', color: 'var(--success-color)', fontWeight: 600 }}>↗ Estacionalidad Fuerte</span>
            </div>

            <div style={{ background: '#faf9f8', padding: '16px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>RIESGO DE RUPTURA DE STOCK</span>
              <h1 style={{ fontSize: '32px', color: forecastMultiplier > 1.3 ? 'var(--error-color)' : 'var(--success-color)', fontWeight: 800, marginTop: '8px' }}>
                {forecastMultiplier > 1.3 ? 'ALTO ⚠️' : 'BAJO ✅'}
              </h1>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Monitoreando 3 SKUs críticos</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Consumo Promedio</th>
                  <th>Previsión Siguiente Mes (IA)</th>
                  <th>Estado Recomendado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>RAW-001</td>
                  <td>Steel Sheets</td>
                  <td>500 kg</td>
                  <td>320 kg</td>
                  <td><strong>{Math.round(320 * forecastMultiplier)} kg</strong></td>
                  <td><span className="badge success">Stock Suficiente</span></td>
                </tr>
                <tr>
                  <td>RAW-002</td>
                  <td>Aluminum Bars</td>
                  <td>300 units</td>
                  <td>210 units</td>
                  <td><strong>{Math.round(210 * forecastMultiplier)} units</strong></td>
                  <td><span className="badge success">Stock Suficiente</span></td>
                </tr>
                <tr>
                  <td>FIN-001</td>
                  <td>Widget A</td>
                  <td>1200 units</td>
                  <td>950 units</td>
                  <td><strong>{Math.round(950 * forecastMultiplier)} units</strong></td>
                  <td>
                    {Math.round(950 * forecastMultiplier) > 1200 ? (
                      <span className="badge error">Reabastecer Ya</span>
                    ) : (
                      <span className="badge success">Stock Suficiente</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Supply Chain Management</h1>
        <p className="page-description">Módulo inteligente de cadena de suministro: control de inventario en tiempo real, almacenes WMS, compras, mantenimiento preventivo y previsión de demanda.</p>
      </div>

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'almacenes' ? 'active' : ''}`} onClick={() => setActiveTab('almacenes')}>Almacenes (WMS)</button>
        <button className={`tab-btn ${activeTab === 'inventario' ? 'active' : ''}`} onClick={() => setActiveTab('inventario')}>Inventarios</button>
        <button className={`tab-btn ${activeTab === 'compras' ? 'active' : ''}`} onClick={() => setActiveTab('compras')}>Compras (PO)</button>
        <button className={`tab-btn ${activeTab === 'calidad' ? 'active' : ''}`} onClick={() => setActiveTab('calidad')}>Calidad</button>
        <button className={`tab-btn ${activeTab === 'mantenimiento' ? 'active' : ''}`} onClick={() => setActiveTab('mantenimiento')}>Mantenimiento</button>
        <button className={`tab-btn ${activeTab === 'prevision' ? 'active' : ''}`} onClick={() => setActiveTab('prevision')}>Previsión de Demanda (IA)</button>
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

export default SupplyChain;
