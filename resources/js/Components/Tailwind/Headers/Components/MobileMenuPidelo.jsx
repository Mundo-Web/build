import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronRight, ChevronLeft, Home, ShoppingCart, User, Menu, Check, ChevronDown } from "lucide-react";
import MenuSimple from "../../Menu/MenuSimple";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

export default function MobileMenuPidelo({ 
    search, 
    setSearch, 
    pages, 
    items, 
    onClose, 
    searchSuggestions,
    isLoadingSuggestions,
    fetchSearchSuggestions,
    clearSuggestions,
    selectSuggestion,
    selectedSuggestionIndex,
    handleKeyDown: parentHandleKeyDown,
    stores = [],
    selectedStore,
    setSelectedStore
}) {
    const [menuLevel, setMenuLevel] = useState("main");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [previousMenus, setPreviousMenus] = useState([]);
    const [animationDirection, setAnimationDirection] = useState("right");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
    const [filteredStores, setFilteredStores] = useState(stores || []);

    // Referencias
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const suggestionItemsRef = useRef([]);
    const storeDropdownRef = useRef(null);

    // Función para manejar la selección de tienda
    const handleStoreSelect = (storeId) => {
        setSelectedStore(storeId);
        setStoreDropdownOpen(false);
    };

    // Efecto para actualizar stores filtradas
    useEffect(() => {
        setFilteredStores(stores || []);
    }, [stores]);

    // Efecto para cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (storeDropdownRef.current && !storeDropdownRef.current.contains(event.target)) {
                setStoreDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Función para manejar el submit del formulario de búsqueda
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (search.trim()) {
            const trimmedSearch = search.trim();
            clearSuggestions();
            setShowSuggestions(false);
            window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
        }
        return false;
    };

    // Función para manejar cambios en el input de búsqueda
    const handleSearchChange = (value) => {
        setSearch(value);
        if (value.trim().length >= 2) {
            fetchSearchSuggestions(value);
            setShowSuggestions(true);
        } else {
            clearSuggestions();
            setShowSuggestions(false);
        }
    };

    // Función para manejar el teclado
    const handleKeyDown = (event) => {
        if (showSuggestions && searchSuggestions.length > 0) {
            if (parentHandleKeyDown) {
                parentHandleKeyDown(event);
            }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            handleSearchSubmit(event);
        }
    };

    // Función para seleccionar una sugerencia
    const handleSuggestionSelect = (suggestion) => {
        selectSuggestion(suggestion);
        setShowSuggestions(false);
    };

    // Función para manejar el focus del input
    const handleSearchFocus = () => {
        if (search.trim().length >= 2) {
            fetchSearchSuggestions(search);
            setShowSuggestions(true);
        }
    };

    // Función para manejar el blur del input
    const handleSearchBlur = () => {
        // Delay para permitir clicks en sugerencias
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    // Componente de sugerencias
    const SearchSuggestions = ({ suggestions, isLoading, onSelect, selectedIndex }) => {
        if (!showSuggestions) return null;

        return (
            <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[60] max-h-60 overflow-y-auto mt-1"
            >
                {isLoading ? (
                    <div className="p-4 text-center text-gray-600">
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
                                        onSelect(suggestion);
                                    }}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${index === selectedIndex ? 'bg-blue-50 border-l-4 border-primary' : ''}`}
                                    type="button"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                        {suggestion.image ? (
                                            <img
                                                src={`/api/items/media/${suggestion.image}`}
                                                alt={suggestion.name}
                                                className="w-full h-full object-cover"
                                                onError={e => {
                                                    e.target.src = "/api/cover/thumbnail/null";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Search size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">
                                            {suggestion.name}
                                        </div>
                                        {suggestion.category && (
                                            <div className="text-sm text-gray-600 truncate">
                                                {suggestion.category.name}
                                            </div>
                                        )}
                                        {suggestion.final_price && (
                                            <div className="text-sm font-semibold text-primary">
                                                {CurrencySymbol()} {parseFloat(suggestion.final_price).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="p-4 text-center text-gray-600">
                        No se encontraron productos
                    </div>
                )}
            </motion.div>
        );
    };

    // Función para manejar la navegación con animaciones
    const navigateTo = (level, direction = "right", categoryName = null) => {
        setAnimationDirection(direction);
        
        if (categoryName) {
            setSelectedCategory(categoryName);
        }
        
        setTimeout(() => {
            setMenuLevel(level);
        }, 50);
    };

    const handleCategoryClick = (category) => {
        setSelectedSubcategory(category.name);
        setPreviousMenus([...previousMenus, { level: menuLevel, name: "Categorías" }]);
        navigateTo("subcategories", "right", category.name);
    };

    const handleBackClick = () => {
        if (previousMenus.length > 0) {
            const lastMenu = previousMenus[previousMenus.length - 1];
            navigateTo(lastMenu.level, "left");
            setPreviousMenus(previousMenus.slice(0, -1));
        } else {
            if (menuLevel === "subcategories") {
                navigateTo("categories", "left");
            } else if (menuLevel === "categories") {
                navigateTo("main", "left");
            }
        }
    };

    const handleMainMenuItemClick = (itemId) => {
        if (itemId === "categories") {
            navigateTo("categories", "right");
        }
    };

    const getMenuTitle = () => {
        return "Menú principal";
    };

    const renderMenuItems = () => {
        if (menuLevel === "main") {
            return (
                <div className="animate-fade animate-duration-300">
                    <button
                        className="px-4 py-2 mb-3 w-full flex justify-between items-center hover:bg-gray-50 active:bg-primary transition-all rounded-xl"
                        onClick={() => handleMainMenuItemClick("categories")}
                    >
                        <div className="flex items-center">
                            <span className="font-medium">Categorías</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                    
                    <div className="space-y-2">
                        {pages.map(
                            (page, index) =>
                                page.menuable && (
                                    <a
                                        key={index}
                                        href={page.path}
                                        className="p-4 py-2 flex justify-between items-center w-full hover:bg-gray-50 active:bg-primary transition-all rounded-xl"
                                    >
                                        <span className="font-medium">{page.name}</span>
                                    </a>
                                )
                        )}
                    </div>
                </div>
            );
        } else if (menuLevel === "categories") {
            const sortedCategories = [...items].sort((a, b) => 
                a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
            );
            
            return (
                <div className={animationDirection === "right" ? "animate-fade-left animate-duration-300" : "animate-fade-right animate-duration-300"}>
                    <div className="space-y-2">
                        {sortedCategories.map((category) => (
                            <div
                                key={category.id}
                                className="px-4 py-2 rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-50 active:bg-primary transition-all"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <span className="font-medium">{category.name}</span>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            );
        } else if (menuLevel === "subcategories" && selectedCategory) {
            const selectedSubcategory = items.find(
                (category) => category.name === selectedCategory
            );
            
            const sortedSubcategories = selectedSubcategory.subcategories 
                ? [...selectedSubcategory.subcategories].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                  )
                : [];
                
            return (
                <div className={animationDirection === "right" ? "animate-fade-left animate-duration-300" : "animate-fade-right animate-duration-300"}>
                    <div className="space-y-2">
                        {sortedSubcategories.map((subcat, index) => (
                            <a
                                href={`/catalogo?subcategory=${subcat.slug}`}
                                key={index}
                                className="flex w-full px-4 py-2 rounded-xl justify-between items-center hover:bg-gray-50 active:bg-primary transition-all"
                            >
                                <span className="font-medium">{subcat.name}</span>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                            </a>
                        ))}
                    </div>
                </div>
            );
        }
    };

    // Efecto para prevenir el scroll del cuerpo cuando el menú está abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // useEffect para manejar la tecla Escape
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                if (showSuggestions) {
                    setShowSuggestions(false);
                    clearSuggestions();
                } else if (search.trim()) {
                    setSearch("");
                } else {
                    onClose();
                }
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [search, onClose, setSearch, showSuggestions, clearSuggestions]);

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col touch-none overscroll-none">
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            
            <div className="relative w-full md:w-[400px] md:mx-auto flex flex-col h-[100dvh]">
                <div className="mt-auto bg-white shadow-xl flex flex-col max-h-[85vh] rounded-t-2xl overflow-hidden">
                    <div className="p-4 bg-white flex justify-between items-center border-b border-gray-200 sticky top-0 z-[9999]">
                        <h1 className="text-lg font-bold">{getMenuTitle()}</h1>
                        <button 
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-4 overscroll-contain">
                        {/* Selector de tiendas */}
                        <div className="mb-4 relative" ref={storeDropdownRef}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tienda
                            </label>
                            <button
                                type="button"
                                onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            >
                                <span className="truncate text-left">
                                    {selectedStore ? 
                                        (filteredStores.find(s => s.id === selectedStore)?.name || selectedStore) : 
                                        'Todas las tiendas'
                                    }
                                </span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${storeDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {storeDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[70] max-h-48 overflow-y-auto">
                                    <ul className="py-1">
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => handleStoreSelect('')}
                                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedStore === '' ? 'bg-blue-50' : ''}`}
                                            >
                                                <span>Todas las tiendas</span>
                                                {selectedStore === '' && (
                                                    <Check className="w-4 h-4 text-primary" />
                                                )}
                                            </button>
                                        </li>
                                        {filteredStores.map((store) => (
                                            <li key={store.id}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleStoreSelect(store.id)}
                                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedStore === store.id ? 'bg-blue-50' : ''}`}
                                                >
                                                    <span className="truncate">{store.name}</span>
                                                    {selectedStore === store.id && (
                                                        <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                                                    )}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Buscador con sugerencias */}
                        <div className="mb-5 relative">
                            <form onSubmit={handleSearchSubmit} role="search" className="relative w-full">
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    name="search"
                                    placeholder="Buscar productos"
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={handleSearchFocus}
                                    onBlur={handleSearchBlur}
                                    className="w-full pr-12 py-3 pl-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    enterKeyHint="search"
                                    inputMode="search"
                                    autoComplete="off"
                                    role="searchbox"
                                    aria-label="Buscar productos"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                    aria-label="Buscar"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>

                            {/* Sugerencias */}
                            <AnimatePresence>
                                <SearchSuggestions
                                    suggestions={searchSuggestions}
                                    isLoading={isLoadingSuggestions}
                                    onSelect={handleSuggestionSelect}
                                    selectedIndex={selectedSuggestionIndex}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Botón de retroceso */}
                        {menuLevel !== "main" && (
                            <button
                                onClick={handleBackClick}
                                className="flex items-center text-primary mb-4 font-medium"
                            >
                                <ChevronLeft className="h-5 w-5 mr-1" />
                                <span>
                                    {menuLevel === "categories" ? "Categorías" : selectedCategory}
                                </span>
                            </button>
                        )}

                        {/* Lista de ítems */}
                        <div className="pb-16">
                            {renderMenuItems()}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                            <MenuSimple visible={true}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}