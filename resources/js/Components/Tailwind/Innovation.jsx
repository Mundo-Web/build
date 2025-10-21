import React from "react";

const InnovationSimple = React.lazy(() => import("./Innovations/InnovationSimple"));
const InnovationGrid = React.lazy(() => import("./Innovations/InnovationGrid"));
const InnovationCarousel = React.lazy(() => import("./Innovations/InnovationCarousel"));

const Innovation = ({
    data,
    items,
    which,
}) => {
    const getInnovation = () => {
        switch (which) {
            case "InnovationSimple":
                return <InnovationSimple data={data} items={items} />
            case "InnovationGrid":
                return <InnovationGrid data={data} items={items} />
            case "InnovationCarousel":
                return <InnovationCarousel data={data} items={items} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getInnovation();
};

export default Innovation;
