import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, X, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartModalLaPetaca from '../Components/CartModalLaPetaca';
import { CurrencySymbol } from '../../../Utils/Number2Currency';

const HeaderLaPetaca = ({ data, items, pages, generals = [], cart = [], setCart, isUser }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const menuRef = useRef(null);

    // Detectar si estamos en la página de inicio
    useEffect(() => {
        const checkIfHomePage = () => {
            const path = window.location.pathname;
            return path === '/' || path === '/home' || path === '/inicio';
        };
        setIsHomePage(checkIfHomePage());
    }, []);

    // Obtener configuraciones de generals
    const phoneWhatsappObj = generals.find(item => item.correlative === "phone_whatsapp");
    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;

    // Obtener orden del menú desde generals
    const headerMenuOrderObj = generals.find(item => item.correlative === "header_menu_order");
    const headerMenuOrder = headerMenuOrderObj?.description ?? null;

    // Función para ordenar el menú según el orden especificado
    const getOrderedMenuItems = () => {
        if (!headerMenuOrder) {
            // Si no hay orden definido, mostrar categorías primero y luego páginas
            return [
                ...(items || []).map(cat => ({ type: 'category', data: cat })),
                ...(pages || []).filter(page => page.menuable).map(page => ({ type: 'page', data: page }))
            ];
        }

        // Parsear el orden (separado por comas)
        const orderArray = headerMenuOrder.split(',').map(item => item.trim()).filter(Boolean);
        const orderedItems = [];

        orderArray.forEach(displayName => {
            // Buscar en categorías (por alias o name)
            const category = (items || []).find(cat =>
                (cat.alias && cat.alias.toLowerCase() === displayName.toLowerCase()) ||
                cat.name.toLowerCase() === displayName.toLowerCase()
            );
            if (category) {
                orderedItems.push({ type: 'category', data: category });
                return;
            }

            // Buscar en páginas (por name)
            const page = (pages || []).find(p =>
                p.menuable && p.name.toLowerCase() === displayName.toLowerCase()
            );
            if (page) {
                orderedItems.push({ type: 'page', data: page });
            }
        });

        return orderedItems;
    };

    const orderedMenuItems = getOrderedMenuItems();

    // Calcular total de items en carrito
    // Para reservas (type='booking') cuenta 1 por cada reserva
    // Para productos normales cuenta por quantity
    const totalCount = cart.reduce((acc, item) => {
        if (item.type === 'booking') {
            return acc + 1; // Cada reserva cuenta como 1
        }
        return acc + Number(item.quantity || 1);
    }, 0);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logoAlt = data?.logoAlt || 'Hotel La Petaca';
    const bgColor = data?.bgColor || '#281409';
    const accentColor = data?.accentColor || '#78673A';

    return (
        <>
            <header
                className={`w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isHomePage 
                        ? `fixed ${isScrolled ? 'backdrop-blur-md shadow-lg' : 'bg-transparent'}`
                        : `${isScrolled ? 'fixed shadow-lg' : 'relative'}`
                }`}
                style={{
                    backgroundColor: isHomePage
                        ? (isScrolled ? `${bgColor}f2` : 'transparent')
                        : bgColor
                }}
            >
                <div className="max-w-7xl mx-auto px-[5%] 2xl:px-0">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <a
                            href="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <img
                                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                    alt={logoAlt}
                                    className="h-12 w-auto transition-transform group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/img/logo-bk.svg";
                                    }}
                                />
                            </div>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            {orderedMenuItems.map((menuItem, index) => {
                                if (menuItem.type === 'category') {
                                    const category = menuItem.data;
                                    return (
                                        <div key={`cat-${category.id}`} className="relative group">
                                            <a
                                                href={`/catalogo?category=${category.slug}`}
                                                className="flex items-center gap-1 text-sm font-medium tracking-wide transition-all duration-300 text-gray-300 hover:text-white"
                                            >
                                                {category.alias || category.name}
                                                {category.subcategories?.length > 0 && (
                                                    <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                                                )}
                                            </a>

                                            {/* Dropdown Menu for Subcategories */}
                                            {category.subcategories?.length > 0 && (
                                                <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                    <div 
                                                        className="rounded-lg shadow-xl overflow-hidden border border-white/10"
                                                        style={{ backgroundColor: bgColor }}
                                                    >
                                                        {category.subcategories.map((sub) => (
                                                            <a
                                                                key={sub.id}
                                                                href={`/catalogo?subcategory=${sub.slug}`}
                                                                className="block px-4 py-3 text-sm text-gray-300 hover:text-white transition-colors duration-300"
                                                                style={{ ':hover': { backgroundColor: accentColor } }}
                                                                onMouseEnter={(e) => e.target.style.backgroundColor = accentColor}
                                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                            >
                                                                {sub.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                } else if (menuItem.type === 'page') {
                                    const page = menuItem.data;
                                    return (
                                        <a
                                            key={`page-${page.id || index}`}
                                            href={page.path}
                                            className="text-sm font-medium tracking-wide transition-all duration-300 relative group text-gray-300 hover:text-white"
                                        >
                                            {page.name}
                                            <span
                                                className="absolute -bottom-1 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"
                                                style={{ backgroundColor: accentColor }}
                                            ></span>
                                        </a>
                                    );
                                }
                                return null;
                            })}

                            {/* Cart Button */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className="relative p-2 rounded-full transition-all duration-300 hover:bg-white/10"
                                aria-label="Carrito de compras"
                            >
                                <ShoppingCart size={22} className="text-gray-300 hover:text-white" />
                                {totalCount > 0 && (
                                    <span 
                                        className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        {totalCount > 99 ? '99+' : totalCount}
                                    </span>
                                )}
                            </button>

                            {/* User Button (opcional) */}
                            {isUser ? (
                                <a
                                    href="/profile"
                                    className="p-2 rounded-full transition-all duration-300 hover:bg-white/10"
                                    aria-label="Mi perfil"
                                >
                                    <User size={22} className="text-gray-300 hover:text-white" />
                                </a>
                            ) : (
                                <a
                                    href="/iniciar-sesion"
                                    className="p-2 rounded-full transition-all duration-300 hover:bg-white/10"
                                    aria-label="Iniciar sesión"
                                >
                                    <User size={22} className="text-gray-300 hover:text-white" />
                                </a>
                            )}
                        </nav>

                        {/* Mobile Right Section */}
                        <div className="flex md:hidden items-center gap-3">
                            {/* Cart Button Mobile */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className="relative p-2 rounded-full transition-all duration-300"
                                aria-label="Carrito de compras"
                            >
                                <ShoppingCart size={22} className="text-gray-300" />
                                {totalCount > 0 && (
                                    <span 
                                        className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        {totalCount > 99 ? '99+' : totalCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile menu button */}
                            <button
                                className="p-2 transition-colors rounded-full hover:bg-white/10"
                                style={{ color: accentColor }}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? (
                                    <X size={24} />
                                ) : (
                                    <Menu size={24} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-0 backdrop-blur-lg"
                            style={{
                                top: '80px',
                                backgroundColor: `${bgColor}fa`
                            }}
                        >
                            <nav className="flex flex-col items-center justify-center h-full space-y-6 pb-20">
                                {orderedMenuItems.map((menuItem, index) => {
                                    if (menuItem.type === 'category') {
                                        const category = menuItem.data;
                                        return (
                                            <div key={`mobile-cat-${category.id}`} className="text-center">
                                                <a
                                                    href={`/catalogo?category=${category.slug}`}
                                                    className="text-xl font-medium tracking-wide transition-all duration-300 text-gray-300 hover:text-white"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {category.alias || category.name}
                                                </a>
                                                {category.subcategories?.length > 0 && (
                                                    <div className="mt-2 space-y-1">
                                                        {category.subcategories.map((sub) => (
                                                            <a
                                                                key={sub.id}
                                                                href={`/catalogo?subcategory=${sub.slug}`}
                                                                className="block text-sm text-gray-400 hover:text-white transition-colors"
                                                                onClick={() => setIsMenuOpen(false)}
                                                            >
                                                                {sub.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else if (menuItem.type === 'page') {
                                        const page = menuItem.data;
                                        return (
                                            <a
                                                key={`mobile-page-${page.id || index}`}
                                                href={page.path}
                                                className="text-xl font-medium tracking-wide transition-all duration-300 text-gray-300 hover:text-white"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {page.name}
                                            </a>
                                        );
                                    }
                                    return null;
                                })}

                                {/* User link in mobile */}
                                <a
                                    href={isUser ? "/profile" : "/iniciar-sesion"}
                                    className="flex items-center gap-2 text-xl font-medium tracking-wide transition-all duration-300 text-gray-300 hover:text-white"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={20} />
                                    {isUser ? 'Mi Perfil' : 'Iniciar Sesión'}
                                </a>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Cart Modal */}
            <CartModalLaPetaca
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default HeaderLaPetaca;
