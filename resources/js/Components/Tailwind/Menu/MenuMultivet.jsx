import { ChevronDown, ChevronUp, PawPrint, Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Global from "../../../Utils/Global";
import tagsItemsRest from "../../../Utils/Services/tagsItemsRest";
import BasicRest from "../../../Actions/BasicRest";

const MenuMultivet = ({ pages = [], items, data ,visible=false}) => {
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
                console.log('Fetching active tags...');
                const response = await tagsItemsRest.getTags();
                console.log('Tags response:', response);
                if (response?.data) {
                    // Filtrar y ordenar tags: promocionales activos primero, luego permanentes
                    const activeTags = response.data.filter(tag => 
                        tag.promotional_status === 'permanent' || tag.promotional_status === 'active' && tag.menu==="1"  || tag.menu===1
                    ).sort((a, b) => {
                        // Promocionales activos primero
                        if (a.promotional_status === 'active' && b.promotional_status !== 'active') return -1;
                        if (b.promotional_status === 'active' && a.promotional_status !== 'active') return 1;
                        // Luego por nombre
                        return a.name.localeCompare(b.name);
                    });
                    
                    setTags(activeTags);
                    console.log('Active tags set:', activeTags);
                    
                    // Log para debug: mostrar información promocional
                    const promotionalCount = activeTags.filter(t => t.promotional_status === 'active').length;
                    const permanentCount = activeTags.filter(t => t.promotional_status === 'permanent').length;
                    console.log(`🎯 Tags cargados: ${promotionalCount} promocionales activos, ${permanentCount} permanentes`);
                    
                    if (promotionalCount > 0) {
                        const activePromotions = activeTags.filter(t => t.promotional_status === 'active');
                        console.log('🎉 Promociones activas:', activePromotions.map(t => `${t.name} (${t.start_date} - ${t.end_date})`));
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

                console.log('Featured products response:', response);
                
                if (response?.status === 200 && Array.isArray(response.data)) {
                    setFeaturedProducts(response.data);
                    console.log('Featured products set:', response.data);
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

    console.log("items", data)
    console.log("tags", tags)
    console.log("isMobile", isMobile)
    console.log("shouldShowMenu", shouldShowMenu)

    // Si no debe mostrar el menú, retornar null (oculto)
    if (!shouldShowMenu) {
        return null;
    }

    return (
        <>
            {/* Overlay que aparece cuando el modal está abierto */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40"
                    style={{ top: menuRef.current ? menuRef.current.offsetTop + menuRef.current.offsetHeight : '0' }}
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
            
            <nav
                className={
                    `${
                    showOnlyTagsMobile
                            ? " block w-full relative md:block bg-white font-paragraph text-sm"
                            : " relative w-full md:block bg-white font-paragraph text-sm"
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
                                        className="font-semibold customtext-neutral-dark flex items-center gap-2 hover:customtext-primary pr-6 transition-colors duration-300 relative  "
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
                                                                <PawPrint/>
                                                           
                                                            </div>
                                                            <div>
                                                                <h3 className="text-2xl font-bold customtext-primary mb-1">Catálogo de Productos</h3>
                                                                <p className="customtext-neutral-dark">Encuentra todo lo que necesitas para el cuidado de tu mascota</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="p-2 customtext-primary hover:bg-gray-100 rounded-full transition-colors"
                                                        >
                                                            <X/>
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    {/* Categorías con imágenes */}
                                                    <div className="mb-8">
                                                      
                                                        
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                            {[...items].sort((a, b) => a.name.localeCompare(b.name)).map((category, index) => (
                                                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                                                                    {/* Imagen de categoría con diseño limpio */}
                                                                    <div className="w-full h-24 bg-gray-50 rounded-lg mb-3 overflow-hidden relative">
                                                                        {category.image ? (
                                                                            <img
                                                                                src={`/storage/images/category/${category.image}`}
                                                                                alt={category.name}
                                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                                onError={(e) => {
                                                                                    e.target.style.display = 'none';
                                                                                    e.target.nextSibling.style.display = 'flex';
                                                                                }}
                                                                            />
                                                                        ) : null}
                                                                        <div className={`w-full h-full flex items-center justify-center text-3xl customtext-neutral-dark ${category.image ? 'hidden' : 'flex'}`}>
                                                                            {category.name.toLowerCase().includes('perro') || category.name.toLowerCase().includes('dog') ? '🐕' :
                                                                             category.name.toLowerCase().includes('gato') || category.name.toLowerCase().includes('cat') ? '🐱' :
                                                                             category.name.toLowerCase().includes('ave') || category.name.toLowerCase().includes('bird') ? '🐦' :
                                                                             category.name.toLowerCase().includes('pez') || category.name.toLowerCase().includes('fish') ? '🐠' :
                                                                             category.name.toLowerCase().includes('alimento') || category.name.toLowerCase().includes('food') ? '🍖' :
                                                                             category.name.toLowerCase().includes('juguete') || category.name.toLowerCase().includes('toy') ? '🎾' :
                                                                             category.name.toLowerCase().includes('salud') || category.name.toLowerCase().includes('health') ? '💊' :
                                                                             category.name.toLowerCase().includes('higiene') || category.name.toLowerCase().includes('clean') ? '🧼' :
                                                                             '🐾'}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <a
                                                                        href={`/catalogo?category=${category.slug}`}
                                                                        className="block customtext-primary font-bold text-base mb-2 hover:customtext-secondary transition-colors duration-300"
                                                                    >
                                                                        {category.name}
                                                                    </a>
                                                                    
                                                                    {/* Subcategorías con diseño limpio */}
                                                                    <div className="space-y-1">
                                                                        {category.subcategories?.slice(0, 4).map((item, itemIndex) => (
                                                                            <a
                                                                                key={itemIndex}
                                                                                href={`/catalogo?subcategory=${item.slug}`}
                                                                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                                                                            >
                                                                                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                                                    {item.image ? (
                                                                                        <img
                                                                                            src={`/storage/images/subcategory/${item.image}`}
                                                                                            alt={item.name}
                                                                                            className="w-full h-full object-cover rounded"
                                                                                            onError={(e) => {
                                                                                                e.target.style.display = 'none';
                                                                                                e.target.nextSibling.style.display = 'flex';
                                                                                            }}
                                                                                        />
                                                                                    ) : null}
                                                                                    <span className={`text-xs customtext-neutral-dark ${item.image ? 'hidden' : 'flex'}`}>
                                                                                        {item.name.toLowerCase().includes('collar') ? '🦴' :
                                                                                         item.name.toLowerCase().includes('correa') ? '🎗️' :
                                                                                         item.name.toLowerCase().includes('cama') ? '🛏️' :
                                                                                         item.name.toLowerCase().includes('bowl') || item.name.toLowerCase().includes('plato') ? '🥣' :
                                                                                         item.name.toLowerCase().includes('shampoo') ? '🧴' :
                                                                                         '•'}
                                                                                    </span>
                                                                                </div>
                                                                                <span className="text-sm customtext-neutral-dark hover:customtext-secondary transition-colors line-clamp-1">
                                                                                    {item.name}
                                                                                </span>
                                                                            </a>
                                                                        ))}
                                                                        {category.subcategories?.length > 4 && (
                                                                            <a 
                                                                                href={`/catalogo?category=${category.slug}`}
                                                                                className="block text-xs customtext-primary hover:customtext-secondary transition-colors pl-2 font-medium mt-2"
                                                                            >
                                                                                Ver {category.subcategories.length - 4} más...
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Productos Destacados */}
                                                    {featuredProducts.length > 0 && (
                                                        <div className="border-t border-gray-200 pt-6">
                                                            <h4 className="text-xl font-bold customtext-primary mb-4 flex items-center gap-2">
                                                                <span className="text-xl">⭐</span>
                                                                Productos Destacados
                                                            </h4>
                                                      
                                               
                                                        
                                                        {isLoadingProducts ? (
                                                            <div className="flex items-center justify-center py-8">
                                                                <div className="flex items-center gap-2 customtext-neutral-dark">
                                                                    <div className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
                                                                    <span>Cargando productos destacados...</span>
                                                                </div>
                                                            </div>
                                                        ) : featuredProducts.length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                                                {featuredProducts.map((product) => (
                                                                    <a 
                                                                        key={product.id}
                                                                        href={product.slug ? `/product/${product.slug}` : `/catalogo?search=${encodeURIComponent(product.name)}`}
                                                                        className="group bg-gradient-to-br from-white via-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-2xl hover:border-orange-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                                                                    >
                                                                        {/* Imagen del producto */}
                                                                        <div className="w-full h-48 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 rounded-xl mb-4 overflow-hidden relative border-2 border-orange-200">
                                                                            {product.image ? (
                                                                                <img
                                                                                    src={`/api/items/media/${product.image}`}
                                                                                    alt={product.name}
                                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                                    onError={(e) => {
                                                                                        e.target.style.display = 'none';
                                                                                        e.target.nextSibling.style.display = 'flex';
                                                                                    }}
                                                                                />
                                                                            ) : null}
                                                                            <div className={`absolute inset-0 flex items-center justify-center text-6xl ${product.image ? 'hidden' : 'flex'}`}>
                                                                                🎁
                                                                            </div>
                                                                            {/* Badges mejorados */}
                                                                            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg">
                                                                                ⭐ ¡Favorito!
                                                                            </div>
                                                                            <div className="absolute top-3 left-3 bg-green-400 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg">
                                                                                ✅ Garantizado
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <h5 className="font-bold customtext-primary mb-3 group-hover:text-orange-600 transition-colors text-lg leading-snug">
                                                                            {product.name}
                                                                        </h5>
                                                                        
                                                                        {/* Beneficios del producto */}
                                                                        <div className="bg-white/80 rounded-lg p-3 mb-3 border border-orange-200">
                                                                            <div className="flex items-center gap-2 text-xs customtext-neutral-dark mb-1">
                                                                                <span>🐾</span>
                                                                                <span className="font-medium">Beneficios:</span>
                                                                            </div>
                                                                            <p className="text-xs text-gray-700">
                                                                                ✓ Calidad premium ✓ Seguro para mascotas ✓ Resultados garantizados
                                                                            </p>
                                                                        </div>
                                                                        
                                                                        {product.category && (
                                                                            <p className="text-sm text-orange-600 mb-3 font-medium">
                                                                                📂 {product.category.name}
                                                                            </p>
                                                                        )}
                                                                        
                                                                        <div className="flex items-center justify-between">
                                                                            {product.final_price ? (
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-lg font-bold text-pink-600">
                                                                                        S/ {parseFloat(product.final_price).toFixed(2)}
                                                                                    </span>
                                                                                    {product.price && product.price !== product.final_price && (
                                                                                        <span className="text-sm text-gray-400 line-through">
                                                                                            S/ {parseFloat(product.price).toFixed(2)}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            ) : (
                                                                                <span className="text-lg font-bold customtext-neutral-dark">Consultar precio</span>
                                                                            )}
                                                                            
                                                                            <div className="flex items-center gap-1 text-pink-500 group-hover:translate-x-1 transition-transform">
                                                                                <span className="text-sm font-medium">Ver más</span>
                                                                                <span>→</span>
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 customtext-neutral-dark">
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
                                                    "font-semibold hover:customtext-primary cursor-pointer transition-all duration-300"
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
