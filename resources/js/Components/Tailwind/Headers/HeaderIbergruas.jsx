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
    ChevronDown,
} from "lucide-react";
import CartModal from "../Components/CartModal";
import Logout from "../../../Actions/Logout";
import MobileMenu from "./Components/MobileMenu";
import ProfileImage from "./Components/ProfileImage";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const HeaderIbergruas = ({
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
            const response = await fetch('/api/items/paginate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    take: 8, // Máximo 8 sugerencias
                    skip: 0,
                    filter: [
                        ['name', 'contains', query],
                        'or',
                        ['summary', 'contains', query],
                        'or',
                        ['description', 'contains', query]
                    ],
                    // No enviar sort para usar el ordenamiento por relevancia del backend
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

        // Navegar a la página del producto
        const url = suggestion.slug
            ? `/product/${suggestion.slug}`
            : `/catalogo?search=${encodeURIComponent(suggestion.name)}`;

        window.location.href = url;
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
            window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
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

        // Función para resaltar palabras coincidentes
        const highlightMatches = (text, searchQuery) => {
            if (!text || !searchQuery) return text;

            // Dividir la búsqueda en palabras individuales
            const searchWords = searchQuery.trim().toLowerCase().split(/\s+/).filter(w => w.length >= 2);

            // Crear un pattern regex que encuentre cualquiera de las palabras
            const pattern = new RegExp(`(${searchWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

            // Dividir el texto en partes, manteniendo las coincidencias
            const parts = text.split(pattern);

            return parts.map((part, index) => {
                // Verificar si esta parte coincide con alguna palabra de búsqueda
                const isMatch = searchWords.some(word => part.toLowerCase() === word);

                if (isMatch) {
                    return <strong key={index} className="font-bold customtext-primary">{part}</strong>;
                }
                return <span key={index}>{part}</span>;
            });
        };

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
                                            {highlightMatches(suggestion.name, search)}
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

    // Helper functions removed as we now use dynamic rendering
    // based on items and pages props directly.

    return (
        <>
            <header className={`w-full top-0 left-0 z-50 transition-all duration-300 ${isFixed ? "fixed shadow-lg" : "relative"} ${data.backgroundColor || 'bg-primary'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logos Section */}
                        <div className="flex items-center gap-6">
                            <a href="/" className="flex-shrink-0 flex items-center">
                                <img
                                    src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                                    alt={Global.APP_NAME}
                                    className={`h-16 w-auto object-contain ${data?.class_logo || ""}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/img/logo-bk.svg";
                                    }}
                                />
                            </a>

                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {/* Dynamic Categories */}
                            {items?.map((category) => (
                                <div key={category.id} className="relative group">
                                    <a
                                        href={`/catalogo?category=${category.slug}`}
                                        className={`
                                            flex items-center gap-1 text-base font-bold transition-colors
                                            ${category.alias
                                                ? 'bg-black text-white px-6 py-2.5 shadow-lg hover:bg-gray-900'
                                                : 'text-gray-900 hover:text-black'
                                            }
                                        `}
                                    >
                                        {category.alias || category.name}
                                        {category.subcategories?.length > 0 && (
                                            <ChevronDown size={16} className={`transition-transform duration-200 group-hover:rotate-180 ${category.alias ? 'text-white' : ''}`} />
                                        )}
                                    </a>

                                    {/* Dropdown Menu for Subcategories */}
                                    {category.subcategories?.length > 0 && (
                                        <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                                            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                                                {category.subcategories.map((sub) => (
                                                    <a
                                                        key={sub.id}
                                                        href={`/catalogo?subcategory=${sub.slug}`}
                                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                                                    >
                                                        {sub.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Dynamic Pages */}
                            {pages
                                .filter(page => page.menuable)
                                .map((page, index, arr) => (
                                    <a
                                        key={index}
                                        href={`/${page.slug}`}
                                        className="text-base font-bold text-gray-900 hover:text-black transition-colors"
                                    >
                                        {page.name}
                                    </a>
                                ))}
                        </nav>

                        {/* Right Section: Cart & Mobile Menu */}
                        <div className="flex items-center gap-4">
                            {/* User Profile / Login */}
                            {/*** 
                           * 
                           *   <div className="hidden lg:block">
                                {isUser ? (
                                    <div className="relative group">
                                        <button className="flex items-center gap-2">
                                            <ProfileImage
                                                uuid={isUser.uuid}
                                                name={isUser.name}
                                                lastname={isUser.lastname}
                                                className="w-8 h-8 rounded-full border-2 border-black"
                                            />
                                        </button>
                             
                                        <div className="absolute top-full right-0 w-48 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50">
                                            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                                                {menuItems.map((item, index) => (
                                                    <a
                                                        key={index}
                                                        href={item.href || '#'}
                                                        onClick={item.onClick}
                                                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0"
                                                    >
                                                        {item.icon}
                                                        {item.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <a href="/iniciar-sesion" className="text-gray-900 font-bold hover:text-black">
                                        <User size={24} />
                                    </a>
                                )}
                            </div>
                          ***/}

                            {/* Cart Button */}
                            <button
                                onClick={() => setModalOpen(true)}
                                className="relative bg-black text-white p-2.5 hover:bg-gray-900 transition-colors group"
                                aria-label="Carrito de compras"
                            >
                                <ShoppingCart size={20} className="text-white" />
                                {totalCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
                                        {totalCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setOpenMenu(!openMenu)}
                                className="lg:hidden p-2 text-black hover:bg-black/5 rounded-lg transition-colors"
                            >
                                {openMenu ? <XIcon size={24} /> : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {openMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden bg-transparent text-textWhite shadow-lg w-full min-h-screen absolute z-10 top-20"
                        >
                            <MobileMenu
                                search={search}
                                setSearch={setSearch}
                                pages={pages}
                                items={items}
                                onClose={() => setOpenMenu(false)}
                                data={data}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default HeaderIbergruas;