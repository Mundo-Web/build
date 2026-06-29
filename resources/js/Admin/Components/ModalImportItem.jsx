import React, { useRef, useState } from "react";
import ItemsRest from "../../Actions/Admin/ItemsRest";
import { toast } from "sonner";
import Fillable from "../../Utils/Fillable";

const itemsRest = new ItemsRest();

const SYSTEM_FIELDS = [
    { key: "sku", dbKey: "sku", label: "SKU / Código", required: true, description: "Identificador único del producto" },
    { key: "nombre_producto", dbKey: "name", label: "Nombre del Producto", required: true, description: "Título visible del producto" },
    { key: "categoria", dbKey: "category_id", label: "Categoría", required: true, description: "Categoría principal" },
    { key: "precio", dbKey: "price", label: "Precio", required: false, description: "Precio de venta normal" },
    { key: "descripcion", dbKey: "description", label: "Descripción", required: false, description: "Detalle completo del producto" },
    { key: "imagen", dbKey: "image", label: "Imagen Principal (URL)", required: false, description: "Link de imagen (se descarga y convierte a WebP)" },
    { key: "galeria", dbKey: "image", label: "Galería de Imágenes (URLs)", required: false, description: "Links separados por comas" },
    { key: "marca", dbKey: "brand_id", label: "Marca", required: false, description: "Fabricante / Marca" },
    { key: "collection", dbKey: "collection_id", label: "Colección", required: false, description: "Colección o línea de productos" },
    { key: "subcategoria", dbKey: "subcategory_id", label: "Subcategoría", required: false, description: "Subcategoría" },
    { key: "descuento", dbKey: "discount", label: "Precio Descuento", required: false, description: "Precio promocional" },
    { key: "stock", dbKey: "stock", label: "Stock / Inventario", required: false, description: "Cantidad disponible" },
    { key: "color", dbKey: "color", label: "Color", required: false, description: "Color específico" },
    { key: "talla", dbKey: "size", label: "Talla", required: false, description: "Tamaño o dimensión" },
    { key: "summary", dbKey: "summary", label: "Resumen Corto", required: false, description: "Descripción corta" },
    { key: "peso", dbKey: "weight", label: "Peso (kg)", required: false, description: "Peso del producto" },
    { key: "tienda", dbKey: "store_id", label: "Tienda", required: false, description: "Tienda o almacén asignado" },
    { key: "regla_descuento", dbKey: "discount_rule", label: "Regla Descuento", required: false, description: "Nombre de regla promocional" },
    { key: "promociones", dbKey: "tags", label: "Etiquetas / Tags", required: false, description: "Etiquetas separadas por comas" },
    { key: "especificaciones_tecnicas", dbKey: "specs", label: "Especificaciones Técnicas", required: false, description: "Formato: Clave: Valor/Clave: Valor" },
    { key: "es_nuevo", dbKey: "is_new", label: "Es Nuevo", required: false, description: "1 / Sí / True" },
    { key: "en_oferta", dbKey: "offering", label: "En Oferta", required: false, description: "1 / Sí / True" },
    { key: "recomendado", dbKey: "recommended", label: "Recomendado", required: false, description: "1 / Sí / True" },
    { key: "destacado", dbKey: "featured", label: "Destacado", required: false, description: "1 / Sí / True" },
    { key: "visible", dbKey: "visible", label: "Visible", required: false, description: "1 / Sí / True" },
    { key: "es_maestro", dbKey: "is_master", label: "Es Maestro", required: false, description: "1 / Sí / True" },
    { key: "agrupador", dbKey: "agrupador", label: "Agrupador", required: false, description: "Código de agrupador" },
];

