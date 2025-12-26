import React from "react";

const ServiceDetailSimple = ({ data, items = [], currentService = null }) => {
    const service = currentService || (items.length > 0 ? items[0] : null);

    if (!service) {
        return (
            <section className={`py-24 px-4 bg-sections-color ${data?.class || ''}`}>
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600">No hay servicio disponible</p>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-12 px-4 bg-sections-color ${data?.class || ''}`}>
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header con imagen de fondo */}
                    {service.background_image && (
                        <div className="relative h-96 overflow-hidden">
                            <img
                                src={`/storage/images/service/${service.background_image}`}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="max-w-3xl">
                                    <h1 className="text-4xl md:text-5xl font-light text-white mb-3">
                                        {service.name}
                                    </h1>
                                    {service.summary && (
                                        <p className="text-xl text-white/90 font-light">
                                            {service.summary}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {service.category && (
                                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                                                {service.category.name}
                                            </span>
                                        )}
                                        {service.subcategory && (
                                            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                                                {service.subcategory.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenido */}
                    <div className="p-8 md:p-12">
                        {/* Título si no hay imagen de fondo */}
                        {!service.background_image && (
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-5xl font-light text-primary mb-4">
                                    {service.name}
                                </h1>
                                {service.summary && (
                                    <p className="text-xl text-gray-600 font-light mb-4">
                                        {service.summary}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {service.category && (
                                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
                                            {service.category.name}
                                        </span>
                                    )}
                                    {service.subcategory && (
                                        <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm">
                                            {service.subcategory.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Descripción completa */}
                        {service.description && (
                            <div className="prose max-w-none mb-12">
                                <div 
                                    className="text-gray-600 font-light leading-relaxed text-lg"
                                    dangerouslySetInnerHTML={{ __html: service.description }}
                                />
                            </div>
                        )}

                        {/* Galería de imágenes */}
                        {service.images && service.images.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-3xl font-light text-primary mb-6">Galería</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {service.images.map((img, index) => (
                                        <div key={index} className="aspect-video rounded-xl overflow-hidden shadow-lg group">
                                            <img
                                                src={`/storage/images/service/${img.image}`}
                                                alt={`${service.name} - ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            {/* Características */}
                            {service.features && service.features.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-light text-primary mb-6">Características</h2>
                                    <div className="space-y-4">
                                        {service.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-4 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                                    <i className="mdi mdi-check text-white text-xl"></i>
                                                </div>
                                                <p className="text-gray-700 font-light leading-relaxed pt-1">
                                                    {feature.feature}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Especificaciones */}
                            {service.specifications && service.specifications.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-light text-primary mb-6">Especificaciones</h2>
                                    <div className="space-y-4">
                                        {service.specifications.map((spec, index) => (
                                            <div key={index} className="border-l-4 border-primary pl-5 py-3 bg-gray-50 rounded-r-xl hover:shadow-md transition-shadow">
                                                <h3 className="font-medium text-primary mb-2 text-lg">
                                                    {spec.title}
                                                </h3>
                                                {spec.description && (
                                                    <p className="text-gray-600 font-light leading-relaxed">
                                                        {spec.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PDFs y Videos */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* PDFs */}
                            {service.pdf && service.pdf.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-light text-primary mb-6">Documentos</h2>
                                    <div className="space-y-3">
                                        {service.pdf.map((pdf, index) => (
                                            <a
                                                key={index}
                                                href={`/storage/pdfs/service/${pdf.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm hover:shadow-lg"
                                            >
                                                <i className="mdi mdi-file-pdf text-red-600 group-hover:text-white text-3xl"></i>
                                                <span className="font-light flex-1">{pdf.name}</span>
                                                <i className="mdi mdi-download text-gray-400 group-hover:text-white"></i>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Videos */}
                            {service.linkvideo && service.linkvideo.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-light text-primary mb-6">Videos</h2>
                                    <div className="space-y-4">
                                        {service.linkvideo.map((video, index) => (
                                            <div key={index} className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                                                <iframe
                                                    src={video.url.replace('watch?v=', 'embed/')}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                    title={`Video ${index + 1}`}
                                                ></iframe>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetailSimple;
