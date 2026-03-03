import React, { useEffect, useState } from "react";
import BlogHeaderRainstar from "./Components/BlogHeaderRainstar";
import BlogListRainstar from "./Components/BlogListRainstar";
import PostsRest from "../../../Actions/PostsRest";
import BlogCategoriesRest from "../../../Actions/BlogCategoriesRest";

const postsRest = new PostsRest();
const blogCategoriesRest = new BlogCategoriesRest();

const BlogRainstar = ({
    data,
    headerPosts: initialHeaderPosts,
    filteredData: initialFilteredData,
    postsLatest: initialPostsLatest,
}) => {
    const [posts, setPosts] = useState(initialPostsLatest || []);
    const [headerPosts, setHeaderPosts] = useState(initialHeaderPosts || []);
    const [filteredData, setFilteredData] = useState(
        initialFilteredData || { categories: [] },
    );
    const [loading, setLoading] = useState(false);
    const [isFilter, setIsFilter] = useState(false);

    useEffect(() => {
        const fetchBlogData = async () => {
            setLoading(true);
            try {
                // Fetch posts
                // Using paginate with a larger limit to get posts for both header and list
                const postsRes = await postsRest.paginate({
                    length: 15,
                    sort: [{ selector: "created_at", desc: true }],
                });

                if (postsRes && postsRes.data) {
                    const allPosts = postsRes.data;
                    setHeaderPosts(allPosts.slice(0, 3));
                    setPosts(allPosts);
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
            <BlogHeaderRainstar
                data={data}
                headerPosts={headerPosts}
                filteredData={filteredData}
            />

            <BlogListRainstar
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

export default BlogRainstar;
