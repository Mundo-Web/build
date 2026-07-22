import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const BlogSectionMicjc = ({ data, items = [] }) => {
    if (!items || items.length === 0) return null;

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

    // Take the latest 4 posts
    const latestPosts = items.slice(0, 4);
    const featuredPost = latestPosts[0];
    const secondaryPosts = latestPosts.slice(1, 4);

    // Date formatting helper
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

    // Text extraction helper to strip HTML and limit characters
    const extractText = (html, maxLength = 120) => {
        if (!html) return "";
        const text = html.replace(/<[^>]+>/g, "").trim();
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // Estimate read time based on word count
    const calculateReadTime = (content) => {
        if (!content) return "3 min";
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]+>/g, "").trim();
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min`;
    };

    // Framer Motion animation variants
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
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <section
            id={data?.element_id || null}
            className={`py-16 md:py-24 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border-y border-gray-100 ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 md:mb-16">
                    <div className="text-left max-w-2xl">
                        <h2
                            className={`font-title text-neutral-dark mb-2 font-bold ${data?.class_title || "text-4xl md:text-5xl lg:text-6xl"}`}
                        >
                            <TextWithHighlight
                                text={data?.title || "Nuestro *Blog* y Novedades"}
                                className="text-neutral-dark font-title "
                                color="bg-primary"
                            />
                        </h2>
                        {data?.description && (
                            <p className="text-neutral-500 text-base md:text-lg font-paragraph leading-relaxed mt-3">
                                {data.description}
                            </p>
                        )}
                    </div>

                    <a
                        href={data?.blog_url || "/blogs"}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-primary hover:text-primary ${roundedButtonClass} text-neutral-dark font-bold text-sm transition-all active:scale-95 shadow-sm whitespace-nowrap ${data?.class_button || ""}`}
                    >
                        {data?.view_all_text || "Ver todos los artículos"} <ArrowUpRight size={16} />
                    </a>
                </div>

                {/* Editorial Grid (2 columns split on desktop) */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch"
                >
                    {/* LEFT COLUMN: Large Featured Post */}
                    {featuredPost && (
                        <motion.div variants={itemVariants} className="h-full">
                            <article className="h-full">
                                <a
                                    href={`/post/${featuredPost.slug}`}
                                    className={`group flex flex-col overflow-hidden transition-all duration-500 h-full ${roundedCardClass} shadow-md hover:shadow-xl bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
                                >
                                    {/* Image Section - aspect-[4/3] with rounded corners */}
                                    <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0 bg-neutral-100">
                                        <img
                                            src={
                                                featuredPost?.image
                                                    ? `/storage/images/post/${featuredPost.image}`
                                                    : "/assets/img/noimage/no_img.jpg"
                                            }
                                            className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                                            alt={featuredPost?.title || featuredPost?.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/img/noimage/no_img.jpg";
                                            }}
                                        />
                                        {/* Sheen Highlight Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/[0.18] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </div>

                                    {/* Text Section - White container box matching CardProductMicjc */}
                                    <div className="p-8 md:p-10 flex flex-col flex-grow text-left justify-between bg-white">
                                        <div className="w-full mb-6">
                                            {/* Category Meta at the top */}
                                            <span className="text-neutral-light text-xs md:text-sm font-bold uppercase tracking-widest mb-3 block">
                                                {featuredPost?.category?.name || "Noticias"}
                                            </span>

                                            {/* Title with Arrow Up Right */}
                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-title text-primary mb-4 group-hover:text-primary transition-colors duration-300 leading-snug flex items-start justify-between gap-4">
                                                {featuredPost.title || featuredPost.name}
                                            </h3>

                                            {/* Summary */}
                                            <p className="text-sm md:text-base text-neutral-light font-paragraph  mb-2 line-clamp-3">
                                                {extractText(featuredPost.extract || featuredPost.description || "", 300)}
                                            </p>
                                        </div>

                                        {/* Date & Reading Time Meta at the foot of the card */}
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 text-xs text-neutral-light font-semibold">
                                            <span>{formatDate(featuredPost?.created_at || featuredPost?.post_date)}</span>
                                            <span>{calculateReadTime(featuredPost?.description)}</span>
                                        </div>
                                    </div>
                                </a>
                            </article>
                        </motion.div>
                    )}

                    {/* RIGHT COLUMN: 3 stacked horizontal smaller cards */}
                    <div className="flex flex-col justify-between h-full gap-6">
                        {secondaryPosts.map((post, index) => (
                            <motion.div
                                key={post.id || index}
                                variants={itemVariants}
                                className="w-full flex-grow"
                            >
                                <article className="group h-full">
                                    <a
                                        href={`/post/${post.slug}`}
                                        className={`flex flex-col sm:flex-row overflow-hidden transition-all duration-500 h-full ${roundedSecondaryCardClass} shadow-md hover:shadow-lg bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
                                    >
                                        {/* Left: Small Image - aspect-video (16/9) */}
                                        <div className="relative w-full md:w-[40%] min-h-[160px] sm:min-h-full overflow-hidden bg-neutral-100 flex-shrink-0">
                                            <img
                                                src={
                                                    post?.image
                                                        ? `/storage/images/post/${post.image}`
                                                        : "/assets/img/noimage/no_img.jpg"
                                                }
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                alt={post?.title || post?.name}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "/assets/img/noimage/no_img.jpg";
                                                }}
                                            />
                                        </div>

                                        {/* Right: Small Text Details - White container box matching CardProductMicjc */}
                                        <div className="p-6 flex flex-col justify-between flex-grow sm:w-[62%] bg-white">
                                            <div className="w-full mb-3">
                                                {/* Category at the top */}
                                                <span className="text-primary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 block">
                                                    {post?.category?.name || "Noticias"}
                                                </span>

                                                {/* Title */}
                                                <h4 className="text-base md:text-lg font-bold font-title text-neutral-dark mb-2  transition-colors line-clamp-2 leading-snug">
                                                    {post.title || post.name}
                                                </h4>

                                                {/* Summary */}
                                                <p className="text-xs md:text-sm text-neutral-500 font-paragraph leading-relaxed mb-1 line-clamp-2">
                                                    {extractText(post.extract || post.description || "", 115)}
                                                </p>
                                            </div>

                                            {/* Date & Reading Time Meta at the foot of the card */}
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
                </motion.div>
            </div>
        </section>
    );
};

export default BlogSectionMicjc;
