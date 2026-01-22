import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import ProductCardSelector from '../Products/ProductCardSelector';
import ItemsRest from "../../../Actions/ItemsRest";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import { GET } from "sode-extend-react";

const itemsRest = new ItemsRest();

const FilterHuaillys = ({ items, data, cart, setCart, filteredData, setFavorites, favorites }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState({
        category_id: [], // Inicialmente vacío, se llenará después de cargar categorías
    });

    // Cargar categorías desde filteredData
    useEffect(() => {
        if (filteredData?.categories) {
            setCategories(filteredData.categories);

            
            // Si viene category desde URL, seleccionarla y convertir slug a ID
            if (GET.category && filteredData.categories.length > 0) {
                const categoryFromUrl = filteredData.categories.find(
                    cat => cat.slug === GET.category || cat.id === parseInt(GET.category)
                );
                if (categoryFromUrl) {
                    setSelectedCategory(categoryFromUrl);
                    // Actualizar filtros con el ID de la categoría
                    setSelectedFilters(prev => ({
                        ...prev,
                        category_id: [categoryFromUrl.id]
                    }));
                }
            }
        }
    }, [filteredData]);

    // Función para transformar filtros al formato del backend (como CatalagoFiltros)
    const transformFilters = (filters) => {
        const transformedFilters = [];

        // Category filter
        if (filters.category_id && filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category.id",
                "=",
                id,
            ]);
            
            if (categoryConditions.length === 1) {
                transformedFilters.push(categoryConditions[0]);
            } else if (categoryConditions.length > 1) {
                // Join with 'or' if multiple categories
                const joinedConditions = categoryConditions.reduce((acc, cond, index) => {
                    if (index === 0) return cond;
                    return [acc, 'or', cond];
                });
                transformedFilters.push(joinedConditions);
            }
        }

        // Si no hay filtros, devolver un array vacío para obtener todos los productos
        return transformedFilters.length > 0 ? 
            (transformedFilters.length === 1 ? transformedFilters[0] : 
                transformedFilters.reduce((acc, filter, index) => {
                    if (index === 0) return filter;
                    return [acc, 'and', filter];
                })) 
            : [];
    };

    // Obtener productos filtrados desde el backend (como CatalagoFiltros)
    const fetchProducts = async (page = 1) => {
        setLoading(true);

        try {
            const filters = transformFilters(selectedFilters);
            const itemsPerPage = 24;
            
           

            const params = {
                filter: filters,
                sort: [{ selector: "final_price", desc: true }],
                skip: (page - 1) * itemsPerPage,
                take: itemsPerPage,
                requireTotalCount: true,
            };


            const response = await itemsRest.paginate(params);


            if (response.status !== 200) {
                throw new Error(`API returned status ${response.status}`);
            }

            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Cargar productos cuando cambian los filtros
    useEffect(() => {
        fetchProducts();
    }, [selectedFilters]);

    // Cargar productos iniciales si vienen en items
    useEffect(() => {
        if (items && items.length > 0 && products.length === 0) {
            setProducts(items);
            setLoading(false);
        }
    }, [items]);

    // Función para procesar texto con formato ** para customtext-primary
    const processHighlightText = (text) => {
        if (!text) return null;
        
        const parts = text.split(/(\*.*?\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                const cleanText = part.replace(/\*/g, '');
                return (
                    <span key={index} className="font-title customtext-primary ">
                        <br/>
                        {cleanText}
                    </span>
                );
            }
            return <span className="font-title" key={index}>{part}</span>;
        });
    };

    // Manejar click en categoría
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);

        // Actualizar filtros
        if (category === null) {
            // Mostrar todos los productos
            setSelectedFilters({
                category_id: [],
            });
            
            // Actualizar URL
            const url = new URL(window.location.href);
            url.searchParams.delete('category');
            window.history.pushState({}, '', url);
        } else {
            // Filtrar por categoría - USAR ID no slug
            setSelectedFilters({
                category_id: [category.id], // Usar ID numérico
            });
            
            // Actualizar URL con slug
            const url = new URL(window.location.href);
            url.searchParams.set('category', category.slug || category.id);
            window.history.pushState({}, '', url);
        }
    };

    // Función para manejar click en producto
    const handleProductClick = (product) => {
        window.location.href = `/product/${product.slug}`;
    };

    return (
        <div id={data?.element_id || null} className="w-full bg-white font-paragraph">
            {/* Hero Section con Imagen de Fondo */}
            {data?.background_image && (
                <div 
                    className="relative w-full h-64 lg:h-72 bg-cover  flex items-center justify-center"
                    style={{
                        backgroundImage: `url(${data.background_image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                    <div className="relative w-full z-10 text-start px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <h1 className={`text-3xl md:text-5xl font-title lg:text-7xl text-start text-white ${data?.class_hero_title || ''}`}>
                            {processHighlightText(data?.hero_title || 'Nuestro *Catálogo*')}
                        </h1>
                        {data?.hero_subtitle && (
                            <p className={`text-lg md:text-xl text-white/90 mt-4 font-paragraph ${data?.class_hero_subtitle || ''}`}>
                                {data.hero_subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Sección de Categorías */}
            <section className="py-8 lg:py-16 bg-secondary">
                <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                   

                    {/* Slider de Categorías */}
                    {categories && categories.length > 0 && (
                        <div className="relative">
                            

                            <Swiper
                                modules={[Autoplay, Navigation]}
                                spaceBetween={16}
                                slidesPerView={1}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                navigation={{
                                    prevEl: navigationPrevRef.current,
                                    nextEl: navigationNextRef.current,
                                }}
                                onBeforeInit={(swiper) => {
                                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                                    swiper.params.navigation.nextEl = navigationNextRef.current;
                                }}
                                loop={categories.length > 4}
                                speed={800}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 16,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 20,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 24,
                                    },
                                }}
                                className="category-swiper"
                            >
                                {categories.map((category) => (
                                    <SwiperSlide key={category.id}>
                                        <div 
                                            className={`group cursor-pointer rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full my-4 ${
                                                selectedCategory?.id === category.id
                                                    ? `bg-white ${data?.class_category_card_selected || ''}`
                                                    : 'bg-white'
                                            }`}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            {/* Imagen de la categoría */}
                                            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-100">
                                                <img
                                                    src={`/storage/images/category/${category.image}`}
                                                    alt={category.name || category.nombre}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.src = '/assets/img/noimage/no_img.jpg';
                                                    }}
                                                />
                                                
                                                {/* Overlay con check si está seleccionada */}
                                                {selectedCategory?.id === category.id && (
                                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Contenido de la tarjeta */}
                                            <div className={`p-4 lg:px-6 transition-colors duration-300 rounded-b-2xl ${
                                                selectedCategory?.id === category.id
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white group-hover:bg-primary group-hover:text-white'
                                            }`}>
                                                <h3 className={`text-lg lg:text-xl font-bold transition-colors duration-300 text-left ${data?.class_category_card_title || ''}`}>
                                                    {category.name || category.nombre}
                                                </h3>
                                                
                                                {(category.description || category.descripcion) && (
                                                    <p className={`text-sm font-paragraph text-left mt-2 line-clamp-2 opacity-90 ${data?.class_category_card_description || ''}`}>
                                                        {category.description || category.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Botones de navegación de categorías */}
                            <button
                                ref={navigationPrevRef}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -ml-5 lg:-ml-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Anterior"
                            >
                                <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                            </button>
                            <button
                                ref={navigationNextRef}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -mr-5 lg:-mr-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Siguiente"
                            >
                                <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Sección de Productos Filtrados */}
            <section className="py-8 lg:py-16 bg-white">
                <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                    <div className="flex mb-8  w-full flex-col gap-6 lg:flex-row justify-between items-center">
                        <div className="text-left">
                            <h2 className={`text-3xl lg:text-5xl customtext-neutral-dark font-title mb-3  tracking-wide ${data?.class_product_title || ''}`}>
                                {data?.product_title || 'Pide todo lo que quieras y comparte'}
                            </h2>
                            {data?.product_description && (
                                <p className={`customtext-neutral-dark font-paragraph text-base ${data?.class_product_description || ''}`}>
                                    {data.product_description}
                                </p>
                            )}
                            
                            {/* Mostrar categoría seleccionada */}
                            {selectedCategory && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="text-sm customtext-neutral-light">Mostrando:</span>
                                    <span className="bg-primary text-white px-4 py-2 rounded-full font-bold text-sm">
                                        {selectedCategory.name || selectedCategory.nombre}
                                    </span>
                                    <button
                                        onClick={() => handleCategoryClick(null)}
                                        className="text-sm text-gray-500 hover:text-primary transition-colors underline"
                                    >
                                        Ver todos
                                    </button>
                                </div>
                            )}
                            
                           
                        </div>
                    </div>

                    {/* Productos */}
                    {loading ? (
                        <Loading />
                    ) : products && products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                            {products.map((product) => (
                                <ProductCardSelector
                                    key={product.id}
                                    cardType={data?.type_card_product || 'ProductCard'}
                                    product={product}
                                    data={data}
                                    cart={cart}
                                    setCart={setCart}
                                    favorites={favorites}
                                    setFavorites={setFavorites}
                                    handleProductClick={handleProductClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <NoResults />
                    )}
                </div>
            </section>
        </div>
    );
};

export default FilterHuaillys;
