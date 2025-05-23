import { useEffect, useState } from "react";
import CartStep from "./Components/CartStep";
import ShippingStep from "./Components/ShippingStep";
import ConfirmationStep from "./Components/ConfirmationStep";
import Global from "../../../Utils/Global";

export default function CheckoutSteps({ cart, setCart, user, ubigeos = [], items }) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalPrice = cart.reduce((acc, item) => acc + item.final_price * item.quantity, 0);
    const subTotal = (totalPrice / 1.18).toFixed(2);
    const igv = (subTotal * 0.18).toFixed(2);
    const [envio, setEnvio] = useState(0);
    const totalFinal = parseFloat(subTotal) + parseFloat(igv) + parseFloat(envio);
    const [sale, setSale] = useState([]);
    const [code, setCode] = useState([]);
    const [delivery, setDelivery] = useState([]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = Global.CULQI_API;
        script.async = true;
        script.onload = () => {
            window.culqi = function () {
                if (window.Culqi.token) {
                    console.log("✅ Token recibido:", window.Culqi.token.id);
                } else if (window.Culqi.order) {
                    console.log("✅ Orden recibida:", window.Culqi.order);
                }
            };
        };
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    // Function to handle step changes and scroll to top
    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep >  2 ? "customtext-primary font-medium" : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep > 2 ?"bg-primary text-white":"bg-white customtext-primary"}`}>2</span>
                            <span className="text-[10px] md:text-sm text-center">Envío</span>
                        </div>
                        <div className="mb-4 lg:mb-0  flex-1 h-[2px] bg-gray-200 relative">
                            <div className="absolute inset-0 bg-primary transition-all duration-500" style={{ width: currentStep > 2 ? "100%" : "0%" }} />
                        </div>
                        <div className={`flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2 ${currentStep === 3 ? "customtext-primary  font-medium" : "customtext-neutral-dark"}`}>
                            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm ${currentStep === 3 ?"bg-primary text-white":"bg-white customtext-primary"}`}>3</span>
                            <span className="text-[10px] md:text-sm text-center">Confirmación</span>
                        </div>
                    </div>
                </div>

                {/* Steps content */}
                {currentStep === 1 && (
                    <CartStep
                        cart={cart}
                        setCart={setCart}
                        onContinue={() => handleStepChange(2)}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        totalFinal={totalFinal}
                    />
                )}

                {currentStep === 2 && (
                    <ShippingStep
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
                        totalFinal={totalFinal}
                        user={user}
                        ubigeos={ubigeos}
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
                        totalFinal={totalFinal}
                    />
                )}
            </div>
        </div>
    );
}