import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const ServiceDetailCatalog = ({ data, items = [], currentService = null }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [categoryServices, setCategoryServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    useEffect(() => {
        // Extraer categorías únicas de los servicios
        if (items && items.length > 0) {
            const uniqueCategories = [];
            const categoryIds = new Set();
            
            items.forEach(service => {
                if (service.category && !categoryIds.has(service.category.id)) {
                    categoryIds.add(service.category.id);
                    uniqueCategories.push(service.category);
                }
            });
            
            setCategories(uniqueCategories);
        }

        // Si hay un servicio actual, establecerlo como seleccionado
        if (currentService) {
            setSelectedService(currentService);
            
            // Establecer categoría seleccionada
            if (currentService.category) {
                setSelectedCategory(currentService.category);
            }
            
            // Filtrar servicios de la misma categoría
            if (currentService.service_category_id && items.length > 0) {
                const sameCategoryServices = items.filter(
                    service => service.service_category_id === currentService.service_category_id
                );
                setCategoryServices(sameCategoryServices);
            }
        } else if (items.length > 0) {
            // Si no hay servicio actual, seleccionar el primero
            setSelectedService(items[0]);
            
            if (items[0].category) {
                setSelectedCategory(items[0].category);
            }
            
            if (items[0].service_category_id) {
                const sameCategoryServices = items.filter(
                    service => service.service_category_id === items[0].service_category_id
                );
                setCategoryServices(sameCategoryServices);
            }
        }
    }, [currentService, items]);

    const handleServiceClick = (service) => {
        // Navegar a la URL dinámica del servicio
        window.location.href = `/servicio/${service.slug}`;
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        
        // Filtrar servicios por categoría
        const filteredServices = items.filter(
            service => service.service_category_id === category.id
        );
        setCategoryServices(filteredServices);
        
        // Seleccionar el primer servicio de la categoría
        if (filteredServices.length > 0) {
            setSelectedService(filteredServices[0]);
            window.location.href = `/servicio/${filteredServices[0].slug}`;
        }
    };

    if (!selectedService) {
        return (
            <section className={`py-24 px-4 bg-sections-color ${data?.class || ''}`}>
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600">No hay servicios disponibles</p>
                </div>
            </section>
        );
    }

    const servicesToShow = categoryServices.length > 0 ? categoryServices : items;

    return (
        <>
            {/* Sección de Categorías con Swiper */}
            {categories && categories.length > 0 && (
                <section className="py-8 lg:py-12 bg-gradient-to-b from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl lg:text-4xl font-light text-primary mb-2">
                                Nuestras Categorías
                            </h2>
                            <p className="text-gray-600">Explora nuestros servicios por categoría</p>
                        </div>

                        <div className="relative px-2 py-6 overflow-hidden">
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                spaceBetween={16}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                navigation={categories.length > 4 ? {
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current,
                                } : false}
                                onBeforeInit={(swiper) => {
                                    if (categories.length > 4) {
                                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                                        swiper.params.navigation.nextEl = navigationNextRef.current;
                                    }
                                }}
                                loop={categories.length > 4}
                                speed={800}
                                centeredSlides={categories.length <= 4}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 16,
                                        centeredSlides: categories.length <= 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                        centeredSlides: categories.length <= 3,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                        centeredSlides: false,
                                    },
                                }}
                                className="category-swiper"
                            >
                                {categories.map((category) => (
                                    <SwiperSlide key={category.id}>
                                        <div 
                                            className={`group cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full ${
                                                selectedCategory?.id === category.id
                                                    ? 'ring-4 ring-primary shadow-xl'
                                                    : 'shadow-md hover:shadow-xl'
                                            }`}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            {/* Imagen de la categoría */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                                <img
                                                    src={category.image ? `/storage/images/service_category/${category.image}` : '/assets/img/noimage/no_img.jpg'}
                                                    alt={category.name}
                                                    className={`w-full h-full object-cover transition-all duration-500 ${
                                                        selectedCategory?.id === category.id
                                                            ? 'scale-110'
                                                            : 'group-hover:scale-105'
                                                    }`}
                                                    onError={(e) => {
                                                        e.target.src = '/assets/img/noimage/no_img.jpg';
                                                    }}
                                                />
                                                
                                                {/* Overlay */}
                                                <div className={`absolute inset-0 transition-all duration-300 ${
                                                    selectedCategory?.id === category.id
                                                        ? 'bg-primary/30'
                                                        : 'bg-black/20 group-hover:bg-primary/20'
                                                }`}></div>
                                                
                                                {/* Check si está seleccionada */}
                                                {selectedCategory?.id === category.id && (
                                                    <div className="absolute top-4 right-4">
                                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contenido */}
                                            <div className={`p-5 transition-all duration-300 ${
                                                selectedCategory?.id === category.id
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white group-hover:bg-primary/5'
                                            }`}>
                                                <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                                                    selectedCategory?.id === category.id
                                                        ? 'text-white'
                                                        : 'text-gray-800 group-hover:text-primary'
                                                }`}>
                                                    {category.name}
                                                </h3>
                                                
                                                {category.description && (
                                                    <p className={`text-sm mt-2 line-clamp-2 transition-colors duration-300 ${
                                                        selectedCategory?.id === category.id
                                                            ? 'text-white/90'
                                                            : 'text-gray-600'
                                                    }`}>
                                                        {category.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Botones de navegación - solo si hay más de 4 categorías */}
                            {categories.length > 4 && (
                                <>
                                    <button
                                        ref={navigationPrevRef}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300 -ml-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        ref={navigationNextRef}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-primary hover:text-white transition-all duration-300 -mr-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Sección Principal */}
            <section className={`py-12 px-4 bg-sections-color ${data?.class || ''}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* SIDEBAR - Lista de servicios */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24" style={{ minHeight: '400px' }}>
                                <h3 className="text-2xl font-light text-primary mb-6 pb-3 border-b-2 border-primary/20 truncate">
                                    {selectedService.category?.name || 'Servicios'}
                                </h3>
                                
                                <nav className="space-y-2 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                                    {servicesToShow.map((service, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleServiceClick(service)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 group ${
                                                selectedService.id === service.id
                                                    ? 'bg-primary text-white shadow-lg scale-105'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:scale-102'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {service.image && (
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                                        <img
                                                            src={`/storage/images/service/${service.image}`}
                                                            alt={service.name}
                                                            className={`w-full h-full object-cover transition-all duration-300 ${
                                                                selectedService.id === service.id
                                                                    ? 'brightness-110'
                                                                    : 'group-hover:brightness-90 group-hover:grayscale-0'
                                                            }`}
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </div>
                                                )}
                                                <span className={`font-light text-sm leading-tight flex-1 min-w-0 break-words ${
                                                    selectedService.id === service.id ? 'font-medium' : ''
                                                }`}>
                                                    {service.name}
                                                </span>
                                                {selectedService.id === service.id && (
                                                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* CONTENIDO PRINCIPAL - Detalle del servicio */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                {/* Header con imagen de fondo */}
                                {selectedService.background_image && (
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={`/storage/images/service/${selectedService.background_image}`}
                                            alt={selectedService.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-8">
                                            <h1 className="text-4xl font-light text-white mb-2 whitespace-pre-line">
                                                <TextWithHighlight 
                                                    text={selectedService.name}
                                                    color="bg-accent"
                                                />
                                            </h1>
                                            {selectedService.subcategory && (
                                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                                                    {selectedService.subcategory.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contenido */}
                                <div className="p-8">
                                    {/* Título si no hay imagen de fondo */}
                                    {!selectedService.background_image && (
                                        <div className="mb-6">
                                            <h1 className="text-4xl font-light text-primary mb-3 whitespace-pre-line">
                                                <TextWithHighlight 
                                                    text={selectedService.name}
                                                    color="bg-accent"
                                                />
                                            </h1>
                                            {selectedService.subcategory && (
                                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                                    {selectedService.subcategory.name}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Resumen */}
                                    {selectedService.summary && (
                                        <div className="mb-6">
                                            <p className="text-gray-700 font-light leading-relaxed text-lg">
                                                {selectedService.summary}
                                            </p>
                                        </div>
                                    )}

                                    {/* Descripción detallada */}
                                    {selectedService.description && (
                                        <div className="prose max-w-none mb-8">
                                            <div 
                                                className="text-gray-600 font-light leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: selectedService.description }}
                                            />
                                        </div>
                                    )}

                                    {/* Galería de imágenes */}
                                    {selectedService.images && selectedService.images.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-light text-primary mb-4">Galería</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {selectedService.images.map((img, index) => (
                                                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                                                        <img
                                                            src={`/storage/images/service/${img.image}`}
                                                            alt={`${selectedService.name} - ${index + 1}`}
                                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Características */}
                                    {selectedService.features && selectedService.features.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-light text-primary mb-4">Características</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {selectedService.features.map((feature, index) => (
                                                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                                                                <i className="mdi mdi-check text-white"></i>
                                                            </div>
                                                            <p className="text-gray-700 font-light leading-relaxed">
                                                                {feature.feature}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Especificaciones */}
                                    {selectedService.specifications && selectedService.specifications.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-light text-primary mb-4">Especificaciones</h3>
                                            <div className="space-y-3">
                                                {selectedService.specifications.map((spec, index) => (
                                                    <div key={index} className="border-l-4 border-primary pl-4 py-2">
                                                        <h4 className="font-medium text-primary mb-1">
                                                            {spec.title}
                                                        </h4>
                                                        {spec.description && (
                                                            <p className="text-gray-600 font-light">
                                                                {spec.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* PDFs */}
                                    {selectedService.pdf && selectedService.pdf.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-light text-primary mb-4">Documentos</h3>
                                            <div className="space-y-2">
                                                {selectedService.pdf.map((pdf, index) => (
                                                    <a
                                                        key={index}
                                                        href={`/storage/pdfs/service/${pdf.path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                    >
                                                        <i className="mdi mdi-file-pdf text-red-600 text-2xl"></i>
                                                        <span className="text-gray-700 font-light">{pdf.name}</span>
                                                        <i className="mdi mdi-download ml-auto text-gray-400"></i>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Videos */}
                                    {selectedService.linkvideo && selectedService.linkvideo.length > 0 && (
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-light text-primary mb-4">Videos</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {selectedService.linkvideo.map((video, index) => (
                                                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-black">
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
                </div>
            </section>
        </>
    );
};

export default ServiceDetailCatalog;
