import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, PhoneCall, Loader2 } from "lucide-react";
import {
    GoogleMap,
    LoadScript,
    Marker,
} from "@react-google-maps/api";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const MapFimesac = ({ data, contacts: passedContacts, generals }) => {
    const contacts = passedContacts || generals || [];
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
        lat: Number(location.split(",").map((x) => x.trim())[0]) || 0,
        lng: Number(location.split(",").map((x) => x.trim())[1]) || 0,
    };

    const [allStores, setAllStores] = useState([]);
    const [loadingStores, setLoadingStores] = useState(true);
    const [selectedStore, setSelectedStore] = useState(null);
    const [mainStoreData, setMainStoreData] = useState(null);

    useEffect(() => {
        const loadStores = async () => {
            try {
                setLoadingStores(true);
                const response = await fetch("/api/stores");
                const result = await response.json();

                let storeData = result;
                if (result.data) {
                    storeData = result.data;
                } else if (result.body) {
                    storeData = result.body;
                }

                if (Array.isArray(storeData)) {
                    const activeStores = storeData.filter(
                        (store) => store.status !== false
                    );
                    setAllStores(activeStores);

                    const mainStore = activeStores.find(
                        (store) => store.type === "tienda_principal"
                    );
                    if (mainStore) {
                        setMainStoreData(mainStore);
                    }
                } else {
                    setAllStores([]);
                }
            } catch (error) {
                console.error("Error loading stores:", error);
                setAllStores([]);
            } finally {
                setLoadingStores(false);
            }
        };

        loadStores();
    }, []);

    return (
        <section
            id={data?.element_id}
            className="bg-white py-10 lg:py-24"
        >
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="mb-10 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b-[6px] border-neutral-dark pb-4"
                    >
                        <div className="max-w-4xl">
                            <span className="text-sm font-bold text-primary block uppercase tracking-wider">
                                Encuéntranos
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-neutral-dark">
                                <TextWithHighlight
                                    text={data?.title || "Nuestras *Ubicaciones*"}
                                    className="font-title"
                                    color="bg-primary"
                                />
                            </h1>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Store Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-neutral-50 p-8 hover:bg-neutral-dark group transition-all duration-500 border border-neutral-100 shadow-sm"
                    >
                        <div className="bg-white w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500 shadow-sm">
                            <MapPin className="w-5 h-5 text-neutral-dark group-hover:text-white" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-neutral-400 group-hover:text-white/50 transition-colors">
                            Sede Principal
                        </h3>
                        <p className="text-base font-bold text-neutral-dark group-hover:text-white transition-colors">
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
                        className="bg-neutral-50 p-8 hover:bg-neutral-dark group transition-all duration-500 border border-neutral-100 shadow-sm"
                    >
                        <div className="bg-white w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500 shadow-sm">
                            <Mail className="w-5 h-5 text-neutral-dark group-hover:text-white" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-neutral-400 group-hover:text-white/50 transition-colors">
                            Canales Digitales
                        </h3>
                        <div className="space-y-2">
                            {getContactEmails("email_contact").map(
                                (email, index) => (
                                    <a
                                        key={index}
                                        href={`mailto:${email}`}
                                        className="text-base font-bold block text-neutral-dark group-hover:text-white hover:text-primary transition-colors underline decoration-neutral-dark/10 group-hover:decoration-white/10"
                                    >
                                        {email}
                                    </a>
                                )
                            )}
                        </div>
                    </motion.div>

                    {/* Phone Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-neutral-50 p-8 hover:bg-neutral-dark group transition-all duration-500 border border-neutral-100 shadow-sm"
                    >
                        <div className="bg-white w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500 shadow-sm">
                            <PhoneCall className="w-5 h-5 text-neutral-dark group-hover:text-white" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-neutral-400 group-hover:text-white/50 transition-colors">
                            Atención Directa
                        </h3>
                        <div className="space-y-2">
                            {getContactPhones("phone_contact").map(
                                (phone, index) => (
                                    <a
                                        key={index}
                                        href={`tel:${phone}`}
                                        className="text-base font-bold block text-neutral-dark group-hover:text-white hover:text-primary transition-colors"
                                    >
                                        {phone}
                                    </a>
                                )
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Map Container */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >


                    <div className="relative border-2 border-neutral-dark/10 h-[600px] w-full bg-neutral-100 overflow-hidden shadow-xl rounded-sm">
                        {loadingStores && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                                                selectedStore.latitude
                                            ),
                                            lng: parseFloat(
                                                selectedStore.longitude
                                            ),
                                        }
                                        : locationGps
                                }
                                options={{
                                    styles: [
                                        {
                                            featureType: "all",
                                            elementType: "all",
                                            stylers: [{ saturation: -100 }],
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
                                                    mainStoreData.latitude
                                                ),
                                                lng: parseFloat(
                                                    mainStoreData.longitude
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
                                                "tienda_principal"
                                        )
                                        .map((store) => (
                                            <Marker
                                                key={store.id}
                                                position={{
                                                    lat: parseFloat(
                                                        store.latitude
                                                    ),
                                                    lng: parseFloat(
                                                        store.longitude
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

export default MapFimesac;
