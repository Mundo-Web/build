import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const ProductListHostinfinity = ({ items = [], data = {}, categories = [], onClickTracking }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPackage, setSelectedPackage] = useState('all');
    const swiperRef = useRef(null);

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const scaleVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    // Agrupar items por categoría
    const categoriesFromItems = useMemo(() => {
        if (!items || items.length === 0) return [];
        
        const cats = {};
        items.forEach(item => {
            if (item.category) {
                const catId = item.category.id || item.category_id;
                if (!cats[catId]) {
                    cats[catId] = {
                        id: catId,
                        name: item.category.name,
                        slug: item.category.slug || catId,
                        description: item.category.description || '',
                        image: item.category.image || null
                    };
                }
            }
        });
        return Object.values(cats);
    }, [items]);

    const availableCategories = categories.length > 0 ? categories : categoriesFromItems;

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'all') return items;
        return items.filter(item => {
            const catSlug = item.category?.slug || item.category_id;
            return catSlug === selectedCategory;
        });
    }, [items, selectedCategory]);

    const packageGroups = useMemo(() => {
        const groups = {};
        filteredItems.forEach(item => {
            const groupKey = item.subcategory?.slug || item.brand?.slug || 'default';
            const groupName = item.subcategory?.name || item.brand?.name || 'General';
            
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    slug: groupKey,
                    name: groupName,
                    items: []
                };
            }
            groups[groupKey].items.push(item);
        });
        return Object.values(groups);
    }, [filteredItems]);

    React.useEffect(() => {
        if (packageGroups.length > 0 && selectedPackage === 'all') {
            setSelectedPackage(packageGroups[0].slug);
        }
    }, [packageGroups]);

    const currentPackage = packageGroups.find(p => p.slug === selectedPackage) || packageGroups[0];

    // Iconos de categoría
    const getCategoryIcon = (slug) => {
        if (slug?.includes('hosting') || slug?.includes('web')) {
            return (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
            );
        }
        if (slug?.includes('vps') || slug?.includes('server')) {
            return (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            );
        }
        return (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        );
    };

    // Card de Plan Premium
    const PlanCard = ({ item, index }) => {
        const isFeatured = item.featured || item.is_featured;
        const attributes = item.attributes || [];
        const price = item.final_price || item.price || 0;
        const originalPrice = item.price || 0;
        const hasDiscount = item.discount && parseFloat(item.discount) > 0;

        const handleBuyClick = (e) => {
            e.preventDefault();
            if (onClickTracking) onClickTracking(item);
            if (item.slug) window.location.href = `/producto/${item.slug}`;
        };

        return (
            <motion.div
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: isFeatured ? -8 : -4, transition: { duration: 0.3 } }}
                className={`
                    relative h-full rounded-3xl overflow-hidden
                    ${isFeatured 
                        ? 'z-20' 
                        : 'z-10'
                    }
                `}
            >
               
                {/* Card Container */}
                <div className={`
                    relative h-full rounded-3xl overflow-hidden
                    transition-all duration-500
                    ${isFeatured 
                        ? 'bg-gradient-to-br from-accent via-accent to-primary border-2 border-warning/50' 
                        : 'bg-gradient-to-br from-accent/90 via-accent to-primary/90 border border-white/10 hover:border-secondary/50'
                    }
                `}>
                    {/* Patrón de fondo sutil */}
                    <div 
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* Badge Destacado con animación */}
                    {isFeatured && (
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                        >
                            <div className="relative">
                                <span className="inline-flex items-center px-6 py-2 rounded-b-2xl text-sm font-bold bg-gradient-to-r from-warning via-warning to-warning text-primary shadow-lg shadow-warning/30">
                                    <motion.svg 
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-4 h-4 mr-2" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </motion.svg>
                                    Recomendado
                                </span>
                               
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    className="absolute -top-2 right-4 w-2 h-2 bg-warning rounded-full"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Contenido de la Card */}
                    <div className={`relative p-8 flex flex-col h-full min-h-[520px] ${isFeatured ? 'pt-14' : 'pt-8'}`}>
                        
                        {/* Icono decorativo */}
                        <div className="absolute top-4 right-4 opacity-10">
                            <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                            </svg>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-6 relative z-10">
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{item.name}</h3>
                            {item.summary && (
                                <p className="text-sm text-white/60 line-clamp-2">{item.summary}</p>
                            )}
                        </div>

                        {/* Precio con estilo premium */}
                        <div className="text-center mb-6 relative z-10">
                            {hasDiscount && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-block text-lg text-white/40 line-through mb-1"
                                >
                                    S/ {parseFloat(originalPrice).toFixed(2)}
                                </motion.span>
                            )}
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-lg text-white/70">S/</span>
                                <span className={`text-5xl lg:text-6xl font-bold ${isFeatured ? 'text-warning' : 'text-secondary'}`}>
                                    {parseFloat(price).toFixed(0)}
                                </span>
                                <span className="text-2xl text-white/70">.{(parseFloat(price) % 1).toFixed(2).split('.')[1]}</span>
                            </div>
                            {item.billing_cycle && (
                                <span className="text-sm text-white/50 mt-1 block">
                                    / {item.billing_cycle === 'monthly' ? 'mes' : item.billing_cycle === 'yearly' ? 'año' : item.billing_cycle}
                                </span>
                            )}
                        </div>

                      
                        {/* Lista de características */}
                        <div className="flex-1 relative z-10 mb-6">
                            <ul className="space-y-3">
                                {attributes.slice(0, 6).map((attr, idx) => {
                                    const value = attr.pivot?.value || attr.value || '';
                                    const unit = attr.unit || '';
                                    
                                    return (
                                        <motion.li 
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (idx * 0.05) }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isFeatured ? 'bg-warning/20' : 'bg-secondary/20'}`}>
                                                <svg className={`w-3 h-3 ${isFeatured ? 'text-warning' : 'text-secondary'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-lg text-neutral-light">
                                                {attr.name}: <span className="font-semibold text-white block">{value} {unit}</span>
                                            </span>
                                        </motion.li>
                                    );
                                })}

                                {attributes.length === 0 && item.features && item.features.length > 0 && (
                                    item.features.slice(0, 6).map((feature, idx) => (
                                        <motion.li 
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + (idx * 0.05) }}
                                            className="flex items-center gap-3 text-lg"
                                        >
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isFeatured ? 'bg-warning/20' : 'bg-secondary/20'}`}>
                                                <svg className={`w-3 h-3 ${isFeatured ? 'text-warning' : 'text-secondary'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className=" text-neutral-light">
                                                {feature.name || feature.title}
                                            </span>
                                        </motion.li>
                                    ))
                                )}

                                {attributes.length === 0 && (!item.features || item.features.length === 0) && (
                                    <p className="text-center text-neutral-light/40 text-sm py-4">Sin características configuradas</p>
                                )}
                            </ul>
                        </div>

                        {/* Botón de acción */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBuyClick}
                            className={`
                                relative w-full py-4 px-6 rounded-full font-bold text-lg
                                flex items-center justify-center gap-3
                                transition-all duration-300 overflow-hidden group
                                ${isFeatured 
                                    ? 'bg-gradient-to-r from-warning via-warning to-warning text-primary shadow-lg shadow-warning/40 hover:shadow-warning/60' 
                                    : 'bg-gradient-to-r from-secondary via-secondary to-secondary text-white shadow-lg shadow-secondary/30 hover:shadow-secondary/50'
                                }
                            `}
                        >
                            {/* Efecto de brillo en hover */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <span className="relative">Lo quiero</span>
                            <svg className="w-5 h-5 relative transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className={`relative py-16 lg:py-24 overflow-hidden ${data?.class || ''}`}>
           
            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header con animación */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {data?.title ? (
                        <h2 className="text-4xl lg:text-6xl font-bold text-neutral-dark  mb-4 tracking-tight">
                            <TextWithHighlight text={data.title} color="bg-secondary" />
                        </h2>
                    ) : (
                        <h2 className="text-4xl lg:text-6xl font-bold text-neutral-dark  mb-4 tracking-tight">
                            Explora Nuestras <span className="text-secondary">Soluciones</span>
                        </h2>
                    )}
                    {data?.description && (
                        <p className="text-xl text-neutral-light max-w-2xl mx-auto">
                            <TextWithHighlight text={data.description} color="bg-accent" />
                        </p>
                    )}
                </motion.div>

                {/* Selector de Categorías */}
                {availableCategories.length > 1 && (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16"
                    >
                        {availableCategories.map((category, idx) => {
                            const isSelected = selectedCategory === category.slug;
                            return (
                                <motion.button
                                    key={category.id || category.slug}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedCategory(category.slug);
                                        setSelectedPackage('all');
                                    }}
                                    className={`
                                        group relative overflow-hidden rounded-full p-8
                                        transition-all duration-500 text-left
                                        ${isSelected
                                            ? 'bg-gradient-to-br from-secondary via-secondary to-secondary shadow-2xl shadow-secondary/40'
                                            : 'bg-accent/80 backdrop-blur-xl border border-white/10 hover:border-secondary/50'
                                        }
                                    `}
                                >
                                    {/* Icono de fondo */}
                                    <div className={`absolute top-4 right-4 w-24 h-24 transition-all duration-500 ${
                                        isSelected ? 'opacity-30 scale-110' : 'opacity-10 group-hover:opacity-20 group-hover:scale-105'
                                    }`}>
                                        {getCategoryIcon(category.slug)}
                                    </div>

                                    {/* Contenido */}
                                    <div className="relative z-10 flex flex-col items-start">
                                        <div className={`mb-4 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                            isSelected
                                                ? 'bg-white/20 shadow-lg'
                                                : 'bg-secondary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-secondary/30'
                                        }`}>
                                            <div className="text-white">
                                                {getCategoryIcon(category.slug)}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2">
                                            {category.name}
                                        </h3>

                                        {category.description && (
                                            <p className={`text-sm leading-relaxed ${
                                                isSelected ? 'text-white/80' : 'text-white/50 group-hover:text-white/70'
                                            }`}>
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Flecha */}
                                    <motion.div 
                                        animate={{ x: isSelected ? 0 : -5, opacity: isSelected ? 1 : 0 }}
                                        className="absolute bottom-6 right-6"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </motion.div>

                                    {/* Indicador activo */}
                                    {isSelected && (
                                        <motion.div 
                                            layoutId="activeIndicator"
                                            className="absolute top-4 right-4 w-3 h-3 rounded-full bg-white shadow-lg"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}

                {/* Selector de Paquetes */}
                {packageGroups.length > 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 p-2 rounded-full bg-accent/80 backdrop-blur-xl border border-white/10">
                            {packageGroups.map(pkg => (
                                <button
                                    key={pkg.slug}
                                    onClick={() => setSelectedPackage(pkg.slug)}
                                    className={`
                                        relative px-8 py-3 rounded-full font-semibold transition-all duration-300
                                        ${selectedPackage === pkg.slug
                                            ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {pkg.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Swiper de Planes */}
                <AnimatePresence mode="wait">
                    {currentPackage && currentPackage.items.length > 0 ? (
                        <motion.div
                            key={selectedPackage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            <Swiper
                                ref={swiperRef}
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={32}
                                slidesPerView={1}
                                centeredSlides={currentPackage.items.length <= 3}
                                navigation={{
                                    prevEl: '.swiper-btn-prev',
                                    nextEl: '.swiper-btn-next',
                                }}
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                autoplay={{
                                    delay: 6000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                loop={currentPackage.items.length > 3}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                        centeredSlides: false,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 32,
                                        centeredSlides: false,
                                    },
                                }}
                                className=" !px-4"
                            >
                                {currentPackage.items.map((item, index) => (
                                    <SwiperSlide key={item.id} className="h-auto !flex">
                                        <div className="w-full py-6">
                                            <PlanCard item={item} index={index} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Botones de navegación custom */}
                            {currentPackage.items.length > 3 && (
                                <>
                                    <button className="swiper-btn-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-20 w-12 h-12 rounded-full bg-accent/90 backdrop-blur border border-white/10 text-white hover:bg-secondary hover:border-secondary transition-all duration-300 flex items-center justify-center shadow-xl">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button className="swiper-btn-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 z-20 w-12 h-12 rounded-full bg-accent/90 backdrop-blur border border-white/10 text-white hover:bg-secondary hover:border-secondary transition-all duration-300 flex items-center justify-center shadow-xl">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex flex-col items-center p-8 rounded-3xl bg-accent/50 backdrop-blur border border-white/10">
                                <svg className="w-16 h-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p className="text-white/50 text-lg">No hay planes disponibles.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

               
            </div>
        </section>
    );
};

export default ProductListHostinfinity;
