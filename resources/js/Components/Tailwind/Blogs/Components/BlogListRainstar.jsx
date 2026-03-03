import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown, SlidersHorizontal, Sliders } from "lucide-react";
import { Loading } from "../../Components/Resources/Loading";
import BlogPostCardRainstar from "./BlogPostCardRainstar";
import SelectForm from "../../Filters/Components/SelectForm";
import BlogCategoriesRest from "../../../../Actions/BlogCategoriesRest";

const blogCategoriesRest = new BlogCategoriesRest();

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
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await blogCategoriesRest.get();
                if (response && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching blog categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const [activeCategory, setActiveCategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const postsPerPage = 9;

    const listRef = useRef(null);
    const listInView = useInView(listRef, { once: true, threshold: 0.1 });

    const sortOptions = [
        { value: "newest", label: "MÁS RECIENTES" },
        { value: "oldest", label: "MÁS ANTIGUOS" },
        { value: "title-asc", label: "TÍTULO A-Z" },
        { value: "title-desc", label: "TÍTULO Z-A" },
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

    return (
        <motion.section
            ref={listRef}
            className="bg-white py-12 md:py-16"
            initial={{ opacity: 0 }}
            animate={listInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
        >
            <div className="px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-[11px] font-black tracking-[0.2em] text-neutral-dark uppercase whitespace-nowrap">
                        TODOS LOS ARTÍCULOS
                    </h2>
                    <div className="h-px bg-gray-100 w-full" />
                </div>

                {/* ── Filters bar ───────────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-12 pb-8 border-b border-gray-100">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2 flex-1">
                        <button
                            className={`px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-colors duration-150 ease-in-out border ${
                                activeCategory === "all"
                                    ? "bg-neutral-dark text-white border-neutral-dark shadow-lg shadow-neutral-dark/10"
                                    : "bg-white text-neutral-dark/40 border-gray-200 hover:border-neutral-dark/20 hover:text-neutral-dark"
                            }`}
                            onClick={() => setActiveCategory("all")}
                        >
                            Todas
                        </button>

                        {categories &&
                            categories.length > 0 &&
                            categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-colors duration-150 ease-in-out border ${
                                        activeCategory === category.name
                                            ? "bg-neutral-dark text-white border-neutral-dark shadow-lg shadow-neutral-dark/10"
                                            : "bg-white text-neutral-dark/40 border-gray-200 hover:border-neutral-dark/20 hover:text-neutral-dark"
                                    }`}
                                    onClick={() =>
                                        setActiveCategory(category.name)
                                    }
                                >
                                    {category.name}
                                </button>
                            ))}
                    </div>

                    {/* Sort — Using SelectForm to match CatalogoFiltrosRainstar */}
                    <div className="shrink-0 w-full lg:w-72">
                        <SelectForm
                            options={sortOptions}
                            placeholder="ORDENAR"
                            value={sortOption}
                            onChange={(value) => setSortOption(value)}
                            labelKey="label"
                            valueKey="value"
                            generalIcon={<Sliders className="h-4 w-4" />}
                            className="!w-full text-neutral-dark border-gray-200 rounded-none text-[10px] font-black uppercase tracking-[0.2em] h-12 hover:border-neutral-dark/30 transition-all duration-300 px-5"
                            classNameIcon="text-neutral-dark/30"
                            classNameDropdown="rounded-none border-gray-100 shadow-xl"
                        />
                    </div>
                </div>

                {/* ── Posts Grid ────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-32 text-center">
                            <Loading />
                        </div>
                    ) : currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                            <motion.div
                                key={post.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: (index % 3) * 0.1,
                                }}
                                className="h-full"
                            >
                                <BlogPostCardRainstar data={data} post={post} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center border border-dashed border-gray-200">
                            <h3 className="text-2xl font-black tracking-tight text-neutral-dark mb-3">
                                No se encontraron artículos
                            </h3>
                            <p className="text-base text-neutral-dark/40 max-w-md mx-auto">
                                No hay noticias en esta categoría por el
                                momento. Intenta explorar otras categorías.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Pagination ────────────────────────────────────────────── */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap justify-center mt-20 gap-3">
                        <button
                            className={`w-12 h-12 border flex items-center justify-center text-xs font-black transition-all duration-300 ${
                                currentPage === 1
                                    ? "border-gray-100 text-neutral-dark/10 cursor-not-allowed"
                                    : "border-gray-200 text-neutral-dark/40 hover:border-neutral-dark hover:text-neutral-dark"
                            }`}
                            onClick={() =>
                                setCurrentPage((p) => Math.max(p - 1, 1))
                            }
                            disabled={currentPage === 1}
                        >
                            ‹
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <button
                                key={page}
                                className={`w-12 h-12 border flex items-center justify-center text-xs font-black transition-all duration-300 ${
                                    currentPage === page
                                        ? "bg-neutral-dark text-white border-neutral-dark shadow-lg shadow-neutral-dark/10"
                                        : "border-gray-200 text-neutral-dark/40 hover:border-neutral-dark hover:text-neutral-dark"
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className={`w-12 h-12 border flex items-center justify-center text-xs font-black transition-all duration-300 ${
                                currentPage === totalPages
                                    ? "border-gray-100 text-neutral-dark/10 cursor-not-allowed"
                                    : "border-gray-200 text-neutral-dark/40 hover:border-neutral-dark hover:text-neutral-dark"
                            }`}
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages),
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default BlogListRainstar;