const ModalImportItem = ({ gridRef, modalRef, excelTemplate }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [importMode, setImportMode] = useState("reset"); // "reset" o "add_update"
    const [step, setStep] = useState("upload"); // "upload", "mapping"
    
    // Preview states
    const [headers, setHeaders] = useState([]);
    const [sampleRows, setSampleRows] = useState([]);
    const [mappings, setMappings] = useState({});

    // Filtrar los campos del sistema activos según lo configurado en Fillable
    const activeFields = SYSTEM_FIELDS.filter(field => {
        // Campos obligatorios siempre visibles
        if (field.key === "sku" || field.key === "nombre_producto" || field.key === "categoria") return true;
        // Dependencia de imágenes
        if (field.key === "galeria") return Fillable.has("items", "image");
        // Reglas de negocio especiales
        if (field.key === "especificaciones_tecnicas") return true; 
        if (field.key === "regla_descuento") return true; 
        if (field.key === "promociones") return true; 
        
        return Fillable.has("items", field.dbKey);
    });

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setMessage("");
        setIsError(false);
        setPreviewLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await itemsRest.previewData(formData);
            if (response.success && response.preview) {
                setHeaders(response.preview.headers || []);
                setSampleRows(response.preview.sample_rows || []);
                
                // Generar auto-mapeo basado en la respuesta del backend
                const initialMappings = {};
                const recognized = response.field_analysis?.recognized_fields || {};
                
                activeFields.forEach(field => {
                    // Buscar si hay alguna coincidencia reconocida para este campo del sistema
                    const matchedHeader = Object.keys(recognized).find(
                        headerName => recognized[headerName] === field.key
                    );
                    initialMappings[field.key] = matchedHeader || "";
                });
                
                setMappings(initialMappings);
                setStep("mapping");
            } else {
                throw new Error("No se pudo obtener la previsualización del archivo.");
            }
        } catch (error) {
            setMessage("Error al leer el archivo: " + (error.message || "Formato no compatible."));
            setIsError(true);
            setFile(null);
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleMappingChange = (sysKey, headerValue) => {
        setMappings(prev => ({
            ...prev,
            [sysKey]: headerValue
        }));
    };

    const handleBack = () => {
        setStep("upload");
        setFile(null);
        setHeaders([]);
        setSampleRows([]);
        setMappings({});
        setMessage("");
        setIsError(false);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Por favor, selecciona un archivo.");
            setIsError(true);
            return;
        }

        // Validar campos requeridos mapeados
        const missingRequired = activeFields.filter(f => f.required && !mappings[f.key]);
        if (missingRequired.length > 0) {
            setMessage(`Los siguientes campos requeridos no están mapeados: ${missingRequired.map(f => f.label).join(", ")}`);
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", importMode);

        // Formatear mapeos para el backend
        const formattedMappings = {};
        Object.keys(mappings).forEach(sysKey => {
            if (mappings[sysKey]) {
                formattedMappings[sysKey] = [mappings[sysKey]];
            }
        });
        formData.append("field_mappings", JSON.stringify(formattedMappings));

        setLoading(true);
        setMessage("");
        try {
            const result = await itemsRest.importData(formData);

            if (result.error) {
                const errors = Array.isArray(result.error)
                    ? result.error.join("\n")
                    : result.error;

                setMessage(`Error en la importación:\n${errors}`);
                setIsError(true);
            } else {
                setMessage(result.message);
                setIsError(false);
                
                // Refrescar grilla de forma segura para evitar excepciones de JS
                try {
                    if (gridRef && gridRef.current) {
                        const gridInstance = $(gridRef.current).dxDataGrid("instance");
                        if (gridInstance) {
                            gridInstance.refresh();
                        }
                    }
                } catch (e) {
                    console.error("Error al refrescar la grilla:", e);
                }
                
                toast.success("¡Importación completada!", {
                    description: result.message || 'Todos tus productos han sido importados correctamente.',
                    duration: 3000,
                    position: "bottom-center",
                    richColors: true
                });

                // Cerrar el modal de manera ultra-segura
                setTimeout(() => {
                    const modalEl = modalRef?.current;
                    if (modalEl) {
                        const closeBtn = modalEl.querySelector('[data-bs-dismiss="modal"]');
                        if (closeBtn) {
                            closeBtn.click();
                        } else {
                            $(modalEl).modal('hide');
                        }
                    }
                    handleBack(); // Resetear estado
                }, 1500);
            }
        } catch (error) {
            let errorMsg = error.message;
            if (error.errors && error.errors.length > 0) {
                errorMsg += ":\n" + error.errors.join("\n");
            }
            setMessage("Error al importar: " + errorMsg);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    // Obtener el valor correspondiente a una columna mapeada en las filas de muestra
    const getMappedSampleValue = (sysKey, rowIndex) => {
        const mappedHeader = mappings[sysKey];
        if (!mappedHeader) return <span className="text-muted fst-italic">No importado</span>;
        
        const headerIndex = headers.indexOf(mappedHeader);
        if (headerIndex === -1) return <span className="text-danger">Columna no encontrada</span>;
        
        const row = sampleRows[rowIndex];
        if (!row || row[headerIndex] === undefined || row[headerIndex] === null || row[headerIndex] === "") {
            return <span className="text-muted fst-italic">[Vacío]</span>;
        }

        const value = String(row[headerIndex]);
        if (value.length > 50) return value.substring(0, 47) + "...";
        return value;
    };

    return (
        <div className="bg-white p-4" style={{ borderRadius: '12px' }}>
            {/* Header */}
            <div className="mb-4 pb-3 border-bottom d-flex align-items-center justify-content-between">
                <div>
                    <h5 className="mb-0 text-dark fw-bold">Importación Inteligente de Productos</h5>
                    <p className="text-muted small mb-0">Sube cualquier archivo Excel, CSV o JSON y mapea las columnas</p>
                </div>
                {excelTemplate && step === "upload" && (
                    <a 
                        href={`/cloud/${excelTemplate}`} 
                        download
                        className="btn btn-sm btn-outline-secondary"
                    >
                        <i className="fas fa-download me-2"></i>
                        Descargar Plantilla
                    </a>
                )}
            </div>

            {/* ERROR / SUCCESS MESSAGE */}
            {message && (
                <div className={`alert ${isError ? "alert-danger" : "alert-success"} mb-4`} role="alert">
                    <div className="d-flex align-items-start">
                        <i className={`fas ${isError ? "fa-exclamation-circle" : "fa-check-circle"} me-2 mt-1`} style={{ fontSize: '16px' }}></i>
                        <div className="flex-grow-1">
                            <strong style={{ fontSize: '14px' }}>{isError ? "Atención" : "Completado"}</strong>
                            <div className="mt-1 small" style={{ whiteSpace: 'pre-line' }}>{message}</div>
                        </div>
                    </div>
                </div>
            )}

            {step === "upload" ? (
                <>
                    {/* Opciones de importación */}
                    <div className="mb-4">
                        <label className="form-label text-dark fw-bold mb-3" style={{ fontSize: '14px' }}>
                            Modo de Importación
                        </label>
                        
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div 
                                    className={`card h-100 ${importMode === "reset" ? "border-primary" : "border"}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        borderWidth: importMode === "reset" ? '2px' : '1px',
                                        backgroundColor: importMode === "reset" ? '#f8f9fa' : 'white'
                                    }}
                                    onClick={() => setImportMode("reset")}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-start">
                                            <input
                                                className="form-check-input mt-1 me-3 flex-shrink-0"
                                                type="radio"
                                                name="importMode"
                                                id="modeReset"
                                                value="reset"
                                                checked={importMode === "reset"}
                                                onChange={(e) => setImportMode(e.target.value)}
                                            />
                                            <label className="form-check-label flex-grow-1" htmlFor="modeReset" style={{ cursor: 'pointer' }}>
                                                <div className="d-flex align-items-center mb-1">
                                                    <strong className="text-dark">Limpiar e importar desde cero</strong>
                                                </div>
                                                <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                                                    Limpia los productos existentes e importa desde el archivo.
                                                </small>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div 
                                    className={`card h-100 ${importMode === "add_update" ? "border-primary" : "border"}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        borderWidth: importMode === "add_update" ? '2px' : '1px',
                                        backgroundColor: importMode === "add_update" ? '#f8f9fa' : 'white'
                                    }}
                                    onClick={() => setImportMode("add_update")}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex align-items-start">
                                            <input
                                                className="form-check-input mt-1 me-3 flex-shrink-0"
                                                type="radio"
                                                name="importMode"
                                                id="modeAddUpdate"
                                                value="add_update"
                                                checked={importMode === "add_update"}
                                                onChange={(e) => setImportMode(e.target.value)}
                                            />
                                            <label className="form-check-label flex-grow-1" htmlFor="modeAddUpdate" style={{ cursor: 'pointer' }}>
                                                <div className="d-flex align-items-center mb-1">
                                                    <strong className="text-dark">Agregar / Actualizar</strong>
                                                </div>
                                                <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                                                    Actualiza según SKU y añade nuevos sin eliminar los demás.
                                                </small>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div className="mb-4">
                        <label className="form-label text-dark fw-bold mb-2">Seleccionar Archivo de Datos</label>
                        <div 
                            className="p-5 border border-2 border-dashed rounded text-center" 
                            style={{
                                borderColor: '#dee2e6', 
                                backgroundColor: '#f8f9fa', 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => document.getElementById('import-file-input').click()}
                        >
                            {previewLoading ? (
                                <div className="py-2">
                                    <span className="spinner-border spinner-border text-primary mb-3" role="status" aria-hidden="true"></span>
                                    <p className="text-dark fw-semibold mb-1">Analizando estructura del archivo...</p>
                                    <p className="text-muted small mb-0">Estamos identificando las columnas y datos muestra</p>
                                </div>
                            ) : (
                                <div className="py-2">
                                    <i className="fas fa-cloud-upload-alt text-muted mb-3" style={{ fontSize: '40px' }}></i>
                                    <p className="text-dark fw-semibold mb-1">Haz clic para buscar tu archivo</p>
                                    <p className="text-muted small mb-0">Soporta Excel (.xlsx, .xls), CSV (.csv) o JSON (.json)</p>
                                </div>
                            )}
                        </div>
                        <input
                            id="import-file-input"
                            type="file"
                            accept=".xlsx,.xls,.csv,.json,text/plain"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                            disabled={previewLoading}
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* File info banner */}
                    <div className="p-3 bg-light rounded-3 mb-4 d-flex align-items-center justify-content-between border">
                        <div className="d-flex align-items-center">
                            <i className="fas fa-file-alt text-primary me-3" style={{ fontSize: '24px' }}></i>
                            <div>
                                <strong className="text-dark d-block">{file.name}</strong>
                                <small className="text-muted">Se detectaron <b>{headers.length} columnas</b> en el archivo.</small>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleBack}
                            disabled={loading}
                        >
                            <i className="fas fa-arrow-left me-2"></i> Cambiar Archivo
                        </button>
                    </div>

                    <div className="row">
                        {/* MAPPER COLUMN */}
                        <div className="col-lg-7">
                            <div className="card border">
                                <div className="card-header bg-white py-3 border-bottom">
                                    <h6 className="mb-0 fw-bold text-dark"><i className="fas fa-exchange-alt me-2 text-primary"></i>Mapeo de Columnas</h6>
                                </div>
                                <div className="card-body p-0" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                                    <table className="table table-align-middle mb-0">
                                        <thead className="bg-light sticky-top">
                                            <tr>
                                                <th className="px-3" style={{ width: '45%' }}>Campo del Sistema</th>
                                                <th className="px-3" style={{ width: '55%' }}>Columna en Archivo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeFields.map(field => (
                                                <tr key={field.key}>
                                                    <td className="px-3 py-2">
                                                        <div className="d-flex flex-column">
                                                            <div className="d-flex align-items-center">
                                                                <span className="fw-semibold text-dark small">{field.label}</span>
                                                                {field.required && (
                                                                    <span className="badge bg-danger-subtle text-danger ms-2" style={{ fontSize: '10px' }}>Requerido</span>
                                                                )}
                                                            </div>
                                                            <span className="text-muted" style={{ fontSize: '11px' }}>{field.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <select
                                                            className={`form-select form-select-sm ${field.required && !mappings[field.key] ? 'border-danger' : ''}`}
                                                            value={mappings[field.key] || ""}
                                                            onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                                        >
                                                            <option value="">-- No Importar --</option>
                                                            {headers.map(h => (
                                                                <option key={h} value={h}>{h}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* PREVIEW COLUMN */}
                        <div className="col-lg-5">
                            <div className="card border h-100">
                                <div className="card-header bg-white py-3 border-bottom">
                                    <h6 className="mb-0 fw-bold text-dark"><i className="fas fa-eye me-2 text-primary"></i>Previsualización de Datos</h6>
                                </div>
                                <div className="card-body p-0" style={{ overflowX: 'auto' }}>
                                    <table className="table table-bordered mb-0" style={{ fontSize: '12px' }}>
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="px-2 py-2">Campo</th>
                                                <th className="px-2 py-2">Fila Muestra 1</th>
                                                <th className="px-2 py-2">Fila Muestra 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activeFields.filter(f => mappings[f.key]).map(field => (
                                                <tr key={field.key}>
                                                    <td className="px-2 py-1 fw-semibold text-dark">{field.label}</td>
                                                    <td className="px-2 py-1 text-muted">{getMappedSampleValue(field.key, 0)}</td>
                                                    <td className="px-2 py-1 text-muted">{getMappedSampleValue(field.key, 1)}</td>
                                                </tr>
                                            ))}
                                            {Object.values(mappings).filter(Boolean).length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="text-center p-4 text-muted fst-italic">
                                                        Selecciona columnas a la izquierda para ver la previsualización de la importación
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-end gap-2">
                        <button
                            onClick={handleBack}
                            disabled={loading}
                            className="btn btn-outline-secondary"
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="btn btn-primary px-4"
                            type="button"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Importando ({importMode === 'reset' ? 'Desde cero' : 'Agregar/Actualizar'})...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle me-2"></i>
                                    Iniciar Importación
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ModalImportItem;
