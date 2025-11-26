import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCardIbergruas from "../Products/ProductCardIbergruas";
import {
    Filter,
    Search,
    Tag,
    Layers,
    ListFilter,
    CheckCircle2,
    Grid3X3,
    Sliders
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";
import { GET } from "sode-extend-react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import axios from "axios";

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
    }
};

// Estilos CSS modernos
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
};

const CatalogoIbergruas = ({ items, data, filteredData, cart, setCart }) => {
    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
       // { value: "final_price:asc", label: "Precio: Menor a Mayor" },
       // { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
       // { value: "most_sold:desc", label: "Más vendidos" },
       // { value: "views:desc", label: "Más visitados" },
       // { value: "best_discount:desc", label: "Mejores ofertas" },
       // { value: "featured:desc", label: "Destacados" },
        //{ value: "offering:desc", label: "En oferta" },
        //{ value: "is_new:desc", label: "Nuevos productos" },
    ];

    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [tags, setTags] = useState([]);

    // Context Data for Hero and Subcategory Dropdown
    const [contextData, setContextData] = useState({
        category: null,
        current_subcategory: null,
        subcategories: [], // Sibling subcategories
        banners: []
    });

    const [sections, setSections] = useState(() => {
        if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
            return {
                marca: false,
                precio: false,
                categoria: false,
                subcategoria: false,
                colores: false,
                coleccion: false,
            };
        }
        return {
            marca: false,
            precio: false,
            categoria: false,
            subcategoria: false,
            colores: false,
            coleccion: false,
        };
    });

    const [selectedFilters, setSelectedFilters] = useState({
        collection_id: [],
        category_id: [],
        brand_id: [],
        subcategory_id: [],
        tag_id: GET.tag ? GET.tag.split(',') : [],
        price: [],
        name: GET.search || null,
        sort: (() => {
            if (GET.sortBy) {
                const sortValue = GET.sortBy;
                let validSortOption = sortOptions.find(option => option.value === sortValue);
                if (!validSortOption) {
                    validSortOption = sortOptions.find(option =>
                        option.label.toLowerCase() === sortValue.toLowerCase()
                    );
                }
                if (validSortOption) {
                    const [selector, order] = validSortOption.value.split(":");
                    return [{ selector: selector, desc: order === "desc" }];
                }
            }
            return [{ selector: "final_price", desc: true }];
        })(),
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 24,
        from: 0,
        to: 0,
    });

    // Fetch Context Data (Banners, Category info)
    const fetchContextData = async () => {
        try {
            const params = {};
            if (GET.subcategory) params.subcategory = GET.subcategory;
            if (GET.category) params.category = GET.category;
            if (GET.brand) params.brand = GET.brand;

            if (Object.keys(params).length > 0) {
                const response = await axios.get('/api/catalog/context', { params });
                if (response.data) {
                    setContextData(response.data);
                }
            }
        } catch (error) {
            console.error("Error fetching context data:", error);
        }
    };

    const convertSlugsToIds = async () => {
        try {
            const params = {};
            if (GET.category) params.category_slugs = GET.category;
            if (GET.brand) params.brand_slugs = GET.brand;
            if (GET.subcategory) params.subcategory_slugs = GET.subcategory;
            if (GET.collection) params.collection_slugs = GET.collection;

            if (Object.keys(params).length > 0) {
                const response = await itemsRest.convertSlugs(params);
                if (response.status === 200) {
                    setSelectedFilters(prev => ({
                        ...prev,
                        category_id: Array.isArray(response.data.category_ids) ? response.data.category_ids : (response.data.category_ids ? [response.data.category_ids] : []),
                        brand_id: GET.brand ? [GET.brand] : [],
                        subcategory_id: Array.isArray(response.data.subcategory_ids) ? response.data.subcategory_ids : (response.data.subcategory_ids ? [response.data.subcategory_ids] : []),
                        collection_id: Array.isArray(response.data.collection_ids) ? response.data.collection_ids : (response.data.collection_ids ? [response.data.collection_ids] : []),
                    }));
                }
            }
        } catch (error) {
            console.error('Error converting slugs to IDs:', error);
        }
    };

    const transformFilters = (filters) => {
        const transformedFilters = [];
        if (filters.sort && Array.isArray(filters.sort)) {
            const specialSortFields = ['featured', 'offering', 'is_new', 'recommended'];
            filters.sort.forEach(sortItem => {
                if (specialSortFields.includes(sortItem.selector)) {
                    transformedFilters.push([sortItem.selector, "=", 1]);
                }
            });
        }
        if (filters.collection_id.length > 0) {
            const collectionConditions = filters.collection_id.map((slug) => [
                "collection.id", "=", collections.find(c => c.slug === slug)?.id || slug,
            ]);
            transformedFilters.push(ArrayJoin(collectionConditions, 'or'));
        }
        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => ["category.id", "=", id]);
            transformedFilters.push(ArrayJoin(categoryConditions, 'or'));
        }
        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => ["subcategory.id", "=", id]);
            transformedFilters.push(ArrayJoin(subcategoryConditions, 'or'));
        }
        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((slug) => {
                const brand = brands.find(b => b.slug === slug);
                return brand ? ["brand.slug", "=", brand.slug] : ["brand.slug", "=", slug];
            });
            transformedFilters.push(ArrayJoin(brandConditions, 'or'));
        }
        if (filters.tag_id && filters.tag_id.length > 0) {
            const tagConditions = filters.tag_id.map((tagId) => ["item_tag.tag_id", "=", tagId]);
            transformedFilters.push(ArrayJoin(tagConditions, 'or'));
        }
        if (filters.price && filters.price.length > 0) {
            const priceConditions = filters.price.map((priceRange) => [
                "and", [["final_price", ">=", priceRange.min], "and", ["final_price", "<=", priceRange.max]],
            ]);
            transformedFilters.push(ArrayJoin(priceConditions, 'or'));
        }
        if (filters.name) {
            const searchConditions = [
                ["name", "contains", filters.name], "or",
                ["summary", "contains", filters.name], "or",
                ["description", "contains", filters.name]
            ];
            transformedFilters.push(searchConditions);
        }
        return ArrayJoin(transformedFilters, 'and');
    };

    const fetchProducts = async (page = 1, isNewFilter = false) => {
        setShowNoResults(false);
        if (isNewFilter) setIsFiltering(true);
        else setLoading(true);

        try {
            const filters = transformFilters(selectedFilters);
            const itemsPerPage = 24;
            const specialSortFields = ['featured', 'offering', 'is_new', 'recommended'];
            const filteredSort = selectedFilters.sort.filter(sortItem => !specialSortFields.includes(sortItem.selector));
            const finalSort = filteredSort.length > 0 ? filteredSort : [{ selector: "final_price", desc: true }];

            const params = {
                filter: filters,
                sort: finalSort,
                skip: (page - 1) * itemsPerPage,
                take: itemsPerPage,
                requireTotalCount: true,
                with: 'category,brand'
            };

            const response = await itemsRest.paginate(params);

            if (response.status !== 200) throw new Error(`API returned status ${response.status}`);

            setProducts(response.data || []);
            setHasSearched(true);

            if (!response.data || response.data.length === 0) {
                setTimeout(() => setShowNoResults(true), 300);
            }

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

            setBrands(response?.summary?.brands || []);
            setCategories(response?.summary?.categories || []);
            setSubcategories(response?.summary?.subcategories || []);
            setCollections(response?.summary?.collections || []);
            setPriceRanges(response?.summary?.priceRanges || []);
            setTags(response?.summary?.tags || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            setTimeout(() => setShowNoResults(true), 300);
        } finally {
            setLoading(false);
            setIsFiltering(false);
        }
    };

    useEffect(() => {
        if (filteredData) {
            setCategories(filteredData.categories || []);
            setBrands(filteredData.brands || []);
            setSubcategories(filteredData.subcategories || []);
            setPriceRanges(filteredData.priceRanges || []);
        }
        convertSlugsToIds();
        fetchContextData();
        fetchProducts(1, false);
    }, [filteredData]);

    useEffect(() => {
        fetchProducts(1, hasSearched);
    }, [selectedFilters]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPages && page !== pagination.currentPage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            fetchProducts(page, false);
        }
    };

    const handleFilterChange = (type, value) => {
        const specialFields = ['is_new', 'offering', 'recommended', 'featured'];
        if (specialFields.includes(type)) {
            setSelectedFilters((prev) => ({ ...prev, [type]: prev[type] ? !prev[type] : true }));
            return;
        }
        setSelectedFilters((prev) => {
            if (type === "price") {
                const currentPrices = Array.isArray(prev.price) ? prev.price : [];
                const isAlreadySelected = currentPrices.some((range) => range.min === value.min && range.max === value.max);
                let newPrices = isAlreadySelected
                    ? currentPrices.filter((range) => !(range.min === value.min && range.max === value.max))
                    : [...currentPrices, value];
                return { ...prev, price: newPrices };
            }
            const currentValues = Array.isArray(prev[type]) ? prev[type] : [];
            let newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];
            return { ...prev, [type]: newValues };
        });
    };

    const toggleSection = (section) => {
        setSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const [searchCategory, setSearchCategory] = useState("");
    const [searchBrand, setSearchBrand] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );

    // Render Banners
    const renderBanners = () => {
        // Parse title with highlighted words (words between *)
        const parseTitle = (text) => {
            if (!text) return null;

            const parts = text.split(/(\*[^*]+\*)/g);

            return parts.map((part, index) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                    const word = part.slice(1, -1);
                    return (
                        <span key={index} className="customtext-primary">
                            {word}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            });
        };

        if (contextData.banners && contextData.banners.length > 0) {
            return (
                <div className="">
                    {contextData.banners.map((banner, index) => {
                        // First banner: Full-width background with centered text (Slider style)
                        if (index === 0) {
                            return (
                                <div key={index} className="relative overflow-hidden h-[500px] lg:h-[600px] flex items-center justify-center -mx-4 md:-mx-6 lg:-mx-8">
                                    {/* Background Image */}
                                    {banner.image && (
                                        <>
                                            <div className="absolute inset-0">
                                                <img
                                                    src={`/storage/images/category/${banner.image}`}
                                                    alt={banner.title || "Banner"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* Dark Overlay */}
                                            <div className="absolute inset-0 bg-black/50"></div>
                                        </>
                                    )}

                                    {/* Centered Content */}
                                    <div className="relative z-10 px-4 sm:px-6 lg:px-8">
                                        <div className="max-w-3xl mx-auto text-center">
                                            {banner.title && (
                                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                                                    {parseTitle(banner.title)}
                                                </h1>
                                            )}
                                            {banner.description && (
                                                <p className="text-lg md:text-xl lg:text-2xl text-white mb-8 max-w-2xl mx-auto">
                                                    {banner.description}
                                                </p>
                                            )}
                                            {banner.button_text && banner.button_link && (
                                                <a
                                                    href={banner.button_link}
                                                    className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-primary customtext-primary text-lg font-bold hover:bg-primary hover:text-white transition-all duration-300"
                                                >
                                                    <span>{banner.button_text}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Second banner and onwards: Split layout alternating
                        // index 1 (second): text left, image right
                        // index 2 (third): text right, image left
                        // index 3 (fourth): text left, image right
                        // and so on...
                        const isEven = index % 2 === 1; // index 1, 3, 5... (text left)
                        
                        return (
                            <div key={index} className="w-full rounded-2xl overflow-hidden shadow-xl">
                                <div className={`grid lg:grid-cols-2 min-h-[400px] lg:min-h-[500px] ${!isEven ? 'bg-white' : 'bg-white'}`}>
                                    {/* Content Side */}
                                    <div className={`bg-primary flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-16 ${isEven ? 'order-2 lg:order-1' : 'order-2'}`}>
                                        <div className="max-w-2xl w-full space-y-6">
                                            {banner.title && (
                                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                                    {parseTitle(banner.title)}
                                                </h2>
                                            )}
                                            {banner.description && (
                                                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                                                    {banner.description}
                                                </p>
                                            )}
                                            {banner.button_text && banner.button_link && (
                                                <div className="pt-4">
                                                    <a
                                                        href={banner.button_link}
                                                        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary font-bold text-lg rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-xl"
                                                    >
                                                        <span>{banner.button_text}</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image Side */}
                                    <div className={`relative h-64 lg:h-auto ${isEven ? 'order-1 lg:order-2' : 'order-1'}`}>
                                        {banner.image && (
                                            <>
                                                <img
                                                    src={`/storage/images/category/${banner.image}`}
                                                    alt={banner.title || "Banner"}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                {/* Gradient overlay for better mobile visibility */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden"></div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Fallback to existing simple header if no banners
        return (
            <motion.div
                className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6 lg:mb-8 lg:pb-6 lg:border-b-2 border-gradient-to-r from-blue-200 via-indigo-200 to-purple-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="md:w-6/12">
                    <h2 className="text-2xl lg:text-[32px] md:text-4xl font-bold customtext-primary lg:mb-2">
                        {data?.title || "Catálogo"}
                    </h2>
                </div>
            </motion.div>
        );
    };

    return (
        <>
           {/* Banners / Hero Section */}
                {renderBanners()}

        <section className="py-4 lg:py-12 bg-secondary">
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">

                {/* Subcategory Dropdown and Sort Options in same row */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Subcategory Dropdown */}
                    {contextData.current_subcategory && contextData.subcategories.length > 0 && (
                        <div className="w-full md:w-auto md:min-w-[280px]">
                            <SelectForm
                                options={contextData.subcategories}
                                valueKey="slug"
                                labelKey="name"
                                value={contextData.current_subcategory.slug}
                                placeholder="Seleccionar subcategoría"
                                className="bg-primary text-white border-primary"
                                onChange={(slug) => {
                                    window.location.href = `/catalogo?subcategory=${slug}`;
                                }}
                            />
                        </div>
                    )}

                    {/* Sort Options */}
                    <div className="w-full md:w-auto md:min-w-[280px]">
                        <SelectForm
                            options={sortOptions}
                            valueKey="value"
                            labelKey="label"
                            value={selectedFilters.sort?.[0]?.selector ? `${selectedFilters.sort[0].selector}:${selectedFilters.sort[0].desc ? "desc" : "asc"}` : "final_price:desc"}
                            placeholder="Ordenar por"
                            className="bg-primary text-white border-primary"
                            onChange={(value) => {
                                const [selector, order] = value.split(":");
                                setSelectedFilters(prev => ({ ...prev, sort: [{ selector, desc: order === "desc" }] }));
                            }}
                        />
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <div className="text-white">
                        {pagination.totalItems > 0 && (
                            <p className="text-sm">
                                Mostrando <span className="font-semibold text-white">{pagination.from}</span> - <span className="font-semibold text-white">{pagination.to}</span> de <span className="font-semibold text-white">{pagination.totalItems}</span> productos
                            </p>
                        )}
                    </div>
                </div>

                {/* Products Grid - No Sidebar */}
                <div className="w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl h-[400px] animate-pulse"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence>
                                {products.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="h-full"
                                    >
                                        <ProductCardIbergruas
                                            product={product}
                                            cart={cart}
                                            setCart={setCart}
                                            data={data}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        showNoResults && <NoResults />
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${pagination.currentPage === page
                                        ? "bg-primary text-white shadow-lg scale-110"
                                        : "bg-white text-white hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
        </>
    );
};

export default CatalogoIbergruas;
