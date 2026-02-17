import React from "react";

const LegalSimple = React.lazy(() => import("./Legal/LegalSimple"));

const Legal = ({ which, data, generals }) => {
    const getLegal = () => {
        switch (which) {
            case "LegalSimple":
                return <LegalSimple data={data} generals={generals} />;
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getLegal();
};

export default Legal;
