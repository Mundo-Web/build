import React from "react";

const SubscriptionSimple = React.lazy(() => import('./Subscriptions/SubscriptionSimple'));

const Subscription = ({ which, data }) => {
    const getSubscription = () => {
        switch (which) {
            case 'SubscriptionSimple':
                return <SubscriptionSimple data={data} />;
            
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    
    return getSubscription();
};

export default Subscription;