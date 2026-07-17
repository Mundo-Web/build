import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sliders, ChevronLeft, ChevronRight } from "lucide-react";
import { Loading } from "../../Components/Resources/Loading";
import BlogPostCardRainstar from "./BlogPostCardRainstar";
import SelectForm from "../../Filters/Components/SelectForm";

const BlogListRainstar = ({
    data,
    filterProps = {},
}) => {
    const {
        categories = [],
        activeCategory = "all",
        setActiveCategory = () => {},
        sortOption = "newest",
        setSortOption = () => {},
        currentPage = 1,
        setCurrentPage = () => {},
        filteredPosts = [],
        listLoading = false,
        totalPosts = 0,
        gridPostsPerPage = 6
    } = filterProps;

    const listRef = useRef(null);
    const listInView = useInView(listRef, { once: true, threshold: 0.1 });

    const sortOptions = [
        { value: "newest", label: "MÁS RECIENTES" },
        { value: "oldest", label: "MÁS ANTIGUOS" },
        { value: "title-asc", label: "TÍTULO A-Z" },
        { value: "title-desc", label: "TÍTULO Z-A" },
    ];

    const totalPages = Math.ceil(totalPosts / gridPostsPerPage);
    const currentPosts = filteredPosts;

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
                            onClick={() => {
                                setActiveCategory("all");
                                setCurrentPage(1);
                            }}
                        >
                            Todas
                        </button>

                        {categories &&
                            categories.length > 0 &&
                            categories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-colors duration-150 ease-in-out border ${
                                        activeCategory === category.id
                                            ? "bg-neutral-dark text-white border-neutral-dark shadow-lg shadow-neutral-dark/10"
                                            : "bg-white text-neutral-dark/40 border-gray-200 hover:border-neutral-dark/20 hover:text-neutral-dark"
                                    }`}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setCurrentPage(1);
                                    }}
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
                            onChange={(value) => {
                                setSortOption(value);
                                setCurrentPage(1);
                            }}
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
                    {listLoading ? (
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
                    <div className="flex flex-wrap justify-center items-center mt-20 gap-3">
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
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-12 h-12 border flex items-center justify-center text-xs font-black transition-all duration-300 ${
                                                currentPage === pageNumber
                                                    ? "bg-neutral-dark text-white border-neutral-dark shadow-lg shadow-neutral-dark/10"
                                                    : "border-gray-200 text-neutral-dark/40 hover:border-neutral-dark hover:text-neutral-dark"
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
                                        <span key={pageNumber} className="px-2 flex items-center text-neutral-dark/30 font-bold">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

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
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
};

export default BlogListRainstar;
