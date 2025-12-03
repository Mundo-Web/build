import React from "react";

const SearchWidget = React.lazy(() => import("./Hotel/SearchWidget"));
const RoomCard = React.lazy(() => import("./Hotel/RoomCard"));
const RoomsList = React.lazy(() => import("./Hotel/RoomsList"));
const RoomDetail = React.lazy(() => import("./Hotel/RoomDetail"));
const BookingSummary = React.lazy(() => import("./Hotel/BookingSummary"));
const BookingCartCard = React.lazy(() => import("./Hotel/BookingCartCard"));

const Hotel = ({ which, ...props }) => {
    const getComponent = () => {
        switch (which) {
            case "SearchWidget":
                return <SearchWidget {...props} />;
            case "RoomCard":
                return <RoomCard {...props} />;
            case "RoomsList":
                return <RoomsList {...props} />;
            case "RoomDetail":
                return <RoomDetail {...props} />;
            case "BookingSummary":
                return <BookingSummary {...props} />;
            case "BookingCartCard":
                return <BookingCartCard {...props} />;
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> en Hotel -
                    </div>
                );
        }
    };

    return getComponent();
};

export default Hotel;
