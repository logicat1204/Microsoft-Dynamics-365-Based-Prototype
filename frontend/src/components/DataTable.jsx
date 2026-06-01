import React, { useState } from 'react';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  title = '',
  onNew = null,
  onEdit = null,
  onDelete = null,
  onSave = null,
  onCalculate = null,
  onPost = null,
  customActions = [],
  loading = false,
  emptyMessage = 'No hay datos para mostrar',
  selectable = true,
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(item => item.id)));
    }
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDelete = () => {
    if (onDelete && selectedIds.size > 0) {
      onDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const selectedCount = selectedIds.size;

  return (
    <div className="datatable-container">
      {/* Toolbar */}
      <div className="datatable-toolbar">
        <div className="toolbar-left">
          {title && <h3 className="datatable-title">{title}</h3>}
        </div>
        <div className="toolbar-right">
          {onNew && (
            <button className="btn btn-primary" onClick={onNew}>
              <span>+</span> New
            </button>
          )}
          {onEdit && selectedCount === 1 && (
            <button className="btn btn-secondary" onClick={() => onEdit(Array.from(selectedIds)[0])}>
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-secondary"
              onClick={handleDelete}
              disabled={selectedCount === 0}
            >
              🗑️ Delete {selectedCount > 0 && `(${selectedCount})`}
            </button>
          )}
          {onSave && (
            <button className="btn btn-secondary" onClick={onSave}>
              💾 Save
            </button>
          )}
          {onCalculate && (
            <button className="btn btn-secondary" onClick={onCalculate}>
              🧮 Calculate
            </button>
          )}
          {onPost && (
            <button className="btn btn-secondary" onClick={onPost}>
              📤 Post
            </button>
          )}
          {customActions.map((action, i) => (
            <button
              key={i}
              className={`btn ${action.variant || 'btn-secondary'}`}
              onClick={() => action.onClick(selectedIds)}
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="datatable-loading">
          <div className="loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="datatable-empty">
          <span className="empty-icon">📋</span>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="datatable-wrapper">
          <table className="datatable">
            <thead>
              <tr>
                {selectable && (
                  <th className="th-checkbox">
                    <input
                      type="checkbox"
                      checked={data.length > 0 && selectedIds.size === data.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.accessor || col.key} style={col.width ? { width: col.width } : {}}>
                    {col.header || col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className={selectedIds.has(row.id) ? 'selected' : ''}
                  onDoubleClick={() => onEdit && onEdit(row.id)}
                >
                  {selectable && (
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const key = col.accessor || col.key;
                    return (
                      <td key={key}>
                        {col.cell ? col.cell(row) : col.render ? col.render(row[key], row) : row[key]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer con info */}
      {data.length > 0 && (
        <div className="datatable-footer">
          <span className="row-count">
            {data.length} {data.length === 1 ? 'registro' : 'registros'}
          </span>
          {selectedCount > 0 && (
            <span className="selection-info">{selectedCount} seleccionado(s)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
