import React from 'react';

const ServiceLaPetaca = ({ data, items }) => {
    // No mostrar la sección si no hay items
    if (!items || items.length === 0) {
        return null;
    }

    const showPreview = data?.showPreview || false;
    const displayServices = showPreview ? items.slice(0, 4) : items;

    // No mostrar si después de filtrar no hay servicios
    if (!displayServices || displayServices.length === 0) {
        return null;
    }
    
    const accentColor = data?.accentColor || '#78673A';
    const title = data?.title || (showPreview ? 'Servicios Destacados' : 'Todos Nuestros Servicios');
    const subtitle = data?.subtitle || 'Experiencias únicas diseñadas para hacer de tu estadía un momento inolvidable';

    // Icono por defecto para los servicios
    const defaultIcon = (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    );

    return (
        <section className="py-20 px-4 bg-[#0a0604]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: accentColor }}>
                            {title}
                        </h2>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayServices.map((service, index) => (
                            <div
                                key={service.id || index}
                                className="group relative bg-gradient-to-br from-[#281409]/60 to-[#281409]/30 p-8 rounded-2xl border transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                                style={{ 
                                    borderColor: `${accentColor}33`,
                                    animationDelay: `${index * 100}ms` 
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = `${accentColor}99`;
                                    e.currentTarget.querySelector('.service-bg').style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = `${accentColor}33`;
                                    e.currentTarget.querySelector('.service-bg').style.opacity = '0';
                                }}
                            >
                                <div 
                                    className="service-bg absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 rounded-2xl"
                                    style={{ 
                                        backgroundImage: `linear-gradient(to bottom right, ${accentColor}00, ${accentColor}1a)`
                                    }}
                                ></div>

                                <div className="relative z-10">
                                    {/* Mostrar imagen si existe, sino mostrar icono por defecto */}
                                    {service.image ? (
                                        <div className="mb-6">
                                            <img 
                                                src={`/storage/images/service/${service.image}`}
                                                alt={service.name}
                                                className="w-16 h-16 object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'inline-flex';
                                                }}
                                            />
                                            <div 
                                                className="service-icon inline-flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-300"
                                                style={{ 
                                                    backgroundColor: `${accentColor}33`,
                                                    color: accentColor,
                                                    display: 'none'
                                                }}
                                            >
                                                {defaultIcon}
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="service-icon inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-300"
                                            style={{ 
                                                backgroundColor: `${accentColor}33`,
                                                color: accentColor
                                            }}
                                        >
                                            {defaultIcon}
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:opacity-100 transition-colors">
                                        {service.name}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    {showPreview && (
                        <div className="text-center mt-12">
                            <button 
                                className="px-8 py-4 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
                                style={{ backgroundColor: accentColor }}
                            >
                                Ver Todos los Servicios
                            </button>
                        </div>
                    )}
                </div>

            <style jsx>{`
                .group:hover .service-icon {
                    background-color: ${accentColor} !important;
                    color: white !important;
                    transform: scale(1.1);
                }
                .group:hover h3 {
                    color: ${accentColor} !important;
                }
            `}</style>
        </section>
    );
};

export default ServiceLaPetaca;
