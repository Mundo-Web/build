import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ServiceSidebar = ({ data, items = [] }) => {
    const [selectedService, setSelectedService] = useState(items[0] || null);

    return (
        <section className={`${data?.class_container || 'bg-neutral-900'}`}>
            <div className="mx-auto py-20 px-4 md:px-6 lg:px-8 2xl:px-0 2xl:max-w-7xl">
                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-0">
                    {/* Sidebar - Service List (Negro) */}
                    <div className="lg:col-span-3 bg-neutral-900 text-white py-12 px-6">
                     
                        <nav className="space-y-0">
                            {items.map((service, index) => (
                                <button
                                    key={service.id || index}
                                    onClick={() => setSelectedService(service)}
                                    className={`w-full text-left px-0 py-4 border-b border-white/5 transition-all duration-300 ${
                                        selectedService?.id === service.id
                                            ? 'customtext-primary '
                                            : 'text-white hover:text-primary'
                                    }`}
                                >
                                    <span className="text-lg">
                                        {service.name}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {selectedService && (
                                <motion.div
                                    key={selectedService.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Title Banner (Amarillo/Primary) */}
                                    <div className="bg-primary px-12 py-8">
                                        <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900">
                                            {selectedService.name}
                                        </h2>
                                    </div>

                                    {/* Content Grid: Texto (izq) + Imagen (der) */}
                                    <div className="grid lg:grid-cols-2 gap-0 bg-neutral-800">
                                        {/* Description Content (Izquierda - Fondo oscuro) */}
                                        <div className="p-12 text-white flex flex-col justify-center">
                                            {selectedService.description && (
                                              
                                                <p className=" max-w-none text-lg text-white whitespace-pre-line">
                                                    {selectedService.description}
                                                </p>
                                            )}

                                            {!selectedService.description && selectedService.extract && (
                                                <p className="text-white text-lg leading-relaxed">
                                                    {selectedService.extract}
                                                </p>
                                            )}

                                            {!selectedService.description && !selectedService.extract && selectedService.summary && (
                                                <p className="text-white text-lg leading-relaxed">
                                                    {selectedService.summary}
                                                </p>
                                            )}

                                            {/* CTA Button */}
                                            {selectedService.link && (
                                                <div className="mt-8">
                                                    <a
                                                        href={selectedService.link}
                                                        className="inline-flex items-center gap-3 px-8 py-3 bg-primary text-neutral-900 font-bold hover:bg-primary/90 transition-all duration-300"
                                                    >
                                                        <span>Más información</span>
                                                        <svg 
                                                            className="w-5 h-5" 
                                                            fill="none" 
                                                            stroke="currentColor" 
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={2} 
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3" 
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image (Derecha) */}
                                        <div className="relative min-h-[500px] lg:min-h-[600px]">
                                            {selectedService.banner ? (
                                                <img
                                                    src={`/storage/images/service/${selectedService.banner}`}
                                                    alt={selectedService.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : selectedService.image ? (
                                                <img
                                                    src={`/storage/images/service/${selectedService.image}`}
                                                    alt={selectedService.name}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-neutral-700 flex items-center justify-center">
                                                    <span className="text-white/30 text-lg">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Empty State */}
                        {!selectedService && items.length === 0 && (
                            <div className="bg-neutral-800 p-12 text-center min-h-[600px] flex items-center justify-center">
                                <div>
                                    <div className="w-24 h-24 mx-auto mb-6 bg-neutral-700 rounded-full flex items-center justify-center">
                                        <svg 
                                            className="w-12 h-12 text-neutral-500" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        No hay servicios disponibles
                                    </h3>
                                    <p className="text-neutral-400">
                                        Los servicios se mostrarán aquí una vez que sean agregados
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSidebar;
