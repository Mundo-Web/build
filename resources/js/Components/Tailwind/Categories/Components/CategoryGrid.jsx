import { motion } from "framer-motion";

export default function CategoryGrid({ categories }) {
    // Dividir categorias en grupos de 4
    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < categories.length; i += chunkSize) {
        chunks.push(categories.slice(i, i + chunkSize));
    }

    // Variantes de animacion simplificadas
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    // Componente para renderizar una categoria individual
    const CategoryCard = ({ category, className = "" }) => (
        <div 
            className={`w-full h-full ${className} overflow-hidden`}
        >
            <a href={`/catalogo?category=${category.slug}`} className="block w-full h-full">
                <div className="group font-paragraph text-white w-full h-full relative overflow-hidden rounded-2xl">
                    <img
                        src={`/storage/images/category/${category?.banner || category?.image}`}
                        onError={e => e.target.src = "assets/img/noimage/noimagenslider.jpg"}
                        alt={category?.name}
                        className="object-cover w-full h-full max-w-full max-h-full transition-transform duration-300 group-hover:scale-105"
                        style={{ 
                            objectFit: 'cover',
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(187.83deg, rgba(0, 0, 0, 0) 34.08%, rgba(0, 0, 0, 0.4) 92.08%)",
                        }}
                    ></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 space-y-1 lg:space-y-2">
                        <h3 className="text-lg md:text-xl 2xl:text-2xl font-semibold">
                            {category?.name}
                        </h3>
                        <p className="text-sm sm:text-base line-clamp-2">
                            {category?.description}
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );

    // Funcion para renderizar cada chunk segun el numero de elementos
    const renderChunk = (chunk, chunkIndex) => {
        const count = chunk.length;
        const marginClass = chunkIndex === 0 ? "mt-0" : "mt-10";
        
        if (count === 1) {
            return (
                <motion.div 
                    key={`chunk-${chunkIndex}`}
                    className={`w-full h-[400px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <CategoryCard category={chunk[0]} />
                </motion.div>
            );
        } 
        
        if (count === 2) {
            return (
                <motion.div 
                    key={`chunk-${chunkIndex}`}
                    className={`grid grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 h-[350px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <CategoryCard category={chunk[0]} />
                    <CategoryCard category={chunk[1]} />
                </motion.div>
            );
        } 
        
        if (count === 3) {
            return (
                <motion.div 
                    key={`chunk-${chunkIndex}`}
                    className={`flex gap-5 xl:gap-7 2xl:gap-10 h-[500px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <div className="w-[50%] h-full overflow-hidden">
                        <CategoryCard category={chunk[0]} />
                    </div>
                    <div className="w-[50%] flex flex-col gap-5 xl:gap-7 2xl:gap-10 h-full overflow-hidden">
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[1]} />
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[2]} />
                        </div>
                    </div>
                </motion.div>
            );
        } 
        
        if (count === 4) {
            return (
                <motion.div 
                    key={`chunk-${chunkIndex}`}
                    className={`grid grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 h-[600px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <div className="flex flex-col gap-5 xl:gap-7 2xl:gap-10 h-full overflow-hidden">
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[0]} />
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[1]} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 xl:gap-7 2xl:gap-10 h-full overflow-hidden">
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[2]} />
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[3]} />
                        </div>
                    </div>
                </motion.div>
            );
        }
        
        return null;
    };

    return (
        <motion.div 
            className="w-full overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {chunks.map((chunk, chunkIndex) => renderChunk(chunk, chunkIndex))}
        </motion.div>
    );
}