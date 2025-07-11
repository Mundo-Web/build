import Number2Currency from "../../../../Utils/Number2Currency";
import ButtonPrimary from "./ButtonPrimary";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ConfirmationStep({ cart, code, delivery, couponDiscount = 0, couponCode = null, conversionScripts = null, automaticDiscounts = [], automaticDiscountTotal = 0 }) {
    const totalPrice = cart.reduce((acc, item) => {
        const finalPrice = item.final_price;
        return acc + finalPrice * item.quantity;
    }, 0);

   
    const subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
    const igv = parseFloat((totalPrice - subTotal).toFixed(2));

    const totalBeforeDiscount = parseFloat(subTotal) + parseFloat(igv) + parseFloat(delivery);
    const totalFinal = totalBeforeDiscount - couponDiscount - automaticDiscountTotal;

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
                            {cart.map((item, index) => (
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
                                                src={`/storage/images/item/${item.image}`}
                                                alt={item.name}
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
                                                <h3 className="font-semibold text-xl lg:w-8/12 line-clamp-3">{item.name}</h3>
                                                <div className="mt-2 sm:mt-0 text-center lg:text-right lg:w-4/12">
                                                    <div className="font-bold text-lg customtext-primary">S/ {Number2Currency(item.final_price * item.quantity)}</div>

                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <p className="text-sm customtext-neutral-light">Marca: <span className="customtext-neutral-dark font-medium">{item.brand.name}</span></p>
                                                <p className="text-sm customtext-neutral-light">Cantidad: <span className="customtext-neutral-dark font-medium">{item.quantity}</span></p>
                                                <p className="text-sm customtext-neutral-light">SKU: <span className="customtext-neutral-dark font-medium">{item.sku}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-4 mt-6"
                        >
                            {[
                                { label: "Subtotal", value: subTotal },
                                { label: "IGV", value: igv },
                                { label: "Envío", value: delivery }
                            ].map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <span className="customtext-neutral-dark">{item.label}</span>
                                    <span className="font-semibold">S/ {Number2Currency(item.value)}</span>
                                </div>
                            ))}

                            {/* Mostrar descuento del cupón si existe */}
                            {couponDiscount > 0 && couponCode && (
                                <div className="flex justify-between items-center py-2">
                                    <span className="customtext-neutral-dark text-start">
                                        Cupón: <br className="lg:hidden"/>
                                        <span className="font-semibold text-xs lg:text-base">({couponCode})</span>
                                    </span>
                                    <span className="font-semibold">-S/ {Number2Currency(couponDiscount)}</span>
                                </div>
                            )}

                            {/* Mostrar descuentos automáticos si existen */}
                            {automaticDiscountTotal > 0 && automaticDiscounts.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-xl md:text-2xl font-bold pb-4 md:pb-6 customtext-neutral-dark mb-2">
                                  🎉 Descuentos aplicados:
                                </div>
                                {automaticDiscounts.map((discount, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span className="customtext-neutral-dark">
                                      {discount.name}
                                      {discount.description && (
                                        <span className="text-xs font-semibold block">
                                          {discount.description}
                                        </span>
                                      )}
                                    </span>
                                    <span className="customtext-neutral-dark font-semibold">
                                      -S/ {Number2Currency(discount.amount)}
                                    </span>
                                  </div>
                                ))}
                                <div className="flex justify-between text-sm font-semibold customtext-neutral-dark pt-1">
                                  <span>Total descuentos:</span>
                                  <span>-S/ {Number2Currency(automaticDiscountTotal)}</span>
                                </div>
                              </div>
                            )}

                            <div className="py-4 border-y-2 mt-6">
                                <div className="flex justify-between font-bold text-xl md:text-2xl items-center">
                                    <span>Total</span>
                                    <span>S/ {Number2Currency(totalFinal)}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="pt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <ButtonPrimary href="/catalogo" className="w-full mx-auto md:w-auto">
                                Seguir Comprando
                            </ButtonPrimary>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
