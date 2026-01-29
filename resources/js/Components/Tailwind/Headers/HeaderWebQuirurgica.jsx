import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import Global from '../../../Utils/Global';

const HeaderWebQuirurgica = ({ data, items, pages, generals = [], isUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const [isServicesExpanded, setIsServicesExpanded] = useState(true); // Servicios expandido por defecto o false
    const [isMobile, setIsMobile] = useState(false);
    const menuRef = useRef(null);

    // Obtener enlaces de empresa desde generals (array) - solo visibles
    const companyLinks = (() => {
        try {
            const links = generals.find(g => g.correlative === 'footer_company_links')?.description;
            const parsed = links ? JSON.parse(links) : [];
            return parsed.filter(link => link.visible !== false);
        } catch {
            return [];
        }
    })();

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

        // Enlaces de empresa como ítems de menú
        const companyMenuItems = companyLinks.map(link => ({ type: 'company_link', data: link }));

        // Páginas ordenadas
        const menuPages = (pages || []).filter(page => page.menuable).map(page => ({ type: 'page', data: page }));

        // Retornamos Servicios primero, luego enlaces de empresa, luego las páginas
        const menu = [];
        if (servicesItem) menu.push(servicesItem);
        menu.push(...companyMenuItems);
        menu.push(...menuPages);

        return menu;
    };

    const orderedMenuItems = getOrderedMenuItems();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check
        handleResize();

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
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

 console.log('HeaderWebQuirurgica generals:', generals);

    return (
        <>
            <nav
                id={data?.element_id || null}
                className={`w-full top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
                    data?.type_header === 'landing'
                        ? isHomePage
                            ? `fixed ${isScrolled ? 'bg-primary py-5' : 'bg-transparent py-5'}`
                            : 'relative bg-primary py-5'
                        : isHomePage 
                            ? `fixed ${isScrolled ? 'bg-primary py-5' : 'bg-transparent py-8'}`
                            : `${isScrolled ? 'fixed bg-primary py-5' : 'relative bg-primary py-5'}`
                }`}
            >
                <div className=" 2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-4 group relative z-50">
                            <img
                                src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                alt={Global.APP_NAME}
                                className={` h-12 lg:h-20 object-contain transition-all duration-500`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/assets/img/logo-bk.svg";
                                }}
                            />
                        </a>

                        {/* Company Links - Solo visible cuando está scrolled */}
                        {isHomePage && isScrolled && companyLinks.length > 0 && (
                            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-end">
                                {companyLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            const href = link.href || '#';
                                            if (href.includes('#')) {
                                                e.preventDefault();
                                                const hashIndex = href.indexOf('#');
                                                const targetId = href.substring(hashIndex + 1);
                                                const targetElement = document.getElementById(targetId);
                                                
                                                if (targetElement) {
                                                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                                                    const startPosition = window.pageYOffset;
                                                    const distance = targetPosition - startPosition - 80;
                                                    let startTime = null;

                                                    const animation = (currentTime) => {
                                                        if (startTime === null) startTime = currentTime;
                                                        const timeElapsed = currentTime - startTime;
                                                        const progress = Math.min(timeElapsed / 1200, 1);
                                                        
                                                        const easing = progress < 0.5
                                                            ? 4 * progress * progress * progress
                                                            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                                                        
                                                        window.scrollTo(0, startPosition + distance * easing);

                                                        if (timeElapsed < 1200) {
                                                            requestAnimationFrame(animation);
                                                        }
                                                    };

                                                    requestAnimationFrame(animation);
                                                    
                                                    setTimeout(() => {
                                                        window.history.pushState(null, '', href);
                                                    }, 100);
                                                }
                                            }
                                        }}
                                        className="text-white font-light text-xl hover:text-wood-300 transition-colors duration-300"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </nav>
                        )}

                        {/* Menu Button - En desktop solo visible cuando está scrolled, en mobile siempre visible */}
                        {(isScrolled && isMobile) && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative z-50 w-11 h-11 flex items-center justify-center transition-all duration-300 group"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute left-0 top-1.5 w-6 transition-all duration-500 ease-out ${isMenuOpen ? 'rotate-45 top-2.5 w-6' : ''
                                        } bg-white`}
                                    style={{ height: '2px' }}
                                />
                                <span
                                    className={`absolute left-0 top-2.5 w-6 transition-all duration-500 ease-out ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                                        } bg-white`}
                                    style={{ height: '2px' }}
                                />
                                <span
                                    className={`absolute left-0 top-3.5 w-6 transition-all duration-500 ease-out ${isMenuOpen ? '-rotate-45 top-2.5 w-6' : ''
                                        } bg-white`}
                                    style={{ height: '2px' }}
                                />
                            </div>
                        </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Side Menu */}
            <div
                ref={menuRef}
                className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-primary transition-all duration-700 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{
                    boxShadow: isMenuOpen ? '-4px 0 24px rgba(0, 0, 0, 0.04)' : 'none',
                    zIndex: 100
                }}
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center hover:bg-white/10 rounded-full transition-all duration-300 group cursor-pointer"
                    aria-label="Cerrar menú"
                    style={{
                        animation: isMenuOpen ? 'fadeInScale 0.4s ease-out 0.2s both' : 'none',
                        zIndex: 1000
                    }}
                >
                    <X className="w-7 h-7 text-white group-hover:text-wood-300 transition-colors pointer-events-none" />
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
                                            className="w-full flex items-center justify-between py-5 text-left text-white font-light text-xl tracking-tight group hover:text-wood-300 transition-colors border-b border-white/10"
                                            style={{
                                                animation: isMenuOpen ? 'slideInLeft 0.5s ease-out 0.15s both' : 'none'
                                            }}
                                        >
                                            <span className="font-light">Servicios</span>
                                            <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isServicesExpanded ? 'rotate-180 text-wood-300' : 'text-white/60'}`} />
                                        </button>

                                        {/* Contenedor de Categorías y Servicios */}
                                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isServicesExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                            <div className="pl-4 space-y-8   ml-1">
                                                {menuItem.data.map((category, catIndex) => (
                                                    <div key={category.id} className="relative">
                                                        {/* Nombre de Categoría */}
                                                        <h4 className="text-white font-light text-lg mb-3 block">
                                                            {category.alias || category.name}
                                                        </h4>

                                                        {/* Lista de Servicios */}
                                                        <div className="space-y-2 ml-2">
                                                            {category.services && category.services.map((service, servIndex) => (
                                                                <a
                                                                    key={service.id}
                                                                    href={`/servicio/${service.slug}`}
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="block py-1 text-[15px] font-light text-white/70 hover:text-wood-300 hover:bg-white/5 transition-all duration-300 rounded-md px-2 -ml-2"
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
                            } else if (menuItem.type === 'company_link') {
                                const link = menuItem.data;
                                return (
                                    <a
                                        key={`company-${index}`}
                                        href={link.href || '#'}
                                        onClick={(e) => {
                                            const href = link.href || '#';
                                            if (href.includes('#')) {
                                                e.preventDefault();
                                                const hashIndex = href.indexOf('#');
                                                const targetId = href.substring(hashIndex + 1);
                                                const targetElement = document.getElementById(targetId);
                                                
                                                if (targetElement) {
                                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                                    setTimeout(() => {
                                                        window.history.pushState(null, '', href);
                                                    }, 100);
                                                }
                                            }
                                            setIsMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-4 text-white font-light text-xl lg:text-xl tracking-tight hover:text-wood-300 hover:translate-x-2 transition-all duration-300 border-b border-white/10"
                                        style={{
                                            animation: isMenuOpen ? `slideInLeft 0.5s ease-out ${index * 0.08 + 0.2}s both` : 'none',
                                            letterSpacing: '-0.01em'
                                        }}
                                    >
                                        {link.name}
                                    </a>
                                );
                            } else if (menuItem.type === 'page') {
                                const page = menuItem.data;
                                return (
                                    <a
                                        key={`page-${page.id}`}
                                        href={page.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-left py-4 text-white font-light text-xl lg:text-xl tracking-tight hover:text-wood-300 hover:translate-x-2 transition-all duration-300 border-b border-white/10"
                                        style={{
                                            animation: isMenuOpen ? `slideInLeft 0.5s ease-out ${index * 0.08 + 0.2}s both` : 'none',
                                            letterSpacing: '-0.01em'
                                        }}
                                    >
                                        {page.name}
                                    </a>
                                );
                            }
                            return null;
                        })}                    </div>

               
                </div>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </>
    );
};

export default HeaderWebQuirurgica;
