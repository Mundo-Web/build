import BaseAdminto from "@Adminto/Base";
import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Table from "../Components/Adminto/Table";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency, { CurrencySymbol } from "../Utils/Number2Currency";
import OrdersRest from "../Actions/Provider/OrdersRest";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "../Utils/ReactAppend";
import Modal from "../Components/Adminto/Modal";
import SaleStatusesRest from "../Actions/Admin/SaleStatusesRest";

const ordersRest = new OrdersRest();
const saleStatusesRest = new SaleStatusesRest();
saleStatusesRest.path = "provider/sale-statuses";

const Orders = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [saleLoaded, setSaleLoaded] = useState(null);
    const [saleStatuses, setSaleStatuses] = useState([]);

    const onModalOpen = async (saleId) => {
        const result = await ordersRest.get(saleId);
        if (result && result.status === 200) {
            setSaleLoaded(result.data);
            const statusHistory = await saleStatusesRest.bySale(saleId);
            setSaleStatuses(statusHistory || []);
            $(modalRef.current).modal("show");
        }
    };

    const columns = [
        {
            dataField: "id",
            caption: "ID Pago",
            width: 80,
        },
        {
            dataField: "status.name",
            caption: "Estado",
            dataType: "string",
            cellTemplate: (container, { data }) => {
                const status = data.status;
                ReactAppend(
                    container,
                    <span
                        className="badge"
                        style={{
                            backgroundColor: status?.color || "#98a6ad",
                            color: "white",
                        }}
                    >
                        {status?.name || "Pendiente"}
                    </span>
                );
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
            caption: "Mis Productos",
            cellTemplate: (container, { data }) => {
                const details = data.details || [];
                ReactAppend(
                    container,
                    <div className="d-flex flex-column gap-1">
                        {details.map((detail, index) => (
                            <div key={index} className="d-flex align-items-center gap-2">
                                <img
                                    src={`/storage/images/item/${detail.image}`}
                                    alt={detail.name}
                                    style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}
                                    onError={(e) => (e.target.src = "/images/no-image.png")}
                                />
                                <span style={{ fontSize: '12px' }}>
                                    {detail.name} x {Math.floor(detail.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            },
        },
        {
            caption: "Total Ganancia",
            alignment: "right",
            cellTemplate: (container, { data }) => {
                const details = data.details || [];
                const total = details.reduce((acc, curr) => acc + (curr.provider_price * curr.quantity), 0);
                ReactAppend(container, <b>{Number2Currency(total)}</b>);
            },
        },
        {
            caption: "Acciones",
            width: "80px",
            cellTemplate: (container, { data }) => {
                container.append(
                    DxButton({
                        className: "btn btn-xs btn-soft-primary",
                        title: "Ver detalles",
                        icon: "fa fa-eye",
                        onClick: () => onModalOpen(data.id),
                    }),
                );
            },
            allowFiltering: false,
            allowExporting: false,
        },
    ];

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Pedidos"
                rest={ordersRest}
                columns={columns}
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

            <Modal
                modalRef={modalRef}
                title={`Detalle de Pedido #${saleLoaded?.id}`}
                size="lg"
                hideFooter={true}
            >
                <div className="row">
                    <div className="col-md-8">
                        <div className="card mb-3">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Información del Cliente</h5>
                            </div>
                            <div className="card-body">
                                <table className="table table-sm table-borderless mb-0">
                                    <tbody>
                                        <tr>
                                            <th style={{ width: '150px' }}>Nombres:</th>
                                            <td>{saleLoaded?.fullname}</td>
                                        </tr>
                                        <tr>
                                            <th>Email:</th>
                                            <td>{saleLoaded?.email}</td>
                                        </tr>
                                        <tr>
                                            <th>Teléfono:</th>
                                            <td>{saleLoaded?.phone}</td>
                                        </tr>
                                        <tr>
                                            <th>Dirección:</th>
                                            <td>
                                                {saleLoaded?.address} {saleLoaded?.number}
                                                <small className="d-block text-muted">
                                                    {saleLoaded?.district}, {saleLoaded?.province}, {saleLoaded?.department}
                                                </small>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Mis Productos</h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th className="text-end">Precio Prov.</th>
                                                <th className="text-center">Cant.</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {saleLoaded?.details?.map((detail, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <img
                                                                src={`/storage/images/item/${detail.image}`}
                                                                alt={detail.name}
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                                                onError={(e) => (e.target.src = "/images/no-image.png")}
                                                            />
                                                            <div>
                                                                <div className="fw-bold">{detail.name}</div>
                                                                {detail.colors && <small className="text-muted">{detail.colors}</small>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-end">{CurrencySymbol()} {Number2Currency(detail.provider_price)}</td>
                                                    <td className="text-center">{Math.floor(detail.quantity)}</td>
                                                    <td className="text-end fw-bold">
                                                        {CurrencySymbol()} {Number2Currency(detail.provider_price * detail.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="table-light">
                                            <tr>
                                                <th colSpan="3" className="text-end">Total Ganancia:</th>
                                                <th className="text-end">
                                                    {CurrencySymbol()} {Number2Currency(
                                                        saleLoaded?.details?.reduce((acc, curr) => acc + (curr.provider_price * curr.quantity), 0) || 0
                                                    )}
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card mb-3">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Estado Actual</h5>
                            </div>
                            <div className="card-body text-center">
                                <span
                                    className="badge px-3 py-2 fs-6"
                                    style={{
                                        backgroundColor: saleLoaded?.status?.color || "#98a6ad",
                                        color: "white",
                                    }}
                                >
                                    {saleLoaded?.status?.name || "Pendiente"}
                                </span>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header bg-light">
                                <h5 className="card-title mb-0">Historial de Estados</h5>
                            </div>
                            <div className="card-body p-2">
                                <div className="d-flex flex-column gap-2">
                                    {saleStatuses.map((ss, index) => (
                                        <div key={index} className="border-start border-3 ps-2 py-1" style={{ borderColor: ss.color || '#eee' }}>
                                            <div className="fw-bold" style={{ color: ss.color }}>{ss.name}</div>
                                            <small className="d-block text-muted">
                                                {moment(ss.created_at).format("DD/MM/YYYY HH:mm")}
                                            </small>
                                        </div>
                                    ))}
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
        <BaseAdminto {...properties} title="Mis Pedidos">
            <Orders {...properties} />
        </BaseAdminto>,
    );
});

export default Orders;
