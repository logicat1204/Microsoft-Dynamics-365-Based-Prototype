import React, { useState } from 'react';
import './DataTable.css';

const DataTable = ({ 
  title, 
  columns, 
  data = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  searchPlaceholder = "Buscar registros..." 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(row => {
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="data-table-container card">
      <div className="table-header flex justify-between align-center gap-md">
        <div className="table-title-group">
          <h3>{title}</h3>
          <span className="table-count">{filteredData.length} registros</span>
        </div>
        
        <div className="table-actions flex align-center gap-sm">
          <input 
            type="text" 
            placeholder={searchPlaceholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {onAdd && (
            <button className="btn btn-primary flex align-center gap-sm" onClick={onAdd}>
              <span className="btn-icon">➕</span>
              <span>Nuevo</span>
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} style={{ width: col.width || 'auto' }}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.map((col, colIndex) => {
                    const value = row[col.accessor];
                    return (
                      <td key={colIndex}>
                        {col.cell ? col.cell(row) : (
                          typeof value === 'number' && col.type === 'currency' 
                            ? `$${value.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`
                            : String(value ?? '')
                        )}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && (
                    <td className="actions-cell">
                      <div className="actions-group flex justify-center gap-sm">
                        {onEdit && (
                          <button 
                            className="btn-icon-only edit" 
                            title="Editar"
                            onClick={() => onEdit(row)}
                          >
                            ✏️
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            className="btn-icon-only delete" 
                            title="Eliminar"
                            onClick={() => {
                              if (window.confirm("¿Está seguro de que desea eliminar este registro?")) {
                                onDelete(row.id);
                              }
                            }}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="no-data text-center">
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
