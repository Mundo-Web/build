import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardHoverBtn from "../Products/Components/CardHoverBtn";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    Tag,
    X,
    Zap,
    Sparkles,
    Star,
    ShoppingBag,
    TrendingUp,
    CheckCircle2,
    Layers,
    Grid3X3,
    Sliders,
    Trash,
    List,
    ListFilter,
    Hash,
    Store,
    Package
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";
import { GET } from "sode-extend-react";

// Importar diferentes tipos de tarjetas de productos
import CardProductBananaLab from "../Products/Components/CardProductBananaLab";
import CardProductMultivet from "../Products/Components/CardProductMultivet";
import CardProductKatya from "../Products/Components/CardProductKatya";
import General from "../../../Utils/General";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
// import CardProductDefault from "../Products/Components/CardProductDefault";
// import CardProductMinimal from "../Products/Components/CardProductMinimal";
// import CardProductCompact from "../Products/Components/CardProductCompact";

const itemsRest = new ItemsRest();

// Configuración de animaciones para todos los elementos del filtro
const filterAnimations = {
    container: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.3, ease: "easeOut" }
    },
    section: {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.3, ease: "easeInOut" }
    },
    item: {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 10 },
        transition: { duration: 0.2, ease: "easeOut" }
    },
    badge: {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    hover: {
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 }
    },
    stagger: {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    }
};

// Estilos CSS modernos para una mejor experiencia de usuario
const modernFilterStyles = {
    filterContainer: "backdrop-blur-xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 border border-gray-200/60 rounded-2xl shadow-2xl shadow-gray-900/10",
    filterHeader: "bg-white border-b border-gray-200/60 rounded-t-2xl",
    filterSection: "group transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-50/60 hover:to-blue-50/40 rounded-xl",
    filterButton: "w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group",
    filterContent: "bg-gradient-to-b from-white/90 to-gray-50/50 rounded-xl border border-gray-200/40 backdrop-blur-sm",
    searchInput: "w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 placeholder:customtext-neutral-dark",
    checkbox: "min-h-5 min-w-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500/30 focus:ring-2 transition-all duration-200 hover:border-blue-400",
    label: "flex items-center gap-3 py-0 px-3 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50/60 hover:to-indigo-50/40 cursor-pointer group",
    activeFilter: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25",
    badge: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-full text-sm font-medium text-blue-700",
    glowEffect: "shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/20",
    pulseAnimation: "animate-pulse",
    shimmerEffect: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
};






