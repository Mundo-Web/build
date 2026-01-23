import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { resolveSystemAsset } from "./bannerUtils";

import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Swal from "sweetalert2";
import Global from "../../../Utils/Global";
import { ChevronRight, CircleCheckBig } from "lucide-react";
import { toast } from "sonner";

const BannerBlogSectionKatya = ({ data, items }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);
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
                        <motion.div variants={itemVariants} className="space-y-4 flex flex-col lg:flex-row justify-between lg:items-center">
                            <h2 className="text-4xl  lg:text-4xl 2xl:text-5xl font-bold tracking-normal max-w-lg  text-white leading-tight font-title">
                                Nuestro Blog
                            </h2>
                            <a href="/blog" className="text-lg lg:text-lg font-bold  hover:opacity-80 transition-opacity text-white lg:self-center">
                                Más publicaciones
                                <ChevronRight className="inline-block ml-1 h-6 w-6" />
                            </a>
                        </motion.div>

                        {/* Swiper de blogs */}
                        <motion.div variants={itemVariants} className="bg-primary rounded-3xl p-4">
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
                                {items && items.length > 0 ? (
                                    items.map((item, index) => {
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
                                                                className="inset-0 w-full object-cover aspect-[1] transition-transform duration-500 ease-out group-hover:scale-110"
                                                                onError={(e) =>
                                                                    (e.target.src = "/api/cover/thumbnail/null")
                                                                }
                                                            />
                                                        </div>
                                                        <div className="py-4 px-4">
                                                            <h3 className="text-2xl font-bold mt-1 mb-2 leading-tight">
                                                                {item?.name}
                                                            </h3>
                                                            <p className="text-base line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
                                                                {text}
                                                            </p>
                                                        </div>
                                                    </a>
                                                </motion.div>
                                            </SwiperSlide>
                                        );
                                    })
                                ) : (
                                    <SwiperSlide>
                                        <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                            <i className="mdi mdi-information-outline text-3xl d-block mb-2"></i>
                                            <p className="text-sm">Agrega posts para mostrar en el slider</p>
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>


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
                            className="rounded-2xl overflow-hidden shadow-sm h-full min-h-[500px] lg:min-h-[690px] relative flex flex-col items-center justify-end"
                            style={{
                                backgroundImage: `url(${backgroundUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

                            <div className="bg-transparent text-white text-left p-6 rounded-b-2xl relative z-10">
                                <motion.h1
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                    className="text-[40px] leading-tight md:text-4xl font-bold mb-4 font-title"
                                >
                                    {data?.name}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="text-2xl mb-8 font-font-secondary"
                                >
                                    {data?.description}
                                </motion.p>
                                <motion.a
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 1.4 }}
                                    whileHover={{
                                        scale: 1.1,
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    href={data?.button_link || Global.APP_DOMAIN}
                                    className={` mx-auto cursor-pointer text-base w-full font-bold customtext-neutral-dark px-10 rounded-full py-4 hover:opacity-90 transition-all duration-300 flex items-center gap-2 justify-center ${data?.class_button || 'bg-secondary text-white uppercase'}`}
                                >
                                    {data?.button_text}

                                </motion.a>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>


            </motion.div>
        </div>
    );
};

export default BannerBlogSectionKatya;