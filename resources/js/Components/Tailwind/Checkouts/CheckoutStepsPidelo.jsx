import { useEffect, useState } from "react";
import CartStepPidelo from "./Components/CartStepPidelo";
import ShippingStep from "./Components/ShippingStep";
import ShippingStepPidelo from "./Components/ShippingStepPidelo";
import ConfirmationStepPidelo from "./Components/ConfirmationStepPidelo";
import Global from "../../../Utils/Global";
import ProductNavigationSwiper from "../Products/ProductNavigationSwiper";
import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { X } from "lucide-react";
import useEcommerceTracking from "../../../Hooks/useEcommerceTracking";

export default function CheckoutStepsPidelo({ cart, setCart, user, ubigeos = [], items, generals,data, categorias }) {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Debug: Monitorear cambios en el carrito
    useEffect(() => {
        const combosInCart = cart.filter(item => item.type === 'combo');
        console.log('🔍 CheckoutSteps cart changed:', {
            totalItems: cart.length,
            combos: combosInCart.length,
            currentStep,
            cart: cart.map(item => ({
                id: item.id,
                name: item.name,
                type: item.type,
                quantity: item.quantity,
                final_price: item.final_price,
                price: item.price
            }))
        });
        
        // Si hay combos pero el carrito se vació repentinamente, alertar
        if (combosInCart.length === 0 && cart.length === 0) {
            console.warn('🚨 ALERT: Cart is empty - this might indicate combos were removed');
        }
    }, [cart, currentStep]);
    
    // Función para calcular precio correcto según tipo de producto
    const getItemPrice = (item) => {
        if (item.type === 'combo') {
            return item.final_price || item.price;
        } else {
            return item.final_price;
        }
    };
    
    const totalPrice = cart.reduce((acc, item) => {
        const itemPrice = getItemPrice(item);
        return acc + (itemPrice * item.quantity);
    }, 0);
    
    console.log(categorias, 'eeeeeeeeeeee');
    // Hook de tracking
    const { 
        trackCheckoutPageView, 
        trackInitiateCheckout, 
        trackPurchase,
        resetTracking
    } = useEcommerceTracking();
    
    // Estados para el cupón
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);
    
    // Estados para descuentos automáticos
    const [automaticDiscounts, setAutomaticDiscounts] = useState([]);
    const [automaticDiscountTotal, setAutomaticDiscountTotal] = useState(0);
    
    // NUEVA LÓGICA DE CÁLCULO:
    // 1. Subtotal (sin IGV, ya que los productos no incluyen IGV)
    const subTotal = totalPrice;
    
    // 2. Aplicar descuentos al subtotal
    const totalAllDiscounts = couponDiscount + automaticDiscountTotal;
    const subTotalConDescuentos = Math.max(0, subTotal - totalAllDiscounts);
    
    const [envio, setEnvio] = useState(0);
    
    // 3. Cálculos de importación sobre el subtotal con descuentos
    // Flete
    const pesoTotal = cart.reduce((acc, item) => {
        const weight = Number(item.weight) || 0;
        return acc + weight * item.quantity; // Peso total considerando cantidad
    }, 0);
    
    const costoxpeso = Number(generals?.find(x => x.correlative === 'importation_flete')?.description) || 0;
    const fleteTotal = costoxpeso > 0 ? pesoTotal * costoxpeso : 0;
    
    // Seguro de importación (sobre subtotal con descuentos)
    const seguroImportacion = (Number(generals?.find(x => x.correlative === 'importation_seguro')?.description) || 0) / 100;
    const seguroImportacionTotal = subTotalConDescuentos * seguroImportacion;
    
    // 4. CIF (Cost, Insurance, Freight) = Subtotal con descuentos + Flete + Seguro
    const valorCIF = parseFloat(subTotalConDescuentos) + parseFloat(fleteTotal) + parseFloat(seguroImportacionTotal);
    
    // 5. Derecho Arancelario sobre el valor CIF
    // ADV: 4% (sobre CIF)
    const advRate = 4 / 100;
    const advTotal = valorCIF * advRate;
    
    // Base para IGV e IPM = CIF + ADV
    const baseIgvIpm = valorCIF + advTotal;
    
    // IGV: 16% (sobre CIF + ADV)
    const igvRate = 16 / 100;
    const igvTotal = baseIgvIpm * igvRate;
    
    // IPM: 2% (sobre CIF + ADV)
    const ipmRate = 2 / 100;
    const ipmTotal = baseIgvIpm * ipmRate;
    
    // Total Derecho Arancelario
    const derechoArancelarioTotal = advTotal + igvTotal + ipmTotal;
    
    // 6. Total Final = Subtotal con descuentos + Derecho Arancelario + Envío
    const totalFinal = subTotalConDescuentos + derechoArancelarioTotal + parseFloat(envio);
    
    // Para compatibilidad con componentes existentes
    const totalWithoutDiscounts = subTotal + parseFloat(envio) + parseFloat(seguroImportacionTotal) + parseFloat(derechoArancelarioTotal);
    
    // Variables individuales para mostrar en el resumen
    const igv = igvTotal; // Para mostrar en el resumen
    const fleteDisplay = fleteTotal;
    const seguroDisplay = seguroImportacionTotal;
    const advDisplay = advTotal;
    const ipmDisplay = ipmTotal;
    
    const [sale, setSale] = useState([]);
    const [code, setCode] = useState([]);
    const [delivery, setDelivery] = useState([]);

    // Estado para tracking de conversión
    const [conversionScripts, setConversionScripts] = useState(null);

    // Tracking inicial del checkout
    useEffect(() => {
        // Track vista inicial del checkout
        trackCheckoutPageView(currentStep, cart);
        
        // Reset tracking cuando se monta el componente
        return () => resetTracking();
    }, []);

    // Tracking cuando cambia el paso
    useEffect(() => {
        trackCheckoutPageView(currentStep, cart);
        
        // Track InitiateCheckout cuando llegan al paso 2 (Shipping)
        if (currentStep === 2) {
            trackInitiateCheckout(cart, totalFinal);
        }
    }, [currentStep]);

    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = Global.CULQI_API;
    //     script.async = true;
    //     script.onload = () => {
    //         window.culqi = function () {
    //             if (window.Culqi.token) {
    //                 //  console.log("✅ Token recibido:", window.Culqi.token.id);
    //             } else if (window.Culqi.order) {
    //                 // console.log("✅ Orden recibida:", window.Culqi.order);
    //             }
    //         };
    //     };
    //     document.body.appendChild(script);
    //     return () => document.body.removeChild(script);
    // }, []);

    // Function to handle step changes and scroll to top
    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
        
        // 'delivery_policy': 'Políticas de envío',
        saleback_policy: "Políticas de devolucion y cambio",
    };
        const [modalOpen, setModalOpen] = useState(null);
    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    return (
        <div className="min-h-screen bg-[#F7F9FB] py-4 md:py-12 px-2 sm:px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
            <div className="bg-white p-3 md:p-8 rounded-lg md:rounded-xl shadow-sm">
                {/* Steps indicator */}
                <div className="mb-4 md:mb-8">
                    <div className="flex items-center justify-between gap-1 md:gap-4 max-w-3xl mx-auto">
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep === 1 ? "customtext-primary font-medium" : "customtext-neutral-dark"}`}>
                            <span className=" bg-primary text-white w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm">1</span>
                            <span className="text-[10px] md:text-sm text-center">Carrito</span>
                        </div>
                        <div className="mb-4 lg:mb-0  flex-1 h-[2px] bg-gray-200 relative">
                            <div className="absolute inset-0 bg-primary transition-all duration-500" style={{ width: currentStep > 1 ? "100%" : "0%" }} />
                        </div>
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep > 1 ? "customtext-primary font-medium" : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep > 1 ? "bg-primary text-white" : "bg-white customtext-primary"}`}>2</span>
                            <span className="text-[10px] md:text-sm text-center">Envío</span>
                        </div>
                        <div className="mb-4 lg:mb-0  flex-1 h-[2px] bg-gray-200 relative">
                            <div className="absolute inset-0 bg-primary transition-all duration-500" style={{ width: currentStep > 2 ? "100%" : "0%" }} />
                        </div>
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep === 3 ? "customtext-primary  font-medium" : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep === 3 ? "bg-primary text-white" : "bg-white customtext-primary"}`}>3</span>
                            <span className="text-[10px] md:text-sm text-center">Confirmación</span>
                        </div>
                    </div>
                </div>

                {/* Steps content */}
                {currentStep === 1 && (
                    <CartStepPidelo 
                            data={data}
                            cart={cart} 
                            setCart={setCart} 
                            onContinue={() => setCurrentStep(2)} 
                            subTotal={subTotal}
                            envio={envio}
                            igv={igv}
                            fleteTotal={fleteDisplay}
                            seguroImportacionTotal={seguroDisplay}
                            derechoArancelarioTotal={derechoArancelarioTotal}
                            totalFinal={totalFinal}
                            openModal={openModal}
                            categorias={categorias}
                            automaticDiscounts={automaticDiscounts}
                            setAutomaticDiscounts={setAutomaticDiscounts}
                            automaticDiscountTotal={automaticDiscountTotal}
                            setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                            totalWithoutDiscounts={totalWithoutDiscounts}
                            generals={generals}
                            valorCIF={valorCIF}
                            advDisplay={advDisplay}
                            ipmDisplay={ipmDisplay}
                            subTotalConDescuentos={subTotalConDescuentos}
                        />
                )}

                {currentStep === 2 && (
                    <ShippingStepPidelo
                    data={data}
                        items={items}
                        setCode={setCode}
                        setDelivery={setDelivery}
                        cart={cart}
                        setSale={setSale}
                        setCart={setCart}
                        onContinue={() => handleStepChange(3)}
                        noContinue={() => handleStepChange(1)}
                        subTotal={subTotal}
                        envio={envio}
                        setEnvio={setEnvio}
                        igv={igv}
                        fleteTotal={fleteDisplay}
                        seguroImportacionTotal={seguroDisplay}
                        derechoArancelarioTotal={derechoArancelarioTotal}
                        totalFinal={totalFinal}
                        user={user}
                        ubigeos={ubigeos}
                        categorias={categorias}
                        openModal={openModal}
                        setCouponDiscount={setCouponDiscount}
                        setCouponCode={setCouponCode}
                        automaticDiscounts={automaticDiscounts}
                        setAutomaticDiscounts={setAutomaticDiscounts}
                        valorCIF={valorCIF}
                        advDisplay={advDisplay}
                        ipmDisplay={ipmDisplay}
                        subTotalConDescuentos={subTotalConDescuentos}
                        automaticDiscountTotal={automaticDiscountTotal}
                        setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        conversionScripts={conversionScripts}
                        setConversionScripts={setConversionScripts}
                        onPurchaseComplete={(orderId, scripts) => {
                            trackPurchase(orderId, scripts);
                        }}
                        generals={generals}
                    />
                )}

                {currentStep === 3 && (
                    <ConfirmationStepPidelo
                        code={code}
                        delivery={delivery}
                        cart={sale}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        fleteTotal={fleteDisplay}
                        seguroImportacionTotal={seguroDisplay}
                        derechoArancelarioTotal={derechoArancelarioTotal}
                        totalFinal={totalFinal}
                        couponDiscount={couponDiscount}
                        couponCode={couponCode}
                        automaticDiscounts={automaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        conversionScripts={conversionScripts}
                        setConversionScripts={setConversionScripts}
                        onPurchaseComplete={(orderId, scripts) => {
                            trackPurchase(orderId, scripts);
                        }}
                        generals={generals}
                        valorCIF={valorCIF}
                        advDisplay={advDisplay}
                        ipmDisplay={ipmDisplay}
                        subTotalConDescuentos={subTotalConDescuentos}
                    />
                )}
            </div>

            {Object.keys(policyItems).map((key, index) => {
                const title = policyItems[key];
                const content =
                    generals.find((x) => x.correlative == key)?.description ??
                    "";
                return (
                     <ReactModal
                        key={index}
                        isOpen={modalOpen === index}
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