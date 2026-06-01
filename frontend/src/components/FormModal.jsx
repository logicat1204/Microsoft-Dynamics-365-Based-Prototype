import React, { useState, useEffect, useRef } from 'react';
import './FormModal.css';

const FormModal = ({
  open,
  isOpen,
  onClose,
  title = '',
  subtitle = '',
  children,
  onConfirm = null,
  onSubmit = null,
  onCancel = null,
  confirmText = 'OK',
  submitText = 'Guardar',
  cancelText = 'Cancel',
  confirmDisabled = false,
  size = 'medium',
  showFooter = true,
  fields,
  initialValues = {},
}) => {
  const isVisible = open !== undefined ? open : isOpen;
  const handleConfirmAction = onConfirm || onSubmit;
  const handleCancelAction = onCancel || onClose;
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({});
  const hasGeneratedFields = fields && Array.isArray(fields) && !children;

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isVisible]);

  useEffect(() => {
    if (hasGeneratedFields && isVisible) {
      const init = {};
      fields.forEach(f => {
        init[f.name] = initialValues[f.name] !== undefined ? initialValues[f.name] : (f.defaultValue !== undefined ? f.defaultValue : '');
      });
      setFormData(init);
    }
  }, [isVisible, fields, initialValues, hasGeneratedFields]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        if (handleCancelAction) handleCancelAction();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, handleCancelAction]);

  if (!isVisible) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (handleCancelAction) handleCancelAction();
    }
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleConfirmAction) handleConfirmAction(formData);
  };

  const renderField = (field) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : '';

    if (field.type === 'select') {
      return (
        <select
          className="form-control"
          id={`field-${field.name}`}
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          required={field.required}
        >
          <option value="">Seleccionar...</option>
          {(field.options || []).map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        className="form-control"
        id={`field-${field.name}`}
        type={field.type || 'text'}
        value={value}
        onChange={(e) => handleFieldChange(field.name, field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        required={field.required}
        placeholder={field.placeholder || ''}
        min={field.min}
        max={field.max}
        step={field.step}
      />
    );
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal-${size}`} ref={modalRef}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">{title}</h2>
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <button
            className="modal-close"
            onClick={handleCancelAction}
            title="Cerrar (Esc)"
            type="button"
          >
            ✕
          </button>
        </div>

        {hasGeneratedFields ? (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {fields.map(field => (
                <div className="form-group" key={field.name}>
                  <label className="form-label" htmlFor={`field-${field.name}`}>{field.label}{field.required ? ' *' : ''}</label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            {showFooter && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelAction} type="button">{cancelText}</button>
                <button className="btn btn-primary" type="submit" disabled={confirmDisabled}>{submitText}</button>
              </div>
            )}
          </form>
        ) : (
          <>
            <div className="modal-body">{children}</div>
            {showFooter && (
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancelAction} type="button">{cancelText}</button>
                {handleConfirmAction && (
                  <button className="btn btn-primary" onClick={() => handleConfirmAction()} disabled={confirmDisabled} type="button">{confirmText}</button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FormModal;
