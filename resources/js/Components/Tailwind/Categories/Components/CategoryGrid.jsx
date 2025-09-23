import { motion } from "framer-motion";

export default function CategoryGrid({
    categories
}) {

    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
      chunks.push(categories.slice(i, i + chunkSize));
    }
  
    // Processed categories tracker
    const processedCategories = new Set();

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2
            }
        }
    };

    const chunkVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            className=""
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Process full chunks (4 items each) */}
            {chunks.map((chunk, chunkIndex) => {
                if (chunk.length === 4) {
                chunk.forEach(cat => processedCategories.add(cat.id));
                
                return (
                    <motion.div 
                        key={`chunk-${chunkIndex}`} 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-7 2xl:gap-10 pt-10"
                        variants={chunkVariants}
                    >
                    {chunk.map((category, index) => {
                        if (index === 0) {
                        // First item - spans 2 rows and 2 cols
                        return (
                            <motion.div 
                                key={category.id} 
                                className="w-full lg:row-span-2 lg:col-span-2"
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <a href={`/catalogo?category=${category.slug}`}>
                                    <section className="group font-paragraph text-white w-full h-[200px] sm:h-full">
                                        <div className="flex gap-4 h-full">
                                            <div className="relative w-full h-full overflow-hidden rounded-2xl">
                                                <motion.img
                                                    src={`/storage/images/category/${category?.banner || category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <motion.div 
                                                    className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.6 }}
                                                >
                                                    <motion.h3 
                                                        className="text-2xl md:text-3xl 2xl:text-4xl font-semibold"
                                                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                    >
                                                        {category?.name}
                                                    </motion.h3>
                                                    <motion.p 
                                                        className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3"
                                                        whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
                                                    >
                                                        {category?.description}
                                                    </motion.p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </section>
                                </a>
                            </motion.div>
                        );
                        } else if (index === 1) {
                        // Second item - spans 2 cols
                        return (
                            <motion.div 
                                key={category.id} 
                                className="w-full lg:col-span-2"
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <a href={`/catalogo?category=${category.slug}`}>
                                    <section className="group font-paragraph text-white w-full h-[200px] sm:h-full sm:max-h-[320px] 2xl:h-[350px]">
                                        <div className="flex gap-4 h-full">
                                            <div className="relative w-full h-full overflow-hidden rounded-2xl">
                                                <motion.img
                                                    src={`/storage/images/category/${category?.banner || category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <motion.div 
                                                    className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.6 }}
                                                >
                                                    <motion.h3 
                                                        className="text-2xl md:text-3xl 2xl:text-4xl font-semibold"
                                                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                    >
                                                        {category?.name}
                                                    </motion.h3>
                                                    <motion.p 
                                                        className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3"
                                                        whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
                                                    >
                                                        {category?.description}
                                                    </motion.p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </section>
                                </a>
                            </motion.div>
                        );
                        } else {
                        // Regular items
                        return (
                            <motion.div 
                                key={category.id} 
                                className="w-full"
                                variants={itemVariants}
                                whileHover={{ 
                                    scale: 1.03,
                                    transition: { duration: 0.3 }
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <a href={`/catalogo?category=${category.slug}`}>
                                    <section className="group font-paragraph text-white w-full h-[200px] sm:h-full sm:min-h-[300px] 2xl:min-h-[300px] 2xl:max-h-[300px]">
                                        <div className="flex gap-4 h-full">
                                            <div className="relative w-full h-full overflow-hidden rounded-2xl">
                                                <motion.img
                                                    src={`/storage/images/category/${category?.banner || category?.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                    alt={category?.name}
                                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}
                                                />
                                                <div
                                                    className="absolute top-0 w-full h-full"
                                                    style={{
                                                        background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                    }}
                                                ></div>
                                                <motion.div 
                                                    className={`absolute p-4 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.6 }}
                                                >
                                                    <motion.h3 
                                                        className="text-2xl md:text-3xl 2xl:text-4xl font-semibold"
                                                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                    >
                                                        {category?.name}
                                                    </motion.h3>
                                                    <motion.p 
                                                        className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3"
                                                        whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
                                                    >
                                                        {category?.description}
                                                    </motion.p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </section>
                                </a>
                            </motion.div>
                        );
                        }
                    })}
                    </motion.div>
                );
                }
                return null;
            })}

            {/* Handle remainder categories */}
            {(() => {
                const remainder = categories.length % 4;
                const remainderCategories = categories.filter(cat => !processedCategories.has(cat.id));

                if (remainder > 0) {
                if (remainder === 1) {
                    return (
                        <motion.div 
                            key="remainder-1"
                            className="grid grid-cols-1 mt-5 xl:mt-7 2xl:mt-10"
                            variants={chunkVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {remainderCategories.map(category => (
                                <motion.div 
                                    key={category.id} 
                                    className="w-full"
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.02,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <a href={`/catalogo?category=${category.slug}`}>
                                        <section className="group font-paragraph text-white w-full h-[200px] sm:h-full max-h-[400px]">
                                            <div className="flex gap-4 h-full">
                                                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                                                    <motion.img
                                                        src={`/storage/images/category/${category?.banner || category?.image}`}
                                                        onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                        alt={category?.name}
                                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                    <div
                                                        className="absolute top-0 w-full h-full"
                                                        style={{
                                                            background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                        }}
                                                    ></div>
                                                    <motion.div 
                                                        className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3, duration: 0.6 }}
                                                    >
                                                        <motion.h3 
                                                            className="text-2xl md:text-3xl 2xl:text-4xl font-semibold"
                                                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                        >
                                                            {category?.name}
                                                        </motion.h3>
                                                        <motion.p 
                                                            className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3"
                                                            whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
                                                        >
                                                            {category?.description}
                                                        </motion.p>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </section>
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    );
                } else if (remainder === 2) {
                    return (
                        <motion.div 
                            key="remainder-2"
                            className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 mt-5 xl:mt-7 2xl:mt-10"
                            variants={chunkVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {remainderCategories.map(category => (
                                <motion.div 
                                    key={category.id} 
                                    className="w-full"
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.02,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <a href={`/catalogo?category=${category.slug}`}>
                                        <section className="group font-paragraph text-white w-full h-[200px] sm:h-full max-h-[400px]">
                                            <div className="flex gap-4 h-full">
                                                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                                                    <motion.img
                                                        src={`/storage/images/category/${category?.banner || category?.image}`}
                                                        onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                        alt={category?.name}
                                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                    <div
                                                        className="absolute top-0 w-full h-full"
                                                        style={{
                                                            background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                        }}
                                                    ></div>
                                                    <motion.div 
                                                        className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3, duration: 0.6 }}
                                                    >
                                                        <motion.h3 
                                                            className="text-2xl md:text-3xl 2xl:text-4xl font-semibold"
                                                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                        >
                                                            {category?.name}
                                                        </motion.h3>
                                                        <motion.p 
                                                            className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3"
                                                            whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
                                                        >
                                                            {category?.description}
                                                        </motion.p>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </section>
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    );
                } else if (remainder === 3) {
                    return (
                        <motion.div 
                            key="remainder-3"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-7 2xl:gap-10 mt-5 xl:mt-7 2xl:mt-10"
                            variants={chunkVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {remainderCategories.map(category => (
                                <motion.div 
                                    key={category.id} 
                                    className="w-full"
                                    variants={itemVariants}
                                    whileHover={{ 
                                        scale: 1.02,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <a href={`/catalogo?category=${category.slug}`}>
                                        <section className="group font-paragraph text-white w-full h-[200px] sm:h-full max-h-[400px]">
                                            <div className="flex gap-4 h-full">
                                                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                                                    <motion.img
                                                        src={`/storage/images/category/${category?.banner || category?.image}`}
                                                        onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                        alt={category?.name}
                                                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.4 }}
                                                    />
                                                    <div
                                                        className="absolute top-0 w-full h-full"
                                                        style={{
                                                            background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                                                        }}
                                                    ></div>
                                                    <motion.div 
                                                        className={`absolute p-4 lg:p-8 bottom-0 mt-4 space-y-1 lg:space-y-2`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.3, duration: 0.6 }}
                                                    >
                                                        <motion.h3 
                                                            className="text-2xl md:text-3xl 2xl:text-4xl font-semibold"
                                                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                                        >
                                                            {category?.name}
                                                        </motion.h3>
                                                        <motion.p 
                                                            className="text-sm sm:text-base lg:text-lg 2xl:text-xl line-clamp-3"
                                                            whileHover={{ opacity: 0.9, transition: { duration: 0.2 } }}
                                                        >
                                                            {category?.description}
                                                        </motion.p>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </section>
                                    </a>
                                </motion.div>
                            ))}
                        </motion.div>
                    );
                }
                }
                return null;
            })()}
        </motion.div>
    );
}
