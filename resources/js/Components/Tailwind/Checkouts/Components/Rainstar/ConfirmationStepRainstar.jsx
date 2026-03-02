import { useEffect, useState, useRef } from "react";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../../Utils/Number2Currency";
import { recoveryOrderData } from "../../../../../Actions/recoveryOrderData";
import ButtonRainstar from "./ButtonRainstar";
import { Local } from "sode-extend-react";
import Global from "../../../../../Utils/Global";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Package,
    Calendar,
    CreditCard,
    Printer,
    ShoppingBag,
    Tag,
    MapPin,
    Download,
    ArrowRight,
    Truck,
    PartyPopper,
    ReceiptText,
} from "lucide-react";

// ── Small info row ─────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
            <Icon size={14} className="text-neutral-dark/40" />
        </div>
        <div>
            <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase mb-0.5">
                {label}
            </p>
            <p className="text-sm font-semibold text-neutral-dark leading-relaxed">
                {value}
            </p>
        </div>
    </div>
);

// ── Price row ──────────────────────────────────────────────────────────────────
const PriceRow = ({ label, value, highlight = false, negative = false }) => (
    <div
        className={`flex justify-between items-center ${highlight ? "pt-4 border-t border-gray-100" : ""}`}
    >
        <span
            className={`text-sm ${highlight ? "font-black text-neutral-dark" : "font-medium text-neutral-dark/50"}`}
        >
            {label}
        </span>
        <span
            className={`font-bold ${highlight ? "text-2xl text-neutral-dark" : "text-sm"} ${negative ? "text-red-500" : ""}`}
        >
            {value}
        </span>
    </div>
);

export default function ConfirmationStepRainstar({
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
}) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const printRef = useRef(); // for visual ref only — PDF uses separate inline template

    const handleDownloadPDF = () => {
        if (!order || !printRef.current) return;
        setIsGenerating(true);

        // Gather all stylesheets from the current page (Tailwind, fonts, etc.)
        // so the print popup renders exactly like the screen — including oklch colors.
        const styleLinks = Array.from(
            document.querySelectorAll("link[rel='stylesheet']"),
        )
            .map((l) => `<link rel="stylesheet" href="${l.href}">`)
            .join("\n");

        // Clone the visible receipt card HTML (keeps all Tailwind classes)
        const receiptHTML = printRef.current.outerHTML;

        const pw = window.open("", "_blank", "width=900,height=700");
        if (!pw) {
            setIsGenerating(false);
            alert(
                "Tu navegador bloqueó la ventana emergente. " +
                    "Permite popups para este sitio e inténtalo de nuevo.",
            );
            return;
        }

        pw.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Orden ${code}</title>
  ${styleLinks}
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    html, body {
      background: #ffffff !important;
      margin: 0;
      padding: 14mm 16mm;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  </style>
</head>
<body>
  ${receiptHTML}
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); window.close(); }, 700);
    });
  <\/script>
