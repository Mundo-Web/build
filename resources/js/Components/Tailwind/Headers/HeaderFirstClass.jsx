import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Building, HelpCircle, MapPin, Globe, Truck, DollarSign, MessageCircle, FileText, UserCircle, LogIn } from 'lucide-react';

const HeaderFirstClass = ({
    data,
    items,
    cart,
    setCart,
    pages,
    isUser,
    generals = [],
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const megaMenuRef = useRef(null);
    const servicesButtonRef = useRef(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);

    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );
    const addressObj = generals.find(
        (item) => item.correlative === "address"
    );
    
    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;
    const address = addressObj?.description ?? null;

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Handle mega menu hover
    const handleMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setIsMegaMenuOpen(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsMegaMenuOpen(false);
        }, 150); // Small delay to prevent flickering
        setHoverTimeout(timeout);
    };

    // Close mega menu when clicking outside or pressing escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                megaMenuRef.current && 
                !megaMenuRef.current.contains(event.target) &&
                servicesButtonRef.current &&
                !servicesButtonRef.current.contains(event.target)
            ) {
                setIsMegaMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsMegaMenuOpen(false);
                setIsMenuOpen(false);
            }
        };

        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const megaMenuSections = [
        {
            title: "1. Personas",
            icon: User,
            items: [
                { name: "Casillero virtual", description: "Tu dirección personal en Miami", icon: MapPin, path: "/casillero-virtual" },
                { name: "Envíos de USA a Perú", description: "Servicio directo y confiable", icon: Globe, path: "/envios-usa-peru" },
                { name: "Envíos de Perú a USA", description: "Exporta fácilmente", icon: Truck, path: "#" }
            ]
        },
        {
            title: "2. Empresas",
            icon: Building,
            items: [
                { name: "Importación en modalidad courier", description: "Soluciones empresariales", icon: Globe, path: "#" },
                { name: "Exportación en modalidad courier", description: "Expande tu negocio", icon: Truck, path: "#" }
            ]
        },
        {
            title: "3. Enlaces de Interés",
            icon: HelpCircle,
            items: [
                { name: "Tarifas", description: "Consulta nuestros precios", icon: DollarSign, path: "#" },
                { name: "Preguntas frecuentes", description: "Resuelve tus dudas", icon: MessageCircle, path: "#" },
                { name: "PQR", description: "Peticiones, quejas y reclamos", icon: FileText, path: "#" }
            ]
        }
    ];

    const handleLogoClick = () => {
        window.location.href = '/';
        setIsMenuOpen(false);
        setIsMegaMenuOpen(false);
    };

    const handleMenuItemClick = (path) => {
        if (path !== "#") {
            window.location.href = path;
        }
        setIsMenuOpen(false);
        setIsMegaMenuOpen(false);
    };

    return (
        <>
            {/* Backdrop overlay for mega menu */}
            {isMegaMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
                    style={{ top: '80px' }} 
                />
            )}
            
            {/* Main Header */}
            <header className={`w-full top-0 left-0 z-50 transition-all duration-300 border-b border-gray-100 ${isFixed ? "fixed bg-white shadow-lg" : "relative bg-white"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        
                        {/* Logo */}
                        <div 
                            className="flex items-center cursor-pointer group" 
                            onClick={handleLogoClick}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleLogoClick();
                                }
                            }}
                        >
                            <div className="bg-primary hover:bg-secondary px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-105 shadow-md hover:shadow-lg">
                                <div className="text-white font-bold text-lg lg:text-2xl tracking-wide">
                                    FirstClass
                                </div>
                                <div className="text-white text-xs lg:text-sm font-light tracking-widest -mt-1">
                                    c o u r i e r
                                </div>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {/* Servicios con Mega Menu */}
                            <div 
                                className="relative"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    ref={servicesButtonRef}
                                    className="flex items-center customtext-primary hover:text-secondary transition-colors duration-200 py-2 font-medium cursor-pointer group"
                                    aria-expanded={isMegaMenuOpen}
                                    aria-haspopup="true"
                                >
                                    Servicios
                                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 group-hover:text-secondary ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            
                            {/* Menu principal */}
                            <a 
                                href="/blog" 
                                className="text-gray-700 hover:customtext-primary transition-colors duration-200 font-medium relative group"
                            >
                                Blog
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                            <a 
                                href="/contacto" 
                                className="text-gray-700 hover:customtext-primary transition-colors duration-200 font-medium relative group"
                            >
                                Contacto
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                            <a 
                                href="#" 
                                className="text-gray-700 hover:customtext-primary transition-colors duration-200 font-medium relative group"
                            >
                                Rastrea
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </nav>

                        {/* Account Section */}
                        <div className="flex items-center space-x-4">
                            {/* Account Buttons - Desktop */}
                            <div className="hidden lg:flex items-center space-x-3">
                                <button className="flex items-center text-gray-700 hover:customtext-primary transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group">
                                    <UserCircle className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform duration-200" />
                                    <a href="/mi-cuenta">Mi cuenta</a>
                                </button>
                                <button className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center group transform hover:scale-105">
                                    <LogIn className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                                    Regístrate
                                </button>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="lg:hidden text-gray-700 hover:customtext-primary transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50"
                                aria-label="Toggle menu"
                                aria-expanded={isMenuOpen}
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mega Menu */}
                    {isMegaMenuOpen && (
                        <div
                            ref={megaMenuRef}
                            className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-100 z-50 animate-mega-menu-slide-down"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {/* Main Sections Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    {megaMenuSections.map((section, sectionIndex) => {
                                        const SectionIcon = section.icon;
                                        return (
                                            <div 
                                                key={sectionIndex} 
                                                className="space-y-4 animate-section-enter-left"
                                                style={{ animationDelay: `${sectionIndex * 200 + 300}ms` }}
                                            >
                                                <div className="flex items-center space-x-2 pb-3 border-b-2 border-primary/20 animate-section-header-slide" style={{ animationDelay: `${sectionIndex * 200 + 400}ms` }}>
                                                    <SectionIcon className="h-5 w-5 customtext-primary animate-icon-spin-in" style={{ animationDelay: `${sectionIndex * 200 + 500}ms` }} />
                                                    <h3 className="text-lg font-bold text-gray-900 animate-title-typewriter" style={{ animationDelay: `${sectionIndex * 200 + 600}ms` }}>{section.title}</h3>
                                                </div>
                                                <ul className="space-y-3">
                                                    {section.items.map((item, itemIndex) => {
                                                        const ItemIcon = item.icon;
                                                        return (
                                                            <li 
                                                                key={itemIndex}
                                                                className="animate-item-pop-in"
                                                                style={{ animationDelay: `${sectionIndex * 200 + itemIndex * 150 + 700}ms` }}
                                                            >
                                                                <button
                                                                    onClick={() => handleMenuItemClick(item.path)}
                                                                    className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-300 border border-transparent hover:border-primary/20 hover:scale-105 hover:shadow-lg transform hover:-translate-y-1 w-full text-left"
                                                                >
                                                                    <ItemIcon className="h-5 w-5 customtext-primary mt-0.5 group-hover:text-secondary transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                                                                    <div>
                                                                        <div className="text-sm font-semibold text-gray-900 group-hover:customtext-primary transition-colors duration-300">
                                                                            {item.name}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                                                                            {item.description}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Call to Action Section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="bg-primary  rounded-xl p-6 text-white animate-cta-slide-up" style={{ animationDelay: '1200ms' }}>
                                        <div className="flex flex-col md:flex-row items-center justify-between">
                                            <div className="mb-4 md:mb-0 animate-cta-content-slide" style={{ animationDelay: '1400ms' }}>
                                                <h4 className="text-xl font-bold mb-2 animate-cta-title-pulse" style={{ animationDelay: '1500ms' }}>¿Nuevo en FirstClass?</h4>
                                                <p className="text-sm opacity-90 animate-cta-subtitle-slide" style={{ animationDelay: '1600ms' }}>Regístrate gratis y obtén tu casillero virtual en Miami</p>
                                            </div>
                                            <div className="flex space-x-3 animate-cta-buttons-bounce" style={{ animationDelay: '1700ms' }}>
                                                <button 
                                                    onClick={() => handleMenuItemClick('/casillero-virtual')}
                                                    className="bg-white customtext-primary hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-110 hover:-translate-y-2 hover:rotate-1"
                                                >
                                                    Comenzar ahora
                                                </button>
                                                <button className="border-2 border-white text-white hover:bg-white hover:customtext-primary px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 hover:-rotate-1">
                                                    Ver tarifas
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="lg:hidden py-4 border-t animate-fade-in bg-white">
                            <div className="flex flex-col space-y-4">
                                {/* Personas */}
                                <div className="space-y-2">
                                    <div className="text-sm font-bold customtext-primary px-2 flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        1. Personas
                                    </div>
                                    <button 
                                        onClick={() => handleMenuItemClick('/casillero-virtual')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Casillero virtual
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('/envios-usa-peru')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Envíos de USA a Perú
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Envíos de Perú a USA
                                    </button>
                                </div>
                                
                                {/* Empresas */}
                                <div className="space-y-2">
                                    <div className="text-sm font-bold customtext-primary px-2 flex items-center">
                                        <Building className="h-4 w-4 mr-2" />
                                        2. Empresas
                                    </div>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Importación en modalidad courier
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Exportación en modalidad courier
                                    </button>
                                </div>

                                {/* Enlaces de Interés */}
                                <div className="space-y-2">
                                    <div className="text-sm font-bold customtext-primary px-2 flex items-center">
                                        <HelpCircle className="h-4 w-4 mr-2" />
                                        3. Enlaces de Interés
                                    </div>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Tarifas
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        Preguntas frecuentes
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-6 py-2 text-sm text-gray-700 hover:customtext-primary hover:bg-gray-50 rounded transition-colors duration-200"
                                    >
                                        PQR
                                    </button>
                                </div>

                                {/* Other navigation items */}
                                <div className="border-t pt-4 space-y-2">
                                    <button 
                                        onClick={() => handleMenuItemClick('/blog')}
                                        className="block w-full text-left px-2 py-2 text-gray-700 hover:customtext-primary transition-colors duration-200"
                                    >
                                        Blog
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('/contacto')}
                                        className="block w-full text-left px-2 py-2 text-gray-700 hover:customtext-primary transition-colors duration-200"
                                    >
                                        Contacto
                                    </button>
                                    <button 
                                        onClick={() => handleMenuItemClick('#')}
                                        className="block w-full text-left px-2 py-2 text-gray-700 hover:customtext-primary transition-colors duration-200"
                                    >
                                        Rastrea
                                    </button>
                                    
                                    {/* Account buttons mobile */}
                                    <div className="border-t pt-4 space-y-2">
                                        <a href="/mi-cuenta" className="w-full flex items-center justify-center text-gray-700 hover:customtext-primary transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-gray-50">
                                            <UserCircle className="h-5 w-5 mr-2" />
                                            Mi cuenta
                                        </a>
                                        <button className="w-full bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center">
                                            <LogIn className="h-4 w-4 mr-2" />
                                            Regístrate
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};

export default HeaderFirstClass;