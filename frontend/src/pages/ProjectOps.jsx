import React, { useState, useEffect } from 'react';
import { projectApi } from '../services/api';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const ProjectOps = () => {
  const [activeTab, setActiveTab] = useState('planificacion');
  
  // Data states
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [contracts, setContracts] = useState([]);

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
    if (activeTab === 'planificacion') projectApi.getProjects().then(setProjects);
    if (activeTab === 'recursos') {
      projectApi.getResources().then(setResources);
      projectApi.getProjects().then(setProjects);
    }
    if (activeTab === 'timesheets') {
      projectApi.getTimesheets().then(setTimesheets);
      projectApi.getProjects().then(setProjects);
    }
    if (activeTab === 'contratos') projectApi.getContracts().then(setContracts);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalInitialValues({});
    
    if (activeTab === 'planificacion') {
      setModalTitle("Crear Proyecto");
      setModalFields([
        { name: 'name', label: 'Nombre Proyecto', type: 'text', required: true, placeholder: 'Ej. Consultoría ERP Fase 2' },
        { name: 'client', label: 'Cliente', type: 'text', required: true, placeholder: 'Ej. Acme Corp' },
        { name: 'manager', label: 'Líder / Project Manager', type: 'text', required: true, placeholder: 'Ej. Laura Smith' },
        { name: 'start_date', label: 'Fecha Inicio', type: 'date', required: true },
        { name: 'end_date', label: 'Fecha Conclusión', type: 'date', required: true },
        { name: 'budget', label: 'Presupuesto Total ($)', type: 'number', required: true, min: 0 },
        { name: 'spent', label: 'Costo Ejecutado ($)', type: 'number', defaultValue: 0 },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Planning', 'In Progress', 'On Hold', 'Completed'], defaultValue: 'Planning' },
        { name: 'progress', label: 'Avance Físico (%)', type: 'number', defaultValue: 0, min: 0, max: 100 }
      ]);
    } else if (activeTab === 'recursos') {
      setModalTitle("Asignar Recurso Humano");
      setModalFields([
        { name: 'name', label: 'Nombre Profesional', type: 'text', required: true, placeholder: 'Ej. John Developer' },
        { name: 'role', label: 'Rol / Perfil', type: 'select', required: true, options: ['Developer', 'Designer', 'Architect', 'Analyst', 'Project Manager'] },
        { name: 'skill', label: 'Habilidad Destacada', type: 'text', required: true, placeholder: 'Ej. TypeScript, UX/UI, Cloud' },
        { name: 'project_id', label: 'Asignar a Proyecto (ID)', type: 'select', required: true, options: projects.map(p => ({ value: p.id, label: p.name })) },
        { name: 'allocation_pct', label: 'Porcentaje Asignación (%)', type: 'number', required: true, defaultValue: 100, min: 0, max: 100 },
        { name: 'hourly_rate', label: 'Costo Hora Facturable ($)', type: 'number', required: true, min: 0 }
      ]);
    } else if (activeTab === 'timesheets') {
      setModalTitle("Registrar Hoja de Tiempo / Gastos (Timesheet)");
      setModalFields([
        { name: 'employee', label: 'Profesional', type: 'text', required: true, placeholder: 'Ej. Carlos Mendez' },
        { name: 'project_id', label: 'Proyecto', type: 'select', required: true, options: projects.map(p => ({ value: p.id, label: p.name })) },
        { name: 'task', label: 'Actividad / Tarea Realizada', type: 'text', required: true, placeholder: 'Ej. Desarrollo de API routes' },
        { name: 'date', label: 'Fecha Tarea', type: 'date', required: true },
        { name: 'hours', label: 'Horas Trabajadas', type: 'number', required: true, min: 0, step: 0.5 },
        { name: 'billable', label: 'Facturable al Cliente', type: 'select', required: true, options: [{ value: 1, label: 'Sí' }, { value: 0, label: 'No' }], defaultValue: 1 },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Draft', 'Submitted', 'Approved', 'Rejected'], defaultValue: 'Draft' }
      ]);
    } else if (activeTab === 'contratos') {
      setModalTitle("Crear Contrato de Proyecto");
      setModalFields([
        { name: 'contract_number', label: 'Número de Contrato', type: 'text', required: true, placeholder: 'Ej. CTR-2026-004' },
        { name: 'client', label: 'Cliente', type: 'text', required: true, placeholder: 'Ej. Acme Corp' },
        { name: 'type', label: 'Esquema de Facturación', type: 'select', required: true, options: ['Fixed Price', 'Time & Materials'], defaultValue: 'Fixed Price' },
        { name: 'value', label: 'Monto Contratado ($)', type: 'number', required: true, min: 0 },
        { name: 'start_date', label: 'Vigencia Desde', type: 'date', required: true },
        { name: 'end_date', label: 'Vigencia Hasta', type: 'date', required: true },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Active', 'Pending', 'Closed'], defaultValue: 'Active' }
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
    
    if (activeTab === 'planificacion') {
      apiCall = editingId ? projectApi.updateProject(editingId, formData) : projectApi.createProject(formData);
    } else if (activeTab === 'recursos') {
      apiCall = editingId ? projectApi.updateResource(editingId, formData) : projectApi.createResource(formData);
    } else if (activeTab === 'timesheets') {
      apiCall = editingId ? projectApi.updateTimesheet(editingId, formData) : projectApi.createTimesheet(formData);
    } else if (activeTab === 'contratos') {
      apiCall = editingId ? projectApi.updateContract(editingId, formData) : projectApi.createContract(formData);
    }

    apiCall.then(() => {
      setIsModalOpen(false);
      loadTabData();
    }).catch(err => alert("Error al guardar: " + err.message));
  };

  const handleDelete = (id) => {
    let apiCall;
    if (activeTab === 'planificacion') apiCall = projectApi.deleteProject(id);
    if (activeTab === 'recursos') apiCall = projectApi.deleteResource(id);
    if (activeTab === 'timesheets') apiCall = projectApi.deleteTimesheet(id);
    if (activeTab === 'contratos') apiCall = projectApi.deleteContract(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Render correct grid based on active tab
  const renderTabContent = () => {
    if (activeTab === 'planificacion') {
      return (
        <div className="flex flex-col gap-lg">
          <DataTable
            title="Planificación General & Seguimiento"
            data={projects}
            onAdd={handleOpenAdd}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            columns={[
              { header: "ID", accessor: "id", width: "8%" },
              { header: "Proyecto", accessor: "name" },
              { header: "Cliente", accessor: "client", width: "15%" },
              { header: "Manager", accessor: "manager", width: "15%" },
              { header: "Presupuesto", accessor: "budget", type: "currency", width: "15%" },
              { header: "Costo Real", accessor: "spent", type: "currency", width: "15%" },
              { header: "Avance", accessor: "progress", width: "15%", cell: (row) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{row.progress}%</span>
                  <div style={{ background: '#edebe9', height: '4px', width: '100%', borderRadius: '2px' }}>
                    <div style={{ background: 'var(--success-color)', height: '4px', width: `${row.progress}%`, borderRadius: '2px' }}></div>
                  </div>
                </div>
              )},
              { header: "Estado", accessor: "status", width: "12%", cell: (row) => (
                <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
              )}
            ]}
          />

          {/* Interactive Custom CSS Gantt Roadmap Chart */}
          <div className="gantt-roadmap card">
            <h3 style={{ marginBottom: '16px' }}>Cronograma Visual / Diagrama de Gantt</h3>
            <div className="gantt-chart flex flex-col gap-md">
              {projects.map((proj, idx) => {
                const progressPct = proj.progress || 0;
                // Alternate bar colors
                const barColor = idx === 0 ? '#0078d4' : idx === 1 ? '#107c41' : '#8764eb';
                return (
                  <div key={proj.id} className="gantt-row flex align-center gap-md" style={{ borderBottom: '1px solid #edebe9', paddingBottom: '12px' }}>
                    <div className="gantt-label" style={{ width: '180px', fontSize: '13px', fontWeight: 600 }}>
                      {proj.name}
                    </div>
                    <div className="gantt-track flex-1" style={{ position: 'relative', background: '#f3f2f1', height: '24px', borderRadius: '4px' }}>
                      <div 
                        className="gantt-bar flex align-center justify-between" 
                        style={{ 
                          position: 'absolute', 
                          left: `${idx * 15 + 10}%`, 
                          width: '55%', 
                          background: barColor, 
                          height: '100%', 
                          borderRadius: '4px',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '0 12px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span>{proj.status}</span>
                        <span>{progressPct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'recursos') {
      return (
        <DataTable
          title="Asignación y Planificación de Recursos Humanos"
          data={resources}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Profesional", accessor: "name" },
            { header: "Rol", accessor: "role", width: "15%" },
            { header: "Habilidad", accessor: "skill", width: "20%" },
            { header: "Tasa Horaria", accessor: "hourly_rate", type: "currency", width: "15%" },
            { header: "Asignación Proyecto", accessor: "allocation_pct", width: "18%", cell: (row) => (
              <span className={`badge ${row.allocation_pct >= 100 ? 'warning' : 'success'}`}>
                {row.allocation_pct}% Ocupado
              </span>
            )},
            { header: "Estado", accessor: "available", width: "12%", cell: (row) => (
              <span className={`badge ${row.available ? 'success' : 'error'}`}>
                {row.available ? 'Disponible' : 'Asignado'}
              </span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'timesheets') {
      return (
        <DataTable
          title="Registro de Horas y Actividades (Timesheets)"
          data={timesheets}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Colaborador", accessor: "employee" },
            { header: "Tarea / Actividad", accessor: "task" },
            { header: "Horas", accessor: "hours", width: "12%", cell: (row) => `${row.hours} hrs` },
            { header: "Facturable", accessor: "billable", width: "12%", cell: (row) => (
              row.billable ? 'Sí ✅' : 'No ❌'
            )},
            { header: "Fecha", accessor: "date", width: "15%" },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'contratos') {
      return (
        <DataTable
          title="Contratos de Servicio y Mantenimiento de Clientes"
          data={contracts}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Código Contrato", accessor: "contract_number", width: "18%" },
            { header: "Cliente", accessor: "client" },
            { header: "Esquema Facturación", accessor: "type", width: "20%" },
            { header: "Valor Total", accessor: "value", type: "currency", width: "18%" },
            { header: "Vigente Desde", accessor: "start_date", width: "15%" },
            { header: "Vigente Hasta", accessor: "end_date", width: "15%" },
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
        <h1>Project Operations</h1>
        <p className="page-description">Integración de proyectos comerciales: diagramas de Gantt en tiempo real, asignación por perfiles de habilidad, timesheets e hitos de facturación.</p>
      </div>

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'planificacion' ? 'active' : ''}`} onClick={() => setActiveTab('planificacion')}>Planificación & Gantt</button>
        <button className={`tab-btn ${activeTab === 'recursos' ? 'active' : ''}`} onClick={() => setActiveTab('recursos')}>Asignación Recursos</button>
        <button className={`tab-btn ${activeTab === 'timesheets' ? 'active' : ''}`} onClick={() => setActiveTab('timesheets')}>Hojas de Tiempos</button>
        <button className={`tab-btn ${activeTab === 'contratos' ? 'active' : ''}`} onClick={() => setActiveTab('contratos')}>Contratos Servicio</button>
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

export default ProjectOps;
