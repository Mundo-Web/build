import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import { Rocket } from 'lucide-react';

const ProductListHostinfinityFilter = ({ 
    items = [], 
    data = {}, 
    categories = [],
    subcategories = [],
    brands = [],
    onClickTracking 
}) => {
    const [activeFilters, setActiveFilters] = useState({
        category: 'all',
        subcategory: 'all',
        brand: 'all',
        featured: false,
    });
    const [currentSlide, setCurrentSlide] = useState(0);
    const swiperRef = useRef(null);

    // Extraer categorías de los items
    const availableCategories = useMemo(() => {
        if (categories.length > 0) return categories;
        const cats = {};
        items.forEach(item => {
            if (item.category) {
                const catId = item.category.id || item.category_id;
                if (!cats[catId]) {
                    cats[catId] = {
                        id: catId,
                        name: item.category.name,
                        slug: item.category.slug || catId,
                        image: item.category.image
                    };
                }
            }
        });
        return Object.values(cats);
    }, [items, categories]);

    const availableSubcategories = useMemo(() => {
        if (subcategories.length > 0) return subcategories;
        const subcats = {};
        items.forEach(item => {
            if (item.subcategory) {
                const subcatId = item.subcategory.id || item.subcategory_id;
                if (!subcats[subcatId]) {
                    subcats[subcatId] = {
                        id: subcatId,
                        name: item.subcategory.name,
                        slug: item.subcategory.slug || subcatId,
                        categoryId: item.category?.id || item.category_id
                    };
                }
            }
        });
        return Object.values(subcats);
    }, [items, subcategories]);

    const availableBrands = useMemo(() => {
        if (brands.length > 0) return brands;
        const brnds = {};
        items.forEach(item => {
            if (item.brand) {
                const brandId = item.brand.id || item.brand_id;
                if (!brnds[brandId]) {
                    brnds[brandId] = {
                        id: brandId,
                        name: item.brand.name,
                        slug: item.brand.slug || brandId,
                        image: item.brand.image
                    };
                }
            }
        });
        return Object.values(brnds);
    }, [items, brands]);

    // Subcategorías filtradas
    const filteredSubcategories = useMemo(() => {
        if (activeFilters.category === 'all') return availableSubcategories;
        return availableSubcategories.filter(sub => {
            const selectedCat = availableCategories.find(c => c.slug === activeFilters.category);
            return sub.categoryId === selectedCat?.id;
        });
    }, [availableSubcategories, activeFilters.category, availableCategories]);

    // Filtrar items
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            if (activeFilters.category !== 'all') {
                const catSlug = item.category?.slug || item.category_id;
                if (catSlug !== activeFilters.category) return false;
            }
            if (activeFilters.subcategory !== 'all') {
                const subcatSlug = item.subcategory?.slug || item.subcategory_id;
                if (subcatSlug !== activeFilters.subcategory) return false;
            }
            if (activeFilters.brand !== 'all') {
                const brandSlug = item.brand?.slug || item.brand_id;
                if (brandSlug !== activeFilters.brand) return false;
            }
            if (activeFilters.featured) {
                if (!item.featured && !item.is_featured) return false;
            }
            return true;
        });
    }, [items, activeFilters]);

    // Reset filtros
    const resetFilters = () => {
        setActiveFilters({
            category: 'all',
            subcategory: 'all',
            brand: 'all',
            featured: false,
        });
    };

    // Contar filtros activos
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (activeFilters.category !== 'all') count++;
        if (activeFilters.subcategory !== 'all') count++;
        if (activeFilters.brand !== 'all') count++;
        if (activeFilters.featured) count++;
        return count;
    }, [activeFilters]);

    useEffect(() => {
        if (swiperRef.current?.swiper) {
            swiperRef.current.swiper.slideTo(0);
            setCurrentSlide(0);
        }
    }, [activeFilters]);

    // Plan Card - Estilo FeaturedPlanBanner
    const FeaturedPlanCard = ({ item }) => {
        const isFeatured = item.featured || item.is_featured;
        const attributes = item.attributes || [];
        const features = item.features || [];
        const price = item.final_price || item.price || 0;
        const originalPrice = item.price || 0;
        const hasDiscount = item.discount && parseFloat(item.discount) > 0;
     

        const handleBuyClick = () => {
            if (onClickTracking) onClickTracking(item);
            if (item.slug) window.location.href = `/producto/${item.slug}`;
        };

        // Combinar atributos y features
        const allFeatures = attributes.length > 0 
            ? attributes.map(attr => `${attr.name}: ${attr.pivot?.value || attr.value || ''} ${attr.unit || ''}`.trim())
            : features.map(f => f.name || f.title);

        return (
            <div className="relative overflow-hidden rounded-2xl  bg-primary">
              
                <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Columna de contenido */}
                    <div className="relative order-2 lg:order-1 p-8 lg:p-12 flex flex-col justify-center">
                        {/* Icono y título */}
                        <div className="inline-flex items-center space-x-4 mb-6">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/50">
                                    {item.category?.image ? (
                                        <img 
                                            src={`/storage/images/category/${item.category.image}`}
                                            alt=""
                                            className="w-8 h-8 object-contain filter brightness-0 invert"
                                        />
                                    ) : (
                                        <Rocket className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div className="absolute inset-0 rounded-xl bg-secondary blur opacity-50" />
                            </div>
                            <div>
                                {item.category?.name && (
                                    <span className="text-md text-secondary font-medium">{item.category.name}</span>
                                )}
                                <h3 className="text-3xl lg:text-5xl font-bold text-white">
                                    {item.subcategory?.name || item.name}
                                </h3>
                            </div>
                        </div>

                        {/* Descripción */}
                        {item.summary && (
                            <p className="text-xl text-white/70 mb-8 leading-relaxed">
                                {item.summary}
                            </p>
                        )}

                        {/* Precio */}
                        <div className="flex items-baseline mb-8">
                            {hasDiscount && (
                                <span className="text-xl text-white/40 line-through mr-3">
                                    S/ {parseFloat(originalPrice).toFixed(2)}
                                </span>
                            )}
                            <span className="text-5xl lg:text-6xl font-bold text-white">
                                S/ {parseFloat(price).toFixed(2)}
                            </span>
                            {item.billing_cycle && (
                                <span className="text-xl text-white/50 ml-2">
                                    /{item.billing_cycle === 'monthly' ? 'mes' : item.billing_cycle === 'yearly' ? 'año' : item.billing_cycle}
                                </span>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                            {allFeatures.slice(0, 6).map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 rounded-xl bg-accent/50 border border-white/10 hover:border-secondary/50 transition-all duration-300 group"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-200">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-base text-neutral-light group-hover:text-white transition-colors duration-300">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Botones */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleBuyClick}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold text-lg bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/50 hover:shadow-secondary/70 transition-all duration-200 group"
                            >
                                Contratar Ahora
                                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                          
                        </div>

                     
                    </div>

                    {/* Columna de imagen */}
                    <div className="relative order-1 lg:order-2 h-64 lg:h-auto min-h-[400px]">
                        <div className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:rounded-r-xl overflow-hidden">
                            <img
                               src={`/storage/images/item/${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                 onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                            />
                            {/* Gradientes de overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent lg:from-primary/80 lg:via-transparent lg:to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent lg:hidden" />

                       

                
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!items || items.length === 0) {
        return null;
    }

    const hasAnyFilter = availableCategories.length > 0 || availableBrands.length > 0 || filteredSubcategories.length > 0;

    return (
        <section className={`relative py-20 lg:py-28 overflow-hidden  ${data?.class || ''}`}>
           
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
      </div>
        

         

            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    {/* Badge */}
                    {data?.badge && (
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-warning/20 border border-secondary/30 mb-6">
                            <svg className="w-4 h-4 text-secondary mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span className="text-sm font-semibold text-secondary">
                                <TextWithHighlight text={data.badge} />
                            </span>
                        </div>
                    )}

                    <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                        {data?.title && (
                            <TextWithHighlight text={data.title} color="bg-secondary" />
                        ) }
                    </h2>
                    
                    {data?.description && (
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            <TextWithHighlight text={data.description} color="bg-accent" />
                        </p>
                    )}
                </motion.div>

           
                {/* Swiper de Planes - Un plan por slide */}
                <AnimatePresence mode="wait">
                    {filteredItems.length > 0 ? (
                        <motion.div
                            key={JSON.stringify(activeFilters)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="relative"
                        >
                            <Swiper
                                ref={swiperRef}
                                modules={[Navigation, Autoplay, EffectFade]}
                                spaceBetween={32}
                                slidesPerView={1}
                                effect="fade"
                                fadeEffect={{ crossFade: true }}
                                navigation={{
                                    prevEl: '.swiper-filter-prev',
                                    nextEl: '.swiper-filter-next',
                                }}
                                autoplay={{
                                    delay: 6000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                loop={filteredItems.length > 1}
                                onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                                className=""
                            >
                                {filteredItems.map((item, index) => (
                                    <SwiperSlide key={item.id}>
                                        <FeaturedPlanCard item={item} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Paginación Custom estilo SliderLaPetaca */}
                            {filteredItems.length > 1 && (
                                <div className="flex justify-center mt-8 space-x-3">
                                    {filteredItems.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (swiperRef.current?.swiper) {
                                                    swiperRef.current.swiper.slideToLoop(index);
                                                }
                                            }}
                                            className={`transition-all duration-300 rounded-full ${
                                                index === currentSlide
                                                    ? 'w-12 h-3 bg-secondary'
                                                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="inline-flex flex-col items-center p-10 rounded-3xl bg-accent/50 backdrop-blur border border-white/10">
                                <svg className="w-20 h-20 text-white/20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-white/50 text-xl mb-2">No se encontraron planes</p>
                                <p className="text-white/30 text-sm mb-6">Intenta ajustar los filtros de búsqueda</p>
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/80 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Mostrar todos los planes
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Botón ver todos */}
                {data?.show_all_link && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <a
                            href={data.all_link || '/productos'}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/30 transition-all duration-200 group"
                        >
                            Ver todos los planes
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </motion.div>
                )}
            </div>

            {/* CSS para animación float */}
            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};

export default ProductListHostinfinityFilter;
