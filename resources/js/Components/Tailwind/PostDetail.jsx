import React from "react";

const PostDetailSimple = React.lazy(
    () => import("./PostDetails/PostDetailSimple"),
);
const PostDetailRainstar = React.lazy(
    () => import("./PostDetails/PostDetailRainstar"),
);

const PostDetail = ({
    data,
    which,
    item,
    generals = [],
    cart,
    setCart,
    pages,
}) => {
    const getPostDetail = () => {
        switch (which) {
            case "PostDetailSimple":
                return <PostDetailSimple data={data} item={item} />;
            case "PostDetailRainstar":
                return <PostDetailRainstar data={data} item={item} />;
            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getPostDetail();
};

export default PostDetail;
