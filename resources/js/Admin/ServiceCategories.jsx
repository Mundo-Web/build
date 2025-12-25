import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import ServiceCategoriesRest from "../Actions/Admin/ServiceCategoriesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript, { hasRole } from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import Fillable from "../Utils/Fillable";
import BooleanLimit from "../Utils/BooleanLimit";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
const serviceCategoriesRest = new ServiceCategoriesRest();

const ServiceCategories = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const modelKey = "service_categories";

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const bannerRef = useRef();
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        bannerRef.image.src = data?.banner ? `/storage/images/service_category/${data.banner}` : '';
        bannerRef.current.value = null;
        imageRef.image.src = data?.image ? `/storage/images/service_category/${data.image}` : '';
        imageRef.current.value = null;

        // Reset delete flags using React state - only when opening modal
        if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

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
        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }
        const file2 = bannerRef.current.files[0];
        if (file2) {
            formData.append("banner", file2);
        }

        // Check for image deletion flags using React state
        if (bannerRef.getDeleteFlag && bannerRef.getDeleteFlag()) {
            formData.append('banner_delete', 'DELETE');
        }

        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        const result = await serviceCategoriesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (bannerRef.resetDeleteFlag) bannerRef.resetDeleteFlag();
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onFeaturedChange = async ({ id, value, previous }) => {
        if (value && BooleanLimit.shouldBlock(modelKey, "featured", previous)) {
            const limitInfo = BooleanLimit.get(modelKey, "featured");
            const message =
                limitInfo?.message ??
                "Se alcanzó el límite de categorías de servicios destacadas.";

            let text = message;
            if (limitInfo) {
                text += ` Actualmente hay ${limitInfo.active ?? 0} de ${limitInfo.max ?? 0} categorías activas.`;
                if (hasRole("Root") && limitInfo.general_key) {
                    text += ` Puedes ajustar el límite en Generales usando la clave ${limitInfo.general_key}.`;
                }
            }
            Swal.fire({
                icon: "warning",
                title: "Límite alcanzado",
                text,
            });
            return;
        }

        const result = await serviceCategoriesRest.boolean({
            id,
            field: "featured",
            value,
        });
        if (!result) return;

        if (BooleanLimit.has(modelKey, "featured")) {
            if (typeof result === "object" && result?.limit) {
                BooleanLimit.updateFromServer(modelKey, result);
            } else {
                BooleanLimit.applyChange(modelKey, "featured", {
                    previous,
                    next: value,
                });
            }
        }

        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await serviceCategoriesRest.boolean({
            id,
            field: "visible",
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
        const result = await serviceCategoriesRest.delete(row.id);
        if (!result) return;
        if (BooleanLimit.has(modelKey, "featured") && row.featured) {
            BooleanLimit.applyChange(modelKey, "featured", {
                previous: true,
                next: false,
            });
        }
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    // Función para manejar el reordering remoto
    const onReorder = async (e) => {
        // e.toIndex es la nueva posición donde se quiere insertar el elemento
        const newOrderIndex = e.toIndex;

        try {
            const result = await serviceCategoriesRest.reorder(e.itemData.id, newOrderIndex);
            if (result) {
                await e.component.refresh();
            }
        } catch (error) {
            console.error('Error reordering service category:', error);
        }
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Categorías de Servicios"
                rest={serviceCategoriesRest}
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
                        dataField: 'order_index',
                        caption: 'Orden',
                        visible: false,
                        sortOrder: 'asc',
                        sortIndex: 0
                    },
                    {
                        dataField: "name",
                        caption: "Categoría",
                        width: "30%",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "50%",
                    },
                    Fillable.has('service_categories', 'image') && {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service_category/${data.image}`}
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
                    Fillable.has('service_categories', 'banner') && {
                        dataField: "banner",
                        caption: "Banner",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service_category/${data.banner}`}
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
                    {
                        dataField: "featured",
                        caption: "Destacado",
                        dataType: "boolean",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            const isFeatured = data.featured == 1;
                            const hasLimit = BooleanLimit.has(modelKey, "featured");
                            const isBlocked = hasLimit && BooleanLimit.shouldBlock(modelKey, "featured", isFeatured);
                            const limitMessage = isBlocked
                                ? BooleanLimit.getMessage(modelKey, "featured")
                                : null;

                            if (limitMessage) {
                                $(container).attr("title", limitMessage);
                            } else {
                                $(container).removeAttr("title");
                            }

                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={isFeatured}
                                    disabled={isBlocked}
                                    onChange={() =>
                                        onFeaturedChange({
                                            id: data.id,
                                            value: !isFeatured,
                                            previous: isFeatured,
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
                title={isEditing ? "Editar categoría de servicio" : "Agregar categoría de servicio"}
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />
                <div className="row" id="service-categories-container">
                    <div className={!Fillable.has('service_categories', 'banner') && !Fillable.has('service_categories', 'image') ? 'hidden' : 'col-md-6'}>
                        <ImageFormGroup
                            eRef={bannerRef}
                            name="banner"
                            label="Banner"
                            col="col-12"
                            aspect={3 / 1}
                            hidden={!Fillable.has('service_categories', 'banner')}
                        />
                        <ImageFormGroup
                            eRef={imageRef}
                            name="image"
                            label="Imagen"
                            col="col-12"
                            aspect={16 / 9}
                            hidden={!Fillable.has('service_categories', 'image')}
                        />

                    </div>
                    <div className={!Fillable.has('service_categories', 'banner') && !Fillable.has('service_categories', 'image') ? 'col-md-12' : 'col-md-6'}>
                        <InputFormGroup
                            eRef={nameRef}
                            label="Categoría"
                            rows={2}
                            required
                        />
                        <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción"
                            rows={3}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Categorías de Servicios">
            <ServiceCategories {...properties} />
        </BaseAdminto>
    );
});
