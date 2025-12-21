import { useEffect, useState, useRef } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import { processMercadoPagoPayment } from "../../../../Actions/mercadoPagoPayment";
import { processCulqiPayment } from "../../../../Actions/culqiPayment";
import { processOpenPayPayment } from "../../../../Actions/openPayPayment";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import PaymentModal from "./PaymentModal";
import OpenPayCardModal from "./OpenPayCardModal";
// Usar modales de voucher específicos para reservas de hotel (no usan /api/sales)
import UploadVoucherModalYapeBooking from "./UploadVoucherModalYapeBooking";
import UploadVoucherModalBancsBooking from "./UploadVoucherModalBancsBooking";
import { 
    CircleX, 
    InfoIcon, 
    UserRoundX, 
    CheckCircle, 
    XCircle,
    Calendar,
    Users,
    Moon,
    Clock,
    ShieldCheck,
    CreditCard,
    Building2
} from "lucide-react";
import Select from "react-select";
import { toast } from "sonner";
import Global from "../../../../Utils/Global";
import General from "../../../../Utils/General";
import CouponsRest from "../../../../Actions/CouponsRest";
import ReactModal from "react-modal";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BookingStepRooms({
    cart,
    setBooking,
    setCode,
    setCart,
    onContinue,
    noContinue,
    subTotal,
    igv,
    totalFinal,
    user,
    prefixes = [],
    ubigeos = [],
    contacts = [],
    totalPrice,
    data,
    openModal,
    setCouponDiscount: setParentCouponDiscount,
    setCouponCode: setParentCouponCode,
    totalWithoutDiscounts,
}) {
    // Función para formatear el número de teléfono evitando duplicación de prefijos
    const formatPhoneNumber = (phonePrefix, phoneNumber) => {
        if (!phoneNumber) return "";
        if (phoneNumber.startsWith(phonePrefix)) {
            return phoneNumber;
        }
        return `${phonePrefix}${phoneNumber}`;
    };

    // Función para limpiar el número de teléfono del usuario removiendo prefijos duplicados
    const cleanPhoneNumber = (phoneNumber, phonePrefix) => {
        if (!phoneNumber) return "";
        if (phoneNumber.startsWith(phonePrefix)) {
            return phoneNumber.substring(phonePrefix.length);
        }
        return phoneNumber;
    };

    const couponRef = useRef(null);
    const [coupon, setCoupon] = useState(null);

    // Tipos de documentos
    const typesDocument = [
        { value: "dni", label: "DNI" },
        { value: "ruc", label: "RUC" },
        { value: "ce", label: "CE" },
        { value: "pasaporte", label: "Pasaporte" },
    ];

    const [formData, setFormData] = useState(() => {
        const initialPhonePrefix = user?.phone_prefix || "51";
        const initialPhone = cleanPhoneNumber(user?.phone || "", initialPhonePrefix);

        return {
            name: user?.name || "",
            lastname: user?.lastname || "",
            email: user?.email || "",
            phone_prefix: initialPhonePrefix,
            phone: initialPhone,
            documentType: user?.document_type?.toLowerCase() || "dni",
            document: user?.document_number || "",
            comment: "",
            specialRequests: "",
            invoiceType: user?.invoiceType || "boleta",
            businessName: user?.businessName || "",
        };
    });

    // Efecto para actualizar formData cuando cambien los datos del usuario
    useEffect(() => {
        if (user) {
            const userPhonePrefix = user.phone_prefix || "51";
            const cleanedPhone = cleanPhoneNumber(user.phone || "", userPhonePrefix);

            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                lastname: user.lastname || "",
                email: user.email || "",
                phone_prefix: userPhonePrefix,
                phone: cleanedPhone,
                documentType: user.document_type?.toLowerCase() || "dni",
                document: user.document_number || "",
                invoiceType: user.invoiceType || "boleta",
                businessName: user.businessName || "",
            }));
        }
    }, [user]);

    const getContact = (correlative) => {
        return (
            contacts.find((contact) => contact.correlative === correlative)
                ?.description || ""
        );
    };

    // Verificar si hay métodos de pago disponibles
    const hasPaymentMethods = (() => {
        const ischeckmpobject = contacts?.find(x => x.correlative === 'checkout_mercadopago');
        const ischeckopenpayobject = contacts?.find(x => x.correlative === 'checkout_openpay');
        const ischeckculqiobject = contacts?.find(x => x.correlative === 'checkout_culqi');

        return (
            ischeckmpobject?.description === "true" ||
            ischeckopenpayobject?.description === "true" ||
            ischeckculqiobject?.description === "true" ||
            General.get("checkout_dwallet") === "true" ||
            General.get("checkout_transfer") === "true"
        );
    })();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Si cambia el tipo de comprobante, actualizar el tipo de documento por defecto
        if (name === "invoiceType") {
            setFormData(prev => ({
                ...prev,
                documentType: value === "factura" ? "ruc" : "dni",
                document: "",
                businessName: value === "factura" ? prev.businessName : ""
            }));
        }
    };

    // Estados para manejar los valores seleccionados
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Estados para cupones
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    // Estado para modal de login
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Estado para la comisión del método de pago
    const [paymentCommission, setPaymentCommission] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // Función auxiliar para redondear a 2 decimales
    const roundToTwoDecimals = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    // Calcular descuento del cupón
    const calculatedCouponDiscount = (() => {
        if (!appliedCoupon) return 0;

        const totalBase = roundToTwoDecimals(subTotal + igv);

        if (appliedCoupon.discount_type === 'percentage') {
            const percentage = parseFloat(appliedCoupon.discount_value) || 0;
            return roundToTwoDecimals(totalBase * (percentage / 100));
        } else {
            return roundToTwoDecimals(parseFloat(appliedCoupon.discount_value) || 0);
        }
    })();

    // Calcular el total base (subtotal + IGV)
    const totalBase = roundToTwoDecimals(subTotal + igv);

    // Calcular comisión del método de pago
    const commissionAmount = (() => {
        if (!selectedPaymentMethod || paymentCommission <= 0) return 0;
        const totalBeforeCommission = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
        return roundToTwoDecimals(totalBeforeCommission * (paymentCommission / 100));
    })();

    // Calcular el total final con cupón
    const finalTotalWithCoupon = (() => {
        const totalBeforeDiscount = roundToTwoDecimals(totalBase);
        const afterCoupon = Math.max(0, roundToTwoDecimals(totalBeforeDiscount - calculatedCouponDiscount));
        const finalTotal = roundToTwoDecimals(afterCoupon + commissionAmount);
        return Math.max(0, finalTotal);
    })();

    // Función de validación
    const validateForm = () => {
        const newErrors = {};

        // Validación de campos obligatorios
        if (!formData.name) newErrors.name = "Nombre es requerido";
        if (!formData.lastname) newErrors.lastname = "Apellido es requerido";
        if (!formData.email) newErrors.email = "Email es requerido";
        if (!formData.phone) newErrors.phone = "Teléfono es requerido";
        if (!formData.document) newErrors.document = "Documento es requerido";

        // Validación de email
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }

        // Validación de documento según tipo
        if (formData.document) {
            if (formData.documentType === "dni" && formData.document.length !== 8) {
                newErrors.document = "DNI debe tener 8 dígitos";
            } else if (formData.documentType === "ruc" && formData.document.length !== 11) {
                newErrors.document = "RUC debe tener 11 dígitos";
            }
        }

        // Validación de razón social para factura
        if (formData.invoiceType === "factura" && !formData.businessName) {
            newErrors.businessName = "Razón social es requerida para factura";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Función para enfocar el primer campo con error
    const focusFirstError = (errors) => {
        const firstErrorKey = Object.keys(errors)[0];

        setTimeout(() => {
            let targetElement = document.querySelector(`[name="${firstErrorKey}"]`);

            if (targetElement) {
                targetElement.classList.add('highlight-error');
                setTimeout(() => targetElement.classList.remove('highlight-error'), 2000);

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                if (['INPUT', 'SELECT', 'TEXTAREA'].includes(targetElement.tagName)) {
                    targetElement.focus();
                }
            }
        }, 100);
    };

    // Función para aplicar cupón
    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Ingresa un código de cupón");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            const response = await CouponsRest.validate({
                code: couponCode,
                total: totalBase
            });

            if (response.valid) {
                setAppliedCoupon(response.coupon);
                setCoupon(response.coupon);

                if (setParentCouponDiscount) {
                    if (response.coupon.discount_type === 'percentage') {
                        const discount = totalBase * (parseFloat(response.coupon.discount_value) / 100);
                        setParentCouponDiscount(roundToTwoDecimals(discount));
                    } else {
                        setParentCouponDiscount(roundToTwoDecimals(parseFloat(response.coupon.discount_value)));
                    }
                }
                if (setParentCouponCode) {
                    setParentCouponCode(couponCode);
                }

                toast.success('Cupón aplicado', {
                    description: `Descuento de ${response.coupon.discount_type === 'percentage' ? response.coupon.discount_value + '%' : CurrencySymbol() + ' ' + response.coupon.discount_value}`,
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    duration: 3000,
                    position: 'top-right',
                });
            } else {
                setCouponError(response.message || "Cupón no válido");
            }
        } catch (error) {
            console.error("Error validating coupon:", error);
            setCouponError("Error al validar el cupón");
        } finally {
            setCouponLoading(false);
        }
    };

    // Función para remover cupón
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCoupon(null);
        setCouponCode("");
        setCouponError("");

        if (setParentCouponDiscount) {
            setParentCouponDiscount(0);
        }
        if (setParentCouponCode) {
            setParentCouponCode(null);
        }
    };

    // Formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, "dd MMM yyyy", { locale: es });
        } catch (error) {
            return dateString;
        }
    };

    // Estados para modales de pago
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showOpenPayModal, setShowOpenPayModal] = useState(false);
    const [openPayTokenData, setOpenPayTokenData] = useState(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [showVoucherModalBancs, setShowVoucherModalBancs] = useState(false);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
    const [paymentRequest, setPaymentRequest] = useState(null);

    const handleContinueClick = (e) => {
        e.preventDefault();

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!validateForm()) {
            focusFirstError(errors);
            return;
        }

        setShowPaymentModal(true);
    };

    const handlePaymentComplete = async (paymentMethod) => {
        try {
            // Establecer la comisión según el método de pago seleccionado
            let commission = 0;
            switch (paymentMethod) {
                case 'tarjeta':
                    commission = parseFloat(Global.get("checkout_mercadopago_commission") || 0);
                    break;
                case 'culqi':
                    commission = parseFloat(Global.get("checkout_culqi_commission") || 0);
                    break;
                case 'openpay':
                    commission = parseFloat(Global.get("checkout_openpay_commission") || 0);
                    break;
                case 'yape':
                    commission = parseFloat(Global.get("checkout_dwallet_commission") || 0);
                    break;
                case 'transferencia':
                    commission = parseFloat(Global.get("checkout_transfer_commission") || 0);
                    break;
                default:
                    commission = 0;
            }
            setPaymentCommission(commission);
            setSelectedPaymentMethod(paymentMethod);

            setShowPaymentModal(false);
            setCurrentPaymentMethod(paymentMethod);

            // Si es OpenPay, abrir el modal para capturar datos de tarjeta
            if (paymentMethod === "openpay") {
                setShowOpenPayModal(true);
                return;
            }

            // Calcular totales finales
            const commissionAmt = roundToTwoDecimals((totalBase - calculatedCouponDiscount) * (commission / 100));
            const finalTotal = roundToTwoDecimals(totalBase - calculatedCouponDiscount + commissionAmt);

            // Preparar datos de habitaciones para la reserva (serializado como JSON)
            const roomsData = cart.map(room => ({
                id: room.id,
                name: room.name,
                room_type: room.room_type,
                check_in: room.check_in || room.checkIn,
                check_out: room.check_out || room.checkOut,
                nights: room.nights || 1,
                guests: room.guests || 2,
                adults: room.adults || room.guests || 2,
                children: room.children || 0,
                price: room.price,
                final_price: room.final_price || room.price,
                image: room.image,
            }));

            const request = {
                user_id: user?.id || "",
                name: formData?.name || "",
                lastname: formData?.lastname || "",
                fullname: `${formData?.name} ${formData?.lastname}`,
                phone_prefix: formData?.phone_prefix || "51",
                email: formData?.email || "",
                phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                country: "Perú",
                comment: formData?.comment || "",
                special_requests: formData?.specialRequests || "",
                amount: finalTotal || 0,
                delivery_type: "domicilio",
                // Usar details serializado como en ShippingStepSF para Yape/Transferencia
                details: JSON.stringify(roomsData),
                // Mantener cart para otros métodos de pago (MercadoPago, Culqi, OpenPay)
                cart: roomsData,
                booking_type: "rooms",
                invoiceType: formData.invoiceType || "",
                documentType: formData.documentType || "",
                document: formData.document || "",
                businessName: formData.businessName || "",
                payment_method: paymentMethod || null,
                coupon_id: appliedCoupon ? appliedCoupon.id : null,
                coupon_discount: calculatedCouponDiscount || 0,
                payment_commission: commissionAmt || 0,
                payment_commission_percentage: commission || 0,
                total_amount: finalTotal || 0,
            };

            setPaymentRequest(request);

            if (paymentMethod === "tarjeta") {
                // Procesar pago con tarjeta (MercadoPago)
                if (!window.MercadoPago) {
                    console.error("❌ MercadoPago aún no se ha cargado.");
                    return;
                }

                try {
                    const response = await processMercadoPagoPayment(request);
                    const data = response;

                    if (data.status) {
                        setBooking(data.sale);
                        setCode(data.code);
                        onContinue();
                    } else {
                        toast.error('Error en el Pago', {
                            description: `El pago ha sido rechazado`,
                            icon: <CircleX className="h-5 w-5 text-red-500" />,
                            duration: 3000,
                            position: 'bottom-center',
                        });
                    }
                } catch (error) {
                    toast.error('Error en el Pago', {
                        description: `No se llegó a procesar el pago`,
                        icon: <CircleX className="h-5 w-5 text-red-500" />,
                        duration: 3000,
                        position: 'bottom-center',
                    });
                }
            } else if (paymentMethod === "culqi") {
                // Procesar pago con Culqi
                setPaymentLoading(true);

                try {
                    if (!Global.CULQI_ENABLED) {
                        toast.error("Método de pago no disponible", {
                            description: "El procesamiento de pagos con Culqi está temporalmente deshabilitado",
                            icon: <CircleX className="h-5 w-5 text-red-500" />,
                            duration: 4000,
                            position: "top-center",
                        });
                        setPaymentLoading(false);
                        return;
                    }

                    const response = await processCulqiPayment(request);

                    if (response.status) {
                        setBooking(response.sale);
                        setCode(response.code);
                        onContinue();
                    } else {
                        toast.error('Error en el Pago', {
                            description: response.message || `El pago ha sido rechazado`,
                            icon: <CircleX className="h-5 w-5 text-red-500" />,
                            duration: 3000,
                            position: 'bottom-center',
                        });
                    }
                } catch (error) {
                    toast.error('Error en el Pago', {
                        description: `No se llegó a procesar el pago`,
                        icon: <CircleX className="h-5 w-5 text-red-500" />,
                        duration: 3000,
                        position: 'bottom-center',
                    });
                } finally {
                    setPaymentLoading(false);
                }
            } else if (paymentMethod === "yape") {
                setPaymentRequest(request);
                setShowVoucherModal(true);
            } else if (paymentMethod === "transferencia") {
                setPaymentRequest(request);
                setShowVoucherModalBancs(true);
            }
        } catch (error) {
            console.error("Error en pago:", error);
            toast.error('Error', {
                description: `Ocurrió un error inesperado`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'bottom-center',
            });
        }
    };

    // Procesar pago con OpenPay
    const handleOpenPayPayment = async (tokenData) => {
        setShowOpenPayModal(false);

        try {
            const commissionAmt = roundToTwoDecimals((totalBase - calculatedCouponDiscount) * (paymentCommission / 100));
            const finalTotal = roundToTwoDecimals(totalBase - calculatedCouponDiscount + commissionAmt);

            const roomsData = cart.map(room => ({
                id: room.id,
                name: room.name,
                room_type: room.room_type,
                checkIn: room.checkIn,
                checkOut: room.checkOut,
                nights: room.nights || 1,
                guests: room.guests || 2,
                adults: room.adults || room.guests || 2,
                children: room.children || 0,
                price: room.price,
                final_price: room.final_price || room.price,
                image: room.image,
            }));

            const request = {
                ...tokenData,
                user_id: user?.id || "",
                name: formData?.name || "",
                lastname: formData?.lastname || "",
                fullname: `${formData?.name} ${formData?.lastname}`,
                phone_prefix: formData?.phone_prefix || "51",
                email: formData?.email || "",
                phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                country: "Perú",
                comment: formData?.comment || "",
                special_requests: formData?.specialRequests || "",
                amount: finalTotal || 0,
                cart: roomsData,
                booking_type: "rooms",
                invoiceType: formData.invoiceType || "",
                documentType: formData.documentType || "",
                document: formData.document || "",
                businessName: formData.businessName || "",
                payment_method: "openpay",
                coupon_id: appliedCoupon ? appliedCoupon.id : null,
                coupon_discount: calculatedCouponDiscount || 0,
                payment_commission: commissionAmt || 0,
                payment_commission_percentage: paymentCommission || 0,
                total_amount: finalTotal || 0,
            };

            const response = await processOpenPayPayment(request);

            if (response.status) {
                setBooking(response.sale);
                setCode(response.code);
                onContinue();
            } else {
                toast.error('Error en el Pago', {
                    description: response.message || `El pago ha sido rechazado`,
                    icon: <CircleX className="h-5 w-5 text-red-500" />,
                    duration: 3000,
                    position: 'bottom-center',
                });
            }
        } catch (error) {
            console.error("Error en pago OpenPay:", error);
            toast.error('Error en el Pago', {
                description: `No se llegó a procesar el pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'bottom-center',
            });
        }
    };

    // Calcular total de noches
    const totalNights = cart.reduce((acc, room) => acc + (room.nights || 1), 0);
    const totalGuests = cart.reduce((acc, room) => acc + (room.guests || 2), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-paragraph">
            {/* Formulario de datos del huésped */}
            <div className="lg:col-span-2 space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold customtext-neutral-dark mb-2">
                        Datos de la reserva
                    </h1>
                    <p className="customtext-neutral-light">
                        Completa tus datos para confirmar la reserva
                    </p>
                </div>

             

                {/* Datos personales */}
                <div className="bg-white border border-sections-color rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold customtext-neutral-dark mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 customtext-primary" />
                        Datos del huésped principal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Nombre <span className="customtext-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full border ${errors.name ? 'border-danger' : 'border-sections-color'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`}
                                placeholder="Tu nombre"
                            />
                            {errors.name && <p className="customtext-danger text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Apellido <span className="customtext-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className={`w-full border ${errors.lastname ? 'border-danger' : 'border-sections-color'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`}
                                placeholder="Tu apellido"
                            />
                            {errors.lastname && <p className="customtext-danger text-xs mt-1">{errors.lastname}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Email <span className="customtext-danger">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full border ${errors.email ? 'border-danger' : 'border-sections-color'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`}
                                placeholder="tu@email.com"
                            />
                            {errors.email && <p className="customtext-danger text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="w-full">
                            <label htmlFor="phone" className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Celular <span className="customtext-danger">*</span>
                            </label>
                            <div className="flex gap-2 w-full">
                                <div className="max-w-[120px]">
                                    <Select
                                        name="phone_prefix"
                                        value={prefixes.find(p => p.realCode === formData.phone_prefix) ? {
                                            value: prefixes.find(p => p.realCode === formData.phone_prefix).realCode,
                                            label: `${prefixes.find(p => p.realCode === formData.phone_prefix).beautyCode}`,
                                            flag: prefixes.find(p => p.realCode === formData.phone_prefix).flag,
                                            code: prefixes.find(p => p.realCode === formData.phone_prefix).beautyCode,
                                            country: prefixes.find(p => p.realCode === formData.phone_prefix).country
                                        } : null}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, phone_prefix: selected?.value || "" }))}
                                        options={prefixes
                                            .sort((a, b) => a.country.localeCompare(b.country))
                                            .map(prefix => ({
                                                value: prefix.realCode,
                                                label: prefix.beautyCode,
                                                flag: prefix.flag,
                                                code: prefix.beautyCode,
                                                country: prefix.country
                                            }))
                                        }
                                        formatOptionLabel={({ flag, code, country }) => {
                                            const prefix = prefixes.find(p => p.country === country);
                                            const countryCode = prefix?.isoCode?.ISO1?.toLowerCase() || country.toLowerCase().substring(0, 2);
                                            
                                            const flagServices = [
                                                `https://flagsapi.com/${countryCode.toUpperCase()}/flat/24.png`,
                                                `https://flagcdn.com/${countryCode}.svg`,
                                                `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`,
                                                `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode}.svg`,
                                                `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${countryCode}.svg`
                                            ];
                                            
                                            let currentIndex = 0;
                                            
                                            const handleImageError = (e) => {
                                                currentIndex++;
                                                if (currentIndex < flagServices.length) {
                                                    e.target.src = flagServices[currentIndex];
                                                } else {
                                                    e.target.style.display = 'none';
                                                    const fallback = e.target.parentNode.querySelector('.flag-fallback');
                                                    if (fallback) fallback.style.display = 'flex';
                                                }
                                            };
                                            
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <img 
                                                        src={flagServices[0]}
                                                        alt={`Bandera de ${country}`}
                                                        className="w-6 h-4 object-cover rounded-sm flex-shrink-0 border border-gray-200"
                                                        onError={handleImageError}
                                                        style={{ minWidth: '24px', minHeight: '16px' }}
                                                    />
                                                    <div className="flag-fallback w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0 border border-gray-300" style={{ display: 'none', minWidth: '24px', minHeight: '16px' }}>
                                                        <span className="text-xs text-gray-500">{countryCode.toUpperCase()}</span>
                                                    </div>
                                                    <span className="font-medium text-sm">{code}</span>
                                                </div>
                                            );
                                        }}
                                        placeholder="País"
                                        isClearable={false}
                                        isSearchable={true}
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: '48px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '0.75rem',
                                                fontSize: '14px',
                                                '&:hover': { borderColor: '#9ca3af' },
                                                '&:focus-within': { 
                                                    borderColor: '#3b82f6',
                                                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
                                                }
                                            }),
                                            option: (base, state) => ({
                                                ...base,
                                                backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
                                                color: state.isSelected ? 'white' : '#374151',
                                                padding: '8px 12px'
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            })
                                        }}
                                        filterOption={(option, inputValue) => {
                                            return option.data.country.toLowerCase().includes(inputValue.toLowerCase()) ||
                                                   option.data.code.toLowerCase().includes(inputValue.toLowerCase());
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full border ${errors.phone ? 'border-danger' : 'border-sections-color'} rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`}
                                        placeholder="000 000 000"
                                    />
                                </div>
                            </div>
                            {errors.phone && <p className="customtext-danger text-xs mt-1">{errors.phone}</p>}
                        </div>

                        {/* Tipo de documento */}
                        <div>
                            <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Tipo de documento <span className="customtext-danger">*</span>
                            </label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                className="w-full border border-sections-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            >
                                {typesDocument.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Número de documento */}
                        <div>
                            <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Número de documento <span className="customtext-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                className={`w-full border ${errors.document ? 'border-danger' : 'border-sections-color'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`}
                                placeholder={formData.documentType === 'dni' ? '12345678' : 'Número de documento'}
                                maxLength={formData.documentType === 'dni' ? 8 : formData.documentType === 'ruc' ? 11 : 20}
                            />
                            {errors.document && <p className="customtext-danger text-xs mt-1">{errors.document}</p>}
                        </div>
                    </div>

                    {/* Solicitudes especiales */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                            Solicitudes especiales (opcional)
                        </label>
                        <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-sections-color rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                            placeholder="¿Tienes alguna solicitud especial? (cama extra, llegada tarde, etc.)"
                        />
                    </div>
                </div>

                {/* Tipo de comprobante */}
                <div className="bg-white border border-sections-color rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold customtext-neutral-dark mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 customtext-primary" />
                        Comprobante de pago
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.invoiceType === 'boleta' ? 'border-accent bg-accent/5' : 'border-sections-color hover:border-accent'}`}>
                            <input
                                type="radio"
                                name="invoiceType"
                                value="boleta"
                                checked={formData.invoiceType === 'boleta'}
                                onChange={handleChange}
                                className="text-accent focus:ring-accent"
                            />
                            <span className="font-medium customtext-neutral-dark">Boleta</span>
                        </label>
                        <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.invoiceType === 'factura' ? 'border-accent bg-accent/5' : 'border-sections-color hover:border-accent'}`}>
                            <input
                                type="radio"
                                name="invoiceType"
                                value="factura"
                                checked={formData.invoiceType === 'factura'}
                                onChange={handleChange}
                                className="text-accent focus:ring-accent"
                            />
                            <span className="font-medium">Factura</span>
                        </label>
                    </div>

                    {formData.invoiceType === 'factura' && (
                        <div>
                            <label className="block text-sm font-medium customtext-neutral-dark mb-1">
                                Razón Social <span className="customtext-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                className={`w-full border ${errors.businessName ? 'border-danger' : 'border-sections-color'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all`}
                                placeholder="Nombre de la empresa"
                            />
                            {errors.businessName && <p className="customtext-danger text-xs mt-1">{errors.businessName}</p>}
                        </div>
                    )}
                </div>

             

                {/* Botón volver en móvil */}
                <div className="lg:hidden">
                    <button
                        onClick={noContinue}
                        className="w-full py-3 px-6 text-center rounded-full font-semibold customtext-neutral-dark border-2 border-accent hover:bg-accent hover:text-white transition-all duration-300"
                    >
                        Volver al carrito
                    </button>
                </div>
            </div>

            {/* Sidebar - Resumen de pago */}
            <div className="lg:col-span-1">
                <div className="bg-white border border-sections-color rounded-2xl shadow-md p-6 sticky top-4">
                    <h3 className="text-xl font-bold customtext-neutral-dark mb-6">Resumen de pago</h3>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 pb-6 border-b border-sections-color mb-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold customtext-primary">{cart.length}</div>
                            <div className="text-xs customtext-neutral-light mt-1">
                                {cart.length === 1 ? 'Habitación' : 'Habitaciones'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold customtext-primary">{totalNights}</div>
                            <div className="text-xs customtext-neutral-light mt-1">Noches</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold customtext-primary">{totalGuests}</div>
                            <div className="text-xs customtext-neutral-light mt-1">Huéspedes</div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="customtext-neutral-light">Subtotal</span>
                            <span className="font-medium customtext-neutral-dark">
                                {CurrencySymbol()} {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="customtext-neutral-light">Impuestos y cargos</span>
                            <span className="font-medium customtext-neutral-dark">
                                {CurrencySymbol()} {Number2Currency(igv)}
                            </span>
                        </div>

                        {/* Cupón aplicado */}
                        {appliedCoupon && calculatedCouponDiscount > 0 && (
                            <div className="flex justify-between text-sm customtext-success">
                                <span className="flex items-center gap-1">
                                    <CheckCircle size={14} />
                                    Cupón ({appliedCoupon.code})
                                </span>
                                <span className="font-medium">
                                    -{CurrencySymbol()} {Number2Currency(calculatedCouponDiscount)}
                                </span>
                            </div>
                        )}

                        {/* Comisión del método de pago */}
                        {commissionAmount > 0 && (
                            <div className="flex justify-between text-sm customtext-warning">
                                <span>Comisión ({paymentCommission}%)</span>
                                <span className="font-medium">
                                    +{CurrencySymbol()} {Number2Currency(commissionAmount)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Cupón */}
                    <div className="mb-6 pb-6 border-b border-sections-color">
                        <label className="block text-sm font-medium customtext-neutral-dark mb-2">
                            ¿Tienes un cupón?
                        </label>
                        {appliedCoupon ? (
                            <div className="flex items-center justify-between bg-success/10 border border-success rounded-lg px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={18} className="customtext-success" />
                                    <span className="font-medium customtext-success">{appliedCoupon.code}</span>
                                </div>
                                <button
                                    onClick={handleRemoveCoupon}
                                    className="customtext-danger hover:text-danger text-sm font-medium"
                                >
                                    Quitar
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    ref={couponRef}
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Código de cupón"
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    disabled={couponLoading}
                                    className="px-6 py-2.5 bg-accent hover:bg-secondary text-white rounded-full text-sm font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95"
                                >
                                    {couponLoading ? '...' : 'Aplicar'}
                                </button>
                            </div>
                        )}
                        {couponError && (
                            <p className="customtext-danger text-xs mt-2">{couponError}</p>
                        )}
                    </div>

                    {/* Total */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold customtext-neutral-dark">Total a pagar</span>
                            <div className="text-right">
                                <div className="text-2xl font-bold customtext-primary">
                                    {CurrencySymbol()} {Number2Currency(finalTotalWithCoupon)}
                                </div>
                                <div className="text-xs customtext-neutral-light">Incluye impuestos</div>
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        <button
                            onClick={handleContinueClick}
                            disabled={paymentLoading || !hasPaymentMethods}
                            className={`w-full py-4 px-6 rounded-full font-bold text-base transition-all duration-300 bg-primary hover:bg-secondary text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${data?.class_button || ''}`}
                        >
                            {paymentLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    Procesando...
                                </span>
                            ) : (
                                'Confirmar y pagar'
                            )}
                        </button>

                        <button
                            onClick={noContinue}
                            className="hidden lg:block w-full py-3 px-6 text-center rounded-full font-semibold customtext-primary border-2 border-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Volver al carrito
                        </button>
                    </div>

                  
                

                    {/* Policy Links */}
                    <div className="mt-6 pt-6 border-t border-sections-color">
                        <p className="text-xs customtext-neutral-light leading-relaxed">
                            Al proceder, aceptas nuestros{' '}
                            <button
                                onClick={() => openModal && openModal(1)}
                                className="customtext-accent font-medium hover:underline"
                            >
                                Términos y Condiciones
                            </button>
                            {' '}y{' '}
                            <button
                                onClick={() => openModal && openModal(0)}
                                className="customtext-accent font-medium hover:underline"
                            >
                                Política de Privacidad
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal de Login */}
            <ReactModal
                isOpen={showLoginModal}
                onRequestClose={() => setShowLoginModal(false)}
                contentLabel="Iniciar sesión"
                className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[999]"
                ariaHideApp={false}
            >
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    <div className="text-center mb-6">
                        <UserRoundX className="w-16 h-16 customtext-neutral-light mx-auto mb-4" />
                        <h2 className="text-2xl font-bold customtext-neutral-dark mb-2">Inicia sesión</h2>
                        <p className="customtext-neutral-light">
                            Para continuar con tu reserva, necesitas iniciar sesión o crear una cuenta.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <a
                            href="/login"
                            className="block w-full py-4 px-6 text-center rounded-full font-bold bg-primary hover:bg-secondary text-white hover:shadow-xl transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
                        >
                            Iniciar sesión
                        </a>
                        <a
                            href="/register"
                            className="block w-full py-3 px-6 text-center rounded-full font-semibold customtext-primary border-2 border-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Crear cuenta
                        </a>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="block w-full py-2 text-center customtext-neutral-light hover:customtext-neutral-dark text-sm font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </ReactModal>

            {/* Modal de métodos de pago */}
            <PaymentModal
                isOpen={showPaymentModal}
                contacts={contacts}
                cart={cart}
                totalFinal={appliedCoupon ? finalTotalWithCoupon : totalFinal}
                onClose={() => setShowPaymentModal(false)}
                onPaymentComplete={handlePaymentComplete}
            />

            {/* Modal de OpenPay */}
            <OpenPayCardModal
                isOpen={showOpenPayModal}
                onClose={() => setShowOpenPayModal(false)}
                onTokenCreated={handleOpenPayPayment}
            />

            {/* Modal de Voucher Yape - Específico para reservas de hotel */}
            <UploadVoucherModalYapeBooking
                isOpen={showVoucherModal}
                cart={cart}
                subTotal={subTotal}
                igv={igv}
                totalFinal={appliedCoupon ? finalTotalWithCoupon : totalFinal}
                request={paymentRequest}
                onClose={() => setShowVoucherModal(false)}
                contacts={contacts}
                coupon={appliedCoupon}
                descuentofinal={calculatedCouponDiscount}
                setCode={setCode}
                setBooking={setBooking}
                onContinue={onContinue}
            />

            {/* Modal de Voucher Transferencia - Específico para reservas de hotel */}
            <UploadVoucherModalBancsBooking
                isOpen={showVoucherModalBancs}
                cart={cart}
                subTotal={subTotal}
                igv={igv}
                totalFinal={appliedCoupon ? finalTotalWithCoupon : totalFinal}
                contacts={contacts}
                request={paymentRequest}
                onClose={() => setShowVoucherModalBancs(false)}
                coupon={appliedCoupon}
                descuentofinal={calculatedCouponDiscount}
                setCode={setCode}
                setBooking={setBooking}
                onContinue={onContinue}
            />
        </div>
    );
}
