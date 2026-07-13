import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";

const SelectTwenty = ({ options = [], value, placeholder, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full z-20 font-mono">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-black border-2 border-white/10 hover:border-white px-4 py-3 text-xs uppercase tracking-wider text-white transition-all duration-300 rounded-none focus:outline-none"
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-1 w-full bg-black border border-white/20 shadow-xl z-30 max-h-60 overflow-y-auto rounded-none"
                    >
                        <ul className="py-1">
                            {options.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <li key={opt.value}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-xs uppercase tracking-wider transition-colors duration-200 hover:bg-white/10 ${isSelected ? "bg-white text-black font-bold" : "text-white"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


const BlogTwenty = ({
    data,
    postsLatest = [],
    filterProps = {},
}) => {
    // Extraer propiedades globales pasadas desde Blog.jsx
    const {
        categories = [],
        activeCategory = "all",
        setActiveCategory = () => { },
        sortOption = "newest",
        setSortOption = () => { },
        currentPage = 1,
        setCurrentPage = () => { },
        filteredPosts = [],
        listLoading = false,
        totalPosts = 0,
        gridPostsPerPage = 6
    } = filterProps;

    const sortOptions = [
        { value: "newest", label: "Más Recientes" },
        { value: "oldest", label: "Más Antiguos" },
        { value: "title-asc", label: "Título A-Z" },
        { value: "title-desc", label: "Título Z-A" },
    ];

    // Helper functions (del BlogSectionMicjc)
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(
                dateString.includes("T") ? dateString : `${dateString}T00:00:00`
            );
            return isNaN(date.getTime())
                ? dateString
                : date.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });
        } catch (e) {
            return dateString;
        }
    };

    const extractText = (html, maxLength = 120) => {
        if (!html) return "";
        const text = html.replace(/<[^>]+>/g, "").trim();
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    const calculateReadTime = (content) => {
        if (!content) return "3 min";
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]+>/g, "").trim();
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    // Pagination variables
    const totalPages = Math.ceil(totalPosts / gridPostsPerPage);
    const startIndex = (currentPage - 1) * gridPostsPerPage + 1;
    const endIndex = Math.min(currentPage * gridPostsPerPage, totalPosts);

    // Layout variables
    const safePostsLatest = Array.isArray(postsLatest) ? postsLatest : [];
    const hasEnoughForFeatured = safePostsLatest.length >= 2;
    const featuredPost = safePostsLatest.length > 0 ? safePostsLatest[0] : null;
    const secondaryPosts = hasEnoughForFeatured ? safePostsLatest.slice(1, 4) : [];
    const gridPosts = filteredPosts;

    return (
        <section
            id={data?.element_id || null}
            className={`py-16 md:py-24 bg-primary min-h-screen text-white ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="text-left max-w-2xl">
                        <h2 className={` uppercase  text-white mb-4 text-4xl md:text-5xl lg:text-8xl ${data?.class_title || ""}`}>
                            <TextWithHighlight
                                text={data?.title || "Nuestro *Blog* y Novedades"}
                                className="font-title"
                                color="text-twenty"
                            />
                        </h2>
                        {data?.description && (
                            <p className="text-white text-sm md:text-base uppercase leading-relaxed mt-3">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-16"
                >
                    {/* Featured UI (1 Grande + 3 Pequeños) - Fixed */}
                    {featuredPost && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                            {/* LEFT: Featured Post */}
                            <motion.div variants={itemVariants} className="h-full">
                                <article className="h-full">
                                    <a
                                        href={`/post/${featuredPost.slug}`}
                                        className="group flex flex-col overflow-hidden transition-all duration-500 h-full rounded-none border-2 border-white/10 hover:border-white bg-black w-full p-2"
                                    >
                                        <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-neutral-900 border-b-2 border-white/10 group-hover:border-white transition-all duration-500">
                                            <img
                                                src={featuredPost?.image ? `/storage/images/post/${featuredPost.image}` : "/assets/img/noimage/no_img.jpg"}
                                                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.01]"
                                                alt={featuredPost?.title || featuredPost?.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/noimage/no_img.jpg"; }}
                                            />
                                        </div>
                                        <div className="p-6 md:p-8 flex flex-col flex-grow text-left justify-between bg-black">
                                            <div className="w-full mb-6">
                                                <span className="text-xs font-bold uppercase  mb-3 block">
                                                    {featuredPost?.category?.name || "Noticias"}
                                                </span>
                                                <h3 className="text-xl md:text-2xl font-bold uppercase text-white mb-4 group-hover:text-neutral-300 transition-colors duration-300 leading-snug">
                                                    {featuredPost.title || featuredPost.name}
                                                </h3>
                                                <p className="text-xs md:text-sm text-white  mb-2 line-clamp-3">
                                                    {extractText(featuredPost.extract || featuredPost.summary || featuredPost.description || "", 300)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 text-xs text-white">
                                                <span>{formatDate(featuredPost?.created_at || featuredPost?.post_date)}</span>
                                                <span>{calculateReadTime(featuredPost?.description)}</span>
                                            </div>
                                        </div>
                                    </a>
                                </article>
                            </motion.div>

                            {/* RIGHT: Secondary Posts */}
                            <div className="flex flex-col justify-between h-full gap-6">
                                {secondaryPosts.map((post, index) => (
                                    <motion.div key={post.id || index} variants={itemVariants} className="w-full flex-grow">
                                        <article className="group h-full">
                                            <a
                                                href={`/post/${post.slug}`}
                                                className="flex flex-col sm:flex-row overflow-hidden transition-all duration-500 h-full rounded-none border-2 border-white/10 hover:border-white bg-black w-full p-2"
                                            >
                                                <div className="relative w-full sm:w-[40%] min-h-[160px] sm:min-h-full overflow-hidden bg-neutral-900 flex-shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-white/10 group-hover:border-white transition-all duration-500">
                                                    <img
                                                        src={post?.image ? `/storage/images/post/${post.image}` : "/assets/img/noimage/no_img.jpg"}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.01]"
                                                        alt={post?.title || post?.name}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/noimage/no_img.jpg"; }}
                                                    />
                                                </div>
                                                <div className="p-6 flex flex-col justify-between flex-grow sm:w-[60%] bg-black">
                                                    <div className="w-full mb-3">
                                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 block">
                                                            {post?.category?.name || "Noticias"}
                                                        </span>
                                                        <h4 className="text-base md:text-lg font-bold uppercase text-white mb-2 line-clamp-2 leading-snug">
                                                            {post.title || post.name}
                                                        </h4>
                                                        <p className="text-xs text-white leading-relaxed mb-1 line-clamp-2">
                                                            {extractText(post.extract || post.summary || post.description || "", 115)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10 text-[10px] text-white">
                                                        <span>{formatDate(post?.created_at || post?.post_date)}</span>
                                                        <span>{calculateReadTime(post?.description)}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </article>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters & Sorting Section for Grid */}
                    <div className="pt-16 border-t border-white/10">
                        <h3 className="text-2xl md:text-7xl   font-title text-white mb-8 text-center lg:text-left">
                            Revisa todas nuestras publicaciones
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Desktop Results Info */}
                            <div className="hidden lg:block text-white text-xs uppercase tracking-wider">
                                Mostrando {totalPosts > 0 ? `${startIndex}-${endIndex} de ${totalPosts}` : "0"} artículos
                            </div>

                            {/* Filtros Group */}
                            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                                {/* Categories Select */}
                                <div className="w-full sm:w-64">
                                    <SelectTwenty
                                        options={[{ value: "all", label: "Todas las categorías" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                                        value={activeCategory}
                                        placeholder="Seleccionar Categoría"
                                        onChange={(val) => { setActiveCategory(val); setCurrentPage(1); }}
                                    />
                                </div>

                                {/* Sort Select */}
                                <div className="w-full sm:w-64">
                                    <SelectTwenty
                                        options={sortOptions}
                                        value={sortOption}
                                        placeholder="Ordenar por"
                                        onChange={(val) => { setSortOption(val); setCurrentPage(1); }}
                                    />
                                </div>
                            </div>

                            {/* Mobile Results Info */}
                            <div className="lg:hidden text-white text-xs uppercase tracking-wider w-full text-center mt-2">
                                Mostrando {totalPosts > 0 ? `${startIndex}-${endIndex} de ${totalPosts}` : "0"} artículos
                            </div>
                        </div>
                    </div>

                    {/* Standard Grid Area */}
                    {listLoading ? (
                        <div className="flex justify-center py-24">
                            <Loading />
                        </div>
                    ) : gridPosts.length === 0 ? (
                        <div className="py-24">
                            <NoResults />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-4">
                            {gridPosts.map((post, index) => (
                                <motion.div key={`grid-${post.id || index}`} variants={itemVariants} className="h-full">
                                    <article className="h-full">
                                        <a
                                            href={`/post/${post.slug}`}
                                            className="group flex flex-col overflow-hidden transition-all duration-500 h-full rounded-none border-2 border-white/10 hover:border-white bg-black w-full p-2"
                                        >
                                            <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-neutral-900 border-b-2 border-white/10 group-hover:border-white transition-all duration-500">
                                                <img
                                                    src={post?.image ? `/storage/images/post/${post.image}` : "/assets/img/noimage/no_img.jpg"}
                                                    className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.01]"
                                                    alt={post?.title || post?.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/noimage/no_img.jpg"; }}
                                                />
                                            </div>
                                            <div className="p-6 flex flex-col flex-grow text-left justify-between bg-black">
                                                <div className="w-full mb-6">
                                                    <span className="text-xs font-bold uppercase  mb-3 block">
                                                        {post?.category?.name || "Noticias"}
                                                    </span>
                                                    <h4 className="text-lg font-bold uppercase text-white mb-3 group-hover:text-neutral-300 transition-colors duration-300 leading-snug line-clamp-2">
                                                        {post.title || post.name}
                                                    </h4>
                                                    <p className="text-xs text-white/55  mb-2 line-clamp-3">
                                                        {extractText(post.extract || post.summary || post.description || "", 150)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10 text-xs text-white">
                                                    <span>{formatDate(post?.created_at || post?.post_date)}</span>
                                                    <span>{calculateReadTime(post?.description)}</span>
                                                </div>
                                            </div>
                                        </a>
                                    </article>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-16">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="w-12 h-12 flex items-center justify-center rounded-none border-2 border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-white hover:bg-white/5 transition-all duration-300"
                        >
                            <ChevronLeft size={20} />
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
                                            className={`w-12 h-12 rounded-none text-xs font-bold  transition-all duration-300 ${currentPage === pageNumber
                                                ? "bg-white text-black border-2 border-white"
                                                : "border-2 border-white/10 text-white hover:border-white hover:bg-white/5"
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
                                        <span key={pageNumber} className="px-2 flex items-center text-white/30 font-bold ">
                                            ...
                                        </span>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 flex items-center justify-center rounded-none border-2 border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-white hover:bg-white/5 transition-all duration-300"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogTwenty;
