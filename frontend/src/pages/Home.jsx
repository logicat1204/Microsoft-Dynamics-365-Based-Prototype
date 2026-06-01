import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import { financeApi } from '../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssets: 500000,
    totalLiabilities: 65000,
    totalRevenue: 350000,
    pendingReceivables: 45500,
    pendingPayables: 20000
  });

  const [copilotPrompt, setCopilotPrompt] = useState("");
  const [copilotResponse, setCopilotResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    financeApi.getDashboard()
      .then(res => setStats(res))
      .catch(err => console.error("Error loading dashboard metrics:", err));
  }, []);

  const handleCopilotSubmit = (e) => {
    e.preventDefault();
    if (!copilotPrompt.trim()) return;

    setLoading(true);
    setCopilotResponse("");

    setTimeout(() => {
      const promptLower = copilotPrompt.toLowerCase();
      let reply = "";

      if (promptLower.includes('concili') || promptLower.includes('reconcil')) {
        reply = "🤖 **Copilot Conciliador:** He analizado los extractos bancarios cargados en el sistema contra el libro mayor de Contabilidad. He encontrado un 98% de coincidencia exacta. Recomiendo conciliar automáticamente 12 transacciones de clientes y he marcado 2 discrepancias menores de comisiones bancarias para su revisión manual.";
      } else if (promptLower.includes('riesgo') || promptLower.includes('pago') || promptLower.includes('predecir')) {
        reply = "🤖 **Copilot Predictivo:** Basado en el historial de pagos de facturas de clientes, estimo un riesgo moderado en el cliente *Tech Solutions* con un retraso promedio de 12 días en sus últimas 3 transacciones. El flujo de caja para el próximo mes se mantendrá positivo con una holgura de $45,000 USD.";
      } else if (promptLower.includes('inventario') || promptLower.includes('stock') || promptLower.includes('abastec')) {
        reply = "🤖 **Copilot Cadena de Suministro:** Se detecta una tendencia de aumento en la demanda de *Widget A* para los próximos 30 días. El punto de pedido actual es de 200 unidades, pero recomiendo incrementarlo a 280 unidades para evitar quiebres de stock. He preparado un borrador de Orden de Compra (PO-2026-004) para aprobación.";
      } else {
        reply = "🤖 **Copilot Dynamics:** ¡Hola! Puedo ayudarte a realizar conciliaciones automáticas, resumir el estado financiero general, predecir el flujo de efectivo y riesgo de impago, o generar alertas de reabastecimiento de inventario. Intenta preguntarme sobre: *'¿Cómo está el riesgo de impago de clientes?'* o *'Realizar conciliación bancaria'* o *'Analizar inventario y reabastecimiento'*.";
      }

      setCopilotResponse(reply);
      setLoading(false);
    }, 1000);
  };

  const erpModules = [
    {
      title: "Finance",
      desc: "Contabilidad general, cuentas por cobrar/pagar, presupuestos, flujo de caja, activos fijos y conciliaciones.",
      icon: "💰",
      path: "/finance",
      color: "#0078d4"
    },
    {
      title: "Supply Chain",
      desc: "Gestión de almacenes (WMS), inventarios en tiempo real, planificación MRP, compras y mantenimiento.",
      icon: "📦",
      path: "/supplychain",
      color: "#107c41"
    },
    {
      title: "Commerce",
      desc: "Administración omnicanal de retail, catálogos centralizados, POS físico, precios dinámicos y BOPIS.",
      icon: "🛒",
      path: "/commerce",
      color: "#d83b01"
    },
    {
      title: "Project Operations",
      desc: "Planificación con Gantt, asignación de recursos, hojas de tiempos, facturación por hitos y contratos.",
      icon: "📊",
      path: "/project",
      color: "#8764eb"
    },
    {
      title: "Human Resources",
      desc: "Expedientes de empleados, compensaciones, licencias, organigrama, reclutamiento y evaluaciones.",
      icon: "👥",
      path: "/hr",
      color: "#00b7c3"
    },
    {
      title: "Business Central",
      desc: "ERP todo en uno para PYMEs con finanzas avanzadas, CRM integrado, logística y planificación de fabricación.",
      icon: "🏢",
      path: "/businesscentral",
      color: "#eae034"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard General ERP</h1>
        <p className="page-description">Vista unificada de la suite de aplicaciones de planeación de recursos empresariales (ERP) de Microsoft Dynamics 365.</p>
      </div>

      <div className="kpi-grid">
        <KPICard 
          title="Activos Totales" 
          value={`$${stats.totalAssets.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
          icon="🏦" 
          trend="Incremento estable" 
          trendType="up"
          color="primary"
        />
        <KPICard 
          title="Ingresos Registrados" 
          value={`$${stats.totalRevenue.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
          icon="📈" 
          trend="Metas del trimestre al 85%" 
          trendType="up"
          color="success"
        />
        <KPICard 
          title="Por Cobrar (Pendiente)" 
          value={`$${stats.pendingReceivables.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
          icon="⏳" 
          trend="3 clientes con retraso" 
          trendType="down"
          color="warning"
        />
        <KPICard 
          title="Por Pagar (Pendiente)" 
          value={`$${stats.pendingPayables.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`}
          icon="📉" 
          trend="Vence en 15 días" 
          trendType="neutral"
          color="error"
        />
      </div>

      <div className="home-layout flex gap-lg">
        {/* Main Section: ERP Modules */}
        <div className="main-section flex flex-col gap-md">
          <h2 className="section-title">Módulos ERP Dynamics 365</h2>
          <div className="modules-grid">
            {erpModules.map((mod, idx) => (
              <div 
                key={idx} 
                className="module-card card flex flex-col justify-between"
                onClick={() => navigate(mod.path)}
                style={{ borderTop: `4px solid ${mod.color}` }}
              >
                <div className="module-card-header flex justify-between align-center">
                  <span className="module-icon" style={{ backgroundColor: `${mod.color}15`, color: mod.color }}>
                    {mod.icon}
                  </span>
                  <span className="arrow-icon">➔</span>
                </div>
                <div className="module-card-body">
                  <h4>{mod.title}</h4>
                  <p>{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Section: Copilot Assistant */}
        <div className="copilot-sidebar card flex flex-col">
          <div className="copilot-sidebar-header flex align-center gap-sm">
            <span className="copilot-sparkle-large">✨</span>
            <div>
              <h3>Microsoft Copilot</h3>
              <span className="copilot-sub">Asistente Inteligente de ERP</span>
            </div>
          </div>
          
          <div className="copilot-chat flex-col flex">
            {copilotResponse ? (
              <div className="chat-bubble received">
                <div className="bubble-content" dangerouslySetInnerHTML={{ __html: copilotResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            ) : (
              <div className="copilot-placeholder text-center flex flex-col align-center justify-center">
                <span className="placeholder-icon">🤖</span>
                <p>Pregúntame sobre conciliaciones bancarias, riesgo de impago de clientes o planificación de inventario.</p>
              </div>
            )}
            
            {loading && (
              <div className="chat-bubble received loading-bubble">
                <div className="dot-flashing"></div>
              </div>
            )}
          </div>

          <form onSubmit={handleCopilotSubmit} className="copilot-input-group flex gap-sm">
            <input 
              type="text" 
              placeholder="Preguntar a Copilot..." 
              value={copilotPrompt}
              onChange={(e) => setCopilotPrompt(e.target.value)}
              disabled={loading}
              className="copilot-input"
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
