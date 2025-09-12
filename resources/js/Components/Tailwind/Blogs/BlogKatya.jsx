import React, { useEffect, useState } from "react"

import BlogHeaderKatya from "./Components/BlogHeaderKatya";
import BlogListKatya from "./Components/BlogListKatya";

const BlogKatya = ({ data, headerPosts, filteredData, postsLatest }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    
    return (
        <>
            <BlogHeaderKatya
                data={data}
                headerPosts={headerPosts}
                filteredData={filteredData}
            />

            <BlogListKatya
                data={data}
                postsLatest={postsLatest}
                posts={posts}
                loading={loading}
                setLoading={setLoading}
                isFilter={isFilter}
                setIsFilter={setIsFilter}
                filteredData={filteredData}
            />
        </>
    );
}

export default BlogKatya;