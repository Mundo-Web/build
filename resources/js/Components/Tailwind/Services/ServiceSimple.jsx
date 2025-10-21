import React from "react";

const ServiceSimple = ({ data, items = [] }) => {
    return (
        <section className="py-12" style={{ backgroundColor: data?.bg_color }}>
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
                <div className="space-y-8">
                    {items?.filter(item => item.visible && item.status).map((service, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div 
                                key={service.id || index} 
                                className={`flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-lg ${
                                    isEven ? '' : 'md:flex-row-reverse'
                                }`}
                            >
                                {service.image && (
                                    <div className="w-full md:w-1/3 flex-shrink-0 overflow-hidden rounded-lg group">
                                        <img
                                            src={`/storage/images/service/${service.image}`}
                                            alt={service.name}
                                            className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="mb-3">
                                        <h3 className="text-2xl customtext-neutral-dark font-bold mb-1 ">{service.name}</h3>
                                        <div className="border-b-4 border-primary" style={{ width: '100px' }}></div>
                                    </div>
                                    <p className="customtext-neutral-light leading-relaxed">{service.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServiceSimple;
