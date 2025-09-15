import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronRight, ChevronLeft, Home, ShoppingCart, User, Menu } from "lucide-react";
import MenuSimple from "../../Menu/MenuSimple";

export default function MobileMenuKatya({ search, setSearch, pages, items, onClose }) {
    const [menuLevel, setMenuLevel] = useState("main");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [previousMenus, setPreviousMenus] = useState([]);
    const [animationDirection, setAnimationDirection] = useState("right");

    const searchInputRef = useRef(null);
    const menuRef = useRef(null);

    // Función para manejar el submit del formulario de búsqueda
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (search.trim()) {
            const trimmedSearch = search.trim();
            window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
        }
        return false;
    };

    // Función para manejar el Enter y el icono de búsqueda del teclado móvil
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (search.trim()) {
                const trimmedSearch = search.trim();
                window.location.href = `/catalogo?search=${encodeURIComponent(trimmedSearch)}`;
            }
        }
    };

    // Función para manejar la navegación con animaciones mejoradas
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
        // Guardar el estado actual antes de navegar a subcategorías
        setPreviousMenus([...previousMenus, { level: menuLevel, name: menuLevel === "main" ? "Menú principal" : "Categorías" }]);
        navigateTo("subcategories", "right", category.name);
    };

    const handleBackClick = () => {
        if (previousMenus.length > 0) {
            const last = previousMenus[previousMenus.length - 1];
            navigateTo(last.level, 'left');
            setPreviousMenus((p) => p.slice(0, -1));
        } else {
            // Fallback para casos donde no hay historial
            if (menuLevel === 'subcategories') {
                navigateTo('categories', 'left');
            } else if (menuLevel === 'categories') {
                navigateTo('main', 'left');
            }
        }
    };

    const handleMainMenuItemClick = (itemId) => {
        if (itemId === "categories") {
            // Guardar el estado actual antes de navegar a categorías
            setPreviousMenus([...previousMenus, { level: menuLevel, name: "Menú principal" }]);
            navigateTo("categories", "right");
        }
    };

    // Determina el título según el nivel
    const getMenuTitle = () => {
         return "Menú principal";
    };

    const renderMenuItems = () => {
        if (menuLevel === "main") {
            return (
                <div className="animate-fade-in animate-duration-300">
                    {/* Categorías */}
                    <button
                        className="px-4 py-3 mb-4 w-full flex justify-between items-center  hover:from-gray-100 hover:to-gray-200 active:from-gray-200 active:to-gray-300 transition-all duration-200 "
                        onClick={() => handleMainMenuItemClick("categories")}
                    >
                        <div className="flex items-center">

                            <span className="font-semibold cusomtext-neutral-dark">Categorías</span>
                        </div>
                        <ChevronRight className="h-5 w-5 cusomtext-neutral-dark" />
                    </button>

                    {/* Páginas del menú */}
                    <div className="space-y-3">
                        {pages.map(
                            (page, index) =>
                                page.menuable && (
                                    <a
                                        key={index}
                                        href={page.path}
                                        className="flex items-center px-4 py-3 bg-white  active:bg-gray-100 transition-all duration-200 "
                                    >

                                        <span className="font-medium cusomtext-neutral-dark">{page.name}</span>
                                    </a>
                                )
                        )}
                    </div>
                </div>
            );
        } else if (menuLevel === "categories") {
            // Ordenar categorías alfabéticamente
            const sortedCategories = [...items].sort((a, b) =>
                a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
            );

            return (
                <div className={animationDirection === "right" ? "animate-slide-in-right animate-duration-300" : "animate-slide-in-left animate-duration-300"}>
                    <div className="space-y-3">
                        {sortedCategories.map((category) => (
                            <button
                                key={category.id}
                                className="w-full px-4 py-3 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 rounded-2xl  flex justify-between items-center"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                                       {/* Icono opcional basado en la categoría */}
                                                {category.image && (
                                                    <img
                                                        src={`/storage/images/category/${category.image}`}
                                                        alt={category.name}
                                                        className="w-4 h-4 "
                                                        onError={(e) => (e.target.style.display = 'none')}
                                                    />
                                                )}
                                    </div>
                                    <span className="font-medium cusomtext-neutral-dark">{category.name}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 cusomtext-neutral-dark" />
                            </button>
                        ))}
                    </div>
                </div>
            );
        } else if (menuLevel === "subcategories" && selectedCategory) {
            const selectedSubcategory = items.find(
                (category) => category.name === selectedCategory
            );

            // Ordenar subcategorías alfabéticamente
            const sortedSubcategories = selectedSubcategory.subcategories
                ? [...selectedSubcategory.subcategories].sort((a, b) =>
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                  )
                : [];

            return (
                <div className={animationDirection === "right" ? "animate-slide-in-right animate-duration-300" : "animate-slide-in-left animate-duration-300"}>
                    <div className="space-y-3">
                        {sortedSubcategories.map((subcat, index) => (
                            <a
                                href={`/catalogo?subcategory=${subcat.slug}`}
                                key={index}
                                className="flex items-center w-full px-4 py-3 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all"
                            >

                                <span className="font-medium cusomtext-neutral-dark">{subcat.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            );
        }
    };

    // Efecto para prevenir el scroll del cuerpo cuando el menú está abierto
    useEffect(() => {
        // Al montar el componente
        document.body.style.overflow = 'hidden';

        // Al desmontar el componente
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    // useEffect para manejar la tecla Escape en la búsqueda
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                if (search.trim()) {
                    setSearch(""); // Limpiar búsqueda
                } else {
                    onClose(); // Cerrar menú si no hay búsqueda
                }
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [search, onClose, setSearch]);

    return (
        <div className="fixed inset-0 z-[99999] flex flex-col touch-none overscroll-none">
            {/* Overlay oscuro con mejor transición */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Contenedor del menú */}
            <div className="relative w-full md:w-[400px] md:mx-auto flex flex-col h-[100dvh]">
                {/* Panel del menú - mejor diseño */}
                <div className="mt-auto bg-white shadow-2xl flex flex-col max-h-[85vh] rounded-t-3xl overflow-hidden border-t border-gray-200">
                    {/* Header mejorado */}
                    <div className="p-5 bg-gradient-to-r from-white to-gray-50 flex justify-between items-center border-b border-gray-100">
                        <h1 className="text-xl font-bold cusomtext-neutral-dark">{getMenuTitle()}</h1>
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                            onClick={onClose}
                            aria-label="Cerrar menú"
                        >
                            <X className="h-6 w-6 cusomtext-neutral-dark" />
                        </button>
                    </div>

                    {/* Contenido scrollable mejorado */}
                    <div className="overflow-y-auto flex-1 overscroll-contain">

                        {/* Botón de retroceso mejorado */}
                        {menuLevel !== "main" && (
                            <div className="px-5 pb-3">
                                <button
                                    onClick={handleBackClick}
                                    className="flex items-center cusomtext-neutral-dark font-semibold hover:text-primary/80 active:text-primary/60 transition-all duration-200"
                                >
                                    <ChevronLeft className="h-5 w-5 mr-2" />
                                    <span>
                                        {menuLevel === "categories" ? "Categorías" : selectedCategory}
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Lista de ítems mejorada */}
                        <div className="px-5 pb-20">
                            {renderMenuItems()}
                        </div>
                    </div>

                    {/* Footer con MenuSimple */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
                        <MenuSimple visible={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
}