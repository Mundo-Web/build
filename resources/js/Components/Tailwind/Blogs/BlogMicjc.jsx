import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { Loading } from "../Components/Resources/Loading";
import { NoResults } from "../Components/Resources/NoResult";
import SelectForm from "../Filters/Components/SelectForm";

const BlogMicjc = ({
    data,
    postsLatest = [],
    filterProps = {},
}) => {
    // Variant support ("original" or "rounded-none" / "fimesac")
    const variant = data?.variant || data?.type_variant || data?.class_variant || "original";
    const isSharp =
        variant === "rounded-none" ||
        variant === "fimesac" ||
        variant === "flat" ||
        variant === "sharp";

    const roundedCardClass = isSharp ? "rounded-none" : "rounded-[2.5rem]";
    const roundedSecondaryCardClass = isSharp ? "rounded-none" : "rounded-[2rem]";
    const roundedButtonClass = isSharp ? "rounded-none" : "rounded-full";
    const roundedDropdownClass = isSharp ? "rounded-none" : "rounded-[1.5rem]";

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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
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
            className={`py-16 md:py-24 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] min-h-screen ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="text-left max-w-2xl">
                        <h2 className={`font-title text-neutral-dark mb-4 font-bold text-3xl md:text-4xl lg:text-5xl ${data?.class_title || "text-3xl md:text-4xl lg:text-5xl"}`}>
                            <TextWithHighlight
                                text={data?.title || "Nuestro *Blog* y Novedades"}
                                className=" font-title"
                                color="bg-primary"
                            />
                        </h2>
                        {data?.description && (
                            <p className="text-neutral-500 text-base md:text-lg font-paragraph  mt-3">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="space-y-12"
                >
                    {/* Featured UI (1 Grande + 3 Pequeños) - Fixed */}
                    {featuredPost && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                            {/* LEFT: Featured Post */}
                            <motion.div variants={itemVariants} className="h-full">
                                <article className="h-full">
                                    <a
                                        href={`/post/${featuredPost.slug}`}
                                        className={`group flex flex-col overflow-hidden transition-all duration-500 h-full ${roundedCardClass} shadow-md hover:shadow-xl bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
                                    >
                                        <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-neutral-100">
                                            <img
                                                src={featuredPost?.image ? `/storage/images/post/${featuredPost.image}` : "/assets/img/noimage/no_img.jpg"}
                                                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                                alt={featuredPost?.title || featuredPost?.name}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/noimage/no_img.jpg"; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/[0.18] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </div>
                                        <div className="p-8 md:p-10 flex flex-col flex-grow text-left justify-between bg-white">
                                            <div className="w-full mb-6">
                                                <span className="text-neutral-light text-xs md:text-sm font-bold uppercase  mb-3 block">
                                                    {featuredPost?.category?.name || "Noticias"}
                                                </span>
                                                <h3 className="text-xl md:text-3xl font-bold font-title text-primary mb-4 group-hover:text-primary transition-colors duration-300 ">
                                                    {featuredPost.title || featuredPost.name}
                                                </h3>
                                                <p className="text-sm md:text-base text-neutral-light font-paragraph mb-2 line-clamp-3">
                                                    {extractText(featuredPost.extract || featuredPost.summary || featuredPost.description || "", 300)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 text-xs text-neutral-light font-semibold">
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
                                                className={`flex flex-col sm:flex-row overflow-hidden transition-all duration-500 h-full ${roundedSecondaryCardClass} shadow-md hover:shadow-lg bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
                                            >
                                                <div className="relative w-full md:w-[40%] min-h-[160px] sm:min-h-full overflow-hidden bg-neutral-100 flex-shrink-0">
                                                    <img
                                                        src={post?.image ? `/storage/images/post/${post.image}` : "/assets/img/noimage/no_img.jpg"}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                        alt={post?.title || post?.name}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/noimage/no_img.jpg"; }}
                                                    />
                                                </div>
                                                <div className="p-6 flex flex-col justify-between flex-grow sm:w-[62%] bg-white">
                                                    <div className="w-full mb-3">
                                                        <span className="text-primary text-[10px] md:text-xs font-bold uppercase  mb-2 block">
                                                            {post?.category?.name || "Noticias"}
                                                        </span>
                                                        <h4 className="text-base md:text-lg font-bold font-title text-neutral-dark mb-2 line-clamp-2 ">
                                                            {post.title || post.name}
                                                        </h4>
                                                        <p className="text-xs md:text-sm text-neutral-500 font-paragraph  mb-1 line-clamp-2">
                                                            {extractText(post.extract || post.summary || post.description || "", 115)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-[10px] text-neutral-400 font-semibold">
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
                    <div className="pt-16 pb-8">
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-title text-neutral-dark mb-10 text-center lg:text-left">
                            Revisa todas nuestras publicaciones
                        </h3>

                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                            {/* Desktop Results Info */}
                            <div className="hidden lg:block text-neutral-500 font-body text-sm font-semibold">
                                Mostrando {totalPosts > 0 ? `${startIndex}-${endIndex} de ${totalPosts}` : "0"} artículos
                            </div>

                            {/* Filtros Group */}
                            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                                {/* Categories Select */}
                                <div className="w-full sm:w-64">
                                    <SelectForm
                                        options={[{ value: "all", label: "Todas las categorías" }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                                        value={activeCategory}
                                        placeholder="Seleccionar Categoría"
                                        onChange={(val) => { setActiveCategory(val); setCurrentPage(1); }}
                                        className={`bg-white border-2 border-gray-200 hover:border-primary ${roundedButtonClass} font-bold text-sm text-neutral-dark shadow-sm transition-all duration-300`}
                                        classNameDropdown={`${roundedDropdownClass} shadow-xl border border-gray-100`}
                                    />
                                </div>

                                {/* Sort Select */}
                                <div className="w-full sm:w-64">
                                    <SelectForm
                                        options={sortOptions}
                                        value={sortOption}
                                        placeholder="Ordenar por"
                                        onChange={(val) => { setSortOption(val); setCurrentPage(1); }}
                                        className={`bg-white border-2 border-gray-200 hover:border-primary ${roundedButtonClass} font-bold text-sm text-neutral-dark shadow-sm transition-all duration-300`}
                                        classNameDropdown={`${roundedDropdownClass} shadow-xl border border-gray-100`}
                                    />
                                </div>
                            </div>

                            {/* Mobile Results Info */}
                            <div className="lg:hidden text-neutral-500 font-body text-sm font-semibold w-full text-center mt-2">
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
                                            className={`group flex flex-col overflow-hidden transition-all duration-500 h-full ${roundedCardClass} shadow-md hover:shadow-xl bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
                                        >
                                            <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-neutral-100">
                                                <img
                                                    src={post?.image ? `/storage/images/post/${post.image}` : "/assets/img/noimage/no_img.jpg"}
                                                    className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                                    alt={post?.title || post?.name}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/noimage/no_img.jpg"; }}
                                                />
                                            </div>
                                            <div className="p-8 flex flex-col flex-grow text-left justify-between bg-white">
                                                <div className="w-full mb-6">
                                                    <span className="text-neutral-light text-xs font-bold uppercase  mb-3 block">
                                                        {post?.category?.name || "Noticias"}
                                                    </span>
                                                    <h4 className="text-xl font-bold font-title text-primary mb-3 group-hover:text-primary transition-colors duration-300  line-clamp-2">
                                                        {post.title || post.name}
                                                    </h4>
                                                    <p className="text-sm text-neutral-light font-paragraph mb-2 line-clamp-3">
                                                        {extractText(post.extract || post.summary || post.description || "", 150)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 text-xs text-neutral-light font-semibold">
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
                            className={`w-12 h-12 flex items-center justify-center ${roundedButtonClass} border-2 border-gray-200 text-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300`}
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
                                            className={`w-12 h-12 ${roundedButtonClass} text-sm font-bold font-body transition-all duration-300 ${currentPage === pageNumber
                                                ? "bg-primary text-white shadow-md border-2 border-primary"
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
                                        <span key={pageNumber} className="px-2 flex items-center text-gray-400 font-bold">
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
                            className={`w-12 h-12 flex items-center justify-center ${roundedButtonClass} border-2 border-gray-200 text-neutral-dark disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogMicjc;
