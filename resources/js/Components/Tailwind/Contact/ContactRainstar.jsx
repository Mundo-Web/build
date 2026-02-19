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
        "!rounded-none !border-x-0 !border-t-0 border-b border-neutral-900 !px-0 py-4 bg-transparent focus:!ring-0 focus:!outline-none focus:!border-x-0 focus:!border-t-0 focus:border-b-2 text-xs uppercase tracking-widest placeholder:text-neutral-300 transition-all font-medium w-full";
    const rainstarLabelClass =
        "text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2 block";

    return (
        <section
            id={data?.element_id}
            className="bg-white min-h-screen pt-20 pb-32"
        >
            <div className="container mx-auto px-4 md:px-6 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="mb-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b-4 border-black pb-8">
                        <div className="max-w-3xl">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                                Contáctanos
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                                {data?.title || "Hablemos Hoy"}
                            </h1>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-right text-xs font-bold uppercase tracking-widest opacity-60 max-w-xs leading-relaxed">
                                {data?.description ||
                                    "¿Tienes preguntas? Estamos aquí para ayudarte."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 order-2 lg:order-1 space-y-12">
                        {/* Store Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Store className="w-6 h-6 group-hover:text-white transition-colors" />
                                <h3 className="text-lg font-black uppercase tracking-wider">
                                    Tienda Principal
                                </h3>
                            </div>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-80 leading-relaxed group-hover:opacity-100">
                                {mainStoreData
                                    ? mainStoreData.address
                                    : getContact("address")}
                            </p>
                        </motion.div>

                        {/* Email Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Mail className="w-6 h-6 group-hover:text-white transition-colors" />
                                <h3 className="text-lg font-black uppercase tracking-wider">
                                    Email
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {getContactEmails("email_contact").map(
                                    (email, index) => (
                                        <a
                                            key={index}
                                            href={`mailto:${email}`}
                                            className="text-sm font-bold uppercase tracking-widest block hover:underline"
                                        >
                                            {email}
                                        </a>
                                    ),
                                )}
                            </div>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="border-4 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Phone className="w-6 h-6 group-hover:text-white transition-colors" />
                                <h3 className="text-lg font-black uppercase tracking-wider">
                                    Teléfono
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {getContactPhones("phone_contact").map(
                                    (phone, index) => (
                                        <a
                                            key={index}
                                            href={`tel:${phone}`}
                                            className="text-sm font-bold uppercase tracking-widest block hover:underline"
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
                            <div className="flex items-center gap-4 border-b border-neutral-900 pb-4 mb-8">
                                <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                    01
                                </span>
                                <h2 className="text-xl font-bold uppercase tracking-tighter">
                                    Envíanos un Mensaje
                                </h2>
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
                                        placeholder="EJ. JOHN DOE"
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
                                        className={`${rainstarInputClass} ${phoneError ? "border-red-500 text-red-500" : ""}`}
                                        required
                                    />
                                    {phoneError && (
                                        <p className="text-[10px] text-red-500 mt-1 font-bold uppercase tracking-wider">
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
                                        placeholder="EMAIL@EJEMPLO.COM"
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
                                        placeholder="¿CÓMO PODEMOS AYUDARTE?"
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
                                    className="px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:brightness-125 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group w-full md:w-auto"
                                >
                                    {sending ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            Enviar Mensaje
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-32">
                    <div className="flex items-center gap-4 border-b-4 border-black pb-8 mb-12">
                        <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                            02
                        </span>
                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">
                            {data?.title_ubication || "Nuestras Ubicaciones"}
                        </h2>
                    </div>

                    <div className="relative border-4 border-black h-[500px] w-full bg-neutral-100 overflow-hidden">
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
                </div>
            </div>
        </section>
    );
};

export default ContactRainstar;
