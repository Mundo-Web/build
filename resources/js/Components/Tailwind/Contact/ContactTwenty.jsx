import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

import MessagesRest from "../../../Actions/MessagesRest";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

// Brutalist streetwear animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.15,
            duration: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

const ContactTwenty = ({ data, generals = [] }) => {
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
        fields.forEach((ref) => {
            if (ref.current) {
                ref.current.value = "";
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
                    customClass: {
                        popup: "rounded-none bg-black border-2 border-white/20 text-white font-mono",
                        confirmButton: "bg-white text-black font-bold uppercase text-xs tracking-wider rounded-none py-3 px-6",
                    }
                });
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Mensaje enviado",
                text: "Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!",
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    popup: "rounded-none bg-black border-2 border-white/20 text-white font-mono",
                }
            });

            // CRM Atalaya Integration
            const generalsData = generals || [];
            const atalayaApiKey = generalsData.find(
                (item) => item.correlative === "atalaya_leads_api_key",
            )?.description;
            if (atalayaApiKey && atalayaApiKey.trim() !== "") {
                try {
                    await fetch(
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
                                triggered_by: "Formulario de Contacto Twenty",
                            }),
                        },
                    );
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
                customClass: {
                    popup: "rounded-none bg-black border-2 border-white/20 text-white font-mono",
                    confirmButton: "bg-white text-black font-bold uppercase text-xs tracking-wider rounded-none py-3 px-6",
                }
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
            id={data?.element_id || "contact-twenty"}
            className={`text-white min-h-screen bg-primary ${data?.class_section || ""}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <main className="flex flex-col items-center justify-center min-h-[80vh] py-16 md:py-24">
                <div className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

                    {/* Left: Contact Form */}
                    <motion.div
                        className={`bg-black border-2 border-white/10 hover:border-white p-8 md:p-12 rounded-none flex flex-col justify-between min-h-[500px] transition-colors duration-500 ${data?.class_form_container || ""}`}
                        variants={itemVariants}
                    >
                        <div className="mb-8 text-left">
                            <h2
                                className={`text-3xl md:text-4xl lg:text-7xl font-title uppercase text-white mb-6 ${data?.class_title || ""}`}
                            >
                                <TextWithHighlight
                                    text={
                                        data?.title ||
                                        "Escríbenos y *conecta* con nosotros"
                                    }
                                    className="font-title"
                                    color="text-white"
                                />
                            </h2>
                            {data?.description && (
                                <p
                                    className={`mt-4 text-sm md:text-base text-white/50 font-mono uppercase tracking-widest leading-relaxed ${data?.class_description || ""}`}
                                >
                                    {data.description}
                                </p>
                            )}
                        </div>

                        <form
                            onSubmit={onSubmit}
                            className="w-full flex flex-col gap-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <input
                                    ref={nameRef}
                                    type="text"
                                    placeholder="Nombre"
                                    required
                                    className="rounded-none border-2 border-white/10 bg-neutral-950 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-white transition-colors py-3.5 px-4"
                                />
                                <input
                                    ref={lastnameRef}
                                    type="text"
                                    placeholder="Apellido"
                                    required
                                    className="rounded-none border-2 border-white/10 bg-neutral-950 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-white transition-colors py-3.5 px-4"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <input
                                    ref={phoneRef}
                                    type="text"
                                    placeholder="Teléfono"
                                    required
                                    className="rounded-none border-2 border-white/10 bg-neutral-950 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-white transition-colors py-3.5 px-4"
                                />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="Correo electrónico"
                                    required
                                    className="rounded-none border-2 border-white/10 bg-neutral-950 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-white transition-colors py-3.5 px-4"
                                />
                            </div>

                            <textarea
                                ref={descriptionRef}
                                placeholder="Escribir mensaje..."
                                rows={5}
                                required
                                className="w-full rounded-none border-2 border-white/10 bg-neutral-950 text-white font-mono placeholder-white/30 text-sm focus:outline-none focus:border-white resize-none transition-colors py-3.5 px-4"
                            />

                            <motion.button
                                type="submit"
                                className={`mt-4 bg-white text-black font-bold text-xs rounded-none py-4 px-8 flex items-center justify-center gap-3 transition-colors duration-300 hover:bg-neutral-200 uppercase tracking-widest ${data?.class_button_form || ""}`}
                                disabled={sending}
                                whileTap={{ scale: 0.99 }}
                            >
                                <AnimatePresence mode="wait">
                                    {sending ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            <span>Enviando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Send size={14} />
                                            <span>Enviar mensaje</span>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Right: Info Cards and Map */}
                    <div className="flex flex-col gap-6">

                        {/* Info Cards (Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Email Card */}
                            <div className="group flex flex-col items-center justify-center text-center gap-4 bg-black border-2 border-white/10 hover:border-white rounded-none p-8 transition-colors duration-500">
                                <span className="bg-neutral-950 border border-white/10 group-hover:border-white rounded-none p-4 transition-colors duration-300">
                                    <Mail size={24} className="text-white" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base uppercase tracking-wider text-white mb-2">
                                        Correo
                                    </h3>
                                    <div className="text-white/50 font-mono text-xs break-all leading-relaxed">
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
                                                                    className="hover:text-twenty transition-colors"
                                                                >
                                                                    {email.trim()}
                                                                </a>
                                                                {index < emails.length - 1 && (
                                                                    <span className="text-white/20">|</span>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <a
                                                    href={`mailto:${emailData}`}
                                                    className="hover:text-twenty transition-colors"
                                                >
                                                    {emailData ||
                                                        "contacto@twenty.com"}
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Phone Card */}
                            <div className="group flex flex-col items-center justify-center text-center gap-4 bg-black border-2 border-white/10 hover:border-white rounded-none p-8 transition-colors duration-500">
                                <span className="bg-neutral-950 border border-white/10 group-hover:border-white rounded-none p-4 transition-colors duration-300">
                                    <Phone size={24} className="text-white" />
                                </span>
                                <div>
                                    <h3 className="font-bold text-base uppercase tracking-wider text-white mb-2">
                                        Teléfono
                                    </h3>
                                    <div className="text-white/50 font-mono text-xs break-all leading-relaxed">
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
                                                                    className="hover:text-twenty transition-colors"
                                                                >
                                                                    {phone.trim()}
                                                                </a>
                                                                {index < phones.length - 1 && (
                                                                    <span className="text-white/20">|</span>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                );
                                            }
                                            return (
                                                <a
                                                    href={`tel:${phoneData}`}
                                                    className="hover:text-twenty transition-colors"
                                                >
                                                    {phoneData ||
                                                        "+51 987 654 321"}
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div
                            className="bg-black p-2 rounded-none border-2 border-white/10 flex-grow min-h-[350px] lg:min-h-0 relative"
                        >
                            <div className="w-full h-full rounded-none overflow-hidden relative">
                                <div className="absolute top-4 left-4 z-10 bg-black/90 border border-white/20 px-4 py-2 rounded-none shadow-md flex items-center gap-2">
                                    <MapPin
                                        size={14}
                                        className="text-twenty animate-pulse"
                                    />
                                    <span className="text-xs font-mono uppercase tracking-wider text-white">
                                        {generalsData.find(
                                            (item) =>
                                                item.correlative === "address",
                                        )?.description || "Nuestra Ubicación"}
                                    </span>
                                </div>
                                <iframe
                                    title="Ubicación Twenty"
                                    src={mapSrcWithLocationAndEmbedAndOutput}
                                    className="w-full h-full border-0 absolute inset-0 "
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

export default ContactTwenty;
