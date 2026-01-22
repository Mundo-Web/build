import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import BlogCarrusel from "./Components/BlogCarrusel";
import SubscriptionsRest from "../../../Actions/SubscriptionsRest";
import Swal from "sweetalert2";
import Global from "../../../Utils/Global";

const BlogSectionAko = ({ data, items }) => {
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
        // Sin hover en el card completo
    };

    const hoverImage = {
        scale: 1.1,
        transition: { duration: 0.5, ease: "easeOut" }
    };

    const buttonHover = {
        scale: 1.05,
        y: -2,
        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.2, ease: "easeOut" }
    };

    const subscriptionsRest = new SubscriptionsRest();
    const emailRef = useRef();
    const [saving, setSaving] = useState();
    
    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
    
        const request = {
          email: emailRef.current.value,
        };
        const result = await subscriptionsRest.save(request);
        setSaving(false);
    
        if (!result) return;
    
        Swal.fire({
          title: "¡Éxito!",
          text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
          icon: "success",
          confirmButtonText: "Ok",
        });
    
        emailRef.current.value = null;
    };

    return (
        <motion.div
            id={data?.element_id || null}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="w-full px-[5%] 2xl:px-0 font-title customtext-neutral-dark py-12 lg:py-20"
        >
            <div className="2xl:max-w-7xl mx-auto 2xl:px-0">
            <motion.div variants={itemVariants} className="flex flex-col gap-6 justify-center items-center mb-6">
                <h2 className="max-w-lg 2xl:max-w-xl mx-auto text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl text-center font-medium tracking-normal customtext-neutral-dark leading-tight font-title">
                    <TextWithHighlight text={data?.title} color="bg-secondary"></TextWithHighlight>
                </h2>
                <p className="max-w-3xl 2xl:max-w-4xl mx-auto text-lg 2xl:text-xl tracking-normal font-light font-title customtext-neutral-dark text-center">
                    {data?.description}
                </p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16"
            >   
                <BlogCarrusel 
                    items={items} 
                    itemVariants={itemVariants} 
                    hoverCard={hoverCard} 
                    hoverImage={hoverImage}
                />

                <motion.div 
                    variants={itemVariants}
                    whileHover={{ 
                        scale: 1.03,
                        y: -8,
                        rotate: 0.5,
                        boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.2)",
                        transition: { type: "spring", damping: 15, stiffness: 300 }
                    }}
                    className="col-span-1 rounded-2xl mt-2 shadow-lg"
                >
                    <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-full relative flex flex-col items-center justify-end" 
                        style={{
                            backgroundImage: 'url(/assets/img/backgrounds/resources/suscription.png)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        > 
                        {/* Overlay glassmorphism */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        <div
                            className=" text-white text-left p-6 rounded-b-2xl relative z-10"
                        >
                            <h2 className="text-2xl font-title font-medium mb-3">¡Suscríbete a nuestro blog y recibe las últimas novedades y consejos!</h2>
                            
                            <form onSubmit={onEmailSubmit} className="max-w-sm">
                                <div className="relative customtext-primary">
                                    <input 
                                        ref={emailRef} 
                                        type="email" 
                                        placeholder="Ingresa tu e-mail"
                                        className="w-full bg-white/10 backdrop-blur-sm text-white font-medium py-4 pl-4 border-2 border-white/50 rounded-xl focus:ring-0 focus:outline-none focus:border-accent transition-all duration-300 placeholder:text-white placeholder:opacity-75" 
                                    />
                                    <button
                                        className="absolute text-md right-2 top-1/2 transform -translate-y-1/2 py-3 font-medium px-4 bg-accent customtext-neutral-dark rounded-lg transition-all duration-200"
                                        aria-label="Suscribite">
                                        Suscribirme
                                    </button>
                                </div>
                            </form>
                            
                        </div>
                    </div>
                    
                </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-row items-center justify-center w-full mt-8">
                <a 
                    href={data?.link_blog} 
                    className="bg-secondary text-base lg:text-lg text-white px-12 py-3.5 rounded-full shadow-lg"
                >
                   {data?.button_text}{" "}
                </a>
            </motion.div>
            </div>
        </motion.div>
    );
};

export default BlogSectionAko;