import React from "react";
import ItemsRest from "../../Actions/ItemsRest";

const itemsRest = new ItemsRest();

const FilterSimple = React.lazy(() => import("./Filters/FilterSimple"));
const CatalagoFiltros = React.lazy(() => import("./Filters/CatalagoFiltros"));
const CatalogoIbergruas = React.lazy(
    () => import("./Filters/CatalogoIbergruas"),
);
const CatalagoFiltrosPidelo = React.lazy(
    () => import("./Filters/CatalagoFiltrosPidelo"),
);
const FilterSalaFabulosa = React.lazy(
    () => import("./Filters/FilterSalaFabulosa"),
);
const FilterBananaLab = React.lazy(() => import("./Filters/FilterBananaLab"));
const FilterCategoryImage = React.lazy(
    () => import("./Filters/FilterCategoryImage"),
);
const CatalagoFiltrosAko = React.lazy(
    () => import("./Filters/CatalagoFiltrosAko"),
);
const CatalagoFiltrosPaani = React.lazy(
    () => import("./Filters/CatalagoFiltrosPaani"),
);
//const Filter = ({ which, items, data, category, brands, subcategory, cart, setCart, prices }) => {
const CatalogoFiltrosDental = React.lazy(
    () => import("./Filters/CatalogoFiltrosDental"),
);
const CatalogoFiltrosKatya = React.lazy(
    () => import("./Filters/CatalogoFiltrosKatya"),
);
const CatalogoFiltrosRainstar = React.lazy(
    () => import("./Filters/CatalogoFiltrosRainstar"),
);
const FilterHuaillys = React.lazy(() => import("./Filters/FilterHuaillys"));
const Filter = ({
    which,
    items,
    data,
    cart,
    setCart,
    filteredData,
    setFavorites,
    favorites,
}) => {
    // Función para trackear clicks en productos
    const handleClickTracking = async (item) => {
        const request = {
            id: item?.id,
            page_url: window.location.href,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
        };
        await itemsRest.updateClicks(request);
    };

    const getFilter = () => {
        switch (which) {
            case "FilterSimple":
                // return <FilterSimple data={data} category={category} subcategory={subcategory} cart={cart} setCart={setCart} />
                return (
                    <FilterSimple data={data} cart={cart} setCart={setCart} />
                );
            case "CatalagoFiltros":
                // return <CatalagoFiltros data={data} items={items} prices={prices} categories={category} brands={brands} cart={cart} setCart={setCart} />
                return (
                    <CatalagoFiltros
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "CatalagoFiltrosPidelo":
                // return <CatalagoFiltros data={data} items={items} prices={prices} categories={category} brands={brands} cart={cart} setCart={setCart} />
                return (
                    <CatalagoFiltrosPidelo
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "FilterSalaFabulosa":
                // return <CatalagoFiltros data={data} items={items} prices={prices} categories={category} brands={brands} cart={cart} setCart={setCart} />
                return (
                    <FilterSalaFabulosa
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "FilterCategoryImage":
                // return <CatalagoFiltros data={data} items={items} prices={prices} categories={category} brands={brands} cart={cart} setCart={setCart} />
                return (
                    <FilterCategoryImage
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "FilterBananaLab":
                return (
                    <FilterBananaLab
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "CatalagoFiltrosAko":
                return (
                    <CatalagoFiltrosAko
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "CatalagoFiltrosPaani":
                return (
                    <CatalagoFiltrosPaani
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                    />
                );
            case "CatalogoFiltrosDental":
                return (
                    <CatalogoFiltrosDental
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                        setFavorites={setFavorites}
                        favorites={favorites}
                        onClickTracking={handleClickTracking}
                    />
                );
            case "CatalogoFiltrosKatya":
                return (
                    <CatalogoFiltrosKatya
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                        setFavorites={setFavorites}
                        favorites={favorites}
                        onClickTracking={handleClickTracking}
                    />
                );
            case "CatalogoFiltrosRainstar":
                return (
                    <CatalogoFiltrosRainstar
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                        setFavorites={setFavorites}
                        favorites={favorites}
                        onClickTracking={handleClickTracking}
                    />
                );
            case "FilterHuaillys":
                return (
                    <FilterHuaillys
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                        setFavorites={setFavorites}
                        favorites={favorites}
                        onClickTracking={handleClickTracking}
                    />
                );
            case "CatalogoIbergruas":
                return (
                    <CatalogoIbergruas
                        data={data}
                        items={items}
                        cart={cart}
                        setCart={setCart}
                        filteredData={filteredData}
                        setFavorites={setFavorites}
                        favorites={favorites}
                        onClickTracking={handleClickTracking}
                    />
                );
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getFilter();
};

export default Filter;
