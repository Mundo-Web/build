import React from 'react';

const FooterLaPetaca = ({ data }) => {
    // Data de prueba
    const menuItems = data?.menuItems || [
        { id: 'home', label: 'Inicio', url: '/' },
        { id: 'about', label: 'Nosotros', url: '/nosotros' },
        { id: 'rooms', label: 'Habitaciones', url: '/habitaciones' },
        { id: 'services', label: 'Servicios', url: '/servicios' },
        { id: 'contact', label: 'Contacto', url: '/contacto' },
    ];

    const services = data?.services || [
        'Restaurante Gourmet',
        'Tours Ecológicos',
        'Piscina Natural',
        'WiFi Gratuito',
        'Transporte',
    ];

    const contactInfo = data?.contactInfo || {
        address: ['Región Amazonas', 'Chachapoyas, Perú'],
        phones: ['+51 987 654 321', '+51 912 345 678'],
        emails: ['info@lapetaca.com', 'reservas@lapetaca.com'],
    };

    const socials = data?.socials || [
        { name: 'Facebook', icon: 'facebook', url: '#' },
        { name: 'Instagram', icon: 'instagram', url: '#' },
        { name: 'Twitter', icon: 'twitter', url: '#' },
    ];

    const logo = data?.logo || '/images/logo.png';
    const logoAlt = data?.logoAlt || 'Hotel La Petaca';
    const description = data?.description || 'Conectando el lujo con la naturaleza en el corazón del Amazonas peruano.';
    const tagline = data?.tagline || 'Inspirado en la rica iconografía de las culturas amazónicas';
    const accentColor = data?.accentColor || '#78673A';

    const getIcon = (iconName) => {
        const icons = {
            'facebook': <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
            'instagram': <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
            'twitter': <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>,
            'map': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            'phone': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
            'mail': <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        };
        return icons[iconName] || icons['facebook'];
    };

    return (
        <footer 
                className="bg-[#281409] border-t"
                style={{ borderColor: `${accentColor}33` }}
            >
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        {/* Column 1 - Logo & Description */}
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <img 
                                    src={logo} 
                                    alt={logoAlt}
                                    className="w-auto h-12"
                                />
                            </div>
                            <p className="text-gray-400 leading-relaxed mb-6">
                                {description}
                            </p>
                            <div className="flex gap-3">
                                {socials.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 hover:scale-110"
                                        style={{ 
                                            backgroundColor: `${accentColor}33`,
                                            color: accentColor
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = accentColor;
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = `${accentColor}33`;
                                            e.currentTarget.style.color = accentColor;
                                        }}
                                    >
                                        {getIcon(social.icon)}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 2 - Navigation */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Navegación</h4>
                            <ul className="space-y-3">
                                {menuItems.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={item.url}
                                            className="text-gray-400 hover:transition-colors duration-300"
                                            style={{ color: 'rgb(156 163 175)' }}
                                            onMouseEnter={(e) => e.target.style.color = accentColor}
                                            onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 - Services */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Servicios</h4>
                            <ul className="space-y-3">
                                {services.map((service, index) => (
                                    <li key={index} className="text-gray-400">
                                        {service}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4 - Contact */}
                        <div>
                            <h4 className="text-white font-bold text-lg mb-6">Contacto</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div style={{ color: accentColor }}>
                                        {getIcon('map')}
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {contactInfo.address.map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                {i < contactInfo.address.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div style={{ color: accentColor }}>
                                        {getIcon('phone')}
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {contactInfo.phones.map((phone, i) => (
                                            <React.Fragment key={i}>
                                                {phone}
                                                {i < contactInfo.phones.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div style={{ color: accentColor }}>
                                        {getIcon('mail')}
                                    </div>
                                    <span className="text-gray-400 text-sm">
                                        {contactInfo.emails.map((email, i) => (
                                            <React.Fragment key={i}>
                                                {email}
                                                {i < contactInfo.emails.length - 1 && <br />}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div 
                        className="pt-8 border-t"
                        style={{ borderColor: `${accentColor}33` }}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-500 text-sm text-center md:text-left">
                                &copy; {new Date().getFullYear()} Hotel La Petaca. Todos los derechos reservados.
                            </p>
                            <div className="flex gap-6 text-sm">
                                <a 
                                    href="#" 
                                    className="text-gray-500 transition-colors"
                                    onMouseEnter={(e) => e.target.style.color = accentColor}
                                    onMouseLeave={(e) => e.target.style.color = 'rgb(107 114 128)'}
                                >
                                    Política de Privacidad
                                </a>
                                <a 
                                    href="#" 
                                    className="text-gray-500 transition-colors"
                                    onMouseEnter={(e) => e.target.style.color = accentColor}
                                    onMouseLeave={(e) => e.target.style.color = 'rgb(107 114 128)'}
                                >
                                    Términos y Condiciones
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Tagline */}
                <div className="bg-[#0a0604] py-4">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-gray-600 text-xs">
                            {tagline}
                        </p>
                    </div>
                </div>
            </footer>
    );
};

export default FooterLaPetaca;
