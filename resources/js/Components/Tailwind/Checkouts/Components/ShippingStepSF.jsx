import { useCallback, useEffect, useState, useRef } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import ubigeoData from "../../../../../../storage/app/utils/ubigeo.json";
import DeliveryPricesRest from "../../../../Actions/DeliveryPricesRest";
import { processCulqiPayment } from "../../../../Actions/culqiPayment";
import { processMercadoPagoPayment } from "../../../../Actions/mercadoPagoPayment";
import { processOpenPayPayment } from "../../../../Actions/openPayPayment"
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import OptionCard from "./OptionCard";
import StorePickupSelector from "./StorePickupSelector";
import { CheckCircleIcon, CircleX, InfoIcon, UserRoundX, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Notify } from "sode-extend-react";
import { renderToString } from "react-dom/server";
import { debounce } from "lodash";
import { useUbigeo } from "../../../../Utils/useUbigeo";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import PaymentModal from "./PaymentModal";
import OpenPayCardModal from "./OpenPayCardModal";
import UploadVoucherModalYape from "./UploadVoucherModalYape";
import UploadVoucherModalBancs from "./UploadVoucherModalBancs";
import { toast } from "sonner";
import Global from "../../../../Utils/Global";
import General from "../../../../Utils/General";
import CouponsRest from "../../../../Actions/CouponsRest";
import Tippy from "@tippyjs/react";
import ReactModal from "react-modal";
import DiscountRulesRest from "../../../../Actions/DiscountRulesRest";





