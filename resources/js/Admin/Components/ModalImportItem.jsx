import React, { useRef, useState } from "react";
import axios from "axios";
import Modal from "../../Components/Adminto/Modal";
import ItemsRest from "../../Actions/Admin/ItemsRest";
import { toast } from "sonner";
const itemsRest = new ItemsRest();

const ModalImportItem = ({ gridRef, modalRef, excelTemplate }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [importMode, setImportMode] = useState("reset"); // "reset" o "add_update"

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Por favor, selecciona un archivo.");
            setIsError(true);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", importMode); // Agregar modo de importación

        setLoading(true);
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
                $(gridRef.current).dxDataGrid("instance").refresh();
                // Cerrar el modal si la importación es exitosa
                $(modalRef.current).modal('hide');

                toast.success("Importacion completada con exito", {
                    description: 'Todos tus productos han sido importados correctamente.',
                    duration: 3000,
                    position: "bottom-center",
                    richColors:true
                });

                // if (modalRef.current) {
                //     modalRef.current.close();
                // }
            }
        } catch (error) {
            setMessage(
                "Error al importar: " +
                    (error.response?.data?.error || error.message)
            );
            setIsError(true);
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-4">
            {/* Header simple */}
            <div className="mb-4 pb-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 text-dark fw-semibold">Importar Productos</h5>
                    {excelTemplate && (
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
            </div>

            {/* Opciones de importación - Diseño limpio */}
            <div className="mb-4">
                <label className="form-label text-dark fw-semibold mb-3">
                    Modo de Importación
                </label>
                
                <div className="row g-3">
                    {/* Opción 1: Importar desde 0 */}
                    <div className="col-md-6">
                        <div 
                            className={`card h-100 ${
                                importMode === "reset" 
                                    ? "border-primary" 
                                    : "border"
                            }`}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderWidth: importMode === "reset" ? '2px' : '1px'
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
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%'
                                        }}
                                    />
                                    <label className="form-check-label flex-grow-1" htmlFor="modeReset" style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <div 
                                                className="d-flex align-items-center justify-content-center me-2"
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    background: '#6c757d',
                                                    color: 'white'
                                                }}
                                            >
                                                <i className="fas fa-redo-alt"></i>
                                            </div>
                                            <strong className="text-dark">Importar desde cero</strong>
                                        </div>
                                        <small className="text-muted">
                                            Reemplaza todos los productos existentes con los del archivo Excel
                                        </small>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Opción 2: Agregar/Actualizar */}
                    <div className="col-md-6">
                        <div 
                            className={`card h-100 ${
                                importMode === "add_update" 
                                    ? "border-primary" 
                                    : "border"
                            }`}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                borderWidth: importMode === "add_update" ? '2px' : '1px'
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
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%'
                                        }}
                                    />
                                    <label className="form-check-label flex-grow-1" htmlFor="modeAddUpdate" style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center mb-2">
                                            <div 
                                                className="d-flex align-items-center justify-content-center me-2"
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    background: '#0d6efd',
                                                    color: 'white'
                                                }}
                                            >
                                                <i className="fas fa-sync-alt"></i>
                                            </div>
                                            <strong className="text-dark">Agregar / Actualizar</strong>
                                        </div>
                                        <small className="text-muted">
                                            Actualiza productos existentes (por SKU) o agrega nuevos sin eliminar
                                        </small>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selector de archivo */}
            <div className="mb-4">
                <label className="form-label text-dark fw-semibold mb-2">
                    Archivo Excel
                </label>
                <input
                    className="form-control form-control-lg"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                />
                {file && (
                    <div className="mt-2 p-2 bg-light rounded d-flex align-items-center">
                        <i className="fas fa-file-excel text-success me-2" style={{ fontSize: '20px' }}></i>
                        <div className="flex-grow-1">
                            <span className="text-dark">{file.name}</span>
                        </div>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light"
                            onClick={() => setFile(null)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Botón de importación */}
            <button
                onClick={handleUpload}
                disabled={loading || !file}
                className="btn btn-primary btn-lg w-100"
                type="button"
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                    </>
                ) : (
                    <>
                        <i className="fas fa-upload me-2"></i>
                        Importar Productos
                    </>
                )}
            </button>

            {/* Mensaje de resultado */}
            {message && (
                <div
                    className={`alert ${
                        isError ? "alert-danger" : "alert-success"
                    } mt-3 mb-0`}
                    role="alert"
                >
                    <div className="d-flex align-items-start">
                        <i className={`fas ${isError ? "fa-exclamation-circle" : "fa-check-circle"} me-2 mt-1`}></i>
                        <div className="flex-grow-1">
                            <strong>{isError ? "Error" : "Completado"}</strong>
                            <div className="mt-1">{message}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalImportItem;
