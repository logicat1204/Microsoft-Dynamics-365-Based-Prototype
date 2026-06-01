import React, { useState, useEffect } from 'react';
import './FormModal.css';

const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  fields = [], 
  initialValues = {} 
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Pre-fill form fields
      const prepopulated = {};
      fields.forEach(f => {
        prepopulated[f.name] = initialValues[f.name] ?? f.defaultValue ?? '';
      });
      setFormData(prepopulated);
    }
  }, [isOpen, initialValues, fields]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay flex align-center justify-center">
      <div className="modal-container card flex flex-col">
        <div className="modal-header flex justify-between align-center">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleFormSubmit} className="modal-form flex flex-col gap-md">
          <div className="modal-body flex flex-col gap-md">
            {fields.map((field) => (
              <div className="form-group flex flex-col gap-sm" key={field.name}>
                <label className="form-label">{field.label}</label>
                
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    onChange={handleChange}
                    className="form-control"
                    required={field.required}
                  >
                    <option value="">Seleccionar...</option>
                    {field.options?.map((opt, idx) => {
                      const val = typeof opt === 'object' ? opt.value : opt;
                      const lbl = typeof opt === 'object' ? opt.label : opt;
                      return <option key={idx} value={val}>{lbl}</option>;
                    })}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    step={field.step}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="modal-footer flex justify-between gap-sm">
            <button type="button" className="btn" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
