import React from "react";

const BrandMakita = React.lazy(() => import("./Brands/BrandMakita"));
const BrandMultivet = React.lazy(() => import("./Brands/BrandMultivet"));

const Brands = ({
    data,
    items,
    which,
    headerPosts,
    filteredData,
    postsLatest,
}) => {
    const getBrand = () => {
        switch (which) {
            case "BrandMakita":
                return <BrandMakita data={data} headerPosts={headerPosts} postsLatest={postsLatest} filteredData={filteredData} />
            case "BrandMultivet":
                return <BrandMultivet data={data} items={items} />
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getBrand();
};

export default Brands;
