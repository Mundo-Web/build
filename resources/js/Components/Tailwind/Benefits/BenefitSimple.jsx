import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const BenefitCard = ({ benefit, index }) => {
    const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const [isFlipped, setIsFlipped] = React.useState(false);

    const handleFlip = () => {
        if (isTouchDevice) {
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <div
            className="h-full flex items-stretch cursor-pointer group pt-8"
            onClick={handleFlip}
        >
            <div
                className="relative h-full min-h-[420px] w-full flex flex-col rounded-[2.5rem]"
                style={{ perspective: 1200 }}
            >
                {/* Contenedor de Rotación */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                        rotateY: isTouchDevice ? (isFlipped ? 180 : 0) : 0,
                    }}
                    whileHover={!isTouchDevice ? { rotateY: 180 } : {}}
                    transition={{
                        type: "spring",
                        stiffness: 60,
                        damping: 15,
                        mass: 1.2,
                    }}
                >
                    {/* Cara Frontal */}
                    <div
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-10 bg-white rounded-[2.5rem] border border-neutral-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                            zIndex: 2,
                        }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150" />

                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                            style={{
                                backgroundColor:
                                    benefit.bg_color === "transparent"
                                        ? "rgba(var(--primary-rgb), 0.1)"
                                        : benefit.bg_color ||
                                          "rgba(var(--primary-rgb), 0.1)",
                            }}
                        >
                            <img
                                src={`/storage/images/benefit/${benefit.image}`}
                                alt={benefit.name}
                                className="w-14 h-14 object-contain"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>

                        <h3 className="text-4xl md:text-5xl font-light text-primary transition-transform duration-700 flex-shrink-0">
                            {benefit.name}
                        </h3>

                        {!isTouchDevice && (
                            <div className="flex items-center text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span>Ver detalle</span>
                                <svg
                                    className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </div>
                        )}
                        {isTouchDevice && (
                            <span className="text-sm text-neutral-400 font-medium">
                                Toca para ver más
                            </span>
                        )}
                    </div>

                    {/* Cara Reverso */}
                    <div
                        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-white to-neutral-50 rounded-[2.5rem] border border-primary/20 shadow-xl overflow-hidden"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            zIndex: 3,
                        }}
                    >
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-tr-full -z-10" />

                        <p className="text-lg md:text-xl text-neutral-700 leading-relaxed font-medium">
                            {benefit.description}
                        </p>

                        <div className="mt-8 py-2 px-6 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {benefit.name}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const BenefitSimple = ({ data, items }) => {
    // Estado para swiper
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [swiperInstance, setSwiperInstance] = React.useState(null);
    const [paginationEl, setPaginationEl] = React.useState(null);

    const sectionRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -150]);

    React.useEffect(() => {
        if (swiperInstance && paginationEl) {
            swiperInstance.params.pagination.el = paginationEl;
            swiperInstance.pagination.destroy();
            swiperInstance.pagination.init();
            swiperInstance.pagination.render();
            swiperInstance.pagination.update();
        }
    }, [swiperInstance, paginationEl]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 40 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <section
            ref={sectionRef}
            id={data?.element_id || null}
            className="py-24 sm:py-32 bg-white relative overflow-hidden"
        >
            {/* Background blobs con animación mejorada */}
            <motion.div
                className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
                style={{ y: blob1Y }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"
                style={{ y: blob2Y }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div
                    className="text-center mb-20"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-semibold tracking-wider uppercase"
                        variants={titleVariants}
                    >
                        {data?.tagline || "Nuestros Diferenciales"}
                    </motion.div>
                    <motion.h2
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 font-title mb-8 leading-[1.1] tracking-tight"
                        variants={titleVariants}
                    >
                        <TextWithHighlight
                            text={
                                data?.title ||
                                "Beneficios que Marcan la Diferencia"
                            }
                        />
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed"
                        variants={titleVariants}
                    >
                        {data?.subtitle ||
                            "En Panel Pro, combinamos décadas de experiencia en el sector maderero con un servicio ágil y personalizado."}
                    </motion.p>
                </motion.div>

                <motion.div
                    className="relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1.2}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={items?.length > 1}
                        pagination={{
                            el: paginationEl,
                            clickable: true,
                            renderBullet: function (index, className) {
                                return `<span class="${className} !rounded-full !opacity-40 !w-2 !h-2 !bg-primary transition-all duration-500 cursor-pointer block [&.swiper-pagination-bullet-active]:!w-10 [&.swiper-pagination-bullet-active]:!opacity-100"></span>`;
                            },
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 2.5 },
                            1280: { slidesPerView: 3 },
                        }}
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
                        className="!pb-12"
                    >
                        {items?.map((benefit, index) => (
                            <SwiperSlide
                                key={benefit.id || index}
                                className="h-auto"
                            >
                                <motion.div variants={cardVariants}>
                                    <BenefitCard
                                        benefit={benefit}
                                        index={index}
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div
                        ref={setPaginationEl}
                        className="flex justify-center mt-8 space-x-2 h-2"
                    />
                </motion.div>

                {data?.footer_text && (
                    <motion.div
                        className="mt-24"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                    >
                        <div className="relative rounded-[3rem] overflow-hidden bg-neutral-900 p-12 lg:p-20 text-center group">
                            {data?.footer_image && (
                                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Background"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[20s]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40" />
                                </div>
                            )}

                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h4 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                                    {data.footer_text}
                                </h4>
                                {data?.footer_subtitle && (
                                    <p className="text-xl sm:text-2xl text-white/70 font-light max-w-2xl mx-auto">
                                        {data.footer_subtitle}
                                    </p>
                                )}
                                <div className="mt-12 h-1 w-24 bg-primary mx-auto rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default BenefitSimple;
