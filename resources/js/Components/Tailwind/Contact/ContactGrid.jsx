import { Mail, Phone, Building2, Store, MapPin, PhoneCall } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import MessagesRest from "../../../Actions/MessagesRest";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import Global from "../../../Utils/Global";
import { toast } from "sonner";
const messagesRest = new MessagesRest();

const ContactGrid = ({ data, contacts }) => {
    console.log(contacts);
    const getContact = (correlative) => {
        return (
            contacts.find((contact) => contact.correlative === correlative)
                ?.description || ""
        );
    };

    // Función para procesar emails separados por comas
    const getContactEmails = (correlative) => {
        const emailString = getContact(correlative);
        if (!emailString) return [];
        return emailString.split(',').map(email => email.trim()).filter(email => email);
    };

    // Función para procesar teléfonos separados por comas
    const getContactPhones = (correlative) => {
        const phoneString = getContact(correlative);
        if (!phoneString) return [];
        return phoneString.split(',').map(phone => phone.trim()).filter(phone => phone);
    };

    const location =
        contacts.find((x) => x.correlative == "location")?.description ?? "0,0";

    const locationGps = {
        lat: Number(location.split(",").map((x) => x.trim())[0]),
        lng: Number(location.split(",").map((x) => x.trim())[1]),
    };


    const nameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);
    const [phoneValue, setPhoneValue] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [allStores, setAllStores] = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [storesByType, setStoresByType] = useState({});

    // Estado para la tienda principal
    const [mainStoreData, setMainStoreData] = useState(null);

    // Cargar todas las tiendas desde la API
    useEffect(() => {
        const loadStores = async () => {
            try {
                setLoadingStores(true);
                const response = await fetch('/api/stores');
                const result = await response.json();

                console.log('API Response:', result); // Para debug

                // La respuesta puede venir envuelta en un objeto con una propiedad 'data'
                let data = result;
                if (result.data) {
                    data = result.data;
                } else if (result.body) {
                    data = result.body;
                }

                // Verificar que data sea un array antes de filtrar
                if (Array.isArray(data)) {
                    // Filtrar tiendas activas
                    const activeStores = data.filter(store => store.status !== false);
                    setAllStores(activeStores);

                    // Buscar tienda principal
                    const mainStore = activeStores.find(store => store.type === 'tienda_principal');
                    if (mainStore) {
                        setMainStoreData(mainStore);
                        console.log('Tienda principal encontrada:', mainStore);
                    }

                    // Organizar tiendas por tipo (incluyendo tienda_principal)
                    const groupedByType = activeStores.reduce((acc, store) => {
                        const type = store.type || 'otro';
                        if (!acc[type]) {
                            acc[type] = [];
                        }
                        acc[type].push(store);
                        return acc;
                    }, {});

                    setStoresByType(groupedByType);
                    console.log('Stores grouped by type:', groupedByType);
                } else {
                    console.error('API response is not an array:', result);
                    setAllStores([]);
                    setStoresByType({});
                }
            } catch (error) {
                console.error('Error loading stores:', error);
                setAllStores([]);
                setStoresByType({});
            } finally {
                setLoadingStores(false);
            }
        };

        loadStores();
    }, []);



    // Función para obtener el color del tipo de tienda
    const getStoreTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'tienda': return Global.APP_COLOR_PRIMARY;
            case 'oficina': return Global.APP_COLOR_PRIMARY;
            case 'agencia': return Global.APP_COLOR_PRIMARY;
            case 'almacen': return Global.APP_COLOR_PRIMARY;
            case 'showroom': return Global.APP_COLOR_PRIMARY;
            default: return Global.APP_COLOR_PRIMARY;
        }
    };

    // Función para obtener el icono del tipo de tienda
    const getStoreTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'tienda': return Store;
            case 'oficina': return Building2;
            case 'agencia': return Building2;
            case 'almacen': return Store;
            case 'showroom': return Store;
            default: return Store;
        }
    };

    // Función para obtener el nombre formateado del tipo
    const getStoreTypeName = (type) => {
        const typeNames = {
            'tienda_principal': 'Tienda Principal',
            'tienda': 'Tiendas',
            'oficina': 'Oficinas',
            'agencia': 'Agencias',
            'almacen': 'Almacenes',
            'showroom': 'Showrooms',
            'otro': 'Otros Puntos'
        };
        return typeNames[type?.toLowerCase()] || 'Otros Puntos';
    };

    // Componente para renderizar tarjetas de tiendas por tipo
    const renderStoreTypeCard = (type, stores, index) => {
        const IconComponent = getStoreTypeIcon(type);

        return (
            <motion.div
                key={type}
                className={`bg-[#F7F9FB] p-6 rounded-xl shadow-lg ${data?.class_card_container || ''}`}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                whileHover={{
                    y: -8,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#ffffff",
                }}
            >
                <motion.div
                    className="flex items-center gap-3 customtext-primary mb-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                >
                    <motion.div
                        whileHover={{ rotate: 20, scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <IconComponent className={`w-5 h-5 ${data?.class_card_title || ''}`} />
                    </motion.div>
                    <motion.h3
                        className={`font-bold text-lg ${data?.class_card_title || 'customtext-neutral-dark'}`}
                    >
                        {getStoreTypeName(type)}
                    </motion.h3>
                </motion.div>

                <div className="space-y-4">
                    {stores.map((store, storeIndex) => (
                        <motion.div
                            key={store.id}
                            className={`bg-white p-4 rounded-lg border transition-all duration-300 cursor-pointer ${selectedStore?.id === store.id
                                ? 'border-blue-500 shadow-lg bg-blue-50'
                                : 'border-gray-100 hover:shadow-md hover:border-blue-200'
                                }`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1.5 + (index * 0.1) + (storeIndex * 0.05) }}
                            whileHover={{ x: 2, scale: 1.01, backgroundColor: selectedStore?.id === store.id ? "#dbeafe" : "#f8fafc" }}
                            onClick={() => setSelectedStore(store)}
                        >
                            <div className="flex items-start gap-3">

                                <div className="flex-1">
                                    <h4 className="customtext-neutral-dark font-bold mb-2 text-lg">
                                        {store.name}
                                    </h4>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 customtext-neutral-light flex-shrink-0" />
                                            <p className="customtext-primary font-medium">
                                                {store.address}
                                            </p>
                                        </div>

                                        {store.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <PhoneCall className="w-4 h-4 customtext-neutral-light flex-shrink-0" />
                                                <a
                                                    href={`tel:${store.phone}`}
                                                    className="customtext-primary hover:customtext-neutral-dark transition-colors font-medium"
                                                >
                                                    {store.phone}
                                                </a>
                                            </div>
                                        )}

                                        {store.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 customtext-neutral-light flex-shrink-0" />
                                                <a
                                                    href={`mailto:${store.email}`}
                                                    className="customtext-primary hover:customtext-neutral-dark transition-colors font-medium"
                                                >
                                                    {store.email}
                                                </a>
                                            </div>
                                        )}


                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    // Formatea el teléfono en formato 999 999 999
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "");
        const truncated = numbers.slice(0, 9);
        if (truncated.length <= 3) {
            return truncated;
        } else if (truncated.length <= 6) {
            return `${truncated.slice(0, 3)} ${truncated.slice(3)}`;
        } else {
            return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
        }
    };

    // Valida el teléfono peruano
    const validatePhone = (phone) => {
        const numbers = phone.replace(/\D/g, "");
        if (numbers.length !== 9) {
            return "El teléfono debe tener 9 dígitos";
        }
        if (!numbers.startsWith("9")) {
            return "Solo se aceptan celulares peruanos (empiezan con 9)";
        }
        return "";
    };

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value;
        const formattedValue = formatPhone(inputValue);
        const error = validatePhone(formattedValue);
        setPhoneValue(formattedValue);
        setPhoneError(error);
        if (phoneRef.current) {
            phoneRef.current.value = formattedValue.replace(/\D/g, "");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;

        // Validación de teléfono
        const phoneNumbers = phoneValue.replace(/\D/g, "");
        const phoneValidationError = validatePhone(phoneValue);
        if (phoneValidationError) {
            setPhoneError(phoneValidationError);

            toast.error("Error de validación", {
                description: phoneValidationError,
                duration: 3000,
                position: "bottom-center",
                richColors: true
            });
            return;
        }

        setSending(true);

        const request = {
            name: nameRef.current.value,
            phone: phoneNumbers,
            email: emailRef.current.value,
            description: descriptionRef.current.value,
        };

        const result = await messagesRest.save(request);

        // Limpiar campos inmediatamente después del envío exitoso
        if (nameRef.current) nameRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
        setPhoneValue("");
        setPhoneError("");
        if (emailRef.current) emailRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";

        toast.success("Mensaje enviado", {
            description: 'Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
            duration: 3000,
            position: "bottom-center",
            richColors: true
        });
        setSending(false);

        if (!result) return;

        if (data?.redirect) {
            location.href = data?.redirect;
        }
    };
    return (
        <motion.section
            className=" bg-[#F7F9FB] py-12 px-primary "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className=" mx-auto  2xl:max-w-7xl  flex flex-col md:flex-row gap-12 bg-white rounded-xl p-4 md:px-8 md:py-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Contact Form */}
                <motion.div
                    className="w-full md:w-10/12"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <motion.h2
                        className={`text-3xl font-bold mb-4 ${data?.class_title || 'customtext-neutral-dark '}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Hablemos Hoy
                    </motion.h2>
                    <motion.p
                        className={`customtext-neutral-light mb-8 ${data?.class_card_description || ''}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        Contáctanos para recibir atención personalizada, cotizaciones rápidas y soporte técnico especializado en nuestra amplia gama de productos dentales.
                    </motion.p>

                    <motion.form
                        onSubmit={onSubmit}
                        className="space-y-6"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                        >
                            <motion.input
                                ref={nameRef}
                                disabled={sending}
                                type="text"
                                name="name"
                                placeholder="Nombre completo"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#3B82F6" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                        >
                            <motion.input
                                ref={phoneRef}
                                disabled={sending}
                                type="tel"
                                name="phone"
                                placeholder="Teléfono (9 dígitos)"
                                value={phoneValue}
                                onChange={handlePhoneChange}
                                maxLength={11}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${phoneError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                                required
                                aria-describedby={phoneError ? "phone-error" : "phone-help"}
                                aria-invalid={phoneError ? "true" : "false"}
                                whileFocus={{ scale: 1.02, borderColor: "#3B82F6" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                            {phoneError && (
                                <motion.span
                                    id="phone-error"
                                    className="text-red-500 text-xs flex items-center gap-1 mt-1"
                                    role="alert"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {phoneError}
                                </motion.span>
                            )}
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                        >
                            <motion.input
                                ref={emailRef}
                                disabled={sending}
                                type="email"
                                name="email"
                                placeholder="Correo Electrónico"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#3B82F6" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                        >
                            <motion.textarea
                                ref={descriptionRef}
                                disabled={sending}
                                name="message"
                                placeholder="Deja tu mensaje..."
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all duration-200"
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#3B82F6" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            ></motion.textarea>
                        </motion.div>
                        <motion.button
                            type="submit"
                            className={`bg-primary text-base font-bold text-white px-6 py-3  hover:brightness-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${data?.class_card_button || 'rounded-xl'}`}
                            disabled={sending}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {sending && (
                                <motion.svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 "
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </motion.svg>
                            )}
                            {sending ? 'Enviando...' : 'Enviar mensaje'}
                        </motion.button>
                    </motion.form>
                </motion.div>

                {/* Contact Information */}


                <motion.div
                    className="space-y-8"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >

                    <motion.div
                        className={`bg-[#F7F9FB] p-6 rounded-xl shadow-lg ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0 }}
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <motion.div
                            className="flex items-center gap-3 customtext-primary mb-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.5 }}
                        >
                            <motion.div
                                whileHover={{ rotate: -20, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <Store className={`w-5 h-5 ${data?.class_card_title || ''}`} />
                            </motion.div>
                            <motion.h3
                                className={`font-bold text-lg ${data?.class_card_title || 'customtext-neutral-dark'}`}
                            >
                                Tienda Principal
                            </motion.h3>
                        </motion.div>
                        <motion.p
                            className="customtext-primary font-bold"
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {mainStoreData ? mainStoreData.address : getContact("address")}
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className={`bg-[#F7F9FB] p-6 rounded-xl shadow-lg ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0 }}
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >

                        <div className="flex items-center gap-3 customtext-primary mb-2">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Mail className={`w-5 h-5 ${data?.class_card_title || ''}`} />
                            </motion.div>
                            <h3 className={` font-bold text-lg ${data?.class_card_title || 'customtext-neutral-dark'}`}>
                                Email
                            </h3>
                        </div>
                        <p className={` mb-2 ${data?.class_card_description || 'customtext-neutral-light'}`}>
                            Escríbenos para recibir atención personalizada y
                            resolver tus dudas.
                        </p>
                        <div className="space-y-1">
                            {getContactEmails('email_contact').map((email, index) => (
                                <a
                                    key={index}
                                    href={`mailto:${email}`}
                                    className="customtext-primary font-bold hover:no-underline block"
                                >
                                    {email}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className={`bg-[#F7F9FB] p-6 rounded-xl shadow-lg ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0 }}
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div className="flex items-center gap-3 customtext-primary mb-2">
                            <motion.div
                                whileHover={{ rotate: -15, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Phone className={`w-5 h-5 ${data?.class_card_title || ''}`} />
                            </motion.div>
                            <h3 className={` font-bold text-lg ${data?.class_card_title || 'customtext-neutral-dark'}`}>
                                Teléfono
                            </h3>
                        </div>
                        <p className={`customtext-neutral-light mb-2 ${data?.class_card_description || ''}`}>
                            Llámanos para obtener soporte inmediato y asistencia
                            profesional.
                        </p>
                        <div className="space-y-1">
                            {getContactPhones('phone_contact').map((phone, index) => (
                                <a
                                    key={index}
                                    href={`tel:${phone}`}
                                    className="customtext-primary hover:no-underline font-bold block"
                                >
                                    {phone}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                </motion.div>
            </motion.div>
            <motion.div
                className="mx-auto 2xl:max-w-7xl gap-12 bg-white rounded-xl px-8 py-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
            >
                <motion.div className="mb-6">
                    <motion.h3
                        className={`text-2xl font-bold  mb-2 ${data?.class_title || 'customtext-neutral-dark'}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.5 }}
                    >
                        {data?.title_ubication || "Nuestras Ubicaciones"}
                    </motion.h3>
                    <motion.p
                        className={` mb-4 ${data?.class_card_description || 'customtext-neutral-light'}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                    >
                        {data?.description_ubication || "Encuentra nuestras tiendas, oficinas y agencias más cercanas a tu ubicación."}
                    </motion.p>
                </motion.div>

                {/* Layout responsivo: si hay tiendas, división en columnas; si no, mapa completo */}
                <div className={`flex flex-col gap-8 ${data?.stores_support && !loadingStores && Object.keys(storesByType).length > 0 ? 'lg:flex-row' : ''}`}>

                    {/* Sección de sucursales - solo si hay tiendas */}
                    {data?.stores_support && !loadingStores && Object.keys(storesByType).length > 0 && (
                        <motion.div
                            className="lg:w-1/3 space-y-4"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.7 }}
                        >
                            {/* Loading de sucursales */}
                            {loadingStores ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-2 text-sm customtext-neutral-light">Cargando sucursales...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Renderizar tarjetas por tipo de tienda */}
                                    {Object.entries(storesByType).map(([type, stores], index) =>
                                        renderStoreTypeCard(type, stores, index)
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Sección del mapa y detalles */}
                    <motion.div
                        className={`${data?.stores_support && !loadingStores && Object.keys(storesByType).length > 0 ? 'lg:w-2/3' : 'w-full'} space-y-6`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.8 }}
                    >
                        <div className="relative">
                            {loadingStores && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span className="customtext-neutral-light">Cargando ubicaciones...</span>
                                    </div>
                                </div>
                            )}

                            <LoadScript
                                googleMapsApiKey={Global.GMAPS_API_KEY}
                                className="rounded-xl"
                            >
                                <GoogleMap
                                    mapContainerStyle={{ width: "100%", height: "500px", borderRadius: "12px" }}
                                    zoom={selectedStore ? 16 : (data?.stores_support && allStores.length > 0 ? 12 : 16)}
                                    center={selectedStore && selectedStore.latitude && selectedStore.longitude ? {
                                        lat: parseFloat(selectedStore.latitude),
                                        lng: parseFloat(selectedStore.longitude)
                                    } : (data?.stores_support && allStores.length > 0 ? {
                                        lat: allStores.filter(store => store.latitude && store.longitude)
                                            .reduce((sum, store) => sum + parseFloat(store.latitude), parseFloat(locationGps.lat)) /
                                            (allStores.filter(store => store.latitude && store.longitude).length + 1),
                                        lng: allStores.filter(store => store.latitude && store.longitude)
                                            .reduce((sum, store) => sum + parseFloat(store.longitude), parseFloat(locationGps.lng)) /
                                            (allStores.filter(store => store.latitude && store.longitude).length + 1)
                                    } : locationGps)}
                                    options={{
                                        styles: [
                                            {
                                                featureType: "poi",
                                                elementType: "labels",
                                                stylers: [{ visibility: "off" }]
                                            }
                                        ]
                                    }}
                                >
                                    {/* Marcador de la ubicación principal */}
                                    <Marker
                                        position={mainStoreData && mainStoreData.latitude && mainStoreData.longitude ? {
                                            lat: parseFloat(mainStoreData.latitude),
                                            lng: parseFloat(mainStoreData.longitude)
                                        } : locationGps}
                                        icon={{
                                            url: "data:image/svg+xml;base64," + btoa(`
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${Global.APP_COLOR_PRIMARY}" width="48" height="48">
                                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                </svg>
                                            `),
                                            scaledSize: { width: 48, height: 48 },
                                            anchor: { x: 24, y: 48 }
                                        }}
                                        title={mainStoreData ? mainStoreData.name : "Sede Principal"}
                                        onClick={() => setSelectedStore(mainStoreData ? {
                                            ...mainStoreData,
                                            type: 'principal'
                                        } : {
                                            id: 'main',
                                            name: 'Sede Principal',
                                            type: 'principal',
                                            address: getContact("address"),
                                            phone: getContactPhones('phone_contact')[0],
                                            latitude: locationGps.lat,
                                            longitude: locationGps.lng
                                        })}
                                    />

                                    {/* Marcadores de todas las tiendas (excluyendo la tienda principal para evitar duplicados) */}
                                    {data?.stores_support && allStores
                                        .filter(store => store.latitude && store.longitude &&
                                            store.latitude !== "0" && store.longitude !== "0" &&
                                            store.type !== "tienda_principal")
                                        .map((store) => (
                                            <Marker
                                                key={store.id}
                                                position={{
                                                    lat: parseFloat(store.latitude),
                                                    lng: parseFloat(store.longitude)
                                                }}
                                                icon={{
                                                    url: "data:image/svg+xml;base64," + btoa(`
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${getStoreTypeColor(store.type)}" width="36" height="36">
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                                    </svg>
                                                `),
                                                    scaledSize: { width: 36, height: 36 },
                                                    anchor: { x: 18, y: 36 }
                                                }}
                                                title={`${store.name} (${getStoreTypeName(store.type)})`}
                                                onClick={() => setSelectedStore(store)}
                                            />
                                        ))}

                                    {/* InfoWindow para mostrar detalles de la tienda seleccionada */}
                                    {data?.stores_support && selectedStore && (
                                        <InfoWindow
                                            position={{
                                                lat: parseFloat(selectedStore.latitude),
                                                lng: parseFloat(selectedStore.longitude)
                                            }}
                                            onCloseClick={() => setSelectedStore(null)}
                                        >
                                            <div style={{ padding: "10px", maxWidth: "250px" }}>
                                                <h4 style={{ margin: "0 0 8px 0", color: getStoreTypeColor(selectedStore.type), fontWeight: "bold" }}>
                                                    {selectedStore.name}
                                                </h4>
                                                <p style={{ margin: "0 0 5px 0", color: Global.APP_COLOR_PRIMARY, fontSize: "12px", textTransform: "uppercase", fontWeight: "500" }}>
                                                    {selectedStore.type === 'principal' ? 'Sede Principal' : getStoreTypeName(selectedStore.type)}
                                                </p>
                                                <div style={{ display: "flex", alignItems: "center", gap: "5px", margin: "0 0 8px 0", color: "#374151", lineHeight: "1.4" }}>
                                                    <svg style={{ width: "14px", height: "14px", color: "#6B7280" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{selectedStore.address}</span>
                                                </div>
                                                {selectedStore.phone && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", margin: "0 0 8px 0", color: Global.APP_COLOR_PRIMARY }}>
                                                        <svg style={{ width: "14px", height: "14px", color: "#10B981" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <a href={`tel:${selectedStore.phone}`} style={{ color: getStoreTypeColor(selectedStore.type), textDecoration: "none" }}>
                                                            {selectedStore.phone}
                                                        </a>
                                                    </div>
                                                )}
                                                {selectedStore.email && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", margin: "0 0 8px 0", color: Global.APP_COLOR_PRIMARY }}>
                                                        <svg style={{ width: "14px", height: "14px", color: "#3B82F6" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                                                        </svg>
                                                        <a href={`mailto:${selectedStore.email}`} style={{ color: getStoreTypeColor(selectedStore.type), textDecoration: "none" }}>
                                                            {selectedStore.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {selectedStore.schedule && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "5px", margin: "0", color: Global.APP_COLOR_PRIMARY, fontSize: "13px" }}>
                                                        <svg style={{ width: "14px", height: "14px", color: "#F59E0B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{selectedStore.schedule}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </InfoWindow>
                                    )}

                                </GoogleMap>
                            </LoadScript>
                        </div>

                        {/* Información detallada de la tienda seleccionada */}
                        {data?.stores_support && selectedStore ? (
                            <motion.div
                                className="space-y-6"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Imagen grande de la tienda seleccionada */}
                                <motion.div
                                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {selectedStore.image ? (
                                        <div className="relative">
                                            <img
                                                src={`/storage/images/store/${selectedStore.image}`}

                                                alt={selectedStore.name}
                                                className="w-full h-64 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                            <div className="absolute bottom-4 left-6 text-white">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                                                        {(() => {
                                                            const IconComponent = getStoreTypeIcon(selectedStore.type);
                                                            return <IconComponent className="w-5 h-5 text-white" />;
                                                        })()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-white">
                                                            {selectedStore.name}
                                                        </h4>
                                                        <p className="text-sm font-medium text-white/90">
                                                            {selectedStore.type === 'principal' ? 'Sede Principal' : getStoreTypeName(selectedStore.type)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-white/90 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {selectedStore.address}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="p-6 rounded-full bg-white/80 backdrop-blur-sm mb-4 inline-block">
                                                    {(() => {
                                                        const IconComponent = getStoreTypeIcon(selectedStore.type);
                                                        return <IconComponent className="w-12 h-12 customtext-primary" />;
                                                    })()}
                                                </div>
                                                <h4 className="text-2xl font-bold text-gray-700 mb-2">
                                                    {selectedStore.name}
                                                </h4>
                                                <p className="customtext-primary font-medium mb-2">
                                                    {selectedStore.type === 'principal' ? 'Sede Principal' : getStoreTypeName(selectedStore.type)}
                                                </p>
                                                <p className="text-gray-600 flex items-center justify-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {selectedStore.address}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>

                                {/* Horarios de atención semanal */}
                                <motion.div
                                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 rounded-lg bg-blue-50">
                                            <svg className="w-6 h-6 customtext-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h5 className="text-lg font-bold text-gray-800">Horarios de Atención</h5>
                                    </div>

                                    {selectedStore.business_hours ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Parseamos los horarios reales desde business_hours */}
                                            {(() => {
                                                let businessHours;
                                                try {
                                                    // Intentamos parsear el JSON de business_hours
                                                    businessHours = typeof selectedStore.business_hours === 'string'
                                                        ? JSON.parse(selectedStore.business_hours)
                                                        : selectedStore.business_hours;
                                                } catch (error) {
                                                    console.error('Error parsing business_hours:', error);
                                                    businessHours = null;
                                                }

                                                // Si no se pudo parsear, usar horarios predeterminados
                                                if (!businessHours || !Array.isArray(businessHours)) {
                                                    businessHours = [
                                                        { day: 'Lunes', open: '08:00', close: '18:00', closed: false },
                                                        { day: 'Martes', open: '08:00', close: '18:00', closed: false },
                                                        { day: 'Miércoles', open: '08:00', close: '18:00', closed: false },
                                                        { day: 'Jueves', open: '08:00', close: '18:00', closed: false },
                                                        { day: 'Viernes', open: '08:00', close: '18:00', closed: false },
                                                        { day: 'Sábado', open: '09:00', close: '13:00', closed: false },
                                                        { day: 'Domingo', open: '', close: '', closed: true }
                                                    ];
                                                }

                                                // Función para formatear la hora
                                                const formatTime = (time) => {
                                                    if (!time) return '';
                                                    const [hours, minutes] = time.split(':');
                                                    const hour = parseInt(hours);
                                                    const ampm = hour >= 12 ? 'PM' : 'AM';
                                                    const hour12 = hour % 12 || 12;
                                                    return `${hour12}:${minutes} ${ampm}`;
                                                };

                                                const currentDay = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
                                                const dayMapping = [6, 0, 1, 2, 3, 4, 5]; // Mapeo para que Lunes sea 0
                                                const todayIndex = dayMapping[currentDay];

                                                return businessHours.map((schedule, index) => {
                                                    const isToday = index === todayIndex;
                                                    const isClosed = schedule.closed;
                                                    const hoursText = isClosed
                                                        ? 'Cerrado'
                                                        : `${formatTime(schedule.open)} - ${formatTime(schedule.close)}`;

                                                    return (
                                                        <motion.div
                                                            key={schedule.day}
                                                            className={`flex justify-between items-center p-3 rounded-lg transition-all ${isToday
                                                                ? 'bg-blue-50 border-2 border-blue-200'
                                                                : 'bg-gray-50 border border-gray-200'
                                                                }`}
                                                            initial={{ x: -20, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        >
                                                            <span className={`font-medium ${isToday ? 'customtext-primary' : 'text-gray-700'
                                                                }`}>
                                                                {schedule.day}
                                                                {isToday && (
                                                                    <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                                                                        Hoy
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className={`text-sm ${isClosed
                                                                ? 'text-red-500 font-medium'
                                                                : isToday
                                                                    ? 'customtext-primary font-medium'
                                                                    : 'text-gray-600'
                                                                }`}>
                                                                {hoursText}
                                                            </span>
                                                        </motion.div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="p-4 rounded-full bg-gray-100 inline-block mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500">Horarios no disponibles</p>
                                            <p className="text-sm text-gray-400 mt-1">Contacta directamente para más información</p>
                                        </div>
                                    )}

                                    {/* Información de contacto adicional */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedStore.phone && (
                                                <a
                                                    href={`tel:${selectedStore.phone}`}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                                                >
                                                    <PhoneCall className="w-5 h-5 customtext-neutral-dark group-hover:customtext-primary" />
                                                    <div>
                                                        <p className="font-medium customtext-neutral-dark">Llamar ahora</p>
                                                        <p className="text-sm customtext-neutral-dark">{selectedStore.phone}</p>
                                                    </div>
                                                </a>
                                            )}

                                            {selectedStore.email && (
                                                <a
                                                    href={`mailto:${selectedStore.email}`}
                                                    className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors group"
                                                >
                                                    <Mail className="w-5 h-5 customtext-primary group-hover:customtext-primary" />
                                                    <div>
                                                        <p className="font-medium customtext-primary">Enviar email</p>
                                                        <p className="text-sm customtext-primary">{selectedStore.email}</p>
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : data?.stores_support && !loadingStores && Object.keys(storesByType).length > 0 && (
                            <motion.div
                                className="space-y-6"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Grid estilo Fibonacci de imágenes */}
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                                    <h5 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50">
                                            <svg className="w-5 h-5 customtext-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        Galería de Sucursales
                                    </h5>

                                    <div className="grid grid-cols-2 gap-4 h-80">
                                        {allStores.slice(0, 4).map((store, index) => {
                                            // Layout optimizado para 4 imágenes
                                            const layoutClasses = [
                                                "col-span-1 row-span-1", // Superior izquierdo
                                                "col-span-1 row-span-1", // Superior derecho
                                                "col-span-1 row-span-1", // Inferior izquierdo
                                                "col-span-1 row-span-1", // Inferior derecho
                                            ];

                                            return (
                                                <motion.div
                                                    key={store.id}
                                                    className={`${layoutClasses[index]} relative group cursor-pointer overflow-hidden rounded-xl shadow-lg`}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                                    whileHover={{ scale: 1.02, y: -5 }}
                                                    onClick={() => setSelectedStore(store)}
                                                >
                                                    {store.image ? (
                                                        <img
                                                            src={`/storage/images/store/${store.image}`}
                                                            alt={store.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center">
                                                            {(() => {
                                                                const IconComponent = getStoreTypeIcon(store.type);
                                                                return <IconComponent className="w-16 h-16 customtext-primary" />;
                                                            })()}
                                                        </div>
                                                    )}

                                                    {/* Overlay con información mejorado */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <div className="absolute bottom-4 left-4 right-4 text-white">
                                                            <h6 className="font-bold text-lg leading-tight mb-2">
                                                                {store.name}
                                                            </h6>
                                                            <p className="text-sm opacity-90 mb-2">
                                                                {getStoreTypeName(store.type)}
                                                            </p>
                                                            <div className="flex items-center gap-2 text-xs opacity-80">
                                                                <MapPin className="w-3 h-3" />
                                                                <span className="truncate">{store.address}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Badge de tipo en la esquina superior */}
                                                    <div className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
                                                        {(() => {
                                                            const IconComponent = getStoreTypeIcon(store.type);
                                                            return <IconComponent className="w-4 h-4 customtext-primary" />;
                                                        })()}
                                                    </div>

                                                    {/* Indicador de clic */}
                                                    <div className="absolute top-3 left-3 p-2 rounded-lg bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default ContactGrid;
