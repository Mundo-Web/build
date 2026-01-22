import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Menu } from 'lucide-react';
import Global from '../../../Utils/Global';

const HeaderWebQuirurgica2 = ({ data, items, pages, generals = [], isUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const [isServicesExpanded, setIsServicesExpanded] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const menuRef = useRef(null);
    const dropdownRef = useRef(null);

    // Detectar si estamos en la página de inicio
    useEffect(() => {
        const checkIfHomePage = () => {
            const path = window.location.pathname;
            return path === '/' || path === '/home' || path === '/inicio';
        };
        setIsHomePage(checkIfHomePage());
    }, []);

    // Función modificada para agrupar servicios
    const getOrderedMenuItems = () => {
        // Agrupamos todas las categorías en un solo ítem "services_root"
        const servicesItem = items && items.length > 0 ? { type: 'services_root', data: items } : null;

        // Páginas ordenadas
        const menuPages = (pages || []).filter(page => page.menuable).map(page => ({ type: 'page', data: page }));

        // Retornamos Servicios primero, luego las páginas
        const menu = [];
        if (servicesItem) menu.push(servicesItem);
        menu.push(...menuPages);

        return menu;
    };

    const orderedMenuItems = getOrderedMenuItems();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
                setActiveCategory(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav
                id={data?.element_id || null}
                className={`w-full top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isHomePage
                    ? `fixed ${isScrolled ? 'bg-primary backdrop-blur-xl py-5' : 'bg-transparent py-8'}`
                    : `${isScrolled ? 'fixed bg-primary py-5' : 'relative bg-primary py-5'}`
                    }`}
                style={{
                    boxShadow: (isHomePage ? isScrolled : isScrolled) ? '0 1px 3px 0 rgba(0, 0, 0, 0.02)' : 'none',
                    borderBottom: (isHomePage ? isScrolled : isScrolled) ? '1px solid rgba(0, 0, 0, 0.03)' : 'none'
                }}
            >
                <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-4 group relative z-50">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className={`${data?.logoWidth || 'w-48'} object-contain transition-all duration-500`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                        </a>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-8" ref={dropdownRef}>
                            {/* Servicios Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown('services')}
                                onMouseLeave={() => {
                                    setActiveDropdown(null);
                                    setActiveCategory(null);
                                }}
                            >
                                <button
                                    className={`flex items-center gap-2 text-white font-light text-lg tracking-tight hover:text-white/80 transition-colors py-2 ${activeDropdown === 'services' ? 'text-white/80' : ''
                                        }`}
                                >
                                    Servicios
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'services' ? 'rotate-180' : ''
                                        }`} />
                                </button>

                                {/* Mega Menu Dropdown */}
                                {activeDropdown === 'services' && items && items.length > 0 && (
                                    <div className="absolute top-full left-0 pt-2 w-64 animate-fadeIn">
                                        <div className="bg-white -xl shadow-xl overflow-visible border border-gray-100">
                                            <div className="py-2">
                                                {items.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        className="relative"
                                                        onMouseEnter={() => setActiveCategory(category.id)}
                                                        onMouseLeave={() => setActiveCategory(null)}
                                                    >
                                                        <div className={`px-4 py-2.5 text-secondary font-light text-lg cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                                                            activeCategory === category.id ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                                                        }`}>
                                                            <span>{category.alias || category.name}</span>
                                                            {category.services && category.services.length > 0 && (
                                                                <ChevronDown className={`min-w-4 min-h-4 max-w-4 max-h-4 -rotate-90 transition-all duration-200 ${
                                                                    activeCategory === category.id ? 'text-primary translate-x-0.5' : 'text-gray-400 group-hover:text-primary'
                                                                }`} />
                                                            )}
                                                        </div>

                                                        {/* Submenu de Servicios en Cascada */}
                                                        {activeCategory === category.id && category.services && category.services.length > 0 && (
                                                            <div className="absolute left-full top-0 pl-2 w-72 z-50">
                                                                <div className="bg-white -xl shadow-2xl border border-gray-100 overflow-hidden animate-slideInRight">
                                                                    <div className=" max-h-[400px] overflow-y-auto custom-scrollbar">
                                                                        {category.services.map((service, idx) => (
                                                                            <a
                                                                                key={service.id}
                                                                                href={`/servicio/${service.slug}`}
                                                                                className="block px-4 py-3 text-neutral-dark font-light text-lg hover:bg-primary hover:text-white transition-all duration-200 "
                                                                                style={{
                                                                                    animation: `fadeInStagger 0.15s ease-out ${idx * 0.03}s both`
                                                                                }}
                                                                            >
                                                                                {service.name}
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Páginas */}
                            {pages && pages.filter(page => page.menuable).map((page) => (
                                <a
                                    key={page.id}
                                    href={page.path}
                                    className="text-white font-light text-lg tracking-tight hover:text-white/80 transition-colors"
                                >
                                    {page.name}
                                </a>
                            ))}

                            {/* CTA Button Desktop */}
                            {data?.ctaText && data?.ctaLink && (
                                <a
                                    href={data.ctaLink}
                                    className={`px-6 py-3 bg-white -full text-primary text-sm font-semibold tracking-wide hover:bg-secondary hover:text-white transition-all duration-300 ${data?.class_cta_button || ''}`}
                                    style={{ letterSpacing: '0.03em' }}
                                >
                                    {data.ctaText}
                                </a>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden relative z-50 w-11 h-11 flex items-center justify-center transition-all duration-500 group"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute left-0 top-1.5 w-6 transition-all duration-500 ease-out ${isMenuOpen ? 'rotate-45 top-2.5 w-6' : ''
                                        } ${isScrolled ? 'bg-white' : 'bg-white'}`}
                                    style={{ height: '2px' }}
                                />
                                <span
                                    className={`absolute left-0 top-2.5 w-6 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                                        } ${isScrolled ? 'bg-white' : 'bg-white'}`}
                                    style={{ height: '2px' }}
                                />
                                <span
                                    className={`absolute left-0 top-3.5 w-6 transition-all duration-500 ease-out ${isMenuOpen ? '-rotate-45 top-2.5 w-6' : ''
                                        } ${isScrolled ? 'bg-white' : 'bg-white'}`}
                                    style={{ height: '2px' }}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Backdrop - Solo Mobile */}
            {isMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-500"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Side Menu - Solo Mobile */}
            <div
                ref={menuRef}
                className={`lg:hidden fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white transition-all duration-700 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    boxShadow: isMenuOpen ? '-4px 0 24px rgba(0, 0, 0, 0.04)' : 'none',
                    zIndex: 100
                }}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center hover:bg-slate-50 -full transition-all duration-300 group cursor-pointer"
                    aria-label="Cerrar menú"
                    style={{
                        animation: isMenuOpen ? 'slideIn 0.3s ease-out 0.2s both' : 'none',
                        zIndex: 1000
                    }}
                >
                    <X className="w-7 h-7 text-secondary group-hover:text-neutral-light transition-colors pointer-events-none" />
                </button>

                <div className="flex flex-col h-full pt-32 pb-12 px-12">
                    {/* Menu Items */}
                    <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden pr-2">
                        {orderedMenuItems.map((menuItem, index) => {
                            if (menuItem.type === 'services_root') {
                                return (
                                    <div key="services-root" className="mb-0">
                                        <button
                                            onClick={() => setIsServicesExpanded(!isServicesExpanded)}
                                            className="w-full flex items-center justify-between py-5 text-left text-secondary font-light text-xl tracking-tight group hover:text-primary transition-colors border-b border-gray-100"
                                            style={{
                                                animation: isMenuOpen ? 'slideIn 0.4s ease-out 0.1s both' : 'none'
                                            }}
                                        >
                                            <span className="font-light">Servicios</span>
                                            <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isServicesExpanded ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
                                        </button>

                                        {/* Contenedor de Categorías y Servicios */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isServicesExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-4 space-y-8   ml-1">
                                                {menuItem.data.map((category, catIndex) => (
                                                    <div key={category.id} className="relative">
                                                        {/* Nombre de Categoría */}
                                                        <h4 className="text-secondary font-light text-lg mb-3 block">
                                                            {category.alias || category.name}
                                                        </h4>

                                                        {/* Lista de Servicios */}
                                                        <div className="space-y-2 ml-2">
                                                            {category.services && category.services.map((service, servIndex) => (
                                                                <a
                                                                    key={service.id}
                                                                    href={`/servicio/${service.slug}`}
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-1 text-[15px] font-light text-neutral-light hover:text-primary hover:bg-primary/5 transition-all duration-300 -md px-2 -ml-2"
                                                                >
                                                                    {service.name}
                                                                </a>
                                                            ))}
                                                            {(!category.services || category.services.length === 0) && (
                                                                <span className="text-sm text-gray-300 italic px-2">Sin servicios disponibles</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else if (menuItem.type === 'page') {
                                const page = menuItem.data;
                                return (
                                    <a
                                        key={`page-${page.id}`}
                                        href={page.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-left py-4 text-secondary font-light text-xl lg:text-xl tracking-tight hover:text-primary hover:translate-x-1 transition-all duration-300 border-b border-gray-50"
                                        style={{
                                            animation: isMenuOpen ? `slideIn 0.4s ease-out ${index * 0.06 + 0.2}s both` : 'none',
                                            letterSpacing: '-0.01em'
                                        }}
                                    >
                                        {page.name}
                                    </a>
                                );
                            }
                            return null;
                        })}                    </div>

                    {/* CTA Button */}
                    {data?.ctaText && data?.ctaLink && (
                        <a
                            href={data.ctaLink}
                            className="w-full px-8 py-4 bg-primary -full text-white text-[13px] font-light tracking-wide hover:bg-secondary transition-all duration-500 mt-8 text-center block"
                            style={{
                                animation: isMenuOpen ? 'slideIn 0.4s ease-out 0.5s both' : 'none',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {data.ctaText}
                        </a>
                    )}

                    {/* Footer Text */}
                    {data?.footerText && (
                        <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}>
                            <p className="text-[11px] text-neutral-light font-light text-center tracking-wide" style={{ letterSpacing: '0.05em' }}>
                                {data.footerText}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeInStagger {
                    from {
                        opacity: 0;
                        transform: translateX(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.25s ease-out;
                }
                
                /* Custom scrollbar */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </>
    );
};

export default HeaderWebQuirurgica2;
