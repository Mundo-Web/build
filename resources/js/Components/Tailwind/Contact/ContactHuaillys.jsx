import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MessagesRest from "../../../Actions/MessagesRest";
import Global from "../../../Utils/Global";
import { toast } from "sonner";

const ContactHuaillys = ({ data, contacts }) => {
    const messagesRest = new MessagesRest();

    const getContact = (correlative) => {
        const contact = contacts.find((x) => x.correlative === correlative);
        return contact ? contact.description : "";
    };

    // Función para procesar emails separados por comas
    const getContactEmails = (correlative) => {
        const emails = getContact(correlative);
        return emails ? emails.split(',').map(email => email.trim()).filter(email => email) : [];
    };

    // Función para procesar teléfonos separados por comas
    const getContactPhones = (correlative) => {
        const phones = getContact(correlative);
        return phones ? phones.split(',').map(phone => phone.trim()).filter(phone => phone) : [];
    };

    const location = contacts.find((x) => x.correlative == "location")?.description ?? "0,0";
    const locationGps = {
        lat: Number(location.split(",").map((x) => x.trim())[0]),
        lng: Number(location.split(",").map((x) => x.trim())[1]),
    };

    // Referencias del formulario
    const nameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);
    const [phoneValue, setPhoneValue] = useState("");
    const [phoneError, setPhoneError] = useState("");

    // Formatea el teléfono en formato 999 999 999
    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 9)}`;
    };

    // Valida el teléfono peruano
    const validatePhone = (phone) => {
        const numbers = phone.replace(/\D/g, "");
        if (numbers.length === 0) return "";
        if (numbers.length !== 9) return "El teléfono debe tener 9 dígitos";
        if (!numbers.startsWith("9")) return "El teléfono debe empezar con 9";
        return "";
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhone(e.target.value);
        setPhoneValue(formatted);
        const error = validatePhone(formatted);
        setPhoneError(error);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const phoneNumbers = phoneValue.replace(/\D/g, "");
        const phoneValidation = validatePhone(phoneNumbers);
        
        if (phoneValidation) {
            setPhoneError(phoneValidation);
            setSending(false);
            return;
        }

        const request = {
            full_name: nameRef.current.value,
            phone: phoneNumbers,
            email: emailRef.current.value,
            message: descriptionRef.current.value,
            subject: "Contacto desde web"
        };

        const result = await messagesRest.save(request);
        setSending(false);

        if (!result) return;

        toast.success("¡Mensaje enviado!", {
            description: "Gracias por contactarnos. Te responderemos pronto.",
            duration: 4000,
            position: "top-center",
        });

        // Limpiar formulario
        nameRef.current.value = "";
        phoneRef.current.value = "";
        emailRef.current.value = "";
        descriptionRef.current.value = "";
        setPhoneValue("");
        setPhoneError("");
    };

    return (
        <motion.section
            className="bg-sections-color py-12 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl flex flex-col lg:flex-row gap-12 justify-between  rounded-xl py-4  md:py-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Formulario de contacto */}
                <motion.div
                    className="w-full lg:w-3/6"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <motion.h2
                        className={`text-5xl font-title  mb-4 ${data?.class_title || 'customtext-neutral-dark'}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        {data?.title || 'Contáctanos'}
                    </motion.h2>
                    <motion.p
                        className={`customtext-neutral-light font-paragraph text-lg mb-8 ${data?.class_description || ''}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        {data?.description || 'Nos encantaría saber de ti. Envíanos un mensaje y te responderemos lo antes posible.'}
                    </motion.p>

                    <motion.form
                        onSubmit={onSubmit}
                        className="space-y-6"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {/* Campo Nombre */}
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.0 }}
                        >
                            <label className="block font-paragraph text-md font-bold customtext-neutral-dark mb-2">
                                Nombre completo *
                            </label>
                            <motion.input
                                ref={nameRef}
                                disabled={sending}
                                type="text"
                                name="name"
                                placeholder="Ingresa tu nombre completo"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300  focus:ring-0  focus:border-transparent outline-none transition-all duration-200"
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#F07407" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </motion.div>

                        {/* Campo Teléfono */}
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.1 }}
                        >
                            <label className="block font-paragraph text-md font-bold customtext-neutral-dark mb-2">
                                Teléfono *
                            </label>
                            <motion.input
                                ref={phoneRef}
                                disabled={sending}
                                type="tel"
                                name="phone"
                                placeholder="999 999 999"
                                value={phoneValue}
                                onChange={handlePhoneChange}
                                maxLength={11}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-0  focus:border-transparent outline-none transition-all duration-200 ${
                                    phoneError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                                }`}
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#F07407" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                            {phoneError && (
                                <motion.span
                                    className="text-red-500 text-xs flex items-center gap-1 mt-1"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {phoneError}
                                </motion.span>
                            )}
                        </motion.div>

                        {/* Campo Email */}
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                        >
                            <label className="block font-paragraph text-md font-bold customtext-neutral-dark mb-2">
                                Correo electrónico *
                            </label>
                            <motion.input
                                ref={emailRef}
                                disabled={sending}
                                type="email"
                                name="email"
                                placeholder="tu@email.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-0  focus:border-transparent outline-none transition-all duration-200"
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#F07407" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        </motion.div>

                        {/* Campo Mensaje */}
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                        >
                            <label className="block font-paragraph text-md font-bold customtext-neutral-dark mb-2">
                                Mensaje *
                            </label>
                            <motion.textarea
                                ref={descriptionRef}
                                disabled={sending}
                                name="message"
                                placeholder="Escribe tu mensaje aquí..."
                                rows="6"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-0  focus:border-transparent outline-none resize-none transition-all duration-200"
                                required
                                whileFocus={{ scale: 1.02, borderColor: "#F07407" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            ></motion.textarea>
                        </motion.div>

                        {/* Botón enviar */}
                        <motion.button
                            type="submit"
                            className={`bg-primary text-base font-bold text-white px-8 py-4 hover:brightness-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 w-full ${data?.class_button || 'rounded-xl'}`}
                            disabled={sending}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.4 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {sending && (
                                <motion.svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5"
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
                            {sending ? 'Enviando mensaje...' : 'Enviar mensaje'}
                        </motion.button>
                    </motion.form>
                </motion.div>

                {/* Información de contacto */}
                <motion.div
                    className="w-full lg:w-2/6 space-y-6"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    {/* Email */}
                    <motion.div
                        className={` p-6 rounded-xl group shadow-lg hover:bg-primary transition-all duration-300 cursor-pointer ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                       
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div className="flex items-center gap-3 customtext-accent group-hover:text-white mb-2">
                            <motion.div
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Mail className={`w-5 h-5 ${data?.class_card_icon || ''}`} />
                            </motion.div>
                            <h3 className={`font-bold text-lg ${data?.class_card_title || ''}`}>
                                Correo electrónico
                            </h3>
                        </div>
                        <p className={`mb-2 group-hover:text-white ${data?.class_card_description || ''}`}>
                            Escríbenos para recibir atención personalizada
                        </p>
                        <div className="space-y-1">
                            {getContactEmails('email_contact').map((email, index) => (
                                <a
                                    key={index}
                                    href={`mailto:${email}`}
                                    className={`customtext-accent group-hover:text-white font-bold hover:no-underline block ${data?.class_card_data || ''}`}
                                >
                                    {email}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Teléfono */}
                    <motion.div
                        className={` p-6 rounded-xl group shadow-lg hover:bg-primary transition-all duration-300 cursor-pointer ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div className="flex items-center gap-3 customtext-accent group-hover:text-white mb-2">
                            <motion.div
                                whileHover={{ rotate: -15, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Phone className={`w-5 h-5 ${data?.class_card_icon || ''}`} />
                            </motion.div>
                            <h3 className={`font-bold text-lg ${data?.class_card_title || ''}`}>
                                Teléfono
                            </h3>
                        </div>
                        <p className={`  group-hover:text-white mb-2 ${data?.class_card_description || ''}`}>
                            Llámanos para pedidos y consultas inmediatas
                        </p>
                        <div className="space-y-1">
                            {getContactPhones('phone_contact').map((phone, index) => (
                                <a
                                    key={index}
                                    href={`tel:${phone}`}
                                    className={`customtext-accent group-hover:text-white hover:no-underline font-bold block ${data?.class_card_data || ''}`}
                                >
                                    {phone}
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Dirección */}
                    <motion.div
                        className={` p-6 rounded-xl group shadow-lg hover:bg-primary transition-all duration-300 cursor-pointer ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                     
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div className="flex items-center gap-3 customtext-accent group-hover:text-white mb-2">
                            <motion.div
                                whileHover={{ rotate: -20, scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                                <MapPin className={`w-5 h-5 ${data?.class_card_icon || ''}`} />
                            </motion.div>
                            <h3 className={`font-bold text-lg ${data?.class_card_title || ''}`}>
                                Dirección
                            </h3>
                        </div>
                        <p className={`group-hover:text-white mb-2 ${data?.class_card_description || ''}`}>
                            Visítanos en nuestra ubicación
                        </p>
                        <p className={`customtext-accent  group-hover:text-white font-bold ${data?.class_card_data || ''}`}>
                            {getContact("address")}
                        </p>
                    </motion.div>

                    {/* Horarios */}
                    <motion.div
                        className={` p-6  rounded-xl group shadow-lg hover:bg-primary transition-all duration-300 cursor-pointer ${data?.class_card_container || ''}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                  
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div className="flex items-center gap-3 customtext-accent group-hover:text-white mb-2">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Clock className={`w-5 h-5 ${data?.class_card_icon || ''}`} />
                            </motion.div>
                            <h3 className={`font-bold text-lg ${data?.class_card_title || ''}`}>
                                Horario de atención
                            </h3>
                        </div>
                        <p className={`group-hover:text-white mb-2 ${data?.class_card_description || ''}`}>
                            Estamos abiertos para atenderte
                        </p>
                        <div className="space-y-1">
                            <p className={`customtext-accent group-hover:text-white font-bold ${data?.class_card_data || ''}`}>
                                {getContact("opening_hours") || "Lunes a Domingo: 8:00 AM - 10:00 PM"}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Mapa */}
            <motion.div
                className="mx-auto px-[5%] 2xl:px-0 2xl:max-w-7xl mt-8  rounded-xl "
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
            >
                <motion.div className="mb-6">
                    <motion.h3
                    className={`text-5xl font-title  mb-4 ${data?.class_title || 'customtext-neutral-dark'}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.7 }}
                    >
                       {data?.map_title || ' Nuestra ubicación'}
                    </motion.h3>
                    <motion.p
                      className={`customtext-neutral-light max-w-3xl font-paragraph text-lg mb-8 ${data?.class_description || ''}`}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.8 }}
                    >
                          {data?.map_description || 'Encuéntranos fácilmente con el mapa interactivo a continuación.'}
                    </motion.p>
                </motion.div>

                <motion.div
                    className="w-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.9 }}
                >
                    <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={{ 
                                width: "100%", 
                                height: "400px", 
                                borderRadius: "12px" 
                            }}
                            zoom={16}
                            center={locationGps}
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
                            <Marker
                                position={locationGps}
                                icon={{
                                    url: "data:image/svg+xml;base64," + btoa(`
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${Global.APP_COLOR_PRIMARY}" width="48" height="48">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    `),
                                    scaledSize: { width: 48, height: 48 },
                                    anchor: { x: 24, y: 48 }
                                }}
                                title="tienda principal"
                            />
                        </GoogleMap>
                    </LoadScript>
                </motion.div>
            </motion.div>
        </motion.section>
    );
};

export default ContactHuaillys;