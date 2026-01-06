import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

// Función helper para convertir HTML a texto plano y cortar palabras
const getServiceDescription = (service, maxWords = 20) => {
    if (service.summary) {
        return service.summary;
    }

    if (service.description) {
        // Convertir HTML a texto plano
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = service.description;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        // Cortar a maxWords palabras
        const words = plainText.trim().split(/\s+/);
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return plainText;
    }

    return 'Descripción no disponible.';
};

const ServiceCard = ({ service }) => {
    const imageUrl = service.image
        ? `/storage/images/service/${service.image}`
        : null;

    // Construir URL del servicio
    const serviceUrl = service.slug ? `/servicio/${service.slug}` : '#';

    return (
        <a
            href={serviceUrl}
            className="group bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 cursor-pointer block"
        >
            {imageUrl && (
                <div className="w-12 h-12 mb-6 overflow-hidden rounded-full group-hover:scale-110 transition-transform duration-300">
                    <img
                        src={imageUrl}
                        alt={service.name}
                        className="w-full h-full object-contain"
                        onError={(e) =>
                        (e.target.src =
                            "/api/cover/thumbnail/null")
                        }
                    />
                </div>
            )}

            <h3 className="text-xl font-light text-primary mb-3 whitespace-pre-line">
                <TextWithHighlight
                    text={service.name}
                    color="bg-accent"
                />
            </h3>
            <p className="text-neutral-dark font-light leading-relaxed whitespace-pre-line">
                {getServiceDescription(service, 20)}
            </p>
        </a>
    );
};

const CategoryHeader = ({ category, color = 'bg-primary', isExpanded, onToggle, isMobile }) => {
    const imageUrl = category.image
        ? `/storage/images/service_category/${category.image}`
        : null;

    return (
        <button
            onClick={onToggle}
            className={`flex items-center justify-between w-full  md:mb-8 md:cursor-default group ${isExpanded ? 'mb-8' : ''}`}
        >
            <div className="flex items-center gap-4">
                {imageUrl ? (
                    <div className="min-w-12 min-h-12 max-w-12 max-h-12 overflow-hidden rounded-full bg-primary p-2">
                        <img
                            src={imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                            (e.target.src =
                                "/api/cover/thumbnail/null")
                            }
                        />
                    </div>
                ) : (
                    <div className={`p-3 ${color} rounded-xl flex items-center justify-center`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                )}
                <h3 className="text-2xl md:text-3xl font-light text-primary whitespace-pre-line text-left">
                    <TextWithHighlight
                        text={category.name}
                        color="bg-accent"
                    />
                </h3>
            </div>
            {/* Flecha solo visible en móvil */}
            <ChevronDown 
                className={`w-6 h-6 text-primary transition-transform duration-300 md:hidden ${isExpanded ? 'rotate-180' : ''}`}
            />
        </button>
    );
};

const ServiceWebQuirurgica = ({ data, items = [] }) => {
    // Estado para acordeón en móvil (índice de categoría expandida, -1 = ninguna)
    const [expandedCategory, setExpandedCategory] = useState(-1);

    // Agrupar servicios por categoría
    const groupedServices = items.reduce((acc, service) => {
        const categoryId = service.service_category_id || 'sin-categoria';
        if (!acc[categoryId]) {
            acc[categoryId] = {
                category: service.category || { name: 'Sin Categoría', order_index: 999 },
                services: []
            };
        }
        acc[categoryId].services.push(service);
        return acc;
    }, {});

    // Ordenar categorías por order_index
    const categories = Object.values(groupedServices).sort((a, b) => {
        const orderA = a.category?.order_index ?? 999;
        const orderB = b.category?.order_index ?? 999;
        return orderA - orderB;
    });

    const toggleCategory = (index) => {
        setExpandedCategory(expandedCategory === index ? -1 : index);
    };

    return (
        <section id="servicios" className={`py-24 px-primary 2xl:px-0 bg-sections-color ${data?.class || ''}`}>
            <div className=" 2xl:max-w-7xl mx-auto space-y-20">
                {/* Encabezado */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight whitespace-pre-line">
                        <TextWithHighlight
                            text={data?.name || 'Servicios *Especializados*'}
                            color="bg-primary font-light"
                        />
                    </h2>
                    <div className=" mx-auto"></div>
                    {data?.description && (
                        <p className="text-lg text-neutral-dark font-light leading-relaxed whitespace-pre-line">
                            <TextWithHighlight
                                text={data.description}
                                color="bg-primary"
                            />
                        </p>
                    )}
                </div>

                {/* Categorías con sus servicios */}
                <div className="space-y-8 md:space-y-16">
                    {categories.map((group, index) => {
                        // Alternar colores para los iconos
                        const iconColor = index % 2 === 0 ? 'bg-primary' : 'bg-accent';
                        const isExpanded = expandedCategory === index;

                        return (
                            <div key={index} className="border-b border-gray-200 pb-6 md:border-0 md:pb-0">
                                <CategoryHeader
                                    category={group.category}
                                    color={iconColor}
                                    isExpanded={isExpanded}
                                    onToggle={() => toggleCategory(index)}
                                />
                                {/* En móvil: acordeón | En desktop: siempre visible */}
                                <div className={`
                                    grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
                                    overflow-hidden transition-all duration-300 ease-in-out
                                    ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'}
                                `}>
                                    {group.services.map((service, serviceIndex) => (
                                        <ServiceCard key={serviceIndex} service={service} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ServiceWebQuirurgica;
