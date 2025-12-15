import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Home, X, Search, Grid3X3, Package } from "lucide-react";

const MobileMenuSearchDental = ({ pages, items, onClose }) => {
    const [menuLevel, setMenuLevel] = useState("main");
    const [animationDirection, setAnimationDirection] = useState("right");
    const [search, setSearch] = useState("");

    // Referencia para el input de búsqueda
    const searchInputRef = useRef(null);

    // Extraer categorías de los items - Los items YA SON las categorías
    const categories = items ? items
        .filter(item => item && item.id && item.name) // Filtrar items válidos
        .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
        : [];

    // Función para manejar el submit del formulario de búsqueda
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (search.trim()) {
            const trimmedSearch = search.trim();
            window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
        }
        return false;
    };

    // Función para manejar el Enter en la búsqueda
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (search.trim()) {
                const trimmedSearch = search.trim();
                window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
            }
        }
    };

    // Función para manejar la navegación con animaciones
    const navigateTo = (level, direction = "right") => {
        setAnimationDirection(direction);
        
        setTimeout(() => {
            setMenuLevel(level);
        }, 50);
    };

    const handleCategoryClick = (category) => {
        // Ir directamente al catálogo con la categoría seleccionada
        const categorySlug = category.slug || category.id;
        window.location.href = `/catalogo?category=${categorySlug}`;
        onClose(); // Cerrar el menú
    };

    const handleBackClick = () => {
        if (menuLevel === "categories") {
            navigateTo("main", "left");
        }
    };

    const handleMainMenuItemClick = (itemId) => {
        if (itemId === "categories") {
            navigateTo("categories", "right");
        }
    };

    // Determina el título según el nivel
    const getMenuTitle = () => {
        if (menuLevel === "categories") {
            return "Categorías";
        }
        return "Menú principal";
    };

    const renderMenuItems = () => {
        if (menuLevel === "main") {
            return (
                <div className="animate-fade animate-duration-300">
                    {/* Categorías */}
                    <button
                        className="px-4 py-2 mb-3 w-full flex justify-between items-center hover:bg-gray-50 active:bg-primary transition-all rounded-xl"
                        onClick={() => handleMainMenuItemClick("categories")}
                    >
                        <div className="flex items-center">
                            <span className="font-medium">Categorías</span>
                        </div>
                        <ChevronRight className="h-5 w-5 customtext-neutral-light" />
                    </button>
                    
                    {/* Páginas del menú */}
                    <div className="space-y-2">
                        {pages && pages.filter(page => page.menuable).map((page, index) => (
                            <a
                                key={page.id}
                                href={page.pseudo_path || page.path}
                                onClick={onClose}
                                className="p-4 py-2 flex justify-between items-center w-full hover:bg-gray-50 active:bg-primary transition-all rounded-xl"
                            >
                                <span className="font-medium">{page.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            );
        } else if (menuLevel === "categories") {
            return (
                <div className={animationDirection === "right" ? "animate-fade-left animate-duration-300" : "animate-fade-right animate-duration-300"}>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                className="px-4 py-2 rounded-xl flex justify-between items-center cursor-pointer hover:bg-gray-50 active:bg-primary transition-all w-full text-left"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <span className="font-medium">{category.name}</span>
                            </button>
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
                if (search.trim()) {
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
    }, [search, onClose]);

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col touch-none overscroll-none">
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
            
            {/* Contenedor del menú */}
            <div className="relative w-full md:w-[400px] md:mx-auto flex flex-col h-[100dvh]">
                {/* Panel del menú - fijo en la parte inferior */}
                <div className="mt-auto bg-white shadow-xl flex flex-col max-h-[80vh] rounded-t-2xl overflow-hidden">
                    {/* Header del menú */}
                    <div className="p-4 bg-white flex justify-between items-center border-b border-gray-200 sticky top-0 z-[9999]">
                        <h1 className="text-lg font-bold">{getMenuTitle()}</h1>
                        <button 
                            className="p-2 rounded-full hover:bg-gray-100"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Contenido scrollable */}
                    <div className="overflow-y-auto flex-1 p-4 overscroll-contain">
                        {/* Buscador mejorado para móvil */}
                        <div className="mb-5">
                            <form onSubmit={handleSearchSubmit} role="search" className="relative w-full">
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    name="search"
                                    placeholder="Buscar productos"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
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
                        </div>

                        {/* Botón de retroceso */}
                        {menuLevel !== "main" && (
                            <button
                                onClick={handleBackClick}
                                className="flex items-center customtext-primary mb-4 font-medium"
                            >
                                <ChevronLeft className="h-5 w-5 mr-1" />
                                <span>Volver</span>
                            </button>
                        )}

                        {/* Lista de ítems */}
                        <div className="pb-16">
                            {renderMenuItems()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenuSearchDental;
