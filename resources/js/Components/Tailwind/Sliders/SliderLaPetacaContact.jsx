import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronDown, ArrowRight, Phone } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, A11y, Keyboard } from "swiper/modules";

import MessagesRest from "../../../Actions/MessagesRest";
import GeneralsRest from "../../../Actions/Admin/GeneralsRest";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Animaciones para el formulario (inspiradas en ContactKatya)
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

const inputFocus = {
    rest: {
        borderColor: "#cbd5e1",
        boxShadow: "none",
        scale: 1,
    },
    focus: {
        borderColor: "0",
        scale: 1.01,
        transition: { duration: 0.2 },
    },
};

const buttonHover = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

// Animaciones para el Slider (inspiradas en SliderLaPetaca)
const titleVariants = {
    initial: { opacity: 0, y: 60, scale: 0.8 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 1.0, delay: 0.2, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: -30,
        scale: 0.9,
        transition: { duration: 0.7, ease: "easeInOut" },
    },
};

const descriptionVariants = {
    initial: { opacity: 0, y: 40, filter: "blur(10px)" },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.8, delay: 0.5, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: -20,
        filter: "blur(8px)",
        transition: { duration: 0.5, ease: "easeInOut" },
    },
};

const buttonsVariants = {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, delay: 0.8, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.8,
        transition: { duration: 0.4, ease: "easeInOut" },
    },
};

