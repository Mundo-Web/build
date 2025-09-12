import { Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";

const MenuCategories = ({ pages = [], items, data ,visible=false}) => {
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [swiper, setSwiper] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const menuRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // Configuración de Swiper
    const swiperConfig = {
        modules: [Navigation, Mousewheel, FreeMode],
        spaceBetween: 8,
        slidesPerView: 'auto',
        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.5,
            momentumVelocityRatio: 0.5,
        },
        mousewheel: {
            enabled: true,
            forceToAxis: true,
            sensitivity: 0.5,
        },
        navigation: {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
        },
        onSwiper: (swiperInstance) => {
            setSwiper(swiperInstance);
            // Asignar navegación después de que Swiper esté listo
            setTimeout(() => {
                if (prevRef.current && nextRef.current) {
                    swiperInstance.params.navigation.prevEl = prevRef.current;
                    swiperInstance.params.navigation.nextEl = nextRef.current;
                    swiperInstance.navigation.init();
                    swiperInstance.navigation.update();
                }
            }, 100);
        },
        onSlideChange: (swiperInstance) => {
            setIsBeginning(swiperInstance.isBeginning);
            setIsEnd(swiperInstance.isEnd);
        },
        breakpoints: {
            320: {
                spaceBetween: 4,
            },
            768: {
                spaceBetween: 8,
            },
            1024: {
                spaceBetween: 12,
            },
        },
    };

    // Estilos para Swiper y animaciones mejoradas
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .categories-swiper {
                overflow: hidden !important;
                padding: 8px 0;
                margin: 0 40px;
            }
            
            .categories-swiper .swiper-slide {
                width: auto !important;
                flex-shrink: 0;
            }
            
            .swiper-nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                z-index: 10;
                background: rgba(255, 255, 255, 0.95);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            
            .swiper-nav-btn:hover {
                background: rgba(255, 255, 255, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateY(-50%) scale(1.05);
            }
            
            .swiper-nav-btn.swiper-button-disabled {
                opacity: 0.3;
                cursor: not-allowed;
                pointer-events: none;
            }
            
            .swiper-nav-prev {
                left: 0;
            }
            
            .swiper-nav-next {
                right: 0;
            }
            
            @keyframes slideInFromBottom {
                from {
                    opacity: 0;
                    transform: translateY(12px) scale(0.995);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }
            
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
                }
                50% {
                    box-shadow: 0 0 20px 0 rgba(99, 102, 241, 0.1);
                }
            }
            
            .category-item {
                opacity: 0;
                transform: translateY(12px) scale(0.995);
                transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1);
                will-change: transform, opacity;
            }

            .category-item.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            .category-hover-effect {
                will-change: transform, box-shadow;
                backface-visibility: hidden;
                transform: translateZ(0);
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .category-hover-effect:hover {
                animation: pulse-glow 2s infinite;
                box-shadow: 
                    0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(99, 102, 241, 0.1),
                    0 0 20px rgba(99, 102, 241, 0.1);
            }
            
            .category-hover-effect:hover span {
                background: linear-gradient(
                    90deg,
                    currentColor 40%,
                    rgba(99, 102, 241, 0.8) 50%,
                    currentColor 60%
                );
                background-size: 200% 100%;
                background-clip: text;
                -webkit-background-clip: text;
                animation: shimmer 1.5s ease-in-out infinite;
            }
            
            .enhanced-underline {
                background: linear-gradient(90deg, 
                    rgba(99, 102, 241, 0.8) 0%, 
                    rgba(139, 92, 246, 0.8) 50%, 
                    rgba(99, 102, 241, 0.8) 100%
                );
                box-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
            }
        `;
        document.head.appendChild(style);
        return () => {
            try {
                document.head.removeChild(style);
            } catch (e) {
                // Style already removed
            }
        };
    }, []);

    // Motion variants and manual stagger control (because Swiper adds wrapper nodes)
    const itemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.995 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: [0.22,1,0.36,1] } }
    };

    // visibleItems is a map keyed by category id or slug to avoid index mismatches
    const [visibleItems, setVisibleItems] = useState({});
    const timersRef = useRef([]);

    useEffect(() => {
        // clear existing timers
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];

        if (!items || items.length === 0) {
            setVisibleItems({});
            return;
        }

        // sort once and keep deterministic order for staggering
        const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));

        // initialize map with all false
        const initialMap = {};
        sorted.forEach((cat) => {
            const key = cat.id ?? cat.slug ?? cat.name;
            initialMap[key] = false;
        });
        setVisibleItems(initialMap);

        // Stagger each item one by one with longer delay (400ms between items)
        // This ensures a clear sequential appearance
        const showNextItem = (index) => {
            if (index >= sorted.length) return;
            
            const key = sorted[index].id ?? sorted[index].slug ?? sorted[index].name;
            const t = setTimeout(() => {
                setVisibleItems(prev => ({ ...prev, [key]: true }));
                // After showing current item, schedule next one
                showNextItem(index + 1);
            }, 400); // 400ms delay between each item
            timersRef.current.push(t);
        };

        // Start the sequence with the first item
        showNextItem(0);

        return () => {
            timersRef.current.forEach(t => clearTimeout(t));
            timersRef.current = [];
        };
    }, [items]);

    useEffect(() => {
        // Obtener tags activos al cargar el componente
        const fetchTags = async () => {
            try {
                const response = await tagsItemsRest.getTags();
                if (response?.data) {
                    // Filtrar y ordenar tags: promocionales activos primero, luego permanentes
                    const activeTags = response.data.filter(tag => 
                        tag.promotional_status === 'permanent' || tag.promotional_status === 'active'
                    ).sort((a, b) => {
                        // Promocionales activos primero
                        if (a.promotional_status === 'active' && b.promotional_status !== 'active') return -1;
                        if (b.promotional_status === 'active' && a.promotional_status !== 'active') return 1;
                        // Luego por nombre
                        return a.name.localeCompare(b.name);
                    });
                    
                    setTags(activeTags);
                    
                    // Log para debug: mostrar información promocional
                    const promotionalCount = activeTags.filter(t => t.promotional_status === 'active').length;
                    const permanentCount = activeTags.filter(t => t.promotional_status === 'permanent').length;
                    
                    if (promotionalCount > 0) {
                        const activePromotions = activeTags.filter(t => t.promotional_status === 'active');
                    }
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    // Auto-advance carousel for mobile tags
    useEffect(() => {
        if (tags.length > 2 && window.innerWidth < 1024) {
            const interval = setInterval(() => {
                setCurrentTagIndex(prev => {
                    const nextIndex = prev + 2;
                    return nextIndex >= tags.length ? 0 : nextIndex;
                });
            }, 3000); // Avanza cada 3 segundos

            return () => clearInterval(interval);
        }
    }, [tags.length]);

    // Detectar si estamos en mobile
    const isMobile = window.innerWidth < 1024;
    
    // Simplificar la lógica: siempre mostrar en desktop, en mobile solo si visible es true
    const shouldShowMenu = isMobile ? visible : true;
    // Mostrar solo tags en mobile si existen Y visible es true
    const showOnlyTagsMobile = tags.length > 0 && isMobile && visible;

    // console logs removed for cleanliness

  

    return (
        <nav
            className={
                " relative w-full md:block bg-secondary font-paragraph text-sm"
                
            }
           
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 lg:gap-6 text-sm w-full overflow-hidden">
                  
                        <>
                            {/* Título y Lista de categorías con scroll horizontal mejorado */}
                            <div className="flex items-center gap-4 w-full overflow-hidden">
                                {/* Título fijo */}
                                <div className="flex-shrink-0">
                                    <span className="font-semibold customtext-neutral-dark">Categorías:</span>
                                </div>
                                
                                {/* Mostrar categorías si existen, sino mostrar mensaje */}
                                {items && items.length > 0 ? (
                                    /* Contenedor moderno con Swiper y navegación */
                                    <div className="relative flex-1 overflow-hidden">
                                        {/* Botón anterior */}
                                        <button
                                            ref={prevRef}
                                            className={`swiper-nav-btn swiper-nav-prev ${isBeginning ? 'swiper-button-disabled' : ''}`}
                                            aria-label="Categoría anterior"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                                        </button>

                                        {/* Swiper Container */}
                                        <div className="">
                                            <Swiper
                                                {...swiperConfig}
                                                className="categories-swiper"
                                            >
                                                {[...items].sort((a, b) => a.name.localeCompare(b.name)).map((category, index) => {
                                                    const key = category.id ?? category.slug ?? category.name;
                                                    return (
                                                        <SwiperSlide key={key}>
                                                            <div
                                                                className={`category-item ${visibleItems[key] ? 'visible' : ''}`}
                                                                onMouseEnter={(e) => e.currentTarget.classList.add('')}
                                                                onMouseLeave={(e) => e.currentTarget.classList.remove('')}
                                                            >
                                                                <a
                                                                    href={`/catalogo?category=${category.slug}`}
                                                                    className="relative font-medium text-gray-700 hover:customtext-primary transition-all duration-500 cursor-pointer px-4 py-2.5 rounded-lg   whitespace-nowrap transform hover:scale-110 hover:-translate-y-1  "
                                                                >
                                                                    {/* Underline hover effect mejorado */}
                                                                    <span className="relative">
                                                                        {category.name}
                                                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 enhanced-underline transition-all duration-500 group-hover/item:w-full rounded-full"></span>
                                                                        
                                                                        {/* Efecto de brillo al hover */}
                                                                        <span className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent group-hover/item:opacity-100 transition-opacity duration-700 rounded-lg"></span>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </SwiperSlide>
                                                    );
                                                })}
                                            </Swiper>
                                        </div>

                                        {/* Botón siguiente */}
                                        <button
                                            ref={nextRef}
                                            className={`swiper-nav-btn swiper-nav-next ${isEnd ? 'swiper-button-disabled' : ''}`}
                                            aria-label="Categoría siguiente"
                                        >
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-3">
                                        <span className="text-sm text-gray-500">No hay categorías disponibles</span>
                                    </div>
                                )}
                            </div>
                        
                            {/* Botones de Tags - Ahora al final */}
                            {tags.length > 0 && (
                                <div className="flex items-center gap-4 lg:gap-4 text-sm">
                                    {tags.map((tag, index) => (
                                        <li key={tag.id} className="">
                                            <a
                                                href={`/catalogo?tag=${tag.id}`}
                                                className={
                                                    `font-medium rounded-full p-2 hover:brightness-105 cursor-pointer transition-all duration-300 relative flex items-center gap-2`
                                                }
                                                style={{
                                                    backgroundColor: tag.background_color || '#3b82f6',
                                                    color: tag.text_color || '#ffffff',
                                                }}
                                                title={tag.description || tag.name}
                                            >
                                                {tag.icon && (
                                                    <img 
                                                        src={`/storage/images/tag/${tag.icon}`} 
                                                        alt={tag.name} 
                                                        className="w-4 h-4"   
                                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                    />
                                                )}
                                                
                                                {tag.name}
                                            </a>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </>
                    
                </div>
            </div>
        </nav>
    );
};

export default MenuCategories;
