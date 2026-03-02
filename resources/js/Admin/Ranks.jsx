import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import Modal from "../Components/Adminto/Modal";
import InputFormGroup from "../Components/Adminto/form/InputFormGroup";
import TextareaFormGroup from "../Components/Adminto/form/TextareaFormGroup";
import SwitchFormGroup from "../Components/Adminto/form/SwitchFormGroup";
import BasicRest from "../Actions/BasicRest";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";

const ranksRest = new BasicRest();
ranksRest.path = "admin/ranks";

const Ranks = ({}) => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [isEditing, setIsEditing] = useState(false);

    // Form refs
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const requirementTypeRef = useRef();
    const isGroupRef = useRef();
    const minPointsRef = useRef();
    const commissionPercentRef = useRef();
    const prizeCommissionPercentRef = useRef();
    const colorRef = useRef();

    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);
        idRef.current.value = data?.id || "";
        nameRef.current.value = data?.name || "";
        descriptionRef.current.value = data?.description || "";
        requirementTypeRef.current.value = data?.requirement_type || "amount";
        isGroupRef.current.checked = data?.is_group || false;
        minPointsRef.current.value = data?.min_points || 0;
        commissionPercentRef.current.value = data?.commission_percent || 0;
        prizeCommissionPercentRef.current.value =
            data?.prize_commission_percent || 100;
        colorRef.current.value = data?.color || "#3bafda";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        const request = {
            id: idRef.current.value || undefined,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            requirement_type: requirementTypeRef.current.value,
            is_group: isGroupRef.current.checked,
            min_points: minPointsRef.current.value,
            commission_percent: commissionPercentRef.current.value,
            prize_commission_percent: prizeCommissionPercentRef.current.value,
            color: colorRef.current.value,
        };

        const result = await ranksRest.save(request);
        if (result) {
            $(modalRef.current).modal("hide");
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
    };

    const onDelete = async (id) => {
        const result = await ranksRest.delete(id);
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await ranksRest.status({ id, status: value });
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Configuración de Rangos"
                rest={ranksRest}
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
                            text: "Nuevo Rango",
                            hint: "Crear un nuevo rango para el plan de carrera",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "order_index",
                        caption: "Orden",
                        dataType: "number",
                        width: 80,
                        sortOrder: "asc",
                    },
                    {
                        dataField: "name",
                        caption: "Nombre",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center">
                                    <span
                                        className="badge rounded-circle p-1 me-2"
                                        style={{
                                            backgroundColor: data.color,
                                            width: "12px",
                                            height: "12px",
                                            border: "1px solid #ddd",
                                        }}
                                    ></span>
                                    <span className="fw-bold">{data.name}</span>
                                </div>,
                            );
                        },
                    },
                    {
                        dataField: "requirement_type",
                        caption: "Tipo Requisito",
                        width: 120,
                        cellTemplate: (container, { data }) => {
                            const isItems = data.requirement_type === "items";
                            $(container).html(
                                `<span class="badge badge-soft-${isItems ? "primary" : "info"}">${isItems ? "Prendas" : "Soles (S/.)"}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "is_group",
                        caption: "Ámbito",
                        width: 100,
                        cellTemplate: (container, { data }) => {
                            $(container).html(
                                `<span class="badge badge-soft-${data.is_group ? "warning" : "secondary"}">${data.is_group ? "Grupal" : "Personal"}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "min_points",
                        caption: "Meta a Cumplir",
                        dataType: "number",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            const isItems = data.requirement_type === "items";
                            container.text(
                                `${isItems ? "" : "S/ "}${parseFloat(data.min_points || 0).toLocaleString()} ${isItems ? "prendas" : ""}`,
                            );
                        },
                    },
                    {
                        dataField: "commission_percent",
                        caption: "% Comisión Venta",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span className="badge badge-soft-info">
                                    {data.commission_percent}%
                                </span>,
                            );
                        },
                    },
                    {
                        dataField: "prize_commission_percent",
                        caption: "% Comisión Bono/Premio",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span className="badge badge-soft-success">
                                    {data.prize_commission_percent}%
                                </span>,
                            );
                        },
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
                        width: 100,
                        cellTemplate: (container, { data }) => {
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
                        width: 120,
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    title: "Editar",
                                    icon: "fa fa-pencil",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
                                    title: "Eliminar",
                                    icon: "fa fa-trash",
                                    onClick: () => onDelete(data.id),
                                }),
                            );
                        },
                    },
                ]}
            />

            <Modal
                modalRef={modalRef}
                title={isEditing ? "Editar Rango" : "Crear Rango"}
                onSubmit={onModalSubmit}
                size="md"
            >
                <input type="hidden" ref={idRef} />
                <div className="row g-3">
                    <div className="col-12">
                        <InputFormGroup
                            eRef={nameRef}
                            label="Nombre del Rango"
                            placeholder="Ej: Junior, Senior, Master..."
                            required
                        />
                    </div>
                    <div className="col-12">
                        <TextareaFormGroup
                            eRef={descriptionRef}
                            label="Descripción (Opcional)"
                            rows={2}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Tipo de Requisito</label>
                        <select
                            className="form-select"
                            ref={requirementTypeRef}
                            required
                        >
                            <option value="amount">Soles (S/.)</option>
                            <option value="items">Prendas (Und)</option>
                        </select>
                    </div>
                    <div className="col-sm-6 align-self-end">
                        <SwitchFormGroup
                            eRef={isGroupRef}
                            label="Meta Grupal (incluye referidos)"
                        />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup
                            eRef={minPointsRef}
                            label="Meta a alcanzar (S/ o Und)"
                            type="number"
                            required
                        />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup
                            eRef={colorRef}
                            label="Color Distintivo"
                            type="color"
                            required
                        />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup
                            eRef={commissionPercentRef}
                            label="% Comis. Venta Normal"
                            type="number"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup
                            eRef={prizeCommissionPercentRef}
                            label="% Comis. Venta Bono/Premio"
                            type="number"
                            step="0.01"
                            required
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Configuración de Rangos">
            <Ranks {...properties} />
        </BaseAdminto>,
    );
});
