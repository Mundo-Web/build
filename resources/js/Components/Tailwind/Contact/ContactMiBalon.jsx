import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

import MessagesRest from "../../../Actions/MessagesRest";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

// Animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
            duration: 0.6,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15,
            duration: 0.7,
        },
    },
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const cardHover = {
    rest: {
        y: 0,
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        scale: 1,
    },
    hover: {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

const ContactMiBalon = ({ data, generals = [] }) => {
    const messagesRest = new MessagesRest();
    messagesRest.enableNotifications = false;

    const nameRef = useRef();
    const lastnameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const descriptionRef = useRef();

    const [sending, setSending] = useState(false);

    const clearForm = () => {
        const fields = [
            nameRef,
            lastnameRef,
            phoneRef,
            emailRef,
            descriptionRef,
        ];
        fields.forEach((ref, index) => {
            if (ref.current) {
                setTimeout(() => {
                    ref.current.value = "";
                    ref.current.style.transform = "scale(0.98)";
                    setTimeout(() => {
                        ref.current.style.transform = "scale(1)";
                    }, 100);
                }, index * 50);
            }
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        const request = {
            name: nameRef.current.value + " " + lastnameRef.current.value,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            message: descriptionRef.current.value,
        };

        try {
            const result = await messagesRest.save(request);
            setSending(false);

            if (!result) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
                    confirmButtonText: "Entendido",
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Mensaje enviado",
                text: "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
                showConfirmButton: false,
                timer: 3000,
            });

            // CRM Atalaya Integration
            const generalsData = generals || [];
            const atalayaApiKey = generalsData.find(
                (item) => item.correlative === "atalaya_leads_api_key",
            )?.description;
            if (atalayaApiKey && atalayaApiKey.trim() !== "") {
                try {
                    const atalayaResponse = await fetch(
                        "https://crm.atalaya.pe/free/leads",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${atalayaApiKey}`,
                            },
                            body: JSON.stringify({
                                contact_name: request.name,
                                contact_phone: request.phone,
                                contact_email: request.email,
                                message: request.message,
                                origin: `Página Web ${Global.APP_NAME}`,
                                triggered_by: "Formulario de Contacto Mi Balón",
                            }),
                        },
                    );
                    const atalayaResult = await atalayaResponse.json();
                } catch (error) { }
            }

            if (data?.redirect) {
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 3000);
            } else if (result.redirect) {
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 3000);
            }

            clearForm();
        } catch (error) {
            setSending(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
                confirmButtonText: "Entendido",
            });
        }
    };

    const generalsData = generals || [];
    const location =
        generalsData.find((item) => item.correlative === "location")
            ?.description || "-12.08572604235328,-76.99121088594794";
    const mapSrcWithLocationAndEmbedAndOutput = `https://www.google.com/maps?q=${location}&z=16&output=embed&embed=true`;

    return (
        <motion.div
            id={data?.element_id || "contact-mibalon"}
            className={`font-body text-neutral-dark min-h-screen bg-gray-50 ${data?.class_section || ""}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <motion.main
                className="flex flex-col items-center justify-center min-h-[80vh] py-16 md:py-24"
                variants={itemVariants}
            >
                <motion.div
                    className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16"
                    variants={containerVariants}
                >
                    {/* Left: Contact Form */}
                    <motion.div
                        className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] ${data?.class_form_container || ""}`}
                        variants={slideInLeft}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    >
                        <div className="mb-8 text-center md:text-left">
                            <h2
                                className={`text-4xl md:text-5xl lg:text-6xl font-title text-primary uppercase whitespace-pre-line leading-tight ${data?.class_title || ""}`}
                            >
                                <TextWithHighlight
                                    text={
                                        data?.title ||
                                        "Escríbenos y *conecta* con nosotros"
                                    }
                                    className="font-title"
                                    color="bg-neutral-dark"
                                />
                            </h2>
                            <p
                                className={`mt-6 text-lg text-gray-600 leading-relaxed ${data?.class_description || ""}`}
                            >
                                {data?.description ||
                                    "Déjanos tus datos y nos comunicaremos contigo lo más pronto posible para brindarte la mejor asesoría."}
                            </p>
                        </div>

                        <motion.form
                            onSubmit={onSubmit}
                            className="w-full flex flex-col gap-5"
                            variants={containerVariants}
                        >
                            <motion.div
                                className="flex flex-col  gap-5"
                                variants={itemVariants}
                            >
                                <input
                                    ref={nameRef}
                                    type="text"
                                    placeholder="Nombre"
                                    required
                                    className="flex-1 rounded-full px-6 py-4 bg-gray-50 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                />
                                <input
                                    ref={lastnameRef}
                                    type="text"
                                    placeholder="Apellido"
                                    required
                                    className="flex-1 rounded-full px-6 py-4 bg-gray-50 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                />
                            </motion.div>

                            <motion.div
                                className="flex flex-col  gap-5"
                                variants={itemVariants}
                            >
                                <input
                                    ref={phoneRef}
                                    type="text"
                                    placeholder="Teléfono"
                                    required
                                    className="flex-1 rounded-full px-6 py-4 bg-gray-50 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="Correo electrónico"
                                    required
                                    className="flex-1 rounded-full px-6 py-4 bg-gray-50 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                                />
                            </motion.div>

                            <motion.textarea
                                ref={descriptionRef}
                                placeholder="Escribir mensaje..."
                                rows={5}
                                required
                                className="w-full rounded-[2rem] px-6 py-4 bg-gray-50 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-300"
                                variants={itemVariants}
                            />

                            <motion.button
                                type="submit"
                                className={`mt-4 bg-primary text-white font-title font-bold text-lg rounded-full px-8 py-4 flex items-center justify-center gap-3 transition-all duration-300 hover:bg-neutral-dark hover:shadow-lg uppercase tracking-wide ${data?.class_button_form || ""}`}
                                disabled={sending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                variants={itemVariants}
                            >
                                <AnimatePresence mode="wait">
                                    {sending ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Enviando...
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="send"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 uppercase"
                                        >
                                            <Send size={20} />
                                            Enviar mensaje
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.form>
                    </motion.div>

                    {/* Right: Info Cards and Map */}
                    <motion.div
                        className="flex flex-col gap-6"
                        variants={slideInRight}
                    >
                        {/* Info Cards (Grid) */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                            variants={containerVariants}
                        >
                            {/* Email Card */}
                            <motion.div
                                className="flex flex-col items-center justify-center text-center gap-4 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300"
                                variants={cardHover}
                            >
                                <span className="bg-primary text-white rounded-full p-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-md">
                                    <Mail size={28} />
                                </span>
                                <div>
                                    <h3 className="font-title text-xl text-neutral-dark uppercase mb-2">
                                        Correo
                                    </h3>
                                    <div className="text-gray-600 font-body text-sm break-words">
                                        {(() => {
                                            const emailData =
                                                generalsData.find(
                                                    (item) =>
                                                        item.correlative ===
                                                        "email_contact",
                                                )?.description || "";
                                            if (emailData.includes(",")) {
                                                const emails = emailData.split(",");
                                                return (
                                                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                                        {emails.map((email, index) => (
                                                            <React.Fragment key={index}>
                                                                <a
                                                                    href={`mailto:${email.trim()}`}
                                                                    className="hover:text-primary transition-colors"
                                                                >
                                                                    {email.trim()}
                                                                </a>
                                                                {index < emails.length - 1 && (
                                                                    <span className="text-gray-300">|</span>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <a
                                                    href={`mailto:${emailData}`}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {emailData ||
                                                        "contacto@mibalon.com"}
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Phone Card */}
                            <motion.div
                                className="flex flex-col items-center justify-center text-center gap-4 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300"
                                variants={cardHover}
                            >
                                <span className="bg-primary text-white rounded-full p-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-md">
                                    <Phone size={28} />
                                </span>
                                <div>
                                    <h3 className="font-title text-xl text-neutral-dark uppercase mb-2">
                                        Teléfono
                                    </h3>
                                    <div className="text-gray-600 font-body text-sm break-words">
                                         {(() => {
                                             const phoneData =
                                                 generalsData.find(
                                                     (item) =>
                                                         item.correlative ===
                                                         "phone_contact",
                                                 )?.description || "";
                                             if (phoneData.includes(",")) {
                                                 const phones = phoneData.split(",");
                                                 return (
                                                     <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                                         {phones.map((phone, index) => (
                                                             <React.Fragment key={index}>
                                                                 <a
                                                                     href={`tel:${phone.trim()}`}
                                                                     className="hover:text-primary transition-colors"
                                                                 >
                                                                     {phone.trim()}
                                                                 </a>
                                                                 {index < phones.length - 1 && (
                                                                     <span className="text-gray-300">|</span>
                                                                 )}
                                                             </React.Fragment>
                                                         ))}
                                                     </div>
                                                 );
                                             }
                                             return (
                                                 <a
                                                     href={`tel:${phoneData}`}
                                                     className="hover:text-primary transition-colors"
                                                 >
                                                     {phoneData ||
                                                         "+51 987 654 321"}
                                                 </a>
                                             );
                                         })()}
                                     </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 flex-grow min-h-[350px] lg:min-h-0"
                            variants={fadeInScale}
                        >
                            <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-primary"
                                    />
                                    <span className="text-sm  font-title uppercase text-neutral-dark">
                                        {generalsData.find(
                                            (item) =>
                                                item.correlative === "address",
                                        )?.description || "Nuestra Ubicación"}
                                    </span>
                                </div>
                                <iframe
                                    title="Ubicación Mi Balón"
                                    src={mapSrcWithLocationAndEmbedAndOutput}
                                    className="w-full h-full border-0 absolute inset-0"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.main>
        </motion.div>
    );
};

export default ContactMiBalon;
