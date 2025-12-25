import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CaseStudiesRest from "../Actions/Admin/CaseStudiesRest";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import getYTVideoId from "../Utils/getYTVideoId";

const caseStudiesRest = new CaseStudiesRest();

const CaseStudies = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const videoUrlRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [videoPreview, setVideoPreview] = useState('');

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        videoUrlRef.current.value = data?.video_url ?? "";
        setVideoPreview(getYTVideoId(data?.video_url) || '');

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            video_url: videoUrlRef.current.value,
        };

        const result = await caseStudiesRest.save(request);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await caseStudiesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await caseStudiesRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await caseStudiesRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onReorder = async (e) => {
        const newOrderIndex = e.toIndex;

        try {
            const result = await caseStudiesRest.reorder(e.itemData.id, newOrderIndex);
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error('Error reordering case study:', error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Casos Reales (Videos)"
                rest={caseStudiesRest}
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: 'push'
                }}
                sorting={{
                    mode: 'single'
                }}
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
                            text: "Nuevo video",
                            hint: "Nuevo video",
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
                        dataField: 'order_index',
                        caption: 'Orden',
                        visible: false,
                        sortOrder: 'asc',
                        sortIndex: 0
                    },
                    {
                        dataField: "video_url",
                        caption: "Video",
                        width: "120px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            const videoId = getYTVideoId(data.video_url);
                            if (videoId) {
                                ReactAppend(
                                    container,
                                    <img
                                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                        style={{
                                            width: "100px",
                                            height: "56px",
                                            objectFit: "cover",
                                            borderRadius: "4px",
                                        }}
                                        alt={data.name}
                                    />
                                );
                            } else {
                                container.text('Sin thumbnail');
                            }
                        },
                    },
                    {
                        dataField: "name",
                        caption: "Título",
                        width: "30%",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "40%",
                    },
                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onVisibleChange({
                                            id: data.id,
                                            value: !data.visible,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.status == 1}
                                    onChange={() =>
                                        onStatusChange({
                                            id: data.id,
                                            value: !data.status,
                                        })
                                    }
                                />
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.css("text-overflow", "unset");
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pen",
                                    onClick: () => onModalOpen(data),
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
                title={isEditing ? "Editar video" : "Agregar video"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <input ref={idRef} type="hidden" />
                <InputFormGroup
                    eRef={nameRef}
                    label="Título del Video"
                    required
                    placeholder="Ej: Manga Gástrica - Resultados"
                />
                <InputFormGroup
                    eRef={videoUrlRef}
                    label="URL del Video (YouTube)"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={(e) => setVideoPreview(getYTVideoId(e.target.value) || '')}
                />
                <iframe
                    src={`https://www.youtube.com/embed/${videoPreview}`}
                    className="w-100 rounded border mb-3"
                    style={{ aspectRatio: '16/9' }}
                    title="Vista previa del video"
                    allowFullScreen
                />
                <TextareaFormGroup
                    eRef={descriptionRef}
                    label="Descripción"
                    rows={3}
                    placeholder="Descripción breve del video"
                />
                <small className="text-muted">
                    <i className="mdi mdi-information me-1"></i>
                    Formatos soportados: YouTube y Vimeo
                </small>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Casos Reales (Videos)">
            <CaseStudies {...properties} />
        </BaseAdminto>
    );
});
