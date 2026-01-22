import React from 'react';

const BenefitSimple = ({ data, items }) => {
    return (
        <section id={data?.element_id || null} className="py-20 sm:py-24 bg-white relative overflow-hidden">
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -ml-48"></div>
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -mr-48"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl  md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4">
                        {data?.title || 'Beneficios que Marcan la Diferencia'}
                    </h2>
                    <p className="text-lg sm:text-xl text-neutral-dark  max-w-3xl mx-auto">
                        {data?.subtitle || 'En Panel Pro, combinamos décadas de experiencia en el sector maderero con un servicio ágil y personalizado. Nos especializamos en brindar soluciones eficientes para que carpinteros y fabricantes logren resultados de alta gama con la mejor relación costo-beneficio'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items?.map((benefit, index) => (
                        <div
                            key={benefit.id || index}
                            className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="relative">
                                {benefit.image && (
                                    <div 
                                        className="p-5 max-w-max rounded-full bg-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg overflow-hidden"
                                        style={{
                                             backgroundColor: benefit.bg_color==='transparent' ? 'var(--bg-primary)' : (benefit.bg_color || 'var(--bg-primary)')
                                        }}
                                    >
                                        <img 
                                            src={`/storage/images/benefit/${benefit.image}`}
                                            alt={benefit.name}
                                            className="w-12 h-12 object-contain"
                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                        />
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-primary/80 transition-colors">
                                    {benefit.name}
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    ))}
                </div>

                {data?.footer_text && (
                    <div className="mt-16 text-center">
                        <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
                            {data?.footer_image && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Professional work"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                    <div className="absolute inset-0 bg-primary/95"></div>
                                </div>
                            )}
                            <div className="relative p-8 sm:p-12 text-white">
                                <p className="text-2xl sm:text-3xl font-bold mb-2">
                                    {data.footer_text}
                                </p>
                                {data?.footer_subtitle && (
                                    <p className="text-lg sm:text-xl opacity-90">
                                        {data.footer_subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BenefitSimple;
