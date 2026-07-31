import React, { useState, useEffect, useRef } from "react";
import Global from "../../../Utils/Global";
import { Menu, X, ChevronRight, ChevronDown, ArrowRight, Shield, Tag } from "lucide-react";

const HeaderNgs = ({ data, items = [], pages = [], generals = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
    const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
    const headerRef = useRef(null);

    // Scroll sticky effect
    useEffect(() => {
        const handleScroll = () => {
            setIsFixed(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mega menu on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setIsMegaMenuOpen(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    // Active category initialization
    const sortedCategories = items && items.length > 0
        ? [...items].sort((a, b) => a.name.localeCompare(b.name))
        : [];

    useEffect(() => {
        if (sortedCategories.length > 0 && !activeCategory) {
            setActiveCategory(sortedCategories[0]);
        }
    }, [sortedCategories]);

    return (
        <header
            ref={headerRef}
            id={data?.element_id || null}
            className={`bg-white sticky top-0 z-50 border-b border-sections-color transition-all duration-300 ${isFixed ? "shadow-md py-2" : "py-2"
                } ${data?.class || ""}`}
        >
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/" className="flex items-center gap-3">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className="h-14 object-contain object-left w-auto"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                        </a>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-7">
                        {/* Nav Item: Productos / Catálogo Mega Menu */}
                        {sortedCategories.length > 0 && (
                            <div className="relative font-title">
                                <button
                                    onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                                    className={`inline-flex items-center  gap-1.5 text-base font-medium uppercase py-1 transition-colors relative ${isMegaMenuOpen
                                        ? "text-primary font-bold"
                                        : "text-neutral-dark hover:text-primary"
                                        }`}
                                >
                                    <span className="font-title">Productos</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180 text-primary" : ""
                                            }`}
                                    />
                                    {isMegaMenuOpen && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Standard Pages */}
                        {pages
                            ?.filter((x) => x.menuable && (x.pseudo_path || x.path) !== "/catalogo")
                            ?.map((page, index) => {
                                const path = page.pseudo_path || page.path;
                                const isActive =
                                    window.location.pathname === path ||
                                    (window.location.pathname === "/" && path === "/");
                                return (
                                    <a
                                        key={index}
                                        href={path}
                                        className={`text-base font-title font-medium transition-colors uppercase relative py-1 ${isActive
                                            ? "text-primary font-bold"
                                            : "text-neutral-dark hover:text-primary"
                                            }`}
                                    >
                                        {page.name}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                                        )}
                                    </a>
                                );
                            })}

                        {/* Contact CTA Button */}
                        <div className="ml-6 pl-6 border-l border-slate-200">
                            <a href="/contacto">
                                <button className="inline-flex items-center justify-center font-display font-medium transition-all duration-300 focus-visible:outline-none uppercase text-base h-11 px-7 rounded-full bg-accent text-white hover:bg-primary shadow-sm hover:shadow-md">
                                    Contáctanos
                                </button>
                            </a>
                        </div>
                    </nav>

                    {/* Mobile button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-800 hover:text-primary p-2 focus:outline-none rounded-lg"
                            aria-label="Menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mega Menu Dropdown */}
            {isMegaMenuOpen && sortedCategories.length > 0 && (
                <div className="absolute left-0 right-0 top-[100%] w-full bg-gradient-to-r from-sections-color to-white border-t border-b border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl flex h-[65dvh]">
                        {/* Panel Izquierdo: Categorías */}
                        <div className="w-1/4 border-r border-slate-100 bg-sections-color p-4 space-y-2 overflow-y-auto">
                            <p className="text-xs font-bold uppercase  text-neutral-dark px-3 py-1 mb-2">
                                Categorías
                            </p>
                            {sortedCategories.map((category) => {
                                const isActive = activeCategory?.slug === category.slug;
                                return (
                                    <button
                                        key={category.slug}
                                        onMouseEnter={() => setActiveCategory(category)}
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full text-left px-5 py-3.5 rounded-full transition-all duration-300 flex items-center justify-between font-semibold text-sm group ${isActive
                                            ? "bg-primary text-white shadow-md font-bold translate-x-1"
                                            : "text-neutral-dark hover:bg-slate-100 hover:text-primary"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            {category.image ? (
                                                <img
                                                    src={`/storage/images/category/${category.image}`}
                                                    alt={category.name}
                                                    className="w-6 h-6 object-contain shrink-0 rounded-full"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/assets/img/no-image.png";
                                                    }}
                                                />
                                            ) : (
                                                <Shield className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "opacity-70"}`} />
                                            )}
                                            <span className="truncate">{category.name}</span>
                                        </div>
                                        <ChevronRight
                                            className={`h-4 w-4 shrink-0 transition-transform ${isActive
                                                ? "text-white translate-x-1 font-bold opacity-100"
                                                : "opacity-0 group-hover:opacity-100 text-neutral-light"
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Panel Derecho: Subcategorías */}
                        <div className="w-3/4 p-6 overflow-y-auto bg-white flex flex-col justify-between">
                            <div>
                                {/* Header del Panel Derecho */}
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                    <div>
                                        <h3 className="font-bold text-xl text-primary">
                                            {activeCategory?.name}
                                        </h3>
                                    </div>
                                    <a
                                        href={`/catalogo?category=${activeCategory?.slug}`}
                                        onClick={() => setIsMegaMenuOpen(false)}
                                        className="group inline-flex items-center gap-2 text-xs font-semibold uppercase  text-white bg-primary px-6 py-4 rounded-full transition-all duration-300 shadow-sm hover:scale-105"
                                    >
                                        <span>Ver catálogo</span>
                                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>

                                {/* Grid de Subcategorías o Estado Ilustrado sin texto adicional */}
                                {activeCategory?.subcategories && activeCategory.subcategories.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {activeCategory.subcategories.map((sub) => (
                                            <a
                                                key={sub.slug}
                                                href={`/catalogo?subcategory=${sub.slug}`}
                                                onClick={() => setIsMegaMenuOpen(false)}
                                                className="group flex flex-col p-2 rounded-3xl border border-slate-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-white"
                                            >
                                                {/* Imagen de la Subcategoría */}
                                                <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-2.5 flex items-center justify-center p-2 group-hover:bg-slate-100 transition-colors">
                                                    {sub.image ? (
                                                        <img
                                                            src={`/storage/images/sub_category/${sub.image}`}
                                                            alt={sub.name}
                                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "/assets/img/no-image.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <Tag className="h-8 w-8 text-slate-300 group-hover:text-primary transition-colors" />
                                                    )}
                                                </div>

                                                {/* Nombre */}
                                                <span className="font-semibold text-sm text-neutral-dark group-hover:text-primary text-center line-clamp-2 transition-colors">
                                                    {sub.name}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    /* Ilustración Vectorial 3D Isométrica de Caja + Título Oops en 2 líneas */
                                    <div className="py-6 px-4 flex flex-col items-center justify-center text-center my-auto">
                                        <div className="relative mb-4 flex items-center justify-center">
                                            <svg
                                                className="w-80 h-52 text-primary drop-shadow-lg transition-transform duration-300 hover:scale-105"
                                                viewBox="0 0 300 200"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                {/* Soft background blob */}
                                                <path
                                                    d="M40 100C20 40 80 15 160 20C240 25 285 65 280 125C275 185 210 195 140 190C60 185 45 150 40 100Z"
                                                    fill="#1D4E5B"
                                                    fillOpacity="0.06"
                                                />

                                                {/* Sunburst Rays */}
                                                <g stroke="#1D4E5B" strokeWidth="3" strokeLinecap="round">
                                                    <line x1="140" y1="12" x2="140" y2="28" />
                                                    <line x1="90" y1="22" x2="104" y2="36" />
                                                    <line x1="190" y1="22" x2="176" y2="36" />
                                                </g>

                                                {/* Dotted curve trail */}
                                                <path
                                                    d="M40 50C30 75 60 95 145 95"
                                                    stroke="#1D4E5B"
                                                    strokeWidth="3"
                                                    strokeDasharray="5 5"
                                                    strokeLinecap="round"
                                                />

                                                {/* Paper Plane / Rocket */}
                                                <g transform="translate(42, 32) rotate(-22) scale(1)">
                                                    <path d="M0 14L26 0L16 26L11 15L0 14Z" fill="#1D4E5B" />
                                                    <path d="M26 0L11 15V22L15 17" fill="#1D4E5B" opacity="0.6" />
                                                </g>

                                                {/* ISOMETRIC 3D OPEN CARDBOARD BOX */}
                                                <g stroke="#1D4E5B" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
                                                    {/* Inner Box Back Interior (Dark Shadow inside box) */}
                                                    <polygon points="45,95 145,95 220,95 120,95" fill="#CBD5E1" opacity="0.4" />

                                                    {/* Left Open Top Flap */}
                                                    <polygon points="10,75 80,75 120,95 45,95" fill="#E2E8F0" />

                                                    {/* Right Open Top Flap */}
                                                    <polygon points="255,75 185,75 145,95 220,95" fill="#D1D5DB" />

                                                    {/* Box Front Left Face */}
                                                    <polygon points="45,95 120,95 120,165 45,165" fill="#FFFFFF" />

                                                    {/* Box Front Right Face */}
                                                    <polygon points="120,95 220,95 220,165 120,165" fill="#F8FAFC" />

                                                    {/* Box Center Vertical Seam */}
                                                    <line x1="120" y1="95" x2="120" y2="165" stroke="#1D4E5B" strokeWidth="3.5" />

                                                    {/* Shipping Label on Front Left Panel */}
                                                    <rect x="58" y="112" width="42" height="38" fill="#FFFFFF" rx="4" stroke="#1D4E5B" strokeWidth="2.5" />
                                                    <line x1="66" y1="122" x2="90" y2="122" stroke="#1D4E5B" strokeWidth="3" strokeLinecap="round" />
                                                    <line x1="66" y1="130" x2="90" y2="130" stroke="#1D4E5B" strokeWidth="3" strokeLinecap="round" />
                                                    <line x1="66" y1="138" x2="84" y2="138" stroke="#1D4E5B" strokeWidth="3" strokeLinecap="round" />
                                                </g>

                                                {/* MAGNIFYING GLASS OVERLAY */}
                                                <g>
                                                    {/* Handle */}
                                                    <rect
                                                        x="215"
                                                        y="145"
                                                        width="20"
                                                        height="52"
                                                        rx="10"
                                                        transform="rotate(-40 215 145)"
                                                        fill="#1D4E5B"
                                                        stroke="#FFFFFF"
                                                        strokeWidth="2.5"
                                                    />

                                                    {/* Lens Outer Ring */}
                                                    <circle cx="180" cy="112" r="46" fill="#FFFFFF" stroke="#1D4E5B" strokeWidth="7" />
                                                    <circle cx="180" cy="112" r="39" fill="#1D4E5B" fillOpacity="0.06" />

                                                    {/* Bold 'X' Cross */}
                                                    <path
                                                        d="M163 95L197 129M197 95L163 129"
                                                        stroke="#1D4E5B"
                                                        strokeWidth="9"
                                                        strokeLinecap="round"
                                                    />
                                                </g>
                                            </svg>
                                        </div>

                                        <h4 className="text-6xl font-extrabold text-primary font-display  mb-1">
                                            ¡Oops!
                                        </h4>
                                        <p className="text-lg text-neutral-light font-paragraph">
                                            No se han encontrado registros
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Nav Drawer */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg left-0 right-0 z-50 max-h-[85vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-2">
                        {/* Productos Accordion en Mobile */}
                        {sortedCategories.length > 0 && (
                            <div className="border-b border-slate-100 pb-2">
                                <button
                                    onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold text-primary uppercase"
                                >
                                    <span>Productos / Categorías</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${mobileProductsOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {mobileProductsOpen && (
                                    <div className="pl-3 pr-2 space-y-1 py-1">
                                        {sortedCategories.map((cat) => (
                                            <div key={cat.slug} className="border-l-2 border-slate-100 pl-3 py-1">
                                                <button
                                                    onClick={() =>
                                                        setMobileExpandedCat(
                                                            mobileExpandedCat === cat.slug ? null : cat.slug
                                                        )
                                                    }
                                                    className="flex items-center justify-between w-full text-xs font-semibold text-neutral-dark py-1"
                                                >
                                                    <span>{cat.name}</span>
                                                    {cat.subcategories?.length > 0 && (
                                                        <ChevronDown
                                                            className={`h-3.5 w-3.5 text-neutral-light transition-transform ${mobileExpandedCat === cat.slug ? "rotate-180" : ""
                                                                }`}
                                                        />
                                                    )}
                                                </button>
                                                {mobileExpandedCat === cat.slug && cat.subcategories?.length > 0 && (
                                                    <div className="pl-3 space-y-1 py-1">
                                                        {cat.subcategories.map((sub) => (
                                                            <a
                                                                key={sub.slug}
                                                                href={`/catalogo?subcategory=${sub.slug}`}
                                                                onClick={() => setIsOpen(false)}
                                                                className="block text-xs text-neutral-light hover:text-primary py-1"
                                                            >
                                                                {sub.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Standard Pages */}
                        {pages
                            ?.filter((x) => x.menuable && (x.pseudo_path || x.path) !== "/catalogo")
                            ?.map((page, index) => {
                                const path = page.pseudo_path || page.path;
                                const isActive = window.location.pathname === path;
                                return (
                                    <a
                                        key={index}
                                        href={path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 text-sm font-medium transition-colors rounded-xl ${isActive
                                            ? "text-primary bg-primary/10 font-bold"
                                            : "text-neutral-dark hover:bg-slate-50"
                                            }`}
                                    >
                                        {page.name}
                                    </a>
                                );
                            })}
                        <div className="pt-3 mt-3 border-t border-slate-100">
                            <a href="/contacto" onClick={() => setIsOpen(false)}>
                                <button className="w-full inline-flex items-center justify-center font-display font-medium transition-all duration-300 uppercase text-xs h-11 px-6 rounded-full bg-primary text-white hover:bg-accent shadow-sm">
                                    Contáctanos
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default HeaderNgs;
