import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Filter, Grid3x3, List, ChevronDown, Check } from "lucide-react";
import { Loading } from "../../../Tailwind/Components/Resources/Loading";
import { NoResults } from "../../../Tailwind/Components/Resources/NoResult";
import BlogPostCardMiBalon from "./BlogPostCardMiBalon";
import BlogCategoriesRest from "../../../../Actions/BlogCategoriesRest";
import PostsRest from "../../../../Actions/PostsRest";

const blogCategoriesRest = new BlogCategoriesRest();
const postsRest = new PostsRest();

const BlogListMiBalon = ({
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
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);
    const dropdownRef = useRef(null);
    const postsPerPage = 12;

    // Referencias para animaciones
    const listRef = useRef(null);
    const listInView = useInView(listRef, { once: true, threshold: 0.1 });

    const sortOptions = [
        { value: "newest", label: "Más Recientes", icon: "" },
        { value: "oldest", label: "Más Antiguos", icon: "" },
        { value: "title-asc", label: "Título A-Z", icon: "" },
        { value: "title-desc", label: "Título Z-A", icon: "" },
    ];

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const params = {
                    filter: [
                        ["visible", "=", true],
                        ["status", "=", true],
                    ],
                };
                const response = await blogCategoriesRest.paginate(params);
                if (response && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch posts via backend pagination
    useEffect(() => {
        const fetchPosts = async () => {
            setListLoading(true);
            try {
                const params = {
                    take: postsPerPage,
                    skip: (currentPage - 1) * postsPerPage,
                    requireTotalCount: true,
                    with: "category",
                };

                // Add filter
                if (activeCategory !== "all") {
                    params.filter = [["category_id", "=", activeCategory]];
                }

                // Add sorting
                switch (sortOption) {
                    case "newest":
                        params.sort = [{ selector: "created_at", desc: true }];
                        break;
                    case "oldest":
                        params.sort = [{ selector: "created_at", desc: false }];
                        break;
                    case "title-asc":
                        params.sort = [{ selector: "title", desc: false }];
                        break;
                    case "title-desc":
                        params.sort = [{ selector: "title", desc: true }];
                        break;
                }

                const response = await postsRest.paginate(params);
                if (response && response.data) {
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
    }, [activeCategory, sortOption, currentPage]);

    // Paginación
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage + 1;
    const endIndex = Math.min(currentPage * postsPerPage, totalPosts);
    const currentPosts = filteredPosts;

    return (
        <section className="bg-gray-50 pb-16 px-4">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Filters Section */}
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    {/* Categories Filter */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                setActiveCategory("all");
                                setCurrentPage(1);
                            }}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold font-body transition-all duration-300 border-2 uppercase tracking-wide ${
                                activeCategory === "all"
                                    ? "bg-primary text-white border-primary shadow-md"
                                    : "bg-white text-neutral-dark border-gray-200 hover:border-primary hover:text-primary"
                            }`}
                        >
                            Todas
                        </button>
                        {categories?.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    setCurrentPage(1);
                                }}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold font-body transition-all duration-300 border-2 whitespace-nowrap uppercase tracking-wide ${
                                    activeCategory === category.id
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "bg-white text-neutral-dark border-gray-200 hover:border-primary hover:text-primary"
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    {/* Sort & View Options */}
                    <div className="flex items-center gap-4 min-w-fit lg:w-auto">
                        {/* View Mode Toggle */}
                        <div className="flex border-2 border-gray-200 rounded-full p-1 bg-white">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2.5 rounded-full transition-all duration-300 ${
                                    viewMode === "grid"
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-gray-400 hover:bg-gray-100 hover:text-primary"
                                }`}
                                title="Vista en cuadrícula"
                            >
                                <Grid3x3 size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2.5 rounded-full transition-all duration-300 ${
                                    viewMode === "list"
                                        ? "bg-primary text-white shadow-sm"
                                        : "text-gray-400 hover:bg-gray-100 hover:text-primary"
                                }`}
                                title="Vista en lista"
                            >
                                <List size={20} />
                            </button>
                        </div>

                        {/* Custom Sort Dropdown */}
                        <div
                            className="relative flex-grow lg:flex-grow-0"
                            ref={dropdownRef}
                        >
                            <button
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                                className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-3 px-6 py-4 rounded-full border-2 border-gray-200 bg-white text-neutral-dark font-bold font-body text-sm hover:border-primary hover:text-primary transition-all duration-300 uppercase tracking-wide"
                            >
                                <span>
                                    {
                                        sortOptions.find(
                                            (opt) => opt.value === sortOption,
                                        )?.label
                                    }
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-[1.5rem] shadow-xl z-50 overflow-hidden p-2"
                                    >
                                        {sortOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortOption(option.value);
                                                    setCurrentPage(1);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold font-body uppercase tracking-wide transition-all duration-200 ${
                                                    sortOption === option.value
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-neutral-dark hover:bg-gray-50 hover:text-primary"
                                                }`}
                                            >
                                                <span>{option.label}</span>
                                                {sortOption ===
                                                    option.value && (
                                                    <Check
                                                        size={18}
                                                        className="text-primary"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-neutral-dark font-body text-center lg:text-left">
                    Mostrando{" "}
                    {totalPosts > 0 ? (
                        <>
                            <span className="font-bold text-primary">
                                {startIndex}-{endIndex}
                            </span>{" "}
                            de{" "}
                            <span className="font-bold text-primary">
                                {totalPosts}
                            </span>{" "}
                            artículos
                        </>
                    ) : (
                        <>
                            <span className="font-bold text-primary">0</span>{" "}
                            artículos
                        </>
                    )}
                </div>

                {/* Posts Grid/List */}
                {listLoading || loading ? (
                    <div className="flex justify-center py-20">
                        <Loading />
                    </div>
                ) : currentPosts.length === 0 ? (
                    <div className="py-20">
                        <NoResults />
                    </div>
                ) : (
                    <div
                        ref={listRef}
                        className={
                            viewMode === "grid"
                                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "grid lg:grid-cols-2 gap-8"
                        }
                    >
                        {currentPosts.map((post) => (
                            <div key={post.id} className="h-full">
                                <BlogPostCardMiBalon
                                    data={data}
                                    post={post}
                                    listView={viewMode === "list"}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-12">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="px-6 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold font-body uppercase tracking-wide text-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                        >
                            Anterior
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 &&
                                        pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() =>
                                                setCurrentPage(pageNumber)
                                            }
                                            className={`w-11 h-11 rounded-full text-sm font-bold font-body transition-all duration-300 ${
                                                currentPage === pageNumber
                                                    ? "bg-primary text-white shadow-md"
                                                    : "border-2 border-gray-200 text-neutral-dark hover:border-primary hover:text-primary hover:bg-primary/5"
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return (
                                        <span
                                            key={pageNumber}
                                            className="px-2 text-gray-400 font-bold"
                                        >
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages),
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-6 py-2.5 rounded-full border-2 border-gray-200 text-sm font-bold font-body uppercase tracking-wide text-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogListMiBalon;
