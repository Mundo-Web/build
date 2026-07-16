import { useEffect, useState } from "react";
import CartStep from "./Components/CartStep";
import ShippingStep from "./Components/ShippingStep";
import ConfirmationStep from "./Components/ConfirmationStep";
import Global from "../../../Utils/Global";
import ProductNavigationSwiper from "../Products/ProductNavigationSwiper";
import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { X } from "lucide-react";
import useEcommerceTracking from "../../../Hooks/useEcommerceTracking";
import Swal from "sweetalert2";

export default function CheckoutSteps({ cart, setCart, user, ubigeos = [], items, generals,data, categorias }) {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Debug: Monitorear cambios en el carrito
    useEffect(() => {
        const combosInCart = cart.filter(item => item.type === 'combo');
   
        
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
    
  
    // Hook de tracking
    const { 
        trackCheckoutPageView, 
        trackInitiateCheckout, 
        trackPurchase,
        resetTracking
    } = useEcommerceTracking();
    
    // Corregir cálculo del IGV y subtotal
    const subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
    const igv = parseFloat((totalPrice - subTotal).toFixed(2));
    const [envio, setEnvio] = useState(0);
    
    // Cálculos de importación
    // Flete
    const pesoTotal = cart.reduce((acc, item) => {
        const weight = Number(item.weight) || 0;
        return acc + weight * item.quantity; // Peso total considerando cantidad
    }, 0);
    
    const costoxpeso = Number(generals?.find(x => x.correlative === 'importation_flete')?.description) || 0;
    const fleteTotal = costoxpeso > 0 ? pesoTotal * costoxpeso : 0;
    
    // Seguro de importación
    const seguroImportacion = (Number(generals?.find(x => x.correlative === 'importation_seguro')?.description) || 0) / 100;
    const seguroImportacionTotal = subTotal * seguroImportacion;
    
    // CIF (Cost, Insurance, Freight)
    const CIF = parseFloat(subTotal) + parseFloat(fleteTotal) + parseFloat(seguroImportacionTotal);
    
    // Derecho arancelario
    const derechoArancelario = (Number(generals?.find(x => x.correlative === 'importation_derecho_arancelario')?.description) || 0) / 100;
    const derechoArancelarioTotal = CIF * derechoArancelario;
    
    // Estados para el cupón
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);
    
    // Estados para descuentos automáticos
    const [automaticDiscounts, setAutomaticDiscounts] = useState([]);
    const [automaticDiscountTotal, setAutomaticDiscountTotal] = useState(0);
    
    // Calcular total final con todos los descuentos e importaciones
    const totalWithoutDiscounts = subTotal + igv + parseFloat(envio) + parseFloat(seguroImportacionTotal) + parseFloat(derechoArancelarioTotal);
    const totalAllDiscounts = couponDiscount + automaticDiscountTotal;
    const totalFinal = Math.max(0, totalWithoutDiscounts - totalAllDiscounts);
    
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


    // Function to handle step changes and scroll to top
    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleContinueToShipping = async () => {
        const regularItems = cart.filter((x) => (x.type || "item") === "item");
        if (regularItems.length > 0) {
            try {
                const response = await fetch('/api/items/verify-stock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(regularItems.map(x => x.id))
                });
                const itemsStock = await response.json();
                
                let outOfStockList = [];
                let adjustedCart = [...cart];
                let hasChanges = false;

                regularItems.forEach(cartItem => {
                    const dbItem = itemsStock.find(x => x.id == cartItem.id);
                    if (dbItem) {
                        if (!dbItem.stock_unlimited) {
                            if (dbItem.stock <= 0) {
                                outOfStockList.push(`${cartItem.name} (Sin Stock)`);
                                adjustedCart = adjustedCart.filter(x => x.id !== cartItem.id);
                                hasChanges = true;
                            } else if (dbItem.stock < cartItem.quantity) {
                                outOfStockList.push(`${cartItem.name} (Disponible: ${dbItem.stock})`);
                                adjustedCart = adjustedCart.map(x => x.id === cartItem.id ? { ...x, quantity: dbItem.stock } : x);
                                hasChanges = true;
                            }
                        }
                    }
                });

                if (hasChanges) {
                    setCart(adjustedCart);
                    Swal.fire({
                        title: "Ajuste de Stock",
                        html: `Algunos productos en tu carrito ya no tienen suficiente stock y han sido ajustados o eliminados:<br><br>${outOfStockList.map(x => `• ${x}`).join('<br>')}`,
                        icon: "warning",
                        confirmButtonColor: "#000000"
                    });
                    return;
                }
            } catch (err) {
                console.error("Error verifying stock:", err);
            }
        }

        handleStepChange(2);
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
        <div id={data?.element_id || null} className="min-h-screen bg-[#F7F9FB] py-4 md:py-12 px-2 sm:px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
            <div className="bg-white p-3 md:p-8 rounded-lg md:rounded-xl shadow-sm">
                {/* Steps indicator */}
                <div className="mb-4 md:mb-8">
                    <div className="flex items-center justify-between gap-1 md:gap-4 max-w-3xl mx-auto">
                        {/* Paso 1 - Clickeable solo si estamos en paso 2 */}
                        <div 
                            className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep === 1 ? "customtext-primary font-medium" : "customtext-neutral-dark"} ${currentStep === 2 ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
                            onClick={() => currentStep === 2 && handleStepChange(1)}
                        >
                            <span className="bg-primary text-white w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm">1</span>
                            <span className="text-[10px] md:text-sm text-center">Carrito</span>
                        </div>
                        <div className="mb-4 lg:mb-0 flex-1 h-[2px] bg-gray-200 relative">
                            <div className="absolute inset-0 bg-primary transition-all duration-500" style={{ width: currentStep > 1 ? "100%" : "0%" }} />
                        </div>
                        
                        {/* Paso 2 - No clickeable */}
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep > 1 ? "customtext-primary font-medium" : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep > 1 ? "bg-primary text-white" : "bg-white customtext-primary"}`}>2</span>
                            <span className="text-[10px] md:text-sm text-center">Envío</span>
                        </div>
                        <div className="mb-4 lg:mb-0 flex-1 h-[2px] bg-gray-200 relative">
                            <div className="absolute inset-0 bg-primary transition-all duration-500" style={{ width: currentStep > 2 ? "100%" : "0%" }} />
                        </div>
                        
                        {/* Paso 3 - No clickeable */}
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep === 3 ? "customtext-primary font-medium" : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep === 3 ? "bg-primary text-white" : "bg-white customtext-primary"}`}>3</span>
                            <span className="text-[10px] md:text-sm text-center">Confirmación</span>
                        </div>
                    </div>
                </div>

                {/* Steps content */}
                {currentStep === 1 && (
                    <CartStep
                    data={data}
                        cart={cart}
                        setCart={setCart}
                        onContinue={handleContinueToShipping}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        fleteTotal={fleteTotal}
                        seguroImportacionTotal={seguroImportacionTotal}
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
                    />
                )}

                {currentStep === 2 && (
                    <ShippingStep
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
                        fleteTotal={fleteTotal}
                        seguroImportacionTotal={seguroImportacionTotal}
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
                    <ConfirmationStep
                        code={code}
                        delivery={delivery}
                        cart={sale}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        fleteTotal={fleteTotal}
                        seguroImportacionTotal={seguroImportacionTotal}
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