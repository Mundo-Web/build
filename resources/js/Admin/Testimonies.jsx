import BaseAdminto from "@Adminto/Base";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Swal from "sweetalert2";
import TestimoniesRest from "../Actions/Admin/TestimoniesRest";
import BasicEditing from "../Components/Adminto/Basic/BasicEditing";
import DxBox from "../Components/Adminto/Dx/DxBox";
import ImageFormGroup from "../Components/Adminto/form/ImageFormGroup";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import SelectFormGroup from "../Components/Adminto/form/SelectFormGroup";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import ReactAppend from "../Utils/ReactAppend";
import Fillable from "../Utils/Fillable";

const testimoniesRest = new TestimoniesRest();

const Testimonies = ({ countries, details }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const roleRef = useRef();
    const ratingRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();
    const countryRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        // Reset delete flag when opening modal
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        roleRef.current.value = data?.role ?? "";
        ratingRef.current.value = data?.rating ?? "5";
        $(countryRef.current)
            .val(data?.country_id ?? "89")
            .trigger("change");
        descriptionRef.current.value = data?.description ?? "";
        imageRef.image.src = data?.image ? `/storage/images/testimony/${data.image}` : '';
        imageRef.current.value = null;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            country_id: $(countryRef.current).val(),
            country: $(countryRef.current).find("option:selected").text(),
            name: nameRef.current.value,
            role: roleRef.current.value,
            rating: ratingRef.current.value,
            description: descriptionRef.current.value,
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

        const result = await testimoniesRest.save(formData);
        if (!result) return;

        // Reset delete flag after successful save
        if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onVisibleChange = async ({ id, value }) => {
        const result = await testimoniesRest.boolean({
            id,
            field: "visible",
            value,
        });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar testimonio",
            text: "¿Estas seguro de eliminar este testimonio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await testimoniesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title={
                    <BasicEditing correlative="testimonies" details={details} />
                }
                rest={testimoniesRest}
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
                            text: "Nuevo testimonio",
                            hint: "Nuevo testimonio",
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
                        caption: "Autor",
                        cellTemplate: (container, { data }) => {
                            // DevExtreme may give us a jQuery-wrapped element or a plain DOM node.
                            const domElement = container instanceof HTMLElement
                                ? container
                                : (container.get ? container.get(0) : container[0]);
                            // Ensure the container is empty before mounting React.
                            if (domElement) {
                                domElement.innerHTML = '';
                                const root = createRoot(domElement);
                                root.render(
                                    <div className="d-flex align-items-center gap-2">
                                        <img
                                            className="avatar-xs rounded-circle"
                                            src={`/storage/images/testimony/${data.image}`}
                                            alt={data.name}
                                            onError={(e) => {
                                                e.target.onerror = null; // prevent loop
                                                console.error('Image failed to load (admin):', data.image);
                                                e.target.src = '/api/cover/thumbnail/null';
                                            }}
                                        />
                                        <p className="mb-0" style={{ fontSize: '14px' }}>
                                            {data.name}
                                        </p>
                                    </div>
                                );
                            }
                        },
                    },
                    {
                        dataField: "role",
                        caption: "Cargo/Rol",
                        width: "150px",
                    },
                    {
                        dataField: "country",
                        caption: "País",
                        width: "120px",
                    },
                    {
                        dataField: "rating",
                        caption: "Rating",
                        width: "120px",
                        cellTemplate: (container, { data }) => {
                            const stars = '⭐'.repeat(data.rating || 0);
                            container.html(`<span title="${data.rating}/5">${stars}</span>`);
                        },
                    },
                    {
                        dataField: "description",
                        caption: "Testimonio",
                        minWidth: "300px",
                        cellTemplate: (container, { data }) => {
                            const truncate = (text, maxLength = 100) => {
                                if (!text) return '';
                                return text.length > maxLength 
                                    ? text.substring(0, maxLength) + '...' 
                                    : text;
                            };
                            container.html(`<span class="text-muted">${truncate(data.description)}</span>`);
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
                title={isEditing ? "Editar testimonio" : "Agregar testimonio"}
                onSubmit={onModalSubmit}
                size="lg"
            >
                <input ref={idRef} type="hidden" />
                
                <div id="testimony-container">
                    <div className="row g-3">
                        {/* Información del Autor */}
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-user me-2 text-primary"></i>
                                        Información del Autor
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <ImageFormGroup
                                                eRef={imageRef}
                                                name="image"
                                                label="Foto del Autor"
                                                col="col-12"
                                                aspect={1}
                                            />
                                            <small className="text-muted">
                                                <i className="fas fa-info-circle me-1"></i>
                                                Imagen cuadrada 1:1
                                            </small>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="row ">
                                                <div className="col-md-12">
                                                    <InputFormGroup
                                                        eRef={nameRef}
                                                        label="Nombre Completo"
                                                        placeholder="Ej: Juan Pérez"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <InputFormGroup
                                                        eRef={roleRef}
                                                        label="Cargo/Profesión"
                                                        placeholder="Ej: Paciente Operado"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-12">
                                                    <SelectFormGroup
                                                        eRef={countryRef}
                                                        label="País de Origen"
                                                        required
                                                        dropdownParent="#testimony-container"
                                                    >
                                                        {countries.map((country, i) => (
                                                            <option
                                                                key={`country-${i}`}
                                                                value={country.id}
                                                            >
                                                                {country.name}
                                                            </option>
                                                        ))}
                                                    </SelectFormGroup>
                                                </div>
                                                <div className="col-md-12">
                                                    <InputFormGroup
                                                        eRef={ratingRef}
                                                        label="Calificación (1-5 estrellas)"
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        placeholder="5"
                                                        required
                                                    />
                                                  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonio */}
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">
                                        <i className="fas fa-comment-dots me-2 text-success"></i>
                                        Testimonio
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <TextareaFormGroup
                                        eRef={descriptionRef}
                                        label="Descripción del Testimonio"
                                        rows={5}
                                        placeholder="Escribe aquí la experiencia y opinión..."
                                        required
                                    />
                                    <small className="text-muted">
                                        <i className="fas fa-info-circle me-1"></i>
                                        Describe la experiencia completa y detallada
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Testimonios">
            <Testimonies {...properties} />
        </BaseAdminto>
    );
});
