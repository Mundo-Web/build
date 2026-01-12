import React from "react";
import ServicesRest from "../../Actions/ServicesRest";

const ServiceSimple = React.lazy(() => import("./Services/ServiceSimple"));
const ServiceGrid = React.lazy(() => import("./Services/ServiceGrid"));
const ServiceCarousel = React.lazy(() => import("./Services/ServiceCarousel"));
const ServiceSelection = React.lazy(() => import("./Services/ServiceSelection"));
const ServiceSidebar = React.lazy(() => import("./Services/ServiceSidebar"));
const ServiceLaPetaca = React.lazy(() => import("./Services/ServiceLaPetaca"));
const ServiceWebQuirurgica = React.lazy(() => import("./Services/ServiceWebQuirurgica"));
const ServiceWebQuirurgica2 = React.lazy(() => import("./Services/ServiceWebQuirurgica2"));

const servicesRest = new ServicesRest();

const Service = ({
    data,
    items,
    which,
}) => {
    // Función centralizada para registrar clicks en servicios
    // El backend se encarga de validar IP/cookie para evitar spam
    const handleClickTracking = async (service) => {
        try {
            const request = {
                id: service?.id,
                page_url: window.location.href,
                referrer: document.referrer || null,
                // El backend usará estos datos + IP para prevenir duplicados
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            await servicesRest.updateClicks(request);
        } catch (error) {
            console.error('Error tracking service click:', error);
        }
    };
    const getService = () => {
        switch (which) {
            case "ServiceSimple":
                return <ServiceSimple data={data} items={items} onClickTracking={handleClickTracking} />
            case "ServiceGrid":
                return <ServiceGrid data={data} items={items} onClickTracking={handleClickTracking} />
            case "ServiceCarousel":
                return <ServiceCarousel data={data} items={items} onClickTracking={handleClickTracking} />;
            case "ServiceSelection":
                return <ServiceSelection data={data} onClickTracking={handleClickTracking} />;
            case "ServiceSidebar":
                return <ServiceSidebar data={data} items={items} onClickTracking={handleClickTracking} />;
            case "ServiceLaPetaca":
                return <ServiceLaPetaca data={data} items={items} onClickTracking={handleClickTracking} />;
            case "ServiceWebQuirurgica":
                return <ServiceWebQuirurgica data={data} items={items} onClickTracking={handleClickTracking} />;
            case "ServiceWebQuirurgica2":
                return <ServiceWebQuirurgica2 data={data} items={items} onClickTracking={handleClickTracking} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getService();
};

export default Service;
