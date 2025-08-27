import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import ButtonPrimary from "./ButtonPrimary";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Tippy from "@tippyjs/react";

export default function ConfirmationStepPidelo({ 
    cart, 
    code, 
    delivery, 
    subTotal,
    igv,
    fleteTotal = 0,
    seguroImportacionTotal = 0,
    derechoArancelarioTotal = 0,
    totalFinal,
    couponDiscount = 0, 
    couponCode = null, 
    conversionScripts = null, 
    automaticDiscounts = [], 
    automaticDiscountTotal = 0,
    generals,
    // Nuevas props para la nueva lógica
    valorCIF,
    advDisplay,
    ipmDisplay,
    subTotalConDescuentos
}) {
    console.log('ConfirmationStep - Props received:', {
        cart,
        cartLength: cart?.length,
        subTotal,
        igv,
        totalFinal,
        delivery,
        couponDiscount,
        automaticDiscountTotal,
        seguroImportacionTotal,
        derechoArancelarioTotal,
        fleteTotal
    });

    // NUEVA LÓGICA DE CÁLCULO - usar valores pasados desde el componente padre
    const actualSubTotal = subTotal;
    const actualSubTotalConDescuentos = subTotalConDescuentos || (subTotal - (couponDiscount || 0) - (automaticDiscountTotal || 0));
    const actualIgv = igv;
    const actualFleteTotal = fleteTotal;
    const actualSeguroImportacionTotal = seguroImportacionTotal;
    const actualDerechoArancelarioTotal = derechoArancelarioTotal;
    const actualValorCIF = valorCIF || (actualSubTotalConDescuentos + actualFleteTotal + actualSeguroImportacionTotal);
    const actualAdvDisplay = advDisplay || 0;
    const actualIpmDisplay = ipmDisplay || 0;
    
    // Total final usando la nueva lógica
    const actualTotalFinal = totalFinal;
    
    console.log('ConfirmationStep - Debug totals:', {
        passedSubTotal: subTotal,
        passedIgv: igv,
        actualSubTotal,
        actualIgv,
        passedSeguro: seguroImportacionTotal,
        actualSeguro: actualSeguroImportacionTotal,
        passedDerecho: derechoArancelarioTotal,
        actualDerecho: actualDerechoArancelarioTotal,
        passedTotalFinal: totalFinal,
        actualTotalFinal,
        delivery: delivery,
        fleteTotal: fleteTotal,
        advDisplay: advDisplay,
        ipmDisplay: ipmDisplay,
        valorCIF: valorCIF,
        cart: cart.map(item => ({
            name: item.name,
            type: item.type,
            price: item.price,
            final_price: item.final_price,
            quantity: item.quantity,
            weight: item.weight
        }))
    });

    // Execute conversion scripts when component mounts
    useEffect(() => {
        if (conversionScripts) {
            console.log('Executing conversion scripts...');
            try {
                // Execute the scripts in the head
                if (conversionScripts.head) {
                    const headScript = document.createElement('script');
                    headScript.innerHTML = conversionScripts.head;
                    document.head.appendChild(headScript);
                }
                
                // Execute the scripts in the body
                if (conversionScripts.body) {
                    const bodyScript = document.createElement('script');
                    bodyScript.innerHTML = conversionScripts.body;
                    document.body.appendChild(bodyScript);
                }
                
                console.log('Conversion scripts executed successfully');
            } catch (error) {
                console.error('Error executing conversion scripts:', error);
            }
        }
    }, [conversionScripts]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12"
        >
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center space-y-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.5 }}
                        className="w-20 h-20 bg-secondary rounded-full mx-auto flex items-center justify-center"
                    >
                        <span className="text-4xl">✓</span>
                    </motion.div>

                    <h2 className="text-2xl md:text-3xl customtext-neutral-light animate-bounce">
                        ¡Gracias por tu compra! 🎉
                    </h2>
                    <p className="customtext-neutral-dark text-3xl md:text-5xl font-bold">
                        Tu orden ha sido recibida
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="py-6 px-4 bg-secondary rounded-xl inline-block"
                    >
                        <div className="customtext-neutral-light">Código de pedido</div>
                        <div className="customtext-neutral-dark text-xl font-bold">{`#${code}`}</div>
                    </motion.div>

                    <div className="space-y-6 bg-[#F7F9FB] p-6 md:p-8 rounded-xl shadow-inner">
                        <div className="space-y-6 border-b-2 pb-6">
                            {cart.map((item, index) => {
                                // Función para obtener el precio correcto según el tipo
                                const getItemPrice = () => {
                                    if (item.type === 'combo') {
                                        return item.final_price || item.price;
                                    } else {
                                        return item.final_price;
                                    }
                                };

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                            <div className="bg-gray-50 p-3 rounded-xl">
                                                <img
                                                    src={item?.type === "combo" ? `/storage/images/combo/${item?.image}` : `/storage/images/item/${item?.image}`}
                                                    alt={item?.name}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                    onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                    }
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="text-center sm:text-left flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                                                    <div className="lg:w-8/12">
                                                        <h3 className="font-semibold text-xl line-clamp-3 mb-2">{item?.name}</h3>
                                                        
                                                        {/* Mostrar badge e items del combo */}
                                                        {item.type === 'combo' && (
                                                            <div className="mt-2">
                                                                <div className="mb-2">
                                                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                                        COMBO
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    <span className="font-medium">Contiene:</span>
                                                                    <div className="mt-1">
                                                                        {item.combo_items && item.combo_items.length > 0 ? (
                                                                            item.combo_items.map((comboItem, idx) => (
                                                                                <div key={idx} className="text-xs text-gray-500">
                                                                                    • {comboItem.quantity || 1}x {comboItem.name}
                                                                                </div>
                                                                            ))
                                                                        ) : item.items && item.items.length > 0 ? (
                                                                            item.items.map((comboItem, idx) => (
                                                                                <div key={idx} className="text-xs text-gray-500">
                                                                                    • {comboItem.quantity || 1}x {comboItem.name}
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <span className="text-xs text-gray-400">Información de combo no disponible</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-2 sm:mt-0 text-center lg:text-right lg:w-4/12">
                                                        <div className="font-bold text-lg customtext-primary">
                                                            {CurrencySymbol()}{Number2Currency(getItemPrice() * item?.quantity)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    {item?.brand?.name&&(
                                                    <p className="text-sm customtext-neutral-dark">
                                                        Marca: <span className="customtext-neutral-dark font-medium">{item?.brand?.name || 'N/A'}</span>
                                                    </p>)}
                                                    <p className="text-sm customtext-neutral-dark">
                                                        Cantidad: <span className="customtext-neutral-dark font-medium">{item?.quantity}</span>
                                                    </p>
                                                   {item?.sku && ( <p className="text-sm customtext-neutral-dark">
                                                        SKU: <span className="customtext-neutral-dark font-medium">{item?.sku || 'N/A'}</span>
                                                    </p>)}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-4 mt-6"
                        >
                            {/* Subtotal sin IGV */}
                            <div className="flex justify-between items-center py-2">
                                <span className="customtext-neutral-dark">Subtotal</span>
                                <span className="font-semibold">{CurrencySymbol()}{Number2Currency(actualSubTotal)}</span>
                            </div>
                            
                            {/* Mostrar descuentos si existen */}
                            {(couponDiscount > 0 || automaticDiscountTotal > 0) && (
                                <>
                                    <div className="flex justify-between items-center py-2 text-green-600">
                                        <span className="customtext-neutral-dark">Descuentos aplicados</span>
                                        <span className="font-semibold">-{CurrencySymbol()}{Number2Currency((couponDiscount || 0) + (automaticDiscountTotal || 0))}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-t pt-2">
                                        <span className="customtext-neutral-dark font-semibold">Subtotal con descuentos</span>
                                        <span className="font-semibold">{CurrencySymbol()}{Number2Currency(actualSubTotalConDescuentos)}</span>
                                    </div>
                                </>
                            )}
                            
                            {/* Seguro */}
            {
                Number(generals?.find(x => x.correlative === 'importation_seguro')?.description) > 0 &&
                <div className="flex justify-between items-center py-2">
                    <span className="customtext-neutral-dark">Seguro ({Number(generals?.find(x => x.correlative === 'importation_seguro')?.description || 0).toFixed(2)}%)</span>
                    <span className="font-semibold">{CurrencySymbol()}{Number2Currency(actualSeguroImportacionTotal)}</span>
                </div>
            }
            
            {/* Derecho Arancelario Simplificado */}
            {
                Number(generals?.find(x => x.correlative === 'importation_derecho_arancelario')?.description) > 0 &&
                <div className="flex justify-between items-center py-2">
                    <span className="customtext-neutral-dark">
                        Derecho Arancelario
                        {
                            generals?.find(x => x.correlative === 'importation_derecho_arancelario_descripcion')?.description &&
                            <Tippy content={<p className="whitespace-pre-line">{generals?.find(x => x.correlative === 'importation_derecho_arancelario_descripcion')?.description}</p>} allowHTML>
                                <i className="mdi mdi-information ms-1"></i>
                            </Tippy>
                        }
                    </span>
                    <span className="font-semibold">{CurrencySymbol()}{Number2Currency(actualDerechoArancelarioTotal)}</span>
                </div>
            }
                            
                            {/* Envío */}
            <div className="flex justify-between items-center py-2">
                <span className="customtext-neutral-dark">
                    Envío
                    {
                        generals?.find(x => x.correlative === 'envio_descripcion')?.description &&
                        <Tippy content={<p className="whitespace-pre-line">{generals?.find(x => x.correlative === 'envio_descripcion')?.description}</p>} allowHTML>
                            <i className="mdi mdi-information ms-1"></i>
                        </Tippy>
                    }
                </span>
                <span className="font-semibold">{CurrencySymbol()}{Number2Currency(delivery)}</span>
            </div>

                            {/* Los descuentos ya se muestran en la sección superior del resumen */}

                            <div className="py-4 border-y-2 mt-6">
                                <div className="flex justify-between font-bold text-xl md:text-2xl items-center">
                                    <span>
                                        Total
                                        {
                                            generals?.find(x => x.correlative === 'total_descripcion')?.description &&
                                            <Tippy content={<p className="whitespace-pre-line">{generals?.find(x => x.correlative === 'total_descripcion')?.description}</p>} allowHTML>
                                                <i className="mdi mdi-information ms-1"></i>
                                            </Tippy>
                                        }
                                    </span>
                                    <span>{CurrencySymbol()}{Number2Currency(actualTotalFinal)}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="pt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ButtonPrimary href="/catalogo" className="w-full mx-auto md:w-auto text-white">
                                Seguir Comprando
                            </ButtonPrimary>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
