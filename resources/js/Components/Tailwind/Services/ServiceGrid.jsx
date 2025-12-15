import React from "react";

const ServiceGrid = ({ data, items = [] }) => {
    return (
        <section className="py-12 bg-white" style={{ backgroundColor: data?.bg_color }}>
            <div className="max-w-7xl mx-auto px-5 2xl:px-0">
                {data?.title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: data?.title_color }}>
                            {data.title}
                        </h2>
                        {data?.subtitle && (
                            <p className="text-xl text-gray-600" style={{ color: data?.subtitle_color }}>
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items?.filter(item => item.visible && item.status).map((service, index) => (
                        <div 
                            key={service.id || index}
                            className="group bg-white rounded-xl overflow-hidden"
                        >
                            {service.image && (
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`/storage/images/service/${service.image}`}
                                        alt={service.name}
                                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="mb-3">
                                    <h3 className="text-xl font-bold mb-1 customtext-neutralDark">
                                        {service.name}
                                    </h3>
                                    <div className="border-b-2 border-primary" style={{ width: '300px' }}></div>
                                </div>
                                {service.description && (
                                    <p className="text-sm customtext-neutral-dark leading-relaxed line-clamp-3">
                                        {service.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceGrid;
