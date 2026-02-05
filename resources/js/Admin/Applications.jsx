import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import ApplicationsRest from "../Actions/Admin/ApplicationsRest";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import Fillable from "../Utils/Fillable";
import Swal from "sweetalert2";

const applicationsRest = new ApplicationsRest();

const Applications = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const imageRef = useRef();
    const backgroundImageRef = useRef();
    const descriptionRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Reset delete flag when opening modal
        if (imageRef.current && imageRef.resetDeleteFlag)
            imageRef.resetDeleteFlag();
        if (backgroundImageRef.current && backgroundImageRef.resetDeleteFlag)
            backgroundImageRef.resetDeleteFlag();

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        if (imageRef.current && imageRef.image) {
            imageRef.image.src = data?.image
                ? `/storage/images/application/${data.image}`
                : "";
            imageRef.current.value = null;
        }
        if (backgroundImageRef.current && backgroundImageRef.image) {
            backgroundImageRef.image.src = data?.background_image
                ? `/storage/images/application/${data.background_image}`
                : "";
            backgroundImageRef.current.value = null;
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }

        if (imageRef.current) {
            const file = imageRef.current.files[0];
            if (file) {
                formData.append("image", file);
            }

            // Check for image deletion flag
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append("image_delete", "DELETE");
            }
        }

        if (backgroundImageRef.current) {
            const file = backgroundImageRef.current.files[0];
            if (file) {
                formData.append("background_image", file);
            }

            // Check for image deletion flag
            if (
                backgroundImageRef.getDeleteFlag &&
                backgroundImageRef.getDeleteFlag()
            ) {
                formData.append("background_image_delete", "DELETE");
            }
        }

        const result = await applicationsRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (imageRef.current && imageRef.resetDeleteFlag)
            imageRef.resetDeleteFlag();
        if (backgroundImageRef.current && backgroundImageRef.resetDeleteFlag)
            backgroundImageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await applicationsRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await applicationsRest.boolean({
            id,
            field: "status",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar aplicación",
            text: "¿Estás seguro de eliminar esta aplicación?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await applicationsRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Función para manejar el reordering remoto
    const onReorder = async (e) => {
        // e.toIndex es la nueva posición donde se quiere insertar el elemento
        const newOrderIndex = e.toIndex;

        try {
            const result = await applicationsRest.reorder(
                e.itemData.id,
                newOrderIndex,
            );
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error("Error reordering application:", error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Aplicaciones"
                rest={applicationsRest}
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
                            text: "Nueva aplicación",
                            hint: "Nueva aplicación",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                rowDragging={{
                    allowReordering: true,
                    onReorder: onReorder,
                    dropFeedbackMode: "push",
                }}
                sorting={{
                    mode: "single",
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "order_index",
                        caption: "Orden",
                        visible: false,
                        sortOrder: "asc",
                        sortIndex: 0,
                    },
                    Fillable.has("applications", "image") && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "100px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            if (data.image) {
                                ReactAppend(
                                    container,
                                    <img
                                        src={`/storage/images/application/${data.image}`}
                                        alt={data.name}
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />,
                                );
                            }
                        },
                    },
                    Fillable.has("applications", "background_image") && {
                        dataField: "background_image",
                        caption: "Imagen de Fondo",
                        width: "80px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            if (data.background_image) {
                                ReactAppend(
                                    container,
                                    <img
                                        src={`/storage/images/application/${data.background_image}`}
                                        alt={data.name}
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />,
                                );
                            }
                        },
                    },
                    Fillable.has("applications", "name") && {
                        dataField: "name",
                        caption: "Nombre",
                        width: "25%",
                    },
                    Fillable.has("applications", "description") && {
                        dataField: "description",
                        caption: "Descripción",
                        width: "40%",
                    },
                    Fillable.has("applications", "slug") && {
                        dataField: "slug",
                        caption: "Slug",
                        width: "15%",
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
                                />,
                            );
                        },
                    },
                    {
                        dataField: "status",
                        caption: "Activo",
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
                                />,
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
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data.id),
                                }),
                            );
                        },
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ].filter((col) => col !== false)}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar aplicación" : "Nueva aplicación"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                <div className="row" id="applications-container">
                    {/* Pestaña de información básica */}
                    <div className="col-12 mb-4">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">
                                    <i className="fas fa-info-circle me-2 text-primary"></i>
                                    Información General
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <InputFormGroup
                                            eRef={nameRef}
                                            label="Nombre de la Aplicación"
                                            placeholder="Ej: Muebles, Construcción, Decoración"
                                            required
                                        />
                                    </div>
                                    <div className="col-12">
                                        <TextareaFormGroup
                                            eRef={descriptionRef}
                                            label="Descripción"
                                            rows={3}
                                            placeholder="Descripción detallada de la aplicación..."
                                            hidden={
                                                !Fillable.has(
                                                    "applications",
                                                    "description",
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pestaña de imágenes */}
                    {(Fillable.has("applications", "image") ||
                        Fillable.has("applications", "background_image")) && (
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-images me-2 text-success"></i>
                                        Imágenes
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {Fillable.has(
                                            "applications",
                                            "image",
                                        ) && (
                                            <div className="col-md-6">
                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    name="image"
                                                    label="Icono / Imagen Principal"
                                                    aspect={1}
                                                />
                                                <small className="text-muted">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Formato cuadrado recomendado
                                                    (ej: 512x512px)
                                                </small>
                                            </div>
                                        )}
                                        {Fillable.has(
                                            "applications",
                                            "background_image",
                                        ) && (
                                            <div className="col-md-6">
                                                <ImageFormGroup
                                                    eRef={backgroundImageRef}
                                                    name="background_image"
                                                    label="Imagen de Fondo"
                                                    aspect={16 / 9}
                                                />
                                                <small className="text-muted">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Recomendado: 1600x900px
                                                    (proporción 16:9)
                                                </small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Aplicaciones">
            <Applications {...properties} />
        </BaseAdminto>,
    );
});