const SliderLaPetacaContact = ({ items, data, generals = [] }) => {
    // --- Lógica del Slider ---
    if (!items || items.length === 0) {
        return null;
    }

    const sortedSlides =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];

    const autoplayDelay = parseInt(data?.autoplayDelay) || 3500;
    const sliderClass = data?.class_slider || "";
    const [pageReady, setPageReady] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperInstance && swiperInstance.autoplay) {
            if (pageReady) {
                swiperInstance.autoplay.start();
            } else {
                swiperInstance.autoplay.stop();
            }
        }
    }, [pageReady, swiperInstance]);

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

    const handlePrev = () => {
        if (
            swiperInstance &&
            typeof swiperInstance.slideToLoop === "function"
        ) {
            let prevIndex = activeIndex - 1;
            if (prevIndex < 0) prevIndex = sortedSlides.length - 1;
            swiperInstance.slideToLoop(prevIndex);
        }
    };

    const handleNext = () => {
        if (
            swiperInstance &&
            typeof swiperInstance.slideToLoop === "function"
        ) {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= sortedSlides.length) nextIndex = 0;
            swiperInstance.slideToLoop(nextIndex);
        }
    };

    const handleDotClick = (index) => {
        if (
            swiperInstance &&
            typeof swiperInstance.slideToLoop === "function"
        ) {
            swiperInstance.slideToLoop(index);
        }
    };

    // --- Lógica del Formulario ---
    const messagesRest = new MessagesRest();
    messagesRest.enableNotifications = false;

    const nameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const descriptionRef = useRef();
    const lastnameRef = useRef();
    const razonSocialRef = useRef();
    const rucRef = useRef();

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

    // Cargar categorías y servicios al montar
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

    // Cerrar dropdown al hacer click afuera
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

    const toggleCategory = (name) => {
        setSelectedCategories((prev) => {
            if (prev.includes(name)) {
                return prev.filter((c) => c !== name);
            }
            if (prev.length >= 2) return prev; // máx 2
            return [...prev, name];
        });
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
                    ref.current.style.transform = "scale(0.98)";
                    setTimeout(() => {
                        ref.current.style.transform = "scale(1)";
                    }, 100);
                }, index * 50);
            }
        });
        setSelectedCategories([]);
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        const fullName = nameRef.current.value + " " + lastnameRef.current.value;
        const razonSocial = razonSocialRef.current?.value || "";
        const ruc = rucRef.current?.value || "";
        const categorias = selectedCategories.join(", ");
        const mensaje = descriptionRef.current.value;

        // Enviar campos individuales tal como los espera el modelo Message
        const request = {
            name: fullName,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            company: razonSocial,          // company = Razón Social
            ruc: ruc,                      // ruc directo
            category: categorias,          // category = nombres de categorias en texto
            subject: categorias,           // subject = Solicitud (que es el dropdown)
            description: mensaje,          // description = Mensaje libre
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

            // Enviar lead a Atalaya CRM
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
                            triggered_by: "Formulario de Contacto (Slider)",
                        }),
                    });
                } catch (atalayaError) {
                    console.error(
                        "Error al enviar a Atalaya CRM:",
                        atalayaError,
                    );
                }
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
        <div id={data?.element_id || null} className="relative w-full">
            {/* SLIDER - Full height on both mobile (100dvh) and desktop (h-screen) */}
            <section
                className={`relative h-[100dvh] lg:h-screen w-full overflow-hidden ${sliderClass}`}
            >
                {/* Slider de Fondo */}
                <Swiper
                    modules={[EffectFade, Autoplay, A11y, Keyboard]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    speed={3200}
                    autoplay={{
                        delay: autoplayDelay < 3500 ? 3500 : autoplayDelay,
                        disableOnInteraction: false,
                        enabled: pageReady,
                    }}
                    a11y={{ enabled: true }}
                    loop
                    keyboard={{ enabled: true }}
                    className="h-full w-full"
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setSwiperInstance(swiper);
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                >
                    {sortedSlides.map((slide, index) => (
                        <SwiperSlide
                            key={index}
                            data-swiper-autoplay={slide.duration || undefined}
                        >
                            <div className="absolute inset-0 w-full h-full">
                                <img
                                    src={`/storage/images/slider/${slide.bg_image}`}
                                    alt={slide.name}
                                    className="w-full h-full object-cover"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    fetchPriority={index === 0 ? "high" : "auto"}
                                />

                                {/* Overlay Logic from SliderLaPetaca */}
                                {slide?.show_overlay !== false &&
                                    slide?.show_overlay !== 0 && (
                                        <div
                                            className="absolute inset-0 z-10"
                                            style={{
                                                background:
                                                    slide?.overlay_type === "solid"
                                                        ? `${slide?.overlay_color || "#281409"}${Math.round(
                                                              (slide?.overlay_opacity ??
                                                                  70) * 2.55,
                                                          )
                                                              .toString(16)
                                                              .padStart(2, "0")}`
                                                        : `linear-gradient(${
                                                              slide?.overlay_direction ===
                                                              "to-r"
                                                                  ? "to right"
                                                                  : slide?.overlay_direction ===
                                                                      "to-l"
                                                                    ? "to left"
                                                                    : slide?.overlay_direction ===
                                                                        "to-t"
                                                                      ? "to top"
                                                                      : slide?.overlay_direction ===
                                                                          "to-b"
                                                                        ? "to bottom"
                                                                        : slide?.overlay_direction ===
                                                                            "to-tr"
                                                                          ? "to top right"
                                                                          : slide?.overlay_direction ===
                                                                              "to-tl"
                                                                            ? "to top left"
                                                                            : slide?.overlay_direction ===
                                                                                "to-br"
                                                                              ? "to bottom right"
                                                                              : slide?.overlay_direction ===
                                                                                  "to-bl"
                                                                                ? "to bottom left"
                                                                                : "to bottom"
                                                          }, ${slide?.overlay_color || "#281409"}${Math.round(
                                                              (slide?.overlay_opacity ??
                                                                  70) * 2.55,
                                                          )
                                                              .toString(16)
                                                              .padStart(
                                                                  2,
                                                                  "0",
                                                              )}, transparent)`,
                                            }}
                                        ></div>
                                    )}
                                {(slide?.show_overlay === false ||
                                    slide?.show_overlay === 0) && (
                                    <>
                                        {data?.class_overlay && (
                                            <div
                                                className={`absolute inset-0 z-10 ${data?.class_overlay}`}
                                            ></div>
                                        )}
                                        {!data?.class_overlay && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-[#281409]/70 via-[#281409]/40 to-[#0a0604]/90 z-10"></div>
                                        )}
                                    </>
                                )}

                                {/* Contenido del Slider (Texto a la izquierda) */}
                                <div
                                    className={`absolute inset-0 z-20 flex items-center ${data?.class_content_slider || ""}`}
                                >
                                    <div className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                                        <div className="lg:col-span-7 flex flex-col justify-center text-left">
                                            <AnimatePresence mode="wait">
                                                {activeIndex === index && (
                                                    <motion.div
                                                        key={`content-${activeIndex}`}
                                                        initial="initial"
                                                        animate="animate"
                                                        exit="exit"
                                                        className="space-y-6"
                                                    >
                                                        <motion.h2
                                                            variants={titleVariants}
                                                            className={`text-5xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl ${data?.class_title || ""}`}
                                                            style={{
                                                                color:
                                                                    slide.title_color ||
                                                                    "#FFFFFF",
                                                            }}
                                                        >
                                                            <TextWithHighlight
                                                                text={slide.name}
                                                                color="bg-secondary"
                                                            />
                                                        </motion.h2>

                                                        <motion.p
                                                            variants={
                                                                descriptionVariants
                                                            }
                                                            className={`text-xl md:text-2xl text-white/90 font-light tracking-wide drop-shadow-lg max-w-2xl ${data?.class_description || ""}`}
                                                        >
                                                            {slide.description}
                                                        </motion.p>

                                                        <motion.div
                                                            variants={
                                                                buttonsVariants
                                                            }
                                                            className={`flex flex-row flex-wrap gap-4 ${data?.class_buttons_container || ""}`}
                                                        >
                                                            {slide.button_link &&
                                                                slide.button_text && (
                                                                    <a
                                                                        href={
                                                                            slide.button_link
                                                                        }
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            const href =
                                                                                slide.button_link;
                                                                            if (
                                                                                href &&
                                                                                href.includes(
                                                                                    "#",
                                                                                )
                                                                            ) {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                const hashIndex =
                                                                                    href.indexOf(
                                                                                        "#",
                                                                                    );
                                                                                const targetId =
                                                                                    href.substring(
                                                                                        hashIndex +
                                                                                            1,
                                                                                    );
                                                                                const targetElement =
                                                                                    document.getElementById(
                                                                                        targetId,
                                                                                    );
                                                                                if (
                                                                                    targetElement
                                                                                ) {
                                                                                    smoothScrollTo(
                                                                                        targetElement,
                                                                                        1200,
                                                                                    );
                                                                                    setTimeout(
                                                                                        () => {
                                                                                            window.history.pushState(
                                                                                                null,
                                                                                                "",
                                                                                                href,
                                                                                            );
                                                                                        },
                                                                                        100,
                                                                                    );
                                                                                }
                                                                            }
                                                                        }}
                                                                        className={`px-8 py-4 text-lg font-semibold bg-secondary text-white rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl ${data?.class_button || ""}`}
                                                                    >
                                                                        {
                                                                            slide.button_text
                                                                        }
                                                                    </a>
                                                                )}
                                                            {slide.secondary_button_link &&
                                                                slide.secondary_button_text && (
                                                                    <a
                                                                        href={
                                                                            slide.secondary_button_link
                                                                        }
                                                                        target={slide?.secondary_button_new_tab ? "_blank" : "_self"}
                                                                        rel={slide?.secondary_button_new_tab ? "noopener noreferrer" : undefined}
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            const href =
                                                                                slide.secondary_button_link;
                                                                            if (
                                                                                href &&
                                                                                href.includes(
                                                                                    "#",
                                                                                )
                                                                            ) {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                const hashIndex =
                                                                                    href.indexOf(
                                                                                        "#",
                                                                                    );
                                                                                const targetId =
                                                                                    href.substring(
                                                                                        hashIndex +
                                                                                            1,
                                                                                    );
                                                                                const targetElement =
                                                                                    document.getElementById(
                                                                                        targetId,
                                                                                    );
                                                                                if (
                                                                                    targetElement
                                                                                ) {
                                                                                    smoothScrollTo(
                                                                                        targetElement,
                                                                                        1200,
                                                                                    );
                                                                                    setTimeout(
                                                                                        () => {
                                                                                            window.history.pushState(
                                                                                                null,
                                                                                                "",
                                                                                                href,
                                                                                            );
                                                                                        },
                                                                                        100,
                                                                                    );
                                                                                }
                                                                            }
                                                                        }}
                                                                        className={`px-8 py-4 text-lg border-2 font-semibold rounded-full transform hover:scale-105 transition-all duration-300 bg-white/10 border-white text-white hover:bg-white hover:text-black ${data?.class_secondary_button || ""}`}
                                                                    >
                                                                        {
                                                                            slide.secondary_button_text
                                                                        }
                                                                    </a>
                                                                )}
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Espacio reservado para el formulario en desktop */}
                                        <div className="lg:col-span-5 hidden lg:block"></div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Flechas de Navegación del Slider */}
                {sortedSlides.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            aria-label="Anterior"
                            className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white transition-all duration-300 hover:scale-110"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={handleNext}
                            aria-label="Siguiente"
                            className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-black/20 hover:bg-black/50 text-white transition-all duration-300 hover:scale-110"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </>
                )}

                {/* Indicadores de paginación para mobile */}
                {sortedSlides.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 lg:hidden">
                        {sortedSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    activeIndex === index
                                        ? "w-8 bg-secondary"
                                        : "w-2 bg-white/40 hover:bg-white/70"
                                }`}
                                aria-label={`Ir al slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Capa de Formulario Flotante en Desktop / Debajo del Slider en Mobile */}
            <div className="relative w-full bg-primary/80 py-12 px-4 flex items-center lg:absolute lg:inset-0 lg:z-30 lg:pointer-events-none lg:bg-transparent lg:py-0 lg:px-0">
                <div className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Espacio para el texto del slider en desktop */}
                    <div className="lg:col-span-7 hidden lg:block"></div>

                    {/* Formulario a la derecha */}
                    <div className="col-span-1 lg:col-span-5 pointer-events-auto w-full">
                        <motion.div
                            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-3 lg:max-h-[85vh] lg:overflow-y-auto"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.5,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            <div>
                                <h2 className="text-2xl lg:text-4xl font-bold mb-1 text-white leading-tight">
                                    {data?.title ||
                                        "Cotiza con Panel Pro"}
                                </h2>
                                <p className="text-sm text-white/75 mb-3">
                                    {data?.description ||
                                        ""}
                                </p>
                            </div>

                            <form
                                onSubmit={onSubmit}
                                className="w-full flex flex-col gap-3"
                            >
                                {/* Nombre y Apellido */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        ref={nameRef}
                                        type="text"
                                        placeholder="Nombre *"
                                        className="flex-1 outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 transition-all duration-200"
                                        required
                                    />
                                    <input
                                        ref={lastnameRef}
                                        type="text"
                                        placeholder="Apellido *"
                                        className="flex-1 outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Celular y Correo */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        ref={phoneRef}
                                        type="text"
                                        placeholder="Celular *"
                                        className="flex-1 outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 transition-all duration-200"
                                        required
                                    />
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        placeholder="Correo electrónico *"
                                        className="flex-1 outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Razón Social */}
                                <input
                                    ref={razonSocialRef}
                                    type="text"
                                    placeholder="Razón Social"
                                    className="w-full outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 transition-all duration-200"
                                />

                                {/* RUC */}
                                <input
                                    ref={rucRef}
                                    type="text"
                                    placeholder="RUC"
                                    maxLength={11}
                                    className="w-full outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 transition-all duration-200"
                                />

                                {/* Categoría / Servicio (multi-select máx 2) */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="w-full flex items-center justify-between outline-none bg-white/15 border border-white/20 rounded-md px-4 py-3 text-base focus:bg-white/25 transition-all duration-200 text-left cursor-pointer"
                                    >
                                        <span className={selectedCategories.length > 0 ? "text-white truncate" : "text-white/60 truncate"}>
                                            {selectedCategories.length > 0
                                                ? selectedCategories.join(", ")
                                                : "Categoría / Servicio"}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 ml-2 transition-transform duration-300 text-white/60 ${
                                                dropdownOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute z-50 w-full bottom-full mb-1 bg-white border border-white/20 rounded-md shadow-2xl"
                                            >
                                                <div className="py-1 max-h-72 overflow-y-auto">
                                                    {combinedOptions.map((option) => {
                                                        const isSelected = selectedCategories.includes(option.name);
                                                        const isDisabled = !isSelected && selectedCategories.length >= 2;
                                                        return (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                disabled={isDisabled}
                                                                onClick={() => toggleCategory(option.name)}
                                                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all duration-150 ${
                                                                    isSelected
                                                                        ? "bg-secondary text-white font-medium"
                                                                        : isDisabled
                                                                          ? "text-slate-700 cursor-not-allowed opacity-40"
                                                                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                                                                }`}
                                                            >
                                                                <span>{option.name}</span>
                                                                {isSelected && (
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                    {combinedOptions.length === 0 && (
                                                        <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                                            Cargando opciones...
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>


                                {/* Mensaje */}
                                <textarea
                                    ref={descriptionRef}
                                    placeholder="Cuéntanos... ¿En qué proyecto estás trabajando?"
                                    rows={3}
                                    className="bg-white/15 outline-none border border-white/20 rounded-md px-4 py-3 text-base text-white placeholder-white/60 focus:bg-white/25 resize-none transition-all duration-200"
                                />

                                <button
                                    type="submit"
                                    className={`mt-1 bg-secondary w-full text-white font-semibold rounded-full px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300 hover:bg-secondary/90 hover:scale-[1.02]`}
                                    disabled={sending}
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
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Enviando...
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="send"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2 text-lg tracking-wider"
                                            >
                                              Inicia tu pedido
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SliderLaPetacaContact;
