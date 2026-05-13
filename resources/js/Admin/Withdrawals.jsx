import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import BasicRest from "../Actions/BasicRest";
import DxButton from "../Components/dx/DxButton";
import { CurrencySymbol } from "../Utils/Number2Currency";
import Swal from "sweetalert2";
import { toast, Toaster } from "sonner";
import ReactAppend from "../Utils/ReactAppend";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";

const withdrawalRest = new BasicRest();
withdrawalRest.path = "admin/withdrawals";

const Withdrawals = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(false);

    const notesRef = useRef();
    const receiptRef = useRef();
    const [fileName, setFileName] = useState("");

    const onProcessOpen = (data) => {
        setSelectedRequest(data);
        setFileName("");
        setTimeout(() => {
            $(modalRef.current).modal("show");
        }, 100);
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.info(`${label} copiado al portapapeles`);
    };

    const handleProcess = async (status) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("status", status);
        formData.append("notes", notesRef.current?.value || "");
        if (receiptRef.current?.files[0]) {
            formData.append("receipt", receiptRef.current.files[0]);
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
            
            const response = await fetch(
                `/api/admin/withdrawals/${selectedRequest.id}/process`,
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrfToken,
                        "Accept": "application/json"
                    },
                    body: formData,
                },
            );

            const result = await response.json();

            if (response.ok) {
                toast.success(
                    `Solicitud ${status === "completed" ? "completada" : "actualizada"} con éxito`,
                );
                $(modalRef.current).modal("hide");
                $(gridRef.current).dxDataGrid("instance").refresh();
            } else {
                toast.error(result.message || "Error al procesar la solicitud");
            }
        } catch (error) {
            console.error("Error al procesar retiro:", error);
            toast.error("Error de conexión o de servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <Toaster position="top-right" richColors />

            <Table
                gridRef={gridRef}
                title="Gestión de Solicitudes de Retiro"
                rest={withdrawalRest}
                withRelations="user"
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current).dxDataGrid("instance").refresh(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "created_at",
                        caption: "Fecha",
                        dataType: "date",
                        format: "dd/MM/yyyy HH:mm",
                        width: 150,
                    },
                    {
                        dataField: "user.name",
                        caption: "Vendedor",
                        cellTemplate: (container, { data }) => {
                            $(container).html(`
                                <div class="d-flex align-items-center">
                                    <div class="fw-bold">${data.user.name} ${data.user.lastname}</div>
                                </div>
                            `);
                        },
                    },
                    {
                        dataField: "amount",
                        caption: "Monto",
                        alignment: "right",
                        cellTemplate: (container, { data }) => {
                            $(container).html(
                                `<span class="fw-bold text-dark">${CurrencySymbol()} ${parseFloat(data.amount).toLocaleString()}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "method",
                        caption: "Método",
                        cellTemplate: (container, { data }) => {
                            const icon =
                                data.method === "bank_transfer"
                                    ? "mdi-bank"
                                    : "mdi-cellphone-check";
                            const label =
                                data.method === "bank_transfer"
                                    ? "Banco"
                                    : "Yape/Plin";
                            $(container).html(
                                `<span><i class="mdi ${icon} me-1"></i> ${label}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        cellTemplate: (container, { data }) => {
                            const badgeClass =
                                data.status === "completed"
                                    ? "bg-success"
                                    : data.status === "pending"
                                      ? "bg-warning text-dark"
                                      : data.status === "approved"
                                        ? "bg-info"
                                        : "bg-danger";
                            $(container).html(
                                `<span class="badge ${badgeClass} px-3 rounded-pill">${data.status.toUpperCase()}</span>`,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: 100,
                        cellTemplate: (container, { data }) => {
                            if (
                                data.status === "pending" ||
                                data.status === "approved"
                            ) {
                                container.append(
                                    DxButton({
                                        className:
                                            "btn btn-xs btn-soft-primary",
                                        icon: "fa fa-cog",
                                        text: "Procesar",
                                        onClick: () => onProcessOpen(data),
                                    }),
                                );
                            } else if (data.status === "completed") {
                                if (data.receipt_path) {
                                    container.append(
                                        DxButton({
                                            className: "btn btn-xs btn-soft-info",
                                            icon: "fa fa-eye",
                                            hint: "Ver Comprobante",
                                            onClick: () => window.open(`/api/withdrawal/media/${data.receipt_path}`, '_blank'),
                                        }),
                                    );
                                } else {
                                    $(container).text("-");
                                }
                            } else {
                                $(container).text("-");
                            }
                        },
                    },
                ]}
            />

            {/* Admin Process Modal */}
            <Modal
                modalRef={modalRef}
                title="Procesar Solicitud de Retiro"
                size="md"
                hideFooter={true}
            >
                {selectedRequest && (
                    <div className="p-2">
                        <div className="card bg-soft-light border mb-3 shadow-none">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="avatar-sm bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                        <i className="mdi mdi-account fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{selectedRequest.user.name} {selectedRequest.user.lastname}</h6>
                                        <small className="text-muted">ID: {selectedRequest.user.id}</small>
                                    </div>
                                </div>

                                <div className="p-3 bg-white border rounded mb-3">
                                    <p className="text-muted small fw-bold text-uppercase mb-1">Monto a Liquidar</p>
                                    <h3 className="text-success mb-0 fw-black">
                                        {CurrencySymbol()} {parseFloat(selectedRequest.amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </h3>
                                </div>

                                <h6 className="fw-bold text-uppercase text-muted mb-2 small">
                                    Información de Pago ({selectedRequest.method === 'bank_transfer' ? 'Transferencia' : 'Yape/Plin'})
                                </h6>
                                
                                {selectedRequest.method === "bank_transfer" ? (
                                    <div className="bg-white p-3 rounded border">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <p className="mb-0 small text-muted">Banco</p>
                                            <span className="fw-bold small">{selectedRequest.details?.bank_name}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <p className="mb-0 small text-muted">Cuenta</p>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-bold small me-2">{selectedRequest.details?.account_number}</span>
                                                <button type="button" className="btn btn-xs btn-outline-secondary p-0 px-1" onClick={() => copyToClipboard(selectedRequest.details?.account_number, 'Número de cuenta')}>
                                                    <i className="mdi mdi-content-copy"></i>
                                                </button>
                                            </div>
                                        </div>
                                        {selectedRequest.details?.cci_number && (
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="mb-0 small text-muted">CCI</p>
                                                <div className="d-flex align-items-center">
                                                    <span className="fw-bold small me-2">{selectedRequest.details?.cci_number}</span>
                                                    <button type="button" className="btn btn-xs btn-outline-secondary p-0 px-1" onClick={() => copyToClipboard(selectedRequest.details?.cci_number, 'CCI')}>
                                                        <i className="mdi mdi-content-copy"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white p-3 rounded border">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="mb-0 small text-muted">Teléfono Yape/Plin</p>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-bold fs-5 me-2">{selectedRequest.details?.phone_number}</span>
                                                <button type="button" className="btn btn-sm btn-outline-secondary p-0 px-1" onClick={() => copyToClipboard(selectedRequest.details?.phone_number, 'Teléfono')}>
                                                    <i className="mdi mdi-content-copy"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold small text-muted text-uppercase">Notas para el Vendedor</label>
                            <textarea
                                className="form-control"
                                ref={notesRef}
                                rows="2"
                                placeholder="Ej: Transferencia realizada desde cuenta BCP..."
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <ImageFormGroup 
                                eRef={receiptRef}
                                label="Comprobante de Pago (Imagen o PDF)"
                                aspect="4/3"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setFileName(file.name);
                                    } else {
                                        setFileName("");
                                    }
                                }}
                            />
                            {fileName && (
                                <div className="p-2 bg-light border rounded d-flex align-items-center mb-2">
                                    <i className={`mdi ${fileName.toLowerCase().endsWith('.pdf') ? 'mdi-file-pdf text-danger' : 'mdi-image text-primary'} fs-4 me-2`}></i>
                                    <span className="small text-truncate fw-bold">{fileName}</span>
                                </div>
                            )}
                            <div className="mt-1 d-flex justify-content-between">
                                <small className="text-muted">Formatos: JPG, PNG, PDF</small>
                                <button type="button" className="btn btn-link btn-xs p-0 text-info" onClick={() => {
                                    if (receiptRef.current) receiptRef.current.accept = "image/*,application/pdf";
                                    receiptRef.current?.click();
                                }}>
                                    {fileName ? 'Cambiar archivo' : 'Subir PDF/Imagen'}
                                </button>
                            </div>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-danger flex-fill"
                                onClick={() => handleProcess("rejected")}
                                disabled={loading}
                            >
                                Rechazar
                            </button>
                            <button
                                type="button"
                                className="btn btn-info flex-fill"
                                onClick={() => handleProcess("approved")}
                                disabled={loading}
                            >
                                Aprobar
                            </button>
                            <button
                                type="button"
                                className="btn btn-success flex-fill"
                                onClick={() => handleProcess("completed")}
                                disabled={loading}
                            >
                                <i className="mdi mdi-check-all me-1"></i>{" "}
                                Marcar como Pagado
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Gestión de Retiros">
            <Withdrawals {...properties} />
        </BaseAdminto>,
    );
});
