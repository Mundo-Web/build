import React from "react";

const ServiceSimple = React.lazy(() => import("./Services/ServiceSimple"));
const ServiceGrid = React.lazy(() => import("./Services/ServiceGrid"));
const ServiceCarousel = React.lazy(() => import("./Services/ServiceCarousel"));

const Service = ({
    data,
    items,
    which,
}) => {
    const getService = () => {
        switch (which) {
            case "ServiceSimple":
                return <ServiceSimple data={data} items={items} />
            case "ServiceGrid":
                return <ServiceGrid data={data} items={items} />
            case "ServiceCarousel":
                return <ServiceCarousel data={data} items={items} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getService();
};

export default Service;
