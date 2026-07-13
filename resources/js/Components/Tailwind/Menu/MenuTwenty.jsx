import { ChevronDown, ArrowRight, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";

// MenuTwenty: clon de MenuMicjc con estilo Twenty hardcodeado
// bg-primary, text-white, sin bordes redondeados, overlay oscuro
const MenuTwenty = ({ pages = [], items = [], data, visible = false }) => {
    // Twenty: siempre dark, siempre sin rounded
    const isDark = true;
    const roundedNull = true;

    const gridColsMap = {
        '3': 'md:grid-cols-3',
        '4': 'md:grid-cols-4',
        '5': 'md:grid-cols-5',
        '6': 'md:grid-cols-6'
    };
    const colsClass = gridColsMap[data?.grid_cols_desktop] || 'md:grid-cols-5';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (items && items.length > 0) {
            const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
            if (!activeCategory || !sorted.find(x => x.slug === activeCategory.slug)) setActiveCategory(sorted[0]);
        }
    }, [items]);

    const [overlayTop, setOverlayTop] = useState(0);

    useEffect(() => {
        if (isMenuOpen) {
            if (menuRef.current) setOverlayTop(menuRef.current.getBoundingClientRect().bottom);
            // Bloquear scroll del body manteniendo el scrollbar visible (sin layout shift)
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
            return () => {
                document.documentElement.style.overflow = '';
                document.documentElement.style.paddingRight = '';
            };
        }
    }, [isMenuOpen]);

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

    useEffect(() => {
        if (tags.length > 2 && window.innerWidth < 1024) {
            const interval = setInterval(() => {
                setCurrentTagIndex(prev => { const next = prev + 2; return next >= tags.length ? 0 : next; });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tags.length]);

    const isMobile = window.innerWidth < 1024;
    const shouldShowMenu = isMobile ? (visible && tags.length > 0) : true;
    const showOnlyTagsMobile = tags.length > 0 && isMobile && visible;

    if (!shouldShowMenu) return null;

    const sortedCategories = items ? [...items].sort((a, b) => a.name.localeCompare(b.name)) : [];

    return (
        <>
            {/* Overlay oscuro */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
                    style={{ top: `${overlayTop}px` }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <nav
                id={data?.element_id || null}
                className="w-full relative border-b border-white/10 z-50 font-paragraph text-white bg-primary"
                style={data?.backgroundColor ? { backgroundColor: data.backgroundColor } : {}}
                ref={menuRef}
            >
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                    {showOnlyTagsMobile ? (
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
                                                className="group relative overflow-hidden border border-white/20 shadow-sm transition-all duration-300 active:scale-[0.98] rounded-none"
                                                style={{ background: `linear-gradient(135deg, ${tag.background_color || '#3b82f6'}, ${tag.background_color || '#3b82f6'}dd)` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent"></div>
                                                <div className="relative h-full flex items-center justify-center px-4">
                                                    <div className="flex items-center gap-2 text-center justify-center">
                                                        {tag.icon ? (
                                                            <img src={`/storage/images/tag/${tag.icon}`} alt={tag.name} className="w-5 h-5 object-contain filter brightness-0 invert" onError={(e) => e.target.src = "/api/cover/thumbnail/null"} />
                                                        ) : (
                                                            <Tag size={16} style={{ color: tag.text_color || '#ffffff' }} />
                                                        )}
                                                        <span className="text-xs font-bold truncate max-w-[120px]" style={{ color: tag.text_color || '#ffffff' }}>{tag.name}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                                {tags.length > 2 && (
                                    <div className="flex justify-center mt-2.5 gap-1.5">
                                        {Array.from({ length: Math.ceil(tags.length / 2) }).map((_, i) => (
                                            <button key={i} onClick={() => setCurrentTagIndex(i * 2)} className={`w-1.5 h-1.5 rounded-none transition-all duration-300 ${Math.floor(currentTagIndex / 2) === i ? 'bg-white w-3' : 'bg-white/40'}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between h-auto">
                            <div className="flex items-center gap-8">
                                {data?.showCategories !== false && (
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className={`flex items-center gap-2.5 px-5 py-2.5 font-semibold text-sm tracking-wider uppercase transition-all duration-300  rounded-none ${isMenuOpen
                                            ? "bg-secondary text-primary "
                                            : "text-white border-transparent hover:bg-white/10"
                                            }`}
                                    >
                                        <span>Categorías</span>
                                        <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                                    </button>
                                )}

                                <ul className="flex items-center gap-1">
                                    {pages.filter(page => page.menuable).map((page) => (
                                        <li key={page.path}>
                                            <a href={page.path} className="relative block px-3.5 py-2 font-semibold text-sm tracking-wider transition-all duration-200 rounded-none text-white hover:text-white hover:bg-white/10">
                                                {page.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {tags.length > 0 && (
                                <ul className="flex items-center gap-2">
                                    {tags.map((tag) => (
                                        <li key={tag.id}>
                                            <a
                                                href={`/catalogo?tag=${tag.id}`}
                                                className="group flex items-center gap-1.5 px-3 py-1.5 font-bold text-xs transition-all duration-300 border hover:-translate-y-0.5 hover:shadow-sm rounded-none"
                                                style={{
                                                    backgroundColor: `${tag.background_color || '#3b82f6'}20`,
                                                    color: tag.text_color || '#ffffff',
                                                    borderColor: `${tag.background_color || '#3b82f6'}50`,
                                                }}
                                                title={tag.description || tag.name}
                                                aria-label={`Ir a ${tag.name}`}
                                            >
                                                {tag.icon ? (
                                                    <img src={`/storage/images/tag/${tag.icon}`} alt={tag.name} className="w-3.5 h-3.5 object-contain filter brightness-0 invert" onError={(e) => (e.target.src = "/api/cover/thumbnail/null")} />
                                                ) : <Tag size={12} />}
                                                <span>{tag.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Mega Menú Dropdown */}
                {isMenuOpen && !isMobile && (
                    <div className="absolute left-0 right-0 top-[100%] w-full border-b border-primary/20 shadow-[0_25px_50px_rgba(0,0,0,0.15)] z-50 animate-in fade-in slide-in-from-top-1 duration-200 bg-secondary text-primary">
                        <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto flex h-[70dvh] overflow-hidden">
                            {/* Panel Izquierdo */}
                            <div className="w-1/4 border-r border-primary/10 p-5 space-y-2.5 overflow-y-auto ">
                                {sortedCategories.map((category) => {
                                    const isActive = activeCategory?.slug === category.slug;
                                    return (
                                        <button
                                            key={category.slug}
                                            onMouseEnter={() => setActiveCategory(category)}
                                            onClick={() => setActiveCategory(category)}
                                            className={`w-full relative px-4 py-4 transition-all duration-100 flex items-center justify-between font-bold text-sm group rounded-none ${isActive
                                                ? "bg-primary text-white pl-5 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3.5px] before:bg-white before:rounded-r-md"
                                                : "bg-transparent text-primary/80 hover:bg-primary/10 hover:text-primary hover:pl-5 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3.5px] before:bg-transparent hover:before:bg-primary/30 before:rounded-r-md"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0 transition-transform duration-100">
                                                {category.image && (
                                                    <img src={`/storage/images/category/${category.image}`} alt={category.name} className={`w-7 h-7 object-contain shrink-0 transition-all duration-100 ${isActive ? 'filter brightness-0 invert' : 'filter brightness-0'}`} onError={(e) => (e.target.src = "/api/cover/thumbnail/null")} />
                                                )}
                                                <span className="truncate">{category.name}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Panel Derecho */}
                            <div className="w-3/4 p-6 overflow-y-auto flex flex-col justify-between bg-secondary">
                                <div>
                                    <div className="flex items-center justify-between border-b border-primary/10 pb-3 mb-5">
                                        <h3 className="font-paragraph font-extrabold text-xl tracking-wider uppercase text-primary">{activeCategory?.name}</h3>
                                        <a
                                            href={`/catalogo?category=${activeCategory?.slug}`}
                                            className="group text-sm font-paragraph font-bold text-white bg-primary hover:bg-primary/90 flex items-center gap-1.5 px-4 py-3 transition-all duration-200 rounded-none"
                                        >
                                            <span>Ver todos los productos</span>
                                            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </a>
                                    </div>

                                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${colsClass} gap-5`}>
                                        {activeCategory?.subcategories && activeCategory.subcategories.length > 0 ? (
                                            activeCategory.subcategories.map((sub) => (
                                                <a
                                                    key={sub.slug}
                                                    href={`/catalogo?subcategory=${sub.slug}`}
                                                    className="group flex flex-col p-2.5 border border-primary/10 bg-white hover:bg-primary/5 hover:-translate-y-1 transition-all duration-300 ease-out rounded-none text-primary"
                                                >
                                                    <div className="w-full aspect-square overflow-hidden relative shrink-0 rounded-none">
                                                        {sub.image ? (
                                                            <img src={`/storage/images/sub_category/${sub.image}`} alt={sub.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => (e.target.src = "/api/cover/thumbnail/null")} />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-primary/20"><Tag size={20} /></div>
                                                        )}
                                                    </div>
                                                    <div className="px-1 text-center pb-1">
                                                        <span className="font-paragraph font-bold text-[13px] transition-colors duration-200 block text-primary/80 group-hover:text-primary">{sub.name}</span>
                                                    </div>
                                                </a>
                                            ))
                                        ) : (
                                            <div className="col-span-3 py-16 text-center font-medium text-sm text-primary/40">
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

export default MenuTwenty;
