import { useEffect, useState } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import { recoveryOrderData } from "../../../../Actions/recoveryOrderData";
import { Local } from "sode-extend-react";
import Global from "../../../../Utils/Global";
import { CheckCircle, Package, ChevronRight } from "lucide-react";

const SummaryRow = ({ label, value, highlight, accent, className = "" }) => (
    <div className={`flex justify-between items-start py-2 border-b border-white/5 last:border-0 ${className}`}>
        <span className="text-[11px] font-paragraph uppercase tracking-widest text-white/40">{label}</span>
        <span className={`font-paragraph font-bold text-sm ${highlight ? "text-green-400" : accent ? "text-white/40" : "text-white"}`}>
            {value}
        </span>
    </div>
);

export default function ConfirmationStepTwenty({
    setCart,
    cart,
    code,
    delivery,
    data,
    automaticDiscounts = [],
    automaticDiscountTotal = 0,
    couponDiscount = 0,
    couponCode = null,
    conversionScripts = [],
    generals = [],
}) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const igvGeneral = generals.find((g) => g.correlative === "igv_checkout");
    const igvRate = parseFloat(igvGeneral?.description) || 18;

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await recoveryOrderData({ code });
                setOrder(response.order);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (code) {
            fetchOrderDetails();
            Local.delete(`${Global.APP_CORRELATIVE}_cart`);
            Local.set(`${Global.APP_CORRELATIVE}_cart`, []);
        }
    }, [code]);

    // ─── Loading ─────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
                <p className="text-xs font-paragraph uppercase tracking-widest text-white/40">
                    Cargando detalles de la orden...
                </p>
            </div>
        );
    }

    // ─── Error ───────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="py-16 text-center border border-white/10 p-8">
                <p className="text-xs font-paragraph uppercase tracking-widest text-red-400">
                    Error al cargar la orden: {error}
                </p>
            </div>
        );
    }

    // ─── No order ────────────────────────────────────────────────────────────
    if (!order) {
        return (
            <div className="py-16 text-center border border-white/10 p-8">
                <p className="text-xs font-paragraph uppercase tracking-widest text-white/30">
                    No se encontraron datos de la orden
                </p>
            </div>
        );
    }

    // ─── Calculate totals ────────────────────────────────────────────────────
    const igv = parseFloat(order.igv_amount || order.igv || 0);
    const perception = parseFloat(order.perception_amount || order.perception || 0);
    const packaging = parseFloat(order.packaging_amount || order.packaging || 0);
    const deliveryCost = parseFloat(order.delivery || 0);
    const additionalShippingCost = parseFloat(order.additional_shipping_cost || 0);
    const couponDiscountAmount = parseFloat(order.coupon_discount || 0);
    const automaticDiscount = parseFloat(order.promotion_discount || order.automatic_discount_total || 0);
    const totalFinal = parseFloat(order.amount || order.total_amount || 0);
    const totalProductsGross = totalFinal - perception - packaging - deliveryCost - additionalShippingCost + couponDiscountAmount + automaticDiscount;
    const subTotal = totalProductsGross - igv;

    const deliveryLabel =
        order.delivery_type === "store_pickup"
            ? "Retiro en tienda"
            : order.delivery_type === "agency"
                ? "Envío por agencia"
                : "Envío";

    const deliveryValue = (() => {
        if (order.delivery_type === "store_pickup") return "Gratis";
        if (order.delivery_type === "agency" && deliveryCost === 0) return "Pago en destino";
        if (deliveryCost === 0) return "Gratis";
        return `${CurrencySymbol()} ${Number2Currency(deliveryCost)}`;
    })();

    return (
        <div className="max-w-2xl mx-auto">
            {/* ─── Success Header ─── */}
            <div className="text-center py-10 border-b border-white/10 mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-white mb-6">
                    <CheckCircle size={32} strokeWidth={1.5} className="text-white" />
                </div>
                <p className="text-xs font-paragraph uppercase tracking-widest text-white/40 mb-2">
                    Gracias por tu compra
                </p>
                <h2 className="text-4xl md:text-6xl font-title uppercase text-white leading-none">
                    Tu orden ha sido<br />recibida
                </h2>
                <div className="mt-6 inline-block border border-white/20 px-6 py-3">
                    <span className="text-[10px] font-paragraph uppercase tracking-widest text-white/40 block mb-1">
                        Código de pedido
                    </span>
                    <span className="text-lg font-paragraph font-bold text-white">
                        #{order.code}
                    </span>
                </div>
            </div>

            {/* ─── Order items ─── */}
            <div className="mb-8">
                <h3 className="text-[10px] font-paragraph uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                    <Package size={12} strokeWidth={2} />
                    Productos pedidos
                </h3>

                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 border-b border-white/5 pb-3">
                            <div className="w-16 h-16 flex-shrink-0 border border-white/10 overflow-hidden">
                                <img
                                    src={item.image ? `/storage/images/item/${item.image}` : "/assets/img/noimage/no_img.jpg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                                />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-paragraph font-semibold text-white text-sm leading-tight">
                                    {item.name}
                                    {item.is_free && (
                                        <span className="ml-2 text-[9px] font-paragraph uppercase tracking-widest bg-green-400/20 text-green-400 px-1.5 py-0.5">
                                            Gratis
                                        </span>
                                    )}
                                </h4>
                                {item?.color && (
                                    <p className="text-[10px] font-paragraph uppercase tracking-widest text-white/30 mt-0.5">
                                        Color: {item.color}
                                    </p>
                                )}
                                <div className="mt-1 flex items-center justify-between">
                                    <span className="text-[10px] font-paragraph text-white/40">
                                        Cant: {parseInt(item.quantity)}
                                    </span>
                                    <span className="text-sm font-paragraph font-bold text-white">
                                        {CurrencySymbol()} {Number2Currency(item.price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Free items from promotions */}
                {order.free_items && order.free_items.length > 0 && (
                    <div className="mt-4 border border-green-400/20 p-3">
                        <p className="text-[10px] font-paragraph uppercase tracking-widest text-green-400 mb-3">
                            🎁 Productos gratuitos por promociones
                        </p>
                        {order.free_items.map((item, index) => (
                            <div key={`free-${index}`} className="flex gap-3 py-2 border-b border-green-400/10 last:border-0">
                                <div className="w-12 h-12 flex-shrink-0 border border-green-400/20 overflow-hidden">
                                    <img
                                        src={item.image ? `/storage/images/item/${item.image}` : "/assets/img/noimage/no_img.jpg"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-paragraph text-white">
                                        {item.name}
                                        <span className="ml-2 text-[9px] font-paragraph uppercase tracking-widest text-green-400">¡Gratis!</span>
                                    </h4>
                                    <p className="text-[10px] font-paragraph text-white/30">
                                        Cant: {parseInt(item.quantity)} — Por promoción
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Cost Summary ─── */}
            <div className="border border-white/15 p-6">
                <h3 className="text-[10px] font-paragraph uppercase tracking-widest text-white/30 mb-4 pb-3 border-b border-white/10">
                    Resumen de pago
                </h3>

                <SummaryRow label="Subtotal (sin IGV)" value={`${CurrencySymbol()} ${Number2Currency(subTotal)}`} />
                <SummaryRow label={`IGV (${igvRate}%)`} value={`${CurrencySymbol()} ${Number2Currency(igv)}`} />
                {perception > 0 && (
                    <SummaryRow label="Percepción" value={`${CurrencySymbol()} ${Number2Currency(perception)}`} />
                )}
                {packaging > 0 && (
                    <SummaryRow label="Empaque" value={`${CurrencySymbol()} ${Number2Currency(packaging)}`} />
                )}
                <SummaryRow label={deliveryLabel} value={deliveryValue} />
                {additionalShippingCost > 0 && (
                    <SummaryRow
                        label={`Costo adicional${order.additional_shipping_description ? ` (${order.additional_shipping_description})` : ""}`}
                        value={`${CurrencySymbol()} ${Number2Currency(additionalShippingCost)}`}
                    />
                )}
                {order.coupon_id && (
                    <SummaryRow
                        label="Cupón aplicado"
                        value={`${CurrencySymbol()} -${Number2Currency(order.coupon_discount)}`}
                        highlight
                    />
                )}
                {order.automatic_discounts && order.automatic_discounts.length > 0 && (
                    <>
                        {order.automatic_discounts.map((discount, idx) => (
                            <SummaryRow
                                key={idx}
                                label={discount.rule_name || discount.name || "Descuento automático"}
                                value={`${CurrencySymbol()} -${Number2Currency(discount.discount_amount || discount.amount || 0)}`}
                                highlight
                            />
                        ))}
                    </>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-white/20">
                    <span className="text-xs font-paragraph uppercase tracking-widest text-white font-bold">Total</span>
                    <span className="text-2xl  text-white">
                        {CurrencySymbol()} {Number2Currency(totalFinal)}
                    </span>
                </div>
            </div>

            {/* ─── CTA ─── */}
            <div className="mt-8 text-center">
                <a
                    href="/catalogo"
                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 text-xs font-paragraph uppercase tracking-widest hover:bg-white/90 transition-all duration-200"
                >
                    Seguir Comprando
                    <ChevronRight size={14} strokeWidth={2.5} />
                </a>
            </div>
        </div>
    );
}
