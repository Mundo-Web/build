import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import BaseAdminto from "@Adminto/Base";
import CreateReactScript from "../Utils/CreateReactScript";
import Table from "../Components/Adminto/Table";
import DxButton from "../Components/dx/DxButton";
import ReactAppend from "../Utils/ReactAppend";
import Swal from "sweetalert2";
import OrdersRest from "../Actions/Seller/OrdersRest";
import Global from "../Utils/Global";
import Number2Currency, { CurrencySymbol } from "../Utils/Number2Currency";
import Modal from "../Components/Adminto/Modal";
import Tippy from "@tippyjs/react";
import SaleStatusesRest from "../Actions/Seller/SaleStatusesRest";

const salesRest = new OrdersRest();
const saleStatusesRest = new SaleStatusesRest();

const Orders = ({ statuses = [] }) => {
    const gridRef = useRef();
    const modalRef = useRef();

    const [saleLoaded, setSaleLoaded] = useState(null);
    const [saleStatuses, setSaleStatuses] = useState([]);

    const onStatusChange = async (e) => {
        const result = await salesRest.save({
            id: saleLoaded.id,
            status_id: e.target.value,
        });
        if (!result) return;
        setSaleLoaded(result);
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Anular pedido",
            text: "¿Estas seguro de anular este pedido?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, anular",
            cancelButtonText: "Cancelar",
        });
        if (!isConfirmed) return;
        const result = await salesRest.delete(id);
        if (!result) return;
        $(gridRef.current).dxDataGrid("instance").refresh();
    };

    const onModalOpen = async (saleId) => {
        const newSale = await salesRest.get(saleId);
        setSaleLoaded(newSale.data);
        $(modalRef.current).modal("show");
    };

    useEffect(() => {
        if (!saleLoaded) return;
        saleStatusesRest.bySale(saleLoaded.id).then((data) => {
            if (data) setSaleStatuses(data);
            else setSaleStatuses([]);
        });
    }, [saleLoaded]);

    const totalFinal = parseFloat(saleLoaded?.amount || saleLoaded?.total_amount || 0);
    const igv = parseFloat(saleLoaded?.igv_amount || saleLoaded?.igv || 0);
    const perception = parseFloat(saleLoaded?.perception_amount || saleLoaded?.perception || 0);
    const packaging = parseFloat(saleLoaded?.packaging_amount || saleLoaded?.packaging || 0);
    const deliveryCost = parseFloat(saleLoaded?.delivery || 0);
    const additionalShippingCost = parseFloat(saleLoaded?.additional_shipping_cost || 0);
    const couponDiscountAmount = parseFloat(saleLoaded?.coupon_discount || 0);
    const automaticDiscount = parseFloat(saleLoaded?.promotion_discount || saleLoaded?.automatic_discount_total || 0);
    const bundleDiscount = parseFloat(saleLoaded?.bundle_discount || 0);
    const renewalDiscount = parseFloat(saleLoaded?.renewal_discount || 0);

    const totalProductsGross =
        totalFinal -
        perception -
        packaging -
        deliveryCost -
        additionalShippingCost +
        couponDiscountAmount +
        automaticDiscount +
        bundleDiscount +
        renewalDiscount;

    const subtotalReal = totalProductsGross - igv;
    const totalAmount = totalFinal;

    return (
        <>
            <Table
                gridRef={gridRef}
                title="Mis Pedidos"
                rest={salesRest}
                withRelations="details,status,store,packaging"
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
                }}
                columns={[
                    {
                        dataField: "id",
                        caption: "ID",
                        visible: false,
                    },
                    {
                        dataField: "name",
                        caption: "Orden",
                        width: "250px",
                        cellTemplate: (container, { data }) => {
                            container.css("cursor", "pointer");
                            container.on("click", () => {
                                onModalOpen(data.id);
                            });
                            ReactAppend(
                                container,
                                <p className="mb-0" style={{ width: "100%" }}>
                                    <b className="d-block">
                                        {data.name} {data.lastname}
                                    </b>
                                    <small
                                        className="text-nowrap text-muted"
                                        style={{
                                            overflow: "hidden",
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            fontFamily: "monospace",
                                        }}
                                    >
                                        #{Global.APP_CORRELATIVE}-{data.code}
                                    </small>
                                </p>
                            );
                        },
                    },
                    {
                        dataField: "created_at",
                        caption: "Fecha",
                        dataType: "date",
                        sortOrder: "desc",
                        cellTemplate: (container, { data }) => {
                            container.text(
                                moment(data.created_at)
                                    .subtract(5, "hours")
                                    .format("LLL")
                            );
                        },
                    },
                    {
                        dataField: "status.name",
                        caption: "Estado",
                        cellTemplate: (container, { data }) => {
                            ReactAppend(
                                container,
                                <span
                                    className="badge rounded-pill"
                                    style={{
                                        backgroundColor: data.status.color
                                            ? `${data.status.color}2e`
                                            : "#3333332e",
                                        color: data.status.color ?? "#333",
                                    }}
                                >
                                    {data.status.name}
                                </span>
                            );
                        },
                    },
                    {
                        dataField: "amount",
                        caption: "Total",
                        dataType: "number",
                        calculateCellValue: (data) => {
                            return Number(data?.amount || 0);
                        },
                        cellTemplate: (container, { data }) => {
                            container.text(
                                `${CurrencySymbol()} ${Number2Currency(data?.amount || 0)}`
                            );
                        },
                    },
                    {
                        caption: "Acciones",
                        cellTemplate: (container, { data }) => {
                            container.append(
                                DxButton({
                                    className: "btn btn-xs btn-light",
                                    title: "Ver pedido",
                                    icon: "fa fa-eye",
                                    onClick: () => onModalOpen(data.id),
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
                title={`Detalles del pedido #${Global.APP_CORRELATIVE}-${saleLoaded?.code}`}
                size="xl"
                bodyStyle={{
                    backgroundColor: "#ebeff2",
                }}
                hideButtonSubmit
            >
                <div className="row">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">
                                    Detalles de Venta
                                </h5>
                            </div>
                            <div className="card-body p-2">
                                <table className="table table-borderless table-sm mb-0">
                                    <tbody>
                                        {saleLoaded?.payment_method && (
                                            <tr>
                                                <th>Método de pago:</th>
                                                <td>{saleLoaded?.payment_method}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.culqi_charge_id && (
                                            <tr>
                                                <th>ID de transacción:</th>
                                                <td>{saleLoaded?.culqi_charge_id}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <th>Nombres:</th>
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
                                        {(saleLoaded?.document_type || saleLoaded?.documentType) && (
                                            <tr>
                                                <th>Tipo de documento:</th>
                                                <td>{saleLoaded?.document_type || saleLoaded?.documentType}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.document && (
                                            <tr>
                                                <th>Número de documento:</th>
                                                <td>{saleLoaded?.document}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.delivery_type && (
                                            <tr>
                                                <th>Tipo de entrega:</th>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {saleLoaded?.delivery_type === "store_pickup"
                                                            ? "Retiro en Tienda"
                                                            : saleLoaded?.delivery_type === "free"
                                                            ? "Envío Gratis"
                                                            : saleLoaded?.delivery_type === "express"
                                                            ? "Envío Express"
                                                            : saleLoaded?.delivery_type === "standard"
                                                            ? "Envío Estándar"
                                                            : saleLoaded?.delivery_type === "agency"
                                                            ? "Entrega en Agencia"
                                                            : saleLoaded?.delivery_type}
                                                    </span>
                                                </td>
                                            </tr>
                                        )}
                                        {saleLoaded?.delivery_type === "store_pickup" && saleLoaded?.store && (
                                            <tr>
                                                <th>Tienda para retiro:</th>
                                                <td>
                                                    <strong>{saleLoaded?.store?.name}</strong>
                                                    <small className="text-muted d-block">
                                                        {saleLoaded?.store?.address}
                                                        {saleLoaded?.store?.district && `, ${saleLoaded?.store?.district}`}
                                                        {saleLoaded?.store?.province && `, ${saleLoaded?.store?.province}`}
                                                    </small>
                                                    {saleLoaded?.store?.phone && (
                                                        <small className="text-info d-block">
                                                            📞 {saleLoaded?.store?.phone}
                                                        </small>
                                                    )}
                                                    {saleLoaded?.store?.schedule && (
                                                        <small className="text-success d-block">
                                                            🕒 {saleLoaded?.store?.schedule}
                                                        </small>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                        {saleLoaded?.delivery_type && saleLoaded?.delivery_type !== "store_pickup" && (
                                            <tr>
                                                <th>Dirección de entrega:</th>
                                                <td>
                                                    {saleLoaded?.address} {saleLoaded?.number}
                                                    <small className="text-muted d-block">
                                                        {saleLoaded?.district}, {saleLoaded?.province}, {saleLoaded?.department}, {saleLoaded?.country}
                                                        {saleLoaded?.zip_code && ` - ${saleLoaded?.zip_code}`}
                                                    </small>
                                                </td>
                                            </tr>
                                        )}
                                        {saleLoaded?.reference && (
                                            <tr>
                                                <th>Referencia:</th>
                                                <td>{saleLoaded?.reference}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.comment && (
                                            <tr>
                                                <th>Comentario:</th>
                                                <td>{saleLoaded?.comment}</td>
                                            </tr>
                                        )}
                                        {saleLoaded?.coupon_code && (
                                            <tr>
                                                <th>Cupón aplicado:</th>
                                                <td>
                                                    <span className="badge bg-success">{saleLoaded?.coupon_code}</span>
                                                    <small className="text-success d-block">
                                                        Descuento: {CurrencySymbol()} {Number2Currency(saleLoaded?.coupon_discount || 0)}
                                                    </small>
                                                </td>
                                            </tr>
                                        )}
                                        {(saleLoaded?.applied_promotions || saleLoaded?.promotion_discount > 0) && (
                                            <tr>
                                                <th>Promociones aplicadas:</th>
                                                <td>
                                                    {saleLoaded?.applied_promotions &&
                                                        (() => {
                                                            try {
                                                                const promotions = typeof saleLoaded.applied_promotions === "string"
                                                                    ? JSON.parse(saleLoaded.applied_promotions)
                                                                    : saleLoaded.applied_promotions;
                                                                if (Array.isArray(promotions) && promotions.length > 0) {
                                                                    return promotions.map((promo, idx) => (
                                                                        <div key={idx} className="mb-2">
                                                                            <span className="badge bg-primary me-2">
                                                                                {promo.rule_name || promo.name || "Promoción"}
                                                                            </span>
                                                                            <small className="text-primary d-block">
                                                                                {promo.description}
                                                                            </small>
                                                                            <small className="text-success d-block">
                                                                                Descuento: {CurrencySymbol()} {Number2Currency(promo.discount_amount || promo.amount || 0)}
                                                                            </small>
                                                                        </div>
                                                                    ));
                                                                }
                                                            } catch (e) {
                                                                console.error("Error parsing promotions:", e);
                                                            }
                                                            return null;
                                                        })()}
                                                    {saleLoaded?.promotion_discount > 0 && (
                                                        <div className="mt-2 pt-2 border-top">
                                                            <strong className="text-primary">
                                                                Total descuento promociones: {CurrencySymbol()} {Number2Currency(saleLoaded?.promotion_discount || 0)}
                                                            </strong>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                        {saleLoaded?.invoiceType && (
                                            <tr>
                                                <th>Comprobante solicitado:</th>
                                                <td>
                                                    <span className="text-uppercase fw-bold">{saleLoaded?.invoiceType}</span>
                                                    {saleLoaded?.businessName && (
                                                        <small className="d-block text-muted">
                                                            {saleLoaded?.businessName} ({saleLoaded?.document})
                                                        </small>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                        {saleLoaded?.payment_proof && (
                                            <tr>
                                                <th>Comprobante de pago:</th>
                                                <td>
                                                    <Tippy content="Ver comprobante de pago" placement="top">
                                                        <a href={`/storage/images/sale/${saleLoaded?.payment_proof}`} target="_blank" rel="noreferrer">
                                                            <img
                                                                src={`/storage/images/sale/${saleLoaded?.payment_proof}`}
                                                                alt="Comprobante de pago"
                                                                className="img-thumbnail"
                                                                style={{ maxWidth: "150px", cursor: "pointer" }}
                                                            />
                                                        </a>
                                                    </Tippy>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">Artículos</h5>
                            </div>
                            <div className="card-body p-2 table-responsive">
                                <table className="table table-striped table-bordered table-sm table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th className="w-20" style={{ width: "80px" }}>Imagen</th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Cantidad</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {saleLoaded?.details?.map((detail, index) => {
                                            const quantity = (detail.quantity * 100) / 100;
                                            const totalPrice = detail.price * detail.quantity;
                                            return (
                                                <tr key={index} style={{ verticalAlign: "middle" }}>
                                                    <td className="p-0 text-center" style={{ width: "80px" }}>
                                                        {detail.image ? (
                                                            <img
                                                                className="object-scale-down mx-auto block"
                                                                src={detail?.type === "combo"
                                                                    ? `/storage/images/combo/${detail.image}`
                                                                    : `/storage/images/item/${detail.image}`}
                                                                alt={detail.name}
                                                                style={{ height: "4rem", width: "4rem", objectFit: "scale-down" }}
                                                            />
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <strong>{detail.name}</strong>
                                                            {detail.colors ? ` - ${detail.colors}` : ""}
                                                            {(detail.type === "combo" || detail.combo_id) && (
                                                                <div className="mt-1">
                                                                    <small className="text-muted d-block">
                                                                        <span className="badge bg-info me-1">COMBO</span>
                                                                        Contiene:
                                                                    </small>
                                                                    {detail.combo_data && detail.combo_data.items && detail.combo_data.items.length > 0 ? (
                                                                        <small className="text-muted">
                                                                            {detail.combo_data.items.map((item, idx) => (
                                                                                <span key={idx}>
                                                                                    {item.quantity || 1}x {item.name}
                                                                                    {idx < detail.combo_data.items.length - 1 ? ", " : ""}
                                                                                </span>
                                                                            ))}
                                                                        </small>
                                                                    ) : (
                                                                        <small className="text-muted text-warning">
                                                                            📋 Información de combo no disponible
                                                                        </small>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td align="right">
                                                        <span className="text-nowrap">
                                                            {CurrencySymbol()} {Number2Currency(detail.price)}
                                                        </span>
                                                    </td>
                                                    <td align="center">{quantity}</td>
                                                    <td align="right">
                                                        <span className="text-nowrap">
                                                            {CurrencySymbol()} {Number2Currency(totalPrice)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">Resumen</h5>
                            </div>
                            <div className="card-body p-2">
                                <div className="d-flex justify-content-between">
                                    <b>Subtotal:</b>
                                    <span>{CurrencySymbol()} {Number2Currency(subtotalReal)}</span>
                                </div>
                                {igv > 0 && (
                                    <div className="d-flex justify-content-between">
                                        <b>IGV ({Global.IGV_RATE}%):</b>
                                        <span>{CurrencySymbol()} {Number2Currency(igv)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between">
                                    <b>Envío:</b>
                                    <span>{CurrencySymbol()} {Number2Currency(deliveryCost)}</span>
                                </div>
                                {perception > 0 && (
                                    <div className="d-flex justify-content-between">
                                        <b>Percepción ({Global.PERCEPTION_RATE}%):</b>
                                        <span>{CurrencySymbol()} {Number2Currency(perception)}</span>
                                    </div>
                                )}
                                {packaging > 0 && (
                                    <div className="d-flex justify-content-between">
                                        <b>Empaque {saleLoaded?.packaging?.name ? `(${saleLoaded.packaging.name})` : ""}:</b>
                                        <span>{CurrencySymbol()} {Number2Currency(packaging)}</span>
                                    </div>
                                )}
                                {additionalShippingCost > 0 && (
                                    <div className="d-flex justify-content-between text-warning">
                                        <b>
                                            Costo adicional de envío:
                                            {saleLoaded?.additional_shipping_description && (
                                                <small className="d-block text-muted" style={{ fontWeight: "normal" }}>
                                                    ({saleLoaded.additional_shipping_description})
                                                </small>
                                            )}
                                        </b>
                                        <span>{CurrencySymbol()} {Number2Currency(additionalShippingCost)}</span>
                                    </div>
                                )}
                                
                                {/* Mostrar costos de importación si existen */}
                                {(saleLoaded?.seguro_importacion_total > 0 || saleLoaded?.derecho_arancelario_total > 0 || saleLoaded?.flete_total > 0) && (
                                    <>
                                        {saleLoaded?.seguro_importacion_total > 0 && (
                                            <div className="d-flex justify-content-between text-info">
                                                <b>Seguro de Importación:</b>
                                                <span>{CurrencySymbol()} {Number2Currency(saleLoaded?.seguro_importacion_total)}</span>
                                            </div>
                                        )}
                                        {saleLoaded?.derecho_arancelario_total > 0 && (
                                            <div className="d-flex justify-content-between text-info">
                                                <b>Derecho Arancelario:</b>
                                                <span>{CurrencySymbol()} {Number2Currency(saleLoaded?.derecho_arancelario_total)}</span>
                                            </div>
                                        )}
                                        {saleLoaded?.flete_total > 0 && (
                                            <div className="d-flex justify-content-between text-info">
                                                <b>Flete:</b>
                                                <span>{CurrencySymbol()} {Number2Currency(saleLoaded?.flete_total)}</span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Descuentos */}
                                {automaticDiscount > 0 && (
                                    <div className="d-flex justify-content-between text-primary">
                                        <b>Descuentos automáticos:</b>
                                        <span>- {CurrencySymbol()} {Number2Currency(automaticDiscount)}</span>
                                    </div>
                                )}
                                {couponDiscountAmount > 0 && (
                                    <div className="d-flex justify-content-between text-success">
                                        <b>Descuento por cupón:</b>
                                        <span>- {CurrencySymbol()} {Number2Currency(couponDiscountAmount)}</span>
                                    </div>
                                )}
                                {bundleDiscount > 0 && (
                                    <div className="d-flex justify-content-between text-info">
                                        <b>Descuento por paquete:</b>
                                        <span>- {CurrencySymbol()} {Number2Currency(bundleDiscount)}</span>
                                    </div>
                                )}
                                {renewalDiscount > 0 && (
                                    <div className="d-flex justify-content-between text-warning">
                                        <b>Descuento por renovación:</b>
                                        <span>- {CurrencySymbol()} {Number2Currency(renewalDiscount)}</span>
                                    </div>
                                )}
                                
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between">
                                    <b>Total:</b>
                                    <span>
                                        <strong>{CurrencySymbol()} {Number2Currency(totalAmount)}</strong>
                                    </span>
                                </div>

                                <small className="text-muted mt-2 d-block">
                                    <strong>Cálculo:</strong> {Number2Currency(subtotalReal)} (subtotal) + {Number2Currency(deliveryCost)} (envio)
                                    {igv > 0 && ` (incluye ${Number2Currency(igv)} de IGV)`}
                                    {perception > 0 && ` + ${Number2Currency(perception)} (percepción)`}
                                    {packaging > 0 && ` + ${Number2Currency(packaging)} (empaque)`}
                                    {additionalShippingCost > 0 && ` + ${Number2Currency(additionalShippingCost)} (costo adicional)`}
                                    {saleLoaded?.seguro_importacion_total > 0 && ` + ${Number2Currency(saleLoaded?.seguro_importacion_total)} (seguro)`}
                                    {saleLoaded?.derecho_arancelario_total > 0 && ` + ${Number2Currency(saleLoaded?.derecho_arancelario_total)} (derecho arancelario)`}
                                    {saleLoaded?.flete_total > 0 && ` + ${Number2Currency(saleLoaded?.flete_total)} (flete)`}
                                    {automaticDiscount > 0 && ` - ${Number2Currency(automaticDiscount)} (promociones)`}
                                    {couponDiscountAmount > 0 && ` - ${Number2Currency(couponDiscountAmount)} (cupón)`}
                                    {bundleDiscount > 0 && ` - ${Number2Currency(bundleDiscount)} (paquete)`}
                                    {renewalDiscount > 0 && ` - ${Number2Currency(renewalDiscount)} (renovación)`}
                                    = {CurrencySymbol()} {Number2Currency(totalAmount)}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header p-2">
                                <h5 className="card-title mb-0">Estado</h5>
                            </div>
                            <div className="card-body p-2">
                                <div className="">
                                    <label htmlFor="statusSelect" className="form-label">Estado Actual</label>
                                    <select
                                        className="form-select"
                                        id="statusSelect"
                                        value={saleLoaded?.status_id}
                                        onChange={onStatusChange}
                                        disabled
                                    >
                                        {statuses.map((status, index) => (
                                            <option key={index} value={status.id}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {saleStatuses && saleStatuses.length > 0 && (
                            <div className="card">
                                <div className="card-header p-2">
                                    <h5 className="card-title mb-0">Seguimiento de Pedido</h5>
                                </div>
                                <div className="card-body p-2 d-flex flex-column gap-2">
                                    {saleStatuses.map((ss, index) => (
                                        <article
                                            key={index}
                                            className="border py-2 px-3 ms-3"
                                            style={{
                                                position: "relative",
                                                borderRadius: "16px 4px 4px 16px",
                                                backgroundColor: ss.color
                                                    ? `${ss.color}15`
                                                    : "#33333315",
                                                borderColor: ss.color
                                                    ? `${ss.color}33`
                                                    : "#33333333",
                                                borderStyle: "solid",
                                                borderWidth: "1px"
                                            }}
                                        >
                                            <i
                                                className={`${ss.icon || "mdi mdi-circle"} left-2`}
                                                style={{
                                                    color: ss.color || "#333",
                                                    position: "absolute",
                                                    left: "-25px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)",
                                                    fontSize: "14px"
                                                }}
                                            ></i>
                                            <b style={{ color: ss.color || "#333" }}>
                                                {ss?.name}
                                            </b>
                                            <small className="d-block text-muted mt-1">
                                                {moment(ss.created_at).format("DD/MM/YYYY hh:mm A")}
                                            </small>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
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
        </BaseAdminto>
    );
});
export default Orders;
