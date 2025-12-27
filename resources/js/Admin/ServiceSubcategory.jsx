import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import ServiceSubCategoriesRest from "../Actions/Admin/ServiceSubCategoriesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import SetSelectValue from "../Utils/SetSelectValue";
import Fillable from "../Utils/Fillable";

const serviceSubCategoriesRest = new ServiceSubCategoriesRest();

const ServiceSubcategory = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const categoryRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        SetSelectValue(
            categoryRef.current,
            data?.category?.id,
            data?.category?.name
        );
        nameRef.current.value = data?.name ?? "";
        
        // Validar si description está disponible (Fillable)
        if (descriptionRef.current) {
            descriptionRef.current.value = data?.description ?? "";
        }
        
        // Validar si image está disponible (Fillable)
        if (imageRef.current && imageRef.image) {
            imageRef.image.src = data?.image ? `/storage/images/service_sub_category/${data.image}` : '';
            imageRef.current.value = null;
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        }

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            service_category_id: categoryRef.current.value,
            name: nameRef.current.value,
        };

        // Solo agregar description si el campo está disponible (Fillable)
        if (descriptionRef.current) {
            request.description = descriptionRef.current.value;
        }

        const formData = new FormData();
        for (const key in request) {
            formData.append(key, request[key]);
        }
        
        // Validar si image está disponible (Fillable)
        if (imageRef.current) {
            const file = imageRef.current.files[0];
            if (file) {
                formData.append("image", file);
            }
            // Check for image deletion flag
            if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
                formData.append('image_delete', 'DELETE');
            }
        }

        const result = await serviceSubCategoriesRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onFeaturedChange = async ({ id, value }) => {
        const result = await serviceSubCategoriesRest.boolean({
            id,
            field: "featured",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await serviceSubCategoriesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await serviceSubCategoriesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Sub Categorías de Servicios"
                rest={serviceSubCategoriesRest}
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
                            text: "Nuevo registro",
                            hint: "Nuevo registro",
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
                        dataField: "category.name",
                        caption: "Categoría",
                    },
                    {
                        dataField: "name",
                        caption: "Sub Categoría",
                    },
                    Fillable.has('service_sub_categories', 'description') && {
                        dataField: "description",
                        caption: "Descripción",
                        width: "50%",
                    },
                    Fillable.has('service_sub_categories', 'image') && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service_sub_category/${data.image}`}
                                    style={{
                                        width: "80px",
                                        height: "48px",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                        borderRadius: "4px",
                                    }}
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />
                            );
                        },
                    },
                    Fillable.has('service_sub_categories', 'featured') && {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.featured == 1}
                                    onChange={() =>
                                        onFeaturedChange({
                                            id: data.id,
                                            value: !data.featured,
                                        })
                                    }
                                />
                            );
                        },
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
                                    onClick: () => onDeleteClicked(data.id),
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
                    isEditing ? "Editar sub categoría de servicio" : "Agregar sub categoría de servicio"
                }
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                
                <div id="modal-container">
                    <div className="row g-3">
                        {/* Información Básica */}
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-info-circle me-2 text-primary"></i>
                                        Información Básica
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <SelectAPIFormGroup
                                                eRef={categoryRef}
                                                label="Categoría Principal"
                                                searchAPI="/api/admin/service-categories/paginate"
                                                searchBy="name"
                                                required
                                                dropdownParent="#modal-container"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <InputFormGroup
                                                eRef={nameRef}
                                                label="Nombre de la Subcategoría"
                                                placeholder="Ej: Manga Gástrica"
                                                required
                                            />
                                        </div>
                                        {Fillable.has('service_sub_categories', 'description') && (
                                            <div className="col-12">
                                                <TextareaFormGroup
                                                    eRef={descriptionRef}
                                                    label="Descripción"
                                                    rows={4}
                                                    placeholder="Descripción detallada de la subcategoría..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Multimedia */}
                        {Fillable.has('service_sub_categories', 'image') && (
                            <div className="col-12">
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">
                                            <i className="fas fa-images me-2 text-success"></i>
                                            Multimedia
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <ImageFormGroup
                                                    eRef={imageRef}
                                                    name="image"
                                                    label="Imagen de la Subcategoría"
                                                    col="col-12"
                                                    aspect={16 / 9}
                                                />
                                                <small className="text-muted">
                                                    <i className="fas fa-info-circle me-1"></i>
                                                    Recomendado: 1600x900px (proporción 16:9)
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Sub Categorías de Servicios">
            <ServiceSubcategory {...properties} />
        </BaseAdminto>
    );
});
