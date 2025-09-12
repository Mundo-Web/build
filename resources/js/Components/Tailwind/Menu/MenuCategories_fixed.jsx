import { Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";

const MenuCategories = ({ pages = [], items, data ,visible=false}) => {
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const menuRef = useRef(null);
    const scrollRef = useRef(null);

    // Función para actualizar estado del scroll
    const updateScrollButtons = (container) => {
        if (container) {
            const isAtStart = container.scrollLeft <= 10;
            const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;
            
            setCanScrollLeft(!isAtStart);
            setCanScrollRight(!isAtEnd);
            
            // Calcular progreso del scroll
            const maxScroll = container.scrollWidth - container.clientWidth;
            const progress = maxScroll > 0 ? (container.scrollLeft / maxScroll) * 100 : 0;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
        }
    };

    // Estilos para scrollbar completamente invisible y animaciones mejoradas
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .scrollbar-invisible {
                scrollbar-width: none;
                -ms-overflow-style: none;
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
                overscroll-behavior-x: contain;
                overscroll-behavior-y: none;
                scroll-snap-type: none;
                -webkit-scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
            }
            
            .scrollbar-invisible::-webkit-scrollbar {
                display: none;
                width: 0 !important;
                height: 0 !important;
                background: transparent !important;
            }
            
            .scrollbar-invisible::-webkit-scrollbar-track {
                display: none !important;
            }
            
            .scrollbar-invisible::-webkit-scrollbar-thumb {
                display: none !important;
            }
            
            .scrollbar-invisible::-webkit-scrollbar-corner {
                display: none !important;
            }
            
            @keyframes slideInFromBottom {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
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
                animation: slideInFromBottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                opacity: 0;
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
            
            @keyframes breathe {
                0%, 100% {
                    opacity: 0.6;
                    transform: scaleY(1);
                }
                50% {
                    opacity: 1;
                    transform: scaleY(1.2);
                }
            }
            
            .progress-bar {
                animation: breathe 3s ease-in-out infinite;
            }
            
            .enhanced-gradient-left {
                background: linear-gradient(90deg, 
                    rgba(var(--secondary-rgb, 248, 250, 252), 1) 0%,
                    rgba(var(--secondary-rgb, 248, 250, 252), 0.8) 50%,
                    transparent 100%
                );
            }
            
            .enhanced-gradient-right {
                background: linear-gradient(270deg, 
                    rgba(var(--secondary-rgb, 248, 250, 252), 1) 0%,
                    rgba(var(--secondary-rgb, 248, 250, 252), 0.8) 50%,
                    transparent 100%
                );
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

    // Inicializar estado de scroll cuando las categorías cambien - SCROLL ULTRA SUAVE
    useEffect(() => {
        if (scrollRef.current && items && items.length > 0) {
            const container = scrollRef.current;
            let isScrolling = false;
            let scrollTimeout = null;
            
            // Configurar estado inicial
            setTimeout(() => {
                updateScrollButtons(container);
            }, 100);
            
            // Scroll ULTRA SUAVE con detección inteligente
            const handleWheel = (e) => {
                e.preventDefault();
                
                // Evitar scroll demasiado rápido
                if (isScrolling) return;
                
                // Detectar tipo de scroll y calcular velocidad óptima
                const isTrackpad = Math.abs(e.deltaY) < 50; // Trackpad vs mouse wheel
                const scrollMultiplier = isTrackpad ? 0.4 : 0.3; // Más suave para ambos
                const maxScrollStep = isTrackpad ? 25 : 20; // Pasos más pequeños
                
                let scrollAmount = 0;
                
                if (e.deltaY !== 0) {
                    // Scroll vertical a horizontal ultra suave
                    const rawAmount = e.deltaY * scrollMultiplier;
                    scrollAmount = Math.sign(rawAmount) * Math.min(Math.abs(rawAmount), maxScrollStep);
                } else if (e.deltaX !== 0) {
                    // Scroll horizontal directo
                    scrollAmount = e.deltaX * 0.5;
                }
                
                // Shift + scroll con velocidad moderada
                if (e.shiftKey && e.deltaY !== 0) {
                    scrollAmount = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY * 0.8), 40);
                }
                
                if (scrollAmount !== 0) {
                    isScrolling = true;
                    
                    // Limpiar timeout anterior
                    if (scrollTimeout) {
                        clearTimeout(scrollTimeout);
                    }
                    
                    // Animación suave ultra mejorada
                    const currentScroll = container.scrollLeft;
                    let start = null;
                    const duration = 400; // Duración más larga para mayor suavidad
                    
                    const ultraSmoothScroll = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        
                        // Easing ultra suave - casi como en macOS
                        const ease = progress < 0.5 
                            ? 4 * progress * progress * progress
                            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                        
                        const newScrollLeft = currentScroll + (scrollAmount * ease);
                        container.scrollLeft = newScrollLeft;
                        
                        if (progress < 1) {
                            requestAnimationFrame(ultraSmoothScroll);
                        } else {
                            // Liberar scroll después de un delay para evitar acumulación
                            scrollTimeout = setTimeout(() => {
                                isScrolling = false;
                            }, 100);
                        }
                    };
                    
                    requestAnimationFrame(ultraSmoothScroll);
                } else {
                    isScrolling = false;
                }
            };
            
            container.addEventListener('wheel', handleWheel, { passive: false });
            
            return () => {
                container.removeEventListener('wheel', handleWheel);
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
            };
        }
    }, [items]);

    // Detectar si estamos en mobile
    const isMobile = window.innerWidth < 1024;
    
    // Simplificar la lógica: siempre mostrar en desktop, en mobile solo si visible es true
    const shouldShowMenu = isMobile ? visible : true;
    // Mostrar solo tags en mobile si existen Y visible es true
    const showOnlyTagsMobile = tags.length > 0 && isMobile && visible;

    console.log("items", items)
    console.log("data", data)
    console.log("tags", tags)
    console.log("isMobile", isMobile)
    console.log("shouldShowMenu", shouldShowMenu)

    // Si no debe mostrar el menú, retornar null (oculto)
    if (!shouldShowMenu) {
        return null;
    }

    return (
        <nav
            className={
                `${
                showOnlyTagsMobile
                        ? " block w-full relative md:block bg-secondary font-paragraph text-sm"
                        : " relative w-full md:block bg-secondary font-paragraph text-sm"
                }`
            }
            ref={menuRef}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4 lg:gap-6 text-sm w-full overflow-hidden">
                    {/* Mostrar solo tags en mobile si corresponde */}
                    {showOnlyTagsMobile ? (
                        <div className="w-full py-3 px-4">
                            {/* Carrusel de tags para mobile */}
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-3 h-10">
                                    {tags.slice(currentTagIndex, currentTagIndex + 2).map((tag, index) => {
                                        const actualIndex = currentTagIndex + index;
                                        return (
                                            <a
                                                key={`${tag.id}-${actualIndex}`}
                                                href={`/catalogo?tag=${tag.id}`}
                                                className="group relative border-white border-2 overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                                style={{
                                                    background: `linear-gradient(135deg, ${tag.background_color || '#3b82f6'}, ${tag.background_color || '#3b82f6'}dd)`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                                <div className="relative h-full flex items-center justify-center p-3">
                                                    <div className="flex items-center gap-2 text-center">
                                                        {tag.icon ? (
                                                            <img 
                                                                src={`/storage/images/tag/${tag.icon}`} 
                                                                alt={tag.name} 
                                                                className="w-6 h-6 object-contain filter brightness-0 invert"
                                                                onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                                            />
                                                        ) : (
                                                            <Tag size={20} style={{ color: tag.text_color || '#ffffff' }} />
                                                        )}
                                                        <span 
                                                            className="text-xs font-semibold leading-tight"
                                                            style={{ color: tag.text_color || '#ffffff' }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                            </a>
                                        );
                                    })}
                                    
                                    {/* Rellenar espacios vacíos si hay menos de 2 tags */}
                                    {tags.slice(currentTagIndex, currentTagIndex + 2).length < 2 && (
                                        <div className="rounded-2xl bg-white/10 flex items-center justify-center">
                                            <div className="text-white/50 text-xs">Más próximamente</div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Indicadores de posición */}
                                {tags.length > 2 && (
                                    <div className="flex justify-center mt-2 gap-1">
                                        {Array.from({ length: Math.ceil(tags.length / 2) }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentTagIndex(i * 2)}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    Math.floor(currentTagIndex / 2) === i 
                                                        ? 'bg-primary shadow-lg' 
                                                        : 'bg-neutral-light hover:bg-white/60'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Título y Lista de categorías con scroll horizontal mejorado */}
                            <div className="flex items-center gap-4 w-full overflow-hidden">
                                {/* Título fijo */}
                                <div className="flex-shrink-0">
                                    <span className="font-semibold customtext-neutral-dark">Categorías:</span>
                                </div>
                                
                                {/* Mostrar categorías si existen, sino mostrar mensaje */}
                                {items && items.length > 0 ? (
                                    /* Contenedor moderno y limpio */
                                    <div className="relative flex-1 overflow-hidden">
                                        {/* Gradientes sutiles mejorados para indicar scroll disponible */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-8 enhanced-gradient-left z-10 pointer-events-none transition-all duration-700 ${canScrollLeft ? 'opacity-80' : 'opacity-0'}`}></div>
                                        <div className={`absolute right-0 top-0 bottom-0 w-8 enhanced-gradient-right z-10 pointer-events-none transition-all duration-700 ${canScrollRight ? 'opacity-80' : 'opacity-0'}`}></div>
                                        
                                        {/* Contenedor scrolleable invisible */}
                                        <div 
                                            ref={scrollRef}
                                            className="overflow-x-auto scrollbar-invisible"
                                            onScroll={(e) => {
                                                updateScrollButtons(e.target);
                                            }}
                                        >
                                            <div className="flex items-center gap-8 text-sm py-4 px-4 w-max min-w-full">
                                                {[...items].sort((a, b) => a.name.localeCompare(b.name)).map((category, index, arr) => (
                                                    <div key={index} className="flex-shrink-0 relative group/item category-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                                        <a
                                                            href={`/catalogo?category=${category.slug}`}
                                                            className="relative font-medium text-gray-700 hover:text-primary transition-all duration-500 cursor-pointer px-4 py-2.5 rounded-lg hover:bg-white/80 hover:shadow-lg whitespace-nowrap transform hover:scale-110 hover:-translate-y-1 category-hover-effect"
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
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Indicador de progreso mejorado */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200/10 via-gray-200/20 to-gray-200/10 overflow-hidden rounded-full">
                                            <div 
                                                className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 transition-all duration-700 ease-out rounded-full progress-bar"
                                                style={{
                                                    width: `${scrollProgress}%`,
                                                    boxShadow: scrollProgress > 0 ? '0 0 15px rgba(99, 102, 241, 0.4), 0 0 30px rgba(99, 102, 241, 0.2)' : 'none'
                                                }}
                                            ></div>
                                        </div>
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
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MenuCategories;
