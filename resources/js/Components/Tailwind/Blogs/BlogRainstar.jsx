import React from "react";
import BlogHeaderRainstar from "./Components/BlogHeaderRainstar";
import BlogListRainstar from "./Components/BlogListRainstar";

const BlogRainstar = ({
    data,
    headerPosts,
    postsLatest,
    filteredData,
    filterProps = {},
}) => {
    // 3 latest posts for header
    const safePostsLatest = Array.isArray(postsLatest) ? postsLatest : [];
    const headerPostsList = safePostsLatest.slice(0, 3);

    return (
        <div id={data?.element_id || null}>
            <BlogHeaderRainstar
                data={data}
                headerPosts={headerPostsList}
                filteredData={filteredData}
            />

            <BlogListRainstar
                data={data}
                filterProps={filterProps}
            />
        </div>
    );
};

export default BlogRainstar;
