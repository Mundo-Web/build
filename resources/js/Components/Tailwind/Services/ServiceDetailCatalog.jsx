import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import ServicesRest from '../../../Actions/ServicesRest';

const servicesRest = new ServicesRest();

const ServiceDetailCatalog = ({ data, items = [], currentService = null }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [categoryServices, setCategoryServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const lightboxPrevRef = useRef(null);
    const lightboxNextRef = useRef(null);

    // Función para registrar vista del servicio
    const handleViewUpdate = async (service) => {
        try {
            const request = {
                id: service?.id,
                page_url: window.location.href,
            };
            await servicesRest.updateViews(request);
        } catch (error) {
            console.error('Error tracking service view:', error);
        }
    };

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

            // Registrar vista del servicio actual
            handleViewUpdate(currentService);
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

            // Registrar vista del primer servicio
            handleViewUpdate(items[0]);
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
            <section className={`py-24 px-primary 2xl:px-0 bg-sections-color ${data?.class || ''}`}>
                <div className="2xl:max-w-7xl  mx-auto text-center">
                    <p className="text-neutral-dark">No hay servicios disponibles</p>
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
                    <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
                        <div className="text-center mb-8">
                            <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight whitespace-pre-line">
                                <TextWithHighlight
                                    text={data?.name || 'Nuestras *Categorias*'}
                                    color="bg-accent"
                                />
                            </h2>
                            <div className=" mx-auto"></div>
                            {data?.description && (
                                <p className="text-lg text-neutral-dark font-light leading-relaxed whitespace-pre-line">
                                    <TextWithHighlight
                                        text={data?.description}
                                        color="bg-primary"
                                    />
                                </p>
                            )}
                        </div>

                        <div className="relative px-4 py-10 overflow-visible">
                            <Swiper
                                modules={[Autoplay, Navigation]}
                                spaceBetween={24}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 4000,
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
                                centerInsufficientSlides={true}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 24,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                }}
                                className="category-swiper !overflow-visible"
                            >
                                {categories.map((category) => {
                                    const isSelected = selectedCategory?.id === category.id;
                                    return (
                                        <SwiperSlide key={category.id} className="h-auto">
                                            <div
                                                className={`group cursor-pointer rounded-3xl h-full flex flex-col transition-all duration-300 bg-white overflow-hidden shadow-xl ${isSelected
                                                    ? 'ring-2 ring-primary shadow-xl scale-[1.02]'
                                                    : 'hover:shadow-xl hover:-translate-y-1 hover:shadow-primary/10 border border-gray-100'
                                                    }`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                {/* Imagen de la categoría */}
                                                <div className="relative aspect-[4/3] overflow-hidden">
                                                    <img
                                                        src={category.banner ? `/storage/images/service_category/${category.banner}` : `/storage/images/service_category/${category.image}`}
                                                        alt={category.name}
                                                        className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110'
                                                            }`}
                                                        onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                        }
                                                    />

                                                    {/* Overlay Gradiente */}
                                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 ${isSelected ? 'opacity-80' : 'group-hover:opacity-80'
                                                        }`}></div>

                                                    {/* Indicador de Selección (Check) */}
                                                    <div className={`absolute top-3 right-3 transition-all duration-300 transform ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                                        }`}>
                                                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Contenido de la tarjeta */}
                                                <div className="p-6 flex flex-col flex-grow relative">
                                                    {/* Decoración superior */}
                                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform origin-left transition-transform duration-300 ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                                        }`}></div>

                                                    <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isSelected ? 'text-primary' : 'text-gray-800 group-hover:text-primary'
                                                        }`}>
                                                        {category.name}
                                                    </h3>

                                                    <div className="flex-grow">
                                                        {category.description && (
                                                            <p className="text-neutral-light text-sm leading-relaxed line-clamp-2">
                                                                {category.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Footer de la tarjeta con acción */}
                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                        <span className={`text-sm font-medium transition-colors duration-300 ${isSelected ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                                                            }`}>
                                                            {isSelected ? 'Seleccionado' : 'Ver servicios'}
                                                        </span>
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary text-white translate-x-0' : 'bg-gray-50 text-gray-400 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary'
                                                            }`}>
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            {/* Botones de navegación - solo si hay más de 4 categorías */}
                            {categories.length > 4 && (
                                <>
                                    <button
                                        ref={navigationPrevRef}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 -ml-4 lg:-ml-6 disabled:opacity-0 disabled:cursor-not-allowed"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </button>
                                    <button
                                        ref={navigationNextRef}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg border border-gray-100 text-gray-700 hover:bg-primary hover:text-white transition-all duration-300 -mr-4 lg:-mr-6 disabled:opacity-0 disabled:cursor-not-allowed"
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Sección Principal */}
            <section id='section-container' className={`py-24 px-primary 2xl:px-0 bg-sections-color ${data?.class || ''}`}>
                <div className="2xl:max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* SIDEBAR - Lista de servicios MEJORADO */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-48 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/60">
                                {/* Header mejorado con gradiente sutil */}
                                <div className="relative p-6 bg-gradient-to-br from-primary/5 to-accent">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-bold text-primary tracking-tight">
                                            {selectedService.category?.name || 'Servicios'}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-0.5 flex-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                                    </div>
                                </div>

                                {/* Lista de servicios mejorada */}
                                <nav className="p-5 space-y-4 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                                    {servicesToShow.map((service, index) => {
                                        const isActive = selectedService.id === service.id;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleServiceClick(service)}
                                                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 group flex items-center gap-3.5 relative overflow-hidden ${isActive
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                    : 'bg-white hover:bg-gray-50/80 hover:shadow-lg'
                                                    }`}
                                            >
                                                {/* Imagen del servicio */}
                                                <div className="relative w-14 h-14 rounded-full flex-shrink-0 transition-all duration-300">
                                                    <img
                                                        src={service.image ? `/storage/images/service/${service.image}` : '/api/cover/thumbnail/null'}
                                                        alt={service.name}
                                                        className={`w-full h-full rounded-full object-cover transition-all duration-500 ${isActive
                                                            ? 'grayscale invert scale-105'
                                                            : 'group-hover:scale-110 group-hover:brightness-95'
                                                            }`}
                                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                    />
                                                </div>

                                                {/* Contenido del servicio */}
                                                <div className="flex-1 min-w-0 py-0.5">
                                                    <span className={`block text-sm leading-tight font-semibold mb-1 line-clamp-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-neutral-dark group-hover:text-primary'
                                                        }`}>
                                                        {service.name}
                                                    </span>
                                                    {/* Subtítulo opcional si existe subcategoría */}
                                                    {service.subcategory && (
                                                        <span className={`block text-xs font-light truncate transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-neutral-dark/50 group-hover:text-primary/70'
                                                            }`}>
                                                            {service.subcategory.name}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Indicador de selección */}
                                                <div className={`flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-50 group-hover:scale-90'
                                                    }`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary'
                                                        }`}>
                                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-white translate-x-0.5' : 'text-white'
                                                            }`} />
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* CONTENIDO PRINCIPAL - Detalle del servicio MEJORADO */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                                {/* Header con imagen de fondo */}
                                {selectedService.background_image && (
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={`/storage/images/service/${selectedService.background_image}`}
                                            alt={selectedService.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 right-0 p-10">
                                            <h1 className="text-5xl lg:text-6xl font-light text-white mb-3 whitespace-pre-line">
                                                <TextWithHighlight
                                                    text={selectedService.name}
                                                    color="bg-accent"
                                                />
                                            </h1>

                                        </div>
                                    </div>
                                )}

                                {/* Contenido */}
                                <div className="p-10">
                                    {/* Título si no hay imagen de fondo */}
                                    {!selectedService.background_image && (
                                        <div className="mb-8">
                                            <h1 className="text-5xl font-light text-primary mb-4 whitespace-pre-line">
                                                <TextWithHighlight
                                                    text={selectedService.name}
                                                    color="bg-accent"
                                                />
                                            </h1>
                                            {selectedService.subcategory && (
                                                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                                    {selectedService.subcategory.name}
                                                </span>
                                            )}
                                        </div>
                                    )}



                                    {/* Descripción detallada */}
                                    {selectedService.description && (
                                        <div className="prose prose-lg max-w-none mb-12">
                                            <div
                                                className="text-neutral-dark font-light leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: selectedService.description }}
                                            />
                                        </div>
                                    )}

                                    {/* Características con diseño médico profesional */}
                                    {selectedService.features && selectedService.features.length > 0 && (
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-12">
                                                <h3 className="text-3xl font-light text-primary">Características Principales</h3>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {selectedService.features.map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative rounded-3xl p-6 cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                                                    >
                                                        {/* Número de característica */}
                                                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                                        </div>

                                                        <div className="flex items-start">
                                                            <div className="flex-1">
                                                                <p className="text-neutral-dark font-medium leading-relaxed">
                                                                    {feature.feature}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Decoración inferior */}
                                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Especificaciones con estilo timeline */}
                                    {selectedService.specifications && selectedService.specifications.length > 0 && (
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-6">
                                                <h3 className="text-3xl font-light text-primary">Especificaciones Técnicas</h3>
                                            </div>

                                            <div className="relative space-y-6 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-accent before:to-primary/20">
                                                {selectedService.specifications.map((spec, index) => (
                                                    <div key={index} className="relative pl-16 group">
                                                        {/* Punto en la línea */}
                                                        <div className="absolute left-3 top-2 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-lg group-hover:scale-125 transition-transform duration-300">
                                                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                                                        </div>

                                                        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30">
                                                            <h4 className="font-bold text-primary text-lg mb-2 flex items-center gap-2">
                                                                <span>{spec.title}</span>
                                                                <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                                                            </h4>
                                                            {spec.description && (
                                                                <p className="text-neutral-dark font-light leading-relaxed">
                                                                    {spec.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* PDFs con diseño mejorado */}
                                    {selectedService.pdf && selectedService.pdf.length > 0 && (
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                                                <h3 className="text-3xl font-light text-primary">Documentación</h3>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {selectedService.pdf.map((pdf, index) => (
                                                    <a
                                                        key={index}
                                                        href={`/storage/pdfs/service/${pdf.path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group flex items-center gap-4 p-5 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 hover:border-red-300 hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                                                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-neutral-dark truncate group-hover:text-primary transition-colors">
                                                                {pdf.name}
                                                            </p>
                                                            <p className="text-xs text-neutral-dark/60 mt-1">Documento PDF</p>
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Videos con diseño mejorado */}
                                    {selectedService.linkvideo && selectedService.linkvideo.length > 0 && (
                                        <div className="mb-12">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                                                <h3 className="text-3xl font-light text-primary">Contenido Multimedia</h3>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {selectedService.linkvideo.map((video, index) => (
                                                    <div key={index} className="group relative">
                                                        <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-xl ring-1 ring-gray-200 group-hover:ring-primary/50 transition-all duration-300">
                                                            <iframe
                                                                src={video.url.replace('watch?v=', 'embed/')}
                                                                className="w-full h-full"
                                                                allowFullScreen
                                                                title={`Video ${index + 1}`}
                                                            ></iframe>
                                                        </div>
                                                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                                                            <span className="text-white font-bold text-sm">{index + 1}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Galería Visual con Fibonacci Mejorado - AL FINAL */}
                                    {selectedService.images && selectedService.images.length > 0 && (
                                        <div className="mb-0">
                                            <div className="flex items-center gap-3 mb-8">
                                                <h3 className="text-4xl font-light text-primary">Galería Visual</h3>
                                            </div>

                                            {/* Layout Fibonacci Mejorado - Sin espacios vacíos */}
                                            <div className="grid grid-cols-12 gap-4 auto-rows-[300px]">
                                                {selectedService.images.map((img, index) => {
                                                    // Patrón que se adapta mejor y no deja espacios vacíos
                                                    const patterns = [
                                                        { cols: 'col-span-12 md:col-span-8', aspect: 'aspect-[16/9]' },  // Grande horizontal
                                                        { cols: 'col-span-12 md:col-span-4', aspect: 'aspect-[4/5]' },   // Vertical
                                                        { cols: 'col-span-12 md:col-span-4', aspect: 'aspect-square' },  // Cuadrado
                                                        { cols: 'col-span-12 md:col-span-4', aspect: 'aspect-square' },  // Cuadrado
                                                        { cols: 'col-span-12 md:col-span-4', aspect: 'aspect-square' },  // Cuadrado
                                                        { cols: 'col-span-12 md:col-span-6', aspect: 'aspect-[4/3]' },   // Medio horizontal
                                                        { cols: 'col-span-12 md:col-span-6', aspect: 'aspect-[4/3]' },   // Medio horizontal
                                                        { cols: 'col-span-12 md:col-span-12', aspect: 'aspect-[21/9]' }, // Ultra wide
                                                    ];

                                                    const pattern = patterns[index % patterns.length];

                                                    return (
                                                        <div
                                                            key={index}
                                                            className={`${pattern.cols} group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer`}
                                                            onClick={() => {
                                                                setLightboxIndex(index);
                                                                setLightboxOpen(true);
                                                            }}
                                                        >
                                                            <div className={`relative w-full h-full`}>
                                                                <img
                                                                    src={`/storage/images/service/${img.image}`}
                                                                    alt={`${selectedService.name} - ${index + 1}`}
                                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                                />

                                                                {/* Overlay gradiente */}
                                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                                                {/* Overlay con información */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                                    {/* Número */}
                                                                    <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                                        <span className="text-white font-bold text-lg">{index + 1}</span>
                                                                    </div>

                                                                    {/* Icono de expandir */}
                                                                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                                        </svg>
                                                                    </div>

                                                                    {/* Barra decorativa */}
                                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>


                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal para Galería */}
            {lightboxOpen && selectedService.images && selectedService.images.length > 0 && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Botón cerrar */}
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 group"
                    >
                        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Contador de imágenes */}
                    <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full">
                        <span className="text-white font-medium">
                            {lightboxIndex + 1} / {selectedService.images.length}
                        </span>
                    </div>

                    {/* Swiper Container */}
                    <div
                        className="w-full max-w-6xl h-full flex items-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            initialSlide={lightboxIndex}
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={selectedService.images.length > 1}
                            keyboard={{
                                enabled: true,
                            }}
                            className="w-full h-full lightbox-swiper"
                            onSlideChange={(swiper) => setLightboxIndex(swiper.realIndex)}
                        >
                            {selectedService.images.map((img, index) => (
                                <SwiperSlide key={index} className="flex items-center justify-center">
                                    <div className="relative w-full h-full flex items-center justify-center p-8">
                                        <img
                                            src={`/storage/images/service/${img.image}`}
                                            alt={`${selectedService.name} - ${index + 1}`}
                                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </>
    );
};

// Estilos para los botones de navegación del lightbox
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .lightbox-swiper .swiper-button-next,
        .lightbox-swiper .swiper-button-prev {
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 50%;
            color: white;
            transition: all 0.3s ease;
        }
        
        .lightbox-swiper .swiper-button-next:hover,
        .lightbox-swiper .swiper-button-prev:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }
        
        .lightbox-swiper .swiper-button-next:after,
        .lightbox-swiper .swiper-button-prev:after {
            font-size: 24px;
            font-weight: bold;
        }
        
        .lightbox-swiper .swiper-pagination-bullet {
            background: white;
            opacity: 0.5;
        }
        
        .lightbox-swiper .swiper-pagination-bullet-active {
            opacity: 1;
            background: white;
        }
    `;
    if (!document.querySelector('#lightbox-swiper-styles')) {
        style.id = 'lightbox-swiper-styles';
        document.head.appendChild(style);
    }
}

export default ServiceDetailCatalog;
