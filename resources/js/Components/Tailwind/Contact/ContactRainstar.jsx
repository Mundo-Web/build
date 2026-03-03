import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Mail,
    Phone,
    Store,
    MapPin,
    PhoneCall,
    ArrowRight,
    Loader2,
} from "lucide-react";
import {
    GoogleMap,
    LoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import { toast } from "sonner";
import MessagesRest from "../../../Actions/MessagesRest";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const messagesRest = new MessagesRest();

const ContactRainstar = ({ data, contacts }) => {
    const getContact = (correlative) => {
        return (
            contacts.find((contact) => contact.correlative === correlative)
                ?.description || ""
        );
    };

    const getContactEmails = (correlative) => {
        const emailString = getContact(correlative);
        if (!emailString) return [];
        return emailString
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email);
    };

    const getContactPhones = (correlative) => {
        const phoneString = getContact(correlative);
        if (!phoneString) return [];
        return phoneString
            .split(",")
            .map((phone) => phone.trim())
            .filter((phone) => phone);
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
    const [mainStoreData, setMainStoreData] = useState(null);

    useEffect(() => {
        const loadStores = async () => {
            try {
                setLoadingStores(true);
                const response = await fetch("/api/stores");
                const result = await response.json();

                let data = result;
                if (result.data) {
                    data = result.data;
                } else if (result.body) {
                    data = result.body;
                }

                if (Array.isArray(data)) {
                    const activeStores = data.filter(
                        (store) => store.status !== false,
                    );
                    setAllStores(activeStores);

                    const mainStore = activeStores.find(
                        (store) => store.type === "tienda_principal",
                    );
                    if (mainStore) {
                        setMainStoreData(mainStore);
                    }

                    const groupedByType = activeStores.reduce((acc, store) => {
                        const type = store.type || "otro";
                        if (!acc[type]) {
                            acc[type] = [];
                        }
                        acc[type].push(store);
                        return acc;
                    }, {});

                    setStoresByType(groupedByType);
                } else {
                    setAllStores([]);
                    setStoresByType({});
                }
            } catch (error) {
                console.error("Error loading stores:", error);
                setAllStores([]);
                setStoresByType({});
            } finally {
                setLoadingStores(false);
            }
        };

        loadStores();
    }, []);

    const getStoreTypeColor = (type) => Global.APP_COLOR_PRIMARY;

    const getStoreTypeName = (type) => {
        const typeNames = {
            tienda_principal: "Tienda Principal",
            tienda: "Tiendas",
            oficina: "Oficinas",
            agencia: "Agencias",
            almacen: "Almacenes",
            showroom: "Showrooms",
            otro: "Otros Puntos",
        };
        return typeNames[type?.toLowerCase()] || "Otros Puntos";
    };

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

        const phoneNumbers = phoneValue.replace(/\D/g, "");
        const phoneValidationError = validatePhone(phoneValue);
        if (phoneValidationError) {
            setPhoneError(phoneValidationError);
            toast.error("Error de validación", {
                description: phoneValidationError,
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

        if (nameRef.current) nameRef.current.value = "";
        if (phoneRef.current) phoneRef.current.value = "";
        setPhoneValue("");
        setPhoneError("");
        if (emailRef.current) emailRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";

        toast.success("Mensaje enviado", {
            description:
                "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
        });
        setSending(false);

        if (!result) return;

        if (data?.redirect) {
            location.href = data?.redirect;
        }
    };

    const rainstarInputClass =
        "w-full border-2 border-gray-200 p-4 font-medium outline-none transition-all bg-white text-neutral-800 placeholder-neutral-300 focus:border-black hover:border-gray-400";
    const rainstarLabelClass =
        "text-[11px] font-bold text-neutral-400 block mb-1.5";

    return (
        <section
            id={data?.element_id}
            className="bg-white min-h-screen pt-24 pb-40"
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* ── Header Section ─────────────────────────────────────────── */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 border-b-[6px] border-neutral-dark pb-12"
                    >
                        <div className="max-w-4xl">
                            <span className="text-[11px] font-bold text-primary mb-6 block">
                                Estamos para ayudarte
                            </span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-neutral-dark mb-4">
                                <TextWithHighlight
                                    text={data?.title || "Hablemos *Hoy*"}
                                />
                            </h1>
                        </div>
                        <div className="hidden md:block max-w-[280px]">
                            <p className="text-right text-[11px] font-medium text-neutral-dark/40 leading-relaxed italic">
                                {data?.description ||
                                    "¿Tienes preguntas o propuestas? Nuestro equipo especializado está listo para brindarte una solución inmediata."}
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6 order-2 lg:order-1">
                        {/* Store Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-neutral-50 p-10 hover:bg-neutral-dark group transition-all duration-500 border border-neutral-100"
                        >
                            <div className="bg-white w-12 h-12 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500 shadow-sm">
                                <MapPin className="w-5 h-5 text-neutral-dark group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-black mb-4 text-neutral-dark group-hover:text-white/50 transition-colors">
                                Sede Principal
                            </h3>
                            <p className="text-base font-bold leading-relaxed text-neutral-dark group-hover:text-white transition-colors">
                                {mainStoreData
                                    ? mainStoreData.address
                                    : getContact("address")}
                            </p>
                        </motion.div>

                        {/* Email Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-neutral-50 p-10 hover:bg-neutral-dark group transition-all duration-500 border border-neutral-100"
                        >
                            <div className="bg-white w-12 h-12 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500 shadow-sm">
                                <Mail className="w-5 h-5 text-neutral-dark group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-black mb-4 text-neutral-dark group-hover:text-white/50 transition-colors">
                                Canales Digitales
                            </h3>
                            <div className="space-y-3">
                                {getContactEmails("email_contact").map(
                                    (email, index) => (
                                        <a
                                            key={index}
                                            href={`mailto:${email}`}
                                            className="text-base font-bold block text-neutral-dark group-hover:text-white hover:text-primary transition-colors underline decoration-neutral-dark/10 group-hover:decoration-white/10"
                                        >
                                            {email}
                                        </a>
                                    ),
                                )}
                            </div>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-neutral-50 p-10 hover:bg-neutral-dark group transition-all duration-500 border border-neutral-100"
                        >
                            <div className="bg-white w-12 h-12 flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500 shadow-sm">
                                <PhoneCall className="w-5 h-5 text-neutral-dark group-hover:text-white" />
                            </div>
                            <h3 className="text-sm font-black mb-4 text-neutral-dark group-hover:text-white/50 transition-colors">
                                Atención Directa
                            </h3>
                            <div className="space-y-3">
                                {getContactPhones("phone_contact").map(
                                    (phone, index) => (
                                        <a
                                            key={index}
                                            href={`tel:${phone}`}
                                            className="text-base font-bold block text-neutral-dark group-hover:text-white hover:text-primary transition-colors"
                                        >
                                            {phone}
                                        </a>
                                    ),
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Form area */}
                    <div className="lg:col-span-8 order-1 lg:order-2">
                        <form onSubmit={onSubmit} className="space-y-12">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-8">
                                <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                    01
                                </div>
                                <h1 className="text-xl font-black tracking-tight text-neutral-dark">
                                    Envíanos un Mensaje
                                </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                                <div className="md:col-span-2">
                                    <label className={rainstarLabelClass}>
                                        Nombre Completo
                                    </label>
                                    <input
                                        ref={nameRef}
                                        disabled={sending}
                                        type="text"
                                        name="name"
                                        placeholder="Ej. John Doe"
                                        className={rainstarInputClass}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={rainstarLabelClass}>
                                        Teléfono (9 Dígitos)
                                    </label>
                                    <input
                                        ref={phoneRef}
                                        disabled={sending}
                                        type="tel"
                                        name="phone"
                                        placeholder="999 999 999"
                                        value={phoneValue}
                                        onChange={handlePhoneChange}
                                        maxLength={11}
                                        className={`${rainstarInputClass} ${phoneError ? "border-red-400 bg-red-50" : ""}`}
                                        required
                                    />
                                    {phoneError && (
                                        <p className="text-[10px] text-red-500 mt-1 font-bold">
                                            {phoneError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={rainstarLabelClass}>
                                        Correo Electrónico
                                    </label>
                                    <input
                                        ref={emailRef}
                                        disabled={sending}
                                        type="email"
                                        name="email"
                                        placeholder="correo@ejemplo.com"
                                        className={rainstarInputClass}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={rainstarLabelClass}>
                                        Mensaje
                                    </label>
                                    <textarea
                                        ref={descriptionRef}
                                        disabled={sending}
                                        name="message"
                                        placeholder="¿Cómo podemos ayudarte?"
                                        rows="6"
                                        className={`${rainstarInputClass} resize-none`}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8">
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-12 py-6 text-[11px] font-black uppercase tracking-[0.2em] bg-neutral-dark text-white hover:bg-primary disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center gap-6 group w-full md:w-auto shadow-xl"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            Enviar Mensaje
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-40"
                >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-12 mb-16 gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                02
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-dark">
                                <TextWithHighlight
                                    text={
                                        data?.title_ubication ||
                                        "Nuestras *Ubicaciones*"
                                    }
                                />
                            </h2>
                        </div>
                        <div className="hidden lg:block bg-neutral-dark h-[2px] flex-1 max-w-[100px] opacity-20"></div>
                    </div>

                    <div className="relative border-2 border-neutral-dark/10 h-[600px] w-full bg-neutral-100 overflow-hidden shadow-2xl">
                        {loadingStores && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 animate-spin" />
                            </div>
                        )}
                        <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "100%",
                                }}
                                zoom={
                                    selectedStore
                                        ? 16
                                        : data?.stores_support &&
                                            allStores.length > 0
                                          ? 12
                                          : 16
                                }
                                center={
                                    selectedStore &&
                                    selectedStore.latitude &&
                                    selectedStore.longitude
                                        ? {
                                              lat: parseFloat(
                                                  selectedStore.latitude,
                                              ),
                                              lng: parseFloat(
                                                  selectedStore.longitude,
                                              ),
                                          }
                                        : locationGps
                                }
                                options={{
                                    styles: [
                                        {
                                            featureType: "all",
                                            elementType: "all",
                                            stylers: [{ saturation: -100 }], // Grayscale map
                                        },
                                    ],
                                }}
                            >
                                <Marker
                                    position={
                                        mainStoreData &&
                                        mainStoreData.latitude &&
                                        mainStoreData.longitude
                                            ? {
                                                  lat: parseFloat(
                                                      mainStoreData.latitude,
                                                  ),
                                                  lng: parseFloat(
                                                      mainStoreData.longitude,
                                                  ),
                                              }
                                            : locationGps
                                    }
                                    title={
                                        mainStoreData
                                            ? mainStoreData.name
                                            : "Sede Principal"
                                    }
                                    onClick={() =>
                                        setSelectedStore(mainStoreData)
                                    }
                                />

                                {data?.stores_support &&
                                    allStores
                                        .filter(
                                            (store) =>
                                                store.latitude &&
                                                store.longitude &&
                                                store.latitude !== "0" &&
                                                store.longitude !== "0" &&
                                                store.type !==
                                                    "tienda_principal",
                                        )
                                        .map((store) => (
                                            <Marker
                                                key={store.id}
                                                position={{
                                                    lat: parseFloat(
                                                        store.latitude,
                                                    ),
                                                    lng: parseFloat(
                                                        store.longitude,
                                                    ),
                                                }}
                                                title={store.name}
                                                onClick={() =>
                                                    setSelectedStore(store)
                                                }
                                            />
                                        ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactRainstar;
