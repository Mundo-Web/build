import React, { useEffect, useState } from "react";
import BlogHeaderMiBalon from "./Components/BlogHeaderMiBalon";
import BlogListMiBalon from "./Components/BlogListMiBalon";
import PostsRest from "../../../Actions/PostsRest";

const postsRest = new PostsRest();

const BlogMiBalon = ({ 
    data, 
    headerPosts: initialHeaderPosts, 
    filteredData: initialFilteredData, 
    postsLatest: initialPostsLatest 
}) => {
    const [posts, setPosts] = useState(initialPostsLatest || []);
    const [headerPosts, setHeaderPosts] = useState(initialHeaderPosts || []);
    const [filteredData, setFilteredData] = useState(initialFilteredData || { categories: [] });
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true);
            try {
                const postsRes = await postsRest.paginate({
                    take: 3,
                    sort: [{ selector: "created_at", desc: true }],
                });

                if (postsRes && postsRes.data) {
                    setHeaderPosts(postsRes.data);
                }
            } catch (error) {
                console.error("Error fetching blog data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, []);

    return (
        <div id={data?.element_id || null}>
            <BlogHeaderMiBalon
                data={data}
                headerPosts={headerPosts}
                filteredData={filteredData}
            />

            <BlogListMiBalon
                data={data}
                postsLatest={posts}
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

export default BlogMiBalon;
