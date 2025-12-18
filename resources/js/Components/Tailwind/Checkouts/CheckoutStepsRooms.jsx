import { useEffect, useState, useMemo } from "react";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";
import CartStepRooms from "./Components/CartStepRooms";
import BookingStepRooms from "./Components/BookingStepRooms";
import ConfirmationStepRooms from "./Components/ConfirmationStepRooms";
import Global from "../../../Utils/Global";
import { Local } from "sode-extend-react";
import General from "../../../Utils/General";

export default function CheckoutStepsRooms({ cart, setCart, user, prefixes, ubigeos, items, contacts, data, generals = [] }) {
   
    const [currentStep, setCurrentStep] = useState(1);
    
    // Filtrar solo las reservas de habitaciones (type === 'booking') del cart principal
    const bookingsCart = useMemo(() => {
        return cart.filter(item => item.type === 'booking');
    }, [cart]);

    // Función para actualizar solo las reservas en el cart
    const setBookingsCart = (newBookingsOrUpdater) => {
        setCart(prevCart => {
            const otherItems = prevCart.filter(item => item.type !== 'booking');
            const newBookings = typeof newBookingsOrUpdater === 'function' 
                ? newBookingsOrUpdater(prevCart.filter(item => item.type === 'booking'))
                : newBookingsOrUpdater;
            return [...otherItems, ...newBookings];
        });
    };
    
    // Calcular el precio total de las habitaciones (precio por noche * número de noches)
    const totalPrice = bookingsCart.reduce((acc, room) => {
        const pricePerNight = room.final_price || room.price;
        const nights = room.nights || 1;
        return acc + (pricePerNight * nights);
    }, 0);

    // Obtener configuración de IGV desde General (correlativo: igv_checkout)
    const igvRate = parseFloat(General.igv_checkout || 0);
    
    // Calcular IGV y subtotal según configuración
    let subTotal, igv;
    if (igvRate > 0) {
        // IGV NO incluido en el precio - ADICIONAR el IGV
        subTotal = totalPrice;
        igv = parseFloat((totalPrice * (igvRate / 100)).toFixed(2));
    } else {
        // IGV YA incluido en el precio - SEPARAR el IGV
        subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
        igv = parseFloat((totalPrice - subTotal).toFixed(2));
    }

    // Estados para cupones y descuentos (habitaciones no tienen descuentos automáticos por cantidad)
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);

    // Estados para modales de políticas
    const [modalOpen, setModalOpen] = useState(null);
    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(null);

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
        saleback_policy: "Políticas de cancelación y cambios",
    };

    // Calcular total final
    const totalWithoutDiscounts = subTotal + igv;
    const totalFinal = Math.max(0, totalWithoutDiscounts - couponDiscount);
    
    const [booking, setBooking] = useState([]);
    const [code, setCode] = useState([]);

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
            // Limpiar las reservas (bookings) del cart principal, mantener otros productos
            setCart(prevCart => prevCart.filter(item => item.type !== 'booking'));
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
        <div className="min-h-screen bg-[#F7F9FB] py-4 md:py-12 px-2 sm:px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
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
                            <span className="text-[10px] md:text-sm text-center">Pago</span>
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
                    <CartStepRooms
                        data={data}
                        cart={bookingsCart}
                        setCart={setBookingsCart}
                        onContinue={() => handleStepChange(2)}
                        subTotal={subTotal}
                        totalPrice={totalPrice}
                        igv={igv}
                        totalFinal={totalFinal}
                        openModal={openModal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                    />
                )}

                {currentStep === 2 && (
                    <BookingStepRooms
                        data={data}
                        setCode={setCode}
                        cart={bookingsCart}
                        setBooking={setBooking}
                        setCart={setBookingsCart}
                        onContinue={() => handleStepChange(3)}
                        noContinue={() => handleStepChange(1)}
                        subTotal={subTotal}
                        totalPrice={totalPrice}
                        igv={igv}
                        totalFinal={totalFinal}
                        user={user}
                        prefixes={prefixes}
                        contacts={contacts}
                        ubigeos={ubigeos}
                        items={items}
                        openModal={openModal}
                        setCouponDiscount={setCouponDiscount}
                        setCouponCode={setCouponCode}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                    />
                )}

                {currentStep === 3 && (
                    <ConfirmationStepRooms
                        data={data}
                        code={code}
                        setCart={setBookingsCart}
                        cart={booking}
                        subTotal={subTotal}
                        totalPrice={totalPrice}
                        igv={igv}
                        totalFinal={totalFinal}
                        couponDiscount={couponDiscount}
                        couponCode={couponCode}
                        totalWithoutDiscounts={totalWithoutDiscounts}
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