</body>
</html>`);
        pw.document.close();
        setIsGenerating(false);
    };

    useEffect(() => {
        if (conversionScripts?.length > 0) {
            conversionScripts.forEach((script) => {
                try {
                    const el = document.createElement("script");
                    el.text = script;
                    document.body.appendChild(el);
                } catch (err) {
                    console.error(
                        "Error ejecutando script de conversión:",
                        err,
                    );
                }
            });
        }
    }, [conversionScripts]);

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
            Local.set(`${Global.APP_CORRELATIVE}_cart`, []);
            setCart([]);
        }
    }, [code]);

    // ── Loading state ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white">
                <div className="relative w-16 h-16 mb-8">
                    <div className="absolute inset-0 border-2 border-gray-100 rounded-full" />
                    <div className="absolute inset-0 border-2 border-neutral-dark border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-xs font-bold tracking-widest text-neutral-dark/30 uppercase">
                    Validando tu orden...
                </p>
            </div>
        );
    }

    // ── Error state ──────────────────────────────────────────────────────────────
    if (error || !order) {
        return (
            <div className="max-w-xl mx-auto py-20 px-4">
                <div className="border border-red-100 bg-red-50 p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                        <ReceiptText size={28} className="text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-red-600 mb-3">
                        No se pudo cargar la orden
                    </h2>
                    <p className="text-sm text-red-400/80 leading-relaxed mb-8">
                        {error ||
                            "Por favor contacta a soporte con tu código de orden."}
                    </p>
                    <ButtonRainstar
                        onClick={() => (window.location.href = "/catalogo")}
                    >
                        Volver al Catálogo
                    </ButtonRainstar>
                </div>
            </div>
        );
    }

    // ── Calculations ──────────────────────────────────────────────────────────────
    const totalPrice =
        order?.items?.reduce((acc, item) => {
            const price =
                item.type === "combo"
                    ? item.final_price || item.price || 0
                    : item.price || 0;
            return acc + price * (item.quantity || 0);
        }, 0) || 0;

    const subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
    const igv = parseFloat((totalPrice - subTotal).toFixed(2));
    const deliveryCost = parseFloat(order.delivery || 0);
    const additionalShippingCost = parseFloat(
        order.additional_shipping_cost || 0,
    );
    const couponDiscountAmount = parseFloat(order.coupon_discount || 0);
    const automaticDiscount = parseFloat(order.automatic_discount_total || 0);
    const totalFinal =
        subTotal +
        igv +
        deliveryCost +
        additionalShippingCost -
        couponDiscountAmount -
        automaticDiscount;

    const deliveryLabel =
        order.delivery_type === "store_pickup"
            ? "Recojo en tienda"
            : order.delivery_type === "agency"
              ? "Envío por agencia"
              : "Envío a domicilio";

    const dateLabel = order.created_at
        ? new Date(order.created_at).toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "—";

    return (
        <div className="pb-20 max-w-4xl mx-auto px-4">
            {/* Print styles */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0; margin: 0; }
                    @page { size: A4; margin: 15mm; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `,
                }}
            />

            {/* PDF generating overlay */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                        <div className="relative w-16 h-16 mb-8">
                            <div className="absolute inset-0 border-2 border-gray-100 rounded-full" />
                            <div className="absolute inset-0 border-2 border-neutral-dark border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h2 className="text-lg font-black tracking-tight text-neutral-dark mb-2">
                            Generando PDF
                        </h2>
                        <p className="text-xs text-neutral-dark/30 tracking-widest uppercase">
                            Por favor espera...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
            >
                {/* ── Hero: success banner ── */}
                <div className="relative overflow-hidden bg-neutral-dark text-white px-8 py-12 text-center">
                    {/* Background decoration */}
                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/[0.03]" />
                        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/[0.03]" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            delay: 0.15,
                            type: "spring",
                            stiffness: 200,
                        }}
                        className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-6"
                    >
                        <CheckCircle2
                            size={40}
                            className="text-white"
                            strokeWidth={1.5}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="relative z-10 space-y-2"
                    >
                        <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                            ¡Pedido confirmado!
                        </p>
                        <h2 className="text-4xl font-black tracking-tight leading-tight">
                            Gracias por tu compra
                        </h2>
                        <p className="text-white/50 text-sm mt-2">
                            Tu orden{" "}
                            <span className="text-white font-bold">{code}</span>{" "}
                            ha sido registrada con éxito.
                        </p>
                    </motion.div>

                    {/* Status badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="relative z-10 mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-xs font-bold text-white/80"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        {order.status_name || "Pendiente de confirmación"}
                    </motion.div>
                </div>

                {/* ── Receipt card ── */}
                <div
                    ref={printRef}
                    className="bg-white border border-gray-100 shadow-sm overflow-hidden"
                >
                    {/* Receipt header */}
                    <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                            <ReceiptText
                                size={18}
                                className="text-neutral-dark/30"
                            />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase">
                                Comprobante de orden
                            </p>
                            <h3 className="text-lg font-black tracking-tight text-neutral-dark">
                                {code}
                            </h3>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* ── Products ── */}
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase mb-5">
                                Artículos
                            </p>
                            <div className="space-y-5">
                                {(order.items || []).map((item, idx) => {
                                    const price =
                                        item.price || item.final_price || 0;
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="w-14 h-14 border border-gray-100 bg-gray-50 shrink-0 overflow-hidden">
                                                <img
                                                    src={
                                                        item.image
                                                            ? `/storage/images/item/${item.image}`
                                                            : "/assets/img/noimage/no_img.jpg"
                                                    }
                                                    className="w-full h-full object-cover"
                                                    alt={item.name}
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/assets/img/noimage/no_img.jpg")
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-neutral-dark leading-tight line-clamp-1">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-neutral-dark/40 mt-0.5">
                                                    {parseInt(item.quantity)} ×{" "}
                                                    {CurrencySymbol()}{" "}
                                                    {Number2Currency(price)}
                                                </p>
                                            </div>
                                            <span className="font-black text-sm text-neutral-dark shrink-0">
                                                {CurrencySymbol()}{" "}
                                                {Number2Currency(
                                                    price * item.quantity,
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}

                                {/* Free items */}
                                {order.free_items?.length > 0 && (
                                    <div className="pt-5 border-t border-dashed border-gray-200 space-y-4">
                                        <p className="flex items-center gap-2 text-[10px] font-bold text-green-600 tracking-widest uppercase">
                                            <Tag size={11} />
                                            Artículos de regalo
                                        </p>
                                        {order.free_items.map((item, idx) => (
                                            <div
                                                key={`free-${idx}`}
                                                className="flex items-center gap-4 opacity-70"
                                            >
                                                <div className="w-14 h-14 border border-green-100 bg-green-50 shrink-0 overflow-hidden">
                                                    <img
                                                        src={
                                                            item.image
                                                                ? `/storage/images/item/${item.image}`
                                                                : "/assets/img/noimage/no_img.jpg"
                                                        }
                                                        className="w-full h-full object-cover"
                                                        alt={item.name}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-neutral-dark line-clamp-1">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-green-600 mt-0.5">
                                                        Regalo · Cant.{" "}
                                                        {parseInt(
                                                            item.quantity,
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-black text-green-600 shrink-0">
                                                    Gratis
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Info + Pricing grid ── */}
                        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                            {/* Shipping info */}
                            <div className="space-y-5">
                                <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase">
                                    Detalles de entrega
                                </p>
                                <InfoRow
                                    icon={MapPin}
                                    label="Dirección"
                                    value={
                                        order.address ||
                                        (order.delivery_type === "store_pickup"
                                            ? "Recojo en tienda"
                                            : "Coordinar con soporte")
                                    }
                                />
                                {order.district && (
                                    <InfoRow
                                        icon={MapPin}
                                        label="Ubicación"
                                        value={`${order.district}, ${order.provincia || order.province || ""}, ${order.departamento || order.department || ""}`}
                                    />
                                )}
                                <InfoRow
                                    icon={Truck}
                                    label="Método de envío"
                                    value={deliveryLabel}
                                />
                                <InfoRow
                                    icon={Calendar}
                                    label="Fecha de orden"
                                    value={dateLabel}
                                />
                            </div>

                            {/* Price summary */}
                            <div className="bg-gray-50/60 border border-gray-100 p-6 space-y-3 self-start">
                                <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase mb-4">
                                    Resumen de cobro
                                </p>
                                <PriceRow
                                    label="Subtotal"
                                    value={`${CurrencySymbol()} ${Number2Currency(subTotal)}`}
                                />
                                <PriceRow
                                    label="I.G.V. (18%)"
                                    value={`${CurrencySymbol()} ${Number2Currency(igv)}`}
                                />
                                <PriceRow
                                    label="Envío"
                                    value={
                                        deliveryCost > 0
                                            ? `${CurrencySymbol()} ${Number2Currency(deliveryCost)}`
                                            : "Gratis"
                                    }
                                />
                                {additionalShippingCost > 0 && (
                                    <PriceRow
                                        label="Cargo adicional"
                                        value={`${CurrencySymbol()} ${Number2Currency(additionalShippingCost)}`}
                                    />
                                )}
                                {(couponDiscountAmount > 0 ||
                                    automaticDiscount > 0) && (
                                    <PriceRow
                                        label="Descuentos"
                                        value={`-${CurrencySymbol()} ${Number2Currency(couponDiscountAmount + automaticDiscount)}`}
                                        negative
                                    />
                                )}
                                <PriceRow
                                    label="Total pagado"
                                    value={`${CurrencySymbol()} ${Number2Currency(totalFinal)}`}
                                    highlight
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div
                    className="flex flex-col sm:flex-row gap-3 no-print"
                    data-html2canvas-ignore="true"
                >
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                        className={`group flex-1 flex items-center justify-center gap-3 py-5 px-8 border-2 font-bold text-sm tracking-widest uppercase transition-all ${
                            isGenerating
                                ? "border-gray-200 text-neutral-dark/30 cursor-not-allowed"
                                : "border-neutral-dark text-neutral-dark hover:bg-neutral-dark hover:text-white"
                        }`}
                    >
                        <Download size={16} />
                        <span>
                            {isGenerating ? "Generando..." : "Descargar PDF"}
                        </span>
                    </button>

                    <a
                        href="/catalogo"
                        className="group flex-1 flex items-center justify-center gap-3 py-5 px-8 bg-primary text-white font-bold text-sm tracking-widest uppercase transition-all hover:bg-neutral-dark shadow-lg shadow-primary/20 hover:shadow-neutral-dark/20"
                    >
                        <ShoppingBag size={16} />
                        <span>Seguir comprando</span>
                        <ArrowRight
                            size={14}
                            strokeWidth={2.5}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
