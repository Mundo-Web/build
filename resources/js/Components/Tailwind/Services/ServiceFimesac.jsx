import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, CheckCircle2 } from "lucide-react";
import General from "../../../Utils/General";

const ServiceFimesac = ({ data, items = [], generals = [], onClickTracking }) => {
    const [selectedService, setSelectedService] = useState(items[0] || null);

    const advisors = General.whatsapp_advisors || [];
    const mainPhone = (
        advisors[0]?.phone ||
        generals?.find((g) => g.correlative === "phone_whatsapp")?.description ||
        ""
    ).replace(/[^0-9]/g, "");

    const handleServiceClick = (service) => {
        setSelectedService(service);
        if (onClickTracking && typeof onClickTracking === "function") {
            onClickTracking(service);
        }
    };

    const handleWhatsAppClick = (service) => {
        if (!mainPhone) return;
        const msg = encodeURIComponent(
            `Hola, solicito información sobre el servicio: ${service?.name || ""}`,
        );
        window.open(`https://wa.me/${mainPhone}?text=${msg}`, "_blank");
    };

    const getServiceImage = (service) => {
        if (!service) return null;
        const img = service.banner || service.image || service.url_image;
        if (!img) return null;
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        return `/storage/images/service/${img}`;
    };

    const getHtmlContent = (service) => {
        if (!service) return "";
        return service.description || service.summary || service.extract || "";
    };

    return (
        <section
            id={data?.element_id || null}
            className={`py-16 md:py-24 bg-white text-neutral-dark ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-4 md:px-6 2xl:px-0 2xl:max-w-7xl">
                {/* Section Header - Centered with ProductFimesac typography */}
                {(data?.title || data?.subtitle || data?.description) && (
                    <div className="mb-12 text-center max-w-3xl mx-auto">
                        {data?.subtitle && (
                            <span className="text-xs font-bold tracking-widest text-primary uppercase block mb-2">
                                {data.subtitle}
                            </span>
                        )}
                        {data?.title && (
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-dark">
                                {data.title}
                            </h2>
                        )}
                        {data?.description && (
                            <p className="text-neutral-light text-sm mt-2">
                                {data.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Main Content Grid (Tema Claro Fimesac) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 border border-slate-200 bg-white rounded-none shadow-sm">
                    {/* Left Sidebar - Service List */}
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/80 p-6 md:p-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-light mb-6 pb-3 border-b border-slate-200">
                            NUESTROS SERVICIOS
                        </h3>

                        <nav className="space-y-2">
                            {items.map((service, index) => {
                                const isSelected =
                                    selectedService?.id === service.id ||
                                    (!selectedService && index === 0);
                                return (
                                    <button
                                        key={service.id || index}
                                        onClick={() => handleServiceClick(service)}
                                        className={`w-full text-left px-5 py-4 font-bold text-sm md:text-base uppercase tracking-wider transition-all flex items-center justify-between group rounded-none border-l-4 ${isSelected
                                                ? "bg-primary text-white border-primary shadow-sm"
                                                : "bg-white text-neutral-dark border-slate-200 hover:bg-slate-100 hover:text-primary"
                                            }`}
                                    >
                                        <span className="truncate me-3">{service.name}</span>
                                        <ChevronRight
                                            className={`w-5 h-5 shrink-0 transition-transform ${isSelected
                                                    ? "translate-x-1 text-white"
                                                    : "text-neutral-light group-hover:text-primary"
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-8 p-6 md:p-10 lg:p-12 bg-white flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                            {selectedService ? (
                                <motion.div
                                    key={selectedService.id || selectedService.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-8"
                                >
                                    {/* Image Container */}
                                    {getServiceImage(selectedService) && (
                                        <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden border border-slate-200 bg-slate-50">
                                            <img
                                                src={getServiceImage(selectedService)}
                                                alt={selectedService.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Service Title & Badge */}
                                    <div>

                                        <h3 className="text-2xl md:text-3xl font-display font-bold text-neutral-dark">
                                            {selectedService.name}
                                        </h3>
                                    </div>

                                    {/* Service Description (Render HTML cleanly) */}
                                    {getHtmlContent(selectedService) && (
                                        <div
                                            className="text-neutral-600 text-base md:text-lg font-paragraph leading-relaxed prose max-w-none prose-p:mb-4 prose-ul:list-disc prose-ul:ps-5 prose-li:mb-2 prose-strong:text-neutral-dark font-normal"
                                            dangerouslySetInnerHTML={{
                                                __html: getHtmlContent(selectedService),
                                            }}
                                        />
                                    )}

                                    {/* Service Features List if provided as array */}
                                    {Array.isArray(selectedService.features) &&
                                        selectedService.features.length > 0 && (
                                            <div className="pt-4 border-t border-slate-200">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-light mb-4">
                                                    CARACTERÍSTICAS Y ALCANCE
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {selectedService.features.map((feat, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-3 bg-slate-50 p-3 border border-slate-200"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                                            <span className="text-sm font-medium text-neutral-dark">
                                                                {typeof feat === "string" ? feat : feat.name || feat.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                    {/* Call to Action Button */}
                                    <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-4 items-stretch">
                                        <button
                                            onClick={() => handleWhatsAppClick(selectedService)}
                                            className="py-4 px-8 bg-primary hover:bg-neutral-dark text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg rounded-none active:scale-[0.99]"
                                        >
                                            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                            </svg>
                                            <span>SOLICITAR COTIZACIÓN DE ESTE SERVICIO</span>
                                        </button>

                                        {selectedService.link && (
                                            <a
                                                href={selectedService.link}
                                                className="py-4 px-6 bg-white border-2 border-neutral-dark text-neutral-dark font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-dark hover:text-white transition-all rounded-none"
                                            >
                                                <span>VER MÁS DETALLES</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-center py-20 text-neutral-400">
                                    <p className="text-lg">No hay servicios disponibles.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceFimesac;
