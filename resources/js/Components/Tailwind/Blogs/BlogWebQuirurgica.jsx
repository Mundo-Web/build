import React, { useEffect, useState } from "react"

import BlogHeaderWebQuirurgica from "./Components/BlogHeaderWebQuirurgica";
import BlogListWebQuirurgica from "./Components/BlogListWebQuirurgica";

const BlogWebQuirurgica = ({ data, headerPosts, filteredData, postsLatest }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    
    return (
        <div id={data?.element_id || null}>
            <BlogHeaderWebQuirurgica
                data={data}
                headerPosts={headerPosts}
                filteredData={filteredData}
            />

            <BlogListWebQuirurgica
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
}

export default BlogWebQuirurgica;
