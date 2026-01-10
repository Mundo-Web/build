import React from 'react';

const ApplicationSimple = ({ data, items }) => {
    return (
        <section className="py-20 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4">
                        {data?.title || 'Aplicaciones Ilimitadas'}
                    </h2>
                    <p className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto">
                        {data?.subtitle || 'Un material, infinitas posibilidades para dar vida a tus proyectos'}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items?.map((application, index) => {
                        const backgroundImage = application.background_image 
                            ? `/storage/images/application/${application.background_image}` 
                            : '/api/cover/thumbnail/null';
                        
                        return (
                            <div
                                key={application.id || index}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <img
                                        src={backgroundImage}
                                        alt={application.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                       onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                    <div className="absolute inset-0 bg-primary opacity-80  transition-all duration-500"></div>
                                </div>

                                <div className="relative p-8 h-full min-h-[280px] flex flex-col justify-between">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>

                                    <div className="relative">
                                        {application.image && (
                                            <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border border-white/30 overflow-hidden">
                                                <img 
                                                    src={`/storage/images/application/${application.image}`}
                                                    alt={application.name}
                                                    className="w-10 h-10 object-contain"
                                                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                />
                                            </div>
                                        )}

                                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                                            {application.name}
                                        </h3>

                                        <p className="text-white/90 leading-relaxed group-hover:text-white transition-colors">
                                            {application.description}
                                        </p>
                                    </div>

                                 
                                </div>
                            </div>
                        );
                    })}
                </div>

                {data?.footer_text && (
                    <div className="mt-16 relative overflow-hidden rounded-3xl shadow-2xl">
                        <div className="absolute inset-0">
                            {data?.footer_image ? (
                                <img
                                    src={`/storage/images/system/${data.footer_image}`}
                                    alt="Workshop"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://images.pexels.com/photos/5974402/pexels-photo-5974402.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                                />
                            ) : (
                                <img
                                    src="https://images.pexels.com/photos/5974402/pexels-photo-5974402.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Workshop"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/95"></div>
                        </div>

                        <div className="relative p-8 sm:p-12 text-white text-center">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                {data.footer_text}
                            </h3>
                            {data?.footer_subtitle && (
                                <p className="text-lg sm:text-xl opacity-90 mb-6 max-w-2xl mx-auto">
                                    {data.footer_subtitle}
                                </p>
                            )}
                            {data?.footer_button_text && (
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    {data.footer_button_text}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ApplicationSimple;
