import { useEffect, useState } from "react";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../Utils/Number2Currency";
import { recoveryOrderData } from "../../../../Actions/recoveryOrderData";
import ButtonPrimary from "./ButtonPrimary";
import { Local } from "sode-extend-react";
import Global from "../../../../Utils/Global";

export default function ConfirmationStepSF({
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

    // Obtener la tasa de IGV desde la configuración general
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

    if (loading) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow p-6 font-paragraph text-center">
                    <p>Cargando detalles de la orden...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow p-6 font-paragraph text-center text-red-500">
                    <p>Error al cargar la orden: {error}</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow p-6 font-paragraph text-center">
                    <p>No se encontraron datos de la orden</p>
                </div>
            </div>
        );
    }

    // Usar los valores guardados en la orden para evitar discrepancias por recalculo
    // Nota: Intentamos leer de múltiples campos posibles para asegurar compatibilidad
    const igv = parseFloat(order.igv_amount || order.igv || 0);
    const perception = parseFloat(
        order.perception_amount || order.perception || 0,
    );
    const packaging = parseFloat(
        order.packaging_amount || order.packaging || 0,
    );
    const deliveryCost = parseFloat(order.delivery || 0);
    const additionalShippingCost = parseFloat(
        order.additional_shipping_cost || 0,
    );
    const couponDiscountAmount = parseFloat(order.coupon_discount || 0);
    const automaticDiscount = parseFloat(
        order.promotion_discount || order.automatic_discount_total || 0,
    );

    // El monto total ya viene calculado del backend
    const totalFinal = parseFloat(order.amount || order.total_amount || 0);

    // El subtotal de productos (neto de impuestos y envíos)
    // 1. Obtenemos el total de productos con impuestos (bruto)
    const totalProductsGross =
        totalFinal -
        perception -
        packaging -
        deliveryCost -
        additionalShippingCost +
        couponDiscountAmount +
        automaticDiscount;
    // 2. El subtotal neto es el bruto menos el IGV
    const subTotal = totalProductsGross - igv;

    return (
        <div className="mx-auto">
            <div className="bg-white rounded-lg shadow p-6 font-paragraph">
                <div className="text-center space-y-2">
                    <h2 className="text-base xl:text-xl customtext-neutral-light">
                        Gracias por tu compra 🎉
                    </h2>
                    <p className="customtext-neutral-dark text-2xl xl:text-5xl font-semibold">
                        Tu orden ha sido recibida
                    </p>

                    <div className="py-4">
                        <div className=" customtext-neutral-light">
                            Código de pedido
                        </div>
                        <div className="customtext-neutral-dark text-lg font-semibold">
                            #{order.code}
                        </div>
                    </div>

                    <div className="space-y-4 max-w-lg bg-[#F7F9FB] mx-auto p-8 rounded-xl">
                        <div className="space-y-6 border-b-2 pb-6">
                            {order.items.map((item, index) => (
                                <div key={index} className="rounded-lg">
                                    <div className="flex gap-4">
                                        <div className="bg-white rounded-xl w-max">
                                            <img
                                                src={
                                                    item.image
                                                        ? `/storage/images/item/${item.image}`
                                                        : "/assets/img/noimage/no_img.jpg"
                                                }
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/assets/img/noimage/no_img.jpg")
                                                }
                                            />
                                        </div>
                                        <div className="text-start">
                                            <h3 className="font-medium text-lg">
                                                {item.name}
                                                {item.is_free && (
                                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                        ¡GRATIS!
                                                    </span>
                                                )}
                                            </h3>
                                            {item?.color && (
                                                <p className="text-sm customtext-neutral-light">
                                                    Color:{" "}
                                                    <span className="customtext-neutral-dark">
                                                        {item.color}
                                                    </span>
                                                </p>
                                            )}
                                            <p className="text-sm customtext-neutral-light">
                                                Cantidad:{" "}
                                                <span className="customtext-neutral-dark">
                                                    {parseInt(item.quantity)}
                                                </span>{" "}
                                                - Precio:{" "}
                                                <span className="customtext-neutral-dark">
                                                    {" "}
                                                    {CurrencySymbol()}{" "}
                                                    {Number2Currency(
                                                        item.price,
                                                    )}
                                                </span>
                                                {item.is_free && (
                                                    <span className="ml-1 text-green-600 font-semibold">
                                                        (Promoción)
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Mostrar productos gratuitos de descuentos automáticos */}
                            {order.free_items &&
                                order.free_items.length > 0 && (
                                    <>
                                        <div className="pt-4 border-t border-dashed border-green-300">
                                            <h4 className="text-sm font-bold text-green-600 mb-3">
                                                🎁 Productos gratuitos por
                                                promociones:
                                            </h4>
                                            {order.free_items.map(
                                                (item, index) => (
                                                    <div
                                                        key={`free-${index}`}
                                                        className="rounded-lg"
                                                    >
                                                        <div className="flex gap-4">
                                                            <div className="bg-white rounded-xl w-max border-2 border-green-200">
                                                                <img
                                                                    src={
                                                                        item.image
                                                                            ? `/storage/images/item/${item.image}`
                                                                            : "/assets/img/noimage/no_img.jpg"
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="w-20 h-20 object-cover rounded"
                                                                    onError={(
                                                                        e,
                                                                    ) =>
                                                                        (e.target.src =
                                                                            "/assets/img/noimage/no_img.jpg")
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="text-start">
                                                                <h3 className="font-medium text-lg">
                                                                    {item.name}
                                                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                                        ¡GRATIS!
                                                                    </span>
                                                                </h3>
                                                                {item?.color && (
                                                                    <p className="text-sm customtext-neutral-light">
                                                                        Color:{" "}
                                                                        <span className="customtext-neutral-dark">
                                                                            {
                                                                                item.color
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                )}
                                                                <p className="text-sm customtext-neutral-light">
                                                                    Cantidad:{" "}
                                                                    <span className="customtext-neutral-dark">
                                                                        {parseInt(
                                                                            item.quantity,
                                                                        )}
                                                                    </span>
                                                                    <span className="ml-1 text-green-600 font-semibold">
                                                                        - Por
                                                                        promoción
                                                                        "Compra
                                                                        X Lleva
                                                                        Y"
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </>
                                )}
                        </div>

                        <div className="space-y-4 mt-6">
                            <div className="flex justify-between">
                                <span className="customtext-neutral-dark">
                                    Subtotal
                                </span>
                                <span className="font-semibold">
                                    {CurrencySymbol()}{" "}
                                    {Number2Currency(subTotal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="customtext-neutral-dark">
                                    IGV ({igvRate}%)
                                </span>
                                <span className="font-semibold">
                                    {CurrencySymbol()} {Number2Currency(igv)}
                                </span>
                            </div>
                            {perception > 0 && (
                                <div className="flex justify-between">
                                    <span className="customtext-neutral-dark">
                                        Percepción
                                    </span>
                                    <span className="font-semibold">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(perception)}
                                    </span>
                                </div>
                            )}
                            {packaging > 0 && (
                                <div className="flex justify-between">
                                    <span className="customtext-neutral-dark">
                                        Empaque
                                    </span>
                                    <span className="font-semibold">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(packaging)}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="customtext-neutral-dark">
                                    {order.delivery_type === "store_pickup"
                                        ? "Retiro en tienda"
                                        : order.delivery_type === "agency"
                                          ? "Envío por agencia"
                                          : "Envío"}
                                </span>
                                <span className="font-semibold">
                                    {(() => {
                                        // Store pickup is always free
                                        if (
                                            order.delivery_type ===
                                            "store_pickup"
                                        )
                                            return "Gratis";
                                        // Agency with payment on delivery
                                        if (
                                            order.delivery_type === "agency" &&
                                            parseFloat(order.delivery) === 0
                                        )
                                            return "Pago en destino";
                                        // Free shipping
                                        if (parseFloat(order.delivery) === 0)
                                            return "Gratis";
                                        // Regular shipping with cost
                                        return `${CurrencySymbol()} ${Number2Currency(order.delivery)}`;
                                    })()}
                                </span>
                            </div>
                            {order.additional_shipping_cost > 0 && (
                                <div className="flex justify-between text-danger">
                                    <span className="text-sm text-start">
                                        Costo adicional
                                        {order.additional_shipping_description && (
                                            <span className="block text-xs text-neutral-dark">
                                                (
                                                {
                                                    order.additional_shipping_description
                                                }
                                                )
                                            </span>
                                        )}
                                    </span>
                                    <span className="font-semibold">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(
                                            order.additional_shipping_cost,
                                        )}
                                    </span>
                                </div>
                            )}
                            {order.coupon_id && (
                                <div className="mb-2 mt-2 flex justify-between items-center border-b pb-2 text-sm font-bold">
                                    <span>Cupón aplicado </span>
                                    <span>
                                        {CurrencySymbol()} -
                                        {Number2Currency(order.coupon_discount)}
                                    </span>
                                </div>
                            )}
                            {order.automatic_discounts &&
                                order.automatic_discounts.length > 0 && (
                                    <div className="mb-2 mt-2 border-b pb-2">
                                        <div className="text-sm font-bold text-green-600 mb-1">
                                            Descuentos automáticos aplicados:
                                        </div>
                                        {order.automatic_discounts.map(
                                            (discount, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between items-center text-sm"
                                                >
                                                    <span className="text-green-700">
                                                        {discount.rule_name ||
                                                            discount.name ||
                                                            "Descuento automático"}
                                                        <small className="block text-xs font-light text-gray-600">
                                                            {discount.description ||
                                                                "Promoción especial"}
                                                        </small>
                                                    </span>
                                                    <span className="font-semibold text-green-600">
                                                        {CurrencySymbol()} -
                                                        {Number2Currency(
                                                            discount.discount_amount ||
                                                                discount.amount ||
                                                                0,
                                                        )}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                        <div className="flex justify-between items-center text-sm font-bold text-green-600 mt-1 pt-1 border-t">
                                            <span>
                                                Total descuentos automáticos:
                                            </span>
                                            <span>
                                                {CurrencySymbol()} -
                                                {Number2Currency(
                                                    order.automatic_discount_total ||
                                                        0,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            <div className="py-3 border-y-2 mt-6">
                                <div className="flex justify-between font-bold text-[20px] items-center">
                                    <span>Total</span>
                                    <span>
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(totalFinal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <ButtonPrimary
                                href="/catalogo"
                                className={` !rounded-full ${data?.class_button} `}
                            >
                                {" "}
                                Seguir Comprando
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
