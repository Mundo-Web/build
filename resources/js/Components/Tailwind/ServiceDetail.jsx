import React from "react";

const ServiceDetailSimple = React.lazy(() => import("./Services/ServiceDetailSimple"));
const ServiceDetailCatalog = React.lazy(() => import("./Services/ServiceDetailCatalog"));

const ServiceDetail = ({
    data,
    items,
    which,
    currentService = null,
}) => {
    const getServiceDetail = () => {
        switch (which) {
            case "ServiceDetailSimple":
                return <ServiceDetailSimple data={data} items={items} currentService={currentService} />
            case "ServiceDetailCatalog":
                return <ServiceDetailCatalog data={data} items={items} currentService={currentService} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getServiceDetail();
};

export default ServiceDetail;
