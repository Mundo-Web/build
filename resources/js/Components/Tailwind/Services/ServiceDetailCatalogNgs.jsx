import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    MessageCircle,
    Download,
    FileText,
    Shield,
    ShieldCheck,
    Tag,
    X,
    ChevronDown,
    ArrowRight,
    Sparkles,
    HelpCircle,
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import General from "../../../Utils/General";

/**
 * ServiceDetailCatalogNgs — Catálogo de Servicios con Sidebar interactivo para NGS Solutions.
 * Ordena estrictamente por order_index, actualiza la URL en el cliente mediante HTML5 History API (sin recargar la página),
 * y aplica la línea de diseño oficial de NGS Solutions.
 */
const ServiceDetailCatalogNgs = ({
    data,
    items = [],
    currentService = null,
    onViewUpdate,
    generals = [],
}) => {
    const [selectedService, setSelectedService] = useState(null);
    const [categoryServices, setCategoryServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [isPdfDropdownOpen, setIsPdfDropdownOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(null);

    const prevCategoryRef = useRef(null);
    const nextCategoryRef = useRef(null);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    // Ordenar los servicios recibidos por order_index
    const sortedItems = React.useMemo(() => {
        if (!items || items.length === 0) return [];
        return [...items].sort(
            (a, b) => (a.order_index ?? a.order ?? 0) - (b.order_index ?? b.order ?? 0)
        );
    }, [items]);

    // Extraer y ordenar categorías únicas
    useEffect(() => {
        if (sortedItems && sortedItems.length > 0) {
            const categoryMap = new Map();

            sortedItems.forEach((service) => {
                if (service.category && !categoryMap.has(service.category.id)) {
                    categoryMap.set(service.category.id, service.category);
                }
            });

            const uniqueCategories = Array.from(categoryMap.values()).sort(
                (a, b) => (a.order_index ?? a.order ?? 0) - (b.order_index ?? b.order ?? 0)
            );

            setCategories(uniqueCategories);
        }
    }, [sortedItems]);

    // Inicializar el servicio seleccionado respetando order_index y la URL
    useEffect(() => {
        if (sortedItems.length === 0) return;

        let targetService = null;

        if (currentService) {
            targetService =
                sortedItems.find((s) => s.id === currentService.id || s.slug === currentService.slug) ||
                currentService;
        } else {
            // Verificar si el slug actual en la URL coincide con algún servicio
            const currentPath = window.location.pathname;
            const matchSlug = currentPath.split("/").pop();

            if (matchSlug) {
                targetService = sortedItems.find((s) => s.slug === matchSlug);
            }

            // Si no se encuentra servicio en la URL, tomar el primer servicio del order_index
            if (!targetService) {
                targetService = sortedItems[0];
            }
        }

        if (targetService) {
            setSelectedService(targetService);
            setActiveImage(targetService.image);

            if (targetService.category) {
                setSelectedCategory(targetService.category);
            }

            if (targetService.service_category_id) {
                const sameCatServices = sortedItems.filter(
                    (s) => s.service_category_id === targetService.service_category_id
                );
                setCategoryServices(sameCatServices);
            } else {
                setCategoryServices(sortedItems);
            }

            // Sobrescribir la URL silenciosamente sin recargar la página
            const newUrl = `/servicio/${targetService.slug}`;
            if (window.location.pathname !== newUrl) {
                window.history.replaceState(null, "", newUrl);
            }

            if (onViewUpdate) {
                onViewUpdate(targetService);
            }
        }
    }, [currentService, sortedItems]);

    // Manejador de selección de servicio (sin recargar la página)
    const handleServiceSelect = (service) => {
        if (!service) return;
        setSelectedService(service);
        setActiveImage(service.image);

        if (service.category) {
            setSelectedCategory(service.category);
        }

        if (service.service_category_id) {
            const sameCatServices = sortedItems.filter(
                (s) => s.service_category_id === service.service_category_id
            );
            setCategoryServices(sameCatServices);
        }

        // Actualizar URL sin reload
        const newUrl = `/servicio/${service.slug}`;
        if (window.location.pathname !== newUrl) {
            window.history.pushState(null, "", newUrl);
        }

        // Registrar vista
        if (onViewUpdate) {
            onViewUpdate(service);
        }
    };

    // Manejador de selección de categoría
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);

        const filteredServices = sortedItems.filter(
            (s) => s.service_category_id === category.id
        );
        setCategoryServices(filteredServices);

        if (filteredServices.length > 0) {
            handleServiceSelect(filteredServices[0]);
        }
    };

    // Extraer características de un servicio
    const getCharacteristics = (service) => {
        if (!service) return [];
        if (Array.isArray(service.features)) {
            return service.features
                .map((f) => (typeof f === "string" ? f : f.feature || f.name || f.title || f.description || ""))
                .filter(Boolean);
        }
        if (Array.isArray(service.characteristics)) {
            return service.characteristics
                .map((c) => (typeof c === "string" ? c : c.feature || c.name || c.title || c.description || ""))
                .filter(Boolean);
        }
        if (typeof service.characteristics === "string") {
            try {
                const parsed = JSON.parse(service.characteristics);
                if (Array.isArray(parsed)) return parsed.map((c) => (typeof c === "string" ? c : c.feature || c.name || ""));
            } catch (e) {
                return service.characteristics.split("\n").filter(Boolean);
            }
        }
        return [];
    };

    // Cotización por WhatsApp
    const advisors = General.whatsapp_advisors || [];
    const handleAdvisorClick = (advisor) => {
        const phone = advisor.phone?.replace(/[^0-9]/g, "");
        if (!phone) return;
        const msg = encodeURIComponent(
            `Hola ${advisor.name || ""}, me interesa solicitar información sobre el servicio: ${selectedService?.name || ""} (${window.location.href})`
        );
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
        setIsAdvisorDropdownOpen(false);
    };

    const handleSingleAdvisorClick = () => {
        const phone = (advisors[0]?.phone || generals?.find((g) => g.correlative === "phone_whatsapp")?.description || "").replace(/[^0-9]/g, "");
        if (!phone) return;
        const msg = encodeURIComponent(
            `Hola, me interesa solicitar información sobre el servicio: ${selectedService?.name || ""} (${window.location.href})`
        );
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    };

    // Derivar faqs antes de cualquier return condicional (Rules of Hooks)
    const faqs = Array.isArray(selectedService?.faqs)
        ? selectedService.faqs.filter((f) => f.question?.trim() && f.answer?.trim())
        : [];

    // Actualizar document.title, meta tags y Schema.org JSON-LD al cambiar de servicio (client-side & server-side hybrid)
    // IMPORTANTE: Este useEffect debe estar ANTES del return condicional (Rules of Hooks)
    useEffect(() => {
        if (!selectedService) return;

        const serviceTitle = selectedService.meta_title || selectedService.name || selectedService.title || "Servicio";
        const serviceDescription = selectedService.meta_description || selectedService.summary || selectedService.description?.replace(/<[^>]*>/g, "") || "";
        const serviceKeywords = selectedService.meta_keywords || "";
        const serviceImageUrl = selectedService.image || selectedService.background_image
            ? `${window.location.origin}/storage/images/service/${selectedService.image || selectedService.background_image}`
            : "";
        const currentUrl = window.location.href;
        const companyName = generals?.find((g) => g.correlative === "company_name")?.description || "NGS Solutions";

        // Document Title
        document.title = `${serviceTitle} | ${companyName}`;

        // Helper para meta tags
        const setMetaTag = (selectorKey, selectorValue, content) => {
            if (!content) return;
            let el = document.querySelector(`meta[${selectorKey}="${selectorValue}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(selectorKey, selectorValue);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        setMetaTag("name", "description", serviceDescription);
        setMetaTag("name", "keywords", serviceKeywords);
        setMetaTag("property", "og:type", "website");
        setMetaTag("property", "og:title", serviceTitle);
        setMetaTag("property", "og:description", serviceDescription);
        setMetaTag("property", "og:image", serviceImageUrl);
        setMetaTag("property", "og:url", currentUrl);
        setMetaTag("name", "twitter:card", "summary_large_image");
        setMetaTag("name", "twitter:title", serviceTitle);
        setMetaTag("name", "twitter:description", serviceDescription);
        setMetaTag("name", "twitter:image", serviceImageUrl);
        setMetaTag("name", "robots", "index, follow");

        // Actualizar canonical link para la URL actual del servicio
        let canonical = document.querySelector("link[rel='canonical']");
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", currentUrl);

        // Gestión Inteligente de Schema.org
        const serverGraphScript = document.getElementById("server-schema-graph");
        const serverSlug = serverGraphScript?.dataset?.serviceSlug;
        const hasServerServiceSchema = Boolean(serverSlug && serverSlug === selectedService.slug);

        if (hasServerServiceSchema) {
            // El servidor ya renderizó exactamente el esquema para este servicio (carga directa en /servicio/slug)
            const clientScript = document.getElementById("service-schema-jsonld");
            if (clientScript) clientScript.remove();
        } else {
            // Remover el script de FAQ del servidor si existe para evitar duplicados en el DOM
            const serverFaqScript = document.getElementById("server-schema-faq");
            if (serverFaqScript) serverFaqScript.remove();

            // Entró por /servicios o navegó a otro servicio en el sidebar: generar/actualizar schema dinámico
            const schemaGraph = [
                {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": serviceTitle,
                    "description": serviceDescription,
                    "provider": {
                        "@type": "Organization",
                        "name": companyName,
                        "url": window.location.origin,
                    },
                    "url": currentUrl,
                    ...(serviceImageUrl && { "image": serviceImageUrl }),
                },
            ];

            if (faqs.length > 0) {
                schemaGraph.push({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map((faq) => ({
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer,
                        },
                    })),
                });
            }

            let scriptTag = document.getElementById("service-schema-jsonld");
            if (!scriptTag) {
                scriptTag = document.createElement("script");
                scriptTag.id = "service-schema-jsonld";
                scriptTag.type = "application/ld+json";
                document.head.appendChild(scriptTag);
            }
            scriptTag.text = JSON.stringify(schemaGraph);
        }
    }, [selectedService, generals, faqs]);

    // Early return DESPUÉS de todos los hooks
    if (!selectedService) {
        return (
            <section id={data?.element_id || null} className={`py-24 px-primary 2xl:px-0 bg-sections-color ${data?.class || ""}`}>
                <div className="2xl:max-w-7xl mx-auto text-center">
                    <p className="text-neutral-dark font-medium">No se han encontrado servicios disponibles.</p>
                </div>
            </section>
        );
    }

    const servicesToShow = categoryServices.length > 0 ? categoryServices : sortedItems;
    const specifications = Array.isArray(selectedService?.specifications) ? selectedService.specifications : [];
    const pdfFiles = Array.isArray(selectedService?.pdf) ? selectedService.pdf : [];

    return (
        <div id={data?.element_id || "servicio-catalogo-ngs"} className={`bg-sections-color min-h-screen text-neutral-dark py-12 md:py-16 ${data?.class || ""}`}>
            <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0 space-y-10">

                {/* ── Main Section Header (data.title & data.description) ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Subtitle / Badge */}
                        {(data?.badge || data?.subtitle) && (
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase  rounded-full mb-4 border border-primary/20">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                {data?.badge || data?.subtitle}
                            </span>
                        )}

                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl xl:text-6xl text-center uppercase font-title font-bold text-neutral-dark ">
                            <TextWithHighlight
                                text={data?.title || "Nuestras *Soluciones* Especializadas"}
                                color="bg-secondary"
                                className="font-title"
                            />
                        </h2>

                        {/* Description */}
                        {data?.description && (
                            <p className="text-base text-neutral-light font-paragraph  mt-3 max-w-2xl mx-auto">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Categorías Carousel (si existen) ── */}
                {categories.length > 0 && (
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-md">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase  bg-primary/10 text-primary border border-primary/20 mb-2">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Nuestras Especialidades</span>
                                </span>
                                <h3 className="text-2xl md:text-3xl font-title font-bold text-neutral-dark uppercase">
                                    Categorías
                                </h3>
                            </div>

                            {/* Controles de Navegación Swiper */}
                            {categories.length > 4 && (
                                <div className="flex items-center gap-2">
                                    <button
                                        ref={prevCategoryRef}
                                        className="w-10 h-10 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white transition-all flex items-center justify-center shadow-sm cursor-pointer"
                                        aria-label="Anterior categoría"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        ref={nextCategoryRef}
                                        className="w-10 h-10 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white transition-all flex items-center justify-center shadow-sm cursor-pointer"
                                        aria-label="Siguiente categoría"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Swiper
                            modules={[Autoplay, Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            centerInsufficientSlides={true}
                            loop={categories.length > 4}
                            navigation={categories.length > 4 ? {
                                prevEl: prevCategoryRef.current,
                                nextEl: nextCategoryRef.current,
                            } : false}
                            onBeforeInit={(swiper) => {
                                if (categories.length > 4) {
                                    swiper.params.navigation.prevEl = prevCategoryRef.current;
                                    swiper.params.navigation.nextEl = nextCategoryRef.current;
                                }
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 16 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            className="w-full !py-2"
                        >
                            {categories.map((cat) => {
                                const isSelected = selectedCategory?.id === cat.id;
                                const imgUrl = cat.banner || cat.image
                                    ? `/storage/images/service_category/${cat.banner || cat.image}`
                                    : "/api/cover/thumbnail/null";

                                return (
                                    <SwiperSlide key={cat.id} className="h-auto">
                                        <div
                                            onClick={() => handleCategorySelect(cat)}
                                            className={`group cursor-pointer rounded-2xl p-5 transition-all duration-300 flex items-center gap-4 border select-none ${isSelected
                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                                : "bg-slate-50 hover:bg-white hover:border-slate-300 border-slate-200/80 shadow-xs"
                                                }`}
                                        >
                                            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-white p-1 border border-slate-100 shadow-2xs">
                                                <img
                                                    src={imgUrl}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-title font-bold text-sm truncate ${isSelected ? "text-white" : "text-neutral-dark group-hover:text-primary"}`}>
                                                    {cat.name}
                                                </h3>
                                                <span className={`text-xs ${isSelected ? "text-white/80" : "text-neutral-light"}`}>
                                                    Ver soluciones
                                                </span>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </section>
                )}

                {/* ── Main Catalog Content (Sidebar + Active Detail) ── */}
                <div className="grid grid-cols-12 gap-8 items-start">

                    {/* Left Sidebar: Service List (Con imagen avatar destacada, texto más grande y alto) */}
                    <aside className="col-span-12 lg:col-span-4 sticky top-28">
                        <nav className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto p-1">
                            {servicesToShow.map((service) => {
                                const isActive = selectedService.id === service.id;
                                const thumbUrl = service.image
                                    ? `/storage/images/service/${service.image}`
                                    : "/api/cover/thumbnail/null";

                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => handleServiceSelect(service)}
                                        className={`w-full text-left px-5 py-4 rounded-full transition-all duration-300 flex items-center gap-4 cursor-pointer group select-none ${isActive
                                            ? "bg-primary text-white shadow-lg shadow-primary/20 font-bold"
                                            : "bg-white hover:bg-slate-100 text-neutral-dark border border-slate-200/80 hover:border-slate-300 shadow-xs"
                                            }`}
                                    >
                                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-slate-50 p-0.5 border-2 border-white shadow-sm">
                                            <img
                                                src={thumbUrl}
                                                alt={service.name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 pr-1">
                                            <h4 className={`text-sm md:text-base font-title font-medium  line-clamp-2 ${isActive ? "text-white" : "text-neutral-dark group-hover:text-primary"}`}>
                                                {service.name || service.title}
                                            </h4>
                                            {service.subcategory && (
                                                <span className={`text-xs block truncate mt-0.5 ${isActive ? "text-white/80" : "text-neutral-light"}`}>
                                                    {service.subcategory.name}
                                                </span>
                                            )}
                                        </div>

                                        <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${isActive ? "text-white translate-x-1" : "text-slate-400 group-hover:text-primary group-hover:translate-x-1"}`} />
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Right Pane: Selected Service Detail Card */}
                    <div className="col-span-12 lg:col-span-8 bg-white rounded-[2rem] border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-8">

                        {/* Hero / Banner Image */}
                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-md">
                            <img
                                src={
                                    selectedService.background_image || selectedService.image
                                        ? `/storage/images/service/${selectedService.background_image || selectedService.image}`
                                        : "/api/cover/thumbnail/null"
                                }
                                alt={selectedService.name || "Servicio"}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/90 via-neutral-dark/35 to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white space-y-3">
                                {selectedService.category?.name && (
                                    <span className="inline-block px-3.5 py-1.5 bg-secondary text-white text-xs font-bold uppercase rounded-full  shadow-sm">
                                        {selectedService.category.name}
                                    </span>
                                )}
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-title font-bold  drop-shadow-lg">
                                    {selectedService.name || selectedService.title}
                                </h1>
                            </div>
                        </div>

                        {/* Description Body */}
                        {(selectedService.description || selectedService.summary) && (
                            <div
                                className="prose prose-base md:prose-lg max-w-none  
                                prose-headings:font-title prose-headings:font-bold prose-headings:text-neutral-dark 
                                prose-p:text-neutral-light prose-p:font-paragraph prose-p: 
                                prose-strong:text-neutral-dark prose-strong:font-bold 
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 
                                prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic 
                                prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 prose-img:shadow-md"
                                dangerouslySetInnerHTML={{
                                    __html: selectedService.description || selectedService.summary,
                                }}
                            />
                        )}

                        {/* Features / Characteristics List (rounded-full) */}
                        {getCharacteristics(selectedService).length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <h3 className="text-2xl font-title font-bold text-neutral-dark">Características</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-3.5">
                                    {getCharacteristics(selectedService).map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-3.5 px-5 py-3 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 rounded-full transition-all">
                                            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                                            <span className="text-sm sm:text-lg text-neutral-light font-medium ">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Technical Specifications Table */}
                        {specifications.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-xl font-title font-bold text-neutral-dark">Especificaciones Técnicas</h3>
                                <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-xs">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <tbody>
                                                {specifications.map((spec, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className="border-b border-slate-100 last:border-b-0 odd:bg-white even:bg-slate-50/60 hover:bg-slate-100/50 transition-colors"
                                                    >
                                                        {spec.title ? (
                                                            <>
                                                                <td className="py-3.5 px-5 font-bold text-neutral-dark text-xs uppercase  w-1/3 sm:w-2/5 align-top bg-slate-50/40 border-r border-slate-100">
                                                                    {spec.title}
                                                                </td>
                                                                <td className="py-3.5 px-5 text-neutral-dark/90 font-medium align-top ">
                                                                    {spec.description || spec.value}
                                                                </td>
                                                            </>
                                                        ) : (
                                                            <td colSpan={2} className="py-3.5 px-5 text-neutral-dark/90 font-medium ">
                                                                {spec.description || spec.value}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FAQs Section (Preguntas Frecuentes) */}
                        {faqs.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-slate-100">
                                <h3 className="text-2xl font-title font-bold text-neutral-dark flex items-center gap-2.5">
                                    <HelpCircle className="w-6 h-6 text-primary shrink-0" />
                                    Preguntas Frecuentes
                                </h3>
                                <div className="space-y-3">
                                    {faqs.map((faq, idx) => {
                                        const isOpen = openFaqIndex === idx;
                                        return (
                                            <div
                                                key={idx}
                                                className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-title font-bold text-neutral-dark text-base sm:text-lg focus:outline-none cursor-pointer"
                                                >
                                                    <span>{faq.question}</span>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-primary shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 pb-5 text-neutral-light font-paragraph text-sm sm:text-lg  border-t border-slate-200/60 pt-3">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* CTAs: WhatsApp Quote + PDF Download */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                            {/* PDF Download */}
                            {pdfFiles.length > 0 && (
                                <div className="relative flex-1">
                                    {pdfFiles.length === 1 ? (
                                        <a
                                            href={`/storage/images/service/${pdfFiles[0].url || pdfFiles[0]}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-neutral-dark rounded-full font-bold text-xs uppercase  flex items-center justify-center gap-2 transition-all"
                                        >
                                            <Download className="w-4 h-4 text-primary" />
                                            <span>DESCARGAR FICHA PDF</span>
                                        </a>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setIsPdfDropdownOpen(!isPdfDropdownOpen)}
                                                className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-neutral-dark rounded-full font-bold text-xs uppercase  flex items-center justify-center gap-2 transition-all"
                                            >
                                                <Download className="w-4 h-4 text-primary" />
                                                <span>DOCUMENTOS PDF</span>
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isPdfDropdownOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            {isPdfDropdownOpen && (
                                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 p-2 space-y-1">
                                                    {pdfFiles.map((pdf, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={`/storage/images/service/${pdf.url || pdf}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full text-left px-3 py-2 text-sm font-bold text-neutral-dark hover:bg-slate-50 rounded-xl flex items-center justify-between"
                                                        >
                                                            <span className="truncate me-2">{pdf.name || `Ficha ${idx + 1}`}</span>
                                                            <FileText className="w-4 h-4 text-red-600 shrink-0" />
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {/* WhatsApp Quote Button */}
                            <div className="relative flex-1">
                                {advisors.length > 1 ? (
                                    <>
                                        <button
                                            onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                                            className="w-full py-4 px-6 bg-accent hover:bg-primary text-white rounded-full font-bold text-sm uppercase  flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 cursor-pointer"
                                        >
                                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                            </svg>
                                            <span>SOLICITAR COTIZACIÓN</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isAdvisorDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {isAdvisorDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 p-2 space-y-1">
                                                {advisors.map((adv, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAdvisorClick(adv)}
                                                        className="w-full text-left px-3 py-2 text-sm font-bold text-neutral-dark hover:bg-slate-50 rounded-xl flex items-center justify-between"
                                                    >
                                                        <span>{adv.name || `Asesor ${idx + 1}`}</span>
                                                        <svg className="w-4 h-4 fill-green-600 shrink-0" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={handleSingleAdvisorClick}
                                        className="w-full py-4 px-6 bg-accent hover:bg-primary text-white rounded-full font-bold text-sm uppercase  flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 cursor-pointer"
                                    >
                                        <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                        </svg>
                                        <span>SOLICITAR COTIZACIÓN</span>
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ServiceDetailCatalogNgs;
