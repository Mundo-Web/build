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
                            container.append(
                                DxBox(
                                    [
                                        <img
                                            className="avatar-xs rounded-circle"
                                            src={`/storage/images/testimony/${data.image}`}
                                            alt={data.name}
                                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                        />,
                                        <p
                                            className="mb-0"
                                            style={{ fontSize: "14px" }}
                                        >
                                            {data.name}
                                        </p>,
                                    ],
                                    false
                                )
                            );
                        },
                    },
                    {
                        dataField: "country",
                        caption: "Pais",
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
                size="md"
            >
                <div className="row" id="testimony-container">
                    <input ref={idRef} type="hidden" />
                    <div className="col-12">
                        <div className="row">
                            <ImageFormGroup
                                eRef={imageRef}
                                name="image"
                                label="Imagen"
                                col="col-sm-4 col-xs-12"
                                aspect={1}
                            />
                            <div className="col-sm-8 col-xs-12">
                                <InputFormGroup
                                    eRef={nameRef}
                                    label="Autor"
                                    required
                                />
                                <InputFormGroup
                                    eRef={roleRef}
                                    label="Cargo/Rol"
                                    required
                                />
                                <SelectFormGroup
                                    eRef={countryRef}
                                    label="Pais"
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
                        </div>
                    </div>
                    <InputFormGroup
                        eRef={ratingRef}
                        label="Rating (1-5)"
                        type="number"
                        min="1"
                        max="5"
                        required
                    />
                    <TextareaFormGroup
                        eRef={descriptionRef}
                        label="Descripción"
                        rows={3}
                        required
                    />
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
