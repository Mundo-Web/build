import React from "react";
import ServicesRest from "../../Actions/ServicesRest";

const ServiceDetailSimple = React.lazy(() => import("./Services/ServiceDetailSimple"));
const ServiceDetailCatalog = React.lazy(() => import("./Services/ServiceDetailCatalog"));

const servicesRest = new ServicesRest();

const ServiceDetail = ({
    data,
    items,
    which,
    currentService = null,
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
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getServiceDetail();
};

export default ServiceDetail;
