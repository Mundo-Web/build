import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import ServicesRest from "../Actions/Admin/ServicesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectAPIFormGroup from "../Components/Adminto/form/SelectAPIFormGroup";
import SetSelectValue from "../Utils/SetSelectValue";

const servicesRest = new ServicesRest();

const Services = ({ categories, subcategories }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const categoryRef = useRef();
    const subcategoryRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        SetSelectValue(
            categoryRef.current,
            data?.category?.id,
            data?.category?.name
        );
        SetSelectValue(
            subcategoryRef.current,
            data?.subcategory?.id,
            data?.subcategory?.name
        );
        setSelectedCategory(data?.category?.id);
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        imageRef.image.src = data?.image ? `/storage/images/service/${data.image}` : '';
        imageRef.current.value = null;

        // Reset delete flags using React state - only when opening modal
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            service_category_id: categoryRef.current.value,
            service_subcategory_id: subcategoryRef.current.value,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
        };

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined) {
                formData.append(key, request[key]);
            }
        }
        const file = imageRef.current.files[0];
        if (file) {
            formData.append("image", file);
        }

        // Check for image deletion flags using React state
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }

        const result = await servicesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await servicesRest.boolean({
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
        const result = await servicesRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Servicios"
                rest={servicesRest}
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
                        width: "120px",
                    },
                    {
                        dataField: "subcategory.name",
                        caption: "Subcategoría",
                        width: "120px",
                    },
                    {
                        dataField: "name",
                        caption: "Servicio",
                        width: "25%",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                        width: "35%",
                    },
                    {
                        dataField: "image",
                        caption: "Imagen",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service/${data.image}`}
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
                title={isEditing ? "Editar servicio" : "Agregar servicio"}
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />
                <div className="row" id="services-modal-container">
                    <div className="col-md-6">
                        <ImageFormGroup
                            eRef={imageRef}
                            name="image"
                            label="Imagen"
                            col="col-12"
                            aspect={16 / 9}
                        />
                    </div>
                    <div className="col-md-6">
                        <SelectAPIFormGroup
                            eRef={categoryRef}
                            label="Categoría"
                            searchAPI="/api/admin/service-categories/paginate"
                            searchBy="name"
                            dropdownParent="#services-modal-container"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                        <SelectAPIFormGroup
                            eRef={subcategoryRef}
                            label="Subcategoría"
                            searchAPI="/api/admin/service-subcategories/paginate"
                            searchBy="name"
                            filter={["service_category_id", "=", selectedCategory]}
                            dropdownParent="#services-modal-container"
                        />
                        <InputFormGroup
                            eRef={nameRef}
                            label="Servicio"
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
        <BaseAdminto {...properties} title="Servicios">
            <Services {...properties} />
        </BaseAdminto>
    );
});
