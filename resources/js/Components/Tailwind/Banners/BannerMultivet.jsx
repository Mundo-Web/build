import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight_Second from "../../../Utils/TextWithHighlight_Second";
import { resolveSystemAsset } from "./bannerUtils";

const BannerMultivet = ({ data }) => {
    const imageUrl = resolveSystemAsset(data?.image);
    
    // Estilos para posicionamiento avanzado de imagen
    const imageOverflowStyle = 'xl:absolute xl:right-0 xl:bottom-0 xl:top-4 xl:w-1/2 xl:h-auto xl:overflow-visible xl:z-10';

    // Animaciones
    const contentVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.2 }
        }
    };

    const descriptionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.4 }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, delay: 0.6, type: "spring", stiffness: 200 }
        },
        pulse: {
            scale: [1, 1.05, 1],
           
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { duration: 0.7, delay: 0.3, ease: "easeOut" }
        }
    };
    
    return (
<section id={data?.element_id || null} className={`w-full py-0 ${data?.class_section || 'bg-white '}`}>
      <div className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-12 xl:py-16 `}>
            <div className={`flex flex-col lg:flex-row justify-start items-stretch w-full rounded-3xl relative overflow-hidden min-h-[400px] xl:min-h-[500px]   ${data?.class_container || 'bg-gradient-to-br from-[#F2F2F2] to-[#91502D1A]'}`}>
                
                {/* Contenido de texto */}
                <motion.div 
                    className={`flex flex-col gap-5 py-8 px-6 sm:px-8 lg:pl-12 xl:pl-16 2xl:pl-20 justify-center items-start w-full xl:w-7/12 2xl:w-8/12 text-left z-20 relative ${data?.class_content || ''}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={contentVariants}
                >
                    <motion.h1 
                        className={`font-bold font-title text-3xl sm:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl leading-tight text-secondary text-opacity-90  ${data?.class_title || ''}`}
                        variants={titleVariants}
                    >
                      {data?.name}
                    </motion.h1>

                    <motion.p 
                        className={`font-normal text-sm sm:text-base lg:text-lg xl:text-lg 2xl:text-xl leading-relaxed max-w-lg xl:max-w-xl 2xl:max-w-2xl  text-neutral-dark  text-opacity-70  ${data?.class_description || ''}`}
                        variants={descriptionVariants}
                    >
                        {data?.description}
                    </motion.p>
                    
                    {data?.button_link && data?.button_text && (
                        <motion.div 
                            className="flex flex-col mt-2"
                            variants={buttonVariants}
                            animate="pulse"
                        >
                            <motion.a 
                                href={data?.button_link} 
                                className={`inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 2xl:py-4 2xl:px-8 rounded-lg text-white font-semibold leading-none text-sm sm:text-base 2xl:text-xl transition-colors duration-300 bg-secondary hover:bg-primary ${data?.class_button || ''}`}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {data?.button_text}
                                <motion.span
                                    className="ml-2"
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    →
                                </motion.span>
                            </motion.a>
                        </motion.div>
                    )}
                </motion.div>

                {/* Contenedor de imagen mejorado */}
                <motion.div 
                    className={`flex flex-col w-full xl:w-5/12 2xl:w-4/12 items-end justify-end relative ${data?.image_position === 'overflow' ? imageOverflowStyle : 'xl:relative'} ${data?.class_image_container || ''}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={imageVariants}
                >
                    <motion.div 
                        className="w-full h-full relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <img
                            src={imageUrl}
                            onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                            alt={data?.name || 'Banner image'}
                            className={`w-full h-full object-contain object-bottom min-h-[250px] sm:min-h-[300px] xl:min-h-[400px] 2xl:min-h-[450px] ${data?.image_position === 'overflow' ? 'xl:object-right-bottom xl:scale-110 xl:translate-y-4' : ''} ${data?.class_image || ''}`}
                        />
                        
                        {/* Overlay decorativo opcional */}
                        {data?.show_image_overlay && (
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent ${data?.class_overlay || ''}`}></div>
                        )}
                    </motion.div>
                </motion.div>

                {/* Elementos decorativos opcionales */}
                {data?.show_decorations && (
                    <>
                        {/* Círculo decorativo */}
                        <div className={`absolute top-8 right-8 w-16 h-16 rounded-full opacity-20 ${data?.decoration_color || 'bg-primary'} hidden xl:block`}></div>
                        
                        {/* Líneas decorativas */}
                        <div className={`absolute bottom-8 left-8 w-12 h-1 opacity-30 ${data?.decoration_color || 'bg-primary'} hidden xl:block`}></div>
                        <div className={`absolute bottom-6 left-8 w-8 h-1 opacity-30 ${data?.decoration_color || 'bg-primary'} hidden xl:block`}></div>
                    </>
                )}
            </div>
        </div>
</section>
      
    );
};

export default BannerMultivet;
