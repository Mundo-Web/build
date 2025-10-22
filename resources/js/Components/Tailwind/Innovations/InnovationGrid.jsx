import React from "react";

const InnovationGrid = ({ data, items = [] }) => {
    return (
        <section className="py-12 bg-gray-50" style={{ backgroundColor: data?.bg_color }}>
            <div className="container mx-auto px-4">
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items?.filter(item => item.visible && item.status).map((innovation, index) => (
                        <div 
                            key={innovation.id || index}
                            className="group bg-white rounded-lg overflow-hidden"
                        >
                            {innovation.image && (
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`/storage/images/innovation/${innovation.image}`}
                                        alt={innovation.name}
                                        className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="mb-3">
                                    <h3 className="text-xl font-bold mb-1 customtext-neutralDark">
                                        {innovation.name}
                                    </h3>
                                    <div className="border-b-2 border-primary" style={{ width: '300px' }}></div>
                                </div>
                                {innovation.description && (
                                    <p className="customtext-neutral-dark leading-relaxed">
                                        {innovation.description}
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

export default InnovationGrid;
