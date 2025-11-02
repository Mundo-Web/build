import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import Swal from "sweetalert2";
import ServicesRest from "../Actions/Admin/ServicesRest";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import SetSelectValue from "../Utils/SetSelectValue";

const servicesRest = new ServicesRest();

const Services = ({ categories = [], subcategories = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const categoryRef = useRef();
    const subcategoryRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const pathRef = useRef();
    const imageRef = useRef();
    const backgroundImageRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        
        // Cargar categoría y establecer selectedCategory
        $(categoryRef.current)
            .val(data?.service_category_id || "")
            .trigger("change");
        setSelectedCategory(data?.service_category_id || null);
        
        // Cargar subcategoría
        setTimeout(() => {
            $(subcategoryRef.current)
                .val(data?.service_subcategory_id || "")
                .trigger("change");
        }, 100);
        
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        pathRef.current.value = data?.path ?? "";
        
        imageRef.image.src = data?.image ? `/storage/images/service/${data.image}` : '';
        imageRef.current.value = null;
        
        backgroundImageRef.image.src = data?.background_image ? `/storage/images/service/${data.background_image}` : '';
        backgroundImageRef.current.value = null;

        // Reset delete flags
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
        };

        // Solo agregar categoría si tiene valor
        const categoryValue = categoryRef.current.value;
        if (categoryValue && categoryValue !== '' && categoryValue !== 'null') {
            request.service_category_id = categoryValue;
        }

        // Solo agregar subcategoría si tiene valor
        const subcategoryValue = subcategoryRef.current.value;
        if (subcategoryValue && subcategoryValue !== '' && subcategoryValue !== 'null') {
            request.service_subcategory_id = subcategoryValue;
        }

        // Solo agregar path si tiene valor
        const pathValue = pathRef.current.value;
        if (pathValue && pathValue !== '') {
            request.path = pathValue;
        }

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined && request[key] !== null) {
                formData.append(key, request[key]);
            }
        }
        
        const imageFile = imageRef.current.files[0];
        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        const backgroundImageFile = backgroundImageRef.current.files[0];
        if (backgroundImageFile) {
            formData.append("background_image", backgroundImageFile);
        }

        // Check for image deletion flags
        if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }
        
        if (backgroundImageRef.getDeleteFlag && backgroundImageRef.getDeleteFlag()) {
            formData.append('background_image_delete', 'DELETE');
        }

        const result = await servicesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

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
                        cellTemplate: (container, { data }) => {
                            container.html(
                                renderToString(
                                    <>
                                        <b className="d-block">
                                            {data.category?.name || 'Sin categoría'}
                                        </b>
                                        <small className="text-muted">
                                            {data.subcategory?.name || 'Sin subcategoría'}
                                        </small>
                                    </>
                                )
                            );
                        },
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
                            label="Imagen del Servicio"
                            col="col-12"
                            aspect={1}
                        />
                        <ImageFormGroup
                            eRef={backgroundImageRef}
                            name="background_image"
                            label="Imagen de Fondo"
                            col="col-12"
                            aspect={16 / 9}
                        />
                    </div>
                    <div className="col-md-6">
                        <SelectFormGroup
                            eRef={categoryRef}
                            label="Categoría"
                            dropdownParent="#services-modal-container"
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </SelectFormGroup>
                        <SelectFormGroup
                            eRef={subcategoryRef}
                            label="Subcategoría"
                            dropdownParent="#services-modal-container"
                        >
                            {subcategories
                                .filter(sub => !selectedCategory || sub.service_category_id === selectedCategory)
                                .map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                        </SelectFormGroup>
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre del Servicio"
                            required
                        />
                        <InputFormGroup
                            eRef={pathRef}
                            label="Ruta (Path)"
                            placeholder="/casillero-virtual"
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
