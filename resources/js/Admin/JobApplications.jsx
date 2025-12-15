import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import CreateReactScript from "../Utils/CreateReactScript";
import BaseAdminto from "@Adminto/Base";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import DxButton from "../Components/dx/DxButton";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import ReactAppend from "../Utils/ReactAppend";
import Swal from "sweetalert2";
import JobApplicationsRest from "../Actions/Admin/JobApplicationsRest";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";

const jobApplicationsRest = new JobApplicationsRest();

const JobApplications = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const positionRef = useRef();
    const messageRef = useRef();
    const cvRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [currentCV, setCurrentCV] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    const onModalOpen = (data, viewOnly = false) => {
        setIsViewing(viewOnly);
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        emailRef.current.value = data?.email ?? "";
        phoneRef.current.value = data?.phone ?? "";
        positionRef.current.value = data?.position ?? "";
        messageRef.current.value = data?.message ?? "";
        cvRef.current.value = null;
        setCurrentCV(data?.cv ?? null);

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            position: positionRef.current.value,
            message: messageRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined && request[key] !== null) {
                formData.append(key, request[key]);
            }
        }

        const file = cvRef.current.files[0];
        if (file) {
            formData.append("cv", file);
        }

        const result = await jobApplicationsRest.save(formData);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onReviewedChange = async ({ id, value }) => {
        const result = await jobApplicationsRest.boolean({
            id,
            field: "reviewed",
            value,
        });

        if (!result) return;
        
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminarlo",
            cancelButtonText: "Cancelar",
        });

        if (!isConfirmed) return;

        const result = await jobApplicationsRest.delete(row.id);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const downloadCV = (cv) => {
        if (!cv) return;
        // Usar la ruta API del BasicController->media() como las imágenes
        window.open(`/api/job-applications/media/${cv}`, '_blank');
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Solicitudes de Trabajo"
                rest={jobApplicationsRest}
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () =>
                                $(gridRef.current)
                                    .dxDataGrid("instance")
                                    .refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Agregar solicitud",
                            hint: "Agregar solicitud",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        width: "20%",
                    },
                    {
                        dataField: "email",
                        caption: "Email",
                        width: "18%",
                    },
                    {
                        dataField: "phone",
                        caption: "Teléfono",
                        width: "12%",
                    },
                    {
                        dataField: "position",
                        caption: "Posición",
                        width: "15%",
                    },
                    {
                        dataField: "message",
                        caption: "Mensaje",
                        width: "20%",
                        cellTemplate: (container, { data }) => {
                            const message = data.message || '';
                            const shortMessage = message.length > 50 
                                ? message.substring(0, 50) + '...' 
                                : message;
                            container.text(shortMessage);
                            if (message.length > 50) {
                                container.attr('title', message);
                            }
                        },
                    },
                    {
                        dataField: "cv",
                        caption: "CV",
                        width: "80px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            if (data.cv) {
                                container.append(
                                    DxButton({
                                        className: "btn btn-xs btn-soft-info",
                                        title: "Descargar CV",
                                        icon: "fa fa-download",
                                        onClick: () => downloadCV(data.cv),
                                    })
                                );
                            } else {
                                container.text('Sin CV');
                            }
                        },
                    },
                    {
                        dataField: "reviewed",
                        caption: "Revisado",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.reviewed == 1}
                                    onChange={() =>
                                        onReviewedChange({
                                            id: data.id,
                                            value: !data.reviewed,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "created_at",
                        caption: "Fecha",
                        dataType: "date",
                        width: "120px",
                        format: "dd/MM/yyyy",
                    },
                    {
                        caption: "Acciones",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-info",
                                    title: "Ver detalles",
                                    icon: "fa fa-eye",
                                    onClick: () => onModalOpen(data, true),
                                })
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data),
                                })
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isViewing ? "Ver solicitud" : (isEditing ? "Editar solicitud" : "Agregar solicitud")}
                onSubmit={onModalSubmit}
                hideFooter={isViewing}
            >
                <input ref={idRef} type="hidden" />
                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre completo"
                            required
                            disabled={isViewing}
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={emailRef}
                            label="Email"
                            type="email"
                            required
                            disabled={isViewing}
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={phoneRef}
                            label="Teléfono"
                            type="tel"
                            disabled={isViewing}
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={positionRef}
                            label="Posición deseada"
                            disabled={isViewing}
                        />
                    </div>
                    <div className="col-md-12">
                        <TextareaFormGroup
                            eRef={messageRef}
                            label="Mensaje"
                            rows={3}
                            disabled={isViewing}
                        />
                    </div>
                    {!isViewing && (
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label">
                                    CV (PDF, DOC, DOCX)
                                    {currentCV && (
                                        <span className="text-muted ms-2">
                                            (Actual: {currentCV})
                                        </span>
                                    )}
                                </label>
                                <input
                                    ref={cvRef}
                                    type="file"
                                    className="form-control"
                                    accept=".pdf,.doc,.docx"
                                />
                            </div>
                        </div>
                    )}
                    {isViewing && currentCV && (
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label className="form-label d-flex justify-content-between align-items-center">
                                    <span>Curriculum Vitae</span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => downloadCV(currentCV)}
                                    >
                                        <i className="fa fa-download me-2"></i>
                                        Descargar CV
                                    </button>
                                </label>
                                <div className="border rounded" style={{ height: '600px' }}>
                                    <iframe
                                        src={`/api/job-applications/media/${currentCV}`}
                                        className="w-100 h-100"
                                        style={{ border: 'none' }}
                                        title="Vista previa del CV"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {isViewing && (
                        <div className="col-md-12 text-end">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => $(modalRef.current).modal("hide")}
                            >
                                Cerrar
                            </button>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Solicitudes de Trabajo">
            <JobApplications {...properties} />
        </BaseAdminto>
    );
});
