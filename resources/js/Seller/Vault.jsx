import BaseAdminto from "@Adminto/Base";
import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import Table from "../Components/Adminto/Table";
import CreateReactScript from "../Utils/CreateReactScript";
import BasicRest from "../Actions/BasicRest";
import ReactAppend from "../Utils/ReactAppend";

class VaultRest extends BasicRest {
    path = "seller/vault";
}

const vaultRest = new VaultRest();

const Vault = () => {
    const gridRef = useRef();

    return (
        <Table
            gridRef={gridRef}
            title="Mi Inventario"
            rest={vaultRest}
            pageSize={10}
            toolBar={(container) => {
                container.unshift({
                    widget: "dxButton",
                    location: "after",
                    options: {
                        icon: "refresh",
                        hint: "Refrescar inventario",
                        onClick: () =>
                            $(gridRef.current).dxDataGrid("instance").refresh(),
                    },
                });
            }}
            columns={[
                {
                    dataField: "item.name",
                    caption: "Producto / Premio",
                    width: "40%",
                    cellTemplate: (container, { data }) => {
                        ReactAppend(
                            container,
                            <div className="d-flex align-items-center py-2">
                                <div className="flex-shrink-0 me-3">
                                    <div
                                        className="avatar-sm bg-soft-success rounded-circle d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    >
                                        <i className="fas fa-gift text-success fs-5"></i>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">
                                        {data.item?.name}
                                    </h6>
                                    <small className="text-muted">
                                        {data.item?.category?.name ||
                                            "Premio Especial"}
                                    </small>
                                </div>
                            </div>,
                        );
                    },
                },
                {
                    dataField: "item.sku",
                    caption: "SKU / Referencia",
                    alignment: "center",
                    width: "20%",
                    cellTemplate: (container, { data }) => {
                        $(container).html(
                            `<span class="badge bg-light text-dark border font-monospace">${data.item?.sku || data.item_id.substring(0, 8)}</span>`,
                        );
                    },
                },
                {
                    dataField: "quantity",
                    caption: "Stock Disponible",
                    alignment: "center",
                    width: "20%",
                    cellTemplate: (container, { data }) => {
                        const colorClass =
                            data.quantity > 0 ? "bg-success" : "bg-danger";
                        const iconClass =
                            data.quantity > 0
                                ? "fa-layer-group"
                                : "fa-exclamation-triangle";
                        $(container).html(`
                                <span class="badge ${colorClass} rounded-pill px-3 py-2 shadow-sm">
                                    <i class="fas ${iconClass} me-1"></i>
                                    ${data.quantity} unidades
                                </span>
                            `);
                    },
                },
                {
                    dataField: "status",
                    caption: "Estado",
                    alignment: "center",
                    width: "20%",
                    cellTemplate: (container, { data }) => {
                        if (data.quantity > 0) {
                            $(container).html(`
                                    <span class="badge bg-soft-success text-success border border-success border-opacity-25 px-3 py-1">
                                        <i class="fas fa-check-circle me-1"></i> Disponible
                                    </span>
                                `);
                        } else {
                            $(container).html(`
                                    <span class="badge bg-soft-danger text-danger border border-danger border-opacity-25 px-3 py-1">
                                        <i class="fas fa-times-circle me-1"></i> Agotado
                                    </span>
                                `);
                        }
                    },
                },
            ]}
        />
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <BaseAdminto {...properties} title="Mi Bóveda">
            <Vault {...properties} />
        </BaseAdminto>,
    );
});
