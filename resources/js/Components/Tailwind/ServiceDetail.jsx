import React from "react";
import ServicesRest from "../../Actions/ServicesRest";

const ServiceDetailSimple = React.lazy(() => import("./Services/ServiceDetailSimple"));
const ServiceDetailCatalog = React.lazy(() => import("./Services/ServiceDetailCatalog"));
const ServiceDetailCatalogNgs = React.lazy(() => import("./Services/ServiceDetailCatalogNgs"));
const ServiceDetailCatalogFimesac = React.lazy(() => import("./Services/ServiceDetailCatalogFimesac"));

const servicesRest = new ServicesRest();

const ServiceDetail = ({
    data,
    items,
    which,
    currentService = null,
    generals,
}) => {
    // Función centralizada para registrar vista del servicio
    const handleViewUpdate = async (service) => {
        try {
            const request = {
                id: service?.id,
                page_url: window.location.href,
            };
            await servicesRest.updateViews(request);
        } catch (error) {
            console.error('Error tracking service view:', error);
        }
    };
    const getServiceDetail = () => {
        switch (which) {
            case "ServiceDetailSimple":
                return <ServiceDetailSimple data={data} items={items} currentService={currentService} onViewUpdate={handleViewUpdate} />
            case "ServiceDetailCatalog":
                return <ServiceDetailCatalog data={data} items={items} currentService={currentService} onViewUpdate={handleViewUpdate} />;
            case "ServiceDetailCatalogNgs":
                return <ServiceDetailCatalogNgs data={data} items={items} currentService={currentService} onViewUpdate={handleViewUpdate} generals={generals} />;
            case "ServiceDetailCatalogFimesac":
                return <ServiceDetailCatalogFimesac data={data} items={items} currentService={currentService} onViewUpdate={handleViewUpdate} generals={generals} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getServiceDetail();
};

export default ServiceDetail;
