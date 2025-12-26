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
                            <div className="w-20 h-1 bg-accent mx-auto"></div>
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
                                centeredSlides={categories.length <= 4}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        centeredSlides: categories.length <= 2,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        centeredSlides: categories.length <= 3,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        centeredSlides: false,
                                    },
                                }}
                                className="category-swiper !overflow-visible"
                            >
                                {categories.map((category) => {
                                    const isSelected = selectedCategory?.id === category.id;
                                    return (
                                        <SwiperSlide key={category.id} className="h-auto">
                                            <div
                                                className={`group cursor-pointer rounded-2xl h-full flex flex-col transition-all duration-300 bg-white overflow-hidden shadow-xl ${isSelected
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
            <section className={`py-12 px-primary 2xl:px-0 bg-sections-color ${data?.class || ''}`}>
                <div className=" 2xl:max-w-7xl mx-auto">
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
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 group ${selectedService.id === service.id
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
                                                            className={`w-full h-full object-cover transition-all duration-300 ${selectedService.id === service.id
                                                                    ? 'brightness-110'
                                                                    : 'group-hover:brightness-90 group-hover:grayscale-0'
                                                                }`}
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </div>
                                                )}
                                                <span className={`font-light text-sm leading-tight flex-1 min-w-0 break-words ${selectedService.id === service.id ? 'font-medium' : ''
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
                                                className="text-neutral-dark font-light leading-relaxed"
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
                                                            <p className="text-neutral-dark font-light">
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