export default function ShippingStepSF({
    cart,
    setSale,
    setCode,
    setDelivery,
    setCart,
    onContinue,
    noContinue,
    subTotal,
    igv,
    totalFinal,
    user,
    setEnvio,
    envio,
    prefixes,
    ubigeos = [],
    contacts,
    totalPrice,
    descuentofinal,
    setDescuentoFinal,
    data, // Para gradientes
    openModal,
    setCouponDiscount: setParentCouponDiscount,
    setCouponCode: setParentCouponCode,
    automaticDiscounts = [], // Se usará como reglas, no como descuentos ya calculados
    automaticDiscountTotal = 0,
    totalWithoutDiscounts,
    conversionScripts,
    setConversionScripts,
    onPurchaseComplete,
}) {
    // Función para formatear el número de teléfono evitando duplicación de prefijos
    const formatPhoneNumber = (phonePrefix, phoneNumber) => {
        if (!phoneNumber) return "";
        
        // Si el número ya comienza con el prefijo, no lo agregamos de nuevo
        if (phoneNumber.startsWith(phonePrefix)) {
            return phoneNumber;
        }
        
        // Si no, concatenamos el prefijo
        return `${phonePrefix}${phoneNumber}`;
    };

    // Función para limpiar el número de teléfono del usuario removiendo prefijos duplicados
    const cleanPhoneNumber = (phoneNumber, phonePrefix) => {
        if (!phoneNumber) return "";
        
        // Si el número comienza con el prefijo, lo removemos
        if (phoneNumber.startsWith(phonePrefix)) {
            return phoneNumber.substring(phonePrefix.length);
        }
        
        return phoneNumber;
    };

    const couponRef = useRef(null);
    const [coupon, setCoupon] = useState(null);
    const [selectedUbigeo, setSelectedUbigeo] = useState(null);
    const [defaultUbigeoOption, setDefaultUbigeoOption] = useState(null);
    
    // Estados para los descuentos automáticos calculados
    const [autoDiscounts, setAutoDiscounts] = useState([]);
    const [autoDiscountTotal, setAutoDiscountTotal] = useState(0);

    // Get free items from automatic discounts calculados
    const freeItems = autoDiscounts.reduce((items, discount) => {
        if (discount.free_items && Array.isArray(discount.free_items)) {
            return items.concat(discount.free_items);
        }
        return items;
    }, []);

    // Función para calcular todos los descuentos automáticos
    const calculateAutomaticDiscounts = async (cart, rules) => {
        if (!cart || cart.length === 0) {
            return { discounts: [], total: 0 };
        }

        try {
            
            const result = await DiscountRulesRest.applyToCart(cart, totalWithoutDiscounts);
            
            if (result.success && result.data) {
                const discounts = DiscountRulesRest.formatDiscounts(result.data.applied_discounts);
                const discountAmount = result.data.total_discount || 0;
                
              
                
                return {
                    discounts: result.data.applied_discounts,
                    total: discountAmount
                };
            }
        } catch (error) {
            console.error('❌ Error calculating automatic discounts:', error);
        }
        
        return { discounts: [], total: 0 };
    };

    // Recalcular descuentos automáticos cuando cambie el carrito o las reglas
    useEffect(() => {
        if (cart && cart.length > 0 && totalWithoutDiscounts) {
            calculateAutomaticDiscounts(cart, automaticDiscounts).then(result => {
                setAutoDiscounts(result.discounts);
                setAutoDiscountTotal(result.total);
            });
        } else {
            setAutoDiscounts([]);
            setAutoDiscountTotal(0);
        }
    }, [cart, automaticDiscounts, totalWithoutDiscounts]);
    
    // Tipos de documentos como en ComplaintStech
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
            phone_prefix: initialPhonePrefix, //telf
            phone: initialPhone,   //telf
            documentType: user?.document_type?.toLowerCase() || "dni",
            document: user?.document_number || "",
            department: user?.department || "",
            province: user?.province || "",
            district: user?.district || "",
            address: user?.address || "",
            number: user?.number || "",
            comment: user?.comment || "",
            reference: user?.reference || "",
            shippingOption: "delivery", // Valor predeterminado
            ubigeo: user?.ubigeo || null,
            invoiceType: user?.invoiceType || "boleta", // Nuevo campo para tipo de comprobante
            businessName: user?.businessName || "", // Nuevo campo para Razón Social
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
                department: user.department || "",
                province: user.province || "",
                district: user.district || "",
                address: user.address || "",
                number: user.number || "",
                comment: user.comment || "",
                reference: user.reference || "",
                ubigeo: user.ubigeo || null,
                invoiceType: user.invoiceType || "boleta",
                businessName: user.businessName || "",
            }));
        }
    }, [user]);
    
    useEffect(() => {
      
        
        if (user?.ubigeo) {
            // Si tiene ubigeo pero no tiene los campos de texto, buscarlos
            if (!user?.district || !user?.province || !user?.department) {
                
                // Buscar la ubicación usando el ubigeo
                fetch(`/api/ubigeo/find/${user.ubigeo}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.distrito) {
                            const defaultOption = {
                                value: user.ubigeo,
                                label: `${data.distrito}, ${data.provincia}, ${data.departamento}`,
                                data: {
                                    reniec: user.ubigeo,
                                    departamento: data.departamento,
                                    provincia: data.provincia,
                                    distrito: data.distrito
                                }
                            };
                            
                            
                            setDefaultUbigeoOption(defaultOption);
                            setSelectedUbigeo(defaultOption);
                            handleUbigeoChange(defaultOption);
                        } else {
                            console.log('❌ ShippingStepSF - No se encontró ubicación para ubigeo:', user.ubigeo);
                        }
                    })
                    .catch(error => {
                        console.error('❌ ShippingStepSF - Error al buscar ubicación:', error);
                    });
            } else {
                // Si tiene todos los datos, usarlos directamente
                const defaultOption = {
                    value: user.ubigeo,
                    label: `${user.district}, ${user.province}, ${user.department}`,
                    data: {
                        reniec: user.ubigeo,
                        departamento: user.department,
                        provincia: user.province,
                        distrito: user.district
                    }
                };
                
                
                setDefaultUbigeoOption(defaultOption);
                setSelectedUbigeo(defaultOption);
                handleUbigeoChange(defaultOption);
            }
        } else {
            console.log('❌ ShippingStepSF - Usuario sin ubigeo registrado');
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
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [costsGet, setCostsGet] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchInput, setSearchInput] = useState("");
    const [expandedCharacteristics, setExpandedCharacteristics] = useState(false);
    
    // Estados para cupones mejorados
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    // El descuento del cupón se calcula sobre el total real, no solo el subtotal
    const [couponDiscount, setCouponDiscount] = useState(0); // solo para compatibilidad visual
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    // Estados para retiro en tienda
    const [selectedStore, setSelectedStore] = useState(null);
    const [showStoreSelector, setShowStoreSelector] = useState(false);

    // Estado para modal de login
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    // Estado para la comisión del método de pago
    const [paymentCommission, setPaymentCommission] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    // Cargar los departamentos al iniciar el componente
    const numericSubTotal = typeof subTotal === 'number' ? subTotal : parseFloat(subTotal) || 0;
    const numericIgv = typeof igv === 'number' ? igv : parseFloat(igv) || 0;
    const hasShippingFree = parseFloat(getContact("shipping_free"));
   
    const subFinal = numericSubTotal + numericIgv - descuentofinal - autoDiscountTotal;
    
    // Función de validación mejorada con alertas específicas
    const validateForm = () => {
        const newErrors = {};
        
        // Validación de campos obligatorios
        if (!formData.name) newErrors.name = "Nombre es requerido";
        if (!formData.lastname) newErrors.lastname = "Apellido es requerido";
        if (!formData.email) newErrors.email = "Email es requerido";
        if (!formData.phone) newErrors.phone = "Teléfono es requerido";
        if (!formData.ubigeo) newErrors.ubigeo = "Ubicación es requerida";
        if (!formData.address) newErrors.address = "Dirección es requerida";
        if (!formData.number) newErrors.number = "Número es requerido";
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

    // Función para manejar la selección de tienda
    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        // No ocultamos el selector para que el usuario pueda ver todas las opciones
        setFormData(prev => ({
            ...prev,
            shippingOption: "pickup",
            address: store.address,
            department: store.department,
            province: store.province,
            district: store.district
        }));
    };

    // Función para enfocar el primer campo con error y hacer scroll suave
    const focusFirstError = (errors) => {
        const firstErrorKey = Object.keys(errors)[0];
        
        setTimeout(() => {
            let targetElement = null;
            
            if (firstErrorKey === 'ubigeo') {
                targetElement = document.getElementById('ubigeo-select-container');
            } else if (firstErrorKey === 'phone_prefix') {
                targetElement = document.querySelector('.select2-prefix-selector')?.parentElement;
            } else {
                targetElement = document.querySelector(`[name="${firstErrorKey}"]`);
            }

            if (targetElement) {
                highlightElement(targetElement);
                
                // Scroll suave al elemento
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Enfocar si es un input
                if (['INPUT', 'SELECT', 'TEXTAREA'].includes(targetElement.tagName)) {
                    targetElement.focus();
                }
            }
        }, 100);
    };

    // Función auxiliar para agregar efecto visual temporal a un elemento
    const highlightElement = (element) => {
        element.classList.add('highlight-error');
        setTimeout(() => element.classList.remove('highlight-error'), 2000);
    };
    
    const handleUbigeoChange = async (selected) => {
        if (!selected) return;
        
        setErrors(prev => ({ ...prev, ubigeo: "" }));
        const { data } = selected;

        setFormData(prev => ({
            ...prev,
            department: data.departamento,
            province: data.provincia,
            district: data.distrito,
            ubigeo: data.reniec || data.inei,
        }));

        setLoading(true);
        try {
            // Calcular el total del carrito para la lógica condicional
            const cartTotal = cart.reduce((sum, item) => sum + (item.final_price * item.quantity), 0);
            
        
            
            const response = await DeliveryPricesRest.getShippingCost({
                ubigeo: data.reniec || data.inei,
                cart_total: cartTotal, // Enviar el total del carrito
            });

  
            const options = [];

            // 1. ENVÍO GRATIS: SOLO para zonas con is_free=true Y que califiquen por monto
            if (response.data.is_free && response.data.qualifies_free_shipping) {
                options.push({
                    type: "free",
                    price: 0,
                    description: response.data.standard.description,
                    deliveryType: response.data.standard.type,
                    characteristics: response.data.standard.characteristics,
                });
            }

            // 2. ENVÍO NORMAL: Si existe standard, siempre agregarlo (excepto para zonas is_free que califican para gratis)
            if (response.data.standard) {
                // Solo agregar envío normal si NO es zona gratis que califica, o si es zona gratis que NO califica
                if (!response.data.is_free || (response.data.is_free && !response.data.qualifies_free_shipping)) {
                    
                    // Limpiar cualquier mención de "envío gratis" en la descripción si NO es zona is_free
                    let cleanDescription = response.data.standard.description;
                    if (!response.data.is_free) {
                        // Para zonas que NO son is_free, remover cualquier mención de envío gratis
                        cleanDescription = cleanDescription
                            .replace(/envío gratis.*?/gi, '')
                            .replace(/envio gratis.*?/gi, '')
                            .replace(/gratis.*?compras.*?/gi, '')
                            .replace(/mayor.*?200.*?/gi, '')
                            .replace(/200.*?mayor.*?/gi, '')
                            .replace(/\s+/g, ' ') // Limpiar espacios extras
                            .trim();
                        
                        // Si queda vacío, usar una descripción por defecto
                        if (!cleanDescription) {
                            cleanDescription = "Delivery a domicilio";
                        }
                    }
                    
                    options.push({
                        type: "standard",
                        price: response.data.standard.price,
                        description: cleanDescription,
                        deliveryType: response.data.standard.type,
                        characteristics: response.data.standard.characteristics,
                    });
                }
            }

            // 3. ENVÍO EXPRESS: Si existe express, siempre agregarlo
            if (response.data.express && response.data.express.price > 0) {
                options.push({
                    type: "express",
                    price: response.data.express.price,
                    description: response.data.express.description,
                    deliveryType: response.data.express.type,
                    characteristics: response.data.express.characteristics,
                });
            }

            // 4. ENVÍO AGENCIA: Si existe agency, agregarlo
            if (response.data.is_agency && response.data.agency) {
                const agencyPrice = response.data.agency.price || 0;
                const isPaymentOnDelivery = response.data.agency.payment_on_delivery || false;
                const needsConsultation = response.data.needs_consultation || false;
                
                options.push({
                    type: "agency",
                    price: agencyPrice,
                    description: response.data.agency.description,
                    deliveryType: response.data.agency.type,
                    characteristics: response.data.agency.characteristics,
                    paymentOnDelivery: isPaymentOnDelivery,
                    showConsultButton: needsConsultation, // Mostrar botón de consulta si no tiene cobertura
                });
            }

            // 5. RETIRO EN TIENDA: Si está disponible, agregarlo
            if (response.data.is_store_pickup && response.data.store_pickup) {
                options.push({
                    type: "store_pickup",
                    price: 0,
                    description: response.data.store_pickup.description,
                    deliveryType: response.data.store_pickup.type,
                    characteristics: response.data.store_pickup.characteristics,
                    selectedStores: response.data.store_pickup.selected_stores, // IDs de tiendas específicas o null/[] para todas
                });
            }

            if (options.length === 0) {
                throw new Error("No hay opciones de envío disponibles");
            }

            setShippingOptions(options);
            setSelectedOption(options[0]?.type || null);
            setEnvio(options[0]?.price || 0);
            
         
        } catch (error) {
            console.error("Error al obtener precios de envío:", error);
            toast.error('Sin cobertura', {
                description: `No realizamos envíos a esta ubicación`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
            
            setShippingOptions([]);
            setSelectedOption(null);
            setEnvio(0);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedUbigeo) {
            handleUbigeoChange(selectedUbigeo);
        }
    }, [cart, subTotal, descuentofinal]);

    const loadOptions = useCallback(
        debounce((inputValue, callback) => {
            if (inputValue.length < 3) {
                callback([]);
                return;
            }

            fetch(`/api/ubigeo/search?q=${encodeURIComponent(inputValue)}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Error en la respuesta");
                    return response.json();
                })
                .then((data) => {
                    const options = data.map((item) => ({
                        value: item.reniec,
                        label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
                        data: {
                            inei: item.inei,
                            reniec: item.reniec,
                            departamento: item.departamento,
                            provincia: item.provincia,
                            distrito: item.distrito,
                        },
                    }));
                    callback(options);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    callback([]);
                });
        }, 300),
        []
    );

    // Filtrar provincias cuando se selecciona un departamento
    // useEffect(() => {
    //     if (departamento) {
    //         const filteredProvincias = [
    //             ...new Set(
    //                 ubigeoData
    //                     .filter((item) => item.departamento === departamento)
    //                     .map((item) => item.provincia)
    //             ),
    //         ];
    //         setProvincias(filteredProvincias);
    //         setProvincia(""); // Reiniciar provincia
    //         setDistrito(""); // Reiniciar distrito
    //         setDistritos([]); // Limpiar distritos
    //         setFormData((prev) => ({
    //             ...prev,
    //             department: departamento,
    //             province: "",
    //             district: "",
    //         }));
    //     }
    // }, [departamento]);

    // Filtrar distritos cuando se selecciona una provincia
    // useEffect(() => {
    //     if (provincia) {
    //         const filteredDistritos = ubigeoData
    //             .filter(
    //                 (item) =>
    //                     item.departamento === departamento &&
    //                     item.provincia === provincia
    //             )
    //             .map((item) => item.distrito);
    //         setDistritos(filteredDistritos);
    //         setDistrito(""); // Reiniciar distrito
    //         setFormData((prev) => ({
    //             ...prev,
    //             province: provincia,
    //             district: "",
    //         }));
    //     }
    // }, [provincia]);

    // Consultar el precio de envío cuando se selecciona un distrito
    // useEffect(() => {
    //     if (distrito) {
    //         setFormData((prev) => ({ ...prev, district: distrito }));

    //         // Llamar a la API para obtener el precio de envío
    //         const fetchShippingCost = async () => {
    //             try {
    //                 const response = await DeliveryPricesRest.getShippingCost({
    //                     department: departamento,
    //                     district: distrito,
    //                 });
    //                 setEnvio(response.data.price);
    //                 if (Number2Currency(response.data.price) > 0) {
    //                     setSelectedOption("express");
    //                 } else {
    //                     setSelectedOption("free");
    //                 }
    //             } catch (error) {
    //                 console.error("Error fetching shipping cost:", error);
    //                 alert("No se pudo obtener el costo de envío.");
    //             }
    //         };

    //         fetchShippingCost();
    //     }
    // }, [distrito]);

    const handlePayment = async (e) => {
        
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!validateForm()) {
            focusFirstError(errors);
            return;
        }

        if (!selectedOption) {
            toast.error("Seleccione envío", {
                description: `Debe elegir un método de envío`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: "bottom-center",
            });
            return;
        }

        if (!window.MercadoPago) {
            console.error("❌ MercadoPago aún no se ha cargado.")
            return
        }

        try {
            // Obtener el delivery_type del shipping option seleccionado
            const selectedShippingOption = shippingOptions.find(option => option.type === selectedOption);
            const deliveryType = selectedShippingOption ? selectedShippingOption.deliveryType : 'domicilio';

            const request = {
                user_id: user?.id || "",
                name: formData?.name || "",
                lastname: formData?.lastname || "",
                fullname: `${formData?.name} ${formData?.lastname}`,
                phone_prefix: formData?.phone_prefix || "51",
                email: formData?.email || "",
                phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                country: "Perú",
                department: formData?.department || "",
                province: formData?.province || "",
                district: formData?.district || "",
                ubigeo: formData?.ubigeo || "",
                address: formData?.address || "",
                number: formData?.number || "",
                comment: formData?.comment || "",
                reference: formData?.reference || "",
                amount: finalTotalWithCoupon || 0,
                delivery: envio,
                delivery_type: deliveryType, // Agregar delivery_type
                cart: cart,
                invoiceType: formData.invoiceType || "",
                documentType: formData.documentType || "",
                document: formData.document || "",
                businessName: formData.businessName || "",
                // Agregar descuentos automáticos
                automatic_discounts: autoDiscounts,
                automatic_discount_total: autoDiscountTotal,
                applied_promotions: autoDiscounts,
                promotion_discount: autoDiscountTotal || 0,
                coupon_id: coupon ? coupon.id : null,
                coupon_discount: descuentofinal || 0,
                total_amount: finalTotalWithCoupon || 0,
            };
           
            const response = await processMercadoPagoPayment(request)
            const data = response;
            
            if (data.status) {
                setSale(data.sale);
                setDelivery(data.delivery);
                setCode(data.code);
                
                // Ejecutar scripts de conversión si existen
                if (conversionScripts && Array.isArray(conversionScripts)) {
                    conversionScripts.forEach(script => {
                        try {
                            eval(script);
                        } catch (error) {
                            console.error('Error executing conversion script:', error);
                        }
                    });
                }

                // Llamar callback de compra completada
                if (onPurchaseComplete) {
                    onPurchaseComplete(data);
                }
                
            } else {
                toast.error("Error en el Pago", {
                    description: "El pago ha sido rechazado",
                    icon: <CircleX className="h-5 w-5 text-red-500" />,
                    duration: 3000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            toast.error("Error en el Pago", {
                description: "No se llegó a procesar el pago",
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: "bottom-center",
            });
        }
    };

    useEffect(() => {
        const htmlTemplate = (data) => {
          const prefix = data.element.dataset.code
          const flag = data.element.dataset.flag
          return renderToString(<span>
            <span className="inline-block w-8 font-emoji text-center">{flag}</span>
            <b className="me-1">{data.text}</b>
            <span className="text-sm text-opacity-20">{prefix}</span>
          </span>)
        }
        $('.select2-prefix-selector').select2({
          dropdownCssClass: 'py-1',
          containerCssClass: '!border !border-gray-300 !rounded p-2 !h-[42px]',
          arrowCssClass: '!text-primary top-1/2 -translate-y-1/2"',
          //minimumResultsForSearch: -1,
          templateResult: function (data) {
            if (!data.id) {
              return data.text;
            }
            var $container = $(htmlTemplate(data));
            return $container;
          },
          templateSelection: function (data) {
            if (!data.id) {
              return data.text;
            }
            var $container = $(htmlTemplate(data));
            return $container;
          },
          matcher: function (params, data) {
            if (!params.term || !data.element) return data;
      
            const country = data.element.dataset.country || '';
            const text = data.text || '';
      
            if (country.toLowerCase().includes(params.term.toLowerCase()) ||
                text.toLowerCase().includes(params.term.toLowerCase())) {
              return data;
            }
      
            return null;
          }
        });
    }, [formData.phone_prefix])


    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showOpenPayModal, setShowOpenPayModal] = useState(false);
    const [openPayTokenData, setOpenPayTokenData] = useState(null);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [showVoucherModalBancs, setShowVoucherModalBancs] = useState(false);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
    const [paymentRequest, setPaymentRequest] = useState(null);

    const handleContinueClick = (e) => {
        e.preventDefault();
        
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        if (!validateForm()) {
            focusFirstError(errors);
            return;
        }
    
        if (!selectedOption) {
            toast.error('Seleccione envío', {
                description: `Debe elegir un método de envío`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'bottom-center',
            });
            return;
        }
        
        setShowPaymentModal(true);
    };

    const validateFormOld = () => {
        const newErrors = {};
        
        // Validación de campos
        if (!formData.name) newErrors.name = "Nombre es requerido";
        if (!formData.lastname) newErrors.lastname = "Apellido es requerido";
        if (!formData.email) newErrors.email = "Email es requerido";
        if (!formData.phone) newErrors.phone = "Teléfono es requerido";
        if (!formData.ubigeo) newErrors.ubigeo = "Ubigeo es requerido";
        if (!formData.address) newErrors.address = "Dirección es requerida";
        if (!formData.document) newErrors.document = "Documento es requerido";
        if (!formData.number) newErrors.number = "Numero es requerido";
    
        setErrors(newErrors);
    
        // Función de smooth scroll personalizada
        const smoothScroll = (targetElement, duration = 800) => {
            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.pageYOffset -
                window.innerHeight / 2 +
                targetElement.offsetHeight / 2;
        
            const startPosition = window.pageYOffset;
            let startTime = null;
        
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
        
                const easeInOutQuad = (t, b, c, d) => {
                    t /= d / 2;
                    if (t < 1) return (c / 2) * t * t + b;
                    t--;
                    return (-c / 2) * (t * (t - 2) - 1) + b;
                };
        
                const run = easeInOutQuad(
                    timeElapsed,
                    startPosition,
                    targetPosition - startPosition,
                    duration
                );
                window.scrollTo(0, run);
        
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    if (
                        ["INPUT", "SELECT", "TEXTAREA"].includes(
                            targetElement.tagName
                        )
                    ) {
                        targetElement.focus();
                    }
                }
            };
        
            requestAnimationFrame(animation);
        };
    
        // Si hay errores, hacer scroll al primero
        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            
            setTimeout(() => {
                let targetElement = null;
                
                if (firstErrorKey === 'ubigeo') {
                    targetElement = document.getElementById('ubigeo-select-container');
                } else if (firstErrorKey === 'phone_prefix') {
                    targetElement = document.querySelector('.select2-prefix-selector')?.parentElement;
                } else {
                    targetElement = document.querySelector(`[name="${firstErrorKey}"]`);
                }
    
                if (targetElement) {
                    // Aplicar clase de error temporal
                    targetElement.classList.add('highlight-error');
                    setTimeout(() => targetElement.classList.remove('highlight-error'), 2000);
                    
                    // Scroll personalizado
                    smoothScroll(targetElement, 600);
                }
            }, 100);
        }
    
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentComplete = async (paymentMethod) => {  // Cambiado de 'method' a 'paymentMethod'
        try {
            // Establecer la comisión según el método de pago seleccionado
            let commission = 0;
            switch(paymentMethod) {
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
                return; // Detener aquí, el modal manejará el resto
            }

            if (paymentMethod === "tarjeta") {
                // Procesar pago con tarjeta (MercadoPago)
                if (!window.MercadoPago) {
                    console.error("❌ MercadoPago aún no se ha cargado.")
                    return
                }

                // Obtener el delivery_type del shipping option seleccionado
                const selectedShippingOption = shippingOptions.find(option => option.type === selectedOption);
                const deliveryType = selectedShippingOption ? selectedShippingOption.deliveryType : 'domicilio';

                // Calcular el total con comisión
                const mercadopagoCommission = parseFloat(Global.get("checkout_mercadopago_commission") || 0);
                const totalBeforeCommissionCalc = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
                const commissionAmount = roundToTwoDecimals(totalBeforeCommissionCalc * (mercadopagoCommission / 100));
                const finalTotalWithCommission = Math.max(0, roundToTwoDecimals(totalBeforeCommissionCalc + commissionAmount));

                const request = {
                    user_id: user?.id || "",
                    name: formData?.name || "",
                    lastname: formData?.lastname || "",
                    fullname: `${formData?.name} ${formData?.lastname}`,
                    phone_prefix: formData?.phone_prefix || "51",
                    email: formData?.email || "",
                    phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                    country: "Perú",
                    department: formData?.department || "",
                    province: formData?.province || "",
                    district: formData?.district || "",
                    ubigeo: formData?.ubigeo || "",
                    address: formData?.address || "",
                    number: formData?.number || "",
                    comment: formData?.comment || "",
                    reference: formData?.reference || "",
                    amount: finalTotalWithCommission || 0,
                    delivery: envio,
                    delivery_type: deliveryType, // Agregar delivery_type
                    cart: cart,
                    invoiceType: formData.invoiceType || "",
                    documentType: formData.documentType || "",
                    document: formData.document || "",
                    businessName: formData.businessName || "",
                    payment_method: paymentMethod || null,
                    // Cupón aplicado
                    coupon_id: appliedCoupon ? appliedCoupon.id : null,
                    coupon_discount: calculatedCouponDiscount || 0,
                    // Comisión del método de pago
                    payment_commission: commissionAmount || 0,
                    payment_commission_percentage: mercadopagoCommission || 0,
                    // Descuentos automáticos
                    automatic_discounts: autoDiscounts,
                    automatic_discount_total: autoDiscountTotal,
                    applied_promotions: autoDiscounts,
                    promotion_discount: autoDiscountTotal || 0,
                    total_amount: finalTotalWithCommission || 0,
                };
                
                try {
                    const response = await processMercadoPagoPayment(request)
                    const data = response;
                    
                    if (data.status) {
                        setSale(data.sale);
                        setDelivery(data.delivery);
                        setCode(data.code);
                        
                        // Ejecutar scripts de conversión si existen
                        if (conversionScripts && Array.isArray(conversionScripts)) {
                            conversionScripts.forEach(script => {
                                try {
                                    eval(script);
                                } catch (error) {
                                    console.error('Error executing conversion script:', error);
                                }
                            });
                        }

                        // Llamar callback de compra completada
                        if (onPurchaseComplete) {
                            onPurchaseComplete(data);
                        }
                        
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
                    // Verificar que Culqi esté habilitado
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

                    if (!Global.CULQI_PUBLIC_KEY) {
                        toast.error("Error de configuración", {
                            description: "El sistema de pagos Culqi no está configurado correctamente",
                            icon: <CircleX className="h-5 w-5 text-red-500" />,
                            duration: 4000,
                            position: "top-center",
                        });
                        setPaymentLoading(false);
                        return;
                    }

                    // Obtener el delivery_type del shipping option seleccionado
                    const selectedShippingOption = shippingOptions.find(option => option.type === selectedOption);
                    const deliveryType = selectedShippingOption ? selectedShippingOption.deliveryType : 'domicilio';

                    // Calcular el total con comisión
                    const culqiCommission = parseFloat(Global.get("checkout_culqi_commission") || 0);
                    const totalBeforeCommissionCalc = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
                    const commissionAmount = roundToTwoDecimals(totalBeforeCommissionCalc * (culqiCommission / 100));
                    const finalTotalWithCommission = Math.max(0, roundToTwoDecimals(totalBeforeCommissionCalc + commissionAmount));

                    const request = {
                        user_id: user?.id || "",
                        name: formData?.name || "",
                        lastname: formData?.lastname || "",
                        fullname: `${formData?.name} ${formData?.lastname}`,
                        phone_prefix: formData?.phone_prefix || "51",
                        email: formData?.email || "",
                        phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                        country: "Perú",
                        department: formData?.department || "",
                        province: formData?.province || "",
                        district: formData?.district || "",
                        ubigeo: formData?.ubigeo || "",
                        address: formData?.address || "",
                        number: formData?.number || "",
                        comment: formData?.comment || "",
                        reference: formData?.reference || "",
                        amount: finalTotalWithCommission || 0,
                        delivery: envio,
                        delivery_type: deliveryType,
                        cart: cart,
                        invoiceType: formData.invoiceType || "",
                        documentType: formData.documentType || "",
                        document: formData.document || "",
                        businessName: formData.businessName || "",
                        payment_method: "culqi",
                        // Cupón aplicado
                        coupon_id: appliedCoupon ? appliedCoupon.id : null,
                        coupon_discount: calculatedCouponDiscount || 0,
                        // Comisión del método de pago
                        payment_commission: commissionAmount || 0,
                        payment_commission_percentage: culqiCommission || 0,
                        // Descuentos automáticos
                        automatic_discounts: autoDiscounts,
                        automatic_discount_total: autoDiscountTotal,
                        applied_promotions: autoDiscounts,
                        promotion_discount: autoDiscountTotal || 0,
                        total_amount: finalTotalWithCommission || 0,
                    };

                    const response = await processCulqiPayment(request);

                    if (response.status) {
                        setSale(response.sale);
                        setDelivery(response.delivery);
                        setCode(response.code);

                        // Capturar scripts de conversión si están disponibles
                        if (response.conversion_scripts) {
                            setConversionScripts(response.conversion_scripts);

                            // Llamar al callback de compra completada si está disponible
                            if (onPurchaseComplete) {
                                try {
                                    await onPurchaseComplete(response.sale_id, response.conversion_scripts);
                                } catch (callbackError) {
                                    console.error('❌ Error en callback onPurchaseComplete:', callbackError);
                                }
                            }
                        }

                        setCart([]);
                        onContinue();
                    } else {
                        toast.error("Error en el pago", {
                            description: response.message || "Pago rechazado",
                            icon: <CircleX className="h-5 w-5 text-red-500" />,
                            duration: 3000,
                            position: "bottom-center",
                        });
                    }
                } catch (error) {
                    console.error('💥 Error en pago Culqi:', error);
                    // No mostrar error si el usuario canceló el pago
                    if (error !== "Pago cancelado por el usuario") {
                        toast.error("Error en el Pago", {
                            description: error.message || error || "No se pudo procesar el pago",
                            icon: <CircleX className="h-5 w-5 text-red-500" />,
                            duration: 3000,
                            position: "bottom-center",
                        });
                    }
                } finally {
                    setPaymentLoading(false);
                }
            }else if(paymentMethod === "yape") {

                // Obtener el delivery_type del shipping option seleccionado
                const selectedShippingOption = shippingOptions.find(option => option.type === selectedOption);
                const deliveryType = selectedShippingOption ? selectedShippingOption.deliveryType : 'domicilio';

                // Calcular el total con comisión
                const yapeCommission = parseFloat(Global.get("checkout_dwallet_commission") || 0);
                const totalBeforeCommissionCalc = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
                const commissionAmount = roundToTwoDecimals(totalBeforeCommissionCalc * (yapeCommission / 100));
                const finalTotalWithCommission = Math.max(0, roundToTwoDecimals(totalBeforeCommissionCalc + commissionAmount));

                const request = {
                    user_id: user?.id || "",
                    name: formData?.name || "",
                    lastname: formData?.lastname || "",
                    fullname: `${formData?.name} ${formData?.lastname}`,
                    phone_prefix: formData?.phone_prefix || "51",
                    email: formData?.email || "",
                    phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                    country: "Perú",
                    department: formData?.department || "",
                    province: formData?.province || "",
                    district: formData?.district || "",
                    ubigeo: formData?.ubigeo || "",
                    address: formData?.address || "",
                    number: formData?.number || "",
                    comment: formData?.comment || "",
                    reference: formData?.reference || "",
                    amount: finalTotalWithCommission || 0,
                    delivery: envio,
                    delivery_type: deliveryType, // Agregar delivery_type
                    details: JSON.stringify(cart.map((item) => ({
                        id: item.id,
                        quantity: item.quantity
                    }))),
                    invoiceType: formData.invoiceType || "",
                    documentType: formData.documentType || "",
                    document: formData.document || "",
                    businessName: formData.businessName || "",
                    payment_method: paymentMethod || null,
                    payment_proof: null,
                    // Cupón aplicado
                    coupon_id: appliedCoupon ? appliedCoupon.id : null,
                    coupon_discount: calculatedCouponDiscount || 0,
                    // Comisión del método de pago
                    payment_commission: commissionAmount || 0,
                    payment_commission_percentage: yapeCommission || 0,
                    // Descuentos automáticos
                    automatic_discounts: autoDiscounts,
                    automatic_discount_total: autoDiscountTotal,
                    applied_promotions: autoDiscounts,
                    promotion_discount: autoDiscountTotal || 0,
                    total_amount: finalTotalWithCommission || 0,
                };

                setPaymentRequest(request);
                setShowVoucherModal(true);
            }else if(paymentMethod === "transferencia") {

                // Obtener el delivery_type del shipping option seleccionado
                const selectedShippingOption = shippingOptions.find(option => option.type === selectedOption);
                const deliveryType = selectedShippingOption ? selectedShippingOption.deliveryType : 'domicilio';

                // Calcular el total con comisión
                const transferenciaCommission = parseFloat(Global.get("checkout_transfer_commission") || 0);
                const totalBeforeCommissionCalc = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
                const commissionAmount = roundToTwoDecimals(totalBeforeCommissionCalc * (transferenciaCommission / 100));
                const finalTotalWithCommission = Math.max(0, roundToTwoDecimals(totalBeforeCommissionCalc + commissionAmount));

                const request = {
                    user_id: user?.id || "",
                    name: formData?.name || "",
                    lastname: formData?.lastname || "",
                    fullname: `${formData?.name} ${formData?.lastname}`,
                    phone_prefix: formData?.phone_prefix || "51",
                    email: formData?.email || "",
                    phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                    country: "Perú",
                    department: formData?.department || "",
                    province: formData?.province || "",
                    district: formData?.district || "",
                    ubigeo: formData?.ubigeo || "",
                    address: formData?.address || "",
                    number: formData?.number || "",
                    comment: formData?.comment || "",
                    reference: formData?.reference || "",
                    amount: finalTotalWithCommission || 0,
                    delivery: envio,
                    delivery_type: deliveryType, // Agregar delivery_type
                    details: JSON.stringify(cart.map((item) => ({
                        id: item.id,
                        quantity: item.quantity
                    }))),
                    invoiceType: formData.invoiceType || "",
                    documentType: formData.documentType || "",
                    document: formData.document || "",
                    businessName: formData.businessName || "",
                    payment_method: paymentMethod || null,
                    payment_proof: null,
                    // Cupón aplicado
                    coupon_id: appliedCoupon ? appliedCoupon.id : null,
                    coupon_discount: calculatedCouponDiscount || 0,
                    // Comisión del método de pago
                    payment_commission: commissionAmount || 0,
                    payment_commission_percentage: transferenciaCommission || 0,
                    // Descuentos automáticos
                    automatic_discounts: autoDiscounts,
                    automatic_discount_total: autoDiscountTotal,
                    applied_promotions: autoDiscounts,
                    promotion_discount: autoDiscountTotal || 0,
                    total_amount: finalTotalWithCommission || 0,
                };
                setPaymentRequest(request);
                setShowVoucherModalBancs(true);
            }
        } catch (error) {
            console.error("Error en el pago:", error);
            toast.error('Error en el Pago', {
                description: `No se llegó a procesar el pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'bottom-center',
            });
        }
    };

    // Función para manejar el token de OpenPay
    const handleOpenPayTokenCreated = async (tokenData) => {
        try {
            console.log("💳 Token de OpenPay recibido:", tokenData);
            
            setOpenPayTokenData(tokenData);
            setShowOpenPayModal(false);
            setPaymentLoading(true);
            
            const selectedShippingOption = shippingOptions.find(option => option.type === selectedOption);
            const deliveryType = selectedShippingOption ? selectedShippingOption.deliveryType : 'domicilio';
            
            // Calcular el total con comisión
            const openpayCommission = parseFloat(Global.get("checkout_openpay_commission") || 0);
            const totalBeforeCommissionCalc = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
            const commissionAmount = roundToTwoDecimals(totalBeforeCommissionCalc * (openpayCommission / 100));
            const finalTotalWithCommission = Math.max(0, roundToTwoDecimals(totalBeforeCommissionCalc + commissionAmount));
            
            const request = {
                user_id: user?.id || "",
                name: formData?.name || "",
                lastname: formData?.lastname || "",
                fullname: `${formData?.name} ${formData?.lastname}`,
                phone_prefix: formData?.phone_prefix || "51",
                email: formData?.email || "",
                phone: formatPhoneNumber(formData.phone_prefix || "51", formData.phone),
                country: "Perú",
                department: formData?.department || "",
                province: formData?.province || "",
                district: formData?.district || "",
                ubigeo: formData?.ubigeo || "",
                address: formData?.address || "",
                number: formData?.number || "",
                comment: formData?.comment || "",
                reference: formData?.reference || "",
                amount: finalTotalWithCommission || 0,
                delivery: envio,
                delivery_type: deliveryType,
                cart: cart,
                invoiceType: formData.invoiceType || "",
                documentType: formData.documentType || "",
                document: formData.document || "",
                businessName: formData.businessName || "",
                payment_method: "openpay",
                source_id: tokenData.token,  // OpenPay usa 'source_id' en lugar de 'token'
                device_session_id: tokenData.device_session_id,
                // Cupón aplicado
                coupon_id: appliedCoupon ? appliedCoupon.id : null,
                coupon_discount: calculatedCouponDiscount || 0,
                // Comisión del método de pago
                payment_commission: commissionAmount || 0,
                payment_commission_percentage: openpayCommission || 0,
                // Descuentos automáticos
                automatic_discounts: autoDiscounts,
                automatic_discount_total: autoDiscountTotal,
                applied_promotions: autoDiscounts,
                promotion_discount: autoDiscountTotal || 0,
                total_amount: finalTotalWithCommission || 0,
            };
            
            console.log("📤 Enviando request al backend:", request);
            
            const response = await processOpenPayPayment(request);
            console.log("📥 Respuesta del backend:", response);
            
            if (response && response.status) {
                // Guardar los datos de la venta
                setSale(response.sale);
                setDelivery(response.delivery);
                setCode(response.code);
                
                // Limpiar el carrito
                setCart([]);
                localStorage.removeItem('cart');
                
                // Ejecutar scripts de conversión si existen
                if (conversionScripts && Array.isArray(conversionScripts)) {
                    conversionScripts.forEach(script => {
                        try {
                            eval(script);
                        } catch (error) {
                            console.error('Error executing conversion script:', error);
                        }
                    });
                }

                // Llamar callback de compra completada
                if (onPurchaseComplete) {
                    onPurchaseComplete(response);
                }
                
                // Mostrar mensaje de éxito
                toast.success('¡Pago exitoso!', {
                    description: 'Tu pedido ha sido procesado correctamente',
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    duration: 2000,
                    position: 'bottom-center',
                });
                
                // Navegar a la página de éxito después de un breve delay
                setTimeout(() => {
                    onContinue(); // Esto navega a la página de confirmación
                }, 1500);
                
            } else {
                console.error("❌ Error: Respuesta sin status true", response);
                toast.error('Error en el Pago', {
                    description: response?.message || 'El pago ha sido rechazado',
                    icon: <CircleX className="h-5 w-5 text-red-500" />,
                    duration: 4000,
                    position: 'bottom-center',
                });
                setPaymentLoading(false);
            }
        } catch (error) {
            console.error('❌ Error en OpenPay handleOpenPayTokenCreated:', error);
            toast.error('Error en el Pago', {
                description: error.message || error || 'No se llegó a procesar el pago',
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 4000,
                position: 'bottom-center',
            });
            setPaymentLoading(false);
        }
    };

    useEffect(() => {
        // Limpiar errores cuando los campos son modificados
        setErrors(prev => {
            const newErrors = { ...prev };
            Object.keys(formData).forEach(key => {
                if (formData[key]) delete newErrors[key];
            });
            return newErrors;
        });
    }, [formData]);

    
    // Función para validar cupón
    const validateCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError("Ingrese un código de cupón");
            return;
        }

        setCouponLoading(true);
        setCouponError("");

        try {
            // Mostrar información sobre el cupón antes de validar
            if (couponCode.toUpperCase() === 'TEST50' && subTotal < 100) {
                toast.warning("Información importante", {
                    description: `El cupón TEST50 requiere un monto mínimo de ${CurrencySymbol()} 100.00. Tu carrito actual: ${CurrencySymbol()} ${Number2Currency(subTotal)}`,
                    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
                    duration: 5000,
                    position: "bottom-center",
                });
            }

            // Extraer IDs de categorías y productos del carrito
            const categoryIds = [...new Set(cart.map(item => item.category_id).filter(Boolean))];
            const productIds = [...new Set(cart.map(item => item.id || item.item_id).filter(Boolean))];

           
            const response = await CouponsRest.validateCoupon({
                code: couponCode.trim(),
                cart_total: subTotal,
                category_ids: categoryIds,
                product_ids: productIds
            });


            // Manejar diferentes estructuras de respuesta
            const data = response.data || response; // response.data para nueva estructura, response para estructura anterior
            
            if (data && data.valid) {
                setAppliedCoupon(data.coupon);
                // Redondear el descuento a 2 decimales para evitar problemas de precisión
                const roundedDiscount = Math.round(data.discount * 100) / 100;
                setCouponDiscount(roundedDiscount);
                setCouponCode("");
                
                // Actualizar estados del padre si existen
                if (setParentCouponCode) setParentCouponCode(data.coupon.code);
                if (setParentCouponDiscount) setParentCouponDiscount(roundedDiscount);
                
                toast.success("Cupón aplicado", {
                    description: `Descuento de ${CurrencySymbol()} ${Number2Currency(roundedDiscount)} aplicado`,
                    icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
                    duration: 3000,
                    position: "bottom-center",
                });
            } else {
                const errorMessage = data?.message || "Cupón inválido o no aplicable a estos productos";
                setCouponError(errorMessage);
                
                // Mejorar el mensaje de error para casos específicos
                let toastMessage = errorMessage;
                if (errorMessage.includes("monto mínimo")) {
                    toastMessage = `${errorMessage} Tu carrito actual: ${CurrencySymbol()} ${Number2Currency(subTotal)}`;
                }
                
                toast.error("Cupón inválido", {
                    description: toastMessage,
                    icon: <CircleX className="h-5 w-5 text-red-500" />,
                    duration: 4000,
                    position: "bottom-center",
                });
            }
        } catch (error) {
            console.error("Error validating coupon:", error);
            const errorMessage = error.response?.data?.message || "Error al validar el cupón";
            setCouponError(errorMessage);
            
            toast.error("Error de validación", {
                description: errorMessage,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: "bottom-center",
            });
        } finally {
            setCouponLoading(false);
        }
    };

    // Función para remover cupón
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponDiscount(0);
        setCouponError("");
        
        // Actualizar estados del padre si existen
        if (setParentCouponCode) setParentCouponCode("");
        if (setParentCouponDiscount) setParentCouponDiscount(0);
        
        toast.success("Cupón removido", {
            description: "El cupón ha sido removido del pedido",
            icon: <InfoIcon className="h-5 w-5 text-blue-500" />,
            duration: 2000,
            position: "bottom-center",
        });
    };

    // Función auxiliar para redondear valores monetarios con mayor precisión
    const roundToTwoDecimals = (num) => {
        return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
    };

    // Calcular el total base antes de cupón
    const totalBase = roundToTwoDecimals(subTotal) + roundToTwoDecimals(igv) + roundToTwoDecimals(envio) - roundToTwoDecimals(autoDiscountTotal);

    // El descuento del cupón ya viene calculado desde el backend
    let calculatedCouponDiscount = couponDiscount || 0;
    
    // Calcular comisión del método de pago (sobre el total antes de la comisión)
    const totalBeforeCommission = Math.max(0, roundToTwoDecimals(totalBase - calculatedCouponDiscount));
    const calculatedCommission = roundToTwoDecimals(totalBeforeCommission * (paymentCommission / 100));
    
    // Sincronizar el estado para mantener compatibilidad visual
    useEffect(() => {
        if (setParentCouponDiscount) {
            setParentCouponDiscount(calculatedCouponDiscount);
        }
    }, [appliedCoupon, couponDiscount, setParentCouponDiscount]);

    const finalTotalWithCoupon = Math.max(0, roundToTwoDecimals(totalBeforeCommission + calculatedCommission));

    // Componente Modal de Login
    const LoginModal = () => {
        return (
            <ReactModal
                isOpen={showLoginModal}
                onRequestClose={() => setShowLoginModal(false)}
                className="modal-content max-w-md mx-auto mt-20 bg-white rounded-lg p-6"
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Iniciar Sesión Requerido</h2>
                    <p className="text-gray-600 mb-6">
                        Debe iniciar sesión para continuar con su compra
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                setShowLoginModal(false);
                                // Redirigir a login o abrir modal de login
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </ReactModal>
        );
    };

    const selectStyles = (hasError) => ({
        control: (base) => ({
            ...base,
            border: `1px solid ${hasError ? '#ef4444' : '#e5e7eb'}`, // Added default border color
            boxShadow: 'none',
            minHeight: '50px',
            '&:hover': { borderColor: hasError ? '#ef4444' : '#6b7280' },
            borderRadius: '0.75rem',
            padding: '2px 8px',
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999,
            marginTop: '4px',
            borderRadius: '8px',
        }),
        option: (base) => ({
            ...base,
            color: '#1f2937',
            backgroundColor: 'white',
            '&:hover': { backgroundColor: '#f3f4f6' },
            padding: '12px 16px',
        }),
    });

    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          padding: '0.5rem',
          borderColor: state.isFocused ? '#d1d5db' : '#d1d5db', // gray-300
          borderRadius: '0.75rem', // rounded-xl
          boxShadow: 'none',
          '&:hover': {
            borderColor: '#9ca3af', // gray-400
          },
        }),
        input: (provided) => ({
          ...provided,
          color: '#374151', // gray-700
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#3b82f6' : 'white', // blue-500 when selected
          color: state.isSelected ? 'white' : '#374151', // gray-700
          '&:hover': {
            backgroundColor: '#e5e7eb', // gray-200
          },
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#374151', // gray-700
        }),
      };

      useEffect(() => {
        if (coupon) {
            let descuento = 0;
            if (coupon.type === 'percentage') {
                descuento = totalPrice * (coupon.amount / 100);
            } else {
                descuento = coupon.amount;
            }
            setDescuentoFinal(descuento);
        } else {
            setDescuentoFinal(0); 
        }
    }, [totalPrice, coupon]); 

    
    const onCouponApply = (e) => {
        e.preventDefault();
        const coupon = (couponRef.current.value || "").trim().toUpperCase();
        if (!coupon) return;
        couponRest
            .save({
                coupon,
                amount: totalPrice,
                email: "basiliohinostroza2003bradneve@gmail.com",
            })
            .then((result) => {
                // let descuento = 0; 
                // if (result && result.id) { 
                //     if (result.type == 'percentage') {
                //         descuento = totalPrice * (result.amount / 100)
                //     } else {
                //         descuento = result.amount 
                //     }
                //     setDescuentoFinal(descuento);
                //     setCoupon(result); 
                // } else {
                //     setCoupon(null);
                // }
                if (result && result.id) {
                    setCoupon(result);
                } else {
                    setCoupon(null);
                    setDescuentoFinal(0);
                }
            });
            
    };

    const onCouponKeyDown = (e) => {
        if (e.key == "Enter") onCouponApply(e);
    };

    return (
        <>
            <style jsx>{`
                .highlight-error {
                    animation: highlight 2s ease-in-out;
                    border: 2px solid #ef4444 !important;
                    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3) !important;
                }
                
                @keyframes highlight {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                
                .modal-overlay {
                    z-index: 9999;
                }
                
                .modal-content {
                    max-height: 90vh;
                    overflow-y: auto;
                }
            `}</style>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-8 lg:gap-8 ">
                <div className="lg:col-span-3">
                    {/* Formulario */}
                    <form
                        className="space-y-6 bg-[#f9f9f9] py-6 px-4 sm:px-6 rounded-2xl font-paragraph"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="sectionInformation space-y-3.5">
                            <h3 className={`block text-xl 2xl:text-2xl font-bold mb-4 customtext-neutral-dark `}>
                                Información del contacto
                            </h3>
                            <div className="grid lg:grid-cols-2 gap-4">
                                {/* Nombres */}
                            
                                <InputForm
                                    type="text"
                                    label="Nombres"
                                    name="name"
                                    value={formData.name}
                                    error={errors.name}
                                    onChange={handleChange}
                                    placeholder="Nombres"
                                    required
                                />
                                {/* Apellidos */}
                                <InputForm
                                    label="Apellidos"
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    error={errors.lastname}
                                    onChange={handleChange}
                                    placeholder="Apellidos"
                                    required
                                />
                            </div>
                    
                            <div className="grid lg:grid-cols-2 gap-4 ">
                            
                                {/* Correo electrónico */}
                                <InputForm
                                    label="Correo electrónico"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    error={errors.email}
                                    onChange={handleChange}
                                    placeholder="Ej. hola@gmail.com"
                                    required
                                />

                                {/* Celular */}
                                <div className="w-full">
                                    <label htmlFor="phone" className="block text-sm 2xl:text-base mb-1 customtext-neutral-dark">
                                        Celular <span className="text-red-500 ml-1">*</span>
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
                                                    // Buscar el país en el array de prefijos para obtener el código ISO
                                                    const prefix = prefixes.find(p => p.country === country);
                                                    const countryCode = prefix?.isoCode?.ISO1?.toLowerCase() || country.toLowerCase().substring(0, 2);
                                                    
                                                    // Lista de servicios de banderas ordenados por prioridad
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
                                                            // Si todos los servicios fallan, ocultar imagen y mostrar fallback
                                                            e.target.style.display = 'none';
                                                            const fallback = e.target.nextElementSibling;
                                                            if (fallback && fallback.classList.contains('flag-fallback')) {
                                                                fallback.style.display = 'flex';
                                                            }
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
                                            <InputForm
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                error={errors.phone}
                                                onChange={handleChange}
                                                placeholder="000 000 000"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#66483966] py-[0.6px]"></div>    

                        <div className="sectionDelivery space-y-3.5">
                            
                            <h3 className={`block text-xl 2xl:text-2xl font-bold mb-4 customtext-neutral-dark`}>
                                Dirección de envío
                            </h3>

                            <div id="ubigeo-select-container" className="form-group">
                                <label
                                    className={`block text-sm 2xl:text-base mb-1 customtext-neutral-dark `}
                                >
                                    Distrito / Provincia / Departamento (Ubicación de entrega)<span className="text-red-500 ml-1">*</span>
                                </label>
                                <AsyncSelect
                                    name="ubigeo"
                                    cacheOptions
                                    value={selectedUbigeo}
                                    loadOptions={loadOptions}
                                    onChange={(selected) => {
                                        setSelectedUbigeo(selected);
                                        handleUbigeoChange(selected);
                                        setSearchInput(""); // Limpiar input al seleccionar
                                    }}
                                    inputValue={searchInput}
                                    onInputChange={(value, { action }) => {
                                        if (action === "input-change") setSearchInput(value);
                                    }}
                                    onFocus={() => {
                                        setSelectedUbigeo(null); // Limpiar selección al enfocar
                                        setSearchInput("");      // Limpiar input de búsqueda
                                    }}
                                    onMenuOpen={() => {
                                        if (selectedUbigeo) {
                                            setSelectedUbigeo(null);
                                            setSearchInput("");
                                        }
                                    }}
                                    placeholder="Buscar por distrito | provincia | departamento ..."
                                    loadingMessage={() => "Buscando ubicaciones..."}
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue.length < 3
                                            ? "Buscar por distrito | provincia | departamento ..."
                                            : "No se encontraron resultados"
                                    }
                                    isLoading={loading}
                                    styles={selectStyles(!!errors.ubigeo)}
                                    formatOptionLabel={({ data }) => (
                                        <div className="text-sm py-1">
                                            <div className="font-medium">{data.distrito}</div>
                                            <div className="text-gray-500">
                                                {data.provincia}, {data.departamento}
                                            </div>
                                        </div>
                                    )}
                                    className="w-full rounded-xl transition-all duration-300"
                                    menuPortalTarget={document.body}
                                    isClearable={true}
                                />
                                {errors.ubigeo && <div className="text-red-500 text-sm mt-1">{errors.ubigeo}</div>}
                            </div>

                            {/* Departamento */}
                            {/* <SelectForm
                                label="Departamento"
                                options={departamentos}
                                placeholder="Selecciona un Departamento"
                                onChange={(value) => {
                                    setDepartamento(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        department: departamento,
                                    }));
                                }}
                            /> */}

                            {/* Provincia */}
                            {/* <SelectForm
                                disabled={!departamento}
                                label="Provincia"
                                options={provincias}
                                placeholder="Selecciona una Provincia"
                                onChange={(value) => {
                                    setProvincia(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        province: provincia,
                                    }));
                                }}
                            /> */}

                            {/* Distrito */}

                            {/* <SelectForm
                                disabled={!provincia}
                                label="Distrito"
                                options={distritos}
                                placeholder="Selecciona un Distrito"
                                onChange={(value) => {
                                    setDistrito(value);
                                    setFormData((prev) => ({
                                        ...prev,
                                        district: distrito,
                                    }));
                                }}
                            /> */}

                            {/* Dirección */}
                            <InputForm
                                label="Avenida / Calle / Jirón"
                                type="text"
                                name="address"
                                value={formData.address}
                                error={errors.address}
                                onChange={handleChange}
                                placeholder="Ingresa el nombre de la calle"
                                required
                            />

                            <div className="grid lg:grid-cols-2 gap-4">
                                <InputForm
                                    label="Número"
                                    type="text"
                                    name="number"
                                    value={formData.number}
                                    error={errors.number}
                                    onChange={handleChange}
                                    placeholder="Ingresa el número de la calle"
                                    required
                                />

                                <InputForm
                                    label="Dpto./ Interior/ Piso/ Lote/ Bloque"
                                    type="text"
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    placeholder="Ej. Casa 3, Dpto 101"
                                />
                            </div>

                            {/* Referencia */}

                            {/* <InputForm
                                label="Referencia"
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleChange}
                                placeholder="Ejem. Altura de la avenida..."
                            /> */}
                        
                            {shippingOptions.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="block text-xl 2xl:text-2xl font-bold mb-4 customtext-neutral-dark">
                                        Método de envío
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {shippingOptions.map((option) => {
                                            // Generar mensaje personalizado para consulta de envío
                                            const ubigeoInfo = selectedUbigeo?.data;
                                            const location = ubigeoInfo 
                                                ? `${ubigeoInfo.distrito}, ${ubigeoInfo.provincia}, ${ubigeoInfo.departamento}`
                                                : 'mi ubicación';
                                            const consultMessage = `Hola, necesito consultar el costo de envío para: ${location}. ¿Me pueden ayudar?`;
                                            
                                            return (
                                                <OptionCard
                                                    key={option.type}
                                                    title={option.deliveryType}
                                                    price={option.price}
                                                    description={option.description}
                                                    selected={selectedOption === option.type}
                                                    paymentOnDelivery={option.paymentOnDelivery || false}
                                                    showConsultButton={option.showConsultButton || false}
                                                    advisors={Global.whatsapp_advisors || []}
                                                    consultMessage={consultMessage}
                                                    onSelect={() => {
                                                        setSelectedOption(option.type);
                                                        setEnvio(option.price);
                                                        
                                                        // Si selecciona retiro en tienda, mostrar selector
                                                        if (option.type === "store_pickup") {
                                                            setShowStoreSelector(true);
                                                        } else {
                                                            setShowStoreSelector(false);
                                                            setSelectedStore(null);
                                                        }
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                               

                                    {selectedOption && shippingOptions.length > 0 && (
                                        <div className="space-y-4 mt-4">
                                            {shippingOptions
                                                .find((o) => o.type === selectedOption)
                                                ?.characteristics?.map(
                                                    (char, index) => (
                                                        <div
                                                            key={`char-${index}`}
                                                            className="flex items-start gap-4 bg-[#F7F9FB] p-4 rounded-xl"
                                                        >
                                                            <div className="w-5 flex-shrink-0">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="20"
                                                                    height="20"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="lucide lucide-info customtext-primary"
                                                                >
                                                                    <circle
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                    />
                                                                    <path d="M12 16v-4" />
                                                                    <path d="M12 8h.01" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium customtext-neutral-dark">
                                                                    {char}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    )}

                                    {/* Selector de tiendas para retiro en tienda */}
                                    {showStoreSelector && selectedOption === "store_pickup" && (
                                        <StorePickupSelector 
                                            ubigeo={selectedUbigeo?.data?.reniec || selectedUbigeo?.data?.inei}
                                            onStoreSelect={handleStoreSelect}
                                            selectedStore={selectedStore}
                                            specificStores={shippingOptions.find(o => o.type === "store_pickup")?.selectedStores}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-[#66483966] py-[0.6px]"></div>      

                        {/* Tipo de comprobante */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium customtext-neutral-dark">
                                Tipo de comprobante
                            </label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="invoiceType"
                                            value="boleta"
                                            checked={formData.invoiceType === "boleta"}
                                            onChange={handleChange}
                                        />
                                        <div className={`w-5 h-5 border-2 rounded-full transition-all duration-200 ${
                                            formData.invoiceType === "boleta" 
                                                ? 'border-primary bg-primary' 
                                                : 'border-gray-300 bg-white group-hover:border-gray-400'
                                        }`}>
                                            {formData.invoiceType === "boleta" && (
                                                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium customtext-neutral-dark">Boleta</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="invoiceType"
                                            value="factura"
                                            checked={formData.invoiceType === "factura"}
                                            onChange={handleChange}
                                        />
                                        <div className={`w-5 h-5 border-2 rounded-full transition-all duration-200 ${
                                            formData.invoiceType === "factura" 
                                                ? 'border-primary bg-primary' 
                                                : 'border-gray-300 bg-white group-hover:border-gray-400'
                                        }`}>
                                            {formData.invoiceType === "factura" && (
                                                <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium customtext-neutral-dark">Factura</span>
                                </label>
                            </div>
                        </div>

                        {/* Documento */}
                        <InputForm
                                label={formData.documentType === "dni" ? "DNI" : "RUC"}
                                type="text"
                                name="document"
                                value={formData.document}
                                error={errors.document}
                                onChange={handleChange}
                                placeholder={`Ingrese su ${formData.documentType === "dni" ? "DNI" : "RUC"}`}
                                maxLength={formData.documentType === "dni" ? "8" : "11"}
                                required
                        />
                        
                        {/* Razón Social (solo para factura) */}
                        {formData.invoiceType === "factura" && (
                            <InputForm
                                label="Razón Social"
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                placeholder="Ingrese la razón social"
                            />
                        )}    

                    </form>
                </div>
                {/* Resumen de compra */}
                <div className="bg-[#F7F9FB] rounded-xl shadow-lg p-6 col-span-2 h-max font-paragraph">
                    <h3 className="text-2xl font-bold pb-6 customtext-neutral-dark">Resumen de compra</h3>

                    <div className="space-y-6 border-b-2 pb-6">
                        {cart.map((item, index) => (
                            <div key={item.id} className="rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-0 rounded-xl">
                                        <img
                                            src={`/storage/images/item/${item.image}`}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded  "
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold customtext-neutral-dark text-base 2xl:text-lg mb-2">
                                            {item.name}
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
                                                {item.quantity}{" "}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sección de cupón siempre visible */}
                    <div className="mt-6">
                        {!appliedCoupon ? (
                            <div>
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Código de cupón"
                                        className={`w-full rounded-l-md border py-3 px-4 text-sm outline-none uppercase focus:border-[#C5B8D4] ${
                                            couponError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        value={couponCode}
                                        onChange={(e) => {
                                            setCouponCode(e.target.value);
                                            setCouponError("");
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                validateCoupon();
                                            }
                                        }}
                                        disabled={couponLoading}
                                    />
                                    <button
                                        className={`rounded-r-md px-4 py-2 text-sm text-white transition-all duration-300 hover:opacity-90 ${
                                            couponLoading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : data?.gradient ? 'bg-gradient' : 'bg-primary'
                                        }`}
                                        type="button"
                                        onClick={validateCoupon}
                                        disabled={couponLoading}
                                    >
                                        {couponLoading ? "..." : "Aplicar"}
                                    </button>
                                </div>
                              
                            </div>
                        ) : (
                            <div className="bg-secondary border  rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium customtext-neutral-dark   ">
                                                Cupón aplicado: {appliedCoupon.code}
                                            </p>
                                          
                                            <p className="text-xs customtext-neutral-light">
                                                Descuento: {appliedCoupon.type === 'percentage' 
                                                    ? `${appliedCoupon.value}%`
                                                    : `${CurrencySymbol()} ${Number2Currency(appliedCoupon.value)}`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeCoupon}
                                        className="text-red-600 hover:text-red-700 transition-colors"
                                        title="Remover cupón"
                                    >
                                      <XCircle/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {couponError && (
                        <div className="mt-2 text-red-500 text-sm">{couponError}</div>
                    )}

              

                 

                    <div className="space-y-4 mt-6">
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">
                                Subtotal
                            </span>
                            <span className="font-semibold">
                                {CurrencySymbol()} {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">IGV</span>
                            <span className="font-semibold">
                                {CurrencySymbol()} {Number2Currency(igv)}
                            </span>
                        </div>
                        
                        {/* Mostrar descuentos automáticos en el resumen */}
                        {autoDiscountTotal > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Descuentos automáticos</span>
                                <span className="font-semibold">
                                    -{CurrencySymbol()} {Number2Currency(autoDiscountTotal)}
                                </span>
                            </div>
                        )}
                        
                        {appliedCoupon && (
                            <div className="flex justify-between text-blue-600">
                                <span>Descuento cupón ({appliedCoupon.code})</span>
                                <span className="font-semibold">
                                    -{CurrencySymbol()} {Number2Currency(calculatedCouponDiscount)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="customtext-neutral-dark">Envío</span>
                            <span className="font-semibold">
                                {selectedOption === "free" || selectedOption === "store_pickup" || envio === 0 ? (
                                    <span className="customtext-neutral-dark">Gratis</span>
                                ) : (
                                    `${CurrencySymbol()} ${Number2Currency(envio)}`
                                )}
                            </span>
                        </div>
                        
                        {/* Mostrar comisión del método de pago */}
                        {paymentCommission > 0 && selectedPaymentMethod && (
                            <div className="flex justify-between text-yellow-600">
                                <span>Comisión ({paymentCommission}%)</span>
                                <span className="font-semibold">
                                    +{CurrencySymbol()} {Number2Currency(calculatedCommission)}
                                </span>
                            </div>
                        )}
                        
                        <div className="py-3 border-y-2 mt-6">
                            <div className="flex justify-between font-bold text-[20px] items-center">
                                <span>Total</span>
                                <span>{CurrencySymbol()} {Number2Currency(appliedCoupon ? finalTotalWithCoupon : totalFinal)}</span>
                            </div>
                        </div>
                        <div className="space-y-2 pt-4">
                            <button
                                className={`w-full py-3 px-6 rounded-full font-semibold text-lg transition-all duration-300 ${!hasPaymentMethods ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:opacity-90 bg-primary'} ${data?.class_button ||' text-white'}`}
                                onClick={handleContinueClick}
                                disabled={!hasPaymentMethods}
                                title={!hasPaymentMethods ? 'No hay métodos de pago disponibles' : ''}
                            >
                                Continuar
                            </button>
                            <div id="mercadopago-button-container" ></div>
                            <ButtonSecondary className="!rounded-full" onClick={noContinue}>
                                Cancelar
                            </ButtonSecondary>
                        </div>
                        <div>
                            <p className="text-sm customtext-neutral-dark">
                                Al realizar tu pedido, aceptas los 
                                <a href="#" onClick={() => openModal && openModal(1)} className="customtext-primary font-bold"> Términos y Condiciones</a>
                                , y que nosotros usaremos sus datos personales de
                                acuerdo con nuestra 
                                <a href="#" onClick={() => openModal && openModal(0)} className="customtext-primary font-bold"> Política de Privacidad</a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                contacts={contacts}
                onClose={() => setShowPaymentModal(false)}
                onPaymentComplete={handlePaymentComplete}
                
            />

            <OpenPayCardModal
                isOpen={showOpenPayModal}
                onClose={() => setShowOpenPayModal(false)}
                onTokenCreated={handleOpenPayTokenCreated}
            />

            <UploadVoucherModalYape
                isOpen={showVoucherModal}
                cart={cart}
                subTotal={subTotal}
                igv={igv}
                totalFinal={appliedCoupon ? finalTotalWithCoupon : totalFinal}
                envio={envio}
                request={paymentRequest}
                onClose={() => setShowVoucherModal(false)}
                paymentMethod={currentPaymentMethod}
                coupon={appliedCoupon}
                descuentofinal={calculatedCouponDiscount}
                autoDiscounts={autoDiscounts}
                autoDiscountTotal={autoDiscountTotal}
            />

            <UploadVoucherModalBancs
                isOpen={showVoucherModalBancs}
                cart={cart}
                subTotal={subTotal}
                igv={igv}
                totalFinal={appliedCoupon ? finalTotalWithCoupon : totalFinal}
                envio={envio}
                contacts={contacts}
                request={paymentRequest}
                onClose={() => setShowVoucherModalBancs(false)}
                paymentMethod={currentPaymentMethod}
                coupon={appliedCoupon}
                descuentofinal={calculatedCouponDiscount}
                autoDiscounts={autoDiscounts}
                autoDiscountTotal={autoDiscountTotal}
            />

            <LoginModal />
        </>
    );
}
