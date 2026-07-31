import React, { useState, useEffect, useMemo } from "react";
import { Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

/**
 * ProjectsGalleryNgs — Galería Dinámica en Mosaico para Proyectos NGS Solutions.
 * Enfocada en Imagen + Nombre con diseño mosaico flex responsivo.
 */
const ProjectsGalleryNgs = ({ data, items = [] }) => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [activeProject, setActiveProject] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const title = data?.title || "Nuestros *Proyectos* Realizados";
    const subtitle = data?.description || data?.subtitle;

    // Extraer categorías únicas de los proyectos
    const categories = useMemo(() => {
        const catMap = new Map();
        items.forEach((item) => {
            const cat = item.category || item.service_category;
            if (cat && cat.id) {
                catMap.set(cat.id, cat.name);
            }
        });
        return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
    }, [items]);

    // Filtrar proyectos según categoría seleccionada
    const filteredProjects = useMemo(() => {
        if (selectedCategory === "all") return items;
        return items.filter((item) => {
            const catId =
                item.project_category_id ||
                item.service_category_id ||
                item.category?.id ||
                item.service_category?.id;
            return catId === selectedCategory;
        });
    }, [items, selectedCategory]);

    // Abrir Modal de Imagen / Galería
    const openModal = (project) => {
        setActiveProject(project);
        setSelectedImageIndex(0);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setActiveProject(null);
        document.body.style.overflow = "auto";
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && activeProject) {
                closeModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeProject]);

    // Imágenes del proyecto activo (portada + galería extra si posee)
    const activeImages = useMemo(() => {
        if (!activeProject) return [];
        const imgs = [];
        if (activeProject.image) {
            imgs.push({
                url: `/storage/images/project/${activeProject.image}`,
                name: activeProject.name,
            });
        }
        if (activeProject.images && activeProject.images.length > 0) {
            activeProject.images.forEach((img) => {
                imgs.push({
                    url: `/storage/images/project/${img.image}`,
                    name: activeProject.name,
                });
            });
        }
        return imgs;
    }, [activeProject]);

    // Asignar clases de tamaño flexibles para patrón de mosaico dinámico (Flex Masonry pattern)
    const getMosaicClass = (index) => {
        const pattern = index % 5;
        switch (pattern) {
            case 0:
                // Tarjeta ancha
                return "flex-[1_1_100%] md:flex-[1_1_calc(60%-12px)] h-[320px] md:h-[420px]";
            case 1:
                // Tarjeta media
                return "flex-[1_1_100%] md:flex-[1_1_calc(40%-12px)] h-[320px] md:h-[420px]";
            case 2:
                // Tarjeta 1/3
                return "flex-[1_1_100%] sm:flex-[1_1_calc(50%-12px)] lg:flex-[1_1_calc(33.333%-16px)] h-[300px] md:h-[380px]";
            case 3:
                // Tarjeta 1/3
                return "flex-[1_1_100%] sm:flex-[1_1_calc(50%-12px)] lg:flex-[1_1_calc(33.333%-16px)] h-[300px] md:h-[380px]";
            case 4:
                // Tarjeta 1/3
                return "flex-[1_1_100%] sm:flex-[1_1_calc(100%-12px)] lg:flex-[1_1_calc(33.333%-16px)] h-[300px] md:h-[380px]";
            default:
                return "flex-[1_1_100%] md:flex-[1_1_calc(50%-12px)] h-[320px] md:h-[400px]";
        }
    };

    if (!items || items.length === 0) return null;

    return (
        <section
            id={data?.element_id || null}
            className={`relative py-12 md:py-20 bg-white ${data?.class || ""}`}
        >
            <div className="relative z-10 mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* ── Encabezado NGS ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-3xl">
                        {/* Subtítulo / Badge si existe */}
                        {data?.badge && (
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs uppercase font-semibold tracking-wider mb-3">
                                {data.badge}
                            </div>
                        )}

                        <h2 className="text-4xl md:text-5xl xl:text-6xl uppercase font-title font-bold text-neutral-dark">
                            <TextWithHighlight
                                text={title}
                                color="bg-secondary"
                                className="font-title"
                            />
                        </h2>

                        {subtitle && (
                            <p className="mt-4 text-slate-600 text-base md:text-lg max-w-2xl">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Categorías de Proyectos (Filtros NGS Pills) ── */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-10">
                        <button
                            onClick={() => setSelectedCategory("all")}
                            className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 ${selectedCategory === "all"
                                ? "bg-accent text-white shadow-lg shadow-accent/25 scale-105"
                                : "bg-white text-neutral-dark border border-slate-200 hover:bg-secondary hover:text-white hover:border-secondary"
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => {
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 active:scale-95 ${selectedCategory === cat.id
                                        ? "bg-accent text-white shadow-lg shadow-accent/25 scale-105"
                                        : "bg-white text-neutral-dark border border-slate-200 hover:bg-secondary hover:text-white hover:border-secondary"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Mosaico Flex de Proyectos (Imagen + Nombre) ── */}
                {filteredProjects.length > 0 ? (
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        {filteredProjects.map((project, index) => {
                            const categoryName =
                                project.category?.name ||
                                project.service_category?.name;
                            const imageSrc = project.image
                                ? `/storage/images/project/${project.image}`
                                : "/assets/resources/cover-404.svg";

                            return (
                                <div
                                    key={project.id || index}
                                    onClick={() => openModal(project)}
                                    className={`group relative overflow-hidden rounded-3xl bg-neutral-dark cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 ${getMosaicClass(
                                        index
                                    )}`}
                                >
                                    {/* Imagen de Fondo */}
                                    <img
                                        src={imageSrc}
                                        alt={project.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.src =
                                                "/assets/resources/cover-404.svg";
                                        }}
                                    />

                                    {/* Degradado para Legibilidad de Texto */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent   transition-opacity duration-300" />

                                    {/* Badge Categoría en Top-Left */}
                                    {categoryName && (
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/20 shadow-sm">
                                                {categoryName}
                                            </span>
                                        </div>
                                    )}

                                    {/* Botón Ver Icono en Top-Right */}
                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <Eye className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {/* Nombre del Proyecto en Bottom-Left */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end items-start">
                                        <div className="inline-flex flex-col items-start max-w-full">
                                            <h3 className="text-xl md:text-2xl xl:text-3xl font-title font-bold uppercase text-white  transition-colors duration-300 leading-tight drop-shadow-md">
                                                {project.name}
                                            </h3>
                                            {/* Línea decorativa NGS al Hover que abarca solo el ancho de las letras */}
                                            <div className="w-10 group-hover:w-full h-1 bg-secondary rounded-full mt-2.5 transition-all duration-500 ease-out" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center">
                        <p className="text-slate-500 font-medium">
                            No hay proyectos disponibles en esta categoría.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Modal Lightbox Fullscreen para Proyecto Seleccionado ── */}
            {activeProject && (
                <div className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div
                        className="relative w-full max-w-5xl bg-neutral-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de Cierre */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-accent hover:bg-accent text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 shadow-lg"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Visor Principal de la Imagen */}
                        <div className="relative flex-1 bg-black min-h-[350px] md:min-h-[500px] flex items-center justify-center overflow-hidden p-4">
                            {activeImages.length > 0 ? (
                                <img
                                    src={activeImages[selectedImageIndex]?.url}
                                    alt={activeProject.name}
                                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
                                />
                            ) : (
                                <div className="text-slate-400">
                                    Sin imagen disponible
                                </div>
                            )}

                            {/* Flechas de Navegación si hay varias imágenes */}
                            {activeImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() =>
                                            setSelectedImageIndex((prev) =>
                                                prev > 0
                                                    ? prev - 1
                                                    : activeImages.length - 1
                                            )
                                        }
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-secondary text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() =>
                                            setSelectedImageIndex((prev) =>
                                                prev < activeImages.length - 1
                                                    ? prev + 1
                                                    : 0
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-secondary text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Pie de Modal con Nombre y Miniaturas */}
                        <div className="p-6 bg-neutral-dark border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-title font-bold uppercase text-white">
                                    {activeProject.name}
                                </h3>
                                {(activeProject.category?.name ||
                                    activeProject.service_category?.name) && (
                                        <span className="text-xs uppercase font-semibold text-secondary tracking-wider mt-1 block">
                                            {activeProject.category?.name ||
                                                activeProject.service_category?.name}
                                        </span>
                                    )}
                            </div>

                            {/* Miniaturas de Galería */}
                            {activeImages.length > 1 && (
                                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                                    {activeImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setSelectedImageIndex(idx)
                                            }
                                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImageIndex === idx
                                                ? "border-secondary scale-105 opacity-100 shadow-md"
                                                : "border-transparent opacity-40 hover:opacity-100"
                                                }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProjectsGalleryNgs;
