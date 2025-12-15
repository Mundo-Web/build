import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";

const MenuExpertFarma = ({ pages = [], items, data ,visible=false}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
                setSelectedCategory(null);
            }
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    useEffect(() => {
        // Seleccionar la primera categoría por defecto cuando se abre el menú
        if (isMenuOpen && items.length > 0 && !selectedCategory) {
            const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
            setSelectedCategory(sortedItems[0]);
        }
    }, [isMenuOpen, items, selectedCategory]);

    useEffect(() => {
        // Obtener tags activos al cargar el componente
        const fetchTags = async () => {
            try {
                const response = await tagsItemsRest.getTags();
                if (response?.data) {
                    // Filtrar y ordenar tags: promocionales activos primero, luego permanentes
                    const activeTags = response.data.filter(tag => 
                        tag.promotional_status === 'permanent' || tag.promotional_status === 'active'
                    ).sort((a, b) => {
                        // Promocionales activos primero
                        if (a.promotional_status === 'active' && b.promotional_status !== 'active') return -1;
                        if (b.promotional_status === 'active' && a.promotional_status !== 'active') return 1;
                        // Luego por nombre
                        return a.name.localeCompare(b.name);
                    });
                    
                    setTags(activeTags);
                    
                    // Log para debug: mostrar información promocional
                    const promotionalCount = activeTags.filter(t => t.promotional_status === 'active').length;
                    const permanentCount = activeTags.filter(t => t.promotional_status === 'permanent').length;
                    
                    if (promotionalCount > 0) {
                        const activePromotions = activeTags.filter(t => t.promotional_status === 'active');
                    }
                }
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    // Auto-advance carousel for mobile tags
    useEffect(() => {
        if (tags.length > 2 && window.innerWidth < 1024) {
            const interval = setInterval(() => {
                setCurrentTagIndex(prev => {
                    const nextIndex = prev + 2;
                    return nextIndex >= tags.length ? 0 : nextIndex;
                });
            }, 3000); // Avanza cada 3 segundos

            return () => clearInterval(interval);
        }
    }, [tags.length]);

    // Detectar si estamos en mobile
    const isMobile = window.innerWidth < 1024;
    
    // En desktop: siempre mostrar el menú. En mobile: mostrar solo si visible es true y hay tags
    const shouldShowMenu = isMobile ? (visible && tags.length > 0) : true;
    // Mostrar solo tags en mobile si existen Y visible es true
    const showOnlyTagsMobile = tags.length > 0 && isMobile && visible;

    // Si no debe mostrar el menú, retornar null (oculto)
    if (!shouldShowMenu) {
        return null;
    }

    return (
        <nav
            className={
                `${
                showOnlyTagsMobile
                        ? ` block w-full relative md:block ${data?.backgroundColor ? data?.backgroundColor : "bg-secondary"} font-paragraph text-sm`
                        : ` relative w-full md:block ${data?.backgroundColor ? data?.backgroundColor : "bg-secondary"} font-paragraph text-sm`
                }`
            }
            ref={menuRef}
        >
            <div className="px-primary  2xl:px-0 2xl:max-w-7xl mx-auto">
                <ul className="flex items-center gap-4 lg:gap-6 text-sm justify-between">
                    {/* Mostrar solo tags en mobile si corresponde */}
                    {showOnlyTagsMobile ? (
                        <div className="w-full py-3 px-4">
                            {/* Carrusel de tags para mobile */}
                            <div className="relative">
                                <div className="grid grid-cols-2 gap-3 h-10">
                                    {tags.slice(currentTagIndex, currentTagIndex + 2).map((tag, index) => {
                                        const actualIndex = currentTagIndex + index;
                                        return (
                                            <a
                                                key={`${tag.id}-${actualIndex}`}
                                                href={`/catalogo?tag=${tag.id}`}
                                                className="group relative border-white border-2 overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                                style={{
                                                    background: `linear-gradient(135deg, ${tag.background_color || '#3b82f6'}, ${tag.background_color || '#3b82f6'}dd)`,
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                                <div className="relative h-full flex items-center justify-center p-3">
                                                    <div className="flex items-center gap-2 text-center">
                                                        {tag.icon ? (
                                                            <img 
                                                                src={`/storage/images/tag/${tag.icon}`} 
                                                                alt={tag.name} 
                                                                className="w-6 h-6 object-contain filter brightness-0 invert"
                                                                onError={(e) => e.target.src = "/api/cover/thumbnail/null"}
                                                            />
                                                        ) : (
                                                            <Tag size={20} style={{ color: tag.text_color || '#ffffff' }} />
                                                        )}
                                                        <span 
                                                            className="text-xs font-semibold leading-tight"
                                                            style={{ color: tag.text_color || '#ffffff' }}
                                                        >
                                                            {tag.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                            </a>
                                        );
                                    })}
                                    
                                    {/* Rellenar espacios vacíos si hay menos de 2 tags */}
                                    {tags.slice(currentTagIndex, currentTagIndex + 2).length < 2 && (
                                        <div className="rounded-2xl bg-white/10 flex items-center justify-center">
                                            <div className="text-white/50 text-xs">Más próximamente</div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Indicadores de posición */}
                                {tags.length > 2 && (
                                    <div className="flex justify-center mt-2 gap-1">
                                        {Array.from({ length: Math.ceil(tags.length / 2) }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentTagIndex(i * 2)}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    Math.floor(currentTagIndex / 2) === i 
                                                        ? `${data?.backgroundColor ? data?.backgroundColor : "bg-primary"} shadow-lg` 
                                                        : `bg-neutral-light hover:bg-white/60`
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <ul className="flex items-center gap-4 lg:gap-6 text-sm">
                                {data?.showCategories && 
                                <li className=" py-3">
                                    <button
                                        className="font-medium customtext-neutral-dark flex items-center gap-2  pr-6 transition-colors duration-300 relative before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-[1px] before:bg-black"
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        Categorías
                                        {isMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute z-50 top-11 left-0 bg-white shadow-2xl border rounded-lg transition-all duration-300 ease-in-out w-full max-w-[100vw] max-h-[50vh] overflow-hidden">
                                            <div className="w-full max-w-7xl mx-auto flex h-full">
                                                {/* Panel izquierdo - Lista de categorías */}
                                                <div className="w-1/4 min-w-[200px] py-10 bg-gray-50 border-r border-gray-200">
                                                  
                                                    <div className="overflow-y-auto max-h-[60vh]">
                                                        <ul className="py-2">
                                                            {[...items].sort((a, b) => a.name.localeCompare(b.name)).map((category, index) => (
                                                                <li key={index}>
                                                                    <button
                                                                        className={`w-full text-left rounded-sm overflow-hidden px-4 py-3 hover:bg-secondary transition-colors duration-200 border-l-4 ${
                                                                            selectedCategory?.id === category.id
                                                                                ? `${data?.backgroundColor ? data?.backgroundColor : "bg-primary"} border-neutral-dark customtext-neutral-dark font-semibold`
                                                                                : 'border-transparent text-gray-700 hover:border-nuetral-dark'
                                                                        }`}
                                                                        onClick={() => setSelectedCategory(category)}
                                                                    >
                                                                        <span className="block text-sm font-medium">
                                                                            {category.name}
                                                                        </span>
                                                                       
                                                                    </button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* Panel derecho - Subcategorías */}
                                                <div className="w-3/4">
                                                    {selectedCategory ? (
                                                        <div className="p-6">
                                                            {/* Header de la categoría seleccionada */}
                                                            <div className="mb-6">
                                                                <h3 className="text-2xl font-bold customtext-neutral-dark mb-2">
                                                                    {selectedCategory.name}
                                                                </h3>
                                                               
                                                            </div>
                                                            
                                                            {/* Grid de subcategorías */}
                                                            <div className="overflow-y-auto max-h-[50vh]">
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {selectedCategory.subcategories?.map((subcategory, subIndex) => (
                                                                        <a
                                                                            key={subIndex}
                                                                            href={`/catalogo?subcategory=${subcategory.slug}`}
                                                                            className="block p-3 rounded-lg   hover:bg-secondary transition-all duration-200 group"
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <h4 className="font-medium customtext-neutral-light hover:cusomtext-neutral-dark group-hover:text-gray-900 text-sm">
                                                                                        {subcategory.name}
                                                                                    </h4>
                                                                                    {subcategory.description && (
                                                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                                            {subcategory.description}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                               
                                                                            </div>
                                                                        </a>
                                                                    )) || (
                                                                        <div className="col-span-2 text-center py-8 text-gray-500">
                                                                            <p>No hay subcategorías disponibles</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                          
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-500">
                                                            <p>Selecciona una categoría para ver sus subcategorías</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>}

                                {/* Páginas del menú */}
                                {pages
                                    .filter(page => page.menuable)
                                    .map((page, index, arr) => (
                                        <li key={index} className="py-3">
                                            <a
                                                href={page.path}
                                                className={
                                                    " customtext-neutral-dark  cursor-pointer transition-all duration-300" +
                                                    (index !== arr.length - 1 
                                                        ? " pr-6 relative before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:h-3 before:w-[1px] before:bg-black"
                                                        : " pr-6")
                                                }
                                            >
                                                {page.name}
                                            </a>
                                        </li>
                                ))}
                            </ul>
                        
                            {/* Botones de Tags - Ahora al final */}
                            {tags.length > 0 && (
                                <div className="flex items-center gap-4 lg:gap-4 text-sm">
                                    {tags.map((tag, index) => (
                                        <li key={tag.id} className="">
                                            <a
                                                href={`/catalogo?tag=${tag.id}`}
                                                className={
                                                    `font-medium rounded-full p-2 hover:brightness-105 cursor-pointer transition-all duration-300 relative flex items-center gap-2`
                                                }
                                                style={{
                                                    backgroundColor: tag.background_color || '#3b82f6',
                                                    color: tag.text_color || '#ffffff',
                                                }}
                                                title={tag.description || tag.name}
                                            >
                                                {tag.icon && (
                                                    <img 
                                                        src={`/storage/images/tag/${tag.icon}`} 
                                                        alt={tag.name} 
                                                        className="w-4 h-4"   
                                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                    />
                                                )}
                                                
                                                {tag.name}
                                            </a>
                                        </li>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default MenuExpertFarma;
