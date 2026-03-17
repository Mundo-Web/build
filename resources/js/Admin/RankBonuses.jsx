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

const bonusRest = new BasicRest();
bonusRest.path = "admin/rank-bonuses";

const RankBonuses = ({ ranks = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [isEditing, setIsEditing] = useState(false);
    const [isGroup, setIsGroup] = useState(true);

    // Form refs
    const idRef = useRef();
    const rankIdRef = useRef();
    const nameRef = useRef();
    const descriptionRef = useRef();
    const typeRef = useRef();
    const triggerTypeRef = useRef();
    const minValueRef = useRef();
    const bonusAmountRef = useRef();

    const onModalOpen = (data) => {
        setIsEditing(!!data?.id);
        setIsGroup(data?.is_group ?? true);
        
        idRef.current.value = data?.id || "";
        rankIdRef.current.value = data?.rank_id || "";
        nameRef.current.value = data?.name || "";
        descriptionRef.current.value = data?.description || "";
        typeRef.current.value = data?.type || "items";
        triggerTypeRef.current.value = data?.trigger_type || "volume";
        minValueRef.current.value = data?.min_value || 0;
        bonusAmountRef.current.value = data?.bonus_amount || 0;

        $(modalRef.current).modal("show");
    };

    const onModalSubmit = async (e) => {
        e.preventDefault();
        const request = {
            id: idRef.current.value || undefined,
            rank_id: rankIdRef.current.value || null,
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            type: typeRef.current.value,
            trigger_type: triggerTypeRef.current.value,
            is_group: isGroup,
            min_value: minValueRef.current.value,
            bonus_amount: bonusAmountRef.current.value,
        };

        const result = await bonusRest.save(request);
        if (result) {
            $(modalRef.current).modal("hide");
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
    };

    const onDelete = async (id) => {
        const result = await bonusRest.delete(id);
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onStatusChange = async ({ id, value }) => {
        const result = await bonusRest.status({ id, status: value });
        if (result) $(gridRef.current).dxDataGrid("instance").refresh();
    };

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Configuración de Bonos Extra (Metas)"
                rest={bonusRest}
                withRelations="rank"
                toolBar={(container) => {
                    container.unshift({
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "plus",
                            text: "Nuevo Bono",
                            onClick: () => onModalOpen(),
                        },
                    });
                }}
                columns={[
                    {
                        dataField: "name",
                        caption: "Nombre del Bono",
                    },
                    {
                        dataField: "rank.name",
                        caption: "Rango Requerido",
                        cellTemplate: (container, { data }) => {
                            $(container).text(data.rank?.name || 'Cualquiera');
                        }
                    },
                    {
                        dataField: "trigger_type",
                        caption: "Disparador",
                        cellTemplate: (container, { data }) => {
                            const isAttainment = data.trigger_type === 'attainment';
                            $(container).html(
                                `<span class="badge badge-soft-${isAttainment ? "primary" : "info"}">${isAttainment ? "Al Subir Rango" : "Por Volumen"}</span>`,
                            );
                        }
                    },
                    {
                        dataField: "min_value",
                        caption: "Meta",
                        cellTemplate: (container, { data }) => {
                            if (data.trigger_type === 'attainment') return container.text('N/A');
                            container.text(`${data.min_value} ${data.type === 'items' ? 'prendas' : 'puntos'}`);
                        }
                    },
                    {
                        dataField: "is_group",
                        caption: "Ámbito",
                        cellTemplate: (container, { data }) => {
                            $(container).html(
                                `<span class="badge badge-soft-${data.is_group ? "warning" : "secondary"}">${data.is_group ? "Grupal" : "Personal"}</span>`,
                            );
                        },
                    },
                    {
                        dataField: "bonus_amount",
                        caption: "Premio (S/.)",
                        cellTemplate: (container, { data }) => {
                            container.text(`S/ ${parseFloat(data.bonus_amount).toLocaleString()}`);
                        }
                    },
                    {
                        dataField: "status",
                        caption: "Estado",
                        dataType: "boolean",
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
                title={isEditing ? "Editar Bono" : "Crear Bono"}
                onSubmit={onModalSubmit}
            >
                <input type="hidden" ref={idRef} />
                <div className="row g-3">
                    <div className="col-12">
                        <InputFormGroup eRef={nameRef} label="Nombre del Bono" required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Rango Requerido</label>
                        <select className="form-select" ref={rankIdRef}>
                            <option value="">Cualquiera</option>
                            {ranks.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Tipo Disparador</label>
                        <select className="form-select" ref={triggerTypeRef}>
                            <option value="volume">Por Volumen (Meta mensual)</option>
                            <option value="attainment">Al subir de Rango (Único)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Tipo Meta</label>
                        <select className="form-select" ref={typeRef}>
                            <option value="items">Prendas</option>
                            <option value="amount">Puntos (S/.)</option>
                        </select>
                    </div>
                    <div className="col-sm-6 align-self-end">
                        <SwitchFormGroup checked={isGroup} onChange={setIsGroup} label="Meta Grupal" />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup eRef={minValueRef} label="Valor Meta (0 si es al subir)" type="number" />
                    </div>
                    <div className="col-sm-6">
                        <InputFormGroup eRef={bonusAmountRef} label="Monto Bono (S/.)" type="number" step="0.01" required />
                    </div>
                    <div className="col-12">
                        <TextareaFormGroup eRef={descriptionRef} label="Descripción" rows={2} />
                    </div>
                </div>
            </Modal>
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Bonos Extras">
            <RankBonuses {...properties} />
        </BaseAdminto>,
    );
});
