import React, { useEffect, useState } from "react"
import BlogHeader from "./Components/BlogHeader";
import BlogList from "./Components/BlogList";



const BlogSimple = ({ data, headerPosts, filteredData, postsLatest }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    return (
        <div id={data?.element_id || null}>
            <BlogHeader
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

            <BlogList
                data={data}
                postsLatest={postsLatest}
                posts={posts}
                loading={loading}
                setLoading={setLoading}
                isFilter={isFilter}
                setIsFilter={setIsFilter}
            />
        </div>
    );


}


export default BlogSimple;