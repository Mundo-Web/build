import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import CaseStudiesRest from "../Actions/Admin/CaseStudiesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
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
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [videoPreview, setVideoPreview] = useState('');

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Reset delete flag when opening modal
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        videoUrlRef.current.value = data?.video_url ?? "";
        setVideoPreview(getYTVideoId(data?.video_url) || '');
        imageRef.image.src = data?.image ? `/storage/images/case_study/${data.image}` : '';
        imageRef.current.value = null;

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

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        const file = imageRef.current.files[0]
        if (file) {
            formData.append('image', file)
        }

        // Check for image deletion flag
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        const result = await caseStudiesRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

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
                        dataField: "image",
                        caption: "Imagen",
                        width: "120px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            const videoId = getYTVideoId(data.video_url);
                            const thumbnailSrc = data.image 
                                ? `/storage/images/case_study/${data.image}`
                                : (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null);
                            
                            if (thumbnailSrc) {
                                ReactAppend(
                                    container,
                                    <img
                                        src={thumbnailSrc}
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
                                container.text('Sin imagen');
                            }
                        },
                    },
                    {
                        dataField: "video_url",
                        caption: "Video",
                        width: "80px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            const videoId = getYTVideoId(data.video_url);
                            if (videoId || data.video_url) {
                                container.append(
                                    DxButton({
                                        className: "btn btn-xs btn-soft-success",
                                        title: "Reproducir video",
                                        icon: "fa fa-play",
                                        onClick: () => {
                                            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                                            Swal.fire({
                                                html: `
                                                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                                                        <iframe 
                                                            src="${embedUrl}"
                                                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowfullscreen
                                                        ></iframe>
                                                    </div>
                                                `,
                                                title: data.name,
                                                width: '800px',
                                                showCloseButton: true,
                                                showConfirmButton: false,
                                            });
                                        },
                                    })
                                );
                            } else {
                                container.text('Sin video');
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
                title={
                    <div className="d-flex align-items-center">
                        <i className={`fas ${isEditing ? 'fa-edit' : 'fa-plus-circle'} me-2 text-primary`}></i>
                        {isEditing ? "Editar Caso Real" : "Nuevo Caso Real"}
                    </div>
                }
                onSubmit={onModalSubmit}
                size="xl"
            >
                <input ref={idRef} type="hidden" />
                
                {/* Tabs Navigation */}
                <ul className="nav nav-pills nav-justified bg-light rounded mb-3 p-2" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#info-tab" role="tab">
                            <i className="fas fa-info-circle me-1"></i>
                            <span className="d-none d-sm-inline">Información</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#video-tab" role="tab">
                            <i className="fas fa-video me-1"></i>
                            <span className="d-none d-sm-inline">Video</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#image-tab" role="tab">
                            <i className="fas fa-image me-1"></i>
                            <span className="d-none d-sm-inline">Thumbnail</span>
                        </a>
                    </li>
                </ul>

                {/* Tabs Content */}
                <div className="tab-content">
                    {/* Tab: Información */}
                    <div className="tab-pane fade show active" id="info-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-primary text-white">
                                <i className="fas fa-file-alt me-2"></i>
                                Datos del Caso
                            </div>
                            <div className="card-body">
                                <InputFormGroup
                                    eRef={nameRef}
                                    label={
                                        <span>
                                            <i className="fas fa-heading text-primary me-1"></i>
                                            Título del Caso
                                        </span>
                                    }
                                    required
                                    placeholder="Ej: Manga Gástrica - María perdió 45kg en 8 meses"
                                    helpText="Un título descriptivo y atractivo para el caso de éxito"
                                />
                                <TextareaFormGroup
                                    eRef={descriptionRef}
                                    label={
                                        <span>
                                            <i className="fas fa-align-left text-primary me-1"></i>
                                            Descripción del Caso
                                        </span>
                                    }
                                    rows={4}
                                    placeholder="Describe la historia del paciente, procedimiento realizado, resultados obtenidos..."
                                    helpText="Una descripción detallada ayuda a inspirar confianza en futuros pacientes"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tab: Video */}
                    <div className="tab-pane fade" id="video-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-danger text-white">
                                <i className="fab fa-youtube me-2"></i>
                                Video Testimonio
                            </div>
                            <div className="card-body">
                                <InputFormGroup
                                    eRef={videoUrlRef}
                                    label={
                                        <span>
                                            <i className="fas fa-link text-danger me-1"></i>
                                            URL del Video
                                        </span>
                                    }
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    onChange={(e) => setVideoPreview(getYTVideoId(e.target.value) || '')}
                                    helpText="Pega la URL completa del video de YouTube o Vimeo (opcional si subes imagen)"
                                />
                                
                                {videoPreview && (
                                    <div className="mt-3">
                                        <label className="form-label fw-bold">
                                            <i className="fas fa-eye text-info me-1"></i>
                                            Vista Previa del Video
                                        </label>
                                        <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm border">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${videoPreview}`}
                                                title="Vista previa del video"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                )}

                                {!videoPreview && (
                                    <div className="alert alert-info mt-3">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Ingresa una URL de video para ver la vista previa
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tab: Imagen */}
                    <div className="tab-pane fade" id="image-tab" role="tabpanel">
                        <div className="card border-0 shadow-sm mb-3">
                            <div className="card-header bg-success text-white">
                                <i className="fas fa-image me-2"></i>
                                Imagen Personalizada
                            </div>
                            <div className="card-body">
                                <div className="alert alert-warning">
                                    <i className="fas fa-lightbulb me-2"></i>
                                    <strong>Recomendación:</strong> Sube una imagen de alta calidad (1280x720px) para mejorar la presentación del caso
                                </div>
                                
                                <ImageFormGroup
                                    eRef={imageRef}
                                    label={
                                        <span>
                                            <i className="fas fa-upload text-success me-1"></i>
                                            Thumbnail Personalizado
                                        </span>
                                    }
                                    helpText="Esta imagen se mostrará en lugar del thumbnail de YouTube. Formato recomendado: JPG o PNG, 1280x720px"
                                    aspect={16/9}
                                />

                                <div className="mt-3 p-3 bg-light rounded">
                                    <h6 className="text-muted mb-2">
                                        <i className="fas fa-question-circle me-1"></i>
                                        ¿Cuándo usar imagen personalizada?
                                    </h6>
                                    <ul className="small text-muted mb-0">
                                        <li>Cuando quieras un thumbnail más profesional que el de YouTube</li>
                                        <li>Para mantener consistencia visual en tu sitio</li>
                                        <li>Si el thumbnail automático de YouTube no se ve bien</li>
                                        <li>Para casos sin video (solo testimonial con foto)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="alert alert-secondary border-0 shadow-sm">
                    <i className="mdi mdi-information-outline me-2"></i>
                    <strong>Nota:</strong> Puedes agregar solo video, solo imagen, o ambos. La imagen personalizada tendrá prioridad sobre el thumbnail de YouTube.
                </div>
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
