import React from "react";
import ItemsRest from "../../Actions/ItemsRest";

const itemsRest = new ItemsRest();

const ProductDetailSimple = React.lazy(
    () => import("./ProductDetails/ProductDetailSimple"),
);
const ProductDetailB = React.lazy(
    () => import("./ProductDetails/ProductDetailB"),
);
const ScrapingProductDetail = React.lazy(
    () => import("./Scraping/ScrapingProductDetail"),
);
const ProductDetailSF = React.lazy(
    () => import("./ProductDetails/ProductDetailSF"),
);
const ProductDetailBananaLab = React.lazy(
    () => import("./ProductDetails/ProductDetailBananaLab"),
);
const ProductDetailKuchara = React.lazy(
    () => import("./ProductDetails/ProductDetailKuchara"),
);
const ProductDetailPaani = React.lazy(
    () => import("./ProductDetails/ProductDetailPaani"),
);
const ProductDetailAko = React.lazy(
    () => import("./ProductDetails/ProductDetailAko"),
);
const ProductDetailDental = React.lazy(
    () => import("./ProductDetails/ProductDetailDental"),
);
const ProductDetailPidelo = React.lazy(
    () => import("./ProductDetails/ProductDetailPidelo"),
);
const ProductDetailMultivet = React.lazy(
    () => import("./ProductDetails/ProductDetailMultivet"),
);
const ProductDetailIbergruas = React.lazy(
    () => import("./ProductDetails/ProductDetailIbergruas"),
);
const ProductDetailKatya = React.lazy(
    () => import("./ProductDetails/ProductDetailKatya"),
);
const ProductDetailHuaillys = React.lazy(
    () => import("./ProductDetails/ProductDetailHuaillys"),
);
const ProductDetailRainstar = React.lazy(
    () => import("./ProductDetails/ProductDetailRainstar"),
);
const ProductDetail = ({
    which,
    item,
    cart,
    setCart,
    data,
    generals = [],
    favorites,
    setFavorites,
    textstatic,
    contacts,
}) => {
    // Función centralizada para registrar vista del producto
    const handleViewUpdate = async (product) => {
        try {
            const request = {
                id: product?.id,
                page_url: window.location.href,
            };
            await itemsRest.viewUpdate(request);
        } catch (error) {
            console.error("Error tracking product view:", error);
        }
    };

    const getProductDetail = () => {
        switch (which) {
            case "ProductDetailSimple":
                return (
                    <ProductDetailSimple
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailB":
                return (
                    <ProductDetailB
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        generals={generals}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ScrapingProductDetail":
                return (
                    <ScrapingProductDetail
                        cart={cart}
                        setCart={setCart}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailSF":
                return (
                    <ProductDetailSF
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        textstatic={textstatic}
                        contacts={contacts}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailBananaLab":
                return (
                    <ProductDetailBananaLab
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailKuchara":
                return (
                    <ProductDetailKuchara
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailPaani":
                return (
                    <ProductDetailPaani
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailAko":
                return (
                    <ProductDetailAko
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        textstatic={textstatic}
                        contacts={contacts}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailDental":
                return (
                    <ProductDetailDental
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        data={data}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailPidelo":
                return (
                    <ProductDetailPidelo
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        textstatic={textstatic}
                        contacts={contacts}
                        data={data}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailMultivet":
                return (
                    <ProductDetailMultivet
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailIbergruas":
                return (
                    <ProductDetailIbergruas
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailKatya":
                return (
                    <ProductDetailKatya
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailHuaillys":
                return (
                    <ProductDetailHuaillys
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        generals={generals}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        onViewUpdate={handleViewUpdate}
                    />
                );
            case "ProductDetailRainstar":
                return (
                    <ProductDetailRainstar
                        item={item}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        generals={generals}
                        onViewUpdate={handleViewUpdate}
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
    return getProductDetail();
};

export default ProductDetail;
