import BaseAdminto from "@Adminto/Base";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import PackagingRest from "../Actions/Admin/PackagingRest";
import Modal from "../Components/Adminto/Modal";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import CreateReactScript from "../Utils/CreateReactScript";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "@Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "@Adminto/form/SwitchFormGroup";
import Swal from "sweetalert2";
import ReactAppend from "../Utils/ReactAppend";

const packagingRest = new PackagingRest();

const Packaging = () => {
    const gridRef = useRef();
    const modalRef = useRef();

    // Form elements ref
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();

    const [isEditing, setIsEditing] = useState(false);

    const onModalOpen = (data) => {
        if (data?.id) setIsEditing(true);
        else setIsEditing(false);

        idRef.current.value = data?.id ?? "";
        nameRef.current.value = data?.name ?? "";
        descriptionRef.current.value = data?.description ?? "";
        priceRef.current.value = data?.price ?? "0.00";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();

        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            price: priceRef.current.value,
        };

        const result = await packagingRest.save(request);
        if (!result) return;

        $(gridRef.current).dxDataGrid("instance").refresh();
        $(modalRef.current).modal("hide");
    };

    const onBooleanChange = async ({ id, field, value }) => {
        const result = await packagingRest.boolean({ id, field, value });
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (row) => {
        const { isConfirmed } = await Swal.fire({
            title: "Eliminar registro",
            text: "¿Estas seguro de eliminar este empaque?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await packagingRest.delete(row.id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Gestión de Empaques"
                rest={packagingRest}
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
                            text: "Nuevo Empaque",
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
                        dataField: "name",
                        caption: "Nombre",
                        width: "25%",
                    },
                    {
                        dataField: "description",
                        caption: "Descripción",
                    },
                    {
                        dataField: "price",
                        caption: "Costo (S/)",
                        dataType: "number",
                        format: "S/ #,##0.00",
                        width: "120px",
                    },

                    {
                        dataField: "visible",
                        caption: "Visible",
                        dataType: "boolean",
                        width: "100px",
                        cellTemplate: (container, { data }) => {
                            $(container).empty();
                            ReactAppend(
                                container,
                                <SwitchFormGroup
                                    checked={data.visible == 1}
                                    onChange={() =>
                                        onBooleanChange({
                                            id: data.id,
                                            field: "visible",
                                            value: !data.visible,
                                        })
                                    }
                                />,
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
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDeleteClicked(data),
                                }),
                            );
                        },
                        width: "100px",
                        allowFiltering: false,
                        allowExporting: false,
                    },
                ]}
            />
            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Empaque" : "Agregar Empaque"}
                onSubmit={onModalSubmit}
            >
                <input ref={idRef} type="hidden" />
                <InputFormGroup
                    eRef={nameRef}
                    label="Nombre del Empaque"
                    placeholder="Ej: Caja de Regalo Premium"
                    required
                />
                <TextareaFormGroup
                    eRef={descriptionRef}
                    label="Descripción"
                    placeholder="Detalles sobre el empaque..."
                    rows={3}
                />
                <InputFormGroup
                    eRef={priceRef}
                    label="Costo Adicional (S/)"
                    type="number"
                    step="0.01"
                    required
                />
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Empaques">
            <Packaging {...properties} />
        </BaseAdminto>,
    );
});
