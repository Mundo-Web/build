import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import CategoryGrid  from "./Components/CategoryGrid";

const CategoryGridInfinite = ({ data, items }) => {
    // Referencias para las animaciones de scroll
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const gridRef = useRef(null);
    
    // Detectar cuando los elementos entran en el viewport
    const containerInView = useInView(containerRef, { once: true, threshold: 0.1 });
    const headerInView = useInView(headerRef, { once: true, threshold: 0.3 });
    const gridInView = useInView(gridRef, { once: true, threshold: 0.2 });

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.3
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, x: -60 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, x: 60, scale: 0.8 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut"
            }
        }
    };

    const gridVariants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut"
            }
        }
    };

    return (
        <div>
            {items && items.length > 0 && (
                <motion.div 
                    ref={containerRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate={containerInView ? "visible" : "hidden"}
                    className={`${data?.class_container || "bg-white"}`}
                >
                   <div className="px-primary 2xl:px-0 2xl:max-w-[1500px] mx-auto py-12 lg:py-20">
                    {/* Header */}
                    {data?.title && (
                        <motion.div 
                            ref={headerRef}
                            variants={headerVariants}
                            initial="hidden"
                            animate={headerInView ? "visible" : "hidden"}
                            className="flex flex-wrap gap-4 justify-between items-center"
                        >
                            <motion.h2 
                                variants={titleVariants}
                                className={`text-3xl font-semibold tracking-normal customtext-neutral-dark max-w-2xl xl:max-w-4xl 2xl:max-w-5xl  ${data?.class_title || "sm:text-4xl xl:text-5xl 2xl:text-6xl"}`}
                            >
                                {data?.title}
                            </motion.h2>
                            {data?.link_catalog && (
                                <motion.a
                                    href={data?.link_catalog}
                                    variants={buttonVariants}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-accent transition-all duration-300 text-white border-none items-center px-10 py-3 text-base rounded-full font-semibold cursor-pointer hover:opacity-90"
                                >
                                    Ver todos
                                </motion.a>
                            )}
                         
                        </motion.div>
                    )}

                    <motion.div 
                        ref={gridRef}
                        variants={gridVariants}
                        initial="hidden"
                        animate={gridInView ? "visible" : "hidden"}
                        className="mt-6" 
                        id="sectioncategory"
                    >
                        <CategoryGrid categories={items} />
                    </motion.div>
                </div>
                </motion.div>
            )}
        </div>
    );
}

export default CategoryGridInfinite;