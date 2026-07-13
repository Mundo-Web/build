import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardProductTwenty from "../Products/Components/CardProductTwenty";
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
    Grid3X3,
    Trash,
    Coffee,
    CircleSlash2,
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import { GET } from "sode-extend-react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const itemsRest = new ItemsRest();

// Animations tuned for brutalist layout
const filterAnimations = {
    container: {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: { duration: 0.2, ease: "easeOut" },
    },
    section: {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.25, ease: "easeInOut" },
    },
    item: {
        initial: { opacity: 0, x: -5 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 5 },
        transition: { duration: 0.15, ease: "easeOut" },
    },
    badge: {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.9, opacity: 0 },
        transition: { duration: 0.15 },
    },
    hover: {
        y: -1,
        transition: { duration: 0.15 },
    },
    tap: {
        scale: 0.99,
        transition: { duration: 0.05 },
    },
};

// Brutalist styles matching the Twenty aesthetic
const brutalistStyles = {
    filterContainer: "bg-black border-2 border-white/10 p-6 rounded-none shadow-[4px_4px_0px_rgba(255,255,255,0.05)] w-full",
    filterHeader: "bg-black border-b-2 border-white/10 pb-4 mb-4 rounded-none",
    filterSection: "group transition-all duration-300 hover:bg-white/5 rounded-none border border-transparent mb-2",
    filterButton: "w-full flex items-center justify-between p-4 rounded-none transition-all duration-300 hover:bg-white/5 group text-white",
    filterContent: "bg-neutral-900/40 rounded-none border border-white/10 p-4 mt-1",
    searchInput: "w-full pl-12 pr-4 py-3 bg-black border-2 border-white/10 focus:border-white text-white rounded-none transition-all duration-300 placeholder:text-neutral-500 font-mono text-sm focus:outline-none focus:ring-0",
    checkbox: "appearance-none relative min-h-5 min-w-5 shrink-0 rounded-none border-2 border-white/20 bg-black checked:bg-white checked:border-white focus:outline-none transition-all duration-200 cursor-pointer checked:after:content-[''] checked:after:absolute checked:after:left-[6px] checked:after:top-[2px] checked:after:w-[5px] checked:after:h-[10px] checked:after:border-black checked:after:border-b-[2.5px] checked:after:border-r-[2.5px] checked:after:rotate-45",
    label: "flex items-center gap-3 py-2 px-3 rounded-none transition-all duration-200 hover:bg-white/5 cursor-pointer group text-white/80 hover:text-white",
    activeFilter: "bg-white text-black font-bold",
    badge: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-none text-xs font-bold text-white hover:bg-neutral-800",
};

