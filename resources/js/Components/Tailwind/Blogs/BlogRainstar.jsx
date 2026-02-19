import React, { useEffect, useState } from "react";

import BlogHeaderRainstar from "./Components/BlogHeaderRainstar";
import BlogListRainstar from "./Components/BlogListRainstar";

const BlogRainstar = ({ data, headerPosts, filteredData, postsLatest }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);

    return (
        <div id={data?.element_id || null}>
            <BlogHeaderRainstar
                data={data}
                headerPosts={headerPosts}
                filteredData={filteredData}
            />

            <BlogListRainstar
                data={data}
                postsLatest={postsLatest}
                posts={posts}
                loading={loading}
                setLoading={setLoading}
                isFilter={isFilter}
                setIsFilter={setIsFilter}
                filteredData={filteredData}
            />
        </div>
    );
};

export default BlogRainstar;
