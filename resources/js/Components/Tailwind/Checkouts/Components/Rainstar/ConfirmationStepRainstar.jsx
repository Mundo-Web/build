import { useEffect, useState, useRef } from "react";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../../Utils/Number2Currency";
import { recoveryOrderData } from "../../../../../Actions/recoveryOrderData";
import ButtonRainstar from "./ButtonRainstar";
import { Local } from "sode-extend-react";
import Global from "../../../../../Utils/Global";
import {
    CheckCircle2,
    Package,
    Calendar,
    CreditCard,
    ChevronRight,
    Printer,
    Share2,
    Mail,
    ShoppingBag,
    Tag,
    MapPin,
    Download,
} from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
    const printRef = useRef();

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        // Pequeño delay para que la UI se renderice antes de capturar el canvas
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
            const element = printRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`orden-${code}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (
            conversionScripts &&
            Array.isArray(conversionScripts) &&
            conversionScripts.length > 0
        ) {
            conversionScripts.forEach((script) => {
                try {
                    const trackingScript = document.createElement("script");
                    trackingScript.text = script;
                    document.body.appendChild(trackingScript);
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white">
                <div className="w-20 h-20 border-[10px] border-black border-t-transparent animate-spin"></div>
                <p className="mt-8 font-black uppercase tracking-[0.4em] text-xs">
                    Validando Orden...
                </p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4">
                <div className="border-[10px] border-black p-12 bg-red-50 text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-red-600">
                        Error Crítico
                    </h2>
                    <p className="text-xs font-bold uppercase tracking-widest leading-loose mb-10">
                        {error ||
                            "No se pudo recuperar la información de tu orden. Por favor contacta a soporte."}
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

    const totalPrice =
        order?.items?.reduce((acc, item) => {
            let itemPrice =
                item.type === "combo"
                    ? item.final_price || item.price || 0
                    : item.price || 0;
            return acc + itemPrice * (item.quantity || 0);
        }, 0) || 0;

    const subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
    const igv = parseFloat((totalPrice - subTotal).toFixed(2));
    const deliveryCost = parseFloat(order.delivery || 0);
    const additionalShippingCost = parseFloat(
        order.additional_shipping_cost || 0,
    );
    const couponDiscountAmount = parseFloat(order.coupon_discount || 0);
    const automaticDiscount = parseFloat(order.automatic_discount_total || 0);

    const totalBeforeDiscount =
        parseFloat(subTotal) +
        parseFloat(igv) +
        deliveryCost +
        additionalShippingCost;
    const totalFinal =
        totalBeforeDiscount - couponDiscountAmount - automaticDiscount;

    return (
        <div className="pt-8 pb-20 max-w-4xl mx-auto px-4">
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { 
                        background: white !important; 
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print-container {
                        width: 100% !important;
                        max-width: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                }
            `,
                }}
            />

            {/* Loading Overlay */}
            {isGenerating && (
                <div className="fixed inset-0 z-[100] bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="relative w-24 h-24 mb-10">
                        <div className="absolute inset-0 border-4 border-neutral-100 rounded-none"></div>
                        <div className="absolute inset-0 border-4 border-black border-t-transparent animate-spin rounded-none"></div>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                        Generando PDF
                    </h2>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                        Estamos preparando tu comprobante de orden. Por favor,
                        no cierres esta ventana.
                    </p>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-24 h-24 bg-black text-white rounded-full border-4 border-white shadow-xl mb-4"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>
                    <div className="space-y-2">
                        <h2 className="text-5xl font-black uppercase tracking-tighter">
                            ¡Orden Lista!
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400">
                            Gracias por tu preferencia
                        </p>
                    </div>
                </div>

                <div ref={printRef} className="grid md:grid-cols-12 gap-12">
                    <div className="md:col-span-12">
                        <div className="print-container border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                            {/* Receipt Header */}
                            <div className="bg-black text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                                        Número de Orden
                                    </p>
                                    <h4 className="text-3xl font-black tracking-tighter">
                                        {code}
                                    </h4>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">
                                        Estado
                                    </p>
                                    <span className="px-4 py-1 font-black text-xs uppercase tracking-widest bg-white  text-primary">
                                        {order.status_name || "Pendiente"}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 space-y-12">
                                {/* Items Section */}
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-4 mb-6">
                                        Artículos Adquiridos
                                    </h5>
                                    <div className="space-y-6">
                                        {(order.items || []).map(
                                            (item, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center gap-6"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 border-2 border-black grayscale shrink-0 overflow-hidden">
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
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-tight line-clamp-1">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                                Cantidad:{" "}
                                                                {parseInt(
                                                                    item.quantity,
                                                                )}{" "}
                                                                ×{" "}
                                                                {CurrencySymbol()}{" "}
                                                                {Number2Currency(
                                                                    item.price ||
                                                                        item.final_price,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-black text-sm">
                                                        {CurrencySymbol()}{" "}
                                                        {Number2Currency(
                                                            (item.price ||
                                                                item.final_price) *
                                                                item.quantity,
                                                        )}
                                                    </span>
                                                </div>
                                            ),
                                        )}

                                        {/* Free items port from SF */}
                                        {order.free_items &&
                                            order.free_items.length > 0 && (
                                                <div className="pt-6 border-t-2 border-black border-dashed space-y-4">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-2">
                                                        <Tag size={12} />
                                                        Artículos de Regalo
                                                    </p>
                                                    {order.free_items.map(
                                                        (item, idx) => (
                                                            <div
                                                                key={`free-${idx}`}
                                                                className="flex justify-between items-center gap-6 opacity-80"
                                                            >
                                                                <div className="flex items-center gap-6">
                                                                    <div className="w-16 h-16 border-2 border-green-600 grayscale shrink-0 overflow-hidden bg-green-50">
                                                                        <img
                                                                            src={
                                                                                item.image
                                                                                    ? `/storage/images/item/${item.image}`
                                                                                    : "/assets/img/noimage/no_img.jpg"
                                                                            }
                                                                            className="w-full h-full object-cover"
                                                                            alt={
                                                                                item.name
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-black uppercase tracking-tight line-clamp-1">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                                                                            GIFT
                                                                            (CANT:{" "}
                                                                            {parseInt(
                                                                                item.quantity,
                                                                            )}
                                                                            )
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span className="font-black text-xs uppercase tracking-tighter text-green-600">
                                                                    GRATIS
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t-2 border-black/5">
                                    {/* Shipping Info */}
                                    <div className="space-y-6">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-4">
                                            Detalles de Envío
                                        </h5>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <MapPin
                                                    className="text-neutral-400 shrink-0"
                                                    size={18}
                                                />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-tight">
                                                        Dirección
                                                    </p>
                                                    <p className="text-xs font-bold text-neutral-500 uppercase leading-relaxed">
                                                        {order.address ||
                                                            (order.delivery_type ===
                                                            "store_pickup"
                                                                ? "Recojo en tienda"
                                                                : "Coordinar con soporte")}
                                                        {order.address && (
                                                            <>
                                                                <br />
                                                                <span className="text-[9px] text-neutral-400">
                                                                    {
                                                                        order.district
                                                                    }
                                                                    ,{" "}
                                                                    {order.provincia ||
                                                                        order.province}
                                                                    ,{" "}
                                                                    {order.departamento ||
                                                                        order.department}
                                                                </span>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <Package
                                                    className="text-neutral-400 shrink-0"
                                                    size={18}
                                                />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-tight">
                                                        Método
                                                    </p>
                                                    <p className="text-xs font-bold text-neutral-500 uppercase">
                                                        {order.delivery_type ===
                                                        "store_pickup"
                                                            ? "RECOJO EN TIENDA"
                                                            : order.delivery_type ===
                                                                "agency"
                                                              ? "ENVÍO POR AGENCIA"
                                                              : "DOMICILIO"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <Calendar
                                                    className="text-neutral-400 shrink-0"
                                                    size={18}
                                                />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-tight">
                                                        Fecha de Orden
                                                    </p>
                                                    <p className="text-xs font-bold text-neutral-500 uppercase">
                                                        {new Date(
                                                            order.created_at,
                                                        ).toLocaleDateString(
                                                            "es-PE",
                                                            {
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Summary */}
                                    <div className="bg-neutral-50 p-6 border-2 border-black border-dashed flex flex-col justify-between">
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                                <span>Subtotal</span>
                                                <span>
                                                    {CurrencySymbol()}{" "}
                                                    {Number2Currency(subTotal)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                                <span>I.G.V.</span>
                                                <span>
                                                    {CurrencySymbol()}{" "}
                                                    {Number2Currency(igv)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                                <span>Envío</span>
                                                <span>
                                                    {deliveryCost > 0
                                                        ? `${CurrencySymbol()} ${Number2Currency(deliveryCost)}`
                                                        : "Gratis"}
                                                </span>
                                            </div>
                                            {(couponDiscountAmount > 0 ||
                                                automaticDiscount > 0) && (
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-600">
                                                    <span>
                                                        Beneficios (Dsctos)
                                                    </span>
                                                    <span>
                                                        -{CurrencySymbol()}{" "}
                                                        {Number2Currency(
                                                            couponDiscountAmount +
                                                                automaticDiscount,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 border-t-2 border-black flex justify-between items-end">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                                Total Final
                                            </span>
                                            <span className="text-3xl font-black tracking-tighter">
                                                {CurrencySymbol()}{" "}
                                                {Number2Currency(totalFinal)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Actions - Outside printRef and with ignore attribute for PDF capture */}
            <div
                className="mt-12 p-8 bg-neutral-100 border-2 border-black flex flex-col md:flex-row gap-4 no-print"
                data-html2canvas-ignore="true"
            >
                <ButtonRainstar
                    className="flex-1 flex items-center justify-center gap-3"
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                >
                    <Printer size={18} />
                    <span>Descargar PDF</span>
                </ButtonRainstar>

                <ButtonRainstar
                    variant="secondary"
                    className="flex-1 flex items-center justify-center gap-3"
                    onClick={() => (window.location.href = "/catalogo")}
                >
                    <ShoppingBag size={18} />
                    <span>Seguir Comprando</span>
                </ButtonRainstar>
            </div>
        </div>
    );
}
