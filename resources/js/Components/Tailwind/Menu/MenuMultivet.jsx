import { ChevronDown, ChevronUp, PawPrint, Tag, X, ChevronLeft, ChevronRight, ChevronRightCircle, ListFilter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";
import BasicRest from "../../../Actions/BasicRest";
import CardProductMultivet from "../Products/Components/CardProductMultivet";



const MenuMultivet = ({ pages = [], items, data, visible = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTagIndex, setCurrentTagIndex] = useState(0);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("pointerdown", handleClickOutside);
        return () => document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    // Prevenir scroll del body cuando el modal está abierto en desktop
    useEffect(() => {
        if (isMenuOpen && window.innerWidth >= 1024) {
            // Guardar el scroll actual y el ancho de la ventana
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Aplicar estilos para prevenir scroll
            document.documentElement.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';

            // Compensar el ancho del scrollbar para evitar salto del layout
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }

            return () => {
                // Restaurar todos los estilos cuando se cierre el modal
                document.documentElement.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.left = '';
                document.body.style.right = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isMenuOpen]);

    useEffect(() => {
        // Obtener tags activos al cargar el componente
        const fetchTags = async () => {
            try {
                const response = await tagsItemsRest.getTags();
                if (response?.data) {
                    // Filtrar y ordenar tags: promocionales activos primero, luego permanentes
                    const activeTags = response.data.filter(tag =>
                        tag.promotional_status === 'permanent' || tag.promotional_status === 'active' && tag.menu === "1" || tag.menu === 1
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

    // Obtener productos destacados
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            setIsLoadingProducts(true);
            try {
                // Crear instancia de BasicRest para items
                const itemsRest = new BasicRest();
                itemsRest.path = 'items';
                itemsRest.is_use_notify = false; // No mostrar notificaciones

                const response = await itemsRest.paginate({
                    take: 3,
                    skip: 0,
                    filter: [
                        ['status', '=', 1], // Solo productos activos
                        'and',
                        ['featured', '=', 1] // Solo productos destacados
                    ],
                    sort: [{ selector: 'created_at', desc: true }],
                    requireTotalCount: false,
                    with: 'category,brand'
                });


                if (response?.status === 200 && Array.isArray(response.data)) {
                    setFeaturedProducts(response.data);
                } else {
                    console.log('No featured products found or invalid response:', response);
                }
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

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
        <>


            {/* Overlay de fondo */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    style={{ top: menuRef.current ? menuRef.current.offsetTop + menuRef.current.offsetHeight : '0' }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <nav
                id={data?.element_id || null}
                className={
                    `${showOnlyTagsMobile
                        ? " block w-full relative md:block  font-paragraph text-sm"
                        : " relative w-full md:block  font-paragraph text-sm"
                    } ${data?.class_container || 'bg-white customtext-neutral'}`
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
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${Math.floor(currentTagIndex / 2) === i
                                                        ? 'bg-primary shadow-lg'
                                                        : 'bg-neutral-light hover:bg-white/60'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <ul className="flex items-center gap-4 lg:gap-6 text-base">
                                    {data?.showCategories &&
                                        <li className="relative py-3">
                                            <button
                                                className="font-semibold  flex items-center gap-2  pr-6 transition-colors duration-300 relative  "
                                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            >
                                                Categorías
                                                {isMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                            {isMenuOpen && (
                                                <div className="absolute z-50 top-14 left-0 bg-white shadow-2xl border border-gray-100 rounded-2xl transition-all duration-500 ease-in-out w-[90vw] max-w-6xl overflow-hidden">
                                                    <div className="max-h-[calc(100vh-13rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                        {/* Header del modal con tema de mascotas */}
                                                        <div className="bg-gray-50 p-6 border-b border-gray-200">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                                                        {data?.icon === 'paw' ? <PawPrint /> : data?.icon === 'tag' ? <Tag /> : data?.icon === 'list' ? <ListFilter /> : <PawPrint />}


                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-2xl font-title font-bold customtext-primary mb-1">Categorías</h3>
                                                                        <p className="">{data?.description || "Encuentra todo lo que necesitas para el cuidado de tu mascota"}</p>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => setIsMenuOpen(false)}
                                                                    className="p-2 customtext-primary hover:bg-gray-100 rounded-full transition-colors"
                                                                >
                                                                    <X />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="p-6">
                                                            {/* Categorías con Grid de 3 columnas y subcategorías */}
                                                            <div className="mb-8">


                                                                <div className="swiper-container relative ">
                                                                    {/* Grid de categorías con subcategorías */}
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                        {[...items].sort((a, b) => {
                                                                            // Ordenar por order_index si type_order es 'order_index', sino alfabéticamente
                                                                            if (data?.type_order === 'order_index') {
                                                                                return (a.order_index || 0) - (b.order_index || 0);
                                                                            }
                                                                            return a.name.localeCompare(b.name);
                                                                        }).map((category, index) => (
                                                                            <div key={index} className="group">
                                                                                {/* Categoría principal */}
                                                                                <a
                                                                                    href={`/catalogo?category=${category.slug}`}
                                                                                    className="group block relative h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mb-4"
                                                                                >
                                                                                    {/* Imagen de fondo */}
                                                                                    <div className="absolute inset-0 overflow-hidden rounded-xl">

                                                                                        <img
                                                                                            src={`/storage/images/category/${category.image}`}
                                                                                            alt={category.name}
                                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                                            onError={(e) =>
                                                                                            (e.target.src =
                                                                                                "/api/cover/thumbnail/null")
                                                                                            }
                                                                                        />


                                                                                    </div>

                                                                                    {/* Overlay con gradiente */}
                                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:from-black/60 transition-all duration-300"></div>

                                                                                    {/* Texto centrado */}
                                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                                        <h3 className={`bg-accent rounded-full text-sm font-bold text-center px-4 py-2 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg ${data?.class_badge_category || ''}`}>
                                                                                            {category.name}
                                                                                        </h3>
                                                                                    </div>


                                                                                </a>

                                                                                {/* Subcategorías */}
                                                                                {category.subcategories && category.subcategories.length > 0 && (
                                                                                    <div className="space-y-2">

                                                                                        <div className="grid grid-cols-1 gap-2">
                                                                                            {[...category.subcategories].sort((a, b) => {
                                                                                                // Ordenar subcategorías igual que las categorías
                                                                                                if (data?.type_order === 'order_index') {
                                                                                                    return (a.order_index || 0) - (b.order_index || 0);
                                                                                                }
                                                                                                return a.name.localeCompare(b.name);
                                                                                            }).slice(0, 3).map((subcategory, subIndex) => (
                                                                                                <a
                                                                                                    key={subIndex}
                                                                                                    href={`/catalogo?subcategory=${subcategory.slug}`}
                                                                                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                                                                                                >
                                                                                                    {/* Imagen pequeña de subcategoría */}
                                                                                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                                                                      
                                                                                                            <img
                                                                                                                src={`/storage/images/sub_category/${subcategory.image}`}
                                                                                                                alt={subcategory.name}
                                                                                                                className="w-full h-full object-cover"
                                                                                                                onError={(e) =>
                                                                                                                (e.target.src =
                                                                                                                    "/api/cover/thumbnail/null")
                                                                                                                }
                                                                                                            />
                                                                                                  
                                                                                                      
                                                                                                    </div>

                                                                                                    {/* Texto de subcategoría */}
                                                                                                    <div className="flex-1">
                                                                                                        <span className="text-sm font-medium  group- transition-colors duration-300">
                                                                                                            {subcategory.name}
                                                                                                        </span>
                                                                                                    </div>

                                                                                                    {/* Icono de flecha */}
                                                                                                    <ChevronRight className="w-4 h-4 customtext-neutral opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                                                                                </a>
                                                                                            ))}

                                                                                            {/* Mostrar "Ver más" si hay más de 3 subcategorías */}
                                                                                            {category.subcategories.length > 3 && (
                                                                                                <a
                                                                                                    href={`/catalogo?category=${category.slug}`}
                                                                                                    className="text-center p-2 text-sm customtext-primary  font-medium border border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-all duration-300"
                                                                                                >
                                                                                                    Ver {category.subcategories.length - 3} más...
                                                                                                </a>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                </div>
                                                            </div>

                                                            {/* Productos Destacados */}
                                                            {featuredProducts.length > 0 && (
                                                                <div className="border-t border-gray-200 pt-6">
                                                                    <h4 className="text-2xl mb-8 font-title font-bold customtext-primary ">

                                                                        Productos Destacados
                                                                    </h4>

                                                                    {isLoadingProducts ? (
                                                                        <div className="flex items-center justify-center py-8">
                                                                            <div className="flex items-center gap-2 ">
                                                                                <div className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                                                                                <span>Cargando productos destacados...</span>
                                                                            </div>
                                                                        </div>
                                                                    ) : featuredProducts.length > 0 ? (
                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                            {featuredProducts.map((product) => (
                                                                                <CardProductMultivet
                                                                                    key={product.id}
                                                                                    product={product}
                                                                                    data={data}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center py-8 ">
                                                                            <div className="text-4xl mb-2">🎁</div>
                                                                            <p>No hay productos destacados disponibles</p>
                                                                        </div>
                                                                    )}
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
                                                        "font-semibold   cursor-pointer transition-all duration-300"
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
        </>
    );
};

export default MenuMultivet;
