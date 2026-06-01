import React, { useEffect, useRef } from 'react';
import './FormModal.css';

const FormModal = ({
  open,
  onClose,
  title = '',
  subtitle = '',
  children,
  onConfirm = null,
  onCancel = null,
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmDisabled = false,
  size = 'medium', // small, medium, large
  showFooter = true,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        if (onCancel) onCancel();
        else onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose, onCancel]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (onCancel) onCancel();
      else onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
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
            onClick={onCancel || onClose}
            title="Cerrar (Esc)"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        {showFooter && (
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onCancel || onClose}
              type="button"
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                className="btn btn-primary"
                onClick={handleConfirm}
                disabled={confirmDisabled}
                type="button"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormModal;
