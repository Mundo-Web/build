import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import BlogCarrusel from "./Components/BlogCarrusel";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Swal from "sweetalert2";
import Global from "../../../Utils/Global";
import { CircleCheckBig } from "lucide-react";
import { toast } from "sonner";

const BlogSectionDental = ({ data, items }) => {
    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const hoverCard = {
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
        y: -5,
        transition: { duration: 0.3 }
    };

    const hoverImage = {
        scale: 1.1,
        transition: { duration: 0.4, ease: "easeOut" }
    };

    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const [saving, setSaving] = useState();

    // Referencias para navegación del Swiper
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const request = {
            email: emailRef.current.value,
        };
        const result = await subscriptionsRest.save(request);
        setSaving(false);

        if (!result) return;

        toast.success("¡Suscrito!", {
            description: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: <CircleCheckBig className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "top-center",
        });

        emailRef.current.value = null;
    };

    return (
        <div id={data?.element_id || null} className="bg-secondary ">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto font-title customtext-neutral-dark py-12 lg:py-20"
            >
                {/* Layout principal: Lado izquierdo (título + swiper) + Lado derecho (suscripción) */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start"
                >
                    {/* Lado izquierdo: Título, descripción y swiper */}
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        {/* Título y descripción */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl font-semibold tracking-normal max-w-lg  customtext-neutral-dark leading-tight font-title">
                                <TextWithHighlight text={data?.title} color="bg-accent font-bold" />
                            </h2>
                            <p className="text-lg 2xl:text-xl tracking-normal font-light font-title customtext-neutral-dark">
                                {data?.description}
                            </p>
                        </motion.div>

                        {/* Swiper de blogs */}
                        <motion.div variants={itemVariants}>
                            <Swiper
                                modules={[Navigation]}
                                loop={true}
                                navigation={{
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current,
                                }}
                                onBeforeInit={(swiper) => {
                                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                                    swiper.params.navigation.nextEl = navigationNextRef.current;
                                }}
                                slidesPerView={1}
                                spaceBetween={20}
                                breakpoints={{
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 30
                                    }
                                }}
                                className="mySwiper"
                            >
                                {items.map((item, index) => {
                                    const content = document.createElement("div");
                                    content.innerHTML = item?.description;
                                    const text = content.textContent || content.innerText || "";

                                    return (
                                        <SwiperSlide key={index}>
                                            <motion.div
                                                variants={itemVariants}
                                            
                                                className="block group hover:scale-105 transform "
                                            >
                                                <a href={`/post/${item.slug}`} className="rounded-lg shadow-sm h-auto cursor-pointer block">
                                                    <div className="overflow-hidden rounded-xl">
                                                        <motion.img
                                                            src={`/storage/images/post/${item?.image}`}
                                                            alt={item?.title}
                                                            className="inset-0 w-full object-cover aspect-[4/3] transition-transform duration-500 ease-out group-hover:scale-110"
                                                            onError={(e) =>
                                                                (e.target.src = "/api/cover/thumbnail/null")
                                                            }
                                                        />
                                                    </div>
                                                    <div className="py-4 px-4">
                                                        <h3 className="text-xl font-semibold mt-1 mb-2 leading-tight">
                                                            {item?.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-3 group-hover:text-gray-800 transition-colors duration-300">
                                                            {text}
                                                        </p>
                                                    </div>
                                                </a>
                                            </motion.div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            {/* Botones de navegación */}
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    ref={navigationPrevRef}
                                    className="bg-secondary text-white p-3 rounded-full hover:bg-opacity-80 transition-all"
                                    aria-label="Anterior"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    ref={navigationNextRef}
                                    className="bg-secondary text-white p-3 rounded-full hover:bg-opacity-80 transition-all"
                                    aria-label="Siguiente"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Lado derecho: Suscripción - toda la altura */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.02,
                            rotate: 0.5,
                            transition: { type: "spring", damping: 10 }
                        }}
                        className="col-span-1 rounded-2xl"
                    >
                        <div
                            className="bg-white rounded-2xl overflow-hidden shadow-sm h-full min-h-[500px] lg:min-h-[600px] relative flex flex-col items-center justify-end"
                            style={{
                                backgroundImage: 'url(/assets/resources/subscribe.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <div className="bg-transparent text-white text-left p-6 rounded-b-2xl">
                                <h2 className="text-xl lg:text-2xl font-title font-medium mb-4">
                                    ¡Suscríbete a nuestro blog y recibe las últimas novedades y consejos!
                                </h2>

                                <form onSubmit={onEmailSubmit} className="w-full">
                                    <div className="relative customtext-primary">
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            placeholder="Ingresa tu e-mail"
                                            className="w-full bg-transparent text-white font-medium py-4 pl-4 pr-32 border-2 border-white rounded-full focus:ring-0 focus:outline-none placeholder:text-white placeholder:opacity-65"
                                        />
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="absolute text-sm right-2 top-1/2 transform -translate-y-1/2 py-2 px-4 bg-accent font-semibold customtext-neutral-dark rounded-full hover:bg-opacity-90 transition-all"
                                            aria-label="Suscribite"
                                        >
                                            {saving ? 'Enviando...' : 'Suscribirme'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>


            </motion.div>
        </div>
    );
};

export default BlogSectionDental;