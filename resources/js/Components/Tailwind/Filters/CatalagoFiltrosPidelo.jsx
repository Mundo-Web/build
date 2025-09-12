import React, { useEffect, useState } from "react";

import CardHoverBtn from "../Products/Components/CardHoverBtn";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    Tag,
} from "lucide-react";
import ItemsRest from "../../../Actions/ItemsRest";
import ArrayJoin from "../../../Utils/ArrayJoin";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "./Components/SelectForm";
import ProductCardScraping from "../Scraping/Components/ProductCardScraping";
import { set } from "sode-extend-react/sources/cookies";
import ScrapRest from "../../../Actions/Scraping/ScrapRest";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const itemsRest = new ItemsRest();

const SkeletonCard = () => {
    return (
        <div
            className={`group font-font-general animate-pulse w-full transition-transform duration-300 hover:scale-105  sm:w-1/3 flex-shrink-0 font-font-general customtext-primary cursor-pointer`}
        >
            <div className=" px-4">
                <div className="bg-white rounded-3xl">
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative">
                        <div className="aspect-square bg-gray-300 rounded-3xl overflow-hidden flex items-center justify-center  bg-secondary">
                            <svg
                                class="w-10 h-10 text-gray-200 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 18"
                            >
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

//const CatalagoFiltrosPidelo = ({ items, data, categories, brands, prices, cart, setCart }) => {
const CatalagoFiltrosPidelo = ({
    items,
    data,
    filteredData,
    cart,
    setCart,
}) => {
    const { categories, brands, priceRanges } = filteredData;
    const [sections, setSections] = useState({
        marca: true,
        precio: true,
        categoria: true,
        colores: false,
    });

    const [selectedFilters, setSelectedFilters] = useState({
        category_id: [], // Array para múltiples categorías
        brand_id: [], // Array para múltiples marcas
        subcategory_id: [],
        price: null,
        name: null,
        sort_by: "created_at",
        order: "desc",
    });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });

    const transformFilters = (filters) => {
        const transformedFilters = [];

        // Categorías
        if (filters.category_id.length > 0) {
            const categoryConditions = filters.category_id.map((id) => [
                "category_id",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...categoryConditions]);
        }
        //subcategorias
        if (filters.subcategory_id.length > 0) {
            const subcategoryConditions = filters.subcategory_id.map((id) => [
                "subcategory_id",
                "=",
                id,
            ]);
            transformedFilters.push(["and", ...subcategoryConditions]);
        }
        // Marcas
        if (filters.brand_id.length > 0) {
            const brandConditions = filters.brand_id.map((id) => [
                "brand_id",
                "=",
                id,
            ]);
            transformedFilters.push(["or", ...brandConditions]);
        }

        // Precio
        if (filters.price) {
            transformedFilters.push([
                "and",
                [
                    ["final_price", ">=", filters.price.min],
                    "and",
                    ["final_price", "<=", filters.price.max],
                ],
            ]);
        }

        // Búsqueda (asumiendo que se filtra por título o contenido)
        if (filters.name) {
            transformedFilters.push(["name", "contains", filters.name]);
        }
        return transformedFilters;
    };
    // Obtener productos filtrados desde el backend
    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            // Transformar los filtros al formato esperado por el backend
            const filters = transformFilters(selectedFilters);
            const params = {
                filter: filters, // Envía los filtros transformados
                sort: selectedFilters.sort, // Enviar el parámetro de ordenación
                // page,
                take: 20, // Número de productos por página
            };

            const response = await itemsRest.paginate(params);

            setProducts(response.data);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.lastPage,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    /* const fetchProductsScraping = async (query, provider) => {
        if (!query) {
            alert("Por favor, ingresa un término de búsqueda");
            return;
        }
        setLoading(true);
        try {
            const products = await ScrapRest.getProducts({
                query: query,
                proveedor: provider,
            });
            setProducts(products.data);
            console.log(products.data);
        } catch (error) {
            console.error('Error:', error);
            alert("Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    }*/

    const fetchProductsScraping = async (query, provider, page = 1) => {
        if (!query) {
            alert("Por favor, ingresa un término de búsqueda");
            return;
        }

        setLoading(true);
        try {
            const response = await ScrapRest.getProducts({
                query: query,
                proveedor: provider,
                page: page, // Agregamos la paginación a la consulta
            });

            if (page === 1) {
                setProducts(response.data); // Si es la primera página, reemplaza los productos
            } else {
                setProducts((prevProducts) => [
                    ...prevProducts,
                    ...response.data,
                ]); // Si es otra página, añade los nuevos productos
            }

            setPagination({
                currentPage: response.currentPage,
                totalPages: response.lastPage,
            });

            console.log(response.data);
        } catch (error) {
            console.error("Error:", error);
            alert(
                "Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente."
            );
        } finally {
            setLoading(false);
        }
    };

    const [searchParam, setSearchParam] = useState("");
    const [providerParam, setProviderParam] = useState("nike");
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoriaParam = params.get("category");

        if (categoriaParam) {
            const category = categories.find(
                (item) => item.slug === categoriaParam
            ); // Usa .find() en lugar de .filter()

            if (category) {
                setSelectedFilters((prev) => ({
                    ...prev,
                    category_id: [category.id], // Asegúrate de que `category.id` exista
                }));
            }
        }

        setSearchParam(params.get("search"));
        setProviderParam(params.get("provider"));
        if (searchParam) {
            fetchProductsScraping(searchParam, providerParam);
        }
    }, [items]); // Agrega `items` como dependencia

    // Manejar cambios en los filtros
    const handleFilterChange = (type, value) => {
        setSelectedFilters((prev) => {
            if (type === "price") {
                // Si el mismo rango ya está seleccionado, lo deseleccionamos; de lo contrario, lo asignamos
                return {
                    ...prev,
                    price:
                        prev.price &&
                        prev.price.min === value.min &&
                        prev.price.max === value.max
                            ? null
                            : value,
                };
            }

            // Asegúrate de que prev[type] sea un array antes de usar .includes()
            const currentValues = Array.isArray(prev[type]) ? prev[type] : [];

            // Manejar múltiples valores para categorías y marcas
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value) // Eliminar si ya está seleccionado
                : [...currentValues, value]; // Agregar si no está seleccionado

            return { ...prev, [type]: newValues };
        });
    };

    // Alternar secciones de filtros
    const toggleSection = (section) => {
        setSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
        { value: "final_price:asc", label: "Precio: Menor a Mayor" },
        { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
    ];

    const [searchCategory, setSearchCategory] = useState("");
    const [searchBrand, setSearchBrand] = useState("");

    // Filtrar categorías según el input
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchCategory.toLowerCase())
    );

    // Filtrar marcas según el input
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchBrand.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Calcular los productos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(products)
        ? products.slice(indexOfFirstItem, indexOfLastItem)
        : [];

    // Calcular el total de páginas
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="py-12 bg-[#F7F9FB] font-font-general">
            <div className="mx-auto px-primary">
                <div className="flex justify-between items-center mb-8 pb-4 border-b-2">
                    <h2 className="text-4xl font-bold w-6/12">
                        Todos los productos
                    </h2>
                    <div className="flex items-center gap-4 w-5/12">
                        <div className="flex justify-end items-center mb-4 w-full">
                            {/* Ordenación <span className='block w-6/12'>Productos seleccionados: <strong>{products?.length}</strong></span>*/}

                            <div className="customtext-neutral-dark font-semibold">
                                <nav class="flex items-center gap-x-2 min-w-max">
                                    <button
                                        class=" p-4 inline-flex items-center"
                                        onClick={() => {
                                            setCurrentPage(currentPage - 1);
                                        }}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft />
                                    </button>

                                    <ul className="list-none flex gap-2">
                                        {[...Array(totalPages).keys()].map(
                                            (number) => (
                                                <li
                                                    key={number + 1}
                                                    className={`page-item ${
                                                        currentPage ===
                                                        number + 1
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            paginate(number + 1)
                                                        }
                                                        class={`w-10 h-10  p-2 inline-flex items-center justify-center rounded-full transition-all duration-300  hover:text-white hover:bg-primary ${
                                                            currentPage ===
                                                            number + 1
                                                                ? "bg-primary text-white"
                                                                : " bg-transparent"
                                                        }`}
                                                        aria-current="page"
                                                    >
                                                        {number + 1}
                                                    </button>
                                                </li>
                                            )
                                        )}
                                    </ul>

                                    <button
                                        class=" p-4 inline-flex items-center "
                                        onClick={() => {
                                            const nextPage = currentPage + 1; // Calculamos el siguiente valor antes de actualizar el estado
                                            if (nextPage <= totalPages) {
                                                setCurrentPage(nextPage);
                                            } else {
                                                setCurrentPage(nextPage);
                                                fetchProductsScraping(
                                                    searchParam,
                                                    providerParam,
                                                    nextPage
                                                ); // Usamos el nuevo valor
                                            }
                                            console.log(
                                                "Página solicitada:",
                                                nextPage
                                            );
                                        }}
                                        disabled={
                                            currentPage === totalPages &&
                                            providerParam === "invictastores"
                                        }
                                    >
                                        <ChevronRight />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative flex gap-4">
                    <div className="w-3/12 bg-white p-4 rounded-lg h-max">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Filtros</h2>
                            <Filter className="h-5 w-5" />
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("marca")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Marca</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.marca ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.marca && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className={`w-full px-4 pl-10 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}
                                            value={searchBrand}
                                            onChange={(e) =>
                                                setSearchBrand(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        {filteredBrands.map((brand) => (
                                            <label
                                                key={brand.id}
                                                className="flex items-center space-x-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "brand_id",
                                                            brand.id
                                                        )
                                                    }
                                                />
                                                <span>{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Precio Section */}
                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("precio")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Precio</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.precio ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.precio && (
                                <div className="space-y-3">
                                    {priceRanges.map((range) => (
                                        <label
                                            key={`${range.min}-${range.max}`}
                                            className="flex items-center space-x-3"
                                        >
                                            <input
                                                type="checkbox"
                                                name="precio"
                                                className="h-4 w-4 rounded border-gray-300"
                                                onChange={() =>
                                                    handleFilterChange(
                                                        "price",
                                                        range
                                                    )
                                                }
                                                checked={
                                                    selectedFilters.price &&
                                                    selectedFilters.price
                                                        .min === range.min &&
                                                    selectedFilters.price
                                                        .max === range.max
                                                }
                                            />
                                            <span>{`${CurrencySymbol()} ${range.min} - ${CurrencySymbol()} ${range.max}`}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={() => toggleSection("categoria")}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="font-medium">Categoría</span>
                                <ChevronDown
                                    className={`h-5 w-5 transform transition-transform ${
                                        sections.categoria ? "" : "-rotate-180"
                                    }`}
                                />
                            </button>
                            {sections.categoria && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            className={`w-full px-4 pl-10 py-3 border customtext-neutral-dark  border-neutral-ligth rounded-xl focus:ring-0 focus:outline-0   transition-all duration-300`}
                                            value={searchCategory}
                                            onChange={(e) =>
                                                setSearchCategory(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {filteredCategories.map((category) => (
                                        <div key={category.id}>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300"
                                                    onChange={() =>
                                                        handleFilterChange(
                                                            "category_id",
                                                            category.id
                                                        )
                                                    }
                                                    checked={selectedFilters.category_id?.includes(
                                                        category.id
                                                    )} // <-- Agregado
                                                />
                                                <span>{category.name}</span>
                                            </label>

                                            {/* Mostrar subcategorías si la categoría está seleccionada */}
                                            {selectedFilters.category_id?.includes(
                                                category.id
                                            ) &&
                                                category.subcategories?.length >
                                                    0 && (
                                                    <ul className="ml-6 mt-2 space-y-2">
                                                        {category.subcategories.map(
                                                            (sub) => (
                                                                <label
                                                                    key={sub.id}
                                                                    className="flex items-center space-x-3"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="h-4 w-4 rounded border-gray-300"
                                                                        onChange={() =>
                                                                            handleFilterChange(
                                                                                "subcategory_id",
                                                                                sub.id
                                                                            )
                                                                        } // <-- Corregido
                                                                        checked={selectedFilters.subcategory_id?.includes(
                                                                            sub.id
                                                                        )}
                                                                    />
                                                                    <span>
                                                                        {
                                                                            sub.name
                                                                        }
                                                                    </span>
                                                                </label>
                                                            )
                                                        )}
                                                    </ul>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="w-full bg-primary text-white py-3 rounded-xl hover:brightness-90 transition-colors text-sm font-bold">
                            Aplicar Filtro
                        </button>
                    </div>

                    <div className="w-9/12">
                        {/* Productos */}
                        {loading ? (
                            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                    (index) => (
                                        <SkeletonCard key={index} />
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out">
                                {Array.isArray(products) &&
                                products.length > 0 ? (
                                    currentItems.map((product, index) => (
                                        <ProductCardScraping
                                            key={index}
                                            product={product}
                                            widthClass="lg:w-1/3"
                                            cart={cart}
                                            setCart={setCart}
                                        />
                                    ))
                                ) : (
                                    <NoResults />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Paginación 
                <div>
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => fetchProducts(pagination.currentPage - 1)}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {pagination.currentPage} de {pagination.totalPages}
                    </span>
                    <button
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => fetchProducts(pagination.currentPage + 1)}
                    >
                        Siguiente
                    </button>
                </div>*/}
            </div>
        </section>
    );
};

export default CatalagoFiltrosPidelo;
