import { useEffect, useRef, useState } from "react";
import Global from "../../../../Utils/Global";
import { Search } from "lucide-react";
import ScrapRest from "../../../../Actions/Scraping/ScrapRest";

import SelectFormScraping from "./SelectForm";

const HeaderScraping = ({
    data,
    pages,
    setLoading,
    products,
    setProducts,
    loading,
}) => {
    const searchRef = useRef();

    const options = [
        { value: "nike", label: "Nike" },
        { value: "shopsimon", label: "Shop Simon" },
        { value: "ashford", label: "Ashford" },
        /* { value: "invictastores", label: "Invicta Stores" },
        { value: "gapfactory", label: "Gap Factory" },
        { value: "sephora", label: "Sephora" },*/
    ];
    const [search, setSearch] = useState("");
    const [proveedor, setProveedor] = useState("nike");
    /* onClick={async () => {
                                        if (!searchRef.current.value.trim()) {
                                            alert("Por favor, ingresa un término de búsqueda");
                                            return;
                                        }
                                        setLoading(true);
                                        try {
                                            const products = await ScrapRest.getProducts({
                                                query: searchRef.current.value,
                                                proveedor: proveedor,
                                            });
                                            setProducts(products.data);
                                        } catch (error) {
                                            console.error('Error:', error);
                                            alert("Hubo un error al realizar la búsqueda. Por favor, intenta nuevamente.");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }} */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("search")) {
            setSearch(params.get("search"));
        }
        if (params.get("provider")) {
            setProveedor(params.get("provider"));
        }
    }, []); // Agrega `items` como dependencia
    return (
        <header className="w-full font-paragraph">
            <div className="px-primary mx-auto py-4 font-paragraph customtext-primary text-base font-semibold">
                <div className="flex items-center justify-between gap-4 ">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2">
                        <img
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`}
                            alt={Global.APP_NAME}
                            className="h-14  object-contain object-center"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/img/logo-bk.svg';
                            }}
                        />
                    </a>

                    {/* Search Bar */}

                    <div className="relative w-full max-w-xl flex border rounded-full items-center justify-center ">
                        <div className="w-2/6 relative pl-2 before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-[1px] before:bg-[#E4E4E4]">
                            <SelectFormScraping
                                options={options}
                                placeholder="Nike"
                                defaultValue={proveedor}
                                onChange={(value) => setProveedor(value)}
                                labelKey="label"
                                valueKey="value"
                            />
                        </div>

                        <div className="w-4/6">
                            <input
                                type="search"
                                placeholder="Buscar productos"
                                ref={searchRef}
                                value={search} // Vincula el valor del input al estado
                                onChange={(e) => setSearch(e.target.value)} // Actualiza el estado cuando el usuario escribe
                                className="w-full pr-14 py-4 pl-4 border-none rounded-full focus:ring-0 focus:outline-none"
                            />
                            <a
                                href={
                                    search.trim()
                                        ? `/catalogo?search=${encodeURIComponent(
                                            search
                                        )}&provider=${encodeURIComponent(
                                            proveedor
                                        )}`
                                        : "#"
                                }
                                className="inline-flex absolute  items-center justify-center gap-2 right-3 text-sm customtext-primary top-1/2 transform -translate-y-1/2 py-2 px-3 bg-black  rounded-xl"
                                aria-label="Buscar"
                            >
                                <Search />
                                Buscar
                            </a>
                        </div>
                    </div>

                    <ul className="list-none flex gap-4 text-lg">
                        {pages.map(
                            (page, index) =>
                                page.menuable && ( // Simplified conditional rendering
                                    <li key={index} className="py-3">
                                        <a
                                            href={page.path}
                                            className="hover:customtext-primary cursor-pointer transition-all duration-300 pr-6  "
                                        >
                                            {page.name}
                                        </a>
                                    </li>
                                )
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};
export default HeaderScraping;
