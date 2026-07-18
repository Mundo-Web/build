import BaseAdminto from "@Adminto/Base";
import React, { useRef, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Table from "../Components/Adminto/Table";
import CreateReactScript from "../Utils/CreateReactScript";
import Number2Currency, { CurrencySymbol } from "../Utils/Number2Currency";
import OrdersRest from "../Actions/Provider/OrdersRest";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "../Utils/ReactAppend";
import Modal from "../Components/Adminto/Modal";
import SaleStatusesRest from "../Actions/Admin/SaleStatusesRest";
import Swal from "sweetalert2";
import Global from "../Utils/Global";

const ordersRest = new OrdersRest();
const saleStatusesRest = new SaleStatusesRest();
saleStatusesRest.path = "provider/sale-statuses";

const Orders = () => {
    const gridRef = useRef();
    const modalRef = useRef();
    const [saleLoaded, setSaleLoaded] = useState(null);
    const [saleStatuses, setSaleStatuses] = useState([]);
    const [allowedStatuses, setAllowedStatuses] = useState([]);

    useEffect(() => {
        // Cargar los estados permitidos para el rol de este usuario
        fetch("/api/sale-statuses/allowed", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res && res.data) {
                    setAllowedStatuses(res.data);
                }
            })
            .catch(err => console.error("Error loading allowed statuses:", err));
    }, []);

    const onModalOpen = async (saleId) => {
        const result = await ordersRest.get(saleId);
        if (result && result.status === 200) {
            setSaleLoaded(result.data);
            const statusHistory = await saleStatusesRest.bySale(saleId);
            setSaleStatuses(statusHistory || []);
            $(modalRef.current).modal("show");
        }
    };

    const handleStatusChange = async (saleId, statusId, statusName) => {
        const { isConfirmed } = await Swal.fire({
            title: `¿Cambiar estado a ${statusName}?`,
            text: `Esta acción registrará el cambio de estado de este pedido a '${statusName}'.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#6f42c1",
            cancelButtonColor: "#6c757d",
        });

        if (!isConfirmed) return;

        const result = await ordersRest.status({ id: saleId, status: statusId });
        if (result) {
            Swal.fire({
                title: "¡Excelente!",
                text: `El pedido ha sido actualizado a '${statusName}' correctamente.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            // Si el modal está abierto con este pedido, recargar datos
            if (saleLoaded && saleLoaded.id === saleId) {
                const newSale = await ordersRest.get(saleId);
                if (newSale && newSale.status === 200) {
                    setSaleLoaded(newSale.data);
                }
                const statusHistory = await saleStatusesRest.bySale(saleId);
                setSaleStatuses(statusHistory || []);
            }

            // Recargar tabla principal
            $(gridRef.current).dxDataGrid("instance").refresh();
        }
    };

    const columns = [
        {
            dataField: "code",
            caption: "Pedido",
            width: 120,
            cellTemplate: (container, { data }) => {
                container.text(`#${Global.APP_CORRELATIVE}-${data.code}`);
            }
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
            width: "120px",
            cellTemplate: (container, { data }) => {
                const $wrapper = $("<div>").addClass("d-flex gap-1 justify-content-center");

                $wrapper.append(
                    DxButton({
                        className: "btn btn-xs btn-soft-primary",
                        title: "Ver detalles",
                        icon: "fa fa-eye",
                        onClick: () => onModalOpen(data.id),
                    })
                );

                // Renderizar botones para los estados permitidos que no sean el actual
                if (data.status) {
                    const currentStatusName = data.status.name;
                    const finalStatuses = ["Entregado", "Anulado", "Rechazado"];
                    if (!finalStatuses.includes(currentStatusName)) {
                        allowedStatuses
                            .filter(status => status.name !== currentStatusName)
                            .forEach(status => {
                                const $btn = DxButton({
                                    className: "btn btn-xs",
                                    title: status.name,
                                    icon: status.icon || "mdi mdi-checkbox-blank-circle",
                                    onClick: () => handleStatusChange(data.id, status.id, status.name),
                                });

                                $btn.css({
                                    backgroundColor: status.color ? `${status.color}1a` : "rgba(0,0,0,0.05)",
                                    color: status.color || "#333",
                                    borderColor: status.color ? `${status.color}33` : "rgba(0,0,0,0.1)",
                                    borderWidth: "1px",
                                    borderStyle: "solid"
                                });

                                $wrapper.append($btn);
                            });
                    }
                }

                container.append($wrapper);
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
                title={saleLoaded ? `Detalle de Pedido #${Global.APP_CORRELATIVE}-${saleLoaded.code}` : "Detalle de Pedido"}
                size="xl"
                hideFooter={true}
            >
                <div className="row">
                    <div className="col-md-8">
                        {/* Información del Cliente */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div className="card-header bg-transparent border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    <i className="mdi mdi-account-outline text-primary fs-4"></i>
                                    Información del Cliente
                                </h5>
                            </div>
                            <div className="card-body py-3">
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Cliente</small>
                                        <span className="fw-semibold text-dark fs-6">{saleLoaded?.fullname}</span>
                                    </div>
                                    <div className="col-sm-6">
                                        <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Email</small>
                                        <span className="text-dark">{saleLoaded?.email}</span>
                                    </div>
                                    <div className="col-sm-6">
                                        <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Teléfono</small>
                                        <span className="text-dark">{saleLoaded?.phone}</span>
                                    </div>
                                    <div className="col-sm-6">
                                        <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>Dirección de Entrega</small>
                                        <span className="text-dark d-block" style={{ fontSize: "13px" }}>
                                            {saleLoaded?.address} {saleLoaded?.number}
                                            <span className="d-block text-muted mt-1" style={{ fontSize: "11px" }}>
                                                {saleLoaded?.district}, {saleLoaded?.province}, {saleLoaded?.department}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detalle de Productos */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div className="card-header bg-transparent border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    <i className="mdi mdi-package-variant-closed text-primary fs-4"></i>
                                    Productos en este Pedido
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="py-3 px-4 text-muted fw-bold text-uppercase" style={{ fontSize: "11px" }}>Producto</th>
                                                <th className="py-3 text-end text-muted fw-bold text-uppercase" style={{ fontSize: "11px", width: "120px" }}>Precio Prov.</th>
                                                <th className="py-3 text-center text-muted fw-bold text-uppercase" style={{ fontSize: "11px", width: "80px" }}>Cant.</th>
                                                <th className="py-3 px-4 text-end text-muted fw-bold text-uppercase" style={{ fontSize: "11px", width: "120px" }}>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {saleLoaded?.details?.map((detail, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <img
                                                                src={`/storage/images/item/${detail.image}`}
                                                                alt={detail.name}
                                                                style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: "1px solid #f1f5f9" }}
                                                                onError={(e) => (e.target.src = "/images/no-image.png")}
                                                            />
                                                            <div>
                                                                <span className="fw-semibold text-dark d-block" style={{ fontSize: "13px" }}>{detail.name}</span>
                                                                {detail.colors && (
                                                                    <span className="badge bg-light text-muted mt-1" style={{ fontSize: "10px", fontWeight: "normal" }}>
                                                                        {detail.colors}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-end text-dark font-monospace text-nowrap py-3">{CurrencySymbol()} {Number2Currency(detail.provider_price)}</td>
                                                    <td className="text-center fw-semibold text-dark py-3">{Math.floor(detail.quantity)}</td>
                                                    <td className="text-end text-dark font-monospace fw-bold text-nowrap px-4 py-3">
                                                        {CurrencySymbol()} {Number2Currency(detail.provider_price * detail.quantity)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-light border-top">
                                            <tr>
                                                <th colSpan="3" className="text-end py-3 px-4 text-muted text-uppercase" style={{ fontSize: "11px" }}>Total Ganancia:</th>
                                                <th className="text-end text-primary font-monospace fw-black fs-5 text-nowrap py-3 px-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
                        {/* Estado Actual */}
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div className="card-header bg-transparent border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    <i className="mdi mdi-flag-outline text-primary fs-4"></i>
                                    Estado Actual
                                </h5>
                            </div>
                            <div className="card-body text-center py-4 d-flex flex-column align-items-center gap-3">
                                <span
                                    className="badge px-4 py-2 fs-6 rounded-pill w-100 shadow-xs"
                                    style={{
                                        backgroundColor: saleLoaded?.status?.color ? `${saleLoaded.status.color}15` : "#f3f4f6",
                                        color: saleLoaded?.status?.color || "#6b7280",
                                        border: `1px solid ${saleLoaded?.status?.color ? `${saleLoaded.status.color}33` : "#e5e7eb"}`,
                                        fontWeight: "700"
                                    }}
                                >
                                    <i className={`mdi ${saleLoaded?.status?.icon || "mdi-checkbox-blank-circle"} me-1`}></i>
                                    {saleLoaded?.status?.name || "Pendiente"}
                                </span>

                                {saleLoaded && !["Entregado", "Anulado", "Rechazado"].includes(saleLoaded.status?.name) && allowedStatuses.filter(status => status.id !== saleLoaded.status_id).length > 0 && (
                                    <div className="w-100 text-start mt-3 border-top pt-3">
                                        <small className="text-muted fw-bold text-uppercase d-block mb-2" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                                            Acciones Disponibles:
                                        </small>
                                        <div className="d-flex flex-column gap-2">
                                            {allowedStatuses
                                                .filter(status => status.id !== saleLoaded.status_id)
                                                .map(status => (
                                                    <button
                                                        key={status.id}
                                                        onClick={() => handleStatusChange(saleLoaded.id, status.id, status.name)}
                                                        className="btn btn-sm w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 transition-all shadow-sm"
                                                        style={{
                                                            backgroundColor: status.color || "#6c757d",
                                                            borderColor: status.color || "#6c757d",
                                                            color: "white",
                                                            fontFamily: "'Outfit', sans-serif",
                                                            fontWeight: "600",
                                                            padding: "10px 16px",
                                                            fontSize: "12px"
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.filter = "brightness(0.9)";
                                                            e.currentTarget.style.transform = "translateY(-1px)";
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.filter = "none";
                                                            e.currentTarget.style.transform = "translateY(0)";
                                                        }}
                                                    >
                                                        <i className={`mdi ${status.icon || "mdi-checkbox-blank-circle"} fs-5`}></i>
                                                        Marcar como "{status.name}"
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Seguimiento / Historial */}
                        <div className="card border-0 shadow-sm" style={{ borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <div className="card-header bg-transparent border-bottom py-3">
                                <h5 className="mb-0 fw-bold text-dark d-flex align-items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    <i className="mdi mdi-history text-primary fs-4"></i>
                                    Seguimiento
                                </h5>
                            </div>
                            <div className="card-body py-4 px-3 d-flex flex-column gap-3">
                                {saleStatuses && saleStatuses.length > 0 ? (
                                    saleStatuses.map((ss, index) => (
                                        <article
                                            key={index}
                                            className="border py-2 px-3 ms-4 position-relative"
                                            style={{
                                                borderRadius: "12px 4px 4px 12px",
                                                backgroundColor: ss.color ? `${ss.color}0d` : "#3333330d",
                                                borderColor: ss.color ? `${ss.color}22` : "#33333322",
                                                borderStyle: "solid",
                                                borderWidth: "1px"
                                            }}
                                        >
                                            {/* Linea vertical conectora */}
                                            {index < saleStatuses.length - 1 && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        left: "-18px",
                                                        top: "20px",
                                                        bottom: "-25px",
                                                        width: "2px",
                                                        backgroundColor: "#e2e8f0"
                                                    }}
                                                ></div>
                                            )}
                                            <i
                                                className={`${ss.icon || "mdi mdi-checkbox-blank-circle"} left-2`}
                                                style={{
                                                    color: ss.color || "#333",
                                                    position: "absolute",
                                                    left: "-25px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    fontSize: "14px",
                                                    background: "white",
                                                    borderRadius: "50%",
                                                    padding: "2px"
                                                }}
                                            ></i>
                                            <b style={{ color: ss.color || "#333", fontFamily: "'Outfit', sans-serif", fontSize: "13px" }}>
                                                {ss?.name}
                                            </b>
                                            <small className="d-block text-muted mt-1" style={{ fontSize: "11px" }}>
                                                {moment(ss.created_at).format("DD/MM/YYYY hh:mm A")}
                                            </small>
                                        </article>
                                    ))
                                ) : (
                                    <div className="text-center text-muted py-3">
                                        No hay historial disponible.
                                    </div>
                                )}
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
