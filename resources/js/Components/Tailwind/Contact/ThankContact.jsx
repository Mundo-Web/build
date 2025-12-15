import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThankContact = ({ data, item }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                delay: 0.8
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const socialIconVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.2,
            rotate: 5,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -50, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 1,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    const handleBackToHome = () => {
        // Add your navigation logic here
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
            <motion.div
                className="max-w-4xl mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
            >
                {/* Main Title */}
                <motion.div
                    variants={titleVariants}
                    className="mb-8"
                >
                    <motion.h1 
                        className="text-4xl md:text-6xl font-title lg:text-7xl font-bold text-transparent bg-clip-text bg-primary mb-4"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{
                            backgroundSize: '200% 200%'
                        }}
                    >
                        ¡Gracias por confiar en nosotros!
                    </motion.h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl  customtext-neutral-dark mb-4 max-w-2xl mx-auto leading-relaxed"
                >
                    Hemos recibido tus datos correctamente.
                </motion.p>

                {/* Description */}
                <motion.div
                    variants={itemVariants}
                    className="mb-12"
                >
                    <p className="text-base md:text-lg customtext-neutral-dark max-w-3xl mx-auto leading-relaxed">
                        Muy pronto nos pondremos en contacto contigo para brindarte toda la 
                        información que necesitas. Mientras tanto, te invitamos a seguirnos en 
                        nuestras redes sociales y mantenerte al tanto de nuestras novedades.
                    </p>
                </motion.div>

                {/* Back to Home Button */}
                <motion.div
                    variants={buttonVariants}
                    className="mb-12"
                >
                    <motion.button
                        onClick={handleBackToHome}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-primary text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0  opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10">Volver al inicio</span>
                    </motion.button>
                </motion.div>

               

            
            </motion.div>
        </div>
    );
};

export default ThankContact;
