import React from "react";

const InnovationSimple = ({ data, items = [] }) => {
    return (
        <section id={data?.element_id || null} className="py-12" style={{ backgroundColor: data?.bg_color }}>
            <div className="max-w-7xl mx-auto px-5 2xl:px-0">
              
                <div className="space-y-2">
                    {items?.filter(item => item.visible && item.status).map((innovation, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div 
                                key={innovation.id || index} 
                                className={`flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl ${
                                    isEven ? '' : 'md:flex-row-reverse'
                                }`}
                            >
                                {innovation.image && (
                                    <div className="w-full md:w-2/5 flex-shrink-0 overflow-hidden rounded-lg group">
                                        <img
                                            src={`/storage/images/innovation/${innovation.image}`}
                                            alt={innovation.name}
                                            className="w-full aspect-square object-contain transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="mb-4">
                                        <h3 className="text-3xl font-bold mb-2 customtext-neutral-dark">{innovation.name}</h3>
                                        <div className="border-b-4 border-primary" style={{ width: '100px' }}></div>
                                    </div>
                                    <p className="text-gray-900 leading-relaxed text-lg">{innovation.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default InnovationSimple;
