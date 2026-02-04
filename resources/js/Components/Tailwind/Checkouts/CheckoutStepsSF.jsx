import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";
import CartStepSF from "./Components/CartStepSF";
import ShippingStepSF from "./Components/ShippingStepSF";
import ConfirmationStepSF from "./Components/ConfirmationStepSF";
import Global from "../../../Utils/Global";
import { Local } from "sode-extend-react";
import ProductNavigationSwiper from "../Products/ProductNavigationSwiper";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import General from "../../../Utils/General";

export default function CheckoutStepsSF({ cart, setCart, user, prefixes, ubigeos, items, contacts, data, generals = [] }) {
   
    const [currentStep, setCurrentStep] = useState(1);
    const [descuentofinal, setDescuentoFinal] = useState(0);
    
    // Calcular el precio total incluyendo IGV
    const totalPrice = cart.reduce((acc, item) => {
        // Use the correct price based on item type
        const finalPrice = item.type === 'combo' 
            ? (item.final_price || item.price) 
            : item.final_price;
        return acc + finalPrice * item.quantity; // Sumar el precio total por cantidad
    }, 0);

    // Estado para el costo de envío
    const [envio, setEnvio] = useState(0);
    // Estado para costos adicionales de envío (embalaje, traslado, etc.)
    const [additionalShippingCost, setAdditionalShippingCost] = useState(0);
    const [additionalShippingDescription, setAdditionalShippingDescription] = useState('');
    // Estado para el método de envío seleccionado
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);

    // Obtener configuración de IGV desde General (correlativo: igv_checkout)
    const igvRate = parseFloat(General.igv_checkout || 0);
    
    // Calcular IGV y subtotal según configuración
    // SIEMPRE mostramos el IGV, solo cambia cómo se calcula
    let subTotal, igv;
    if (igvRate > 0) {
        // IGV NO incluido en el precio - ADICIONAR el IGV
        subTotal = totalPrice; // El precio es el subtotal
        igv = parseFloat((totalPrice * (igvRate / 100)).toFixed(2)); // Adicionar IGV
    } else {
        // IGV YA incluido en el precio - SEPARAR el IGV
        subTotal = parseFloat((totalPrice / 1.18).toFixed(2)); // Sacar el IGV
        igv = parseFloat((totalPrice - subTotal).toFixed(2)); // El IGV que ya estaba incluido
    }

    // Estados para cupones y descuentos automáticos
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);
    const [automaticDiscounts, setAutomaticDiscounts] = useState([]);
    const [automaticDiscountTotal, setAutomaticDiscountTotal] = useState(0);

    // Estados para modales de políticas
    const [modalOpen, setModalOpen] = useState(null);
    const openModal = (correlative) => {
      
        setModalOpen(correlative);
    };
    const closeModal = () => setModalOpen(null);

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
        saleback_policy: "Políticas de devolución y cambio",
    };

    // Función para calcular costos adicionales de envío basándose en la configuración
    const calculateAdditionalShippingCost = (deliveryMethod, subtotalAmount) => {
        // Obtener configuración de costos adicionales desde General
        const additionalCostsConfig = General.additional_shipping_costs;
        
        console.log('💰 Calculando costo adicional:', {
            deliveryMethod,
            subtotalAmount,
            config: additionalCostsConfig
        });
        
        if (!additionalCostsConfig || !Array.isArray(additionalCostsConfig) || additionalCostsConfig.length === 0) {
            console.log('⚠️ No hay configuración de costos adicionales');
            return { cost: 0, description: '' };
        }

        // Buscar una regla que aplique
        for (const rule of additionalCostsConfig) {
            console.log('📋 Evaluando regla:', rule);
            
            // Verificar si la regla está habilitada
            if (!rule.enabled) {
                console.log('❌ Regla deshabilitada');
                continue;
            }

            // Verificar si aplica al método de envío
            const methodMatches = rule.delivery_method === 'all' || 
                                rule.delivery_method === deliveryMethod;
            
            console.log('🎯 Método coincide:', methodMatches, `(config: ${rule.delivery_method}, actual: ${deliveryMethod})`);
            
            if (!methodMatches) continue;

            // Verificar rango de montos
            const minAmount = parseFloat(rule.min_amount) || 0;
            const maxAmount = parseFloat(rule.max_amount) || 0;
            
            // Si max_amount es 0, no hay límite superior
            const withinRange = subtotalAmount >= minAmount && 
                              (maxAmount === 0 || subtotalAmount <= maxAmount);
            
            console.log('📊 Rango de monto:', {
                subtotalAmount,
                minAmount,
                maxAmount,
                withinRange
            });
            
            if (!withinRange) continue;

            // Si llegamos aquí, la regla aplica
            console.log('✅ Regla aplicada:', rule);
            return {
                cost: parseFloat(rule.additional_cost) || 0,
                description: rule.description || 'Costo adicional de envío'
            };
        }

        console.log('❌ Ninguna regla aplicó');
        return { cost: 0, description: '' };
    };

    // Calcular total final con todos los descuentos
    const totalWithoutDiscounts = subTotal + igv + parseFloat(envio) + parseFloat(additionalShippingCost);
    const totalAllDiscounts = couponDiscount + automaticDiscountTotal + descuentofinal;
    const totalFinal = Math.max(0, totalWithoutDiscounts - totalAllDiscounts);
    
    const [sale, setSale] = useState([]);
    const [code, setCode] = useState([]);
    const [delivery, setDelivery] = useState([]);

    const [conversionScripts, setConversionScripts] = useState([]);

    // Efecto para detectar el código en la URL
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlCode = params.get("code");
        if (urlCode) {
            setCode(urlCode);
            setCurrentStep(3);
        }
    }, [window.location.search]);

    useEffect(() => {
        if (code) {
            Local.delete(`${Global.APP_CORRELATIVE}_cart`);
        }
    }, [code]);

    useEffect(() => {
        // Cargar script de MercadoPago
        const loadMercadoPagoScript = () => {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.async = true;
            document.body.appendChild(script);
        };

        loadMercadoPagoScript();
    }, []);

    // Function to handle step changes and scroll to top
    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div id={data?.element_id || null} className="min-h-screen bg-[#F7F9FB] py-4 md:py-12 px-2 sm:px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
            <div className="bg-white p-3 md:p-8 rounded-lg md:rounded-xl shadow-sm">
                {/* Steps indicator */}
                <div className="mb-4 md:mb-8">
                    <div className="flex items-center justify-between gap-1 md:gap-4 max-w-3xl mx-auto">
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep >=1 ? `customtext-primary font-medium` : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm bg-primary text-white border-primary`}>1</span>
                            <span className="text-[10px] md:text-sm text-center">Carrito</span>
                        </div>
                        <div className="mb-4 lg:mb-0 flex-1 h-[2px] bg-gray-200 relative">
                            <div 
                                className={`absolute inset-0 transition-all duration-500 bg-primary`} 
                                style={{ width: currentStep > 1 ? "100%" : "0%" }} 
                            />
                        </div>
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep > 1 ? `customtext-primary font-medium` : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep > 1 ? "bg-primary text-white border-transparent" : "bg-white customtext-primary  border-primary"}`}>2</span>
                            <span className="text-[10px] md:text-sm text-center">Envío</span>
                        </div>
                        <div className="mb-4 lg:mb-0 flex-1 h-[2px] bg-gray-200 relative">
                            <div 
                                className={`absolute inset-0 transition-all duration-500 ${data?.gradient ? 'bg-gradient' : 'bg-primary'}`} 
                                style={{ width: currentStep > 2 ? "100%" : "0%" }} 
                            />
                        </div>
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep === 3 ? `${data?.gradient ? 'customtext-gradient' : 'customtext-primary'} font-medium` : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep === 3 ? (data?.gradient ? "bg-gradient text-white border-transparent" : "bg-primary text-white border-primary") : (data?.gradient ? "bg-white customtext-gradient border-gradient" : "bg-white customtext-primary border-primary")}`}>3</span>
                            <span className="text-[10px] md:text-sm text-center">Confirmación</span>
                        </div>
                    </div>
                </div>

                {/* Steps content */}
                {currentStep === 1 && (
                    <CartStepSF
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={user}
                        onContinue={() => handleStepChange(2)}
                        subTotal={subTotal}
                        totalPrice={totalPrice}
                        envio={envio}
                        igv={igv}
                        totalFinal={totalFinal}
                        openModal={openModal}
                        automaticDiscounts={automaticDiscounts}
                        setAutomaticDiscounts={setAutomaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        additionalShippingCost={additionalShippingCost}
                        additionalShippingDescription={additionalShippingDescription}
                    />
                )}

                {currentStep === 2 && (
                    <ShippingStepSF
                        data={data}
                        setCode={setCode}
                        setDelivery={setDelivery}
                        cart={cart}
                        setSale={setSale}
                        setCart={setCart}
                        onContinue={() => handleStepChange(3)}
                        noContinue={() => handleStepChange(1)}
                        subTotal={subTotal}
                        totalPrice={totalPrice}
                        envio={envio}
                        setEnvio={setEnvio}
                        igv={igv}
                        totalFinal={totalFinal}
                        user={user}
                        prefixes={prefixes}
                        contacts={contacts}
                        ubigeos={ubigeos}
                        items={items}
                        descuentofinal={descuentofinal}
                        setDescuentoFinal={setDescuentoFinal}
                        openModal={openModal}
                        setCouponDiscount={setCouponDiscount}
                        setCouponCode={setCouponCode}
                        automaticDiscounts={automaticDiscounts}
                        setAutomaticDiscounts={setAutomaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        additionalShippingCost={additionalShippingCost}
                        setAdditionalShippingCost={setAdditionalShippingCost}
                        additionalShippingDescription={additionalShippingDescription}
                        setAdditionalShippingDescription={setAdditionalShippingDescription}
                        selectedDeliveryMethod={selectedDeliveryMethod}
                        setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                        calculateAdditionalShippingCost={calculateAdditionalShippingCost}
                        conversionScripts={conversionScripts}
                        setConversionScripts={setConversionScripts}
                    />
                )}

                {currentStep === 3 && (
                    <ConfirmationStepSF
                        data={data}
                        code={code}
                        setCart={setCart}
                        delivery={delivery}
                        cart={sale}
                        subTotal={subTotal}
                        totalPrice={totalPrice}
                        envio={envio}
                        igv={igv}
                        totalFinal={totalFinal}
                        descuentofinal={descuentofinal}
                        setDescuentoFinal={setDescuentoFinal}
                        couponDiscount={couponDiscount}
                        couponCode={couponCode}
                        automaticDiscounts={automaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        additionalShippingCost={additionalShippingCost}
                        additionalShippingDescription={additionalShippingDescription}
                        conversionScripts={conversionScripts}
                    />
                )}
            </div>

            {/* <section className="px-[5%] xl:px-[8%] bg-white py-12 xl:py-16 font-paragraph">
                <div className="flex flex-col md:flex-row justify-start items-center bg-gradient-to-br from-[#FFFFFF] to-[#91502D1A] w-full rounded-3xl relative">
                    <div className="flex flex-col gap-5 py-8 px-5 lg:pl-16 xl:pl-20  justify-start items-start w-full 2xl:w-3/5 max-w-xl 2xl:max-w-5xl text-white text-left">
                        <h1 className="customtext-primary text-opacity-20 font-bold text-3xl md:text-4xl xl:text-5xl">
                            ¡Tu compra merece un envío GRATIS!
                        </h1>

                        <p className="customtext-primary  font-normal text-base xl:text-lg 2xl:text-xl">
                        Llévate tus regalos favoritos y obtén envío gratis en compras mayores a {CurrencySymbol()} 100.
                        </p>

                        <div className="flex flex-col">
                            <a className="w-auto bg-primary px-6 py-3 2xl:py-4 2xl:px-8 rounded-3xl text-white font-paragraph leading-none text-base 2xl:text-xl">
                                Seguir comprando
                            </a>
                        </div>
                    </div>

                    <div className="xl:absolute right-0 bottom-0 flex flex-col ml-5 w-full items-end  md:w-6/12 2xl:w-2/5 mt-0 md:-mb-14 ">
                        <img
                            src={"/assets/img/backgrounds/resources/image-cart.png"}
                            onError={(e) =>
                                (e.target.src =
                                    "/assets/img/noimage/no_img.jpg")
                            }
                            className="object-contain min-h-[300px] max-h-[500px] md:object-contain  xl:max-h-[400px]  md:max-h-none w-full object-bottom"
                        />
                    </div>
                </div>
            </section> */}

            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content =
                    generals.find((x) => x.correlative == key)?.description ??
                    "";
             
                
                return (
                     <ReactModal
                        key={key}
                        isOpen={modalOpen === key}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
                        ariaHideApp={false}
                    >
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900 pr-4">{title}</h2>
                                <button
                                    onClick={closeModal}
                                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                                    aria-label="Cerrar modal"
                                >
                                    <X size={24} strokeWidth={2} />
                                </button>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-gray max-w-none">
                                    <HtmlContent html={content} />
                                </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="flex justify-end p-6 border-t border-gray-200">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-primary text-white rounded-lg  transition-colors duration-200 font-medium"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                );
            })}
        </div>
    );
}
