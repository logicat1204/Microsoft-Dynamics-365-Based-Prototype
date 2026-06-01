import React, { useState, useEffect } from 'react';
import { hrApi } from '../services/api';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const HumanResources = () => {
  const [activeTab, setActiveTab] = useState('empleados');
  
  // Data states
  const [employees, setEmployees] = useState([]);
  const [timeoff, setTimeoff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [recruitment, setRecruitment] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  // Self-service interactive states
  const [ssType, setSsType] = useState("Vacation");
  const [ssStart, setSsStart] = useState("");
  const [ssEnd, setSsEnd] = useState("");
  const [ssReason, setSsReason] = useState("");

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
    if (activeTab === 'empleados') hrApi.getEmployees().then(setEmployees);
    if (activeTab === 'licencias') hrApi.getTimeoff().then(setTimeoff);
    if (activeTab === 'asistencia') hrApi.getAttendance().then(setAttendance);
    if (activeTab === 'reclutamiento') hrApi.getRecruitment().then(setRecruitment);
    if (activeTab === 'evaluaciones') hrApi.getEvaluations().then(setEvaluations);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setModalInitialValues({});
    
    if (activeTab === 'empleados') {
      setModalTitle("Crear Expediente de Empleado");
      setModalFields([
        { name: 'employee_id', label: 'Código Empleado', type: 'text', required: true, placeholder: 'Ej. EMP-005' },
        { name: 'first_name', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej. Carlos' },
        { name: 'last_name', label: 'Apellidos', type: 'text', required: true, placeholder: 'Ej. Torres' },
        { name: 'email', label: 'Correo Corporativo', type: 'text', required: true, placeholder: 'carlos@company.com' },
        { name: 'department', label: 'Departamento', type: 'select', required: true, options: ['Engineering', 'Marketing', 'Finance', 'HR'] },
        { name: 'position', label: 'Cargo / Puesto', type: 'text', required: true, placeholder: 'Ej. QA Analyst' },
        { name: 'hire_date', label: 'Fecha de Contratación', type: 'date', required: true },
        { name: 'salary', label: 'Salario Básico ($)', type: 'number', required: true, min: 0 },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Active', 'On Leave', 'Suspended'], defaultValue: 'Active' },
        { name: 'manager', label: 'Supervisor / Manager', type: 'text', placeholder: 'Ej. Laura Smith' }
      ]);
    } else if (activeTab === 'licencias') {
      setModalTitle("Registrar Solicitud de Licencia / Ausencia");
      setModalFields([
        { name: 'employee_name', label: 'Nombre Colaborador', type: 'text', required: true, placeholder: 'Ej. Carlos Mendez' },
        { name: 'type', label: 'Motivo Ausencia', type: 'select', required: true, options: ['Vacation', 'Sick Leave', 'Personal Days'], defaultValue: 'Vacation' },
        { name: 'start_date', label: 'Desde', type: 'date', required: true },
        { name: 'end_date', label: 'Hasta', type: 'date', required: true },
        { name: 'days', label: 'Días Solicitados', type: 'number', required: true, min: 1 },
        { name: 'status', label: 'Resolución', type: 'select', required: true, options: ['Pending', 'Approved', 'Rejected'], defaultValue: 'Pending' },
        { name: 'reason', label: 'Detalles / Justificación', type: 'textarea' }
      ]);
    } else if (activeTab === 'asistencia') {
      setModalTitle("Registrar Marcado de Asistencia");
      setModalFields([
        { name: 'employee_name', label: 'Colaborador', type: 'text', required: true, placeholder: 'Ej. Ana García' },
        { name: 'date', label: 'Fecha', type: 'date', required: true },
        { name: 'check_in', label: 'Hora Entrada', type: 'text', required: true, placeholder: 'Ej. 08:30' },
        { name: 'check_out', label: 'Hora Salida', type: 'text', placeholder: 'Ej. 17:30' },
        { name: 'hours_worked', label: 'Horas Totales', type: 'number', step: '0.1' },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Present', 'Late', 'Absent'], defaultValue: 'Present' }
      ]);
    } else if (activeTab === 'reclutamiento') {
      setModalTitle("Crear Vacante / Reclutamiento");
      setModalFields([
        { name: 'title', label: 'Título del Cargo', type: 'text', required: true, placeholder: 'Ej. Full Stack Developer' },
        { name: 'department', label: 'Departamento', type: 'select', required: true, options: ['Engineering', 'Marketing', 'Finance', 'HR'] },
        { name: 'location', label: 'Ubicación', type: 'text', required: true, placeholder: 'Ej. Remoto / La Paz' },
        { name: 'type', label: 'Jornada', type: 'select', required: true, options: ['Full-time', 'Part-time', 'Contractor'], defaultValue: 'Full-time' },
        { name: 'applicants', label: 'Postulantes Recibidos', type: 'number', defaultValue: 0 },
        { name: 'status', label: 'Estado Vacante', type: 'select', required: true, options: ['Open', 'Filled', 'Closed'], defaultValue: 'Open' },
        { name: 'posted_date', label: 'Fecha Publicación', type: 'date', required: true }
      ]);
    } else if (activeTab === 'evaluaciones') {
      setModalTitle("Crear Evaluación de Desempeño");
      setModalFields([
        { name: 'employee_name', label: 'Colaborador Evaluado', type: 'text', required: true, placeholder: 'Ej. Luis Torres' },
        { name: 'evaluator', label: 'Evaluador / Supervisor', type: 'text', required: true, placeholder: 'Ej. Ana García' },
        { name: 'period', label: 'Período Evaluado', type: 'text', required: true, placeholder: 'Ej. 2026-Q1' },
        { name: 'score', label: 'Calificación (1 a 5)', type: 'number', required: true, min: 1, max: 5 },
        { name: 'rating', label: 'Desempeño', type: 'select', required: true, options: ['Outstanding', 'Meets Expectations', 'Needs Improvement'], defaultValue: 'Meets Expectations' },
        { name: 'comments', label: 'Comentarios de Retroalimentación', type: 'textarea' },
        { name: 'status', label: 'Estado', type: 'select', required: true, options: ['Draft', 'Completed'], defaultValue: 'Draft' }
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
    
    if (activeTab === 'empleados') {
      apiCall = editingId ? hrApi.updateEmployee(editingId, formData) : hrApi.createEmployee(formData);
    } else if (activeTab === 'licencias') {
      apiCall = editingId ? hrApi.updateTimeoff(editingId, formData) : hrApi.createTimeoff(formData);
    } else if (activeTab === 'asistencia') {
      apiCall = editingId ? hrApi.updateAttendance(editingId, formData) : hrApi.createAttendance(formData);
    } else if (activeTab === 'reclutamiento') {
      apiCall = editingId ? hrApi.updateRecruitment(editingId, formData) : hrApi.createRecruitment(formData);
    } else if (activeTab === 'evaluaciones') {
      apiCall = editingId ? hrApi.updateEvaluation(editingId, formData) : hrApi.createEvaluation(formData);
    }

    apiCall.then(() => {
      setIsModalOpen(false);
      loadTabData();
    }).catch(err => alert("Error al guardar: " + err.message));
  };

  const handleDelete = (id) => {
    let apiCall;
    if (activeTab === 'empleados') apiCall = hrApi.deleteEmployee(id);
    if (activeTab === 'licencias') apiCall = hrApi.deleteTimeoff(id);
    if (activeTab === 'asistencia') apiCall = hrApi.deleteAttendance(id);
    if (activeTab === 'reclutamiento') apiCall = hrApi.deleteRecruitment(id);
    if (activeTab === 'evaluaciones') apiCall = hrApi.deleteEvaluation(id);

    apiCall.then(() => loadTabData())
      .catch(err => alert("Error al eliminar: " + err.message));
  };

  // Submit Employee Self-Service request from panel
  const handleSelfServiceRequest = (e) => {
    e.preventDefault();
    if (!ssStart || !ssEnd || !ssReason) {
      alert("Por favor complete todos los datos de la solicitud.");
      return;
    }

    const payload = {
      employee_name: "Colaborador Autoservicio (Demo)",
      type: ssType,
      start_date: ssStart,
      end_date: ssEnd,
      days: Math.round((new Date(ssEnd) - new Date(ssStart)) / (1000 * 60 * 60 * 24)) + 1 || 1,
      status: "Pending",
      reason: ssReason
    };

    hrApi.createTimeoff(payload)
      .then(() => {
        alert("¡Solicitud enviada con éxito! Pendiente de aprobación por tu supervisor.");
        setSsStart("");
        setSsEnd("");
        setSsReason("");
        loadTabData(); // reload grid
      })
      .catch(err => alert("Error al solicitar: " + err.message));
  };

  // Render correct grid based on active tab
  const renderTabContent = () => {
    if (activeTab === 'empleados') {
      return (
        <DataTable
          title="Expedientes de Empleados (Fichas Maestras)"
          data={employees}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Código", accessor: "employee_id", width: "12%" },
            { header: "Nombre Completo", accessor: "first_name", cell: (row) => `${row.first_name} ${row.last_name}` },
            { header: "Puesto", accessor: "position" },
            { header: "Departamento", accessor: "department", width: "15%" },
            { header: "Salario", accessor: "salary", type: "currency", width: "15%" },
            { header: "Supervisor", accessor: "manager", width: "15%" },
            { header: "Estado", accessor: "status", width: "12%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'licencias') {
      return (
        <div className="flex gap-lg flex-wrap">
          {/* Left panel: Self-Service request Form */}
          <div className="flex-col card flex" style={{ flex: 1.2, minWidth: '300px', background: '#faf9f8' }}>
            <h3 style={{ marginBottom: '16px' }}>Autoservicio del Empleado (ESS)</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Envíe una nueva solicitud de vacaciones o licencias directamente a Recursos Humanos.
            </span>

            <form onSubmit={handleSelfServiceRequest} className="flex flex-col gap-md">
              <div className="form-group flex flex-col gap-sm">
                <label className="form-label" style={{ fontSize: '11px' }}>Tipo de Solicitud</label>
                <select className="form-control" value={ssType} onChange={(e) => setSsType(e.target.value)}>
                  <option value="Vacation">Vacaciones Anuales</option>
                  <option value="Sick Leave">Baja Médica</option>
                  <option value="Personal Days">Asuntos Particulares</option>
                </select>
              </div>

              <div className="flex gap-sm">
                <div className="form-group flex flex-col gap-sm" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Fecha Inicio</label>
                  <input type="date" className="form-control" value={ssStart} onChange={(e) => setSsStart(e.target.value)} required />
                </div>
                <div className="form-group flex flex-col gap-sm" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Fecha Conclusión</label>
                  <input type="date" className="form-control" value={ssEnd} onChange={(e) => setSsEnd(e.target.value)} required />
                </div>
              </div>

              <div className="form-group flex flex-col gap-sm">
                <label className="form-label" style={{ fontSize: '11px' }}>Justificación / Motivo</label>
                <textarea className="form-control" rows={3} value={ssReason} onChange={(e) => setSsReason(e.target.value)} placeholder="Ej. Viaje familiar programado" required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }}>
                Enviar Solicitud ✈️
              </button>
            </form>
          </div>

          {/* Right panel: Absences grid */}
          <div style={{ flex: 2, minWidth: '320px' }}>
            <DataTable
              title="Solicitudes de Licencias / Ausencias de la Empresa"
              data={timeoff}
              onAdd={handleOpenAdd}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              columns={[
                { header: "Colaborador", accessor: "employee_name" },
                { header: "Tipo", accessor: "type", width: "15%" },
                { header: "Período", accessor: "start_date", cell: (row) => `${row.start_date} al ${row.end_date}` },
                { header: "Días", accessor: "days", width: "10%" },
                { header: "Justificación", accessor: "reason" },
                { header: "Resolución", accessor: "status", width: "15%", cell: (row) => (
                  <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
                )}
              ]}
            />
          </div>
        </div>
      );
    }

    if (activeTab === 'asistencia') {
      return (
        <DataTable
          title="Registro de Marcaciones Diarias (Asistencias)"
          data={attendance}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Colaborador", accessor: "employee_name" },
            { header: "Fecha", accessor: "date", width: "18%" },
            { header: "Entrada", accessor: "check_in", width: "15%" },
            { header: "Salida", accessor: "check_out", width: "15%", cell: (row) => row.check_out || '-' },
            { header: "Horas Laboradas", accessor: "hours_worked", width: "18%", cell: (row) => `${row.hours_worked || 0} hrs` },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'reclutamiento') {
      return (
        <DataTable
          title="Bolsa de Empleo y Reclutamiento (Procesos Activos)"
          data={recruitment}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Cargo Vacante", accessor: "title" },
            { header: "Ubicación", accessor: "location", width: "18%" },
            { header: "Jornada", accessor: "type", width: "15%" },
            { header: "Postulantes", accessor: "applicants", width: "15%", cell: (row) => (
              <strong>{row.applicants} recibidos</strong>
            )},
            { header: "Publicado el", accessor: "posted_date", width: "15%" },
            { header: "Estado", accessor: "status", width: "15%", cell: (row) => (
              <span className={`badge ${row.status.toLowerCase() === 'open' ? 'success' : 'error'}`}>
                {row.status === 'Open' ? 'Abierta' : 'Cerrada'}
              </span>
            )}
          ]}
        />
      );
    }

    if (activeTab === 'evaluaciones') {
      return (
        <DataTable
          title="Evaluaciones de Desempeño Profesional"
          data={evaluations}
          onAdd={handleOpenAdd}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          columns={[
            { header: "Colaborador Evaluado", accessor: "employee_name" },
            { header: "Evaluador", accessor: "evaluator", width: "20%" },
            { header: "Período", accessor: "period", width: "12%" },
            { header: "Calificación", accessor: "score", width: "15%", cell: (row) => (
              <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>{row.score} / 5 ⭐</span>
            )},
            { header: "Desempeño", accessor: "rating", width: "20%", cell: (row) => (
              <span className={`badge ${row.rating.toLowerCase().includes('meets') ? 'success' : row.rating.toLowerCase().includes('outstanding') ? 'success' : 'warning'}`}>
                {row.rating}
              </span>
            )}
          ]}
        />
      );
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Human Resources</h1>
        <p className="page-description">Módulo integral de Recursos Humanos: expedientes centrales de empleados, portal autoservicio (ESS) de vacaciones y licencias, control de asistencia, vacantes de empleo y evaluaciones.</p>
      </div>

      <div className="tab-container">
        <button className={`tab-btn ${activeTab === 'empleados' ? 'active' : ''}`} onClick={() => setActiveTab('empleados')}>Expedientes Personal</button>
        <button className={`tab-btn ${activeTab === 'licencias' ? 'active' : ''}`} onClick={() => setActiveTab('licencias')}>Autoservicio & Licencias</button>
        <button className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`} onClick={() => setActiveTab('asistencia')}>Asistencia Marcación</button>
        <button className={`tab-btn ${activeTab === 'reclutamiento' ? 'active' : ''}`} onClick={() => setActiveTab('reclutamiento')}>Reclutamiento Bolsa</button>
        <button className={`tab-btn ${activeTab === 'evaluaciones' ? 'active' : ''}`} onClick={() => setActiveTab('evaluaciones')}>Evaluaciones Desempeño</button>
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

export default HumanResources;
