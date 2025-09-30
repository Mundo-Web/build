import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
    User,
    Settings,
    CreditCard,
    Home,
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";
import ProfileImage from "./Components/ProfileImage";
import { motion, AnimatePresence } from "framer-motion";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import MobileMenuKatya from "./Components/MobileMenuKatya";

const HeaderSearchKatya = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {
    const phoneWhatsappObj = generals.find(
        (item) => item.correlative === "phone_whatsapp"
    );
    const messageWhatsappObj = generals.find(
        (item) => item.correlative === "message_whatsapp"
    );

    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;

    const [modalOpen, setModalOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [searchMobile, setSearchMobile] = useState(false);
    const [search, setSearch] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFixed, setIsFixed] = useState(false);

    // Estados para búsqueda predictiva
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const suggestionItemsRef = useRef([]); // Ref para elementos de sugerencia

    // Estados para dropdown de categorías
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({ slug: "", name: "Categorías" });

    const menuRef = useRef(null);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const mobileSearchInputRef = useRef(null);
    const desktopSearchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // refs para scroll automático en sugerencias
    const suggestionRefs = useRef([]);

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

    const [searchView, setSearchView] = useState(false);
    // Función para verificar si estamos en rutas donde no queremos mostrar la búsqueda móvil
    // Usando window.location directamente para máxima compatibilidad
    const shouldHideMobileSearch = () => {
        try {
            const currentPath = window.location.pathname || '';
            const hiddenRoutes = ['/cart', '/checkout'];
            return hiddenRoutes.some(route => currentPath.includes(route));
        } catch (error) {
            // En caso de error, mostrar la búsqueda móvil por defecto
            console.warn('Error checking path:', error);
            return false;
        }
    };

    // Función para obtener sugerencias de búsqueda
    const fetchSearchSuggestions = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsLoadingSuggestions(true);

        try {
            // Construir filtros dinámicamente
            let filters = [
                ['name', 'contains', query],
                'or',
                ['summary', 'contains', query],
                'or',
                ['description', 'contains', query]
            ];

            // Si hay una categoría seleccionada, hacer dos búsquedas:
            // 1. Primero buscar en la categoría específica
            // 2. Si no hay resultados, buscar en todas las categorías
            let searchResults = [];

            if (selectedCategory.slug) {
                const category = items?.find(cat => cat.slug === selectedCategory.slug);
                if (category) {
                    // Primera búsqueda: con filtro de categoría
                    const categoryFilters = [
                        ...filters,
                        'and',
                        ['category_id', '=', category.id]
                    ];

                    const categoryResponse = await fetch('/api/items/paginate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: JSON.stringify({
                            take: 8,
                            skip: 0,
                            filter: categoryFilters,
                            sort: [{ selector: 'name', desc: false }],
                            requireTotalCount: false,
                            with: 'category,brand'
                        })
                    });

                    if (categoryResponse.ok) {
                        const categoryData = await categoryResponse.json();
                        if (categoryData.status === 200 && Array.isArray(categoryData.data)) {
                            searchResults = categoryData.data;
                        }
                    }
                }

                // Si no encontramos resultados en la categoría específica, buscar en todas
                if (searchResults.length === 0) {
                    const generalResponse = await fetch('/api/items/paginate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: JSON.stringify({
                            take: 8,
                            skip: 0,
                            filter: filters, // Sin filtro de categoría
                            sort: [{ selector: 'name', desc: false }],
                            requireTotalCount: false,
                            with: 'category,brand'
                        })
                    });

                    if (generalResponse.ok) {
                        const generalData = await generalResponse.json();
                        if (generalData.status === 200 && Array.isArray(generalData.data)) {
                            searchResults = generalData.data;
                        }
                    }
                }
            } else {
                // Sin categoría seleccionada, buscar en todo
                const response = await fetch('/api/items/paginate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        take: 8,
                        skip: 0,
                        filter: filters,
                        sort: [{ selector: 'name', desc: false }],
                        requireTotalCount: false,
                        with: 'category,brand'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 200 && Array.isArray(data.data)) {
                        searchResults = data.data;
                    }
                }
            }

            setSearchSuggestions(searchResults);
            setShowSuggestions(searchResults.length > 0);

        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            setSearchSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    // Función para manejar cambios en el input de búsqueda
    const handleSearchChange = (value) => {
        setSearch(value);
        setSelectedSuggestionIndex(-1);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchSearchSuggestions(value);
        }, 300);
    };

    // Función para limpiar sugerencias
    const clearSuggestions = () => {
        setShowSuggestions(false);
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(-1);
    };

    // Función para seleccionar una sugerencia
    const selectSuggestion = (suggestion) => {
        if (!suggestion) return;

        setShowSuggestions(false);
        setSearchMobile(false);

        // Navegar a la página del producto
        const url = suggestion.slug
            ? `/product/${suggestion.slug}`
            : `/catalogo?search=${encodeURIComponent(suggestion.name)}`;

        window.location.href = url;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Manejo de clics fuera para cerrar menús y sugerencias
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }

            // Manejo para dropdown de categorías
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }

            // Manejo para búsqueda
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                const isSuggestionButton = event.target.closest('[data-suggestion-button]');
                if (!isSuggestionButton) {
                    clearSuggestions();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside); // Para dispositivos táctiles
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [search]); // Agregar search como dependencia

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // useEffect para manejar el escape en la búsqueda móvil
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                if (showSuggestions) {
                    clearSuggestions();
                } else if (searchMobile) {
                    setSearchMobile(false);
                    setSearch("");
                }
            }
        };

        if (searchMobile || showSuggestions) {
            document.addEventListener("keydown", handleKeyPress);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [searchMobile, showSuggestions]);

    // Cleanup timeout en unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Efecto para scroll automático al seleccionar sugerencias
    useEffect(() => {
        if (
            selectedSuggestionIndex >= 0 &&
            suggestionRefs.current[selectedSuggestionIndex] &&
            suggestionsRef.current
        ) {
            // Usar scrollIntoView para asegurar que la sugerencia seleccionada esté visible
            suggestionRefs.current[selectedSuggestionIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [selectedSuggestionIndex]);

    // Efecto para actualizar sugerencias cuando cambia la categoría seleccionada
    useEffect(() => {
        // Si hay una búsqueda activa y se cambia la categoría, actualizar las sugerencias
        if (search.trim().length >= 2 && showSuggestions) {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                fetchSearchSuggestions(search);
            }, 100); // Delay más corto para cambios de categoría
        }
    }, [selectedCategory.slug]); // Dependencia en el slug de la categoría

    const menuVariants = {
        hidden: {
            opacity: 0,
            y: -10,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15
            }
        }
    };

    const menuItems = [
        {
            icon: <User size={16} />,
            label: "Mi Perfil",
            href: "/profile"
        },
        {
            icon: <ShoppingCart size={16} />,
            label: "Mis Pedidos",
            href: "/customer/dashboard"
        },
        {
            icon: <Settings size={16} />,
            label: "Configuración",
            href: "/account"
        },
        {
            icon: <DoorClosed size={16} />,
            label: "Cerrar Sesión",
            onClick: Logout
        }
    ];

    // Función para manejar el submit del form (mejorada)
    const handleFormSubmit = (event) => {
        event.preventDefault();
        clearSuggestions();

        const formData = new FormData(event.target);
        const searchTerm = formData.get('search')?.trim() || search.trim();
        const categorySlug = selectedCategory.slug;

        if (searchTerm || categorySlug) {
            let url = '/catalogo?';
            const params = new URLSearchParams();

            if (searchTerm) {
                params.append('search', searchTerm);
            }
            if (categorySlug) {
                params.append('category', categorySlug);
            }

            window.location.href = `/catalogo?${params.toString()}`;
        }
        return false; // Prevenir comportamiento por defecto adicional
    };

    // Función específica para el input móvil
    const handleMobileSearch = (event) => {
        event.preventDefault();
        clearSuggestions();
        if (search.trim()) {
            const trimmedSearch = search.trim();
            setSearchMobile(false); // Cerrar el input móvil
            window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
        }
        return false;
    };

    // --- SUGERENCIAS Y SCROLL INTELIGENTE ---
    function scrollToSuggestion(index) {
        const container = suggestionsRef.current;
        const el = suggestionItemsRef.current[index];
        if (!container || !el) return;
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        if (elRect.top < containerRect.top) {
            // Scroll up
            container.scrollTop -= (containerRect.top - elRect.top);
        } else if (elRect.bottom > containerRect.bottom) {
            // Scroll down
            container.scrollTop += (elRect.bottom - containerRect.bottom);
        }
    }

    // --- HANDLER DE TECLADO ---
    const handleKeyDown = (e) => {
        if (!showSuggestions || searchSuggestions.length === 0) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => {
                    const next = prev < searchSuggestions.length - 1 ? prev + 1 : prev;
                    setTimeout(() => scrollToSuggestion(next), 0);
                    return next;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => {
                    const next = prev > 0 ? prev - 1 : 0;
                    setTimeout(() => scrollToSuggestion(next), 0);
                    return next;
                });
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
                    selectSuggestion(searchSuggestions[selectedSuggestionIndex]);
                } else if (search.trim()) {
                    handleFormSubmit(e);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    // --- SUGERENCIAS DE BÚSQUEDA ---
    const SearchSuggestions = ({ suggestions, isLoading, onSelect, selectedIndex }) => {
        if (!showSuggestions) return null;

        // Verificar si las sugerencias incluyen productos de la categoría seleccionada
        const categoryId = selectedCategory.slug ? items?.find(cat => cat.slug === selectedCategory.slug)?.id : null;
        const hasMatchingCategory = suggestions.some(s => s.category_id === categoryId);
        const hasOtherCategories = suggestions.some(s => s.category_id !== categoryId);

        return (
            <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] max-h-80 overflow-y-auto mt-1"
            >
                {isLoading ? (
                    <div className="p-4 text-center customtext-neutral-dark">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            Buscando...
                        </div>
                    </div>
                ) : suggestions.length > 0 ? (
                    <div>
                        {/* Mostrar aviso si hay resultados de otras categorías cuando se tiene una seleccionada */}
                        {selectedCategory.slug && hasOtherCategories && !hasMatchingCategory && (
                            <div className="px-4 py-3 bg-primary border-b customtext-neutral-light">
                                <p className="text-xs customtext-neutral-dark">
                                    <span className="font-medium">No se encontraron productos en "{selectedCategory.name}"</span>
                                    <br />
                                    Mostrando resultados de otras categorías
                                </p>
                            </div>
                        )}

                        <ul className="py-2">
                            {suggestions.map((suggestion, index) => {
                                const isFromSelectedCategory = categoryId && suggestion.category_id === categoryId;

                                return (
                                    <li
                                        key={suggestion.id}
                                        ref={el => suggestionItemsRef.current[index] = el}
                                    >
                                        <button
                                            data-suggestion-button
                                            onMouseDown={e => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setTimeout(() => onSelect(suggestion), 0);
                                            }}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${index === selectedIndex ? 'bg-primary/10 border-l-4 border-primary' : ''
                                                } ${isFromSelectedCategory ? 'bg-green-50' : ''}`}
                                            type="button"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                {suggestion.image ? (
                                                    <img
                                                        src={`/api/items/media/${suggestion.image}`}
                                                        alt={suggestion.name}
                                                        className="w-full h-full object-cover"
                                                        onError={e => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={suggestion?.image ? `/api/items/media/${suggestion.image}` : '/assets/img/noimage/no_img.jpg'}
                                                        alt={suggestion?.name || 'Producto'}
                                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => {
                                                            e.target.src = '/assets/img/noimage/no_img.jpg';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium customtext-neutral-dark truncate flex items-center gap-2">
                                                    {suggestion.name}

                                                </div>
                                                {suggestion.category && (
                                                    <div className="text-sm customtext-neutral-dark truncate">
                                                        {suggestion.category.name}
                                                    </div>
                                                )}
                                                {suggestion.final_price && (
                                                    <div className="text-sm font-semibold customtext-primary">
                                                        {CurrencySymbol()} {parseFloat(suggestion.final_price).toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="p-4 text-center customtext-neutral-dark">
                        {selectedCategory.slug ? (
                            <div>
                                <p className="font-medium">No se encontraron productos en "{selectedCategory.name}"</p>
                                <p className="text-sm customtext-neutral-dark mt-1">Intenta buscar en "Todas las categorías"</p>
                            </div>
                        ) : (
                            "No se encontraron productos"
                        )}
                    </div>
                )}
            </motion.div>
        );
    };

    // --- DROPDOWN PERSONALIZADO DE CATEGORÍAS ---
    const CategoryDropdown = () => {
        const sortedCategories = items && items.length > 0
            ? [...items].sort((a, b) => a.name.localeCompare(b.name))
            : [];

        return (
            <div ref={dropdownRef} className="absolute right-0 flex-shrink-0">
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between min-w-[150px] max-w-[150px] text-sm py-3.5 px-4 font-semibold focus:ring-0 customtext-neutral-dark bg-secondary focus:outline-none border-0  text-white rounded-full hover:bg-primary hover:customtext-neutral-dark transition-colors duration-500"
                    aria-label="Seleccionar categoría"
                    aria-expanded={isDropdownOpen}
                >
                    <span className="truncate">{selectedCategory.name}</span>
                    <svg
                        className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] min-w-[220px] max-h-80 overflow-y-auto"
                        >
                            <div className="py-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory({ slug: "", name: "Categorías" });
                                        setIsDropdownOpen(false);

                                        // Si hay una búsqueda activa, actualizar inmediatamente las sugerencias
                                        if (search.trim().length >= 2) {
                                            setTimeout(() => {
                                                fetchSearchSuggestions(search);
                                            }, 150);
                                        }
                                    }}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${selectedCategory.slug === "" ? 'bg-primary/10 text-primary font-medium' : 'customtext-neutral-dark'
                                        }`}
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <span className="truncate">Categorías</span>
                                    {selectedCategory.slug === "" && (
                                        <div className="ml-auto">
                                            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>

                                {sortedCategories.map((category) => (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory({ slug: category.slug, name: category.name });
                                            setIsDropdownOpen(false);

                                            // Si hay una búsqueda activa, actualizar inmediatamente las sugerencias
                                            if (search.trim().length >= 2) {
                                                setTimeout(() => {
                                                    fetchSearchSuggestions(search);
                                                }, 150);
                                            }
                                        }}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${selectedCategory.slug === category.slug ? 'bg-primary/10 text-primary font-medium' : 'customtext-neutral-dark'
                                            }`}
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-secondary p-2 rounded-full overflow-hidden">
                                            {category.image ? (
                                                <img
                                                    src={`/api/categories/media/${category.image}`}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                    onError={e => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerHTML = `
                                                            <div class="w-full h-full flex items-center justify-center customtext-neutral-dark">
                                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                                                </svg>
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center customtext-neutral-dark">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="truncate">{category.name}</span>
                                        {selectedCategory.slug === category.slug && (
                                            <div className="ml-auto">
                                                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };
    // Determinar si el usuario es cliente (no admin ni superadmin, usando roles array)
    let isCustomer = false;
    if (isUser && Array.isArray(isUser.roles)) {
        const roleNames = isUser.roles.map(r => r.name?.toLowerCase());
        isCustomer = !roleNames.includes('admin') && !roleNames.includes('root');
    }
    return (
        <header className={`w-full top-0 left-0 z-50 transition-all duration-300 ${isFixed ? "fixed bg-primary shadow-lg" : "relative bg-primary"}`}>
            <div className="px-primary  bg-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-4 font-font-secondary text-base font-semibold">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 z-[51]">
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className={`min-h-10 max-h-10 lg:max-h-max lg:h-14 object-contain object-center ${data?.class_logo || ""}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </a>

                    {data?.showLoginCart && (
                        <div className="flex gap-3 justify-end lg:hidden">
                            <div className="flex items-center">
                             <button onClick={() => setSearchView(!searchView)} >
                                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17 17L21 21" stroke="#0E1818" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z" stroke="#0E1818" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                             </button>

                            </div>
                            <div className={`${searchMobile ? "hidden" : "flex"} items-center gap-4`}>
                                {isUser ? (
                                    <div ref={menuRef} className="relative">
                                        <button
                                            aria-label="user"
                                            className="flex items-center customtext-neutral-dark gap-2 hover:customtext-primary transition-all duration-300 relative group"
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        >
                                            <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                                {isUser.uuid ? (
                                                    <div className="relative">
                                                         <ProfileImage
                                                        uuid={isUser.uuid}
                                                        name={isUser.name}
                                                        lastname={isUser.lastname}
                                                        classCircleUser={"customtext-neutral-dark stroke-[1.5] border-neutral-dark "}
                                                        className="w-6 h-6 rounded-full object-cover   border-2 border-secondary ring-secondary transition-all duration-300"
                                                    />
                                                        <div className="relative" style={{ display: 'none' }}>
                                                            <CircleUser
                                                                className="customtext-neutral-dark  border-neutral-dark rounded-full   ring-neutral-dark transition-all duration-300"
                                                                width="1.5rem"
                                                            />
                                                        </div>
                                                        {/* Punto indicador online animado */}
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-white rounded-full animate-pulse">
                                                            <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75 absolute"></div>
                                                            <div className="w-full h-full bg-primary rounded-full"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <CircleUser
                                                            className="customtext-neutral-dark border-2 border-neutral-dark rounded-full  ring-neutral-dark  transition-all duration-300"
                                                            width="1.5rem"
                                                        />
                                                        {/* Punto indicador online animado */}
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-primary border-2 border-white rounded-full animate-pulse">
                                                            <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75 absolute"></div>
                                                            <div className="w-full h-full bg-primary rounded-full"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isMenuOpen && (
                                                <motion.div
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={menuVariants}
                                                    className="absolute z-50 top-full -left-20 bg-white shadow-xl border-t rounded-xl w-48 mt-2"
                                                >
                                                    <div className="p-4">
                                                        <ul className="space-y-3">
                                                            {isCustomer ? (
                                                                menuItems.map((item, index) => (
                                                                    <li key={index}>
                                                                        {item.onClick ? (
                                                                            <button
                                                                                aria-label="menu-items"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    setIsMenuOpen(false);
                                                                                    // Pequeño delay para que la animación se complete
                                                                                    setTimeout(() => {
                                                                                        item.onClick();
                                                                                    }, 150);
                                                                                }}
                                                                                className="flex w-full items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                            >
                                                                                {item.icon}
                                                                                <span>{item.label}</span>
                                                                            </button>
                                                                        ) : (
                                                                            <a
                                                                                href={item.href}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setIsMenuOpen(false);
                                                                                }}
                                                                                className="flex items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                            >
                                                                                {item.icon}
                                                                                <span>{item.label}</span>
                                                                            </a>
                                                                        )}
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <>
                                                                    <li>
                                                                        <a
                                                                            href="/admin/home"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setIsMenuOpen(false);
                                                                            }}
                                                                            className="flex items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                        >
                                                                            <Home size={16} />
                                                                            <span>Dashboard</span>
                                                                        </a>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                setIsMenuOpen(false);
                                                                                // Pequeño delay para que la animación se complete
                                                                                setTimeout(() => {
                                                                                    Logout();
                                                                                }, 150);
                                                                            }}
                                                                            className="flex w-full items-center gap-3 customtext-neutral-dark text-sm hover:customtext-primary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                        >
                                                                            <DoorClosed size={16} />
                                                                            <span>Cerrar Sesión</span>
                                                                        </button>
                                                                    </li>
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <a href="/iniciar-sesion" className="flex items-center customtext-neutral-dark hover:customtext-primary transition-all duration-300">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z" stroke="#0E1818" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M19 20.5C19 16.634 15.866 13.5 12 13.5C8.13401 13.5 5 16.634 5 20.5" stroke="#0E1818" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                    </a>
                                )}



                            </div>
                            <button
                                aria-label="cart"
                                onClick={() => setModalOpen(true)}
                                className="flex min-w-max items-center gap-2 font-medium text-sm relative hover:customtext-secondary transition-colors duration-300"
                            >

                                <div className=" text-sm leading-4 text-end inline">
                                    <span className="block" >Carrito</span>

                                    <strong>{`S/ ${Number2Currency(totalCount)}`}</strong>
                                </div>
                                <div >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M6 6H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M6 22C7.10457 22 8 21.1046 8 20C8 18.8954 7.10457 18 6 18C4.89543 18 4 18.8954 4 20C4 21.1046 4.89543 22 6 22Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M17 22C18.1046 22 19 21.1046 19 20C19 18.8954 18.1046 18 17 18C15.8954 18 15 18.8954 15 20C15 21.1046 15.8954 22 17 22Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M8 20H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>

                                </div>
                                <span className="absolute bg-secondary -right-2 -top-3 inline-flex items-center justify-center w-5 h-5 text-xs  text-white rounded-md">
                                    {totalCount}
                                </span>
                            </button>
                            <button
                                aria-label="Menú"
                                onClick={() => setOpenMenu(!openMenu)}

                                className="flex md:hidden items-center justify-center bg-primary rounded-lg w-auto h-auto  customtext-neutral-dark fill-neutral-dark transition-all duration-300 "
                            >
                                {!openMenu ? (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 5H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4 19H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                ) : (
                                    <XIcon />
                                )}
                            </button>
                        </div>
                    )}

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block relative w-full max-w-sm " ref={searchRef}>
                        <form onSubmit={handleFormSubmit} role="search" className="flex items-center gap-0 bg-white rounded-full border ">
                            {/* Botón de búsqueda */}
                            <button
                                type="submit"
                                className={`pl-3  customtext-neutral-dark rounded-full  hover:scale-105 transition-all duration-300 flex-shrink-0`}
                                aria-label="Buscar"
                            >
                                <Search size={20} />
                            </button>

                            {/* Input de búsqueda */}
                            <input
                                ref={desktopSearchInputRef}
                                type="search"
                                name="search"
                                placeholder="Buscar"
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => {
                                    if (search.trim().length >= 2) {
                                        fetchSearchSuggestions(search);
                                    }
                                }}
                                className="flex-1 py-3 pl-2 pr-4 font-medium text-sm focus:ring-0 customtext-neutral-dark placeholder:text-gray-500 focus:outline-none bg-transparent border-0"
                                enterKeyHint="search"
                                inputMode="search"
                                autoComplete="on"
                                role="searchbox"
                                aria-label="Estoy buscando..."
                            />

                            {/* Dropdown personalizado de categorías */}
                            <CategoryDropdown />
                        </form>

                        <AnimatePresence>
                            <SearchSuggestions
                                suggestions={searchSuggestions}
                                isLoading={isLoadingSuggestions}
                                onSelect={selectSuggestion}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Account and Cart */}
                    {data?.showLoginCart ? (
                        <div className="hidden md:flex items-center  gap-8 relative text-sm">
                            <p className={`cursor-pointer leading-4 text-sm customtext-neutral-dark whitespace-pre-line hover:customtext-secondary font-medium  transition-all duration-500 `}>
                                {(() => {
                                    const text = generals.find((contact) => contact.correlative === "opening_hours")?.description || "";
                                    const [first, ...rest] = text.split('\n');
                                    return (
                                        <>
                                            <strong>{first}</strong>
                                            {rest.length > 0 ? <><br />{rest.join('\n')}</> : null}
                                        </>
                                    );
                                })()}
                            </p>
                            <p className={`cursor-pointer leading-4  text-end text-sm customtext-neutral-dark font-medium whitespace-pre-line hover:customtext-secondary transition-all duration-500`}>
                                <span>Soporte 24/7</span><br />
                                <strong>  {generals.find((contact) => contact.correlative === "support_phone")
                                    ?.description || ""}
                                </strong>
                            </p>

                            <div ref={menuRef}>
                                {isUser ? (
                                    <button
                                        aria-label="user"
                                        className="customtext-neutral-dark flex items-center gap-2 hover:customtext-secondary pr-6 transition-all duration-300 relative group"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        <span className="hidden md:inline">{isUser.name}</span>

                                        <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                            {isUser.uuid ? (
                                                <div className="relative">
                                                    <ProfileImage
                                                        uuid={isUser.uuid}
                                                        name={isUser.name}
                                                        lastname={isUser.lastname}
                                                        classCircleUser={"customtext-neutral-dark stroke-[1.5] border-neutral-dark "}
                                                        className="w-8 h-8 rounded-full object-cover   border-2 border-secondary ring-secondary transition-all duration-300"
                                                    />
                                                    {/* Punto indicador online animado */}
                                                    <div className="absolute -bottom-[-0.115rem] -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-pulse">
                                                        <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75 absolute"></div>
                                                        <div className="w-full h-full bg-primary rounded-full"></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <CircleUser
                                                        className="customtext-primary border-2 border-primary rounded-full  ring-secondary group-hover:ring-green-300 transition-all duration-300"
                                                    />
                                                    {/* Punto indicador online animado */}
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-pulse">
                                                        <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75 absolute"></div>
                                                        <div className="w-full h-full bg-primary rounded-full"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ) : (
                                    <a href="/iniciar-sesion" className="flex customtext-neutral-dark font-medium leading-4 items-center gap-2 text-sm hover:customtext-secondary transition-colors duration-300">
                                        <span className="hidden md:inline">Iniciar <br /> <strong>Sesión</strong></span>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 8.5C17 5.73858 14.7614 3.5 12 3.5C9.23858 3.5 7 5.73858 7 8.5C7 11.2614 9.23858 13.5 12 13.5C14.7614 13.5 17 11.2614 17 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M19 20.5C19 16.634 15.866 13.5 12 13.5C8.13401 13.5 5 16.634 5 20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                    </a>
                                )}

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={menuVariants}
                                            className="absolute z-50 top-full right-10 bg-white shadow-xl border-t rounded-xl w-48 mt-2"
                                        >
                                            <div className="p-4">
                                                <ul className="space-y-4">
                                                    {isCustomer ? (
                                                        menuItems.map((item, index) => (
                                                            <li key={index}>
                                                                {item.onClick ? (
                                                                    <button
                                                                        aria-label="menu-items"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setIsMenuOpen(false);
                                                                            // Pequeño delay para que la animación se complete
                                                                            setTimeout(() => {
                                                                                item.onClick();
                                                                            }, 150);
                                                                        }}
                                                                        className="flex w-full items-center gap-3 customtext-neutral-dark text-sm hover:customtext-secondary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                    >
                                                                        {item.icon}
                                                                        <span>{item.label}</span>
                                                                    </button>
                                                                ) : (
                                                                    <a
                                                                        href={item.href}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setIsMenuOpen(false);
                                                                        }}
                                                                        className="flex items-center gap-3 customtext-neutral-dark text-sm hover:customtext-secondary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                    >
                                                                        {item.icon}
                                                                        <span>{item.label}</span>
                                                                    </a>
                                                                )}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <>
                                                            <li>
                                                                <a
                                                                    href="/admin/home"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setIsMenuOpen(false);
                                                                    }}
                                                                    className="flex items-center gap-3 customtext-neutral-dark text-sm hover:customtext-secondary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                >
                                                                    <Home size={16} />
                                                                    <span>Dashboard</span>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        setIsMenuOpen(false);
                                                                        // Pequeño delay para que la animación se complete
                                                                        setTimeout(() => {
                                                                            Logout();
                                                                        }, 150);
                                                                    }}
                                                                    className="flex w-full items-center gap-3 customtext-neutral-dark text-sm hover:customtext-secondary hover:bg-gray-50 transition-all duration-300 p-2 rounded-lg"
                                                                >
                                                                    <DoorClosed size={16} />
                                                                    <span>Cerrar Sesión</span>
                                                                </button>
                                                            </li>
                                                        </>
                                                    )}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                aria-label="cart"
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 font-medium text-sm relative hover:customtext-secondary transition-colors duration-300"
                            >

                                <div className="hidden text-sm leading-4 text-end md:inline">
                                    <span className="block" >Mi Carrito</span>

                                    <strong>{`S/ ${Number2Currency(totalCount)}`}</strong>
                                </div>
                                <div >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 16L16.7201 15.2733C19.4486 15.046 20.0611 14.45 20.3635 11.7289L21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M6 6H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M6 22C7.10457 22 8 21.1046 8 20C8 18.8954 7.10457 18 6 18C4.89543 18 4 18.8954 4 20C4 21.1046 4.89543 22 6 22Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M17 22C18.1046 22 19 21.1046 19 20C19 18.8954 18.1046 18 17 18C15.8954 18 15 18.8954 15 20C15 21.1046 15.8954 22 17 22Z" stroke="currentColor" stroke-width="1.5" />
                                        <path d="M8 20H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                        <path d="M2 2H2.966C3.91068 2 4.73414 2.62459 4.96326 3.51493L7.93852 15.0765C8.08887 15.6608 7.9602 16.2797 7.58824 16.7616L6.63213 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    </svg>

                                </div>
                                <span className="absolute bg-secondary -right-5 -top-2 inline-flex items-center justify-center w-5 h-5 text-xs  text-white rounded-lg">
                                    {totalCount}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Desktop: botón "Haz tu Pedido" */}
                            <p className={`cursor-pointer text-sm customtext-neutral-dark whitespace-pre-line hover:customtext-secondary font-normal  transition-all duration-500 `}>
                                {(() => {
                                    const text = generals.find((contact) => contact.correlative === "opening_hours")?.description || "";
                                    const [first, ...rest] = text.split('\n');
                                    return (
                                        <>
                                            <strong>{first}</strong>
                                            {rest.length > 0 ? <><br />{rest.join('\n')}</> : null}
                                        </>
                                    );
                                })()}
                            </p>
                            <p className={`cursor-pointer text-sm customtext-neutral-dark font-normal whitespace-pre-line hover:customtext-secondary transition-all duration-500`}>
                                <span>Soporte 24/7</span><br />
                                <strong>  {generals.find((contact) => contact.correlative === "support_phone")
                                    ?.description || ""}
                                </strong>
                            </p>
                            <a
                                aria-label="primary-button"
                                className={`${data.class ? data.class : 'bg-secondary'} hidden lg:block px-6 py-2.5 text-white font-medium rounded-3xl hover:brightness-125 transition-colors duration-300`}
                                target="_blank"
                                rel="noopener noreferrer"
                                href={
                                    phoneWhatsapp && messageWhatsapp
                                        ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(phoneWhatsapp)}&text=${encodeURIComponent(messageWhatsapp)}`
                                        : "#"
                                }
                            >
                                Haz tu pedido
                            </a>
                            {/* Mobile: búsqueda expandible */}
                            <div className="md:hidden relative w-full max-w-xl mx-auto">
                                {!searchMobile ? (
                                    <button
                                        aria-label="Buscar productos"
                                        onClick={() => {
                                            setSearchMobile(true);
                                            // Pequeño delay para asegurar que el input se renderice antes del focus
                                            setTimeout(() => {
                                                if (mobileSearchInputRef.current) {
                                                    mobileSearchInputRef.current.focus();
                                                }
                                            }, 100);
                                        }}
                                        className="flex items-center justify-end w-full px-0 py-3"
                                    >
                                        <Search className="customtext-primary" size={28} />
                                    </button>
                                ) : (
                                    <div className="relative w-full">
                                        <form onSubmit={handleMobileSearch} role="search">
                                            <input
                                                ref={mobileSearchInputRef}
                                                type="search"
                                                name="search"
                                                placeholder="Buscar productos"
                                                value={search}
                                                onChange={(e) => handleSearchChange(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                onFocus={() => {
                                                    if (search.trim().length >= 2) {
                                                        fetchSearchSuggestions(search);
                                                    }
                                                }}
                                                className="w-full pr-14 py-4 pl-4 border rounded-full focus:ring-0 focus:outline-none"
                                                autoFocus
                                                enterKeyHint="search"
                                                inputMode="search"
                                                autoComplete="off"
                                                role="searchbox"
                                                aria-label="Buscar productos"
                                                onBlur={() => {
                                                    // Solo cerrar si no hay búsqueda activa y no hay sugerencias
                                                    setTimeout(() => {
                                                        if (!search.trim() && !showSuggestions) {
                                                            setSearchMobile(false);
                                                        }
                                                    }, 200);
                                                }}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSearch("");
                                                        clearSuggestions();
                                                        setSearchMobile(false);
                                                    }}
                                                    className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                                                    aria-label="Cerrar búsqueda"
                                                >
                                                    <XIcon size={16} />
                                                </button>
                                                <button
                                                    type="submit"
                                                    className={`p-2 ${data?.backgroundColor || "bg-primary"} text-white rounded-lg hover:bg-primary transition-colors`}
                                                    aria-label="Buscar"
                                                >
                                                    <Search size={16} />
                                                </button>
                                            </div>
                                        </form>

                                        <AnimatePresence>
                                            <SearchSuggestions
                                                suggestions={searchSuggestions}
                                                isLoading={isLoadingSuggestions}
                                                onSelect={selectSuggestion}
                                                selectedIndex={selectedSuggestionIndex}
                                            />
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* NUEVA SECCIÓN MÓVIL*/}
                {searchView && !shouldHideMobileSearch() && (
                    <div className="block md:hidden mt-6 space-y-4">
                        <div className="w-full relative">
                            <form onSubmit={handleMobileSearch} role="search" className="relative w-full">
                                <input
                                    type="search"
                                    name="search"
                                    placeholder="Buscar"
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (search.trim().length >= 2) {
                                            fetchSearchSuggestions(search);
                                        }
                                    }}
                                    className="w-full pr-14 py-3 font-medium text-sm pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none bg-gray-50"
                                    enterKeyHint="search"
                                    inputMode="search"
                                    autoComplete="off"
                                    role="searchbox"
                                    aria-label="Buscar productos"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-secondary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    aria-label="Buscar"
                                >
                                    <Search size={18} />
                                </button>
                            </form>

                            <AnimatePresence>
                                <SearchSuggestions
                                    suggestions={searchSuggestions}
                                    isLoading={isLoadingSuggestions}
                                    onSelect={selectSuggestion}
                                    selectedIndex={selectedSuggestionIndex}
                                />
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {openMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden bg-transparent text-textWhite shadow-lg w-full min-h-screen absolute z-10 top-20"
                    >
                        <MobileMenuKatya
                            search={search}
                            setSearch={setSearch}
                            pages={pages}
                            items={items}
                            onClose={() => setOpenMenu(!openMenu)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />

            <div className="flex justify-end w-full mx-auto z-[100] relative">
                <div className="block fixed bottom-6 sm:bottom-[2rem] lg:bottom-[4rem] z-20 cursor-pointer">
                    <a
                        target="_blank"
                        id="whatsapp-toggle"
                        href={`https://api.whatsapp.com/send?phone=${phoneWhatsapp}&text=${messageWhatsapp}`}
                    >
                        <img
                            src="/assets/img/whatsapp.svg"
                            alt="whatsapp"
                            className="mr-3 w-12 h-12 md:w-[60px] md:h-[60px] animate-bounce duration-300"
                        />
                    </a>
                </div>
            </div>
        </header>
    );
};


export default HeaderSearchKatya;