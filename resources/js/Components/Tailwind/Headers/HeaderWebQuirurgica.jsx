import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Global from '../../../Utils/Global';

const HeaderWebQuirurgica = ({ data, items, pages, generals = [], isUser }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Obtener orden del menú desde generals
    const headerMenuOrderObj = generals.find(item => item.correlative === "header_menu_order");
    const headerMenuOrder = headerMenuOrderObj?.description ?? null;

    // Función para ordenar el menú según el orden especificado
    const getOrderedMenuItems = () => {
        if (!headerMenuOrder) {
            return [
                ...(items || []).map(cat => ({ type: 'category', data: cat })),
                ...(pages || []).filter(page => page.menuable).map(page => ({ type: 'page', data: page }))
            ];
        }

        const orderArray = headerMenuOrder.split(',').map(item => item.trim()).filter(Boolean);
        const orderedItems = [];

        orderArray.forEach(displayName => {
            const category = (items || []).find(cat =>
                (cat.alias && cat.alias.toLowerCase() === displayName.toLowerCase()) ||
                cat.name.toLowerCase() === displayName.toLowerCase()
            );
            if (category) {
                orderedItems.push({ type: 'category', data: category });
                return;
            }

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
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
                    isScrolled
                        ? 'bg-primary backdrop-blur-xl py-5'
                        : 'bg-transparent py-8'
                }`}
                style={{
                    boxShadow: isScrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.02)' : 'none',
                    borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.03)' : 'none'
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
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="relative z-50 w-11 h-11 flex items-center justify-center transition-all duration-500 group"
                            aria-label="Toggle menu"
                        >
                            <div className="relative w-6 h-6">
                                <span
                                    className={`absolute left-0 top-1.5 w-6 transition-all duration-500 ease-out ${
                                        isMenuOpen ? 'rotate-45 top-2.5 w-6' : ''
                                    } ${isScrolled ? 'bg-white' : 'bg-white'}`}
                                    style={{ height: '2px' }}
                                />
                                <span
                                    className={`absolute left-0 top-2.5 w-6 transition-all duration-500 ease-out ${
                                        isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                                    } ${isScrolled ? 'bg-white' : 'bg-white'}`}
                                    style={{ height: '2px' }}
                                />
                                <span
                                    className={`absolute left-0 top-3.5 w-6 transition-all duration-500 ease-out ${
                                        isMenuOpen ? '-rotate-45 top-2.5 w-6' : ''
                                    } ${isScrolled ? 'bg-white' : 'bg-white'}`}
                                    style={{ height: '2px' }}
                                />
                            </div>
                        </button>
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
                className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white transition-all duration-700 ease-out ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
                    <div className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden">
                        {orderedMenuItems.map((menuItem, index) => {
                            if (menuItem.type === 'category') {
                                const category = menuItem.data;
                                return (
                                    <div hidden key={`cat-${category.id}`}>
                                        <a
                                            href={`/catalogo?category=${category.slug}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block w-full text-left py-5 text-slate-900 font-light text-[15px] tracking-tight hover:text-slate-600 hover:translate-x-1 transition-all duration-300"
                                            style={{
                                                animation: isMenuOpen ? `slideIn 0.4s ease-out ${index * 0.06}s both` : 'none',
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                                                letterSpacing: '-0.01em'
                                            }}
                                        >
                                            {category.alias || category.name}
                                        </a>
                                        
                                        {/* Subcategorías */}
                                        {category.subcategories?.length > 0 && (
                                            <div className="ml-4 space-y-1 mb-2">
                                                {category.subcategories.map((sub) => (
                                                    <a
                                                        key={sub.id}
                                                        href={`/catalogo?subcategory=${sub.slug}`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="block py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
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
                                        key={`page-${page.id}`}
                                        href={page.path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-left py-5 text-secondary font-light text-base lg:text-lg tracking-tight hover:text-neutral-light hover:translate-x-1 transition-all duration-300"
                                        style={{
                                            animation: isMenuOpen ? `slideIn 0.4s ease-out ${index * 0.06}s both` : 'none',
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                                            letterSpacing: '-0.01em'
                                        }}
                                    >
                                        {page.name}
                                    </a>
                                );
                            }
                            return null;
                        })}

                       
                    </div>

                    {/* CTA Button */}
                    {data?.ctaText && data?.ctaLink && (
                        <a
                            href={data.ctaLink}
                            className="w-full px-8 py-4 bg-secondary text-white text-[13px] font-light tracking-wide hover:bg-primary transition-all duration-500 mt-8 text-center block"
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
