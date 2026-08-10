import { motion } from "framer-motion";
import { Send, ChevronDown } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import MessagesRest from "../../../Actions/MessagesRest";
import Global from "../../../Utils/Global";
import { resolveSystemAsset } from "./bannerUtils";

const BannerFimesacContact = ({ data = {}, generals = [] }) => {
    const {
        name,
        title,
        description,
        subtitle,
        button_text,
        button_link,
        secondary_button_text,
        secondary_button_link,
        secondary_button_new_tab,
        background,
        image,
        form_title,
        form_description,
        form_badge,
        class: customClass = "",
        class_section = "",
        class_title = "",
        class_description = "",
        class_button = "",
        show_overlay = true,
    } = data;

    const bannerTitle = name || title;
    const bannerDesc = description || subtitle;
    const backgroundUrl = resolveSystemAsset(background || image);

    // Render title with *highlight* effect matching SliderFimesac
    const renderTitle = (text) => {
        if (!text) return "";
        const parts = text.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                return (
                    <span
                        key={index}
                        className="bg-white text-primary px-3 py-1 rounded-sm leading-tight inline-block shadow-lg border border-slate-200/20 font-black mx-1"
                    >
                        {part.slice(1, -1)}
                    </span>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    // --- Lógica del Formulario ---
    const messagesRest = new MessagesRest();
    messagesRest.enableNotifications = false;

    const nameRef = useRef(null);
    const lastnameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const razonSocialRef = useRef(null);
    const rucRef = useRef(null);
    const descriptionRef = useRef(null);

    const [sending, setSending] = useState(false);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const generalsData = generals || [];

    const combinedOptions = [
        ...categories.map((c) => ({ id: `cat-${c.id}`, name: c.name })),
        ...services.map((s) => ({ id: `serv-${s.id}`, name: s.name })),
    ];

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await fetch("/free/contact-options", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                const json = await res.json();
                if (json?.status) {
                    setCategories(json.data?.categories || []);
                    setServices(json.data?.services || []);
                }
            } catch (err) {
                console.error("Error fetching contact options:", err);
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleCategory = (catName) => {
        setSelectedCategories((prev) => {
            if (prev.includes(catName)) {
                return prev.filter((c) => c !== catName);
            }
            if (prev.length >= 2) return prev;
            return [...prev, catName];
        });
    };

    const smoothScrollTo = (targetElement, duration = 1200) => {
        const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easing =
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(0, startPosition + distance * easing);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        requestAnimationFrame(animation);
    };

    const handleButtonClick = (e, link) => {
        if (link && link.includes("#")) {
            e.preventDefault();
            e.stopPropagation();
            const hashIndex = link.indexOf("#");
            const targetId = link.substring(hashIndex + 1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                smoothScrollTo(targetElement, 1200);
                setTimeout(() => {
                    window.history.pushState(null, "", link);
                }, 100);
            }
        }
    };

    const clearForm = () => {
        const refs = [
            nameRef,
            lastnameRef,
            phoneRef,
            emailRef,
            razonSocialRef,
            rucRef,
            descriptionRef,
        ];
        refs.forEach((ref, index) => {
            if (ref.current) {
                setTimeout(() => {
                    ref.current.value = "";
                }, index * 50);
            }
        });
        setSelectedCategories([]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        const fullName = `${nameRef.current?.value || ""} ${lastnameRef.current?.value || ""}`.trim();
        const razonSocial = razonSocialRef.current?.value || "";
        const ruc = rucRef.current?.value || "";
        const categorias = selectedCategories.join(", ");
        const mensaje = descriptionRef.current?.value || "";

        const request = {
            name: fullName,
            phone: phoneRef.current?.value || "",
            email: emailRef.current?.value || "",
            company: razonSocial,
            ruc: ruc,
            category: categorias,
            subject: categorias,
            description: mensaje,
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

            // Enviar a Atalaya CRM si existe la clave API
            const atalayaApiKey = generalsData.find(
                (item) => item.correlative === "atalaya_leads_api_key",
            )?.description;
            if (atalayaApiKey && atalayaApiKey.trim() !== "") {
                try {
                    await fetch("https://crm.atalaya.pe/free/leads", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${atalayaApiKey}`,
                        },
                        body: JSON.stringify({
                            contact_name: request.name,
                            contact_phone: request.phone,
                            contact_email: request.email,
                            message: [
                                request.company ? `Razón Social: ${request.company}` : null,
                                request.ruc ? `RUC: ${request.ruc}` : null,
                                request.category ? `Categoría: ${request.category}` : null,
                                request.subject ? `Solicitud: ${request.subject}` : null,
                                request.description ? `Mensaje: ${request.description}` : null,
                            ].filter(Boolean).join(" | "),
                            origin: `Página Web ${Global.APP_NAME}`,
                            triggered_by: "Formulario de Landing Page",
                        }),
                    });
                } catch (atalayaError) {
                    console.error("Error al enviar a Atalaya CRM:", atalayaError);
                }
            }

            clearForm();
        } catch (error) {
            console.error("Error al enviar:", error);
            setSending(false);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.",
                confirmButtonText: "Entendido",
            });
        }
    };

    return (
        <section
            id={data?.element_id || null}
            className={`relative bg-neutral-dark overflow-hidden min-h-[85vh] w-full flex items-center py-12 lg:py-16 ${customClass} ${class_section}`}
        >
            {/* Imagen de Fondo */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundUrl || "/api/cover/thumbnail/null"}
                    alt={bannerTitle || "Banner Fimesac Contact"}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                        e.target.src = "/api/cover/thumbnail/null";
                    }}
                />

                {/* Overlays idénticos a SliderFimesac */}
                {show_overlay !== false && show_overlay !== 0 && show_overlay !== "0" && show_overlay !== "false" && (
                    <div className="absolute inset-0 z-10">
                        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/95 via-neutral-dark/70 to-neutral-dark/40"></div>
                    </div>
                )}
            </div>

            {/* Contenido Principal en Grid */}
            <div className="relative z-20 w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center box-border">
                {/* Texto a la izquierda */}
                <div className="lg:col-span-7 flex flex-col justify-center text-left text-white max-w-2xl">
                    {/* Badge de Subtítulo en estilo Fimesac */}
                    {subtitle && (
                        <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary text-white text-[10px] font-mono tracking-widest uppercase mb-6 self-start rounded-none">
                            <div className="w-1.5 h-1.5 bg-white animate-pulse"></div>
                            <span>{subtitle}</span>
                        </div>
                    )}

                    {/* Título Principal estilo SliderFimesac */}
                    {bannerTitle && (
                        <h1 className={`text-4xl md:text-5xl lg:text-[4.5rem] font-bold font-title tracking-tighter leading-[1.05] mb-6 text-white ${class_title}`}>
                            {renderTitle(bannerTitle)}
                        </h1>
                    )}

                    {/* Descripción */}
                    {bannerDesc && (
                        <p className={`text-base md:text-lg text-slate-300 font-light leading-relaxed mb-8 max-w-xl ${class_description}`}>
                            {bannerDesc}
                        </p>
                    )}

                    {/* Botones de Acción estilo SliderFimesac (rounded-none, uppercase, tracking-widest) */}
                    {(button_text || secondary_button_text) && (
                        <div className="flex flex-col sm:flex-row gap-4">
                            {button_text && (
                                <a
                                    href={button_link || "#"}
                                    onClick={(e) => handleButtonClick(e, button_link)}
                                    className="w-full sm:w-auto"
                                >
                                    <button className={`w-full sm:w-auto inline-flex items-center justify-center font-display font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 uppercase tracking-widest text-sm h-14 px-8 bg-primary text-white hover:bg-opacity-95 shadow-lg rounded-none ${class_button}`}>
                                        {button_text}
                                    </button>
                                </a>
                            )}
                            {secondary_button_text && (
                                <a
                                    href={secondary_button_link || "#"}
                                    target={secondary_button_new_tab ? "_blank" : "_self"}
                                    rel={secondary_button_new_tab ? "noopener noreferrer" : undefined}
                                    onClick={(e) => handleButtonClick(e, secondary_button_link)}
                                    className="w-full sm:w-auto"
                                >
                                    <button className="w-full sm:w-auto inline-flex items-center justify-center font-display font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 uppercase tracking-widest text-sm h-14 px-8 border border-slate-500 text-white hover:bg-white/10 hover:border-white shadow-lg rounded-none">
                                        {secondary_button_text}
                                    </button>
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Formulario a la derecha (rounded-none, UI Fimesac industrial, box-border estricto para evitar sobrepasos) */}
                <div className="lg:col-span-5 w-full box-border min-w-0">
                    <motion.div
                        className="bg-neutral-dark/90 border border-slate-700/80 rounded-none p-6 sm:p-8 shadow-2xl flex flex-col gap-4 text-white w-full box-border min-w-0 max-w-full overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="border-b border-slate-700/80 pb-4 box-border min-w-0">

                            <h2 className="text-2xl sm:text-3xl font-bold font-title tracking-tight text-white leading-tight">
                                {form_title || "Cotiza con nosotros"}
                            </h2>
                            {form_description && (
                                <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
                                    {form_description}
                                </p>
                            )}
                        </div>

                        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3.5 box-border min-w-0">
                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full box-border min-w-0">
                                <input
                                    ref={nameRef}
                                    type="text"
                                    placeholder="Nombre *"
                                    className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-mono tracking-wide"
                                    required
                                />
                                <input
                                    ref={lastnameRef}
                                    type="text"
                                    placeholder="Apellido *"
                                    className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-mono tracking-wide"
                                    required
                                />
                            </div>

                            {/* Teléfono y Correo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full box-border min-w-0">
                                <input
                                    ref={phoneRef}
                                    type="tel"
                                    placeholder="Teléfono / WhatsApp *"
                                    className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-mono tracking-wide"
                                    required
                                />
                                <input
                                    ref={emailRef}
                                    type="email"
                                    placeholder="Correo Electrónico *"
                                    className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-mono tracking-wide"
                                    required
                                />
                            </div>

                            {/* Razón Social y RUC */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full box-border min-w-0">
                                <input
                                    ref={razonSocialRef}
                                    type="text"
                                    placeholder="Razón Social"
                                    className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-mono tracking-wide"
                                />
                                <input
                                    ref={rucRef}
                                    type="text"
                                    placeholder="RUC"
                                    className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-mono tracking-wide"
                                />
                            </div>

                            {/* Dropdown de Categorías / Servicios */}
                            {combinedOptions.length > 0 && (
                                <div className="relative w-full box-border min-w-0" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="w-full box-border min-w-0 bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-left text-xs sm:text-sm text-white flex justify-between items-center focus:border-primary transition-all font-mono"
                                    >
                                        <span className="truncate pr-2">
                                            {selectedCategories.length > 0
                                                ? selectedCategories.join(", ")
                                                : "SELECCIONA CATEGORÍA / SERVICIO (MÁX 2)"}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute z-50 mt-1 w-full bg-neutral-dark border border-slate-600 rounded-none shadow-2xl max-h-48 overflow-y-auto p-1.5 font-mono text-xs">
                                            {combinedOptions.map((opt) => {
                                                const isSelected = selectedCategories.includes(opt.name);
                                                return (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => toggleCategory(opt.name)}
                                                        className={`cursor-pointer px-3 py-2 text-xs transition-colors duration-150 flex items-center justify-between uppercase ${isSelected
                                                            ? "bg-primary text-white font-bold"
                                                            : "text-slate-300 hover:bg-slate-800"
                                                            }`}
                                                    >
                                                        <span className="truncate pr-2">{opt.name}</span>
                                                        {isSelected && <span className="text-xs shrink-0">✓</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mensaje */}
                            <textarea
                                ref={descriptionRef}
                                rows={3}
                                placeholder="Escribe tu mensaje o detalle de cotización *"
                                className="w-full box-border min-w-0 outline-none bg-black/40 border border-slate-600 rounded-none px-4 py-3 text-sm text-white placeholder-slate-400 focus:border-primary focus:bg-black/60 transition-all font-sans resize-none"
                                required
                            ></textarea>

                            {/* Botón Enviar estilo Fimesac */}
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full box-border min-w-0 inline-flex items-center justify-center font-display font-medium uppercase tracking-widest text-sm h-14 px-8 bg-primary text-white hover:bg-opacity-95 shadow-lg rounded-none transition-all duration-300 disabled:opacity-50 mt-1"
                            >
                                {sending ? (
                                    <span>ENVIANDO...</span>
                                ) : (
                                    <>
                                        <span>SOLICITAR COTIZACIÓN</span>
                                        <Send className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BannerFimesacContact;
