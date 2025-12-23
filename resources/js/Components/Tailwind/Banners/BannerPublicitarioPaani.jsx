import { Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Global from "../../../Utils/Global";
import { resolveSystemAsset } from "./bannerUtils";

const BannerPublicitarioPaani = ({ data }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);
    const imageUrl = resolveSystemAsset(data?.image);

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="px-primary font-paragraph 2xl:px-0 2xl:max-w-7xl mx-auto py-4 md:py-12"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative rounded-3xl md:rounded-2xl h-[600px] md:h-[500px] overflow-hidden shadow-xl"
                    style={{
                        backgroundImage: ` url(${backgroundUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <div className={`flex flex-col md:flex-row items-center justify-between h-full gap-8 bg-[#0075A7]/10`}>
                        
                        {/* Texto */}
                        <motion.div 
                            initial={{ x: 200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="text-white z-10 w-full md:w-6/12 xl:w-5/12"
                        >
                            <div className="w-full p-6 lg:pl-[10%] lg:max-w-lg bg-transparent">
                                <motion.h1 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                    className="text-[32px] md:text-4xl lg:text-5xl !leading-tight font-medium mb-4 font-title drop-shadow-lg"
                                >
                                    {data?.name}
                                </motion.h1>
                                <motion.p 
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    className="text-base md:text-lg mb-8 font-light font-paragraph drop-shadow"
                                >
                                    {data?.description}
                                </motion.p>
                                {data?.button_text && (
                                    <motion.a
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 1.4 }}
                                        whileHover={{ 
                                            scale: 1.07,
                                            boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        href={data?.button_link || Global.APP_DOMAIN}
                                        className="bg-[linear-gradient(90deg,_#003D52_0%,_#0075A7_118.41%)] cursor-pointer text-base w-max font-medium customtext-white px-10 py-3 rounded-3xl hover:opacity-90 transition-all duration-300 flex items-center"
                                    >
                                        {data?.button_text}
                                        <motion.div
                                            animate={{ 
                                                rotate: [0, 90],
                                                scale: [1, 1.2, 1]
                                            }}
                                            transition={{ 
                                                duration: 1,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }}
                                        >
                                        </motion.div>
                                    </motion.a>
                                )}
                              
                            </div>
                        </motion.div>   
                        
                        
                        {/* Imagen */}
                        <motion.div 
                            className="w-full md:w-6/12 xl:w-7/12 relative z-10 flex items-center justify-center h-full"
                        >
                            <motion.img
                                whileHover={{ 
                                    scale: 1.08,
                                    transition: { duration: 0.4 }
                                }}
                                initial={{ scale: 0.95, rotate: -8 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 1, type: "spring" }}
                                src={imageUrl}
                                className="w-full h-full object-contain sm:object-cover object-center "
                                alt={data?.name}
                            />
                        </motion.div>

                       
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default BannerPublicitarioPaani;
