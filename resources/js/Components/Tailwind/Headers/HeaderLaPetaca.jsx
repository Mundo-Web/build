import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, X, Menu, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartModalLaPetaca from '../Components/CartModalLaPetaca';
import { CurrencySymbol } from '../../../Utils/Number2Currency';
import Global from '../../../Utils/Global';

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

   

    const accentColor = data?.accentColor || '#78673A';

    return (
        <>
            <header
                id={data?.element_id || null}
                className={`w-full top-0 left-0 right-0 z-50 py-2 transition-all duration-300 ${
                    isHomePage 
                        ? `fixed ${isScrolled ? 'backdrop-blur-md shadow-lg bg-primary' : 'bg-transparent'}`
                        : `${isScrolled ? 'fixed shadow-lg bg-primary' : 'relative bg-primary'}`
                }`}
               
            >
                <div className="2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <a
                            href="/"
                            className="flex items-center space-x-3 group"
                        >
                            <div className="relative">
                                <img
                                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className="h-12 lg:h-16 w-auto transition-transform "
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
                                                        className="rounded-lg shadow-xl bg-primary overflow-hidden border border-white/10"
                                                       
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
                                            className="text-lg font-semibold tracking-wide transition-all duration-300 relative group text-white  hover:customtext-secondary"
                                        >
                                            {page.name}
                                            <span
                                                className="absolute -bottom-1 left-0 w-full bg-secondary h-0.5 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"
                                         
                                            ></span>
                                        </a>
                                    );
                                }
                                return null;
                            })}

                            {/* Cart Button */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className="relative p-3 rounded-full transition-all duration-300 bg-accent hover:bg-primary"
                                aria-label="Carrito de compras"
                            >
                                <ShoppingCart size={22} className="text-white  " />
                                {totalCount > 0 && (
                                    <span 
                                        className="absolute -top-1 -right-1 bg-white customtext-neutral-dark text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                                       
                                    >
                                        {totalCount > 99 ? '99+' : totalCount}
                                    </span>
                                )}
                            </button>

                       
                        </nav>

                        {/* Mobile Right Section */}
                        <div className="flex md:hidden items-center gap-3">
                            {/* Cart Button Mobile */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className="relative p-2 rounded-full transition-all duration-300"
                                aria-label="Carrito de compras"
                            >
                                <ShoppingCart size={22} className="text-white" />
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
                                className="p-2 transition-colors text-white rounded-full hover:bg-white/10"
                          
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
            </header>

            {/* Mobile Menu Overlay - Fuera del header */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-0 bg-black/60 z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        
                        {/* Menu Panel */}
                        <motion.div
                            ref={menuRef}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="md:hidden fixed right-0 top-0 h-full w-[85%] max-w-sm bg-primary shadow-2xl z-50 flex flex-col"
                        >
                            {/* Header del menú con logo */}
                            <div className="flex items-center justify-between p-5 border-b border-white/10">
                                <img
                                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className="h-10 w-auto"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/img/logo-bk.svg";
                                    }}
                                />
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Contenido del menú con scroll */}
                            <div className="flex-1 overflow-y-auto py-4">
                                <nav className="px-3">
                                    {orderedMenuItems.map((menuItem, index) => {
                                        if (menuItem.type === 'category') {
                                            const category = menuItem.data;
                                            return (
                                                <motion.div 
                                                    key={`mobile-cat-${category.id}`}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="mb-1"
                                                >
                                                    <a
                                                        href={`/catalogo?category=${category.slug}`}
                                                        className="flex items-center gap-3 py-3.5 px-4 text-base font-medium text-white hover:bg-white/10 rounded-xl transition-all"
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                       
                                                        {category.alias || category.name}
                                                    </a>
                                                    
                                                    {/* Subcategorías */}
                                                    {category.subcategories?.length > 0 && (
                                                        <div className="ml-8 mb-2 pl-4 border-l border-white/10">
                                                            {category.subcategories.map((sub, subIndex) => (
                                                                <motion.a
                                                                    key={sub.id}
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: (index * 0.05) + (subIndex * 0.03) }}
                                                                    href={`/catalogo?subcategory=${sub.slug}`}
                                                                    className="block py-2.5 px-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                >
                                                                    {sub.name}
                                                                </motion.a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        } else if (menuItem.type === 'page') {
                                            const page = menuItem.data;
                                            return (
                                                <motion.a
                                                    key={`mobile-page-${page.id || index}`}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    href={page.path}
                                                    className="flex items-center gap-3 py-3.5 px-4 text-base font-medium text-white hover:bg-white/10 rounded-xl transition-all mb-1"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                  
                                                    {page.name}
                                                </motion.a>
                                            );
                                        }
                                        return null;
                                    })}
                                </nav>
                            </div>

                            {/* Footer decorativo */}
                            <div className="p-5 border-t border-white/10">
                                <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                                    <span className="w-8 h-px bg-white/20"></span>
                                    <span>La Petaca</span>
                                    <span className="w-8 h-px bg-white/20"></span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
