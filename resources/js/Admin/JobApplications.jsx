import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import CreateReactScript from "../Utils/CreateReactScript";
import BaseAdminto from "@Adminto/Base";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";

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

    const onModalOpen = (data) => {
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

        if (!result) {
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
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
        window.open(`/storage/documents/cv/${cv}`, '_blank');
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
                                const button = $("<button>")
                                    .addClass("btn btn-sm btn-info")
                                    .html('<i class="fa fa-download"></i>')
                                    .attr('title', 'Descargar CV')
                                    .on("click", () => downloadCV(data.cv));
                                container.append(button);
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
                            const switchComponent = $("<div>").dxSwitch({
                                value: data.reviewed,
                                onValueChanged: ({ value, previousValue }) => {
                                    onReviewedChange({
                                        id: data.id,
                                        value,
                                        previous: previousValue,
                                    });
                                },
                            });
                            container.append(switchComponent);
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
                            const editButton = $("<button>")
                                .addClass("btn btn-sm btn-warning me-2")
                                .html('<i class="fa fa-edit"></i>')
                                .on("click", () => onModalOpen(data));

                            const deleteButton = $("<button>")
                                .addClass("btn btn-sm btn-danger")
                                .html('<i class="fa fa-trash"></i>')
                                .on("click", () => onDeleteClicked(data));

                            container.append(editButton, deleteButton);
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar solicitud" : "Agregar solicitud"}
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />
                <div className="row">
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre completo"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={emailRef}
                            label="Email"
                            type="email"
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={phoneRef}
                            label="Teléfono"
                            type="tel"
                        />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup
                            eRef={positionRef}
                            label="Posición deseada"
                        />
                    </div>
                    <div className="col-md-12">
                        <TextareaFormGroup
                            eRef={messageRef}
                            label="Mensaje"
                            rows={3}
                        />
                    </div>
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
