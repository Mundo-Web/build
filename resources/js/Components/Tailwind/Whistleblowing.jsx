import React from "react";

const WhistleblowingStech = React.lazy(() => import("./Whistleblowings/WhistleblowingStech"));

const Whistleblowing = ({ which, data, generals }) => {
    const getWhistleblowing = () => {
        switch (which) {
            case "WhistleblowingStech":
                return <WhistleblowingStech data={data} generals={generals} />;

            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getWhistleblowing();
};

export default Whistleblowing;
