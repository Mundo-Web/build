import React from "react";

const SectorFimesac = React.lazy(() => import("./Sectors/SectorFimesac"));

const Sector = ({ data, which, items, generals }) => {
    const getSector = () => {
        switch (which) {
            case "SectorFimesac":
                return <SectorFimesac data={data} items={items} generals={generals} />;
            default:
                return (
                    <div className="w-full px-[5%] max-w-7xl p-4 mx-auto text-neutral-dark font-bold">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getSector();
};

export default Sector;
