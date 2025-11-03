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
import Fillable from "../Utils/Fillable";

const servicesRest = new ServicesRest();

const Services = ({ service_categories = [], service_sub_categories = [] }) => {
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
    const slugRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        if (pathRef.current) pathRef.current.value = data?.path ?? "";
        if (slugRef.current) slugRef.current.value = data?.slug ?? "";
        
        if (imageRef.current) {
            imageRef.image.src = data?.image ? `/storage/images/service/${data.image}` : '';
            imageRef.current.value = null;
            // Reset delete flags
            if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        }
        
        if (backgroundImageRef.current) {
            backgroundImageRef.image.src = data?.background_image ? `/storage/images/service/${data.background_image}` : '';
            backgroundImageRef.current.value = null;
            // Reset delete flags
            if (backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();
        }

        // Cargar categoría y subcategoría usando jQuery como Items.jsx
        $(categoryRef.current)
            .val(data?.service_category_id || null)
            .trigger("change");
        
        if (data?.service_category_id) {
            setSelectedCategory(Number(data.service_category_id));
        }
        
        $(subcategoryRef.current)
            .val(data?.service_subcategory_id || null)
            .trigger("change");

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

        // Solo agregar path si el ref existe y tiene valor
        if (pathRef.current) {
            const pathValue = pathRef.current.value;
            if (pathValue && pathValue.trim() !== '') {
                request.path = pathValue;
            } else if (isEditing) {
                // Si estamos editando y el campo está vacío, enviar null para limpiar
                request.path = null;
            }
        }

        // Solo agregar slug si tiene valor
        const slugValue = slugRef.current?.value;
        if (slugValue && slugValue.trim() !== '') {
            request.slug = slugValue;
        } else if (isEditing) {
            // Si estamos editando y el campo está vacío, enviar null para limpiar
            request.slug = null;
        }

        const formData = new FormData();
        for (const key in request) {
            if (request[key] !== undefined) {
                // Enviar null como cadena vacía para limpiar campos en edición
                formData.append(key, request[key] === null ? '' : request[key]);
            }
        }
        
        if (imageRef.current) {
            const imageFile = imageRef.current.files[0];
            if (imageFile) {
                formData.append("image", imageFile);
            }
        }
        
        if (backgroundImageRef.current) {
            const backgroundImageFile = backgroundImageRef.current.files[0];
            if (backgroundImageFile) {
                formData.append("background_image", backgroundImageFile);
            }
        }

        // Check for image deletion flags
        if (imageRef.current && imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
            formData.append('image_delete', 'DELETE');
        }
        
        if (backgroundImageRef.current && backgroundImageRef.getDeleteFlag && backgroundImageRef.getDeleteFlag()) {
            formData.append('background_image_delete', 'DELETE');
        }

        const result = await servicesRest.save(formData);
        if (!result) return;

        // Reset delete flags after successful save
        if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
        if (backgroundImageRef.current && backgroundImageRef.resetDeleteFlag) backgroundImageRef.resetDeleteFlag();

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
                    Fillable.has('services', 'image') && {
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
                    // Mostrar imagen de fondo si está marcada como fillable (igual que banner en Categories)
                    Fillable.has('services', 'background_image') && {
                        dataField: "background_image",
                        caption: "Fondo",
                        width: "90px",
                        allowFiltering: false,
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <img
                                    src={`/storage/images/service/${data.background_image}`}
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
                size="md"
            >
                <input ref={idRef} type="hidden" />
                <input ref={slugRef} type="hidden" />
                
                <div id="services-modal-container">
                    <div className="row">
                        {/* Columna de Imágenes */}
                        {(Fillable.has('services', 'image') || Fillable.has('services', 'background_image')) && (
                            <div className="col-md-5">
                                {Fillable.has('services', 'image') && (
                                    <div className="mb-3">
                                        <ImageFormGroup
                                            eRef={imageRef}
                                            name="image"
                                            label="Logo del Servicio"
                                            col="col-12"
                                            aspect={1}
                                        />
                                    </div>
                                )}
                              
                            </div>
                        )}

                        {/* Columna de Información */}
                        <div className={(Fillable.has('services', 'image') || Fillable.has('services', 'background_image')) ? 'col-md-7' : 'col-md-12'}>
                            <div className="row">
                                <div className="col-md-12">
                                    <InputFormGroup
                                        eRef={nameRef}
                                        label="Nombre del Servicio"
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <SelectFormGroup
                                        eRef={categoryRef}
                                        label="Categoría"
                                        dropdownParent="#services-modal-container"
                                        onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                    >
                                        {service_categories.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </SelectFormGroup>
                                </div>
                                
                                <div className="col-md-12">
                                    <SelectFormGroup
                                        eRef={subcategoryRef}
                                        label="Subcategoría"
                                        dropdownParent="#services-modal-container"
                                    >
                                        {service_sub_categories
                                            .filter(sub => !selectedCategory || sub.service_category_id === selectedCategory)
                                            .map((item, index) => (
                                                <option key={index} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                    </SelectFormGroup>
                                
                                {(!Fillable.has('services', 'image') && !Fillable.has('services', 'background_image')) && (
                                    <div className="col-md-6">
                                        <InputFormGroup
                                            eRef={pathRef}
                                            label="Ruta (Path)"
                                            placeholder="/casillero-virtual"
                                        />
                                    </div>
                                )}
                            </div>
                            </div>


                          
                        </div>
                          {Fillable.has('services', 'background_image') && (
                                    <div className="mb-3">
                                        <ImageFormGroup
                                            eRef={backgroundImageRef}
                                            name="background_image"
                                            label="Imagen de Fondo"
                                            col="col-12"
                                            aspect={16 / 9}
                                        />
                                    </div>
                                )}
                                {Fillable.has('services', 'background_image') && (
                                    <div className="mb-3">
                                        <InputFormGroup
                                            eRef={pathRef}
                                            label="Ruta (Path)"
                                            placeholder="/casillero-virtual"
                                        />
                                    </div>
                                )}
                      
                                <div className="col-md-12">
                                    <TextareaFormGroup
                                        eRef={descriptionRef}
                                        label="Descripción"
                                        rows={3}
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
        <BaseAdminto {...properties} title="Servicios">
            <Services {...properties} />
        </BaseAdminto>
    );
});
