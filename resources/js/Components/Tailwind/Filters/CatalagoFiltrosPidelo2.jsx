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
import FiltersScraping from "./Components/FiltersScraping";

const itemsRest = new ItemsRest();

const SkeletonCard = () => {
    return (
        <div
            className={`group font-paragraph animate-pulse w-full transition-transform duration-300 hover:scale-105  sm:w-1/3 flex-shrink-0 font-paragraph customtext-primary cursor-pointer`}
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

//const CatalagoFiltrosPidelo2 = ({ items, data, categories, brands, prices, cart, setCart }) => {
const CatalagoFiltrosPidelo2 = ({
    items,
    data,
    filteredData,
    cart,
    setCart,
}) => {
    const { categories, brands, priceRanges } = filteredData;
    const [selectedFilters, setSelectedFilters] = useState({});

    const [filters, setFilters] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });
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
                filters: selectedFilters, // Envía los filtros seleccionados al backend
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
            console.log(response.filters);
            setFilters(response.filters);
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

    const sortOptions = [
        { value: "created_at:desc", label: "Más reciente" },
        { value: "created_at:asc", label: "Mas antiguo" },
        { value: "final_price:asc", label: "Precio: Menor a Mayor" },
        { value: "final_price:desc", label: "Precio: Mayor a Menor" },
        { value: "name:asc", label: "Nombre: A-Z" },
        { value: "name:desc", label: "Nombre: Z-A" },
    ];

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

    const handleFilterChange = (filterKey, value) => {
        setSelectedFilters((prevFilters) => {
            const prevValues = prevFilters[filterKey] || []; // Obtener valores previos del filtro
            let newValues;

            if (prevValues.includes(value)) {
                // Si el valor ya está en la lista, lo quitamos (deseleccionar)
                newValues = prevValues.filter((v) => v !== value);
            } else {
                // Si no está, lo agregamos
                newValues = [...prevValues, value];
            }

            return {
                ...prevFilters,
                [filterKey]: newValues,
            };
        });
    };

    const filteredProducts = () => {
        fetchProductsScraping(searchParam, providerParam);
    };

    return (
        <section className="py-12 bg-[#F7F9FB] font-paragraph">
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

                        {Object.entries(filters).map(([filterKey, options]) => (
                            <FiltersScraping
                                key={filterKey}
                                title={
                                    filterKey.charAt(0).toUpperCase() +
                                    filterKey.slice(1)
                                }
                                options={options}
                                onFilterChange={(selectedValues) =>
                                    handleFilterChange(
                                        filterKey,
                                        selectedValues
                                    )
                                }
                            />
                        ))}
                        {/*NUEVOS FILTROS POR CONSULTA */}

                        <button
                            onClick={() => filteredProducts()}
                            className="w-full bg-primary text-white py-3 rounded-xl hover:brightness-90 transition-colors text-sm font-bold"
                        >
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
            </div>
        </section>
    );
};

export default CatalagoFiltrosPidelo2;
