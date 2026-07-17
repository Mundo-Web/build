import React, { useState, useEffect } from "react";
import PostsRest from "../../Actions/PostsRest";
import BlogCategoriesRest from "../../Actions/BlogCategoriesRest";

const postsRest = new PostsRest();
const blogCategoriesRest = new BlogCategoriesRest();

const BlogSimple = React.lazy(() => import("./Blogs/BlogSimple"));
const BlogMultivet = React.lazy(() => import("./Blogs/BlogMultivet"));
const BlogCarousel = React.lazy(() => import("./Blogs/BlogCarousel"));
const BlogCarruselBananaLab = React.lazy(
    () => import("./Blogs/BlogCarruselBananaLab"),
);
const BlogSectionMakita = React.lazy(() => import("./Blogs/BlogSectionMakita"));
const BlogSectionAko = React.lazy(() => import("./Blogs/BlogSectionAko"));
const BlogSectionDental = React.lazy(() => import("./Blogs/BlogSectionDental"));
const BlogSectionMultivet = React.lazy(
    () => import("./Blogs/BlogSectionMultivet"),
);
const BlogKatya = React.lazy(() => import("./Blogs/BlogKatya"));
const BlogWebQuirurgica = React.lazy(() => import("./Blogs/BlogWebQuirurgica"));
const BlogRainstar = React.lazy(() => import("./Blogs/BlogRainstar"));
const BlogMiBalon = React.lazy(() => import("./Blogs/BlogMiBalon"));
const BlogMicjc = React.lazy(() => import("./Blogs/BlogMicjc"));
const BlogTwenty = React.lazy(() => import("./Blogs/BlogTwenty"));
const BlogSectionMiBalon = React.lazy(() => import("./Blogs/BlogSectionMiBalon"));
const BlogSectionMicjc = React.lazy(() => import("./Blogs/BlogSectionMicjc"));
const BlogSectionTwenty = React.lazy(() => import("./Blogs/BlogSectionTwenty"));

const Blog = ({
    data,
    items,
    which,
    headerPosts,
    filteredData,
    postsLatest,
}) => {
    // 1. Dynamic limit for latest posts
    const getLimit = (componentName, componentData) => {
        if (componentData?.limit) return parseInt(componentData.limit);
        switch (componentName) {
            case "BlogMicjc":
            case "BlogTwenty":
                return 4;
            // case "BlogSimple": return 6;
            default: return 4;
        }
    };
    const takeLimit = getLimit(which, data);

    const [latestPosts, setLatestPosts] = useState(postsLatest || []);

    // 2. Centralized Filter States
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [listLoading, setListLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const gridPostsPerPage = 6;

    // Fetch Latest Posts
    useEffect(() => {
        if (!postsLatest || postsLatest.length === 0) {
            const fetchLatest = async () => {
                try {
                    const params = {
                        take: takeLimit,
                        skip: 0,
                        sort: [{ selector: "created_at", desc: true }],
                        with: "category",
                        filter: [["status", "=", true]]
                    };
                    const response = await postsRest.paginate(params);
                    if (response?.data) {
                        setLatestPosts(response.data);
                    }
                } catch (error) {
                    console.error("Error fetching latest posts:", error);
                }
            };
            fetchLatest();
        } else {
            setLatestPosts(postsLatest);
        }
    }, [postsLatest, takeLimit]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const params = { filter: [["visible", "=", true], ["status", "=", true]] };
                const response = await blogCategoriesRest.paginate(params);
                if (response?.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Filtered Posts Grid
    useEffect(() => {
        const fetchPosts = async () => {
            setListLoading(true);
            try {
                const params = {
                    take: gridPostsPerPage,
                    skip: (currentPage - 1) * gridPostsPerPage,
                    requireTotalCount: true,
                    with: "category",
                };
                const filterArr = [["status", "=", true]];
                if (activeCategory !== "all") {
                    filterArr.push("and", ["category_id", "=", activeCategory]);
                }

                // Exclude only the latest posts that are actually displayed in the top section
                const topCount = (which === "BlogTwenty" || which === "BlogMicjc" || which === "BlogSimple") ? 4 : 3;
                const postsToExclude = (latestPosts || []).slice(0, topCount);
                if (postsToExclude && postsToExclude.length > 0) {
                    postsToExclude.forEach(post => {
                        filterArr.push("and", ["id", "<>", post.id]);
                    });
                }
                params.filter = filterArr;

                switch (sortOption) {
                    case "newest": params.sort = [{ selector: "created_at", desc: true }]; break;
                    case "oldest": params.sort = [{ selector: "created_at", desc: false }]; break;
                    case "title-asc": params.sort = [{ selector: "name", desc: false }]; break;
                    case "title-desc": params.sort = [{ selector: "name", desc: true }]; break;
                }

                const response = await postsRest.paginate(params);
                if (response?.data) {
                    setFilteredPosts(response.data);
                    setTotalPosts(response.totalCount || 0);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setListLoading(false);
            }
        };
        fetchPosts();
    }, [activeCategory, sortOption, currentPage, latestPosts]);

    const filterProps = {
        categories, activeCategory, setActiveCategory,
        sortOption, setSortOption, currentPage, setCurrentPage,
        filteredPosts, listLoading, totalPosts, gridPostsPerPage
    };
    const getBlog = () => {
        switch (which) {
            case "BlogSimple":
                return (
                    <BlogSimple
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogMultivet":
                return (
                    <BlogMultivet
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogKatya":
                return (
                    <BlogKatya
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogWebQuirurgica":
                return (
                    <BlogWebQuirurgica
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogCarousel":
                return <BlogCarousel data={data} items={items} />;
            case "BlogCarruselBananaLab":
                return <BlogCarruselBananaLab data={data} items={items} />;
            case "BlogSectionAko":
                return <BlogSectionAko data={data} items={items} />;
            case "BlogSectionMakita":
                return <BlogSectionMakita data={data} items={items} />;
            case "BlogSectionDental":
                return <BlogSectionDental data={data} items={items} />;
            case "BlogSectionMultivet":
                return <BlogSectionMultivet data={data} items={items} />;
            case "BlogRainstar":
                return (
                    <BlogRainstar
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogMiBalon":
                return (
                    <BlogMiBalon
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogMicjc":
                return (
                    <BlogMicjc
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogTwenty":
                return (
                    <BlogTwenty
                        data={data}
                        headerPosts={headerPosts}
                        postsLatest={latestPosts}
                        filteredData={filteredData}
                        filterProps={filterProps}
                    />
                );
            case "BlogSectionMiBalon":
                return <BlogSectionMiBalon data={data} items={items} />;
            case "BlogSectionMicjc":
                return <BlogSectionMicjc data={data} items={items} />;
            case "BlogSectionTwenty":
                return <BlogSectionTwenty data={data} items={items} />;
            default:
                return <div>No hay componente {which}</div>;
        }
    };

    return getBlog();
};

export default Blog;
