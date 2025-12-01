import React, { useState, useEffect } from 'react';

const HeaderLaPetaca = ({ data, items, pages, generals = [] }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Data de prueba - usar pages menuables si están disponibles, sino menú por defecto
    const menuItems = pages && pages.length > 0 ? pages
        .filter(page => page.menuable)
        .map((page, idx) => ({
            id: page.id || `page-${idx}`,
            label: page.name || page.title,
            url: page.path ? `${page.path}` : page.path || '#',
        })) : [
        { id: 'home', label: 'Inicio', url: '/' },
        { id: 'about', label: 'Nosotros', url: '/nosotros' },
        { id: 'rooms', label: 'Habitaciones', url: '/habitaciones' },
        { id: 'services', label: 'Servicios', url: '/servicios' },
        { id: 'contact', label: 'Contacto', url: '/contacto' },
    ];

    const logoAlt = data?.logoAlt || 'Hotel La Petaca';
    const bgColor = data?.bgColor || '#281409';
    const accentColor = data?.accentColor || '#78673A';

    return (
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? 'backdrop-blur-md shadow-lg' : 'bg-transparent'
                }`}
                style={{
                    backgroundColor: isScrolled ? `${bgColor}f2` : 'transparent'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <nav className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    className="text-sm font-medium tracking-wide transition-all duration-300 relative group text-gray-300 hover:opacity-100"
                                    style={{ color: item.active ? accentColor : undefined }}
                                >
                                    {item.label}
                                    <span
                                        className="absolute -bottom-1 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"
                                        style={{ backgroundColor: accentColor }}
                                    ></span>
                                </a>
                            ))}
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden transition-colors"
                            style={{ color: accentColor }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    className={`md:hidden fixed inset-0 backdrop-blur-lg transition-all duration-300 ${
                        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                    style={{
                        top: '80px',
                        backgroundColor: `${bgColor}fa`
                    }}
                >
                    <nav className="flex flex-col items-center justify-center h-full space-y-8">
                        {menuItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.url}
                                className="text-2xl font-medium tracking-wide transition-all duration-300 text-gray-300 hover:scale-110"
                                style={{ color: item.active ? accentColor : undefined }}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>
    );
};

export default HeaderLaPetaca;
