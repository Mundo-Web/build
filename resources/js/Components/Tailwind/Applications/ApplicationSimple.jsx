import React from 'react';

const ApplicationSimple = ({ data, items }) => {
    return (
        <section id={data?.element_id || null} className="py-20 sm:py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4">
                        {data?.title || 'Aplicaciones Ilimitadas'}
                    </h2>
                    <p className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto">
                        {data?.subtitle || 'Un material, infinitas posibilidades para dar vida a tus proyectos'}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items?.map((application, index) => {
                        const backgroundImage = application.background_image 
                            ? `/storage/images/application/${application.background_image}` 
                            : '/api/cover/thumbnail/null';
                        
                        return (
                            <div
                                key={application.id || index}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                {/* Background Image con overlay */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <img
                                        src={backgroundImage}
                                        alt={application.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                    <div className="absolute inset-0 bg-black/40  transition-all duration-500"></div>
                                </div>

                                {/* Content */}
                                <div className="relative p-8 h-full min-h-[320px] flex flex-col justify-between">
                                    {/* Decorative circle - similar a BenefitSimple */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                                    <div className="relative">
                                        {application.image && (
                                            <div className="p-5 max-w-max rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-white/30 shadow-lg overflow-hidden">
                                                <img 
                                                    src={`/storage/images/application/${application.image}`}
                                                    alt={application.name}
                                                    className="w-12 h-12 object-contain"
                                                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                />
                                            </div>
                                        )}

                                        <h3 className="text-5xl font-light text-white mb-4 group-hover:text-white/90 transition-colors">
                                            {application.name}
                                        </h3>

                                        <p className="text-white/90 leading-relaxed">
                                            {application.description}
                                        </p>
                                    </div>

                                    {/* Bottom accent line - similar a BenefitSimple */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {data?.footer_text && (
                    <div className="mt-16 text-center">
                        <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
                            {data?.footer_image && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Workshop"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://images.pexels.com/photos/5974402/pexels-photo-5974402.jpeg?auto=compress&cs=tinysrgb&w=1200'}
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

export default ApplicationSimple;
