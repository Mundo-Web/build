import React, { useRef, useState, useEffect } from "react";
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
    const [isGroup, setIsGroup] = useState(false);

    // Form refs
    const idRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const requirementTypeRef = useRef();
    const minPersonalRef = useRef();
    const minGroupRef = useRef();
    const requirementLogicRef = useRef();
    const commissionPercentRef = useRef();
    const prizeCommissionPercentRef = useRef();
    const bonusAmountRef = useRef();
    const benefitsRef = useRef();
    const colorRef = useRef();

    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);
        setIsGroup(data?.is_group || false);
        
        if (idRef.current) idRef.current.value = data?.id || "";
        if (nameRef.current) nameRef.current.value = data?.name || "";
        if (descriptionRef.current) descriptionRef.current.value = data?.description || "";
        if (requirementTypeRef.current) requirementTypeRef.current.value = data?.requirement_type || "items";
        if (minPersonalRef.current) minPersonalRef.current.value = data?.min_personal_items || 0;
        if (minGroupRef.current) minGroupRef.current.value = data?.min_group_items || 0;
        if (requirementLogicRef.current) requirementLogicRef.current.value = data?.requirement_logic || "OR";
        if (commissionPercentRef.current) commissionPercentRef.current.value = data?.commission_percent || 0;
        if (prizeCommissionPercentRef.current) prizeCommissionPercentRef.current.value = data?.prize_commission_percent || 100;
        if (bonusAmountRef.current) bonusAmountRef.current.value = data?.bonus_amount || 0;
        if (benefitsRef.current) benefitsRef.current.value = Array.isArray(data?.benefits) ? data.benefits.join("\n") : "";
        if (colorRef.current) colorRef.current.value = data?.color || "#3bafda";

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        const request = {
            id: idRef.current?.value || undefined,
            name: nameRef.current?.value,
            description: descriptionRef.current?.value,
            requirement_type: requirementTypeRef.current?.value,
            is_group: isGroup,
            min_personal_items: minPersonalRef.current?.value,
            min_group_items: minGroupRef.current?.value,
            requirement_logic: requirementLogicRef.current?.value,
            commission_percent: commissionPercentRef.current?.value,
            prize_commission_percent: prizeCommissionPercentRef.current?.value,
            bonus_amount: bonusAmountRef.current?.value,
            benefits: benefitsRef.current?.value.split("\n").filter(b => b.trim() !== ""),
            color: colorRef.current?.value,
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
                title="Configuración de Plan de Carrera (Rangos)"
                rest={ranksRest}
                withRelations="rankBonuses"
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "refresh",
                            hint: "Refrescar tabla",
                            onClick: () => $(gridRef.current).dxDataGrid("instance").refresh(),
                        },
                    });
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Nuevo Rango",
                            hint: "Añadir un nuevo nivel al plan de carrera",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "order_index",
                        caption: "#",
                        dataType: "number",
                        width: 50,
                        sortOrder: "asc",
                        alignment: "center"
                    },
                    {
                        dataField: "name",
                        caption: "Rango",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <div className="d-flex align-items-center">
                                    <span
                                        className="badge rounded-circle p-1 me-2"
                                        style={{
                                            backgroundColor: data.color,
                                            width: "14px",
                                            height: "14px",
                                            border: "2px solid #fff",
                                            boxShadow: "0 0 4px rgba(0,0,0,0.2)"
                                        }}
                                    ></span>
                                    <div>
                                        <div className="fw-bold text-dark">{data.name}</div>
                                        <small className="text-muted" style={{ fontSize: '10px' }}>{data.description}</small>
                                    </div>
                                </div>,
                            );
                        },
                    },
                    {
                        caption: "Metas Requeridas",
                        width: 180,
                        cellTemplate: (container, { data }) => {
                            const unit = data.requirement_type === 'items' ? 'prendas' : 'puntos';
                            const parts = [];
                            if (parseFloat(data.min_personal_items) > 0) parts.push(`Pers: ${data.min_personal_items}`);
                            if (parseFloat(data.min_group_items) > 0) parts.push(`Grup: ${data.min_group_items}`);
                            
                            const text = parts.length > 1 ? parts.join(` ${data.requirement_logic} `) : (parts[0] || 'Inicia');
                            $(container).html(`<span class="badge badge-outline-secondary">${text} ${unit}</span>`);
                        }
                    },
                    {
                        caption: "Bonos Extra (Grupales)",
                        cellTemplate: (container, { data }) => {
                            const bonuses = data.rank_bonuses || [];
                            if (bonuses.length === 0) return container.text('-');
                            
                            const html = bonuses.map(b => 
                                `<div class="text-success small fw-bold">+ S/ ${parseFloat(b.bonus_amount).toLocaleString()} (${b.min_value} ${b.type === 'items' ? 'prendas' : 'puntos'})</div>`
                            ).join('');
                            $(container).html(html);
                        }
                    },
                    {
                        dataField: "commission_percent",
                        caption: "% Comisión",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(container, <span className="badge badge-soft-info">{data.commission_percent}%</span>);
                        },
                    },
                    {
                        dataField: "bonus_amount",
                        caption: "Bono Fijo",
                        alignment: "center",
                        cellTemplate: (container, { data }) => {
                            container.text(data.bonus_amount > 0 ? `S/ ${data.bonus_amount}` : '-');
                        }
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
                                    onChange={() => onStatusChange({ id: data.id, value: !data.status })}
                                />,
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        width: 100,
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-primary",
                                    icon: "fa fa-pencil",
                                    onClick: () => onModalOpen(data),
                                }),
                            );
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-soft-danger",
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
                size="lg"
            >
                <input type="hidden" ref={idRef} />
                <div className="row g-3">
                    <div className="col-md-8">
                        <InputFormGroup eRef={nameRef} label="Nombre del Rango" required />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup eRef={colorRef} label="Color" type="color" required />
                    </div>
                    
                    <div className="col-md-6">
                        <label className="form-label">Tipo de Unidad</label>
                        <select className="form-select" ref={requirementTypeRef}>
                            <option value="items">Prendas (Unidades)</option>
                            <option value="amount">Ventas (Soles S/.)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Lógica de Requisito</label>
                        <select className="form-select" ref={requirementLogicRef}>
                            <option value="OR">Cualquiera (Personal O Grupal)</option>
                            <option value="AND">Ambos (Personal Y Grupal)</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <InputFormGroup eRef={minPersonalRef} label="Meta Personal" type="number" step="0.01" />
                    </div>
                    <div className="col-md-6">
                        <InputFormGroup eRef={minGroupRef} label="Meta Grupal (Equipo)" type="number" step="0.01" />
                    </div>

                    <div className="col-md-4">
                        <InputFormGroup eRef={commissionPercentRef} label="% Comis. Venta" type="number" step="0.01" required />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup eRef={prizeCommissionPercentRef} label="% Comis. Bono" type="number" step="0.01" required />
                    </div>
                    <div className="col-md-4">
                        <InputFormGroup eRef={bonusAmountRef} label="Bono Fijo (S/.)" type="number" step="0.01" />
                    </div>
                    <div className="col-md-4 align-self-end">
                        <SwitchFormGroup 
                            checked={isGroup} 
                            onChange={setIsGroup} 
                            label="Meta Grupal Principal?" 
                            refreshable={isEditing}
                        />
                    </div>

                    <div className="col-12">
                        <TextareaFormGroup eRef={benefitsRef} label="Beneficios Extra (Uno por línea)" rows={3} />
                    </div>
                    <div className="col-12">
                        <TextareaFormGroup eRef={descriptionRef} label="Descripción Interna" rows={2} />
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
