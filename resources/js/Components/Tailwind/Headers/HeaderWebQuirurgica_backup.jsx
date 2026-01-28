import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Global from '../../../Utils/Global';

const HeaderWebQuirurgica = ({ data, items, pages, generals = [], isUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const [isServicesExpanded, setIsServicesExpanded] = useState(true); // Servicios expandido por defecto o false
    const menuRef = useRef(null);

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
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <nav
                id={data?.element_id || null}
                className={`w-full top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
                    data?.type_header === 'landing'
                        ? isHomePage
                            ? 'fixed bg-transparent py-5'
                            : 'relative bg-primary py-5'
                        : isHomePage 
                            ? `fixed ${isScrolled ? 'bg-primary backdrop-blur-xl py-5' : 'bg-transparent py-8'}`
                            : `${isScrolled ? 'fixed bg-primary py-5' : 'relative bg-primary py-5'}`
                }`}
                style={{
                    boxShadow: (data?.type_header === 'landing' ? false : isScrolled) ? '0 1px 3px 0 rgba(0, 0, 0, 0.02)' : 'none',
                    borderBottom: (data?.type_header === 'landing' ? false : isScrolled) ? '1px solid rgba(0, 0, 0, 0.03)' : 'none',
                    transform: (data?.type_header === 'landing' && isHomePage && isScrolled) ? 'translateY(-100%)' : 'translateY(0)',
                    willChange: 'transform'
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

                        {/* Menu Button */}
                        {data?.menu_button && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative z-50 w-11 h-11 flex items-center justify-center transition-all duration-500 group"
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
                        )}
                    </div>
                </div>
            </nav>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity duration-500"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            {/* Side Menu */}
            <div
                ref={menuRef}
                className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white transition-all duration-700 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    boxShadow: isMenuOpen ? '-4px 0 24px rgba(0, 0, 0, 0.04)' : 'none',
                    zIndex: 100
                }}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center hover:bg-slate-50 rounded-full transition-all duration-300 group cursor-pointer"
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
                                                                    className="block py-1 text-[15px] font-light text-neutral-light hover:text-primary hover:bg-primary/5 transition-all duration-300 rounded-md px-2 -ml-2"
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
                            className="w-full px-8 py-4 bg-primary rounded-full text-white text-[13px] font-light tracking-wide hover:bg-secondary transition-all duration-500 mt-8 text-center block"
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
            `}</style>
        </>
    );
};

export default HeaderWebQuirurgica;