const SkeletonCard = ({ delay = 0 }) => {
    return (
        <motion.div
            className="group w-full h-full"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                delay,
                duration: 0.6,
                ease: "easeOut"
            }}
        >
            <div className="px-2 h-full">
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                    {/* Contenedor principal con altura fija similar a las tarjetas reales */}
                    <div className="flex flex-col h-[400px] lg:h-[460px] xl:h-[400px] 2xl:h-[430px]">

                        {/* Imagen del producto skeleton */}
                        <div className="relative flex-1 bg-gray-100 rounded-t-3xl overflow-hidden">
                            {/* Efecto shimmer mejorado */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                                {/* Shimmer principal */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent transform skew-x-12"></div>

                                {/* Shimmer secundario para más profundidad */}
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-blue-100/30 to-transparent transform skew-x-12" style={{ animationDelay: '0.5s' }}></div>
                            </div>

                            {/* Placeholder del icono de imagen */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 0.8, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <ShoppingBag className="w-12 h-12 text-gray-300" />
                                </motion.div>
                            </div>

                            {/* Badge de descuento skeleton */}
                            <div className="absolute top-3 left-3">
                                <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
                            </div>

                            {/* Botón de favorito skeleton */}
                            <div className="absolute top-3 right-3">
                                <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        {/* Contenido del producto skeleton */}
                        <div className="p-4 space-y-3 bg-white flex-shrink-0">
                            {/* Marca skeleton */}
                            <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse"></div>

                            {/* Título del producto skeleton */}
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                                <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                            </div>

                            {/* Precio skeleton */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="space-y-1">
                                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-5 w-24 bg-gray-400 rounded animate-pulse"></div>
                                </div>

                                {/* Botón de agregar al carrito skeleton */}
                                <div className="h-10 w-10 bg-gray-300 rounded-xl animate-pulse"></div>
                            </div>

                            {/* Rating skeleton */}
                            <div className="flex items-center space-x-1 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div key={star} className="h-3 w-3 bg-gray-200 rounded-full animate-pulse"></div>
                                ))}
                                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse ml-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const CatalogoFiltrosKatya = ({ items, data, filteredData, cart, setCart, setFavorites, favorites }) => {

    // Función para renderizar la tarjeta de producto correcta basándose en el tipo
    const renderProductCard = (product, commonProps) => {
        const cardType = data?.type_card_product || 'katya';

        // Props comunes que todas las tarjetas necesitan
        const baseProps = {
            product,
            data,
            setFavorites,
            favorites,
            cart,
            setCart,
            ...commonProps
        };

        switch (cardType) {
            case 'multivet':
                return (
                    <CardProductMultivet
                        {...baseProps}
                    />
                );
            case 'katya':
                return (
                    <CardProductKatya
                        {...baseProps}
                    />
                );

            case 'banana-lab':
            case 'bananalab':
                return (
                    <CardProductBananaLab
                        {...baseProps}
                        widthClass="w-full sm:w-full lg:w-full"
                    />
                );

            // case 'minimal':
            //     return (
            //         <CardProductMinimal
            //             {...baseProps}
            //         />
            //     );

            // case 'compact':
            //     return (
            //         <CardProductCompact
            //             {...baseProps}
            //         />
            //     );

            // case 'default':
            // default:
            //     return (
            //         <CardProductDefault
            //             {...baseProps}
            //         />
            //     );

            default:
                // Fallback a CardProductBananaLab si no se especifica tipo o no se reconoce
                return (
                    <CardProductBananaLab
                        {...baseProps}
                        widthClass="w-full sm:w-full lg:w-full"
                    />
                );
        }
    };

    // Opciones de ordenación (mover al inicio para evitar problemas de hoisting)
    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
        { value: "final_price:asc", label: "Precio: Menor a Mayor" },
        { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
        { value: "most_sold:desc", label: "Más vendidos" },
        { value: "views:desc", label: "Más visitados" },
        // { value: "discount_percent:desc", label: "Mayores descuentos" },
        { value: "best_discount:desc", label: "Mejores ofertas" },
        { value: "featured:desc", label: "Destacados" },
        { value: "offering:desc", label: "En oferta" },
        // { value: "is_new:desc", label: "Nuevos productos" },
        // { value: "recommended:desc", label: "Recomendados por expertos" },
    ];

    // Estado para el filtro padre (independiente)
    const [independentFilter, setIndependentFilter] = useState(null);
    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);

    // Función para relacionar categorías con sus subcategorías
    const getCategoriesWithSubcategories = () => {
        return categories.map(category => ({
            ...category,
            subcategories: subcategories.filter(sub => sub.category_id === category.id)
        }));
    };

    // Obtener categorías con subcategorías relacionadas
    const categoriesWithSubs = getCategoriesWithSubcategories();
    const [collections, setCollections] = useState([]);
    const [stores, setStores] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [tags, setTags] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    // Rangos de precios estáticos
    const staticPriceRanges = [
        { min: 0, max: 50, label: `Hasta ${CurrencySymbol()} 50` },
        { min: 50, max: 100, label: `${CurrencySymbol()} 50 - ${CurrencySymbol()} 100` },
        { min: 100, max: 250, label: `${CurrencySymbol()} 100 - ${CurrencySymbol()} 250` },
        { min: 250, max: 500, label: `${CurrencySymbol()} 250 - ${CurrencySymbol()} 500` },
        { min: 500, max: 1000, label: `${CurrencySymbol()} 500 - ${CurrencySymbol()} 1.000` },
        { min: 1000, max: 2000, label: `${CurrencySymbol()} 1.000 - ${CurrencySymbol()} 2.000` },
        { min: 2000, max: 5000, label: `${CurrencySymbol()} 2.000 - ${CurrencySymbol()} 5.000` },
        { min: 5000, max: 999999, label: `Desde ${CurrencySymbol()} 5.000` }
    ];

    const [sections, setSections] = useState(() => {
        // Por defecto, todos los filtros cerrados en desktop
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            return {
                marca: false,
                precio: false,
                categoria: false,
                subcategoria: false,
                colores: false,
                coleccion: false,
                tienda: false,
            };
        }
        // En mobile/tablet puedes mantener el comportamiento anterior
        return {
            marca: false,
            precio: false,
            categoria: false,
            subcategoria: false,
            colores: false,
            coleccion: false,
            tienda: false,
        };
    });

    const [selectedFilters, setSelectedFilters] = useState({
        collection_id: [],
        category_id: [],
        brand_id: [],
        subcategory_id: [],
        store_id: [],
        tag_id: GET.tag ? GET.tag.split(',') : [], // Agregar soporte para tags
        price: [],
        name: GET.search || null,
        sort: (() => {
            // Leer parámetro sortBy desde la URL
            if (GET.sortBy) {
                const sortValue = GET.sortBy;

                // Primero buscar por valor exacto (ej: "final_price:desc")
                let validSortOption = sortOptions.find(option => option.value === sortValue);

                // Si no se encuentra, buscar por label (ej: "Destacados")
                if (!validSortOption) {
                    validSortOption = sortOptions.find(option =>
                        option.label.toLowerCase() === sortValue.toLowerCase()
                    );
                }

                if (validSortOption) {
                    const [selector, order] = validSortOption.value.split(":");
                    return [
                        {
                            selector: selector,
                            desc: order === "desc",
                        },
                    ];
                }
            }
            // Valor por defecto si no hay parámetro o es inválido
            return [
                {
                    selector: "final_price",
                    desc: true,
                },
            ];
        })(),
    });

    // Función para convertir slugs a IDs
    const convertSlugsToIds = async () => {
        try {
            const params = {};

            if (GET.category) {
                params.category_slugs = GET.category;
            }
            if (GET.brand) {
                params.brand_slugs = GET.brand;
            }
            if (GET.subcategory) {
                params.subcategory_slugs = GET.subcategory;
            }
            if (GET.collection) {
                params.collection_slugs = GET.collection;
            }
            if (GET.store) {
                params.store_slugs = GET.store;
            }

            // Solo hacer la petición si hay slugs que convertir
            if (Object.keys(params).length > 0) {
                const response = await itemsRest.convertSlugs(params);

                if (response.status === 200) {
                    const newFilters = {
                        ...selectedFilters,
                        category_id: Array.isArray(response.data.category_ids) ? response.data.category_ids : (response.data.category_ids ? [response.data.category_ids] : []),
                        brand_id: GET.brand ? [GET.brand] : [],
                        subcategory_id: Array.isArray(response.data.subcategory_ids) ? response.data.subcategory_ids : (response.data.subcategory_ids ? [response.data.subcategory_ids] : []),
                        collection_id: Array.isArray(response.data.collection_ids) ? response.data.collection_ids : (response.data.collection_ids ? [response.data.collection_ids] : []),
                        store_id: Array.isArray(response.data.store_ids) ? response.data.store_ids : (response.data.store_ids ? [response.data.store_ids] : []),
                    };

                    setSelectedFilters(newFilters);

                    if (response.data.store_ids) {

//store
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error converting slugs to IDs:', error);
        }
    };

    // Track the order in which filters are activated
    const [filterSequence, setFilterSequence] = useState([]);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false); // Nuevo estado para filtros
    const [hasSearched, setHasSearched] = useState(false); // Para saber si ya se hizo una búsqueda
    const [showNoResults, setShowNoResults] = useState(false); // Para controlar cuándo mostrar "sin resultados"
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 24,
        from: 0,
        to: 0,
    });

    const transformFilters = (filters) => {
        const transformedFilters = [];

        // Manejar campos especiales de sort que deben convertirse en filtros WHERE
        if (filters.sort && Array.isArray(filters.sort)) {
            const specialSortFields = ['featured', 'offering', 'is_new', 'recommended'];

            filters.sort.forEach(sortItem => {
                if (specialSortFields.includes(sortItem.selector)) {
                    // Convertir campo de ordenamiento especial a filtro WHERE
                    transformedFilters.push([
                        sortItem.selector,
                        "=",
                        1  // Solo mostrar productos donde el campo = 1 (true)
                    ]);
                }
            });
        }

        if (filters.collection_id.length > 0) {
            const collectionConditions = filters.collection_id.map((slug) => [
                "collection.id", // Cambiar a ID en lugar de slug
                "=",
                collections.find(c => c.slug === slug)?.id || slug,
            ]);
            transformedFilters.push(ArrayJoin(collectionConditions, 'or'));
        }

        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category.id",
                "=",
                id,
            ]);
            transformedFilters.push(ArrayJoin(categoryConditions, 'or'));
        }

        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory.id",
                "=",
                id,
            ]);
            transformedFilters.push(ArrayJoin(subcategoryConditions, 'or'));
        }

        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((slug) => {
                // Buscar la marca en el array para obtener su ID
                const brand = brands.find(b => b.slug === slug);

                if (brand) {
                    // Si encontramos la marca, usar su ID
                    return [
                        "brand.slug",
                        "=",
                        brand.slug,
                    ];
                } else {
                    // Si no la encontramos, usar slug
                    return [
                        "brand.slug",
                        "=",
                        slug,
                    ];
                }
            });
            transformedFilters.push(ArrayJoin(brandConditions, 'or'));
        }

        if (filters.store_id.length > 0) {
            const storeConditions = filters.store_id.map((slug) => [
                "store.id",
                "=",
                stores.find(s => s.slug === slug)?.id || slug,
            ]);
            transformedFilters.push(ArrayJoin(storeConditions, 'or'));
        }


        if (filters.tag_id && filters.tag_id.length > 0) {
            const tagConditions = filters.tag_id.map((tagId) => [
                "item_tag.tag_id",
                "=",
                tagId,
            ]);
            transformedFilters.push(ArrayJoin(tagConditions, 'or'));
        }

        if (filters.price && filters.price.length > 0) {
            const priceConditions = filters.price.map((priceRange) => [
                "and",
                [
                    ["final_price", ">=", priceRange.min],
                    "and",
                    ["final_price", "<=", priceRange.max],
                ],
            ]);
            transformedFilters.push(ArrayJoin(priceConditions, 'or'));
        }

        if (filters.name) {
            // Buscar en múltiples campos como HeaderSearchB
            const searchConditions = [
                ["name", "contains", filters.name],
                "or",
                ["summary", "contains", filters.name],
                "or",
                ["description", "contains", filters.name]
            ];
            transformedFilters.push(searchConditions);
        }

        return ArrayJoin(transformedFilters, 'and');
    };

    // Función de fallback para búsqueda simple (como HeaderSearchB)
    const getSimpleSearchFilters = (query) => {
        return [
            ['name', 'contains', query],
            'or',
            ['summary', 'contains', query],
            'or',
            ['description', 'contains', query]
        ];
    };

    // Estado para controlar la búsqueda inteligente
    const [intelligentSearchEnabled, setIntelligentSearchEnabled] = useState(true);
    const [lastIntelligentSearch, setLastIntelligentSearch] = useState(null);

    // Función para detectar si el query coincide con marcas, categorías o subcategorías
    const detectIntelligentFilters = (query) => {
        if (!query || query.length < 2 || !intelligentSearchEnabled) {
            return null;
        }

        const lowerQuery = query.toLowerCase().trim();
       

        const detectedFilters = {
            categories: [],
            brands: [],
            subcategories: [],
            collections: [],
            stores: []
        };

        // Buscar en categorías
        const matchedCategories = categories.filter(cat => {
            const match = cat.name.toLowerCase().includes(lowerQuery) ||
                lowerQuery.includes(cat.name.toLowerCase());
            return match;
        });

        // Buscar en marcas
        const matchedBrands = brands.filter(brand => {
            const match = brand.name.toLowerCase().includes(lowerQuery) ||
                lowerQuery.includes(brand.name.toLowerCase());
            return match;
        });

        // Buscar en subcategorías
        const matchedSubcategories = subcategories.filter(subcat => {
            const match = subcat.name.toLowerCase().includes(lowerQuery) ||
                lowerQuery.includes(subcat.name.toLowerCase());
            return match;
        });

        // Buscar en colecciones
        const matchedCollections = collections.filter(collection => {
            const match = collection.name.toLowerCase().includes(lowerQuery) ||
                lowerQuery.includes(collection.name.toLowerCase());
            return match;
        });

        // Buscar en tiendas
        const matchedStores = stores.filter(store => {
            const match = store.name.toLowerCase().includes(lowerQuery) ||
                lowerQuery.includes(store.name.toLowerCase());
            return match;
        });

        const result = {
            categories: matchedCategories,
            brands: matchedBrands,
            subcategories: matchedSubcategories,
            collections: matchedCollections,
            hasMatches: matchedCategories.length > 0 || matchedBrands.length > 0 ||
                matchedSubcategories.length > 0 || matchedCollections.length > 0
        };

        return result;
    };

    // Función para verificar si los filtros actuales fueron aplicados por búsqueda inteligente
    const isIntelligentSearchActive = (query) => {
        const detected = detectIntelligentFilters(query);
        if (!detected || !detected.hasMatches) return false;

        // Verificar si algún filtro coincide con los detectados
        const hasMatchingCategories = detected.categories.some(cat =>
            selectedFilters.category_id.includes(cat.id)
        );
        const hasMatchingBrands = detected.brands.some(brand =>
            selectedFilters.brand_id.includes(brand.slug)
        );
        const hasMatchingSubcategories = detected.subcategories.some(subcat =>
            selectedFilters.subcategory_id.includes(subcat.id)
        );
        const hasMatchingCollections = detected.collections.some(collection =>
            selectedFilters.collection_id.includes(collection.slug)
        );

        return hasMatchingCategories || hasMatchingBrands || hasMatchingSubcategories || hasMatchingCollections;
    };

    // Función para aplicar filtros inteligentes automáticamente
    const applyIntelligentFilters = (query) => {
        const detected = detectIntelligentFilters(query);

        if (!detected || !detected.hasMatches) return;


        setSelectedFilters(prev => {
            const newFilters = { ...prev };

            // Aplicar filtros de categorías detectadas
            if (detected.categories.length > 0) {
                const categoryIds = detected.categories.map(cat => cat.id);
                newFilters.category_id = [...new Set([...newFilters.category_id, ...categoryIds])];
            }

            // Aplicar filtros de marcas detectadas
            if (detected.brands.length > 0) {
                const brandSlugs = detected.brands.map(brand => brand.slug);
                newFilters.brand_id = [...new Set([...newFilters.brand_id, ...brandSlugs])];
            }

            // Aplicar filtros de subcategorías detectadas
            if (detected.subcategories.length > 0) {
                const subcategoryIds = detected.subcategories.map(subcat => subcat.id);
                newFilters.subcategory_id = [...new Set([...newFilters.subcategory_id, ...subcategoryIds])];
            }

            // Aplicar filtros de colecciones detectadas
            if (detected.collections.length > 0) {
                const collectionSlugs = detected.collections.map(collection => collection.slug);
                newFilters.collection_id = [...new Set([...newFilters.collection_id, ...collectionSlugs])];
            }

            return newFilters;
        });
    };

    // Función para aplicar búsqueda inteligente automáticamente
    const handleIntelligentSearch = (query) => {
        if (!query || query.length < 2) return;

        // Detectar y aplicar filtros inteligentes solo si está habilitado
        const detected = detectIntelligentFilters(query);

        if (detected && detected.hasMatches && intelligentSearchEnabled) {
            setLastIntelligentSearch(query);

            setSelectedFilters(prev => {
                const newFilters = { ...prev, name: query };

                // Aplicar filtros de categorías detectadas
                if (detected.categories.length > 0) {
                    const categoryIds = detected.categories.map(cat => cat.id);
                    newFilters.category_id = [...new Set([...newFilters.category_id, ...categoryIds])];
                }

                // Aplicar filtros de marcas detectadas
                if (detected.brands.length > 0) {
                    const brandSlugs = detected.brands.map(brand => brand.slug);
                    newFilters.brand_id = [...new Set([...newFilters.brand_id, ...brandSlugs])];
                }

                // Aplicar filtros de subcategorías detectadas
                if (detected.subcategories.length > 0) {
                    const subcategoryIds = detected.subcategories.map(subcat => subcat.id);
                    newFilters.subcategory_id = [...new Set([...newFilters.subcategory_id, ...subcategoryIds])];
                }

                // Aplicar filtros de colecciones detectadas
                if (detected.collections.length > 0) {
                    const collectionSlugs = detected.collections.map(collection => collection.slug);
                    newFilters.collection_id = [...new Set([...newFilters.collection_id, ...collectionSlugs])];
                }

                return newFilters;
            });
        } else {
            // Si no hay filtros inteligentes, solo aplicar búsqueda de texto
            setSelectedFilters(prev => ({ ...prev, name: query }));
            setLastIntelligentSearch(null);
        }
    };

    // Función para alternar la búsqueda inteligente
    const toggleIntelligentSearch = () => {
        setIntelligentSearchEnabled(!intelligentSearchEnabled);
    };

    // Función para limpiar filtros aplicados por búsqueda inteligente
    const clearIntelligentFilters = () => {
        if (lastIntelligentSearch && selectedFilters.name) {
            const detected = detectIntelligentFilters(selectedFilters.name);
            if (detected && detected.hasMatches) {
                setSelectedFilters(prev => {
                    const newFilters = { ...prev };

                    // Remover categorías detectadas
                    if (detected.categories.length > 0) {
                        const categoryIds = detected.categories.map(cat => cat.id);
                        newFilters.category_id = newFilters.category_id.filter(id => !categoryIds.includes(id));
                    }

                    // Remover marcas detectadas
                    if (detected.brands.length > 0) {
                        const brandSlugs = detected.brands.map(brand => brand.slug);
                        newFilters.brand_id = newFilters.brand_id.filter(slug => !brandSlugs.includes(slug));
                    }

                    // Remover subcategorías detectadas
                    if (detected.subcategories.length > 0) {
                        const subcategoryIds = detected.subcategories.map(subcat => subcat.id);
                        newFilters.subcategory_id = newFilters.subcategory_id.filter(id => !subcategoryIds.includes(id));
                    }

                    // Remover colecciones detectadas
                    if (detected.collections.length > 0) {
                        const collectionSlugs = detected.collections.map(collection => collection.slug);
                        newFilters.collection_id = newFilters.collection_id.filter(slug => !collectionSlugs.includes(slug));
                    }

                    return newFilters;
                });
            }
        }
        setLastIntelligentSearch(null);
    };

    // Función de debug mejorada con búsqueda inteligente
    const debugCompareWithHeaderSearch = async (query) => {
      

        // Detectar filtros inteligentes
        const intelligentFilters = detectIntelligentFilters(query);

        // Crear filtros mejorados con detección inteligente
        const enhancedFilters = { ...selectedFilters, name: query };

        // Aplicar filtros inteligentes para la comparación
        if (intelligentFilters && intelligentFilters.hasMatches) {
            if (intelligentFilters.categories.length > 0) {
                enhancedFilters.category_id = [...new Set([
                    ...enhancedFilters.category_id,
                    ...intelligentFilters.categories.map(cat => cat.id)
                ])];
            }

            if (intelligentFilters.brands.length > 0) {
                enhancedFilters.brand_id = [...new Set([
                    ...enhancedFilters.brand_id,
                    ...intelligentFilters.brands.map(brand => brand.slug)
                ])];
            }

            if (intelligentFilters.subcategories.length > 0) {
                enhancedFilters.subcategory_id = [...new Set([
                    ...enhancedFilters.subcategory_id,
                    ...intelligentFilters.subcategories.map(subcat => subcat.id)
                ])];
            }

            if (intelligentFilters.collections.length > 0) {
                enhancedFilters.collection_id = [...new Set([
                    ...enhancedFilters.collection_id,
                    ...intelligentFilters.collections.map(collection => collection.slug)
                ])];
            }
        }

        // Filtros de CatalogoFiltrosKatya (con mejora inteligente)
        const catalogFilters = transformFilters(enhancedFilters);

        // Filtros de HeaderSearchB (básicos)
        const headerFilters = getSimpleSearchFilters(query);

        try {
            // Test con filtros de HeaderSearchB
            const headerResponse = await fetch('/api/items/paginate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    take: 8,
                    skip: 0,
                    filter: headerFilters,
                    sort: [{ selector: 'name', desc: false }],
                    requireTotalCount: false,
                    with: 'category,brand'
                })
            });

            const headerData = await headerResponse.json();

            // Test con filtros de CatalogoFiltrosKatya (mejorados)
            const catalogResponse = await itemsRest.paginate({
                filter: catalogFilters,
                sort: [{ selector: 'name', desc: false }],
                skip: 0,
                take: 8,
                requireTotalCount: false,
                with: 'category,brand'
            });


            // Comparación de resultados
            const headerCount = headerData?.data?.length || 0;
            const catalogCount = catalogResponse?.data?.length || 0;

          
         

        } catch (error) {
            console.error("Debug comparison error:", error);
        }

    };

    // Exponer funciones globalmente para testing y uso externo
    window.debugCatalogSearch = debugCompareWithHeaderSearch;
    window.handleIntelligentSearch = handleIntelligentSearch;
    window.toggleIntelligentSearch = toggleIntelligentSearch;
    window.clearIntelligentFilters = clearIntelligentFilters;
    window.isIntelligentSearchActive = isIntelligentSearchActive;
    window.detectIntelligentFilters = detectIntelligentFilters;

    // Función específica para debuggear JBL
    window.testJBLSearch = () => {
     

        // Test manual de detección
        const detected = detectIntelligentFilters("JBL");

        if (detected && detected.hasMatches) {
            handleIntelligentSearch("JBL");
        }
    };

    // Función para simular búsqueda desde HeaderSearchB
    window.simulateHeaderSearch = (query) => {

        // Simular lo que haría el HeaderSearchB
        setSelectedFilters(prev => ({
            ...prev,
            name: query
        }));

    };

    // Función para forzar la búsqueda inteligente sin importar el estado
    window.forceIntelligentSearch = (query) => {
        const originalEnabled = intelligentSearchEnabled;
        setIntelligentSearchEnabled(true);

        setTimeout(() => {
            handleIntelligentSearch(query);
            setIntelligentSearchEnabled(originalEnabled);
        }, 100);
    };
    // Obtener productos filtrados desde el backend
    const fetchProducts = async (page = 1, isNewFilter = false) => {
        // Resetear el estado de "sin resultados" al comenzar una nueva búsqueda
        setShowNoResults(false);

        // Diferentes estados para carga inicial vs filtrado
        if (isNewFilter) {
            setIsFiltering(true);
        } else {
            setLoading(true);
        }

        try {
            const filters = transformFilters(selectedFilters);
            const itemsPerPage = 24; // Valor constante para evitar problemas de estado

          

            // Filtrar el sort para remover campos especiales que ya se convirtieron en filtros WHERE
            const specialSortFields = ['featured', 'offering', 'is_new', 'recommended'];
            const filteredSort = selectedFilters.sort.filter(sortItem =>
                !specialSortFields.includes(sortItem.selector)
            );

            // Si no queda ningún sort válido, usar ordenamiento por defecto
            const finalSort = filteredSort.length > 0 ? filteredSort : [
                { selector: "final_price", desc: true }
            ];

            // Extraer los IDs de los filtros seleccionados (no slugs)
            const params = {
                filter: filters,
                sort: finalSort,
                skip: (page - 1) * itemsPerPage,
                take: itemsPerPage,
                requireTotalCount: true,
                filterSequence: filterSequence,
                // Removido los filtros duplicados - solo usar el filtro complejo
            };

            const response = await itemsRest.paginate(params);

          
            // Validar la respuesta del backend
            if (response.status !== 200) {
                throw new Error(`API returned status ${response.status}`);
            }

            setProducts(response.data || []);
            setHasSearched(true); // Marcamos que ya se hizo una búsqueda

            // Si no hay productos, mostrar mensaje después de un pequeño delay
            if (!response.data || response.data.length === 0) {
                setTimeout(() => {
                    setShowNoResults(true);
                }, 300); // Delay de 300ms para evitar parpadeo
            }

            // Actualizar paginación con los datos correctos del backend
            const totalCount = response.totalCount || 0;
            const totalPages = Math.ceil(totalCount / itemsPerPage);

            setPagination({
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalCount,
                itemsPerPage: itemsPerPage,
                from: totalCount > 0 ? (page - 1) * itemsPerPage + 1 : 0,
                to: Math.min(page * itemsPerPage, totalCount),
            });

            // Update all filter options from backend summary
            setBrands(response?.summary?.brands || []);
            setCategories(response?.summary?.categories || []);
            setSubcategories(response?.summary?.subcategories || []);
            setCollections(response?.summary?.collections || []);
            setStores(response?.summary?.stores || []);
            setPriceRanges(response?.summary?.priceRanges || []);
            setTags(response?.summary?.tags || []);
        } catch (error) {
            console.error("Error fetching products:", error);

            // Si hay un error y solo hay filtro de búsqueda, intentar con filtro simple
            if (selectedFilters.name &&
                selectedFilters.category_id.length === 0 &&
                selectedFilters.brand_id.length === 0 &&
                selectedFilters.subcategory_id.length === 0 &&
                selectedFilters.collection_id.length === 0 &&
                selectedFilters.store_id.length === 0 &&
                selectedFilters.tag_id.length === 0 &&
                selectedFilters.price.length === 0) {


                try {
                    const simpleParams = {
                        filter: getSimpleSearchFilters(selectedFilters.name),
                        sort: selectedFilters.sort,
                        skip: (page - 1) * 24,
                        take: 24,
                        requireTotalCount: true,
                        with: 'category,brand'
                    };

                    const fallbackResponse = await itemsRest.paginate(simpleParams);

                    if (fallbackResponse.status === 200) {
                        setProducts(fallbackResponse.data || []);
                        setHasSearched(true);

                        if (!fallbackResponse.data || fallbackResponse.data.length === 0) {
                            setTimeout(() => {
                                setShowNoResults(true);
                            }, 300);
                        }

                        const totalCount = fallbackResponse.totalCount || 0;
                        const totalPages = Math.ceil(totalCount / 24);

                        setPagination({
                            currentPage: page,
                            totalPages: totalPages,
                            totalItems: totalCount,
                            itemsPerPage: 24,
                            from: totalCount > 0 ? (page - 1) * 24 + 1 : 0,
                            to: Math.min(page * 24, totalCount),
                        });

                        return; // Salir exitosamente con fallback
                    }
                } catch (fallbackError) {
                    console.error("Fallback search also failed:", fallbackError);
                }
            }

            // En caso de error, también mostrar el mensaje después de un delay
            setTimeout(() => {
                setShowNoResults(true);
            }, 300);
        } finally {
            setLoading(false);
            setIsFiltering(false);
        }
    };

    useEffect(() => {
        // Initialize state from filteredData prop
        if (filteredData) {
            // Set initial data from SystemController
            setCategories(filteredData.categories || []);
            setBrands(filteredData.brands || []);
            setSubcategories(filteredData.subcategories || []);
            setStores(filteredData.stores || []);
            setPriceRanges(filteredData.priceRanges || []);

            // Convert slugs from GET parameters to IDs AFTER data is loaded
            setTimeout(() => {
                convertSlugsToIds();
            }, 50);
        }

        // Aplicar búsqueda inteligente si hay un término de búsqueda inicial
        if (GET.search && intelligentSearchEnabled) {
            // Pequeño delay para asegurar que las categorías, marcas, etc. estén cargadas
            setTimeout(() => {
                handleIntelligentSearch(GET.search);
            }, 150);
        }

        // Initial fetch to get products and update summary data (no es filtrado)
        fetchProducts(1, false);
    }, [filteredData, intelligentSearchEnabled]); // Agregar intelligentSearchEnabled como dependencia

    useEffect(() => {
       

        fetchProducts(1, hasSearched); // true si ya había búsqueda, false si es inicial
    }, [selectedFilters]); // Eliminar hasSearched como dependencia


    // useEffect para detectar cambios en el filtro de nombre y aplicar búsqueda inteligente
    useEffect(() => {
        if (selectedFilters.name && intelligentSearchEnabled && brands.length > 0) {

            // Verificar si ya tiene filtros inteligentes aplicados
            const isAlreadyIntelligent = isIntelligentSearchActive(selectedFilters.name);

            if (!isAlreadyIntelligent) {

                // Aplicar búsqueda inteligente automáticamente
                setTimeout(() => {
                    const detected = detectIntelligentFilters(selectedFilters.name);
                    if (detected && detected.hasMatches) {

                        setSelectedFilters(prev => {
                            const newFilters = { ...prev };

                            // Aplicar filtros de marcas detectadas
                            if (detected.brands.length > 0) {
                                const brandSlugs = detected.brands.map(brand => brand.slug);
                                newFilters.brand_id = [...new Set([...newFilters.brand_id, ...brandSlugs])];
                            }

                            // Aplicar filtros de categorías detectadas
                            if (detected.categories.length > 0) {
                                const categoryIds = detected.categories.map(cat => cat.id);
                                newFilters.category_id = [...new Set([...newFilters.category_id, ...categoryIds])];
                            }

                            // Aplicar filtros de subcategorías detectadas
                            if (detected.subcategories.length > 0) {
                                const subcategoryIds = detected.subcategories.map(subcat => subcat.id);
                                newFilters.subcategory_id = [...new Set([...newFilters.subcategory_id, ...subcategoryIds])];
                            }

                            // Aplicar filtros de colecciones detectadas
                            if (detected.collections.length > 0) {
                                const collectionSlugs = detected.collections.map(collection => collection.slug);
                                newFilters.collection_id = [...new Set([...newFilters.collection_id, ...collectionSlugs])];
                            }

                            return newFilters;
                        });

                        setLastIntelligentSearch(selectedFilters.name);
                    }
                }, 100);
            }
        }
    }, [selectedFilters.name, intelligentSearchEnabled, brands, categories, subcategories, collections]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
            // Solo para la paginación: desplazar hacia arriba suavemente
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Luego, obtener productos de la nueva página (no es filtrado)
            fetchProducts(page, false);
        }
    };

    // Generar números de página para la paginación
    const getPageNumbers = () => {
        const pages = [];
        const total = pagination.totalPages;
        const current = pagination.currentPage;
        const delta = 2;

        for (let i = 1; i <= total; i++) {
            if (
                i === 1 ||
                i === total ||
                (i >= current - delta && i <= current + delta)
            ) {
                pages.push(i);
            } else if (i === current - delta - 1 || i === current + delta + 1) {
                pages.push("...");
            }
        }

        return pages.filter((page, index, array) => {
            return page !== "..." || array[index - 1] !== "...";
        });
    };

    //}, [items]);
    // Manejar cambios en los filtros y mantener filterSequence
    const handleFilterChange = (type, value) => {
        // Soporte para filtros especiales tipo booleano
        const specialFields = ['is_new', 'offering', 'recommended', 'featured'];
        if (specialFields.includes(type)) {
            setSelectedFilters((prev) => ({
                ...prev,
                [type]: prev[type] ? !prev[type] : true,
            }));
            return;
        }
        setSelectedFilters((prev) => {
            if (type === "price") {
                // Manejar múltiples rangos de precio
                const currentPrices = Array.isArray(prev.price) ? prev.price : [];
                const isAlreadySelected = currentPrices.some(
                    (range) => range.min === value.min && range.max === value.max
                );
                let newPrices;
                if (isAlreadySelected) {
                    // Deseleccionar el rango
                    newPrices = currentPrices.filter(
                        (range) => !(range.min === value.min && range.max === value.max)
                    );
                } else {
                    // Agregar el nuevo rango
                    newPrices = [...currentPrices, value];
                }
                return {
                    ...prev,
                    price: newPrices,
                };
            }
            // Asegúrate de que prev[type] sea un array antes de usar .includes()
            const currentValues = Array.isArray(prev[type]) ? prev[type] : [];
            let newValues;
            if (currentValues.includes(value)) {
                // Deseleccionar
                newValues = currentValues.filter((item) => item !== value);
            } else {
                // Seleccionar
                newValues = [...currentValues, value];
            }
            return { ...prev, [type]: newValues };
        });

        // Update filterSequence
        setFilterSequence((prevSeq) => {
            // Only track these filter types in the sequence
            const trackedTypes = ["brand_id", "category_id", "collection_id", "store_id"];
            if (!trackedTypes.includes(type)) return prevSeq;

            // If selecting (not removing)
            if (!selectedFilters[type]?.includes(value)) {
                // If not already in sequence, add to end
                if (!prevSeq.includes(type)) {
                    return [...prevSeq, type];
                }
                return prevSeq;
            } else {
                // If removing, check if any values left for this type
                const remaining = selectedFilters[type]?.filter((item) => item !== value) || [];
                if (remaining.length === 0) {
                    // Remove from sequence
                    return prevSeq.filter((t) => t !== type);
                }
                return prevSeq;
            }
        });
    };

    // Alternar secciones de filtros
    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const [searchCategory, setSearchCategory] = useState("");
    const [searchSubcategory, setSearchSubcategory] = useState("");
    const [searchBrand, setSearchBrand] = useState("");
    const [searchCollection, setSearchCollection] = useState("");
    const [searchStore, setSearchStore] = useState("");

    // Filtrar categorías según el input
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const filteredSubcategories = subcategories.filter((subcategory) => {
        // Si hay categorías seleccionadas en los filtros, solo mostrar subcategorías de esas categorías
        let categoryIds;
        if (selectedFilters.category_id && selectedFilters.category_id.length > 0) {
            // Hay categorías seleccionadas, solo mostrar subcategorías de esas categorías
            categoryIds = categories
                .filter(cat => selectedFilters.category_id.includes(cat.id))
                .map(cat => cat.id);
        } else {
            // No hay categorías seleccionadas, mostrar subcategorías de todas las categorías disponibles
            categoryIds = categories.map(cat => cat.id);
        }

        return categoryIds.includes(subcategory.category_id) &&
            subcategory.name.toLowerCase().includes(searchSubcategory.toLowerCase());
    });



    // Filtrar marcas según el input
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );

    const filteredCollections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(searchCollection.toLowerCase())
    );

    // Filtrar tiendas según el input
    const filteredStores = stores.filter((store) =>
        store.name.toLowerCase().includes(searchStore.toLowerCase())
    );

    const [filtersOpen, setFiltersOpen] = useState(false);

    // Efecto para manejar el scroll del body cuando el modal está abierto
    useEffect(() => {
        if (filtersOpen) {
            // Prevenir scroll del body cuando el modal esté abierto en mobile
            document.body.classList.add('filter-modal-open');
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar scroll del body cuando el modal se cierre
            document.body.classList.remove('filter-modal-open');
            document.body.style.overflow = 'unset';
        }

        // Cleanup cuando el componente se desmonta
        return () => {
            document.body.classList.remove('filter-modal-open');
            document.body.style.overflow = 'unset';
        };
    }, [filtersOpen]);

    return (
        <section className="py-4 lg:py-12 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header mejorado con estadísticas y acciones rápidas */}
                <motion.div
                    className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 lg:mb-8 lg:pb-6 lg:border-b-2 border-gradient-to-r from-blue-200 via-indigo-200 to-purple-200"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="md:w-6/12 mb-0 md:mb-0"
                        whileHover={{ scale: 1.02 }}
                    >
                        <h2 className={`text-2xl lg:text-[32px] md:text-4xl font-bold customtext-primary  lg:mb-2 ${data?.class_title}`}>
                            {data?.title}
                        </h2>



                    </motion.div>

                    <div className="hidden md:flex flex-col w-full items-start md:items-center justify-end gap-4 md:flex-row md:w-5/12">
                        {/* Estadísticas mejoradas */}


                        {/* Selector de ordenación mejorado - Solo Desktop */}
                        <motion.div
                            className="w-full md:w-6/12 relative"

                        >
                            <SelectForm
                                options={sortOptions}
                                placeholder="Ordenar por"
                                value={
                                    selectedFilters.sort?.[0]?.selector && selectedFilters.sort?.[0]?.desc !== undefined
                                        ? `${selectedFilters.sort[0].selector}:${selectedFilters.sort[0].desc ? "desc" : "asc"}`
                                        : "final_price:desc"
                                }
                                onChange={(value) => {
                                    const [selector, order] = value.split(":");
                                    const sort = [
                                        {
                                            selector: selector,
                                            desc: order === "desc",
                                        },
                                    ];
                                    setSelectedFilters((prev) => ({
                                        ...prev,
                                        sort,
                                    }));

                                    // Actualizar la URL con el nuevo parámetro sortBy
                                    const url = new URL(window.location);
                                    url.searchParams.set('sortBy', value);
                                    window.history.pushState({}, '', url);
                                }}
                                labelKey="label"
                                valueKey="value"
                                className="customtext-neutral-dark border-primary rounded-lg"
                                generalIcon={<ListFilter className="w-5 h-5 mr-2 customtext-primary" />}
                            />
                        </motion.div>
                    </div>
                </motion.div>

                <div className="relative flex flex-col lg:flex-row gap-6">
                    {/* Fila para móvil: Filtros + Ordenación */}
                    <div className="w-full flex lg:hidden lg:mb-6  items-stretch gap-3">
                        {/* Botón de filtros para móvil */}
                        <motion.div className="flex-1 max-w-max">
                            <Tooltip text="Abrir panel de filtros avanzados" position="bottom">
                                <motion.button
                                    className="w-full h-12 flex items-center justify-center gap-2 px-4 bg-primary text-white rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden relative"
                                    onClick={() => setFiltersOpen(true)}
                                    whileHover={{ scale: 1.02, y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    {...filterAnimations.container}
                                >
                                    {/* Fondo animado */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />

                                    <div className="flex items-center gap-2 relative z-10">
                                        <motion.div
                                            className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm"
                                            animate={{
                                                rotate: [0, 10, 0],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Sliders className="h-4 w-4" />
                                        </motion.div>
                                        <span className="text-sm font-bold">Filtros</span>
                                    </div>
                                </motion.button>
                            </Tooltip>
                        </motion.div>

                        {/* Selector de ordenación para móvil */}
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <SelectForm
                                options={sortOptions}
                                placeholder="Ordenar"
                                value={
                                    selectedFilters.sort?.[0]?.selector && selectedFilters.sort?.[0]?.desc !== undefined
                                        ? `${selectedFilters.sort[0].selector}:${selectedFilters.sort[0].desc ? "desc" : "asc"}`
                                        : "final_price:desc"
                                }
                                onChange={(value) => {
                                    const [selector, order] = value.split(":");
                                    const sort = [
                                        {
                                            selector: selector,
                                            desc: order === "desc",
                                        },
                                    ];
                                    setSelectedFilters((prev) => ({
                                        ...prev,
                                        sort,
                                    }));

                                    // Actualizar la URL con el nuevo parámetro sortBy
                                    const url = new URL(window.location);
                                    url.searchParams.set('sortBy', value);
                                    window.history.pushState({}, '', url);
                                }}
                                labelKey="label"
                                valueKey="value"
                                className="!w-full customtext-neutral-dark border-primary rounded-2xl text-sm h-12"
                            />
                        </motion.div>
                    </div>

                    {/* Panel de filtros mejorado */}
                    <motion.div
                        className={`${filtersOpen
                            ? "fixed inset-0 backdrop-blur-md z-[999] flex flex-col mobile-filter-modal"
                            : "hidden"
                            } lg:block lg:w-3/12 lg:bg-transparent lg:h-max lg:relative lg:z-auto`}
                        {...(filtersOpen ? filterAnimations.container : {})}
                        initial={filtersOpen ? { opacity: 0 } : false}
                        animate={filtersOpen ? { opacity: 1 } : false}
                        exit={filtersOpen ? { opacity: 0 } : false}
                        transition={{ duration: 0.3 }}
                        onClick={filtersOpen ? (e) => {
                            if (e.target === e.currentTarget) {
                                setFiltersOpen(false);
                            }
                        } : undefined}
                    >
                        {/* Contenedor principal de filtros - Estructura mejorada para mobile */}
                        <div className={`${filtersOpen
                            ? "flex flex-col h-full bg-transparent"
                            : modernFilterStyles.filterContainer
                            } lg:backdrop-blur-xl lg:border lg:border-gray-200/60 lg:rounded-2xl lg:shadow-2xl lg:shadow-gray-900/10`}>

                            {/* Contenido principal del modal mobile - ocupando todo excepto el footer */}
                            <div className={`${filtersOpen
                                ? " bg-white rounded-t-3xl shadow-2xl flex flex-col flex-1 overflow-hidden safe-area-top mobile-filter-content"
                                : ""
                                }`}>



                                {/* Contenido principal con scroll mejorado - ajustado para footer móvil */}
                                <div className="flex-1 overflow-y-auto  space-y-6 custom-scrollbar"
                                    style={{
                                        height: filtersOpen ? 'calc(100vh - 200px)' : 'auto',
                                        paddingBottom: filtersOpen ? '1rem' : '1.5rem'
                                    }}>

                                    {/* Panel de Categorías estilo móvil como la imagen */}
                                    <motion.div
                                        className="bg-secondary rounded-2xl overflow-hidden shadow-xl"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        {/* Header del panel */}
                                        <div className="bg-primary p-4 text-start">
                                            <h3 className="text-2xl font-bold customtext-secondary">Categorías</h3>
                                        </div>

                                      
                                        {/* Todas las categorías opción - Funciona como limpiar filtros */}
                                        <motion.div
                                            className="bg-secondary hover:bg-secondary transition-colors duration-200"
                                        >
                                            <button
                                                className="w-full p-4 flex items-center justify-between text-white text-left"
                                                onClick={() => {
                                                    
                                                    // Limpiar todas las subcategorías
                                                    setSelectedFilters((prev) => {
                                                        const cleanFilters = {
                                                            ...prev,
                                                            subcategory_id: [],
                                                        };
                                                        return cleanFilters;
                                                    });

                                                    // Cerrar todas las categorías expandidas
                                                    setSections(prev => {
                                                        const updatedSections = { ...prev };
                                                        categoriesWithSubs.forEach(category => {
                                                            updatedSections[`category_${category.id}`] = false;
                                                        });
                                                        return updatedSections;
                                                    });

                                                    setFilterSequence([]);
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1.66675 15.0003C1.66675 13.7167 1.66675 13.0747 1.95569 12.6032C2.11736 12.3394 2.33919 12.1176 2.60302 11.9559C3.07453 11.667 3.71638 11.667 5.00008 11.667C6.28378 11.667 6.92563 11.667 7.39714 11.9559C7.66097 12.1176 7.8828 12.3394 8.04447 12.6032C8.33341 13.0747 8.33341 13.7167 8.33341 15.0003C8.33341 16.284 8.33341 16.9259 8.04447 17.3974C7.8828 17.6612 7.66097 17.8831 7.39714 18.0447C6.92563 18.3337 6.28378 18.3337 5.00008 18.3337C3.71638 18.3337 3.07453 18.3337 2.60302 18.0447C2.33919 17.8831 2.11736 17.6612 1.95569 17.3974C1.66675 16.9259 1.66675 16.284 1.66675 15.0003Z" stroke="white" stroke-width="1.25" />
                                                        <path d="M11.6667 15.0003C11.6667 13.7167 11.6667 13.0747 11.9557 12.6032C12.1173 12.3394 12.3392 12.1176 12.603 11.9559C13.0745 11.667 13.7164 11.667 15.0001 11.667C16.2837 11.667 16.9257 11.667 17.3972 11.9559C17.661 12.1176 17.8828 12.3394 18.0445 12.6032C18.3334 13.0747 18.3334 13.7167 18.3334 15.0003C18.3334 16.284 18.3334 16.9259 18.0445 17.3974C17.8828 17.6612 17.661 17.8831 17.3972 18.0447C16.9257 18.3337 16.2837 18.3337 15.0001 18.3337C13.7164 18.3337 13.0745 18.3337 12.603 18.0447C12.3392 17.8831 12.1173 17.6612 11.9557 17.3974C11.6667 16.9259 11.6667 16.284 11.6667 15.0003Z" stroke="white" stroke-width="1.25" />
                                                        <path d="M1.66675 5.00033C1.66675 3.71663 1.66675 3.07478 1.95569 2.60327C2.11736 2.33943 2.33919 2.11761 2.60302 1.95593C3.07453 1.66699 3.71638 1.66699 5.00008 1.66699C6.28378 1.66699 6.92563 1.66699 7.39714 1.95593C7.66097 2.11761 7.8828 2.33943 8.04447 2.60327C8.33341 3.07478 8.33341 3.71663 8.33341 5.00033C8.33341 6.28403 8.33341 6.92588 8.04447 7.39738C7.8828 7.66122 7.66097 7.88304 7.39714 8.04472C6.92563 8.33366 6.28378 8.33366 5.00008 8.33366C3.71638 8.33366 3.07453 8.33366 2.60302 8.04472C2.33919 7.88304 2.11736 7.66122 1.95569 7.39738C1.66675 6.92588 1.66675 6.28403 1.66675 5.00033Z" stroke="white" stroke-width="1.25" />
                                                        <path d="M11.6667 5.00033C11.6667 3.71663 11.6667 3.07478 11.9557 2.60327C12.1173 2.33943 12.3392 2.11761 12.603 1.95593C13.0745 1.66699 13.7164 1.66699 15.0001 1.66699C16.2837 1.66699 16.9257 1.66699 17.3972 1.95593C17.661 2.11761 17.8828 2.33943 18.0445 2.60327C18.3334 3.07478 18.3334 3.71663 18.3334 5.00033C18.3334 6.28403 18.3334 6.92588 18.0445 7.39738C17.8828 7.66122 17.661 7.88304 17.3972 8.04472C16.9257 8.33366 16.2837 8.33366 15.0001 8.33366C13.7164 8.33366 13.0745 8.33366 12.603 8.04472C12.3392 7.88304 12.1173 7.66122 11.9557 7.39738C11.6667 6.92588 11.6667 6.28403 11.6667 5.00033Z" stroke="white" stroke-width="1.25" />
                                                    </svg>
                                                    <span className="font-semibold text-sm">Todos los productos</span>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-white" />
                                            </button>
                                        </motion.div>

                                        {/* Lista de categorías */}
                                        <div className="space-y-0">
                                            <AnimatePresence>
                                                {categoriesWithSubs.map((category, index) => {
                                                  
                                                    return (
                                                        <motion.div
                                                            key={category.id}
                                                            className=""
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            {/* Categoría principal */}
                                                            <motion.button
                                                                className="w-full p-4 flex items-center justify-between text-white text-left hover:bg-secondary/50 transition-colors duration-200"
                                                                onClick={() => {
                                                                    const categoryKey = `category_${category.id}`;
                                                                    setSections(prev => {
                                                                        const newSections = {
                                                                            ...prev,
                                                                            [categoryKey]: !prev[categoryKey]
                                                                        };
                                                                        return newSections;
                                                                    });
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    {category.image && (
                                                                        <img
                                                                            src={`/storage/images/category/${category.image}`}
                                                                            alt={category.name}
                                                                            className="w-5 h-5 filter brightness-0 invert"
                                                                            onError={(e) => (e.target.style.display = 'none')}
                                                                        />
                                                                    )}
                                                                    <span className="font-semibold text-sm">{category.name}</span>
                                                                   
                                                                  
                                                                </div>
                                                                <motion.div
                                                                    animate={{ rotate: sections[`category_${category.id}`] ? 90 : 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                >
                                                                    <ChevronRight className="h-5 w-5 text-white" />
                                                                </motion.div>
                                                            </motion.button>

                                                            {/* Subcategorías expandibles */}
                                                            <AnimatePresence>
                                                                {sections[`category_${category.id}`] && (
                                                                    <motion.div
                                                                        className="bg-secondary"
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: "auto", opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                    >
                                                                        <div className="p-4 space-y-1">
                                                                            {/* Opción "Todas" para esta categoría */}
                                                                            <motion.button
                                                                                className="w-full text-left px-4 py-3 text-white bg-white/20 hover:bg-white/20 rounded-lg transition-colors duration-200"
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ delay: 0.1 }}
                                                                            >
                                                                                <span className="font-medium text-sm">Todas</span>
                                                                            </motion.button>

                                                                            {/* Lista de subcategorías - Siempre mostrar algo para debug */}
                                                                            {category.subcategories && category.subcategories.length > 0 ? (
                                                                                category.subcategories.map((subcategory, subIndex) => {
                                                                                    return (
                                                                                        <motion.button
                                                                                            key={subcategory.id}
                                                                                            className={`w-full text-left px-4 py-3 text-white rounded-lg transition-colors duration-200 ${selectedFilters.subcategory_id?.includes(subcategory.id)
                                                                                                    ? 'bg-white/20 font-semibold'
                                                                                                    : 'hover:bg-white/20'
                                                                                                }`}
                                                                                            onClick={() => {
                                                                                               
                                                                                                handleFilterChange("subcategory_id", subcategory.id);
                                                                                            }}
                                                                                            initial={{ opacity: 0, x: -10 }}
                                                                                            animate={{ opacity: 1, x: 0 }}
                                                                                            transition={{ delay: subIndex * 0.05 + 0.2 }}
                                                                                        >
                                                                                            <span className="font-medium text-sm">{subcategory.name}</span>
                                                                                        </motion.button>
                                                                                    );
                                                                                })
                                                                            ) : (
                                                                                // Mostrar mensaje de debug si no hay subcategorías
                                                                                <div className="px-4 py-3 text-white/70 text-sm">
                                                                                    No hay subcategorías disponibles
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    );
                                                })}
                                            </AnimatePresence>
                                        </div>

                                        {/* Footer del panel con contacto */}
                                        <div className="bg-secondary p-4  ">
                                            <div className="text-white border-t border-white pt-4">
                                                <p className="text-xs text-white/60  mb-1">Escríbenos</p>
                                                <p className="text-sm font-medium opacity-90"> {General.get('support_email')}</p>
                                            </div>
                                        </div>
                                    </motion.div>



                                    {/* Chips de filtros activos mejorados - Solo categorías y subcategorías */}
                                    <motion.div
                                        className="mt-6 pt-6 border-t border-gray-200/60"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <AnimatePresence>
                                            {(selectedFilters.subcategory_id?.length > 0) && (
                                                <motion.div
                                                    className="mb-4"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    <h4 className="text-sm font-semibold customtext-neutral-dark mb-3 flex items-center gap-2">
                                                        <Star className="h-4 w-4 customtext-primary" />
                                                        Filtros Activos
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {/* Chips de subcategorías con AnimatedBadge */}
                                                        {selectedFilters.subcategory_id?.map((subcategoryId) => {
                                                            const subcategory = subcategories.find(sub => sub.id === subcategoryId);
                                                            return subcategory ? (
                                                                <AnimatedBadge
                                                                    key={subcategoryId}
                                                                    onClick={() => handleFilterChange("subcategory_id", subcategoryId)}
                                                                >
                                                                    <Grid3X3 className="h-3 w-3" />
                                                                    <span>{subcategory.name}</span>
                                                                    <motion.div
                                                                        className="ml-1 rounded-full p-0.5 transition-colors duration-200"
                                                                        whileHover={{ scale: 1.2 }}
                                                                        whileTap={{ scale: 0.9 }}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </motion.div>
                                                                </AnimatedBadge>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>


                                </div>
                            </div>
                        </div>
                        {/* Footer móvil mejorado */}
                        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-white via-white to-gray-50 border-t border-gray-200 p-4 shadow-2xl backdrop-blur-xl lg:hidden z-50">
                            <div className="flex items-center gap-3">
                                <motion.button
                                    className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => {
                                        setFiltersOpen(false);
                                        // Removido el scroll automático - solo cerrar el panel
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <ShoppingBag className="h-5 w-5" />
                                        <span>Ver {pagination.totalItems} Productos</span>
                                    </div>
                                </motion.button>

                                <motion.button
                                    className="p-3 bg-gray-100 hover:bg-gray-200 customtext-neutral-dark rounded-xl transition-colors duration-200"
                                    onClick={() => setFiltersOpen(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Área de productos mejorada */}
                    <motion.div
                        className="w-full lg:w-9/12 py-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >



                        {/* Grid de productos con animaciones mejoradas */}
                        <AnimatePresence mode="wait">
                            {(loading && !hasSearched) || isFiltering ? (
                                <motion.div
                                    className="w-full"
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                                >
                                    {/* Header de loading mejorado */}
                                    <motion.div
                                        className="mb-8 text-center"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, 360],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{
                                                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                            }}
                                            className="inline-block mb-4"
                                        >
                                            <Sparkles className="h-8 w-8 customtext-primary" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold customtext-neutral-dark mb-2">
                                            {isFiltering ? "Aplicando filtros..." : "Cargando productos increíbles"}
                                        </h3>
                                        <p className="customtext-neutral-dark">
                                            {isFiltering ? "Encontrando los mejores resultados para ti..." : "Preparando la mejor selección para ti..."}
                                        </p>
                                    </motion.div>

                                    {/* Grid de skeleton cards */}
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6  w-full">
                                        {Array.from({ length: 12 }, (_, index) => (
                                            <div key={index} className="h-[400px] lg:h-[460px] xl:h-[400px] 2xl:h-[430px]">
                                                <SkeletonCard delay={index * 0.08} />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out relative"
                                    key="products"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Overlay de loading cuando se están aplicando filtros */}
                                    {isFiltering && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Sparkles className="h-8 w-8 customtext-primary" />
                                                </motion.div>
                                                <p className="text-sm font-semibold customtext-primary">Aplicando filtros...</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {Array.isArray(products) && products.length > 0 ? (
                                        products.map((product, index) => (
                                            <motion.div
                                                className="w-1/2 px-2 lg:w-1/3 xl:w-1/3 lg:h-[460px] lg:max-h-[500px] xl:h-[500px] xl:max-h-[500px] 2xl:h-[600px] 2xl:max-h-[600px] flex items-center justify-center"
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    duration: 0.5,
                                                    type: "spring",
                                                    stiffness: 100
                                                }}
                                                whileHover={{
                                                    y: -5,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                {renderProductCard(product)}
                                            </motion.div>
                                        ))
                                    ) : hasSearched && !loading && !isFiltering && showNoResults ? (
                                        <motion.div
                                            className="w-full flex items-center justify-center py-16"
                                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                                        >
                                            <div className="text-center space-y-6">

                                                <motion.div
                                                    className="space-y-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <h3 className="text-xl font-bold customtext-neutral-dark">¡Ups! No encontramos productos</h3>
                                                    <p className="customtext-neutral-dark max-w-md">Intenta ajustar tus filtros o buscar términos diferentes.</p>
                                                    <motion.button
                                                        className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                                        onClick={() => {

                                                            // Limpiar cada filtro individualmente usando setSelectedFilters con función
                                                            // Esto simula el comportamiento de handleFilterChange que funciona correctamente
                                                            setSelectedFilters((prev) => {

                                                                const cleanFilters = {
                                                                    collection_id: [],
                                                                    category_id: [],
                                                                    brand_id: [],
                                                                    subcategory_id: [],
                                                                    store_id: [],
                                                                    tag_id: [],
                                                                    price: [],
                                                                    name: null,
                                                                    sort: [
                                                                        {
                                                                            selector: "final_price",
                                                                            desc: true,
                                                                        },
                                                                    ],
                                                                };

                                                                return cleanFilters;
                                                            });

                                                            setFilterSequence([]);

                                                        }}
                                                        whileHover={{ scale: 1.05, y: -2 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Trash className="h-4 w-4" />
                                                            <span>Limpiar filtros</span>
                                                        </div>
                                                    </motion.button>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {/* Paginación mejorada */}
                        {Array.isArray(products) && products.length > 0 && (
                            <motion.div
                                className="flex flex-col md:flex-row justify-between items-center mb-4 w-full mt-12 gap-4 p-6 bg-gradient-to-r from-white via-gray-50/50 to-blue-50/50 rounded-2xl border border-gray-200/60 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {/* Navegación de páginas mejorada */}
                                <div className="customtext-primary font-semibold w-full md:w-auto">
                                    <div className="overflow-x-auto pb-2">
                                        <nav className="flex items-center gap-x-2 min-w-max">
                                            <motion.button
                                                className={`p-3 inline-flex items-center gap-2 rounded-xl transition-all duration-300 ${pagination.currentPage === 1
                                                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 customtext-primary border border-blue-200"
                                                    }`}
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}

                                                whileTap={pagination.currentPage !== 1 ? { scale: 0.95 } : {}}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="hidden sm:inline">Anterior</span>
                                            </motion.button>

                                            {getPageNumbers().map((page, index) => (
                                                <React.Fragment key={index}>
                                                    {page === "..." ? (
                                                        <span className="w-10 h-10 bg-transparent p-2 inline-flex items-center justify-center rounded-full customtext-neutral-dark">
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <motion.button
                                                            className={`w-10 h-10 p-2 inline-flex items-center justify-center rounded-xl transition-all duration-300 font-semibold
                                                        ${page === pagination.currentPage
                                                                    ? " bg-primary text-white shadow-lg shadow-blue-500/25"
                                                                    : "bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 customtext-primary border border-gray-200 hover:border-blue-300"
                                                                }`}
                                                            onClick={() => handlePageChange(page)}
                                                            whileHover={{ scale: 1.1, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {page}
                                                        </motion.button>
                                                    )}
                                                </React.Fragment>
                                            ))}

                                            <motion.button
                                                className={`p-3 inline-flex items-center gap-2 rounded-xl transition-all duration-300 ${pagination.currentPage === pagination.totalPages
                                                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 customtext-primary border border-blue-200"
                                                    }`}
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}

                                                whileTap={pagination.currentPage !== pagination.totalPages ? { scale: 0.95 } : {}}
                                            >
                                                <span className="hidden sm:inline">Siguiente</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </motion.button>
                                        </nav>
                                    </div>
                                </div>

                                {/* Información de paginación mejorada */}
                                <motion.div
                                    className="w-full md:w-auto text-center md:text-right"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-center md:justify-end gap-2 p-4">

                                        <p className="font-semibold text-sm customtext-neutral-dark">
                                            {pagination.from} - {pagination.to} de {pagination.totalItems} Resultados
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CatalogoFiltrosKatya;

// CSS-in-JS para scrollbar personalizado y efectos adicionales
const customStyles = `
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        border-radius: 10px;
        border: 1px solid #e2e8f0;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #2563eb, #4f46e5);
    }
    
    @keyframes shimmer {
        0% {
            transform: translateX(-100%) skew(-12deg);
        }
        100% {
            transform: translateX(200%) skew(-12deg);
        }
    }
    
    .animate-shimmer {
        animation: shimmer 2s infinite;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-5px);
        }
    }
    
    .filter-shadow {
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(59, 130, 246, 0.1),
            0 0 20px rgba(59, 130, 246, 0.1);
    }
    
    .gradient-border {
        position: relative;
        background: linear-gradient(white, white) padding-box,
                    linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6) border-box;
        border: 2px solid transparent;
    }
`;

// Inyectar estilos en el documento
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
}

// Componente de Tooltip personalizado para mejor UX
const Tooltip = ({ children, text, position = "top" }) => {
    const [show, setShow] = useState(false);

    const positionClasses = {
        top: "-top-10 left-1/2 -translate-x-1/2",
        bottom: "-bottom-10 left-1/2 -translate-x-1/2",
        left: "-left-2 top-1/2 -translate-y-1/2 -translate-x-full",
        right: "-right-2 top-1/2 -translate-y-1/2 translate-x-full"
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                    >
                        {text}
                        <div className={`absolute w-0 h-0 border-l-4 border-r-4 border-transparent ${position === 'top' ? 'border-t-4 border-t-gray-900 top-full left-1/2 -translate-x-1/2' :
                            position === 'bottom' ? 'border-b-4 border-b-gray-900 bottom-full left-1/2 -translate-x-1/2' :
                                position === 'left' ? 'border-l-4 border-l-gray-900 left-full top-1/2 -translate-y-1/2' :
                                    'border-r-4 border-r-gray-900 right-full top-1/2 -translate-y-1/2'
                            }`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Componente de Badge con animación mejorada
const AnimatedBadge = ({ children, color = "blue", onClick, className = "" }) => {
    const colorClasses = {
        blue: "bg-gray-200 customtext-primary",

    };

    return (
        <motion.div
            className={`inline-flex items-center gap-2 px-3 py-1.5  ${colorClasses[color]} border rounded-full text-sm font-medium cursor-pointer select-none ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
};

// Hook personalizado para animaciones de lista
const useStaggerAnimation = (items, delay = 0.1) => {
    return {
        container: {
            animate: {
                transition: {
                    staggerChildren: delay
                }
            }
        },
        item: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 }
        }
    };
};


