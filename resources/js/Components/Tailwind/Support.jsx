import React from "react";

const SupportSimple = React.lazy(() => import("./Support/SupportSimple"));
const SupportWithTabs = React.lazy(() => import("./Support/SupportWithTabs"));
const SupportDownloadCenter = React.lazy(() => import("./Support/SupportDownloadCenter"));

const Support = ({
    which,
    data,
    items
}) => {
    const getSupport = () => {
        switch (which) {
            case "SupportSimple":
                return (
                    <SupportSimple
                        data={data}
                        items={items}
                    />
                );
            case "SupportWithTabs":
                return (
                    <SupportWithTabs
                        data={data}
                        items={items}
                    />
                );
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
