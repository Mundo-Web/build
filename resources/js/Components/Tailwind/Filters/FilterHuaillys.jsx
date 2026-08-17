import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import ProductCardSelector from '../Products/ProductCardSelector';
import ItemsRest from "../../../Actions/ItemsRest";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import { GET } from "sode-extend-react";

const itemsRest = new ItemsRest();

// Skeleton card que replica la estructura visual exacta de las tarjetas de producto
const ProductCardSkeleton = ({ isSharp = false }) => {
    return (
        <div className={`flex flex-col justify-between overflow-hidden bg-white border border-slate-200 ${isSharp ? "rounded-none" : "rounded-lg"} shadow-sm h-full w-full animate-pulse`}>
            {/* Imagen Skeleton */}
            <div className="relative w-full aspect-square bg-slate-100 flex items-center justify-center p-6 border-b border-slate-100">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-200/80 rounded-md"></div>
                {/* Badge skeleton */}
                <div className="absolute top-3 left-3 w-12 sm:w-16 h-5 bg-slate-200/90 rounded"></div>
            </div>

            {/* Contenido Skeleton */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white gap-4">
                <div className="space-y-2">
                    {/* Categoría / SKU */}
                    <div className="h-3 w-20 sm:w-24 bg-slate-200 rounded"></div>
                    {/* Título de 2 líneas */}
                    <div className="h-4 sm:h-5 w-full bg-slate-200 rounded"></div>
                    <div className="h-4 sm:h-5 w-2/3 bg-slate-200 rounded"></div>
                </div>

                <div className="pt-2 space-y-3">
                    {/* Precio */}
                    <div className="h-5 sm:h-6 w-24 sm:w-28 bg-slate-200 rounded"></div>
                    {/* Botón de acción */}
                    <div className={`h-9 sm:h-10 w-full bg-slate-100 border border-slate-200 ${isSharp ? "rounded-none" : "rounded-md"}`}></div>
                </div>
            </div>
        </div>
    );
};

const FilterHuaillys = ({ items, data, cart, setCart, filteredData, setFavorites, favorites }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const productsSectionRef = useRef(null);

    // Función de scroll ultra-suave con desaceleración cúbica (ease-in-out) para desktop y mobile
    const smoothScrollToProducts = (duration = 750) => {
        if (!productsSectionRef.current || typeof window === "undefined") return;

        const target = productsSectionRef.current;
        const startPosition = window.pageYOffset || document.documentElement.scrollTop;
        const offset = window.innerWidth < 1024 ? 70 : 90; // offset para headers sticky
        const targetPosition = target.getBoundingClientRect().top + startPosition - offset;
        const distance = targetPosition - startPosition;

        if (Math.abs(distance) < 15) return;

        let startTime = null;

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        const step = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    // Soporte para variante ("original" o "rounded-none" / "fimesac")
    const variant =
        data?.variant ||
        data?.type_variant ||
        data?.class_variant ||
        data?.style ||
        data?.option ||
        "original";

    const isSharp =
        variant === "rounded-none" ||
        variant === "fimesac" ||
        variant === "flat" ||
        variant === "sharp" ||
        (typeof data?.class_section === "string" &&
            data?.class_section.includes("rounded-none")) ||
        (typeof data?.class === "string" &&
            data?.class.includes("rounded-none"));

    const typeCategoryCard =
        data?.type_category_card ||
        data?.type_card_category ||
        (isSharp ? "CategoryFimesac" : "default");

    const isFimesacCategoryCard =
        typeCategoryCard === "CategoryFimesac" ||
        typeCategoryCard === "fimesac" ||
        isSharp;

    const cardTypeToRender =
        data?.type_card_product ||
        (isSharp ? "CardProductFimesac" : "ProductCard");

    // Helper robusto para obtener la URL correcta de la imagen de categoría
    const getCategoryImageUrl = (cat) => {
        const img =
            cat?.image ||
            cat?.banner ||
            cat?.imagen ||
            cat?.icon ||
            cat?.picture ||
            cat?.image_url ||
            cat?.url;
        if (!img || typeof img !== "string")
            return "/assets/img/noimage/no_imagen_circular.png";
        if (img.startsWith("http://") || img.startsWith("https://")) return img;
        if (img.includes("storage/")) {
            const index = img.indexOf("storage/");
            return `/${img.substring(index)}`;
        }
        if (img.startsWith("/")) return img;
        if (img.includes("/")) return `/storage/${img}`;
        return `/storage/images/category/${img}`;
    };

    // Helper para normalizar cadenas (quitar tildes, minúsculas, espacios)
    const normalizeStr = (str) =>
        str ? String(str).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";

    // Obtener el param ?category de la URL — siempre desde window.location en cliente
    const getUrlCategoryParam = () => {
        if (typeof window === "undefined") return GET.category || null;
        return GET.category || new URLSearchParams(window.location.search).get("category") || null;
    };

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    // loading = true desde el primer frame: siempre muestra skeleton antes que nada
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState({ category_id: [] });

    // Ref para evitar doble fetch en strict mode y detectar si ya se hizo el fetch inicial
    const fetchedOnce = useRef(false);

    // Función para transformar categoryIds al formato del backend
    const buildFilter = (categoryIds) => {
        if (!categoryIds || categoryIds.length === 0) return [];
        const conditions = categoryIds
            .map((val) => {
                const numId = typeof val === "number" ? val : parseInt(val);
                return !isNaN(numId) ? ["category.id", "=", numId] : null;
            })
            .filter(Boolean);
        if (conditions.length === 0) return [];
        if (conditions.length === 1) return conditions[0];
        return conditions.reduce((acc, cond, i) => (i === 0 ? cond : [acc, "or", cond]));
    };

    // Fetch central — recibe categoryIds directamente, sin leer estado
    const fetchProducts = async (categoryIds) => {
        console.log("[FilterHuaillys] fetchProducts llamado con ids:", categoryIds);
        setLoading(true);
        try {
            const filter = buildFilter(categoryIds);
            const response = await itemsRest.paginate({
                filter,
                sort: [{ selector: "final_price", desc: true }],
                skip: 0,
                take: 24,
                requireTotalCount: true,
            });
            if (response.status !== 200) throw new Error(`API status ${response.status}`);
            console.log("[FilterHuaillys] respuesta OK, productos:", response.data?.length);
            setProducts(response.data || []);
        } catch (err) {
            console.error("[FilterHuaillys] error fetch:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Efecto principal: se ejecuta cuando llegan las categorías/items
    // Decide si hay param URL para filtrar o si carga todos los productos
    useEffect(() => {
        // Evitar doble ejecución en Strict Mode
        if (fetchedOnce.current) return;

        const cats =
            filteredData?.categories ||
            data?.categories ||
            (Array.isArray(items) && items.length > 0 && items.some((i) => i.name && (i.image || i.banner || i.slug))
                ? items
                : []);

        console.log("[FilterHuaillys] cats encontradas:", cats.length, "| URL param:", getUrlCategoryParam());

        if (cats && cats.length > 0) {
            setCategories(cats);
            const urlCat = getUrlCategoryParam();

            if (urlCat) {
                // Buscar categoría por slug, nombre o id
                const target = normalizeStr(urlCat);
                const found = cats.find((cat) => {
                    const cSlug = normalizeStr(cat.slug || "");
                    const cId = String(cat.id || "");
                    const cName = normalizeStr(cat.name || cat.nombre || "");
                    return (
                        cId === target ||
                        cSlug === target ||
                        cName === target ||
                        cSlug.includes(target) ||
                        target.includes(cSlug)
                    );
                });

                console.log("[FilterHuaillys] categoría encontrada:", found?.name, "| id:", found?.id);

                if (found) {
                    setSelectedCategory(found);
                    setSelectedFilters({ category_id: [found.id] });
                    setTimeout(() => smoothScrollToProducts(850), 300);
                }

                fetchedOnce.current = true;
                fetchProducts(found ? [found.id] : []);
                return;
            }

            // Sin param URL: cargar todos los productos
            fetchedOnce.current = true;
            fetchProducts([]);
        } else if (!getUrlCategoryParam()) {
            // Sin categorías y sin URL param: usar items directamente si son productos
            if (items && items.length > 0) {
                // Si items son products (no tienen image+banner+slug típico de categorías)
                // o si el componente los provee directamente
                fetchedOnce.current = true;
                setProducts(items);
                setLoading(false);
            }
        }
        // Si hay URL param pero aún no llegaron cats, esperar a la próxima ejecución
    }, [filteredData, data, items]);

    // Función para procesar texto con formato ** para customtext-primary
    const processHighlightText = (text) => {
        if (!text) return null;

        const parts = text.split(/(\*.*?\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                const cleanText = part.replace(/\*/g, '');
                return (
                    <span key={index} className="font-title customtext-primary ">
                        <br />
                        {cleanText}
                    </span>
                );
            }
            return <span className="font-title" key={index}>{part}</span>;
        });
    };

    // Manejar click en categoría: llama fetchProducts directamente, sin depender de useEffect
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        const ids = category ? [category.id] : [];
        setSelectedFilters({ category_id: ids });

        // Actualizar URL
        const url = new URL(window.location.href);
        if (category === null) {
            url.searchParams.delete("category");
        } else {
            url.searchParams.set("category", category.slug || category.id);
        }
        window.history.pushState({}, "", url);

        // Smooth scroll + fetch directo con los ids correctos
        setTimeout(() => smoothScrollToProducts(750), 50);
        fetchProducts(ids);
    };

    // Función para manejar click en producto
    const handleProductClick = (product) => {
        window.location.href = `/product/${product.slug}`;
    };

    return (
        <div id={data?.element_id || null} className="w-full bg-white font-paragraph">
            {/* Hero Section con Imagen de Fondo */}
            {data?.background_image && (
                <div
                    className="relative w-full h-64 lg:h-72 bg-cover  flex items-center justify-center"
                    style={{
                        backgroundImage: `url(${data.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative w-full z-10 text-start px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <h1 className={`text-3xl md:text-5xl font-title lg:text-7xl text-start text-white ${data?.class_hero_title || ''}`}>
                            {processHighlightText(data?.hero_title || 'Nuestro *Catálogo*')}
                        </h1>
                        {data?.hero_subtitle && (
                            <p className={`text-lg md:text-xl text-white/90 mt-4 font-paragraph ${data?.class_hero_subtitle || ''}`}>
                                {data.hero_subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Sección de Categorías */}
            <section className="py-8 lg:py-16 bg-secondary">
                <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">


                    {/* Slider de Categorías */}
                    {categories && categories.length > 0 && (
                        <div className="relative">


                            <Swiper
                                modules={[Autoplay, Navigation]}
                                spaceBetween={16}
                                slidesPerView={2}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                navigation={{
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current,
                                }}
                                onBeforeInit={(swiper) => {
                                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                                    swiper.params.navigation.nextEl = navigationNextRef.current;
                                }}
                                loop={categories.length > 4}
                                speed={800}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 16,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                    1200: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                }}
                                className="category-swiper"
                            >
                                {categories.map((category) => (
                                    <SwiperSlide key={category.id}>
                                        {isFimesacCategoryCard ? (
                                            /* UI Tarjeta de Categoría Fimesac */
                                            <div
                                                className={`group relative flex flex-col justify-between aspect-[3/4] sm:aspect-[4/5] bg-white border border-slate-200 overflow-hidden cursor-pointer hover:border-primary transition-all duration-500 ${isSharp ? "rounded-none" : "rounded-lg"
                                                    } hover:shadow-xl p-4 sm:p-5 md:p-6 my-2 md:my-4 h-full ${selectedCategory?.id === category.id
                                                        ? `border-primary ring-2 ring-primary ${data?.class_category_card_selected || ""}`
                                                        : ""
                                                    }`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                {/* Smooth left-to-right top industrial accent line */}
                                                <div
                                                    className={`absolute top-0 left-0 w-full h-1 bg-primary transform ${selectedCategory?.id === category.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                                                        } transition-transform origin-left duration-500 z-20`}
                                                ></div>

                                                {/* Title Header */}
                                                <div className="w-full shrink-0 z-10 mb-2">
                                                    <h3
                                                        className={`text-sm sm:text-base md:text-lg font-display font-bold uppercase leading-snug line-clamp-2 transition-colors duration-300 ${selectedCategory?.id === category.id
                                                            ? "text-primary"
                                                            : "text-neutral-dark group-hover:text-primary"
                                                            } ${data?.class_category_card_title || ""}`}
                                                    >
                                                        {category.name || category.nombre}
                                                    </h3>
                                                </div>

                                                {/* Image Container */}
                                                <div className="relative w-full flex-1 flex items-center justify-center min-h-[90px] sm:min-h-[120px] py-2 z-0 overflow-hidden">
                                                    <img
                                                        src={getCategoryImageUrl(category)}
                                                        alt={category.name || category.nombre}
                                                        className="max-w-[85%] max-h-[85px] sm:max-h-[115px] md:max-h-[145px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src =
                                                                "/assets/img/noimage/no_imagen_circular.png";
                                                        }}
                                                    />
                                                    {selectedCategory?.id === category.id && (
                                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center pointer-events-none rounded-sm">
                                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-primary ${isSharp ? "rounded-none" : "rounded-full"} flex items-center justify-center shadow-lg`}>
                                                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className="w-full shrink-0 flex justify-between items-center z-10 pt-3 mt-1 border-t border-slate-100 transition-colors">
                                                    <span className="text-[10px] sm:text-xs font-mono font-bold text-neutral-light uppercase group-hover:text-neutral-dark transition-colors truncate me-1">
                                                        {selectedCategory?.id === category.id ? "Seleccionado" : "Ver catálogo"}
                                                    </span>
                                                    <div
                                                        className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 ${isSharp ? "rounded-none" : "rounded-full"
                                                            } ${selectedCategory?.id === category.id
                                                                ? "bg-primary text-white"
                                                                : "bg-slate-50 text-neutral-light group-hover:bg-primary group-hover:text-white"
                                                            } flex items-center justify-center transition-colors`}
                                                    >
                                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* UI Tarjeta de Categoría Estándar (Huaillys) */
                                            <div
                                                className={`group cursor-pointer ${isSharp ? "rounded-none" : "rounded-2xl"} overflow-hidden hover:shadow-xl transition-all duration-300 h-full my-4 ${selectedCategory?.id === category.id
                                                    ? `bg-white ${data?.class_category_card_selected || ''}`
                                                    : 'bg-white'
                                                    }`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                {/* Imagen de la categoría */}
                                                <div className={`relative aspect-[4/3] overflow-hidden ${isSharp ? "rounded-none" : "rounded-t-2xl"} bg-gray-100`}>
                                                    <img
                                                        src={getCategoryImageUrl(category)}
                                                        alt={category.name || category.nombre}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/assets/img/noimage/no_img.jpg';
                                                        }}
                                                    />

                                                    {/* Overlay con check si está seleccionada */}
                                                    {selectedCategory?.id === category.id && (
                                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                            <div className={`w-16 h-16 bg-primary ${isSharp ? "rounded-none" : "rounded-full"} flex items-center justify-center`}>
                                                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Contenido de la tarjeta */}
                                                <div className={`p-4 lg:px-6 transition-colors duration-300 ${isSharp ? "rounded-none" : "rounded-b-2xl"} ${selectedCategory?.id === category.id
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white group-hover:bg-primary group-hover:text-white'
                                                    }`}>
                                                    <h3 className={`text-lg lg:text-xl font-bold transition-colors duration-300 text-left ${data?.class_category_card_title || ''}`}>
                                                        {category.name || category.nombre}
                                                    </h3>

                                                    {(category.description || category.descripcion) && (
                                                        <p className={`text-sm font-paragraph text-left mt-2 line-clamp-2 opacity-90 ${data?.class_category_card_description || ''}`}>
                                                            {category.description || category.descripcion}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Botones de navegación de categorías */}
                            <button
                                ref={navigationPrevRef}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center ${isSharp ? "rounded-none" : "rounded-full"} bg-white shadow-lg hover:bg-primary text-neutral-dark hover:text-white transition-all duration-300 -ml-5 lg:-ml-6 disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                            </button>
                            <button
                                ref={navigationNextRef}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center ${isSharp ? "rounded-none" : "rounded-full"} bg-white shadow-lg hover:bg-primary text-neutral-dark hover:text-white transition-all duration-300 -mr-5 lg:-mr-6 disabled:opacity-50 disabled:cursor-not-allowed`}
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Sección de Productos Filtrados */}
            <section ref={productsSectionRef} id="productos-filtrados" className="py-8 lg:py-16 bg-white scroll-mt-16 lg:scroll-mt-24">
                <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                    <div className="flex mb-8  w-full flex-col gap-6 lg:flex-row justify-between items-center">
                        <div className="text-left">
                            <h2 className={`text-3xl lg:text-5xl customtext-neutral-dark font-title mb-3  tracking-wide ${data?.class_product_title || ''}`}>
                                {data?.product_title || 'Pide todo lo que quieras y comparte'}
                            </h2>
                            {data?.product_description && (
                                <p className={`customtext-neutral-dark font-paragraph text-base ${data?.class_product_description || ''}`}>
                                    {data.product_description}
                                </p>
                            )}

                            {/* Mostrar categoría seleccionada */}
                            {selectedCategory && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="text-sm customtext-neutral-light">Mostrando:</span>
                                    <span className={`bg-primary text-white px-4 py-2 ${isSharp ? "rounded-none" : "rounded-full"} font-bold text-sm`}>
                                        {selectedCategory.name || selectedCategory.nombre}
                                    </span>
                                    <button
                                        onClick={() => handleCategoryClick(null)}
                                        className="text-sm text-gray-500 hover:text-primary transition-colors underline"
                                    >
                                        Ver todos
                                    </button>
                                </div>
                            )}


                        </div>
                    </div>

                    {/* Productos / Skeleton Loader */}
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-6">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <ProductCardSkeleton key={index} isSharp={isSharp} />
                            ))}
                        </div>
                    ) : products && products.length > 0 ? (
                        <div className="grid grid-cols-2  lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-6">
                            {products.map((product) => (
                                <ProductCardSelector
                                    key={product.id}
                                    cardType={cardTypeToRender}
                                    product={product}
                                    data={data}
                                    cart={cart}
                                    setCart={setCart}
                                    favorites={favorites}
                                    setFavorites={setFavorites}
                                    handleProductClick={handleProductClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoResults />
                    )}
                </div>
            </section>
        </div>
    );
};

export default FilterHuaillys;
