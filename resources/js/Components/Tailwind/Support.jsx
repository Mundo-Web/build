import React from "react";


const SupportDownloadCenter = React.lazy(() => import("./Support/SupportDownloadCenter"));

const Support = ({
    which,
    data,
    items
}) => {
    const getSupport = () => {
        switch (which) {
         
            case "SupportDownloadCenter":
                return (
                    <SupportDownloadCenter
                        data={data}
                        items={items}
                    />
                );
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getSupport();
};

export default Support;
