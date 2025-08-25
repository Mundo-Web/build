import React, { useState, useEffect } from 'react';

const DynamicField = ({ label, structure, value = [], onChange, typeOptions = [] }) => {
    const [fields, setFields] = useState([]);
    const isObjectStructure = typeof structure === 'object' && !Array.isArray(structure);

    // Sincronización con el valor inicial
    useEffect(() => {
        if (isObjectStructure) {
            // Para especificaciones (objetos)
            setFields(value.map(item => ({
                ...item,
                type: item.type?.charAt(0).toUpperCase() + item.type?.slice(1).toLowerCase(),
            })));
        } else {
            // Para características (strings o objetos)
            setFields(value.map(item => {
                if (typeof item === 'object') {
                    return item.feature || '';
                }
                return item;
            }));
        }
    }, [value]);

    const handleAdd = () => {
        const newItem = isObjectStructure ? { ...structure} : '';
        const newFields = [...fields, newItem];
        setFields(newFields);
        onChange(newFields);
    };

    const handleRemove = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
        onChange(newFields);
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...fields];
        
        if (isObjectStructure) {
            newFields[index][key] = key === 'type' 
                ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                : value;
        } else {
            newFields[index] = value;
        }
        
        setFields(newFields);
        onChange(newFields);
    };

    const getPlaceholder = (key, fieldType) => {
        if (key === 'title' && fieldType === 'Icono') {
            return 'Url de icono';
        }
        return key; 
    };

    return (
        <div className="mb-4">
            <label className="form-label fw-semibold text-dark mb-3">
                <i className={`fas ${isObjectStructure ? 'fa-cogs' : 'fa-list-ul'} me-2 text-primary`}></i>
                {label}
            </label>

            <div className="dynamic-fields-container">
                {fields.map((field, index) => (
                    <div key={index} className="dynamic-field-item mb-3 p-3 border rounded-3 bg-light position-relative" style={{
                        borderLeft: '4px solid #0d6efd',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        {isObjectStructure ? (
                            <>
                                {/* Primera fila: Tipo y Título */}
                                <div className="row g-3 mb-2">
                                    <div className="col-md-4">
                                        <label className="form-label small text-muted text-uppercase fw-bold mb-1">
                                            Tipo
                                        </label>
                                        <select
                                            className="form-select form-select-sm border-0 bg-white shadow-sm"
                                            value={field.type || ''}
                                            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                                            style={{ fontSize: '0.9rem' }}
                                        >
                                            <option value="">Seleccionar tipo...</option>
                                            {typeOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-8">
                                        <label className="form-label small text-muted text-uppercase fw-bold mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm border-0 bg-white shadow-sm"
                                            value={field.title || ''}
                                            onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                                            placeholder={getPlaceholder('title', field.type)}
                                            style={{ fontSize: '0.9rem' }}
                                        />
                                    </div>
                                </div>
                                {/* Segunda fila: Descripción y botón eliminar */}
                                <div className="row g-3">
                                    <div className="col">
                                        <label className="form-label small text-muted text-uppercase fw-bold mb-1">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm border-0 bg-white shadow-sm"
                                            value={field.description || ''}
                                            onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                                            placeholder="Descripción de la especificación"
                                            style={{ fontSize: '0.9rem' }}
                                        />
                                    </div>
                                    <div className="col-auto d-flex align-items-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                            onClick={() => handleRemove(index)}
                                            style={{ width: '32px', height: '32px' }}
                                            title="Eliminar especificación"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="row g-3">
                                <div className="col">
                                    <div className="d-flex align-items-center gap-3">
                                        <input
                                            type="text"
                                            className="form-control border-0 shadow-sm flex-grow-1"
                                            value={field}
                                            onChange={(e) => handleFieldChange(index, null, e.target.value)}
                                            placeholder="Escriba la característica del producto..."
                                            style={{ fontSize: '0.95rem' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                            onClick={() => handleRemove(index)}
                                            title="Eliminar característica"
                                            style={{ width: '40px', height: '40px' }}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-4 text-muted">
                        <i className={`fas ${isObjectStructure ? 'fa-cogs' : 'fa-list-ul'} fa-2x mb-2 opacity-50`}></i>
                        <p className="mb-0">No hay {isObjectStructure ? 'especificaciones' : 'características'} agregadas</p>
                        <small>Haga clic en "Agregar" para comenzar</small>
                    </div>
                )}

                <div className="text-center mt-3">
                    <button 
                        type="button" 
                        className="btn btn-primary btn-sm px-4 py-2 rounded-pill shadow-sm" 
                        onClick={handleAdd}
                        style={{
                          
                            border: 'none',
                            fontWeight: '500'
                        }}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Agregar {isObjectStructure ? 'Especificación' : 'Característica'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DynamicField;

