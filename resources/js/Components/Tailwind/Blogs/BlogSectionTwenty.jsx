import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const BlogSectionTwenty = ({ data, items = [] }) => {
    if (!items || items.length === 0) return null;

    // Limit to exactly the first 3 posts
    const latestPosts = items.slice(0, 3);

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
    const extractText = (html, maxLength = 100) => {
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

    const bgClass = data?.bg_class || "bg-primary";
    const textClass = data?.text_class || "text-white";

    return (
        <section
            id={data?.element_id || null}
            className={`relative overflow-hidden py-16 md:py-24 ${bgClass} ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="relative">
                        {/* Technical sticker badge */}
                        {data?.badge && (
                            <div
                                className="inline-block bg-white text-black px-3 py-1 mb-6 rotate-[-2deg] shadow-lg"
                                style={{ fontFamily: "monospace" }}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {data.badge}
                                </span>
                            </div>
                        )}

                        <h2
                            className={`${textClass} uppercase font-bebas leading-[0.9] ${data?.class_title || "text-[5vw] md:text-[6vw]"}`}
                        >
                            <TextWithHighlight text={data?.title || "Nuestro *Blog* y Novedades"} color="text-twenty" className="font-title" />
                        </h2>

                        {data?.description && (
                            <p className="text-white/50 mt-4 max-w-md text-sm font-mono uppercase tracking-widest">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Asymmetric layout grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                    {/* Left side: Featured Post (Large) */}
                    {latestPosts[0] && (() => {
                        const post = latestPosts[0];
                        const readTime = calculateReadTime(post.description);
                        const postUrl = `/post/${post.slug}`;
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="group relative cursor-pointer w-full flex flex-col h-full lg:col-span-5"
                                onClick={() => window.location.href = postUrl}
                            >
                                {/* Image Container (aspect 4/3) */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111] border-t-2 border-x-2 border-white/10 group-hover:border-white transition-all duration-500 shadow-xl flex-shrink-0">
                                    <img
                                        src={`/storage/images/post/${post.image}`}
                                        alt={post.name}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/api/cover/thumbnail/null";
                                        }}
                                    />
                                    {post.category && (
                                        <div className="absolute top-4 left-4 z-20 bg-white text-neutral-dark px-2.5 py-1 rotate-[-2deg]  ">
                                            <span className="text-xs font-bold">
                                                {post.category.name}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom info section */}
                                <div className="bg-black p-8 border-x-2 border-b-2 border-white/10 group-hover:border-white transition-all duration-500 flex flex-col justify-between flex-grow">
                                    <div>
                                        {/* Date and read time */}
                                        <div className="flex justify-between items-center text-xs  tracking-widest text-white/50  mb-3">
                                            <span>{formatDate(post.post_date || post.created_at)}</span>
                                            <span>{readTime} lectura</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl md:text-3xl font-medium  text-white  group-hover:text-neutral-300 transition-all mb-4">
                                            {post.name}
                                        </h3>

                                        {/* Summary */}
                                        <p className="text-md text-white font-paragraph mb-6">
                                            {extractText(post.summary || post.description, 160)}
                                        </p>
                                    </div>

                                    {/* Action button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href = postUrl;
                                        }}
                                        className="w-full bg-white text-neutral-dark py-4 font-bold text-base uppercase tracking-widest hover:bg-neutral-200 transition-colors block text-center"
                                    >
                                        Leer artículo
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })()}

                    {/* Right side: Secondary posts stacked horizontally */}
                    <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                        {latestPosts.slice(1, 3).map((post, index) => {
                            const readTime = calculateReadTime(post.description);
                            const postUrl = `/post/${post.slug}`;
                            return (
                                <motion.div
                                    key={post.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                                    className="group relative cursor-pointer w-full flex flex-col sm:flex-row bg-black border-2 border-white/10 group-hover:border-white transition-all duration-500 overflow-hidden h-full min-h-[220px]"
                                    onClick={() => window.location.href = postUrl}
                                >
                                    {/* Left image wrapper */}
                                    <div className="relative w-full sm:w-[350px] sm:aspect-auto overflow-hidden bg-[#111] flex-shrink-0 border-b-2 sm:border-b-0 sm:border-r-2 border-white/10 group-hover:border-white transition-all duration-500">
                                        <img
                                            src={`/storage/images/post/${post.image}`}
                                            alt={post.name}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/api/cover/thumbnail/null";
                                            }}
                                        />
                                        {post.category && (
                                            <div className="absolute top-3 left-3 z-20 bg-white text-neutral-dark px-2 py-0.5 rotate-[-2deg] ">
                                                <span className="text-xs font-bold ">
                                                    {post.category.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Content */}
                                    <div className="p-5 flex flex-col justify-between flex-grow">
                                        <div>
                                            {/* Date / Read time */}
                                            <div className="flex justify-between items-center text-xs tracking-widest text-white/50 mb-2">
                                                <span>{formatDate(post.post_date || post.created_at)}</span>
                                                <span>{readTime}</span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-2xl font-medium text-white leading-snug group-hover:text-neutral-300 transition-all line-clamp-3 mb-2">
                                                {post.name}
                                            </h4>

                                            {/* Summary snippet */}
                                            <p className="text-md text-white font-paragraph tracking-normal leading-relaxed line-clamp-3 overflow-hidden mb-3">
                                                {extractText(post.summary || post.description, 130)}
                                            </p>
                                        </div>

                                        {/* Horizontal Link button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = postUrl;
                                            }}
                                            className="w-fit bg-white text-neutral-dark px-6 py-3 font-bold text-base uppercase tracking-widest hover:bg-neutral-200 transition-colors block"
                                        >
                                            Leer más
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BlogSectionTwenty;
