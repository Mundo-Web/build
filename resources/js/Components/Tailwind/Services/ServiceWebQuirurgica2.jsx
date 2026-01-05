import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

// Función helper para convertir HTML a texto plano
const getServiceDescription = (service, maxWords = 30) => {
    if (service.summary) {
        return service.summary;
    }

    if (service.description) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = service.description;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        const words = plainText.trim().split(/\s+/);
        if (words.length > maxWords) {
            return words.slice(0, maxWords).join(' ') + '...';
        }
        return plainText;
    }

    return '';
};

const ServiceCard = ({ service, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const imageUrl = service.image
        ? `/storage/images/service/${service.image}`
        : `/storage/images/service/${service.background_image}`;

    const serviceUrl = service.slug ? `/servicio/${service.slug}` : '#';

    // Patrón Fibonacci adaptado - sin aspect ratios, el grid controla la altura
    const patterns = [
        { cols: 'col-span-12 md:col-span-8' },  // Grande horizontal
        { cols: 'col-span-12 md:col-span-4' },   // Vertical
        { cols: 'col-span-12 md:col-span-4' },  // Cuadrado
        { cols: 'col-span-12 md:col-span-4' },  // Cuadrado
        { cols: 'col-span-12 md:col-span-4' },  // Cuadrado
        { cols: 'col-span-12 md:col-span-6' },   // Medio horizontal
        { cols: 'col-span-12 md:col-span-6' },   // Medio horizontal
        { cols: 'col-span-12 md:col-span-12' }, // Ultra wide
    ];

    const pattern = patterns[index % patterns.length];

    return (
        <a
            href={serviceUrl}
            className={`${pattern.cols} group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer block`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-full h-full">
                {/* Imagen de fondo */}
                <img
                    src={imageUrl}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => {
                        e.target.src = "/api/placeholder/800/600";
                    }}
                />

                {/* Overlay principal oscuro para contraste del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 from-5% via-black/40 via-45% to-transparent transition-all duration-700 ease-out group-hover:from-black/90 group-hover:via-black/50"></div>
                
                {/* Overlay decorativo con color corporativo - muy sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-0 transition-opacity duration-700"></div>
                
                {/* Línea decorativa superior con color accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out origin-center"></div>
                
                {/* Ícono flotante superior derecha con animación mejorada */}
                <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-accent/50 shadow-2xl transform translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out z-10">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                </div>

                {/* Contenido inferior con animaciones escalonadas */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 z-10">
                    {/* Título - con animación de entrada */}
                    <h3 className="text-2xl lg:text-3xl font-light text-white mb-3 leading-tight transform transition-all duration-700 ease-out group-hover:translate-y-[-4px]">
                        {service.name}
                    </h3>

                    {/* Descripción - aparece suavemente */}
                    <div 
                        className={`overflow-hidden transition-all duration-700 ease-out ${
                            isHovered ? 'max-h-48 opacity-100 mb-4 translate-y-0' : 'max-h-0 opacity-0 mb-0 translate-y-4'
                        }`}
                    >
                        {service.description && (
                            <p className="text-sm lg:text-base text-white/95 font-light leading-relaxed">
                                {getServiceDescription(service, 30)}
                            </p>
                        )}
                    </div>

                    {/* Barra decorativa con animación elegante */}
                    <div className="flex items-center gap-3">
                        <div className={`h-px flex-1 bg-gradient-to-r from-white/80 via-primary to-transparent transition-all duration-1000 ease-out origin-left ${
                            isHovered ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        }`}></div>
                        <span className={`text-xs font-medium text-white/80 uppercase tracking-wider transition-all duration-700 ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                            Ver más
                        </span>
                    </div>
                </div>
            </div>

            {/* Borde elegante al hover con color accent */}
            <div className="absolute inset-0 border-2 border-white/0  rounded-3xl transition-all duration-700 pointer-events-none"></div>
        </a>
    );
};

const ServiceWebQuirurgica2 = ({ data, items = [] }) => {
    // Ordenar servicios por order_index
    const sortedServices = items.sort((a, b) => {
        const orderA = a.order_index ?? 999;
        const orderB = b.order_index ?? 999;
        return orderA - orderB;
    });

    return (
        <section id="servicios" className={`py-24 bg-sections-color  ${data?.class || ''}`}>
            <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
                {/* Encabezado con diseño moderno */}
                <div className="mb-20 max-w-4xl">
                
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-primary leading-tight mb-6 whitespace-pre-line">
                        <TextWithHighlight
                            text={data?.name || 'Experiencia y *Profesionalismo* en Cada Detalle'}
                            color="bg-primary font-light"
                        />
                    </h2>
                    {data?.description && (
                        <p className="text-xl text-neutral-dark/70 font-light leading-relaxed max-w-2xl whitespace-pre-line">
                            <TextWithHighlight
                                text={data.description}
                                color="bg-primary"
                            />
                        </p>
                    )}
                </div>

                {/* Grid Fibonacci Pattern - sin aspect ratios para llenar el grid naturalmente */}
                <div className="grid grid-cols-12 gap-6 lg:gap-8 auto-rows-[400px]">
                    {sortedServices.map((service, serviceIndex) => (
                        <ServiceCard 
                            key={serviceIndex} 
                            service={service} 
                            index={serviceIndex}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ServiceWebQuirurgica2;
