import React, { useEffect, useState } from "react"


import BlogHeaderMultivet from "./Components/BlogHeaderMultivet";
import BlogListMultivet from "./Components/BlogListMultivet";

const BlogMultivet = ({ data, headerPosts, filteredData, postsLatest }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    
    return (
        <>
            <BlogHeaderMultivet
                data={data}
                headerPosts={headerPosts}
                loading={loading}
                setLoading={setLoading}
                posts={posts}
                setPosts={setPosts}
                filteredData={filteredData}
                isFilter={isFilter}
                setIsFilter={setIsFilter}
            />

            <BlogListMultivet
                data={data}
                postsLatest={postsLatest}
                posts={posts}
                loading={loading}
                setLoading={setLoading}
                isFilter={isFilter}
                setIsFilter={setIsFilter}
            />
        </>
    );
}

export default BlogMultivet;