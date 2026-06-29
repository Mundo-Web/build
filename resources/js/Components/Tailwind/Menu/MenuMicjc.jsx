import { ChevronDown, ChevronRight, ArrowRight, Grid, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";

const MenuMicjc = ({ pages = [], items = [], data, visible = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);
    const menuRef = useRef(null);

    // Cerrar al hacer click afuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    // Inicializar y sincronizar categoría activa
    useEffect(() => {
        if (items && items.length > 0) {
            const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
            if (!activeCategory || !sorted.find(x => x.slug === activeCategory.slug)) {
                setActiveCategory(sorted[0]);
            }
        }
    }, [items]);

    // Prevenir scroll del body cuando el modal está abierto en desktop
    useEffect(() => {
        if (isMenuOpen && window.innerWidth >= 1024) {
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }

            return () => {
                document.documentElement.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isMenuOpen]);

    // Obtener tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await tagsItemsRest.getTags();
                if (response?.data) {
                    const activeTags = response.data.filter(tag =>
                        tag.promotional_status === 'permanent' || tag.promotional_status === 'active' && tag.menu === "1" || tag.menu === 1
                    ).sort((a, b) => {
                        if (a.promotional_status === 'active' && b.promotional_status !== 'active') return -1;
                        if (b.promotional_status === 'active' && a.promotional_status !== 'active') return 1;
                        return a.name.localeCompare(b.name);
                    });
                    setTags(activeTags);
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    // Auto-avanzar carrusel móvil
    useEffect(() => {
        if (tags.length > 2 && window.innerWidth < 1024) {
            const interval = setInterval(() => {
                setCurrentTagIndex(prev => {
                    const nextIndex = prev + 2;
                    return nextIndex >= tags.length ? 0 : nextIndex;
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tags.length]);

    const isMobile = window.innerWidth < 1024;
    const shouldShowMenu = isMobile ? (visible && tags.length > 0) : true;
    const showOnlyTagsMobile = tags.length > 0 && isMobile && visible;

    if (!shouldShowMenu) {
        return null;
    }

    const sortedCategories = items ? [...items].sort((a, b) => a.name.localeCompare(b.name)) : [];

    return (
        <>
            {/* Overlay de fondo */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                    style={{ top: menuRef.current ? menuRef.current.offsetTop + menuRef.current.offsetHeight : '0' }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <nav
                id={data?.element_id || null}
                className="w-full relative bg-white border-b border-neutral-100 z-50 font-paragraph text-sm"
                ref={menuRef}
            >
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                    {showOnlyTagsMobile ? (
                        /* Vista de tags para móviles */
                        <div className="w-full py-3">
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-3 h-10">
                                    {tags.slice(currentTagIndex, currentTagIndex + 2).map((tag, index) => {
                                        const actualIndex = currentTagIndex + index;
                                        return (
                                            <a
                                                key={`${tag.id}-${actualIndex}`}
                                                href={`/catalogo?tag=${tag.id}`}
                                                title={tag.description || tag.name}
                                                aria-label={`Ir a ${tag.name}`}
                                                className="group relative overflow-hidden rounded-full border border-white/20 shadow-sm transition-all duration-300 active:scale-[0.98]"
                                                style={{
                                                    background: `linear-gradient(135deg, ${tag.background_color || '#3b82f6'}, ${tag.background_color || '#3b82f6'}dd)`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
                                                <div className="relative h-full flex items-center justify-center px-4">
                                                    <div className="flex items-center gap-2 text-center justify-center">
                                                        {tag.icon ? (
                                                            <img
                                                                src={`/storage/images/tag/${tag.icon}`}
                                                                alt={tag.name}
                                                                className="w-5 h-5 object-contain filter brightness-0 invert"
                                                                onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                                            />
                                                        ) : (
                                                            <Tag size={16} style={{ color: tag.text_color || '#ffffff' }} />
                                                        )}
                                                        <span
                                                            className="text-xs font-bold truncate max-w-[120px]"
                                                            style={{ color: tag.text_color || '#ffffff' }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>

                                {tags.length > 2 && (
                                    <div className="flex justify-center mt-2.5 gap-1.5">
                                        {Array.from({ length: Math.ceil(tags.length / 2) }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentTagIndex(i * 2)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${Math.floor(currentTagIndex / 2) === i
                                                    ? 'bg-primary w-3'
                                                    : 'bg-neutral-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Vista Desktop Completa */
                        <div className="flex items-center justify-between h-auto">
                            <div className="flex items-center gap-8">
                                {/* Botón Categorías (Estilo aliexpress - morado sólido al abrir) */}
                                {data?.showCategories && (
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all duration-300 border ${isMenuOpen
                                            ? "bg-primary text-white border-primary shadow-sm"
                                            : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 border-transparent"
                                            }`}
                                    >

                                        <span>Categorías</span>
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                )}

                                {/* Páginas del menú */}
                                <ul className="flex items-center gap-1">
                                    {pages
                                        .filter(page => page.menuable)
                                        .map((page) => (
                                            <li key={page.path}>
                                                <a
                                                    href={page.path}
                                                    className="relative px-3.5 py-2 rounded-lg font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50/50 transition-all duration-200"
                                                >
                                                    {page.name}
                                                </a>
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            {/* Botones de Tags */}
                            {tags.length > 0 && (
                                <ul className="flex items-center gap-2">
                                    {tags.map((tag) => (
                                        <li key={tag.id}>
                                            <a
                                                href={`/catalogo?tag=${tag.id}`}
                                                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs transition-all duration-300 border hover:-translate-y-0.5 hover:shadow-sm"
                                                style={{
                                                    backgroundColor: `${tag.background_color || '#3b82f6'}10`,
                                                    color: tag.text_color || '#3b82f6',
                                                    borderColor: `${tag.background_color || '#3b82f6'}30`,
                                                }}
                                                title={tag.description || tag.name}
                                                aria-label={`Ir a ${tag.name}`}
                                            >
                                                {tag.icon ? (
                                                    <img
                                                        src={`/storage/images/tag/${tag.icon}`}
                                                        alt={tag.name}
                                                        className="w-3.5 h-3.5 object-contain"
                                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                    />
                                                ) : (
                                                    <Tag size={12} />
                                                )}
                                                <span>{tag.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Dropdown del Mega Menú (Anclado al ancho total de pantalla con contenido centrado en max-width) */}
                {isMenuOpen && !isMobile && (
                    <div className="absolute left-0 right-0 top-[100%] w-full bg-white border-b border-neutral-150 shadow-[0_25px_50px_rgba(0,0,0,0.06)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto flex h-[70dvh]">
                            {/* Panel Izquierdo: Categorías (Estilo AliExpress - Tarjetas separadas en columna) */}
                            <div className="w-1/4 border-r border-neutral-100 bg-neutral-50/10 p-5 space-y-2.5 overflow-y-auto">
                                {sortedCategories.map((category) => {
                                    const isActive = activeCategory?.slug === category.slug;
                                    return (
                                        <button
                                            key={category.slug}
                                            onMouseEnter={() => setActiveCategory(category)}
                                            onClick={() => setActiveCategory(category)}
                                            className={`w-full relative px-4 py-4 rounded-xl transition-all duration-100 flex items-center justify-between font-bold text-sm  group ${isActive
                                                ? "bg-white text-primary pl-5  before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3.5px] before:bg-primary before:rounded-r-md"
                                                : "bg-white text-neutral-600  hover:bg-neutral-50/50 hover:text-neutral-900 hover:border-neutral-200 hover:pl-5 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3.5px] before:bg-transparent hover:before:bg-primary/25 before:rounded-r-md"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 transition-transform duration-100">
                                                {/* Imagen de la Categoría */}
                                                {category.image && (
                                                    <img
                                                        src={`/storage/images/category/${category.image}`}
                                                        alt={category.name}
                                                        className="w-7 h-7 object-contain   shrink-0 transition-all duration-100"
                                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                    />
                                                )}

                                                <span className="truncate">{category.name}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Panel Derecho: Subcategorías (Estilo AliExpress - Cards con imagen arriba y texto abajo) */}
                            <div className="w-3/4 p-6 overflow-y-auto bg-white flex flex-col justify-between">
                                <div>
                                    {/* Header del Mega Menú */}
                                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
                                        <h3 className="font-extrabold text-xl text-neutral-900">{activeCategory?.name}</h3>
                                        <a
                                            href={`/catalogo?category=${activeCategory?.slug}`}
                                            className="group text-sm text-white font-medium hover:underline flex items-center gap-1.5 px-4 py-3 bg-primary rounded-full transition-all duration-200"
                                        >
                                            <span>Ver todos los productos</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>

                                    {/* Grid de Subcategorías (Cards de Diseño Limpio y Serio) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
                                        {activeCategory?.subcategories && activeCategory.subcategories.length > 0 ? (
                                            activeCategory.subcategories.map((sub) => (
                                                <a
                                                    key={sub.slug}
                                                    href={`/catalogo?subcategory=${sub.slug}`}
                                                    className="group flex flex-col p-2.5  bg-white hover:border-primary/20  hover:-translate-y-1 transition-all duration-300 ease-out"
                                                >
                                                    {/* Contenedor de la Imagen */}
                                                    <div className="w-full aspect-square  overflow-hidden  relative shrink-0">
                                                        {sub.image ? (
                                                            <img
                                                                src={`/storage/images/sub_category/${sub.image}`}
                                                                alt={sub.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                                <Tag size={20} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Texto de la Subcategoría */}
                                                    <div className="px-1 text-center pb-1">
                                                        <span className="font-bold text-[13px] text-neutral-800 group-hover:text-primary transition-colors duration-200 block">
                                                            {sub.name}
                                                        </span>
                                                    </div>
                                                </a>
                                            ))
                                        ) : (
                                            <div className="col-span-3 py-16 text-center text-neutral-400 font-medium text-sm">
                                                No hay subcategorías registradas en esta sección.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default MenuMicjc;
