import BaseAdminto from "@Adminto/Base";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import Table from "../Components/Adminto/Table";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency from "../Utils/Number2Currency";
import EarningsRest from "../Actions/Provider/EarningsRest";
import ReactAppend from "../Utils/ReactAppend";
import DxButton from "../Components/dx/DxButton";

const earningsRest = new EarningsRest();

const Earnings = () => {
    const gridRef = useRef();

    const columns = [
        {
            dataField: "id",
            caption: "ID",
            width: 80,
        },
        {
            dataField: "sale_id",
            caption: "ID Pago",
            width: 80,
            cellTemplate: (container, { data }) => {
                ReactAppend(container, <span>#{data.sale_id}</span>);
            }
        },
        {
            dataField: "description",
            caption: "Concepto",
            dataType: "string",
        },
        {
            dataField: "amount",
            caption: "Monto",
            dataType: "number",
            cellTemplate: (container, { data }) => {
                ReactAppend(container, <b>{Number2Currency(data.amount)}</b>);
            },
        },
        {
            dataField: "created_at",
            caption: "Fecha",
            dataType: "datetime",
            format: "dd/MM/yyyy HH:mm",
            sortOrder: "desc",
        },
        {
            dataField: "is_paid",
            caption: "Estado Pago",
            dataType: "boolean",
            cellTemplate: (container, { data }) => {
                const isPaid = data.is_paid == 1;
                ReactAppend(
                    container,
                    isPaid ? (
                        <span className="badge bg-success">Pagado</span>
                    ) : (
                        <span className="badge bg-warning text-dark">Pendiente</span>
                    )
                );
            },
        },
    ];

    return (
        <Table
            gridRef={gridRef}
            title="Ganancias"
            rest={earningsRest}
            columns={columns}
            summary={{
                totalItems: [
                    {
                        column: "amount",
                        summaryType: "sum",
                        displayFormat: "Total: {0}",
                        valueFormat: "currency",
                    },
                ],
            }}
            toolBar={(container) => {
                container.unshift({
                    widget: "dxButton",
                    location: "after",
                    options: {
                        icon: "refresh",
                        hint: "Refrescar",
                        onClick: () => $(gridRef.current).dxDataGrid("instance").refresh(),
                    },
                });
            }}
        />
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mis Ganancias">
            <Earnings {...properties} />
        </BaseAdminto>,
    );
});

export default Earnings;
