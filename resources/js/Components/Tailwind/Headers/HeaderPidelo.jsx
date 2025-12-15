import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import {
    CircleUser,
    DoorClosed,
    Search,
    ShoppingCart,
    XIcon,
    Check,
    User,
    Settings,
    CreditCard,
    Home,
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenuPidelo from "./Components/MobileMenuPidelo";
import ProfileImage from "./Components/ProfileImage";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const HeaderPidelo = ({
    items,
    data,
    cart,
    setCart,
    isUser,
    pages,
    generals = [],
}) => {

    // Estado para tienda seleccionada y lista de tiendas
    const [selectedStore, setSelectedStore] = useState("");
    // Custom dropdown state/ref for stores
    const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
    const storeDropdownRef = useRef(null);
    const [filteredStores, setFilteredStores] = useState([]);
    const [highlightedStoreIndex, setHighlightedStoreIndex] = useState(-1);
    // Si las tiendas vienen en items, ajusta aquí:
    const stores = Array.isArray(items?.stores) ? items.stores : Array.isArray(items) ? items : [];
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


    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const mobileSearchInputRef = useRef(null);
    const desktopSearchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // refs para scroll automático en sugerencias
    const suggestionRefs = useRef([]);

    const totalCount = cart.reduce((acc, item) => Number(acc) + Number(item.quantity), 0);

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
            // Build base filter for text fields
            const baseFilter = [
                ['name', 'contains', query],
                'or',
                ['summary', 'contains', query],
                'or',
                ['description', 'contains', query]
            ];

            // If a store is selected, combine with store_id equality using 'and'
            const finalFilter = selectedStore ? ([['store_id', '=', selectedStore], 'and', baseFilter]) : baseFilter;

            const response = await fetch('/api/items/paginate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    take: 8, // Máximo 8 sugerencias
                    skip: 0,
                    filter: finalFilter,
                    sort: [{ selector: 'name', desc: false }],
                    requireTotalCount: false,
                    with: 'category,brand' // Incluir relaciones necesarias
                })
            });

            if (!response.ok) {
                throw new Error('Error en la búsqueda');
            }

            const data = await response.json();

            if (data.status === 200 && Array.isArray(data.data)) {
                setSearchSuggestions(data.data);
                setShowSuggestions(data.data.length > 0);
            } else {
                setSearchSuggestions([]);
                setShowSuggestions(false);
            }
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

        // Navegar a la página del producto (si no hay slug, abrir catálogo filtrado por nombre)
        if (suggestion.slug) {
            window.location.href = `/product/${suggestion.slug}`;
        } else {
            let url = `/catalogo?search=${encodeURIComponent(suggestion.name)}`;
            // Buscar el store seleccionado para obtener su slug
            if (selectedStore) {
                const selectedStoreObj = stores.find(store => store.id === selectedStore);
                const storeSlug = selectedStoreObj?.slug || selectedStore;
                url += `&store=${encodeURIComponent(storeSlug)}`;
            }
            window.location.href = url;
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            // Mejorar el manejo del click outside para la búsqueda móvil
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                // Solo cerrar si no se está escribiendo activamente
                if (!search.trim()) {
                    setSearchMobile(false);
                }
            }
            // Manejar click fuera de las sugerencias
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
                !desktopSearchInputRef.current?.contains(event.target) &&
                !mobileSearchInputRef.current?.contains(event.target)) {
                clearSuggestions();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside); // Para dispositivos táctiles
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [search]); // Agregar search como dependencia

    // Close store dropdown when clicking outside
    useEffect(() => {
        function handleOutside(e) {
            if (storeDropdownRef.current && !storeDropdownRef.current.contains(e.target)) {
                setStoreDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    // Reset highlighted index when opening the dropdown
    useEffect(() => {
        if (storeDropdownOpen) setHighlightedStoreIndex(-1);
    }, [storeDropdownOpen]);

    // Mirror available stores into filteredStores (no inline filtering for now)
    useEffect(() => {
        const list = Array.isArray(stores) ? stores : [];
        setFilteredStores(list);
        setHighlightedStoreIndex(-1);
    }, [stores]);

    // Keyboard navigation for store dropdown (0 = Todas las tiendas, 1..N = filteredStores[0..N-1])
    useEffect(() => {
        function handleKey(e) {
            if (!storeDropdownOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedStoreIndex(i => Math.min(i + 1, filteredStores.length));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedStoreIndex(i => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
                if (highlightedStoreIndex === 0) {
                    setSelectedStore('');
                    setStoreDropdownOpen(false);
                } else if (highlightedStoreIndex > 0 && highlightedStoreIndex <= filteredStores.length) {
                    const s = filteredStores[highlightedStoreIndex - 1];
                    if (s) {
                        setSelectedStore(s.id);
                        setStoreDropdownOpen(false);
                    }
                }
            } else if (e.key === 'Escape') {
                setStoreDropdownOpen(false);
            }
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [storeDropdownOpen, filteredStores, highlightedStoreIndex]);

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
        if (search.trim()) {
            const trimmedSearch = search.trim();
            let url = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
            if (selectedStore) {
                const selectedStoreObj = stores.find(store => store.id === selectedStore);
                const storeSlug = selectedStoreObj?.slug || selectedStore;
                url += `&store=${encodeURIComponent(storeSlug)}`;
            }
            window.location.href = url;
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
            let url = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
            if (selectedStore) {
                const selectedStoreObj = stores.find(store => store.id === selectedStore);
                const storeSlug = selectedStoreObj?.slug || selectedStore;
                url += `&store=${encodeURIComponent(storeSlug)}`;
            }
            window.location.href = url;
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
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
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
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${index === selectedIndex ? 'bg-primary border-l-4 border-primary' : ''}`}
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
                                            <div className="w-full h-full flex items-center justify-center customtext-neutral-dark">
                                                <Search size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium customtext-neutral-dark truncate">
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
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center customtext-neutral-dark">
                        No se encontraron productos
                    </div>
                )}
            </motion.div>
        );
    };
    // Determinar si el usuario es cliente (no admin ni superadmin, usando roles array)
    let isCustomer = false;
    if (isUser && Array.isArray(isUser.roles)) {
        const roleNames = isUser.roles.map(r => r.name?.toLowerCase());
        isCustomer = !roleNames.includes('admin') && !roleNames.includes('root');
    }
    return (
        <header className={`w-full top-0 left-0 z-50 transition-all duration-300 ${isFixed ? "fixed bg-white shadow-lg" : "relative bg-white"}`}>
            <div className="px-primary  bg-white 2xl:px-0 2xl:max-w-7xl mx-auto py-4 font-font-secondary text-base font-semibold">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 z-[51]">
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className="h-14 object-contain object-center"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/logo-bk.svg";
                            }}
                        />
                    </a>
                    {data?.showLoginCart && (
                        <div className="flex gap-8 lg:hidden">
                            <div className={`${searchMobile ? "hidden" : "flex"} items-center gap-4`}>
                                {isUser ? (
                                    <div ref={menuRef} className="relative">
                                        <button
                                            aria-label="user"
                                            className="flex items-center gap-2 hover:customtext-primary transition-all duration-300 relative group"
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        >
                                            <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                                {isUser.uuid ? (
                                                    <div className="relative">
                                                        <ProfileImage 
                                                            uuid={isUser.uuid}
                                                            name={isUser.name}
                                                            lastname={isUser.lastname}
                                                            className="!w-6 !h-6 rounded-full object-cover border-2 border-primary ring-secondary transition-all duration-300"
                                                        />
                                                        <div className="relative" style={{ display: 'none' }}>
                                                            <CircleUser 
                                                                className="customtext-primary  border-primary rounded-full   ring-secondary transition-all duration-300" 
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
                                                            className="customtext-primary border-2 border-primary rounded-full  ring-secondary  transition-all duration-300" 
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
                                    <a href="/iniciar-sesion" className="flex items-center">
                                        <CircleUser className="customtext-primary" width="1.5rem" />
                                    </a>
                                )}

                                <button
                                    aria-label=""
                                    onClick={() => setModalOpen(true)}
                                    className="flex items-center relative"
                                >
                                    <ShoppingCart className="customtext-primary" width="1.5rem" />
                                    <span className="absolute -right-2 -top-2 inline-flex items-center justify-center w-4 h-4 bg-primary text-white rounded-full text-[8px]">
                                        {totalCount}
                                    </span>
                                </button>
                            </div>
                            <button
                                aria-label="Menú"
                                onClick={() => setOpenMenu(!openMenu)}

                                className="flex md:hidden items-center justify-center bg-primary rounded-lg w-auto h-auto p-2 text-white fill-white transition-all duration-300 "
                            >
                                {!openMenu ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M10 5H20"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M4 12H20"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M4 19H14"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ) : (
                                    <XIcon />
                                )}
                            </button>
                        </div>
                    )}

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block relative w-full max-w-xl mx-auto">
                        <form onSubmit={handleFormSubmit} role="search" className="relative w-full">
                            <div className="w-full">
                                <div className="flex items-center bg-white py-2 pr-2 rounded-full shadow-sm border overflow-visible" style={{ boxShadow: '0 6px 18px rgba(16,24,40,0.06)' }}>
                                    {/* Select integrado a la izquierda */}
                                    <div className="relative flex items-center pl-2 pr-1" ref={storeDropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setStoreDropdownOpen(v => !v)}
                                            aria-haspopup="listbox"
                                            aria-expanded={storeDropdownOpen}
                                            className="h-10 flex items-center gap-2 pl-4 pr-3 bg-transparent border-none rounded-l-full font-normal customtext-neutral-dark focus:outline-none text-sm cursor-pointer"
                                        >
                                            <span className="truncate max-w-[140px] text-sm">
                                                {selectedStore ? (stores.find(s => s.id == selectedStore)?.name ?? selectedStore) : 'Todas las tiendas'}
                                            </span>
                                            <svg className={`w-3 h-3 transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {storeDropdownOpen && (
                                            <div className="absolute top-10 left-0 mt-2 w-[200px] bg-white rounded-md shadow-lg z-[70] py-1 max-h-64 overflow-hidden text-sm border">
                                                {/* Filter input */}
                                                    <ul
                                                        role="listbox"
                                                        tabIndex={-1}
                                                        className="max-h-56 overflow-auto py-1"
                                                    >
                                                        <li
                                                            className={`px-4 py-2 cursor-pointer flex items-center justify-between ${selectedStore === '' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                                                            onMouseEnter={() => setHighlightedStoreIndex(0)}
                                                            onClick={() => { setSelectedStore(''); setStoreDropdownOpen(false); }}
                                                        >
                                                            <span>Todas las tiendas</span>
                                                            {selectedStore === '' && (
                                                                <Check className="text-primary w-4 h-4" />
                                                            )}
                                                        </li>
                                                        {Array.isArray(filteredStores) && filteredStores.map((store, idx) => (
                                                            <li
                                                                key={store.id || idx}
                                                                className={`px-4 py-2 cursor-pointer truncate flex items-center justify-between ${highlightedStoreIndex === idx + 1 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                                                                onMouseEnter={() => setHighlightedStoreIndex(idx + 1)}
                                                                onClick={() => { setSelectedStore(store.id); setStoreDropdownOpen(false); }}
                                                            >
                                                                <span className="truncate pr-2">{store.name}</span>
                                                                {(selectedStore === store.id) && (
                                                                    <Check className="text-primary w-4 h-4" />
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input de búsqueda flexible */}
                                    <div className="flex-1 relative">
                                        <input
                                            ref={desktopSearchInputRef}
                                            type="search"
                                            name="search"
                                            placeholder="Estoy buscando..."
                                            value={search}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onFocus={() => {
                                                if (search.trim().length >= 2) {
                                                    fetchSearchSuggestions(search);
                                                }
                                            }}
                                            className="w-full h-10 pl-3 pr-12 bg-transparent text-sm placeholder:customtext-neutral-dark focus:outline-none"
                                            enterKeyHint="search"
                                            inputMode="search"
                                            autoComplete="off"
                                            role="searchbox"
                                            aria-label="Estoy buscando..."

                                        />

                                        {/* Botón de búsqueda dentro del contenedor */}
                                        <button
                                            type="submit"
                                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 ${data?.backgroundColor ? data?.backgroundColor : "bg-primary"} text-white rounded-lg hover:bg-primary hover:scale-105  transition-all duration-300`}
                                            aria-label="Buscar"
                                        >
                                            <Search />
                                        </button>
                                    </div>
                                </div>

                                {/* Sugerencias (dropdown) */}
                                <div className="relative">
                                    <div className="absolute left-0 right-0 mt-2 z-50">
                                        <AnimatePresence>
                                            <SearchSuggestions
                                                suggestions={searchSuggestions}
                                                isLoading={isLoadingSuggestions}
                                                onSelect={selectSuggestion}
                                            />
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Account and Cart */}
                    {data?.showLoginCart ? (
                        <div className="hidden md:flex items-center gap-4 relative text-sm">
                            <div ref={menuRef}>
                                {isUser ? (
                                    <button
                                        aria-label="user"
                                        className="customtext-neutral-dark flex items-center gap-2 hover:customtext-primary pr-6 transition-all duration-300 relative group"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        <div className="relative transform group-hover:scale-105 transition-transform duration-200">
                                            {isUser.uuid ? (
                                                <div className="relative">
                                                    <ProfileImage 
                                                        uuid={isUser.uuid}
                                                        name={isUser.name}
                                                        lastname={isUser.lastname}
                                                        className="w-8 h-8 rounded-full object-cover border-2 border-primary ring-secondary transition-all duration-300"
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
                                        <span className="hidden md:inline">{isUser.name}</span>
                                    </button>
                                ) : (
                                    <a href="/iniciar-sesion" className="flex items-center gap-2 text-sm hover:customtext-primary transition-colors duration-300">
                                        <CircleUser className="customtext-primary" />
                                        <span className="hidden md:inline">Iniciar Sesión</span>
                                    </a>
                                )}

                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={menuVariants}
                                            className="absolute z-50 top-full left-0 bg-white shadow-xl border-t rounded-xl w-48 mt-2"
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

                            <button
                                aria-label="cart"
                                onClick={() => setModalOpen(true)}
                                className="flex items-center gap-2 text-sm relative hover:customtext-primary transition-colors duration-300"
                            >
                                <div className="customtext-primary">
                                    <ShoppingCart />
                                </div>
                                <span className="hidden md:inline">Mi Carrito</span>
                                <span className="absolute -right-6 -top-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-white rounded-full">
                                    {totalCount}
                                </span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Desktop: botón "Haz tu Pedido" */}
                            <a
                                aria-label="primary-button"
                                className={`${data.class ? data.class : 'bg-primary'} hidden lg:block px-6 py-2.5 text-white font-medium rounded-3xl hover:brightness-125 transition-colors duration-300`}
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
                                                    className={`p-2 ${data?.backgroundColor || "bg-primary" } text-white rounded-lg hover:bg-primary transition-colors`}
                                                    aria-label="Buscar"
                                                >
                                                    <Search size={16} />
                                                </button>
                                            </div>
                                        </form>

                                        {/* Sugerencias para búsqueda móvil expandible */}
                                        <div className="relative">
                                            <div className="absolute left-0 right-0 mt-2 z-50">
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
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* NUEVA SECCIÓN MÓVIL*/}
                {data?.mobileSearch && !shouldHideMobileSearch() && (
                    <div className="block md:hidden mt-6 space-y-4">
                        <div className="w-full relative">
                            <form onSubmit={handleMobileSearch} role="search" className="relative w-full">
                                <input
                                    type="search"
                                    name="search"
                                    placeholder="Buscar productos..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (search.trim().length >= 2) {
                                            fetchSearchSuggestions(search);
                                        }
                                    }}
                                    className="w-full pr-14 py-3 font-normal pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none bg-gray-50"
                                    enterKeyHint="search"
                                    inputMode="search"
                                    autoComplete="off"
                                    role="searchbox"
                                    aria-label="Buscar productos"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    aria-label="Buscar"
                                >
                                    <Search size={18} />
                                </button>
                            </form>

                            {/* Sugerencias para nueva sección móvil */}
                            <div className="relative">
                                <div className="absolute left-0 right-0 mt-2 z-50">
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
                        <MobileMenuPidelo
                            search={search}
                            setSearch={setSearch}
                            pages={pages}
                            items={items}
                            onClose={() => setOpenMenu(!openMenu)}
                            searchSuggestions={searchSuggestions}
                            isLoadingSuggestions={isLoadingSuggestions}
                            fetchSearchSuggestions={fetchSearchSuggestions}
                            clearSuggestions={clearSuggestions}
                            selectSuggestion={selectSuggestion}
                            selectedSuggestionIndex={selectedSuggestionIndex}
                            handleKeyDown={handleKeyDown}
                            stores={stores}
                            selectedStore={selectedStore}
                            setSelectedStore={setSelectedStore}
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

      
        </header>
    );
};


export default HeaderPidelo;