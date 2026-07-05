import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────── */
const bannerSrc = (cat) =>
    cat?.banner
        ? `/storage/images/category/${cat.banner}`
        : "/api/cover/thumbnail/null";

/* ─── Card Individual de Categoría ────────────────────────── */
const Card = ({ cat, path }) => {
    const [hovered, setHovered] = useState(false);
    const href = path
        ? `/${path}/${cat.slug}`
        : `/catalogo?category=${cat.slug}`;

    return (
        <a
            href={href}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative flex overflow-hidden rounded-[2rem] transition-all duration-500 ease-out cursor-pointer select-none aspect-square w-full"

        >
            {/* 1. Capa de Fondo: Banner publicitario de la categoría */}
            <img
                src={bannerSrc(cat)}
                alt={cat.name}
                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-750 ease-out z-0"
                style={{
                    transform: hovered ? "scale(1.05)" : "scale(1)",
                }}
            />


            {/* 3. Capa del Producto: PNG transparente con efecto flotante 3D */}
            {cat?.image && (
                <div className="absolute inset-0 flex items-end justify-end p-6 sm:p-8 z-20 overflow-hidden pointer-events-none">
                    <img
                        src={`/storage/images/category/${cat.image}`}
                        alt={`Producto de ${cat.name}`}
                        onError={(e) => (e.target.style.display = "none")}
                        className="w-[62%] h-[62%] sm:w-[68%] sm:h-[68%] object-contain transition-all duration-700 ease-out drop-shadow-[0_20px_20px_rgba(0,0,0,0.45)]"
                        style={{
                            transform: hovered
                                ? "translateY(-12px) scale(1.12) rotate(3deg)"
                                : "translateY(0) scale(1) rotate(0deg)",
                        }}
                    />
                </div>
            )}

            {/* 4. Capa de Texto: Esquina superior izquierda */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-30 text-left flex flex-col items-start gap-1">
                <h3 className="font-paragraph font-semibold text-white text-4xl lg:text-3xl xl:text-4xl drop-shadow-md text-wrap">
                    {cat.name}
                </h3>


            </div>
        </a>
    );
};

/* ─── Componente Principal ────────────────────────────────── */
const CategoryBannerMicjc = ({ data, items }) => {
    if (!items || items.length === 0) return null;

    const path = data?.path;

    // Ordenar elementos según order_index (de menor a mayor)
    const sortedItems = [...items].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
    const count = sortedItems.length;

    // Renderizar cuadrícula fija para un máximo de 4 elementos
    const renderGrid = () => {
        if (count === 1) {
            return (
                <div className="grid grid-cols-1 max-w-sm mx-auto w-full">
                    <Card cat={sortedItems[0]} path={path} />
                </div>
            );
        }
        if (count === 2) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6 md:gap-8 w-full">
                    {sortedItems.map((cat) => (
                        <Card key={cat.id} cat={cat} path={path} />
                    ))}
                </div>
            );
        }
        if (count === 3) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full">
                    {sortedItems.map((cat) => (
                        <Card key={cat.id} cat={cat} path={path} />
                    ))}
                </div>
            );
        }
        // count === 4
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
                {sortedItems.map((cat) => (
                    <Card key={cat.id} cat={cat} path={path} />
                ))}
            </div>
        );
    };

    return (
        <section
            id={data?.element_id || undefined}
            className={`relative bg-white py-12 sm:py-10 overflow-hidden ${data?.class_section || ""}`}
        >
            {/* Contenedor principal idéntico a ProductInfinite.jsx */}
            <div className="relative mx-auto px-[5%] replace-max-w-here 2xl:px-0 2xl:max-w-7xl">
                <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight text-center font-title py-4 md:py-8 text-neutral-dark">
                    {data?.title}
                </h2>
                {/* Renderizado de Rejilla Estática */}
                {renderGrid()}
            </div>
        </section>
    );
};

export default CategoryBannerMicjc;
