import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AboutSidebar = ({ data, filteredData, items }) => {
    const sections = items?.filter(item => item.status) || [];
    const [selectedSection, setSelectedSection] = useState(sections[0] || null);
    const [strengths, setStrengths] = useState([]);

    // Cargar strengths desde API solo si hay una sección "valores"
    useEffect(() => {
        const hasValoresSection = sections.some(section => 
            section.correlative?.toLowerCase().includes('valor') || 
            section.name?.toLowerCase().includes('valor')
        );

        if (hasValoresSection) {
            fetch('/api/strengths')
                .then(res => res.json())
                .then(data => setStrengths(data))
                .catch(err => console.error('Error loading strengths:', err));
        }
    }, [sections]);

    return (
        <section className={`${data?.class_container || 'bg-neutral-900'}`}>
            <div className="mx-auto py-20 px-4 md:px-6 lg:px-8 2xl:px-0 2xl:max-w-7xl">
                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-12 gap-0">
                    {/* Sidebar - Section List (Negro) */}
                    <div className="lg:col-span-3 bg-neutral-900 text-white py-12 px-6">
                        <nav className="space-y-0">
                            {sections.map((section, index) => (
                                <button
                                    key={section.id || index}
                                    onClick={() => setSelectedSection(section)}
                                    className={`w-full text-left px-0 py-4 border-b border-white/5 transition-all duration-300 ${
                                        selectedSection?.id === section.id
                                            ? 'customtext-primary font-bold'
                                            : 'text-white hover:customtext-primary'
                                    }`}
                                >
                                    <span className="text-lg">
                                        {section.title}
                                    </span>
                                </button>
                            ))}
                        </nav>

                        {/* Strengths/Fortalezas Section en Sidebar */}
                        {strengths && strengths.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6">
                                    {data?.strengths_title || "Nuestras Fortalezas"}
                                </h3>
                                <div className="space-y-6">
                                    {strengths.map((strength, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            {strength.image && (
                                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary p-3 flex items-center justify-center">
                                                    <img
                                                        src={`/storage/images/strength/${strength.image}`}
                                                        alt={strength.name}
                                                        className="w-full h-full object-contain grayscale brightness-0 invert"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-white font-semibold text-base mb-2">
                                                    {strength.name}
                                                </h4>
                                                <p className="text-white/70 text-sm leading-relaxed">
                                                    {strength.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {selectedSection && (
                                <motion.div
                                    key={selectedSection.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Title Banner (Amarillo/Primary) */}
                                    <div className="bg-primary px-12 py-8">
                                        <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900">
                                            {selectedSection.title}
                                        </h2>
                                    </div>

                                    {/* Content: Texto arriba + Imagen abajo */}
                                    <div className="bg-neutral-800">
                                        {/* Description Content (Arriba - Fondo oscuro) */}
                                        <div className="p-12 text-white">
                                            {selectedSection.description && (
                                                <div 
                                                    className="prose prose-lg prose-invert max-w-none text-white leading-relaxed"
                                                    dangerouslySetInnerHTML={{ __html: selectedSection.description }}
                                                />
                                            )}

                                            {!selectedSection.description && selectedSection.extract && (
                                                <p className="text-white text-lg leading-relaxed">
                                                    {selectedSection.extract}
                                                </p>
                                            )}

                                            {!selectedSection.description && !selectedSection.extract && selectedSection.summary && (
                                                <p className="text-white text-lg leading-relaxed">
                                                    {selectedSection.summary}
                                                </p>
                                            )}

                                            {/* CTA Button */}
                                            {selectedSection.link && (
                                                <div className="mt-8">
                                                    <a
                                                        href={selectedSection.link}
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

                                        {/* Strengths Grid (Solo para sección de valores) */}
                                        {strengths && strengths.length > 0 && 
                                         (selectedSection.correlative?.toLowerCase().includes('valor') || 
                                          selectedSection.name?.toLowerCase().includes('valor')) && (
                                            <div className="p-12 bg-neutral-900">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {strengths.map((strength, index) => (
                                                        <div key={index} className="flex items-start gap-4">
                                                            {strength.image && (
                                                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary p-3 flex items-center justify-center">
                                                                    <img
                                                                        src={`/storage/images/strength/${strength.image}`}
                                                                        alt={strength.name}
                                                                        className="w-full h-full object-contain grayscale brightness-0 invert"
                                                                        onError={(e) => {
                                                                            e.target.parentElement.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <h4 className="text-white font-semibold text-lg mb-2">
                                                                    {strength.name}
                                                                </h4>
                                                                <p className="text-white/70 text-base leading-relaxed">
                                                                    {strength.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Image (Debajo del texto) - Solo si existe */}
                                        {(selectedSection.image || selectedSection.banner) && (
                                            <div className="relative h-[400px] lg:h-[500px]">
                                                <img
                                                    src={selectedSection.image 
                                                        ? `/storage/images/aboutus/${selectedSection.image}`
                                                        : `/storage/images/aboutus/${selectedSection.banner}`
                                                    }
                                                    alt={selectedSection.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/api/cover/thumbnail/null";
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Empty State */}
                        {!selectedSection && sections.length === 0 && (
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
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        No hay información disponible
                                    </h3>
                                    <p className="text-neutral-400">
                                        Las secciones se mostrarán aquí una vez que sean agregadas
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

export default AboutSidebar;
