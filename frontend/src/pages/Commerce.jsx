import React, { useState, useEffect } from 'react';
import { commerceApi } from '../services/api';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const Commerce = () => {
  const [activeTab, setActiveTab] = useState('pos');
  
  // Data states
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loyalty, setLoyalty] = useState([]);

  // POS Checkout Interactive States
  const [posCart, setPosCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [cartQty, setCartQty] = useState(1);
  const [posCustomer, setPosCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

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
    if (activeTab === 'pos') {
      commerceApi.getProducts().then(setProducts);
      commerceApi.getTransactions().then(setTransactions);
    }
    if (activeTab === 'catalogo') commerceApi.getProducts().then(setProducts);
    if (activeTab === 'promociones') commerceApi.getPromotions().then(setPromotions);
    if (activeTab === 'fidelizacion') commerceApi.getLoyalty().then(setLoyalty);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalInitialValues({});
    
    if (activeTab === 'catalogo') {
      setModalTitle("Agregar Producto al Catálogo");
      setModalFields([
        { name: 'sku', label: 'Código SKU', type: 'text', required: true, placeholder: 'Ej. PROD-005' },
        { name: 'name', label: 'Nombre del Producto', type: 'text', required: true, placeholder: 'Ej. Mouse Inalámbrico Pro' },
        { name: 'category', label: 'Categoría', type: 'select', required: true, options: ['Electronics', 'Footwear', 'Accessories'] },
        { name: 'price', label: 'Precio de Venta ($)', type: 'number', required: true, min: 0 },
        { name: 'cost', label: 'Costo Unitario ($)', type: 'number', required: true, min: 0 },
        { name: 'stock', label: 'Stock Disponible', type: 'number', required: true, min: 0 },
        { name: 'description', label: 'Descripción Breve', type: 'textarea' }
      ]);
    } else if (activeTab === 'promociones') {
      setModalTitle("Crear Promoción de Precios");
      setModalFields([
        { name: 'name', label: 'Nombre Promoción', type: 'text', required: true, placeholder: 'Ej. Descuento Navideño' },
        { name: 'type', label: 'Tipo Descuento', type: 'select', required: true, options: ['Percentage', 'Fixed Price'], defaultValue: 'Percentage' },
        { name: 'value', label: 'Valor Descuento', type: 'number', required: true, min: 0 },
        { name: 'start_date', label: 'Fecha Inicio', type: 'date', required: true },
        { name: 'end_date', label: 'Fecha Fin', type: 'date', required: true },
        { name: 'category', label: 'Categoría Objetivo', type: 'select', required: true, options: ['Electronics', 'Footwear', 'Accessories'] }
      ]);
    } else if (activeTab === 'fidelizacion') {
      setModalTitle("Inscribir Miembro en Programa de Fidelización");
      setModalFields([
        { name: 'customer_name', label: 'Nombre Cliente', type: 'text', required: true, placeholder: 'Ej. María Pérez' },
        { name: 'email', label: 'Correo Electrónico', type: 'text', required: true, placeholder: 'maria@email.com' },
        { name: 'points', label: 'Puntos Acumulados', type: 'number', defaultValue: 0, min: 0 },
        { name: 'tier', label: 'Nivel', type: 'select', required: true, options: ['Bronze', 'Silver', 'Gold', 'Platinum'], defaultValue: 'Bronze' }
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
    
    if (activeTab === 'catalogo') {
      apiCall = editingId ? commerceApi.updateProduct(editingId, formData) : commerceApi.createProduct(formData);
    } else if (activeTab === 'promociones') {
      apiCall = editingId ? commerceApi.updatePromotion(editingId, formData) : commerceApi.createPromotion(formData);
    } else if (activeTab === 'fidelizacion') {
      apiCall = editingId ? commerceApi.updateLoyalty(editingId, formData) : commerceApi.createLoyalty(formData);
    }

    apiCall.then(() => {
      setIsModalOpen(false);
      loadTabData();
    }).catch(err => alert("Error al guardar: " + err.message));
  };

  const handleDelete = (id) => {
    let apiCall;
    if (activeTab === 'catalogo') apiCall = commerceApi.deleteProduct(id);
    if (activeTab === 'promociones') apiCall = commerceApi.deletePromotion(id);
    if (activeTab === 'fidelizacion') apiCall = commerceApi.deleteLoyalty(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Add Item to POS Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const prod = products.find(p => p.sku === selectedProduct);
    if (!prod) return;

    // Check stock
    if (prod.stock < cartQty) {
      alert("Stock insuficiente. Disponible: " + prod.stock);
      return;
    }

    // Add to cart list
    const cartItem = {
      sku: prod.sku,
      name: prod.name,
      price: prod.price,
      quantity: cartQty,
      total: prod.price * cartQty
    };

    setPosCart(prev => [...prev, cartItem]);
    setSelectedProduct("");
    setCartQty(1);
  };

  // POS Checkout Operation
  const handleCheckout = () => {
    if (posCart.length === 0) {
      alert("Su carrito está vacío.");
      return;
    }

    const subtotal = posCart.reduce((acc, curr) => acc + curr.total, 0);
    const tax = subtotal * 0.13; // 13% IVA
    const total = subtotal + tax;

    const checkoutPayload = {
      transaction_number: `TX-${Date.now().toString().slice(-8)}`,
      store: "Tienda Central LP",
      cashier: "Admin Cajero",
      items: JSON.stringify(posCart),
      subtotal,
      tax,
      total,
      payment_method: paymentMethod
    };

    // Save transaction
    commerceApi.createTransaction(checkoutPayload)
      .then(() => {
        alert(`¡Venta realizada con éxito! Código: ${checkoutPayload.transaction_number}. Total: $${total.toFixed(2)} USD.`);
        setPosCart([]);
        setPosCustomer("");
        loadTabData(); // reload tables
      })
      .catch(err => alert("Error en checkout: " + err.message));
  };

  const renderTabContent = () => {
    if (activeTab === 'pos') {
      return (
        <div className="pos-workspace flex gap-lg flex-wrap">
          {/* POS Catalog & Cart */}
          <div className="pos-left flex-col card flex" style={{ flex: 2, minWidth: '320px' }}>
            <h3 style={{ marginBottom: '16px' }}>Terminal de Punto de Venta (POS)</h3>
            
            <form onSubmit={handleAddToCart} className="flex gap-sm align-center flex-wrap" style={{ marginBottom: '20px' }}>
              <div className="form-group flex flex-col gap-sm" style={{ flex: 2 }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Seleccionar Producto</label>
                <select 
                  className="form-control"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">Buscar en catálogo...</option>
                  {products.map(p => (
                    <option key={p.sku} value={p.sku} disabled={p.stock <= 0}>
                      {p.name} - ${p.price} USD ({p.stock} disp.)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex flex-col gap-sm" style={{ width: '80px' }}>
                <label className="form-label" style={{ fontSize: '11px' }}>Cant.</label>
                <input 
                  type="number" 
                  min="1" 
                  className="form-control"
                  value={cartQty}
                  onChange={(e) => setCartQty(parseInt(e.target.value) || 1)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Añadir ➕
              </button>
            </form>

            <h4 style={{ marginBottom: '10px', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>Carrito de Compras</h4>
            <div className="table-wrapper" style={{ flex: 1, minHeight: '180px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {posCart.length > 0 ? (
                    posCart.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td><strong>${item.total.toFixed(2)}</strong></td>
                        <td>
                          <button 
                            className="btn-icon-only delete"
                            onClick={() => setPosCart(prev => prev.filter((_, i) => i !== idx))}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data text-center">Seleccione productos para cargarlos al POS.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* POS Payment Details */}
          <div className="pos-right flex-col card flex" style={{ flex: 1, minWidth: '280px', background: '#faf9f8' }}>
            <h3 style={{ marginBottom: '16px' }}>Checkout / Pago</h3>

            <div className="form-group flex flex-col gap-sm">
              <label className="form-label" style={{ fontSize: '11px' }}>Nombre Cliente (Opcional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej. María López" 
                value={posCustomer}
                onChange={(e) => setPosCustomer(e.target.value)}
              />
            </div>

            <div className="form-group flex flex-col gap-sm" style={{ marginTop: '12px' }}>
              <label className="form-label" style={{ fontSize: '11px' }}>Método de Pago</label>
              <select 
                className="form-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Efectivo / Cash</option>
                <option value="Card">Tarjeta Crédito / Débito</option>
                <option value="QR">Pago QR Express</option>
              </select>
            </div>

            <div style={{ marginTop: '20px', borderTop: '2px dashed var(--border-color)', paddingTop: '16px' }} className="flex flex-col gap-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                <span>${posCart.reduce((a,c) => a + c.total, 0).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-secondary)' }}>Impuestos (13% IVA):</span>
                <span>${(posCart.reduce((a,c) => a + c.total, 0) * 0.13).toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between" style={{ fontSize: '18px', fontWeight: 800, marginTop: '8px', color: 'var(--primary-color)' }}>
                <span>Total General:</span>
                <span>${(posCart.reduce((a,c) => a + c.total, 0) * 1.13).toFixed(2)} USD</span>
              </div>
            </div>

            <button 
              className="btn btn-primary w-full flex justify-center align-center gap-sm" 
              style={{ marginTop: '24px', padding: '12px 18px', fontSize: '16px' }}
              onClick={handleCheckout}
            >
              <span>💳 Confirmar Transacción</span>
            </button>
          </div>

          {/* Transactions List */}
          <div className="w-full">
            <DataTable 
              title="Registro Histórico de Transacciones POS"
              data={transactions}
              columns={[
                { header: "Número de Ticket", accessor: "transaction_number", width: "20%" },
                { header: "Establecimiento", accessor: "store", width: "20%" },
                { header: "Medio de Pago", accessor: "payment_method", width: "15%" },
                { header: "Subtotal", accessor: "subtotal", type: "currency" },
                { header: "Impuesto (IVA)", accessor: "tax", type: "currency" },
                { header: "Monto Total", accessor: "total", type: "currency" },
                { header: "Fecha y Hora", accessor: "created_at" }
              ]}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'catalogo') {
      return (
        <DataTable
          title="Catálogo Maestro de Productos Centralizado"
          data={products}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "SKU", accessor: "sku", width: "15%" },
            { header: "Nombre Producto", accessor: "name" },
            { header: "Categoría", accessor: "category", width: "15%" },
            { header: "Precio Público", accessor: "price", type: "currency", width: "18%" },
            { header: "Costo Unitario", accessor: "cost", type: "currency", width: "18%" },
            { header: "Existencias (Stock)", accessor: "stock", width: "15%", cell: (row) => (
              <span className={`badge ${row.stock > 20 ? 'success' : row.stock > 0 ? 'warning' : 'error'}`}>
                {row.stock} unidades
              </span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'promociones') {
      return (
        <DataTable
          title="Gestión de Precios Dinámicos & Promociones"
          data={promotions}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Promoción", accessor: "name" },
            { header: "Tipo Descuento", accessor: "type", width: "15%" },
            { header: "Valor Descuento", accessor: "value", width: "15%", cell: (row) => (
              row.type === 'Percentage' ? `${row.value}% OFF` : `$${row.value} USD`
            )},
            { header: "Categoría Aplicable", accessor: "category", width: "20%" },
            { header: "Fecha Inicio", accessor: "start_date", width: "15%" },
            { header: "Fecha Finalización", accessor: "end_date", width: "15%" }
          ]}
        />
      );
    }

    if (activeTab === 'fidelizacion') {
      return (
        <DataTable
          title="Administración del Club de Fidelización"
          data={loyalty}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Miembro", accessor: "customer_name" },
            { header: "Correo Electrónico", accessor: "email" },
            { header: "Puntos Acumulados", accessor: "points", width: "20%" },
            { header: "Rango / Nivel", accessor: "tier", width: "20%", cell: (row) => (
              <span className={`badge ${row.tier.toLowerCase()}`}>{row.tier}</span>
            )},
            { header: "Fecha Alta", accessor: "join_date", width: "20%" }
          ]}
        />
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dynamics 365 Commerce</h1>
        <p className="page-description">Integración de retail omnicanal: simulador POS de caja, gestión de inventarios unificados, promociones dinámicas y programas de lealtad.</p>
      </div>

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'pos' ? 'active' : ''}`} onClick={() => setActiveTab('pos')}>Punto de Venta (POS)</button>
        <button className={`tab-btn ${activeTab === 'catalogo' ? 'active' : ''}`} onClick={() => setActiveTab('catalogo')}>Catálogo Centralizado</button>
        <button className={`tab-btn ${activeTab === 'promociones' ? 'active' : ''}`} onClick={() => setActiveTab('promociones')}>Precios y Promociones</button>
        <button className={`tab-btn ${activeTab === 'fidelizacion' ? 'active' : ''}`} onClick={() => setActiveTab('fidelizacion')}>Fidelización Clientes</button>
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

export default Commerce;
