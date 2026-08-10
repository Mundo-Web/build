import React from "react";

const MapFimesac = React.lazy(() => import("./Maps/MapFimesac"));

const Maps = ({ which, data, generals = [], items = [] }) => {
    switch (which) {
        case "MapFimesac":
        default:
            return <MapFimesac data={data} generals={generals} items={items} />;
    }
};

export default Maps;