const SkeletonCard = ({ delay = 0 }) => {
    return (
        <motion.div
            className="group w-full h-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay,
                duration: 0.4,
                ease: "easeOut",
            }}
        >
            <div className="px-1 h-full">
                <div className="bg-black border-2 border-white/10 rounded-none overflow-hidden h-full flex flex-col h-[400px] lg:h-[460px] xl:h-[400px] 2xl:h-[430px]">
                    <div className="relative flex-1 bg-neutral-950 overflow-hidden">
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900">
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-neutral-800 animate-pulse" />
                        </div>
                    </div>

                    <div className="p-5 space-y-3 bg-black flex-shrink-0 border-t border-white/10">
                        <div className="h-3 w-16 bg-neutral-800 animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-neutral-800 animate-pulse"></div>
                            <div className="h-4 w-2/3 bg-neutral-800 animate-pulse"></div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="h-5 w-20 bg-neutral-800 animate-pulse"></div>
                            <div className="h-9 w-20 bg-neutral-800 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CatalogoFiltrosTwenty = ({
    items,
    data,
    filteredData,
    cart,
    setCart,
    setFavorites,
    favorites,
    onClickTracking,
}) => {
    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
        { value: "final_price:asc", label: "Precio: Menor a Mayor" },
        { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
        { value: "most_sold:desc", label: "Más vendidos" },
        { value: "views:desc", label: "Más visitados" },
        { value: "best_discount:desc", label: "Mejores ofertas" },
        { value: "featured:desc", label: "Destacados" },
        { value: "offering:desc", label: "En oferta" },
    ];

    const [independentFilter, setIndependentFilter] = useState(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const [brands, setBrands] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [stores, setStores] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [tags, setTags] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [activeSection, setActiveSection] = useState(null);

    const staticPriceRanges = [
        { min: 0, max: 50, label: `Hasta ${CurrencySymbol()} 50` },
        {
            min: 50,
            max: 100,
            label: `${CurrencySymbol()} 50 - ${CurrencySymbol()} 100`,
        },
        {
            min: 100,
            max: 250,
            label: `${CurrencySymbol()} 100 - ${CurrencySymbol()} 250`,
        },
        {
            min: 250,
            max: 500,
            label: `${CurrencySymbol()} 250 - ${CurrencySymbol()} 500`,
        },
        {
            min: 500,
            max: 1000,
            label: `${CurrencySymbol()} 500 - ${CurrencySymbol()} 1.000`,
        },
        {
            min: 1000,
            max: 2000,
            label: `${CurrencySymbol()} 1.000 - ${CurrencySymbol()} 2.000`,
        },
        {
            min: 2000,
            max: 5000,
            label: `${CurrencySymbol()} 2.000 - ${CurrencySymbol()} 5.000`,
        },
        { min: 5000, max: 999999, label: `Desde ${CurrencySymbol()} 5.000` },
    ];

    const [sections, setSections] = useState(() => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            return {
                marca: false,
                precio: false,
                categoria: false,
                subcategoria: false,
                colores: false,
                coleccion: false,
                tienda: false,
                amenidades: false,
            };
        }
        return {
            marca: false,
            precio: false,
            categoria: false,
            subcategoria: false,
            colores: false,
            coleccion: false,
            tienda: false,
            amenidades: false,
        };
    });

    const [selectedFilters, setSelectedFilters] = useState({
        collection_id: [],
        category_id: [],
        brand_id: [],
        subcategory_id: [],
        store_id: [],
        tag_id: GET.tag ? GET.tag.split(",") : [],
        amenity_id: GET.amenity ? GET.amenity.split(",") : [],
        price: [],
        name: GET.search || null,
        sort: (() => {
            if (GET.sortBy) {
                const sortValue = GET.sortBy;
                let validSortOption = sortOptions.find(
                    (option) => option.value === sortValue,
                );
                if (!validSortOption) {
                    validSortOption = sortOptions.find(
                        (option) =>
                            option.label.toLowerCase() ===
                            sortValue.toLowerCase(),
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
            return [
                {
                    selector: "final_price",
                    desc: true,
                },
            ];
        })(),
        is_master: data?.is_master !== false ? 1 : 0,
    });

    const convertSlugsToIds = async () => {
        try {
            const params = {};
            if (GET.category) params.category_slugs = GET.category;
            if (GET.brand) params.brand_slugs = GET.brand;
            if (GET.subcategory) params.subcategory_slugs = GET.subcategory;
            if (GET.collection) params.collection_slugs = GET.collection;
            if (GET.store) params.store_slugs = GET.store;

            if (Object.keys(params).length > 0) {
                const response = await itemsRest.convertSlugs(params);
                if (response.status === 200) {
                    const newFilters = {
                        ...selectedFilters,
                        category_id: Array.isArray(response.data.category_ids)
                            ? response.data.category_ids
                            : response.data.category_ids
                                ? [response.data.category_ids]
                                : [],
                        brand_id: Array.isArray(response.data.brand_ids) ? response.data.brand_ids : (response.data.brand_ids ? [response.data.brand_ids] : []),
                        subcategory_id: Array.isArray(response.data.subcategory_ids)
                            ? response.data.subcategory_ids
                            : response.data.subcategory_ids
                                ? [response.data.subcategory_ids]
                                : [],
                        collection_id: Array.isArray(response.data.collection_ids)
                            ? response.data.collection_ids
                            : response.data.collection_ids
                                ? [response.data.collection_ids]
                                : [],
                        store_id: Array.isArray(response.data.store_ids)
                            ? response.data.store_ids
                            : response.data.store_ids
                                ? [response.data.store_ids]
                                : [],
                    };
                    setSelectedFilters(newFilters);
                }
            }
        } catch (error) {
            console.error("❌ Error converting slugs to IDs:", error);
        }
    };

    const [filterSequence, setFilterSequence] = useState([]);
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

    const [validFilterCounts, setValidFilterCounts] = useState(null);

    const transformFilters = (filters) => {
        const transformedFilters = [];

        if (filters.sort && Array.isArray(filters.sort)) {
            const specialSortFields = ["featured", "offering", "is_new", "recommended"];
            filters.sort.forEach((sortItem) => {
                if (specialSortFields.includes(sortItem.selector)) {
                    transformedFilters.push([
                        sortItem.selector,
                        "=",
                        1,
                    ]);
                }
            });
        }

        if (filters.collection_id.length > 0) {
            const collectionConditions = filters.collection_id.map((slug) => [
                "collection.id",
                "=",
                collections.find((c) => c.slug === slug)?.id || slug,
            ]);
            const joined = ArrayJoin(collectionConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }

        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category.id",
                "=",
                id,
            ]);
            const joined = ArrayJoin(categoryConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }
        if (filters.is_master) {
            transformedFilters.push(["is_master", "=", 1]);
        }

        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory.id",
                "=",
                id,
            ]);
            const joined = ArrayJoin(subcategoryConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }

        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => ["brand.id", "=", id]);
            const joined = ArrayJoin(brandConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }

        if (filters.store_id.length > 0) {
            const storeConditions = filters.store_id.map((slug) => [
                "store.id",
                "=",
                stores.find((s) => s.slug === slug)?.id || slug,
            ]);
            const joined = ArrayJoin(storeConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }

        if (filters.tag_id && filters.tag_id.length > 0) {
            const tagConditions = filters.tag_id.map((tagId) => [
                "item_tag.tag_id",
                "=",
                tagId,
            ]);
            const joined = ArrayJoin(tagConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }

        if (filters.amenity_id && filters.amenity_id.length > 0) {
            const amenityConditions = filters.amenity_id.map((amenityId) => [
                "item_amenity.amenity_id",
                "=",
                amenityId,
            ]);
            const joined = ArrayJoin(amenityConditions, "or");
            transformedFilters.push(joined.length === 1 ? joined[0] : joined);
        }

        if (filters.price && filters.price.length > 0) {
            const priceConditions = filters.price.map((priceRange) => [
                ["final_price", ">=", Number(priceRange.min)],
                "and",
                ["final_price", "<=", Number(priceRange.max)],
            ]);
            if (priceConditions.length === 1) {
                transformedFilters.push(priceConditions[0]);
            } else {
                transformedFilters.push(ArrayJoin(priceConditions, "or"));
            }
        }

        if (filters.name) {
            const searchConditions = [
                ["name", "contains", filters.name],
                "or",
                ["summary", "contains", filters.name],
                "or",
                ["description", "contains", filters.name],
            ];
            transformedFilters.push(searchConditions);
        }

        return ArrayJoin(transformedFilters, "and");
    };

    const [intelligentSearchEnabled, setIntelligentSearchEnabled] = useState(true);
    const [lastIntelligentSearch, setLastIntelligentSearch] = useState(null);

    const detectIntelligentFilters = (query) => {
        if (!query || query.length < 2 || !intelligentSearchEnabled) return null;
        const lowerQuery = query.toLowerCase().trim();
        const matchedCategories = categories.filter((cat) => cat.name.toLowerCase().includes(lowerQuery));
        const matchedBrands = brands.filter((brand) => brand.name.toLowerCase().includes(lowerQuery));
        const matchedSubcategories = subcategories.filter((subcat) => subcat.name.toLowerCase().includes(lowerQuery));
        const matchedCollections = collections.filter((collection) => collection.name.toLowerCase().includes(lowerQuery));

        return {
            categories: matchedCategories,
            brands: matchedBrands,
            subcategories: matchedSubcategories,
            collections: matchedCollections,
            hasMatches:
                matchedCategories.length > 0 ||
                matchedBrands.length > 0 ||
                matchedSubcategories.length > 0 ||
                matchedCollections.length > 0,
        };
    };

    const handleIntelligentSearch = (query) => {
        if (!query || query.length < 2) return;
        const detected = detectIntelligentFilters(query);

        if (detected && detected.hasMatches && intelligentSearchEnabled) {
            setLastIntelligentSearch(query);
            setSelectedFilters((prev) => {
                const newFilters = { ...prev, name: query };
                if (detected.categories.length > 0) {
                    newFilters.category_id = [...new Set([...newFilters.category_id, ...detected.categories.map((c) => c.id)])];
                }
                if (detected.brands.length > 0) {
                    newFilters.brand_id = [...new Set([...newFilters.brand_id, ...detected.brands.map((b) => b.id)])];
                }
                if (detected.subcategories.length > 0) {
                    newFilters.subcategory_id = [...new Set([...newFilters.subcategory_id, ...detected.subcategories.map((s) => s.id)])];
                }
                if (detected.collections.length > 0) {
                    newFilters.collection_id = [...new Set([...newFilters.collection_id, ...detected.collections.map((col) => col.slug)])];
                }
                return newFilters;
            });
        } else {
            setSelectedFilters((prev) => ({ ...prev, name: query }));
            setLastIntelligentSearch(null);
        }
    };

    const toggleIntelligentSearch = () => {
        setIntelligentSearchEnabled(!intelligentSearchEnabled);
    };

    const [searchBrand, setSearchBrand] = useState("");
    const [searchSubcategory, setSearchSubcategory] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [searchCollection, setSearchCollection] = useState("");
    const [searchStore, setSearchStore] = useState("");
    const [searchAmenity, setSearchAmenity] = useState("");

    const [filtersOpen, setFiltersOpen] = useState(false);

    // Initialize state from filteredData prop - Matches MiBalon layout logic
    useEffect(() => {
        if (filteredData) {
            setCategories(filteredData.categories || []);
            setBrands(filteredData.brands || []);

            // Enrich subcategories with category links (supports M:M and fallback category_id)
            let allSubs = [];
            if (filteredData.categories) {
                const subMap = new Map();
                filteredData.categories.forEach(cat => {
                    if (cat.subcategories) {
                        cat.subcategories.forEach(sub => {
                            const existing = subMap.get(sub.id) || { ...sub, categories: [] };
                            if (!existing.categories.some(c => c.id === cat.id)) {
                                existing.categories.push(cat);
                            }
                            existing.category_id = cat.id;
                            subMap.set(sub.id, existing);
                        });
                    }
                });

                const rawSubs = filteredData.subcategories || [];
                rawSubs.forEach(sub => {
                    const existing = subMap.get(sub.id);
                    if (existing) {
                        subMap.set(sub.id, { ...sub, ...existing });
                    } else {
                        const categoriesForSub = [];
                        if (sub.category_id) {
                            const matchedCat = filteredData.categories.find(c => c.id === sub.category_id);
                            if (matchedCat) categoriesForSub.push(matchedCat);
                        }
                        subMap.set(sub.id, {
                            ...sub,
                            categories: categoriesForSub
                        });
                    }
                });
                allSubs = Array.from(subMap.values());
            } else {
                allSubs = filteredData.subcategories || [];
            }

            setSubcategories(allSubs);
            setCollections(filteredData.collections || []);
            setStores(filteredData.stores || []);
            setPriceRanges(filteredData.priceRanges || []);

            setTimeout(() => {
                convertSlugsToIds();
            }, 50);
        }

        if (!hasSearched) {
            setLoading(true);
        }
    }, [filteredData]);

    const handleFilterChange = (filterType, item) => {
        setSelectedFilters((prev) => {
            const currentFilterValues = prev[filterType] || [];
            let updatedValues;

            if (filterType === "price") {
                const index = currentFilterValues.findIndex(
                    (p) =>
                        Number(p.min) === Number(item.min) &&
                        Number(p.max) === Number(item.max),
                );
                if (index > -1) {
                    updatedValues = currentFilterValues.filter((_, i) => i !== index);
                } else {
                    updatedValues = [...currentFilterValues, item];
                }
            } else {
                const isSelected = currentFilterValues.includes(item);
                if (isSelected) {
                    updatedValues = currentFilterValues.filter((val) => val !== item);
                } else {
                    updatedValues = [...currentFilterValues, item];
                }
            }

            const newFilters = {
                ...prev,
                [filterType]: updatedValues,
            };

            setFilterSequence((prevSeq) => {
                const isAdding = updatedValues.length > currentFilterValues.length;
                if (isAdding) {
                    return [...prevSeq.filter((x) => x !== filterType), filterType];
                } else {
                    if (updatedValues.length === 0) {
                        return prevSeq.filter((x) => x !== filterType);
                    }
                    return prevSeq;
                }
            });

            return newFilters;
        });

        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    const fetchProducts = async (page = 1, isNewFilter = false) => {
        setShowNoResults(false);
        if (isNewFilter) {
            setIsFiltering(true);
        } else {
            setLoading(true);
        }

        try {
            const filters = transformFilters(selectedFilters);
            const itemsPerPage = 24;

            const specialSortFields = ["featured", "offering", "is_new", "recommended"];
            const filteredSort = selectedFilters.sort.filter(
                (sortItem) => !specialSortFields.includes(sortItem.selector)
            );
            const finalSort = filteredSort.length > 0 ? filteredSort : [{ selector: "final_price", desc: true }];

            const params = {
                filter: filters,
                sort: finalSort,
                skip: (page - 1) * itemsPerPage,
                take: itemsPerPage,
                requireTotalCount: true,
                filterSequence: filterSequence,
            };

            const response = await itemsRest.paginate(params);
            if (response.status !== 200) {
                throw new Error(`API returned status ${response.status}`);
            }

            setProducts(response.data || []);
            setHasSearched(true);

            if (!response.data || response.data.length === 0) {
                setTimeout(() => {
                    setShowNoResults(true);
                }, 300);
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

            // Update valid filter counts for dynamic cross-filtering
            setValidFilterCounts({
                categories: response?.summary?.categories || [],
                brands: response?.summary?.brands || [],
                subcategories: response?.summary?.subcategories || [],
                collections: response?.summary?.collections || [],
                stores: response?.summary?.stores || [],
                priceRanges: !data?.dat_prices ? (response?.summary?.priceRanges || []) : [],
                tags: response?.summary?.tags || [],
                amenities: response?.summary?.amenities || data?.amenities || []
            });

            if (!data?.dat_prices) {
                setPriceRanges(response?.summary?.priceRanges || []);
            }
        } catch (error) {
            console.error("❌ Error fetching products:", error);
            setTimeout(() => {
                setShowNoResults(true);
            }, 300);
        } finally {
            setLoading(false);
            setIsFiltering(false);
        }
    };

    // Trigger loading on filter changes
    useEffect(() => {
        fetchProducts(1, hasSearched);
    }, [selectedFilters]);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            fetchProducts(page, false);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const { currentPage, totalPages } = pagination;
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("...");
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }
            if (currentPage < totalPages - 2) pages.push("...");
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    const toggleSection = (sectionName) => {
        setSections((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    const handleSortChange = (sortValue) => {
        if (!sortValue) return;
        const [selector, order] = sortValue.split(":");
        setSelectedFilters((prev) => ({
            ...prev,
            sort: [
                {
                    selector: selector,
                    desc: order === "desc",
                },
            ],
        }));
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    // Cross-filtering selectors identical to MiBalon layout logic
    const getPriceRanges = () => {
        let customPrices = data?.dat_prices;
        if (typeof customPrices === "string") {
            try {
                customPrices = JSON.parse(customPrices);
            } catch (e) {
                console.error("Error parsing dat_prices:", e);
                customPrices = null;
            }
        }

        if (customPrices && Array.isArray(customPrices) && customPrices.length > 0) {
            return customPrices.map((r) => ({
                ...r,
                min: Number(r.min),
                max: Number(r.max),
                label: r.label || `${CurrencySymbol()} ${r.min} - ${r.max}`,
            }));
        }

        if (priceRanges && Array.isArray(priceRanges) && priceRanges.length > 0) {
            return priceRanges.map((r) => {
                const min = Number(r.min);
                const max = Number(r.max);
                return {
                    ...r,
                    min,
                    max,
                    label:
                        r.label ||
                        (max >= 999999
                            ? `Más de ${CurrencySymbol()} ${min.toLocaleString()}`
                            : `${CurrencySymbol()} ${min.toLocaleString()} - ${CurrencySymbol()} ${max.toLocaleString()}`),
                };
            });
        }

        return staticPriceRanges;
    };

    const activePriceRanges = getPriceRanges();

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.name.toLowerCase().includes(searchCategory.toLowerCase());
        if (!matchesSearch) return false;

        if (validFilterCounts && Array.isArray(validFilterCounts.categories)) {
            const hasItems = validFilterCounts.categories.some(c => c.id === category.id);
            return hasItems || selectedFilters.category_id?.includes(category.id);
        }
        return true;
    });

    const filteredSubcategories = subcategories.filter((subcategory) => {
        const matchesSearch = subcategory.name.toLowerCase().includes(searchSubcategory.toLowerCase());
        if (!matchesSearch) return false;

        if (selectedFilters.category_id && selectedFilters.category_id.length > 0) {
            if (subcategory.categories && Array.isArray(subcategory.categories)) {
                const belongs = subcategory.categories.some(c => selectedFilters.category_id.includes(c.id));
                if (belongs) return true;
            }
            if (subcategory.category_id && selectedFilters.category_id.includes(subcategory.category_id)) {
                return true;
            }
            if (selectedFilters.subcategory_id?.includes(subcategory.id)) return true;
            return false;
        }

        if (validFilterCounts && Array.isArray(validFilterCounts.subcategories)) {
            const hasItems = validFilterCounts.subcategories.some(s => s.id === subcategory.id);
            return hasItems || selectedFilters.subcategory_id?.includes(subcategory.id);
        }
        return true;
    });

    const filteredBrands = brands.filter((brand) => {
        const matchesSearch = brand.name.toLowerCase().includes(searchBrand.toLowerCase());
        if (!matchesSearch) return false;

        if (validFilterCounts && Array.isArray(validFilterCounts.brands)) {
            const hasItems = validFilterCounts.brands.some(b => b.id === brand.id);
            return hasItems || selectedFilters.brand_id?.includes(brand.id);
        }
        return true;
    });

    const filteredCollections = collections.filter((collection) => {
        const matchesSearch = collection.name.toLowerCase().includes(searchCollection.toLowerCase());
        if (!matchesSearch) return false;

        if (validFilterCounts && Array.isArray(validFilterCounts.collections)) {
            const hasItems = validFilterCounts.collections.some(c => c.id === collection.id);
            return hasItems || selectedFilters.collection_id?.includes(collection.id);
        }
        return true;
    });

    return (
        <section
            id={data?.element_id || null}
            className={`py-12 bg-primary min-h-screen text-white ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header layout */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        {data?.title && (
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-title uppercase  text-white mb-2">
                                {data.title}
                            </h2>
                        )}
                        {data?.description && (
                            <p className="text-white/50 text-sm font-mono uppercase tracking-widest">
                                {data.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div ref={sortRef} className="relative z-30">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center justify-between gap-3 bg-black border-2 border-white/10 py-3 px-4 text-xs font-mono uppercase tracking-wider text-white hover:border-white transition-colors duration-300 min-w-[220px]"
                            >
                                <span className="text-white/50">
                                    Ordenar:
                                </span>
                                <span className="font-bold">
                                    {sortOptions.find(opt => {
                                        const currentSort = selectedFilters.sort && selectedFilters.sort[0];
                                        return currentSort ? (opt.value === `${currentSort.selector}:${currentSort.desc ? "desc" : "asc"}`) : false;
                                    })?.label || "Mejores ofertas"}
                                </span>
                                <ChevronDown className={`h-4 w-4 text-white transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-1 border border-white/20 shadow-xl w-60 rounded-none bg-black text-white"
                                    >
                                        <ul className="py-1">
                                            {sortOptions.map((opt) => {
                                                const currentSort = selectedFilters.sort && selectedFilters.sort[0];
                                                const isSelected = currentSort ? (opt.value === `${currentSort.selector}:${currentSort.desc ? "desc" : "asc"}`) : false;
                                                return (
                                                    <li key={opt.value}>
                                                        <button
                                                            onClick={() => {
                                                                handleSortChange(opt.value);
                                                                setIsSortOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2.5 text-left text-[11px] font-mono uppercase tracking-wider transition-colors duration-200 hover:bg-white/10 ${isSelected ? "bg-white text-black font-bold" : "text-white"}`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            className="lg:hidden flex items-center gap-2 bg-white text-black py-3 px-5 font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                            onClick={() => setFiltersOpen(true)}
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filtros</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Barra lateral de filtros */}
                    <motion.div
                        className={`w-full lg:w-3/12 lg:block ${filtersOpen ? "fixed inset-0 z-50 bg-black/95 overflow-y-auto p-6" : "hidden"}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center justify-between lg:hidden mb-6">
                            <h3 className="text-xl  uppercase text-white">Filtros</h3>
                            <button
                                onClick={() => setFiltersOpen(false)}
                                className="p-2 border-2 border-white/20 hover:border-white text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className={brutalistStyles.filterContainer}>
                            <div className="space-y-4">

                                {/* Filtro por Colecciones */}
                                {data?.section_collections && (
                                    <div className={brutalistStyles.filterSection}>
                                        <button
                                            onClick={() => toggleSection("coleccion")}
                                            className={brutalistStyles.filterButton}
                                        >
                                            <span className=" uppercase text-white tracking-wider text-sm">Colecciones</span>
                                            <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${sections.coleccion ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {sections.coleccion && (
                                                <motion.div
                                                    className={brutalistStyles.filterContent}
                                                    {...filterAnimations.section}
                                                >
                                                    <div className="relative mb-3">
                                                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar colecciones..."
                                                            className={brutalistStyles.searchInput}
                                                            value={searchCollection}
                                                            onChange={(e) => setSearchCollection(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {filteredCollections.length > 0 ? (
                                                            filteredCollections.map((col, idx) => (
                                                                <label key={col.id || idx} className={brutalistStyles.label}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className={brutalistStyles.checkbox}
                                                                        onChange={() => handleFilterChange("collection_id", col.slug)}
                                                                        checked={selectedFilters.collection_id?.includes(col.slug)}
                                                                    />
                                                                    <span className="text-xs uppercase tracking-wider font-mono">{col.name}</span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-white/40 p-2 font-mono uppercase">Sin colecciones</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Filtro por Categorías */}
                                {data?.section_categories && (
                                    <div className={brutalistStyles.filterSection}>
                                        <button
                                            onClick={() => toggleSection("categoria")}
                                            className={brutalistStyles.filterButton}
                                        >
                                            <span className=" uppercase text-white tracking-wider text-sm">Categorías</span>
                                            <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${sections.categoria ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {sections.categoria && (
                                                <motion.div
                                                    className={brutalistStyles.filterContent}
                                                    {...filterAnimations.section}
                                                >
                                                    <div className="relative mb-3">
                                                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar categorías..."
                                                            className={brutalistStyles.searchInput}
                                                            value={searchCategory}
                                                            onChange={(e) => setSearchCategory(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {filteredCategories.length > 0 ? (
                                                            filteredCategories.map((cat, idx) => (
                                                                <label key={cat.id || idx} className={brutalistStyles.label}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className={brutalistStyles.checkbox}
                                                                        onChange={() => handleFilterChange("category_id", cat.id)}
                                                                        checked={selectedFilters.category_id?.includes(cat.id)}
                                                                    />
                                                                    <span className="text-xs uppercase tracking-wider font-mono">{cat.name}</span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-white/40 p-2 font-mono uppercase">Sin categorías</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Filtro por Marcas */}
                                {data?.section_brands && (
                                    <div className={brutalistStyles.filterSection}>
                                        <button
                                            onClick={() => toggleSection("marca")}
                                            className={brutalistStyles.filterButton}
                                        >
                                            <span className=" uppercase text-white tracking-wider text-sm">Marcas</span>
                                            <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${sections.marca ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {sections.marca && (
                                                <motion.div
                                                    className={brutalistStyles.filterContent}
                                                    {...filterAnimations.section}
                                                >
                                                    <div className="relative mb-3">
                                                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar marcas..."
                                                            className={brutalistStyles.searchInput}
                                                            value={searchBrand}
                                                            onChange={(e) => setSearchBrand(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {filteredBrands.length > 0 ? (
                                                            filteredBrands.map((brand, idx) => (
                                                                <label key={brand.id || idx} className={brutalistStyles.label}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className={brutalistStyles.checkbox}
                                                                        onChange={() => handleFilterChange("brand_id", brand.id)}
                                                                        checked={selectedFilters.brand_id?.includes(brand.id)}
                                                                    />
                                                                    <span className="text-xs uppercase tracking-wider font-mono">{brand.name}</span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-white/40 p-2 font-mono uppercase">Sin marcas</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Filtro por Subcategorías */}
                                {data?.section_subcategories && (
                                    <div className={brutalistStyles.filterSection}>
                                        <button
                                            onClick={() => toggleSection("subcategoria")}
                                            className={brutalistStyles.filterButton}
                                        >
                                            <span className=" uppercase text-white tracking-wider text-sm">Subcategorías</span>
                                            <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${sections.subcategoria ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {sections.subcategoria && (
                                                <motion.div
                                                    className={brutalistStyles.filterContent}
                                                    {...filterAnimations.section}
                                                >
                                                    <div className="relative mb-3">
                                                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-white/40" />
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar subcategorías..."
                                                            className={brutalistStyles.searchInput}
                                                            value={searchSubcategory}
                                                            onChange={(e) => setSearchSubcategory(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {filteredSubcategories.length > 0 ? (
                                                            filteredSubcategories.map((sub, idx) => (
                                                                <label key={sub.id || idx} className={brutalistStyles.label}>
                                                                    <input
                                                                        type="checkbox"
                                                                        className={brutalistStyles.checkbox}
                                                                        onChange={() => handleFilterChange("subcategory_id", sub.id)}
                                                                        checked={selectedFilters.subcategory_id?.includes(sub.id)}
                                                                    />
                                                                    <span className="text-xs uppercase tracking-wider font-mono">{sub.name}</span>
                                                                </label>
                                                            ))
                                                        ) : (
                                                            <div className="text-xs text-white/40 p-2 font-mono uppercase">Sin subcategorías</div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Filtro por Precios */}
                                {data?.section_prices && (
                                    <div className={brutalistStyles.filterSection}>
                                        <button
                                            onClick={() => toggleSection("precio")}
                                            className={brutalistStyles.filterButton}
                                        >
                                            <span className=" uppercase text-white tracking-wider text-sm">Precios</span>
                                            <ChevronDown className={`h-4 w-4 text-white transition-transform duration-200 ${sections.precio ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {sections.precio && (
                                                <motion.div
                                                    className={brutalistStyles.filterContent}
                                                    {...filterAnimations.section}
                                                >
                                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                                        {activePriceRanges.map((range, idx) => (
                                                            <label key={idx} className={brutalistStyles.label}>
                                                                <input
                                                                    type="checkbox"
                                                                    className={brutalistStyles.checkbox}
                                                                    onChange={() => handleFilterChange("price", range)}
                                                                    checked={selectedFilters.price?.some(
                                                                        (pr) => Number(pr.min) === Number(range.min) && Number(pr.max) === Number(range.max)
                                                                    )}
                                                                />
                                                                <span className="text-xs uppercase tracking-wider font-mono">{range.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        setSelectedFilters({
                                            collection_id: [],
                                            category_id: [],
                                            brand_id: [],
                                            subcategory_id: [],
                                            store_id: [],
                                            tag_id: [],
                                            amenity_id: [],
                                            price: [],
                                            name: null,
                                            sort: [{ selector: "final_price", desc: true }],
                                            is_master: data?.is_master !== false ? 1 : 0,
                                        });
                                        setFilterSequence([]);
                                    }}
                                    className="w-full bg-white text-black py-3.5 font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors block text-center mt-6 rounded-none"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Área de Productos */}
                    <div className="w-full lg:w-9/12">
                        <AnimatePresence mode="wait">
                            {loading || isFiltering ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {Array.from({ length: 9 }).map((_, idx) => (
                                        <SkeletonCard key={idx} delay={idx * 0.05} />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {products.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {products.map((product, idx) => (
                                                <motion.div
                                                    key={product.id || idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <CardProductTwenty
                                                        product={product}
                                                        data={data}
                                                        cart={cart}
                                                        setCart={setCart}
                                                        favorites={favorites}
                                                        setFavorites={setFavorites}
                                                        onClickTracking={onClickTracking}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 border-2 border-dashed border-white/10 p-10 bg-black">
                                            <CircleSlash2 className="w-16 h-16 mx-auto text-white/20 mb-4" />
                                            <h3 className="text-3xl uppercase text-white mb-2">
                                                No se encontraron productos
                                            </h3>
                                            <p className="text-white/50 text-sm font-mono mb-6">
                                                Intenta modificando los filtros seleccionados
                                            </p>
                                        </div>
                                    )}

                                    {/* Paginación */}
                                    {products.length > 0 && pagination.totalPages > 1 && (
                                        <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-6 border-t border-white/10 gap-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                    disabled={pagination.currentPage === 1}
                                                    className="w-10 h-10 flex items-center justify-center border-2 border-white/10 text-white hover:border-white disabled:opacity-30 disabled:hover:border-white/10 transition-colors"
                                                >
                                                    <ChevronLeft size={18} />
                                                </button>

                                                {getPageNumbers().map((page, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => page !== "..." && handlePageChange(page)}
                                                        disabled={page === "..."}
                                                        className={`w-10 h-10 font-mono text-xs ${page === pagination.currentPage ? "bg-white text-black font-bold" : "border-2 border-white/10 text-white hover:border-white"} transition-colors`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                                <button
                                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                    disabled={pagination.currentPage === pagination.totalPages}
                                                    className="w-10 h-10 flex items-center justify-center border-2 border-white/10 text-white hover:border-white disabled:opacity-30 disabled:hover:border-white/10 transition-colors"
                                                >
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>

                                            <div className="text-white/50 text-xs font-mono uppercase tracking-widest">
                                                Mostrando {pagination.from} - {pagination.to} de {pagination.totalItems} productos
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CatalogoFiltrosTwenty;
