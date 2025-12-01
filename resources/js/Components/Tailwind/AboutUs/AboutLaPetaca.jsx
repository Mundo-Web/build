import React from 'react';

const AboutLaPetaca = ({ data }) => {
    // Data de prueba
    const stats = data?.stats || [
        { number: '15+', label: 'Años de Experiencia' },
        { number: '5000+', label: 'Huéspedes Felices' },
        { number: '20+', label: 'Habitaciones' },
        { number: '100%', label: 'Satisfacción' },
    ];

    const values = data?.values || [
        {
            icon: 'heart',
            title: 'Pasión por el Servicio',
            description: 'Nos dedicamos a superar las expectativas de cada huésped con atención personalizada.',
        },
        {
            icon: 'leaf',
            title: 'Compromiso Ambiental',
            description: 'Protegemos y preservamos el ecosistema amazónico con prácticas sostenibles.',
        },
        {
            icon: 'award',
            title: 'Excelencia',
            description: 'Calidad premium en cada detalle, desde nuestras instalaciones hasta el servicio.',
        },
        {
            icon: 'users',
            title: 'Comunidad Local',
            description: 'Trabajamos con comunidades amazónicas promoviendo el desarrollo sostenible.',
        },
    ];

    const accentColor = data?.accentColor || '#78673A';
    const mainImage = data?.mainImage || 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=1200';
    const ctaImage = data?.ctaImage || 'https://images.pexels.com/photos/975771/pexels-photo-975771.jpeg?auto=compress&cs=tinysrgb&w=1200';
    
    const getValueIcon = (iconName) => {
        const icons = {
            'heart': <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
            'leaf': <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
            'award': <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
            'users': <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        };
        return icons[iconName] || icons['heart'];
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-[#0a0604] via-[#281409] to-[#0a0604]">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: accentColor }}>
                            Sobre Nosotros
                        </h2>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Una historia de conexión con la naturaleza y hospitalidad amazónica
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
                        <div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src={mainImage}
                                    alt="Hotel La Petaca"
                                    className="w-full h-[500px] object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#281409]/80 to-transparent"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold" style={{ color: accentColor }}>
                                Bienvenidos al Corazón del Amazonas
                            </h3>

                            <p className="text-gray-300 leading-relaxed">
                                Hotel La Petaca nace del amor profundo por la región amazónica y su cultura milenaria.
                                Nuestro nombre e identidad visual se inspiran en la rica iconografía de las culturas
                                ancestrales de la región, honrando su legado y preservando su esencia.
                            </p>

                            <p className="text-gray-300 leading-relaxed">
                                Desde hace más de 15 años, hemos creado un espacio donde el confort moderno se fusiona
                                armoniosamente con la majestuosidad de la selva. Cada rincón de nuestro hotel cuenta
                                una historia, cada detalle refleja nuestro compromiso con la excelencia y el respeto
                                por el entorno natural.
                            </p>

                            <p className="text-gray-300 leading-relaxed">
                                Ubicados en un privilegiado enclave selvático, ofrecemos a nuestros huéspedes la
                                oportunidad única de desconectar del mundo moderno y reconectar con la naturaleza
                                en su forma más pura, sin sacrificar el lujo y la comodidad.
                            </p>

                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-16 h-1" style={{ backgroundColor: accentColor }}></div>
                                <p className="font-semibold italic" style={{ color: accentColor }}>
                                    "Donde la selva abraza tu espíritu"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-8 bg-gradient-to-br from-[#281409]/60 to-[#281409]/30 rounded-2xl border transition-all duration-300 hover:transform hover:scale-105"
                                style={{ borderColor: `${accentColor}33` }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = `${accentColor}99`}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor}33`}
                            >
                                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: accentColor }}>
                                    {stat.number}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Values */}
                    <div>
                        <h3 className="text-3xl font-bold text-center mb-12" style={{ color: accentColor }}>
                            Nuestros Valores
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div
                                    key={index}
                                    className="group text-center p-8 bg-gradient-to-br from-[#281409]/60 to-[#281409]/30 rounded-2xl border transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl"
                                    style={{ borderColor: `${accentColor}33` }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = `${accentColor}99`}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor}33`}
                                >
                                    <div 
                                        className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300"
                                        style={{ 
                                            backgroundColor: `${accentColor}33`,
                                            color: accentColor
                                        }}
                                    >
                                        {getValueIcon(value.icon)}
                                    </div>

                                    <h4 className="text-xl font-bold text-white mb-4 transition-colors">
                                        {value.title}
                                    </h4>

                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 relative rounded-2xl overflow-hidden">
                        <img
                            src={ctaImage}
                            alt="Amazonas"
                            className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-[#281409]/70 flex items-center justify-center">
                            <div className="text-center px-4">
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    Vive la Experiencia Amazónica
                                </h3>
                                <p className="text-gray-200 text-lg mb-8">
                                    Descubre un mundo donde cada momento se convierte en un recuerdo inolvidable
                                </p>
                                <button 
                                    className="px-8 py-4 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-xl"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    Reserva Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .group:hover .inline-flex {
                        background-color: ${accentColor} !important;
                        color: white !important;
                    }
                    .group:hover h4 {
                        color: ${accentColor} !important;
                    }
                `}</style>
        </section>
    );
};

export default AboutLaPetaca;
