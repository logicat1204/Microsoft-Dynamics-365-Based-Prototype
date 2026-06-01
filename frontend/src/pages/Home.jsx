import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import CopilotPanel from '../components/CopilotPanel';
import { useAuth } from '../contexts/AuthContext';
import { financeApi } from '../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAssets: 4055678,
    totalLiabilities: 1245678,
    totalRevenue: 4055678,
    pendingReceivables: 248500,
    pendingPayables: 156200,
    growthTarget: 12,
    grossMargin: 45,
    openExceptions: 5,
  });

  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    financeApi.getDashboard()
      .then(res => setStats((prev) => ({ ...prev, ...res })))
      .catch(err => console.error('Error loading dashboard metrics:', err));
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Top 5 customers data
  const topCustomers = [
    { name: 'Contoso Corp', revenue: 485230, percentage: 100 },
    { name: 'Adventure Works', revenue: 412890, percentage: 85 },
    { name: 'Fabrikam Inc.', revenue: 356100, percentage: 73 },
    { name: 'Northwind Traders', revenue: 298450, percentage: 61 },
    { name: 'Wide World Importers', revenue: 245670, percentage: 51 },
  ];

  // Revenue by initiative
  const revenueByInitiative = [
    { month: 'Ene', value: 320 },
    { month: 'Feb', value: 280 },
    { month: 'Mar', value: 380 },
    { month: 'Abr', value: 350 },
    { month: 'May', value: 420 },
    { month: 'Jun', value: 480 },
    { month: 'Jul', value: 510 },
  ];
  const maxRevenue = Math.max(...revenueByInitiative.map(r => r.value));

  // Tasks by status
  const tasksByStatus = [
    { status: 'Completadas', count: 45, color: '#107C10' },
    { status: 'En progreso', count: 28, color: '#0078D4' },
    { status: 'Pendientes', count: 15, color: '#FFB900' },
    { status: 'Bloqueadas', count: 5, color: '#d13438' },
  ];
  const totalTasks = tasksByStatus.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="home-dashboard">
      {/* Header de bienvenida */}
      <div className="dashboard-header">
        <div>
          <h1>Bienvenido, {user?.name?.split(' ')[0] || 'Usuario'}</h1>
          <p className="dashboard-subtitle">
            Aquí tienes un resumen de tu entorno Dynamics 365
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            className="copilot-action-btn"
            onClick={() => setCopilotOpen(true)}
          >
            <span>✨</span> Ask Copilot
          </button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="kpi-grid">
        <KPICard
          title="Gross Revenue"
          value={formatCurrency(stats.totalRevenue)}
          unit="USD"
          trend={12.3}
          trendLabel="vs Q4 anterior"
          icon="💰"
          color="finance"
        />
        <KPICard
          title="Net Income Growth"
          value={`${stats.growthTarget}%`}
          subtitle="Target PY"
          trend={3.2}
          trendLabel="vs meta"
          icon="📈"
          color="success"
        />
        <KPICard
          title="Gross Margin"
          value={`${stats.grossMargin}%`}
          subtitle="Target"
          trend={-1.5}
          trendLabel="vs mes anterior"
          icon="📊"
          color="warning"
        />
        <KPICard
          title="Open Exceptions"
          value={stats.openExceptions}
          subtitle="Requieren atención"
          trend={-2}
          trendLabel="esta semana"
          icon="⚠️"
          color="error"
        />
      </div>

      {/* Sección de gráficos */}
      <div className="charts-grid">
        {/* Top 5 Customers - Barras horizontales */}
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">TOP 5 Customers</h3>
            <button className="link-button">Learn more →</button>
          </div>
          <div className="top-customers">
            {topCustomers.map((customer, i) => (
              <div key={i} className="customer-bar">
                <div className="customer-info">
                  <span className="customer-name">{customer.name}</span>
                  <span className="customer-revenue">{formatCurrency(customer.revenue)}</span>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${customer.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by initiative - Barras verticales */}
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Revenue by initiative</h3>
            <select className="period-selector">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
              <option>Year to date</option>
            </select>
          </div>
          <div className="vertical-chart">
            {revenueByInitiative.map((item, i) => (
              <div key={i} className="v-chart-item">
                <div className="v-chart-bar-container">
                  <div
                    className="v-chart-bar"
                    style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                  >
                    <span className="v-chart-value">{item.value}K</span>
                  </div>
                </div>
                <span className="v-chart-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks by Status - Dona */}
        <div className="card chart-card">
          <div className="card-header">
            <h3 className="card-title">Tasks by Status</h3>
            <button className="link-button">Ver todas →</button>
          </div>
          <div className="donut-chart-wrapper">
            <svg viewBox="0 0 100 100" className="donut-chart">
              {(() => {
                let cumulativePercent = 0;
                return tasksByStatus.map((task, i) => {
                  const percent = (task.count / totalTasks) * 100;
                  const offset = 25 - cumulativePercent * 0.25;
                  cumulativePercent += percent;
                  return (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="15.915"
                      fill="transparent"
                      stroke={task.color}
                      strokeWidth="10"
                      strokeDasharray={`${percent} ${100 - percent}`}
                      strokeDashoffset={offset}
                    />
                  );
                });
              })()}
              <text x="50" y="50" textAnchor="middle" dy="0.35em" className="donut-text">
                {totalTasks}
              </text>
            </svg>
            <div className="donut-legend">
              {tasksByStatus.map((task, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: task.color }}></span>
                  <div>
                    <strong>{task.status}</strong>
                    <small>{task.count} tareas</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos a módulos */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Accesos rápidos</h3>
        </div>
        <div className="module-quick-access">
          {[
            { path: '/finance', name: 'Finance', icon: '💰', color: '#498205', desc: 'Contabilidad, tesorería, conciliación' },
            { path: '/supplychain', name: 'Supply Chain', icon: '📦', color: '#0078D4', desc: 'Inventarios, almacenes, MRP' },
            { path: '/commerce', name: 'Commerce', icon: '🛒', color: '#FF8C00', desc: 'POS, e-commerce, promociones' },
            { path: '/project', name: 'Project Operations', icon: '📊', color: '#8B4513', desc: 'Proyectos, recursos, tiempos' },
            { path: '/hr', name: 'Human Resources', icon: '👥', color: '#7B68EE', desc: 'Empleados, nómina, evaluaciones' },
            { path: '/businesscentral', name: 'Business Central', icon: '🏢', color: '#008272', desc: 'ERP integral para PYME' },
          ].map((module) => (
            <button
              key={module.path}
              className="module-access-card"
              onClick={() => navigate(module.path)}
              style={{ '--module-color': module.color }}
            >
              <div className="module-access-icon">{module.icon}</div>
              <div className="module-access-info">
                <h4>{module.name}</h4>
                <p>{module.desc}</p>
              </div>
              <span className="module-access-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Copilot Panel */}
      <CopilotPanel
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
      />
    </div>
  );
};

export default Home;
