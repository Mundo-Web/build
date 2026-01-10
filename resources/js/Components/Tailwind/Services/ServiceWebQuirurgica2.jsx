import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import General from '../../../Utils/General';

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

const ServiceCard = ({ service, index, data, onCardClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const imageUrl = service.image
        ? `/storage/images/service/${service.image}`
        : service.background_image ? `/storage/images/service/${service.background_image}`: '/api/cover/thumbnail/null';

    const serviceUrl = service.slug ? `/servicio/${service.slug}` : '#';
    
    // Manejar clic según type_web
    const handleClick = (e) => {
        if (data?.type_web === 'landing') {
            e.preventDefault();
            onCardClick(service);
        }
        // Si no es landing, el href del <a> se ejecuta normalmente
    };

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
            onClick={handleClick}
            className={`${pattern.cols} group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer block isolate ${data?.class_card || ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ willChange: 'transform' }}
        >
            <div className="relative w-full h-full overflow-hidden">
                {/* Imagen de fondo */}
                <img
                    src={imageUrl}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    onError={(e) => {
                        e.target.src ="/api/cover/thumbnail/null";
                    }}
                    style={{ willChange: 'transform' }}
                />

                {/* Overlay principal oscuro para contraste del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 from-5% via-black/40 via-45% to-transparent transition-all duration-700 ease-out group-hover:from-black/90 group-hover:via-black/50"></div>
                
                {/* Overlay decorativo con color corporativo - muy sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-0 transition-opacity duration-700"></div>
                
                {/* Línea decorativa superior con color accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 ease-out origin-center"></div>
                
                {/* Ícono flotante superior derecha con animación mejorada */}
                <div className={`absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl flex items-center justify-center border border-accent/50 shadow-2xl transform translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out z-10 ${data?.class_card_icon || ''}`}>
                    <ArrowUpRight className="w-5 h-5 text-white" />
                </div>

                {/* Contenido inferior con animaciones escalonadas */}
                <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 z-10 pointer-events-none">
                    {/* Título - con animación de entrada */}
                    <h3 className="text-2xl lg:text-3xl font-light text-white mb-3 leading-tight transform transition-all duration-700 ease-out group-hover:translate-y-[-4px] pointer-events-auto">
                        {service.name}
                    </h3>

                    {/* Descripción - aparece suavemente */}
                    <div 
                        className={`overflow-hidden transition-all duration-700 ease-out ${
                            isHovered ? 'max-h-32 opacity-100 mb-4 translate-y-0' : 'max-h-0 opacity-0 mb-0 translate-y-4'
                        }`}
                    >
                        {service.description && (
                            <p className="text-sm lg:text-base text-white font-light leading-relaxed line-clamp-3 drop-shadow-lg pointer-events-auto">
                                {getServiceDescription(service, 30)}
                            </p>
                        )}
                    </div>

                    {/* Barra decorativa con animación elegante */}
                    
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <div className={`h-px flex-1 bg-gradient-to-r from-white/80 via-primary to-transparent transition-all duration-1000 ease-out origin-left ${
                            isHovered ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                        }`}></div>
                        <span className={`text-xs font-medium text-white/80 uppercase tracking-wider transition-all duration-700 ${
                            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                            {data?.button_card_text || 'Ver más'}
                        </span>
                    </div>
                </div>
            </div>

         
        </a>
    );
};

const ServiceWebQuirurgica2 = ({ data, items = [] }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    
    // Obtener asesores de WhatsApp
    const whatsappAdvisors = General.whatsapp_advisors || [];
    
    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (selectedService) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedService]);
    
    // Manejar envío a WhatsApp
    const handleWhatsAppQuote = (advisor, service) => {
        // Construir mensaje personalizado con información del servicio
        let customMessage = `🌟 ¡Hola! Me interesa solicitar información sobre:\n\n`;
        customMessage += `🔧 *Servicio:* ${service.name}\n`;
        
        // Agregar descripción si existe
        if (service.description) {
            const plainText = getServiceDescription(service, 20);
            customMessage += `\n📋 ${plainText}\n`;
        }
        
        customMessage += `\n💬 Me gustaría recibir más información y cotización.\n¡Gracias!`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(customMessage)}`;
        window.open(whatsappUrl, '_blank');
        setIsAdvisorDropdownOpen(false);
    };
    
    // Ordenar servicios por order_index
    const sortedServices = items.sort((a, b) => {
        const orderA = a.order_index ?? 999;
        const orderB = b.order_index ?? 999;
        return orderA - orderB;
    });

    return (
        <section id="serviceWebQuirurgica2" className={`py-24 bg-sections-color  ${data?.class_section || ''}`}>
            <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
                {/* Encabezado con diseño moderno */}
                <div className={`mb-20 max-w-4xl ${data?.class_header_container || ''}`}>
                
                    <h2 className={`text-5xl md:text-6xl lg:text-7xl font-extralight text-primary leading-tight mb-6 whitespace-pre-line ${data?.class_title || ''}`}>
                        <TextWithHighlight
                            text={data?.name || 'Experiencia y *Profesionalismo* en Cada Detalle'}
                            color={`bg-primary font-light ${data?.class_title_highlight || ''}`}
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
                            data={data}
                            onCardClick={setSelectedService}
                        />
                    ))}
                </div>
            </div>

            {/* Modal de Servicio - Solo para landing */}
            {data?.type_web === 'landing' && (
                <AnimatePresence>
                    {selectedService && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 backdrop-blur-md"
                            onClick={() => {
                                setSelectedService(null);
                                setIsAdvisorDropdownOpen(false);
                            }}
                        >
                            {/* Botón cerrar */}
                            <button
                                onClick={() => {
                                    setSelectedService(null);
                                    setIsAdvisorDropdownOpen(false);
                                }}
                                className="fixed top-6 right-6 z-[60] w-12 h-12 bg-white hover:bg-gray-50 text-neutral-dark hover:text-primary transition-all duration-300 rounded-full flex items-center justify-center group shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="max-w-4xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative bg-white border-2 border-gray-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="grid lg:grid-cols-2 h-full">
                                    {/* Imagen del servicio */}
                                    <div className="lg:col-span-1 bg-white flex items-center justify-center overflow-hidden relative min-h-[300px] lg:min-h-0">
                                        <img
                                            src={selectedService.image ? `/storage/images/service/${selectedService.image}` : selectedService.background_image ? `/storage/images/service/${selectedService.background_image}` : '/api/cover/thumbnail/null'}
                                            alt={selectedService.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    </div>

                                    {/* Información del servicio */}
                                    <div className="lg:col-span-1 p-6 md:p-8 overflow-y-auto max-h-[90vh] lg:max-h-[90vh] flex flex-col bg-white">
                                        {/* Header */}
                                        <div className="mb-6 pb-4 border-b-2 border-gray-200">
                                            <h3 className="text-2xl md:text-4xl lg:text-5xl text-primary font-title font-bold leading-tight">
                                                {selectedService.name}
                                            </h3>
                                        </div>

                                        {/* Descripción completa */}
                                        {selectedService.description && (
                                            <div 
                                                className="text-neutral-dark leading-relaxed mb-6 text-base prose prose-sm max-w-none prose-p:my-2"
                                                dangerouslySetInnerHTML={{ __html: selectedService.description }}
                                            />
                                        )}

                                        {/* Features si existen */}
                                        {selectedService.features && selectedService.features.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-base font-bold text-neutral-dark uppercase tracking-wide mb-4 flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                                        </svg>
                                                    </div>
                                                    Características
                                                </h4>
                                                <div className="bg-white rounded-xl p-5 space-y-3">
                                                    {selectedService.features.map((feat, index) => (
                                                        <div 
                                                            key={feat.id || index}
                                                            className="flex items-start gap-3 pb-3 last:pb-0"
                                                        >
                                                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                            <span className="text-neutral-dark text-base leading-relaxed">{feat.feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Botón de WhatsApp */}
                                        <div className="mt-auto pt-6">
                                            <div className="relative">
                                                {whatsappAdvisors.length <= 1 ? (
                                                    <button
                                                        onClick={() => {
                                                            const advisor = whatsappAdvisors[0] || { phone: '+51958973943', message: '' };
                                                            handleWhatsAppQuote(advisor, selectedService);
                                                        }}
                                                        className="w-full bg-success hover:bg-primary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                                                    >
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                                        </svg>
                                                        Solicitar Cotización
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                                                            className="w-full bg-success hover:bg-primary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                                                        >
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                                            </svg>
                                                            Solicitar Cotización
                                                            <svg className={`w-5 h-5 transition-transform duration-300 ${isAdvisorDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                                                            </svg>
                                                        </button>

                                                        {/* Dropdown de asesores */}
                                                        <AnimatePresence>
                                                            {isAdvisorDropdownOpen && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-30"
                                                                >
                                                                    <div className="bg-primary px-5 py-4">
                                                                        <p className="text-white font-bold text-base">Elige un asesor</p>
                                                                        <p className="text-white/90 text-sm">Te atenderemos de inmediato</p>
                                                                    </div>
                                                                    
                                                                    <div className="max-h-[220px] overflow-y-auto">
                                                                        {whatsappAdvisors.map((advisor, index) => (
                                                                            <motion.button
                                                                                key={index}
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ delay: index * 0.05 }}
                                                                                onClick={() => handleWhatsAppQuote(advisor, selectedService)}
                                                                                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all duration-200 text-left border-b border-gray-100 last:border-b-0 group"
                                                                            >
                                                                                <div className="flex-shrink-0">
                                                                                    {advisor.photo ? (
                                                                                        <img
                                                                                            src={`/assets/resources/${advisor.photo}`}
                                                                                            alt={advisor.name}
                                                                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                                                                                            onError={(e) => {
                                                                                                e.target.onerror = null;
                                                                                                e.target.style.display = 'none';
                                                                                                e.target.nextSibling.style.display = 'flex';
                                                                                            }}
                                                                                        />
                                                                                    ) : null}
                                                                                    <div 
                                                                                        className={`w-12 h-12 rounded-full bg-primary items-center justify-center text-white font-bold text-lg ${advisor.photo ? 'hidden' : 'flex'}`}
                                                                                    >
                                                                                        {advisor.name?.charAt(0).toUpperCase()}
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-bold text-neutral-dark text-base truncate group-hover:text-primary transition-colors">{advisor.name}</p>
                                                                                    <p className="text-sm text-neutral-dark/70 truncate">{advisor.position || 'Asesor comercial'}</p>
                                                                                </div>
                                                                                
                                                                                <svg className="w-6 h-6 text-success flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                                                                </svg>
                                                                            </motion.button>
                                                                        ))}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </section>
    );
};

export default ServiceWebQuirurgica2;
