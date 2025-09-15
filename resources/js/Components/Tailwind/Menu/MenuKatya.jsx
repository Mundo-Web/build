import { Tag, ChevronLeft, ChevronRight, ChevronDown, Store, Grid3X3 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Global from "../../../Utils/Global";

const MenuKatya = ({ pages = [], items, data, visible = false }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [storesDropdownOpen, setStoresDropdownOpen] = useState(false);
    const [stores, setStores] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMobileCategory, setActiveMobileCategory] = useState(null);

    const menuRef = useRef(null);
    const dropdownTimeoutRef = useRef(null);

    // Fetch stores on component mount
    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await fetch('/api/stores');
                if (response.ok) {
                    const data = await response.json();
                    if (data && Array.isArray(data.data)) {
                        setStores(data.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };

        fetchStores();
    }, []);

    // Filtrar solo las tiendas del tipo "tienda"
    const tiendas = stores?.filter(store => store.type === 'tienda' && store.status === true) || [];

    // Manejar clics fuera del dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveDropdown(null);
                setStoresDropdownOpen(false);
                setMobileMenuOpen(false);
                setActiveMobileCategory(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Función para manejar el hover en categorías
    const handleCategoryHover = (categoryId) => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
        setActiveDropdown(categoryId);
        setStoresDropdownOpen(false);
    };

    // Función para manejar cuando se sale del hover
    const handleCategoryLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 300); // Delay para permitir mover el mouse al dropdown
    };

    // Función para manejar el hover en el dropdown
    const handleDropdownHover = () => {
        if (dropdownTimeoutRef.current) {
            clearTimeout(dropdownTimeoutRef.current);
        }
    };

    // Función para manejar stores dropdown
    const handleStoresToggle = () => {
        setStoresDropdownOpen(!storesDropdownOpen);
        setActiveDropdown(null);
        setMobileMenuOpen(false);
        setActiveMobileCategory(null);
    };

    // Función para manejar menú móvil
    const handleMobileMenuToggle = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setActiveMobileCategory(null);
        setStoresDropdownOpen(false);
    };



    // Obtener subcategorías para una categoría específica
    const getSubcategories = (category) => {
        // Las subcategorías están directamente en category.subcategories
        return category?.subcategories || [];
    };

    const sortedCategories = items && items.length > 0
        ? [...items].sort((a, b) => a.name.localeCompare(b.name))
        : [];

    const isMobile = window.innerWidth < 1024;
    const shouldShowMenu = isMobile ? visible : true;

    return (
        <nav
            ref={menuRef}
            className="block relative w-full bg-secondary text-white font-medium text-sm"
            style={{
                background: data?.backgroundColor || 'bg-secondary'
            }}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    {shouldShowMenu && (
                        <>
                            {isMobile ? (
                                // Menú móvil
                                <div className="flex items-center justify-between w-full">
                                    {/* Botón Categorías */}
                                    <div className="relative">
                                        <button
                                            onClick={handleMobileMenuToggle}
                                            className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.66675 15.0003C1.66675 13.7167 1.66675 13.0747 1.95569 12.6032C2.11736 12.3394 2.33919 12.1176 2.60302 11.9559C3.07453 11.667 3.71638 11.667 5.00008 11.667C6.28378 11.667 6.92563 11.667 7.39714 11.9559C7.66097 12.1176 7.8828 12.3394 8.04447 12.6032C8.33341 13.0747 8.33341 13.7167 8.33341 15.0003C8.33341 16.284 8.33341 16.9259 8.04447 17.3974C7.8828 17.6612 7.66097 17.8831 7.39714 18.0447C6.92563 18.3337 6.28378 18.3337 5.00008 18.3337C3.71638 18.3337 3.07453 18.3337 2.60302 18.0447C2.33919 17.8831 2.11736 17.6612 1.95569 17.3974C1.66675 16.9259 1.66675 16.284 1.66675 15.0003Z" stroke="white" stroke-width="1.25" />
                                                <path d="M11.6667 15.0003C11.6667 13.7167 11.6667 13.0747 11.9557 12.6032C12.1173 12.3394 12.3392 12.1176 12.603 11.9559C13.0745 11.667 13.7164 11.667 15.0001 11.667C16.2837 11.667 16.9257 11.667 17.3972 11.9559C17.661 12.1176 17.8828 12.3394 18.0445 12.6032C18.3334 13.0747 18.3334 13.7167 18.3334 15.0003C18.3334 16.284 18.3334 16.9259 18.0445 17.3974C17.8828 17.6612 17.661 17.8831 17.3972 18.0447C16.9257 18.3337 16.2837 18.3337 15.0001 18.3337C13.7164 18.3337 13.0745 18.3337 12.603 18.0447C12.3392 17.8831 12.1173 17.6612 11.9557 17.3974C11.6667 16.9259 11.6667 16.284 11.6667 15.0003Z" stroke="white" stroke-width="1.25" />
                                                <path d="M1.66675 5.00033C1.66675 3.71663 1.66675 3.07478 1.95569 2.60327C2.11736 2.33943 2.33919 2.11761 2.60302 1.95593C3.07453 1.66699 3.71638 1.66699 5.00008 1.66699C6.28378 1.66699 6.92563 1.66699 7.39714 1.95593C7.66097 2.11761 7.8828 2.33943 8.04447 2.60327C8.33341 3.07478 8.33341 3.71663 8.33341 5.00033C8.33341 6.28403 8.33341 6.92588 8.04447 7.39738C7.8828 7.66122 7.66097 7.88304 7.39714 8.04472C6.92563 8.33366 6.28378 8.33366 5.00008 8.33366C3.71638 8.33366 3.07453 8.33366 2.60302 8.04472C2.33919 7.88304 2.11736 7.66122 1.95569 7.39738C1.66675 6.92588 1.66675 6.28403 1.66675 5.00033Z" stroke="white" stroke-width="1.25" />
                                                <path d="M11.6667 5.00033C11.6667 3.71663 11.6667 3.07478 11.9557 2.60327C12.1173 2.33943 12.3392 2.11761 12.603 1.95593C13.0745 1.66699 13.7164 1.66699 15.0001 1.66699C16.2837 1.66699 16.9257 1.66699 17.3972 1.95593C17.661 2.11761 17.8828 2.33943 18.0445 2.60327C18.3334 3.07478 18.3334 3.71663 18.3334 5.00033C18.3334 6.28403 18.3334 6.92588 18.0445 7.39738C17.8828 7.66122 17.661 7.88304 17.3972 8.04472C16.9257 8.33366 16.2837 8.33366 15.0001 8.33366C13.7164 8.33366 13.0745 8.33366 12.603 8.04472C12.3392 7.88304 12.1173 7.66122 11.9557 7.39738C11.6667 6.92588 11.6667 6.28403 11.6667 5.00033Z" stroke="white" stroke-width="1.25" />
                                            </svg>


                                            Categorías
                                            <ChevronDown
                                                className={`w-3 h-3 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {/* Dropdown de categorías */}
                                        <AnimatePresence>
                                            {mobileMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="absolute top-full left-0 mt-1 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 w-full max-w-md max-h-96 overflow-y-auto"
                                                >
                                                    <div className="py-2">


                                                        {/* Categorías con subcategorías en cascada */}
                                                        {sortedCategories.map((category) => {
                                                            const subcategories = getSubcategories(category);
                                                            const hasSubcategories = subcategories.length > 0;

                                                            return (
                                                                <div
                                                                    key={category.id}
                                                                    className="relative"
                                                                >
                                                                    {hasSubcategories ? (
                                                                        <div className="flex items-center">
                                                                            <a
                                                                                href={`/catalogo?category=${category.slug}`}
                                                                                className="flex-1 flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50  transition-colors duration-200"
                                                                            >
                                                                                {/* Icono opcional basado en la categoría */}
                                                                                {category.image && (
                                                                                    <div className="rounded-full min-w-6 max-w-6 min-h-6 max-h-6 overflow-hidden   flex items-center justify-center bg-secondary">

                                                                                        <img
                                                                                            src={`/storage/images/category/${category.image}`}
                                                                                            alt={category.name}
                                                                                            className="w-4 h-4 filter brightness-0 invert"
                                                                                            onError={(e) => (e.target.style.display = 'none')}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                                {category.name}
                                                                            </a>
                                                                            {/*  <button
                                                                                onClick={() => setActiveMobileCategory(activeMobileCategory === category.id ? null : category.id)}
                                                                                className="px-3 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                                                            >
                                                                                <ChevronRight className={`w-4 h-4 transition-transform ${activeMobileCategory === category.id ? 'rotate-90' : ''}`} />
                                                                            </button> */}
                                                                        </div>
                                                                    ) : (
                                                                        <a
                                                                            href={`/catalogo?category=${category.slug}`}
                                                                            className="block px-4 py-3 text-sm hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                                                                        >
                                                                            {/* Icono opcional basado en la categoría */}
                                                                          {category.image && (
                                                                                    <div className="rounded-full min-w-6 max-w-6 min-h-6 max-h-6 overflow-hidden   flex items-center justify-center bg-secondary">

                                                                                        <img
                                                                                            src={`/storage/images/category/${category.image}`}
                                                                                            alt={category.name}
                                                                                            className="w-4 h-4 filter brightness-0 invert"
                                                                                            onError={(e) => (e.target.style.display = 'none')}
                                                                                        />
                                                                                    </div>
                                                                                )}
                                                                            {category.name}
                                                                        </a>
                                                                    )}


                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                            {/* Dropdown de Subcategorías (cascada) */}
                                            <AnimatePresence>
                                                {activeMobileCategory && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="absolute top-0 left-full ml-2 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-xl z-[70] min-w-[250px] max-w-[350px] max-h-80 overflow-y-auto"
                                                        style={{
                                                            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                                        }}
                                                    >
                                                        {(() => {
                                                            const activeCategory = sortedCategories.find(cat => cat.id === activeMobileCategory);
                                                            const subcategories = getSubcategories(activeCategory);

                                                            if (!subcategories || subcategories.length === 0) return null;

                                                            return (
                                                                <div className="py-2">
                                                                    {/* Título con nombre de la categoría */}
                                                                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                                                        <h3 className="text-sm font-semibold text-gray-800">{activeCategory?.name}</h3>
                                                                        <p className="text-xs text-gray-500">Subcategorías</p>
                                                                    </div>

                                                                    {/* Lista de subcategorías */}
                                                                    {subcategories.map((subcategory, index) => (
                                                                        <a
                                                                            key={subcategory.id}
                                                                            href={`/catalogo?subcategory=${subcategory.slug}`}
                                                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-all duration-200 border-b border-gray-50 last:border-b-0"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                                                                                <span className="truncate">{subcategory.name}</span>
                                                                            </div>
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            );
                                                        })()}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </AnimatePresence>
                                    </div>

                                    {/* Dropdown de Tiendas al lado */}
                                    {tiendas.length > 0 && (
                                        <div className="relative ml-4">
                                            <button
                                                onClick={handleStoresToggle}
                                                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                                            >
                                                Tiendas
                                                <ChevronDown
                                                    className={`w-3 h-3 transition-transform duration-200 ${storesDropdownOpen ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>

                                            {/* Dropdown de tiendas */}
                                            <AnimatePresence>
                                                {storesDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full right-0 mt-1 bg-secondary text-gray-800  rounded-2xl shadow-lg z-50 min-w-[250px] max-h-80 overflow-y-auto"
                                                    >
                                                        <div className="py-2">
                                                            {tiendas.map((tienda) => (
                                                                <a
                                                                    key={tienda.id}
                                                                    href={`/tienda/${tienda.slug || tienda.id}`}
                                                                    className="block px-4 py-4 text-white hover:bg-black/20 group hover:text-white transition-colors duration-200"
                                                                >
                                                                    <div className="flex items-center gap-3">

                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-medium text-sm group-hover:!font-semibold">{tienda.name}</div>
                                                                            {tienda.address && (
                                                                                <div className="text-xs  text-white truncate">
                                                                                    {tienda.address}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center">
                                        {/* "Todas las categorías" como primer elemento */}
                                        <div className="relative">
                                            <a
                                                href="/catalogo"
                                                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.66675 15.0003C1.66675 13.7167 1.66675 13.0747 1.95569 12.6032C2.11736 12.3394 2.33919 12.1176 2.60302 11.9559C3.07453 11.667 3.71638 11.667 5.00008 11.667C6.28378 11.667 6.92563 11.667 7.39714 11.9559C7.66097 12.1176 7.8828 12.3394 8.04447 12.6032C8.33341 13.0747 8.33341 13.7167 8.33341 15.0003C8.33341 16.284 8.33341 16.9259 8.04447 17.3974C7.8828 17.6612 7.66097 17.8831 7.39714 18.0447C6.92563 18.3337 6.28378 18.3337 5.00008 18.3337C3.71638 18.3337 3.07453 18.3337 2.60302 18.0447C2.33919 17.8831 2.11736 17.6612 1.95569 17.3974C1.66675 16.9259 1.66675 16.284 1.66675 15.0003Z" stroke="white" stroke-width="1.25" />
                                                    <path d="M11.6667 15.0003C11.6667 13.7167 11.6667 13.0747 11.9557 12.6032C12.1173 12.3394 12.3392 12.1176 12.603 11.9559C13.0745 11.667 13.7164 11.667 15.0001 11.667C16.2837 11.667 16.9257 11.667 17.3972 11.9559C17.661 12.1176 17.8828 12.3394 18.0445 12.6032C18.3334 13.0747 18.3334 13.7167 18.3334 15.0003C18.3334 16.284 18.3334 16.9259 18.0445 17.3974C17.8828 17.6612 17.661 17.8831 17.3972 18.0447C16.9257 18.3337 16.2837 18.3337 15.0001 18.3337C13.7164 18.3337 13.0745 18.3337 12.603 18.0447C12.3392 17.8831 12.1173 17.6612 11.9557 17.3974C11.6667 16.9259 11.6667 16.284 11.6667 15.0003Z" stroke="white" stroke-width="1.25" />
                                                    <path d="M1.66675 5.00033C1.66675 3.71663 1.66675 3.07478 1.95569 2.60327C2.11736 2.33943 2.33919 2.11761 2.60302 1.95593C3.07453 1.66699 3.71638 1.66699 5.00008 1.66699C6.28378 1.66699 6.92563 1.66699 7.39714 1.95593C7.66097 2.11761 7.8828 2.33943 8.04447 2.60327C8.33341 3.07478 8.33341 3.71663 8.33341 5.00033C8.33341 6.28403 8.33341 6.92588 8.04447 7.39738C7.8828 7.66122 7.66097 7.88304 7.39714 8.04472C6.92563 8.33366 6.28378 8.33366 5.00008 8.33366C3.71638 8.33366 3.07453 8.33366 2.60302 8.04472C2.33919 7.88304 2.11736 7.66122 1.95569 7.39738C1.66675 6.92588 1.66675 6.28403 1.66675 5.00033Z" stroke="white" stroke-width="1.25" />
                                                    <path d="M11.6667 5.00033C11.6667 3.71663 11.6667 3.07478 11.9557 2.60327C12.1173 2.33943 12.3392 2.11761 12.603 1.95593C13.0745 1.66699 13.7164 1.66699 15.0001 1.66699C16.2837 1.66699 16.9257 1.66699 17.3972 1.95593C17.661 2.11761 17.8828 2.33943 18.0445 2.60327C18.3334 3.07478 18.3334 3.71663 18.3334 5.00033C18.3334 6.28403 8.33341 6.92588 8.04447 7.39738C7.8828 7.66122 7.66097 7.88304 7.39714 8.04472C6.92563 8.33366 6.28378 8.33366 5.00008 8.33366C3.71638 8.33366 3.07453 8.33366 2.60302 8.04472C2.33919 7.88304 2.11736 7.66122 1.95569 7.39738C1.66675 6.92588 1.66675 6.28403 1.66675 5.00033Z" stroke="white" stroke-width="1.25" />
                                                </svg>

                                                Todas las categorías
                                            </a>
                                        </div>

                                        {/* Separador vertical */}
                                        <div className="w-px h-6 bg-white/20 mx-2"></div>

                                        {/* Categorías dinámicas */}
                                        {sortedCategories.map((category) => {
                                            const subcategories = getSubcategories(category);
                                            const hasSubcategories = subcategories.length > 0;

                                            return (
                                                <div
                                                    key={category.id}
                                                    className="relative"
                                                    onMouseEnter={() => hasSubcategories && handleCategoryHover(category.id)}
                                                    onMouseLeave={handleCategoryLeave}
                                                >
                                                    <a
                                                        href={`/catalogo?category=${category.slug}`}
                                                        className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                                                    >
                                                        {/* Icono opcional basado en la categoría */}
                                                        {category.image && (
                                                            <img
                                                                src={`/storage/images/category/${category.image}`}
                                                                alt={category.name}
                                                                className="w-4 h-4 filter brightness-0 invert"
                                                                onError={(e) => (e.target.style.display = 'none')}
                                                            />
                                                        )}

                                                        {category.name}

                                                        {hasSubcategories && (
                                                            <ChevronDown className="w-3 h-3 ml-1" />
                                                        )}
                                                    </a>

                                                    {/* Dropdown de subcategorías */}
                                                    <AnimatePresence>
                                                        {activeDropdown === category.id && hasSubcategories && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="absolute top-full left-0 mt-1 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-80 overflow-y-auto"
                                                                onMouseEnter={handleDropdownHover}
                                                                onMouseLeave={handleCategoryLeave}
                                                            >
                                                                <div className="py-2">
                                                                    {subcategories.map((subcategory) => (
                                                                        <a
                                                                            key={subcategory.id}
                                                                            href={`/catalogo?subcategory=${subcategory.slug}`}
                                                                            className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                                                                        >
                                                                            {subcategory.name}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Dropdown de Tiendas al final derecho */}
                                    {tiendas.length > 0 && (
                                        <div className="relative">
                                            <button
                                                onClick={handleStoresToggle}
                                                className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
                                            >
                                                Tiendas
                                                <ChevronDown
                                                    className={`w-3 h-3 transition-transform duration-200 ${storesDropdownOpen ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>

                                            {/* Dropdown de tiendas */}
                                            <AnimatePresence>
                                                {storesDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full right-0 mt-1 bg-secondary text-gray-800  rounded-2xl shadow-lg z-50 min-w-[250px] max-h-80 overflow-y-auto"
                                                    >
                                                        <div className="py-8">
                                                            {tiendas.map((tienda) => (
                                                                <a
                                                                    key={tienda.id}
                                                                    href={`/tienda/${tienda.slug || tienda.id}`}
                                                                    className="block px-4 py-4 text-white hover:bg-black/20 group hover:text-white transition-colors duration-200"
                                                                >
                                                                    <div className="flex items-center gap-3">

                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-medium text-sm group-hover:!font-semibold">{tienda.name}</div>
                                                                            {tienda.address && (
                                                                                <div className="text-xs  text-white truncate">
                                                                                    {tienda.address}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default MenuKatya;
