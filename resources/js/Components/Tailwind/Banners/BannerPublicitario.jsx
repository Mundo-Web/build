import { Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Global from "../../../Utils/Global";
import { resolveSystemAsset } from "./bannerUtils";

const BannerPublicitario = ({ data }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);
    const imageUrl = resolveSystemAsset(data?.image);
    return (
        <div className={`${data?.class_content || ''}`}>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 md:py-12"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative rounded-3xl md:rounded-2xl h-[600px] md:h-[500px] p-4 md:p-0"
                        style={{
                            backgroundImage: `url(${backgroundUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between h-full gap-8">
                            {/* Left side - Image */}
                            <motion.div
                                className={`order-1 md:order-none w-full md:w-7/12 relative z-10 flex items-center justify-center h-full ${data?.class_image || ''}`}
                            >
                                <motion.img
                                    whileHover={{
                                        scale: 1.15,
                                        transition: { duration: 0.4 },
                                    }}
                                    initial={{ scale: 0.5, rotate: -10 }}
                                    animate={{ scale: 1.1, rotate: 0 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    src={imageUrl}
                                    className="w-full h-auto object-cover"
                                    alt={data?.name}
                                />
                            </motion.div>

                            {/* Right side - Content */}
                            <motion.div
                                initial={{ x: 200, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.7 }}
                                className={`md:order-1 md:w-5/12 z-10 ${data?.class_right || 'text-white'}`}
                            >
                                <div className={`max-w-sm ${data?.class_content_right || ''}`}>
                                    <motion.h1
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 1 }}
                                        className="text-[40px] leading-tight md:text-6xl font-bold mb-4 font-title"
                                    >
                                        {data?.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, delay: 1.2 }}
                                        className="text-[16.88px] mb-8 font-font-secondary"
                                    >
                                        {data?.description}
                                    </motion.p>
                                    <motion.a
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.6, delay: 1.4 }}
                                        whileHover={{
                                            scale: 1.1,
                                            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                        }}
                                        whileTap={{ scale: 0.9 }}
                                        href={data?.button_link || Global.APP_DOMAIN}
                                        className={`cursor-pointer text-sm w-max font-bold customtext-neutral-dark px-10 py-4 rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2 ${data?.class_button || 'bg-white'}`}
                                    >
                                        {data?.button_text}
                                        <motion.div
                                            animate={{
                                                rotate: [0, 90],
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                            }}
                                        >
                                            <Tag width={"1rem"} />
                                        </motion.div>
                                    </motion.a>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default BannerPublicitario;
