import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, Filter } from "lucide-react";
import { Loading } from "../../Components/Resources/Loading";
import { NoResults } from "../../Components/Resources/NoResult";
import BlogPostCardRainstar from "./BlogPostCardRainstar";

const BlogListRainstar = ({
    data,
    postsLatest,
    posts,
    loading,
    setLoading,
    isFilter,
    setIsFilter,
    filteredData,
}) => {
    const { categories } = filteredData;
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const postsPerPage = 9;

    const listRef = useRef(null);
    const listInView = useInView(listRef, { once: true, threshold: 0.1 });

    const sortOptions = [
        { value: "newest", label: "Más Recientes" },
        { value: "oldest", label: "Más Antiguos" },
        { value: "title-asc", label: "Título A-Z" },
        { value: "title-desc", label: "Título Z-A" },
    ];

    useEffect(() => {
        let filtered = isFilter && posts.length > 0 ? posts : postsLatest || [];

        if (activeCategory !== "all") {
            filtered = filtered.filter(
                (post) =>
                    post.category && post.category.name === activeCategory,
            );
        }

        filtered = [...filtered].sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return new Date(b.created_at) - new Date(a.created_at);
                case "oldest":
                    return new Date(a.created_at) - new Date(b.created_at);
                case "title-asc":
                    return (a.title || a.name || "").localeCompare(
                        b.title || b.name || "",
                    );
                case "title-desc":
                    return (b.title || b.name || "").localeCompare(
                        a.title || a.name || "",
                    );
                default:
                    return 0;
            }
        });

        setFilteredPosts(filtered);
        setCurrentPage(1);
    }, [activeCategory, sortOption, posts, postsLatest, isFilter]);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const currentPosts = filteredPosts.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage,
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.6, staggerChildren: 0.1 },
        },
    };

    return (
        <motion.section
            ref={listRef}
            className={`bg-white min-h-screen ${isFilter ? "py-16" : "py-24"}`}
            variants={containerVariants}
            initial="hidden"
            animate={listInView ? "visible" : "hidden"}
        >
            <div className="px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between mb-20 border-b-4 border-black pb-12">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-4 flex-1">
                        <button
                            className={`px-6 py-3 font-black uppercase tracking-widest text-sm transition-all duration-300 border-4 border-black hover:-translate-y-1 ${
                                activeCategory === "all"
                                    ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                                    : "bg-white text-black hover:bg-black hover:text-white"
                            }`}
                            onClick={() => setActiveCategory("all")}
                        >
                            Todas
                        </button>
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                className={`px-6 py-3 font-black uppercase tracking-widest text-sm transition-all duration-300 border-4 border-black hover:-translate-y-1 ${
                                    activeCategory === category.name
                                        ? "bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                                        : "bg-white text-black hover:bg-black hover:text-white"
                                }`}
                                onClick={() => setActiveCategory(category.name)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative z-20">
                        <button
                            className="flex items-center gap-4 px-8 py-3 bg-white border-4 border-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all duration-300 min-w-[240px] justify-between group"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span>
                                {
                                    sortOptions.find(
                                        (opt) => opt.value === sortOption,
                                    )?.label
                                }
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full right-0 mt-4 w-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            className={`w-full px-6 py-4 text-left text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-200 border-b-2 border-black/10 last:border-0 ${
                                                sortOption === option.value
                                                    ? "bg-black text-white"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setSortOption(option.value);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Posts Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {loading ? (
                        <div className="col-span-full py-20 text-center">
                            <Loading />
                        </div>
                    ) : currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className="h-full"
                            >
                                <BlogPostCardRainstar data={data} post={post} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-4 border-black p-12">
                            <h3 className="text-2xl font-black uppercase tracking-widest mb-4">
                                No hay resultados
                            </h3>
                            <p className="font-bold uppercase tracking-wide opacity-60">
                                Intenta con otra búsqueda o categoría.
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center mt-24 gap-4">
                        <button
                            className={`w-12 h-12 border-4 border-black flex items-center justify-center font-black transition-all duration-300 ${
                                currentPage === 1
                                    ? "opacity-20 cursor-not-allowed"
                                    : "hover:bg-black hover:text-white hover:-translate-y-1"
                            }`}
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                className={`w-12 h-12 border-4 border-black flex items-center justify-center font-black transition-all duration-300 hover:-translate-y-1 ${
                                    currentPage === page
                                        ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                        : "bg-white hover:bg-black hover:text-white"
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className={`w-12 h-12 border-4 border-black flex items-center justify-center font-black transition-all duration-300 ${
                                currentPage === totalPages
                                    ? "opacity-20 cursor-not-allowed"
                                    : "hover:bg-black hover:text-white hover:-translate-y-1"
                            }`}
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages),
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default BlogListRainstar;
