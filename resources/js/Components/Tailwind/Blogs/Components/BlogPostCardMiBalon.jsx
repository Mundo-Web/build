import React from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPostCardMiBalon({
    data,
    featured = false,
    compact = false,
    listView = false,
    post,
}) {
    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Función para extraer texto plano del HTML
    const extractText = (html, maxLength = 150) => {
        if (!html) return "";
        const text = html.replace(/<[^>]+>/g, "").trim();
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // Función para calcular tiempo de lectura estimado
    const calculateReadTime = (content) => {
        if (!content) return "5 min";
        const wordsPerMinute = 200;
        const text = extractText(content, 10000);
        const wordCount = text.split(" ").length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min`;
    };

    // Versión Featured (grande)
    if (featured) {
        return (
            <article className="group h-full">
                <a href={`/post/${post?.slug}`} className="block h-full">
                    <div className="bg-white shadow-sm hover:shadow-xl rounded-[2rem] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col border border-gray-100">
                        {/* Image */}
                        <div className="relative overflow-hidden flex-1 min-h-[250px] bg-gray-100 ">
                            <img
                                src={
                                    post?.image
                                        ? `/storage/images/post/${post?.image}`
                                        : "/assets/img/noimage/no_img.jpg"
                                }
                                alt={post?.title || post?.name}
                                className="absolute inset-0 w-full h-full object-cover rounded-t-[1.5rem] group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "/assets/img/noimage/no_img.jpg";
                                }}
                            />

                            {/* Category Badge */}
                            {post?.category && (
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-4 py-2 bg-primary text-white text-sm font-bold font-body rounded-full shadow-md uppercase tracking-wider">
                                        {post.category?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col bg-white">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-body">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={16}
                                        className="text-primary"
                                    />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-primary" />
                                    <span>
                                        {calculateReadTime(post?.description)}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl md:text-4xl  font-title text-neutral-dark mb-4 group-hover:text-primary transition-colors line-clamp-2 uppercase">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                                {extractText(post?.description, 180)}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center gap-2 text-primary font-bold font-body group-hover:gap-4 transition-all duration-300">
                                <span>Leer más</span>
                                <ArrowRight
                                    size={20}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Versión Compact (para featured posts secundarios)
    if (compact) {
        return (
            <article className="group h-full">
                <a href={`/post/${post?.slug}`} className="block h-full">
                    <div className="bg-white shadow-sm hover:shadow-xl rounded-[2rem] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 h-full flex border border-gray-100 ">
                        {/* Image */}
                        <div className="relative overflow-hidden w-2/5 bg-gray-100 rounded-l-[1.5rem]">
                            <img
                                src={
                                    post?.image
                                        ? `/storage/images/post/${post?.image}`
                                        : "/assets/img/noimage/no_img.jpg"
                                }
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src =
                                        "/assets/img/noimage/no_img.jpg";
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 w-3/5 flex flex-col justify-between bg-white">
                            {/* Category */}
                            {post?.category && (
                                <span className="text-primary text-xs font-bold font-body mb-2 inline-block uppercase tracking-wider">
                                    {post.category?.name}
                                </span>
                            )}

                            {/* Title */}
                            <h3 className="text-3xl  font-title text-neutral-dark mb-3 group-hover:text-primary transition-colors line-clamp-3 uppercase">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-600 text-base font-body leading-relaxed line-clamp-4 mb-4">
                                {extractText(
                                    post?.extract || post?.description,
                                    150,
                                )}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-body ">
                                <div className="flex items-center gap-1">
                                    <Calendar
                                        size={14}
                                        className="text-primary"
                                    />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Versión List (horizontal)
    if (listView) {
        return (
            <article className="group h-full min-h-[300px]">
                <a href={`/post/${post?.slug}`} className="block h-full">
                    <div className="bg-white shadow-sm hover:shadow-xl rounded-[2rem] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col md:flex-row h-full border border-gray-100 ">
                        {/* Image */}
                        <div className="relative w-full md:w-2/5 flex-shrink-0 bg-gray-100 rounded-l-[1.5rem] overflow-hidden aspect-[16/10] md:aspect-auto">
                            <img
                                src={
                                    post?.image
                                        ? `/storage/images/post/${post?.image}`
                                        : "/assets/img/noimage/no_img.jpg"
                                }
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                        "/assets/img/noimage/no_img.jpg";
                                }}
                            />

                            {/* Category Badge */}
                            {post?.category && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold font-body rounded-full shadow-md uppercase tracking-wider">
                                        {post.category?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col justify-between bg-white">
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 font-body">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={16}
                                        className="text-primary"
                                    />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-primary" />
                                    <span>
                                        {calculateReadTime(post?.description)}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl  font-title text-neutral-dark group-hover:text-primary transition-colors line-clamp-2 mb-3 uppercase">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-base text-gray-600 font-body leading-relaxed line-clamp-2 mb-4 flex-grow">
                                {extractText(
                                    post?.extract || post?.description,
                                    150,
                                )}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center gap-2 text-primary font-bold font-body group-hover:gap-4 transition-all duration-300">
                                <span>Leer más</span>
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Versión Default (Grid)
    return (
        <article className="group h-full">
            <a href={`/post/${post?.slug}`} className="block h-full">
                <div className="bg-white shadow-sm hover:shadow-xl rounded-[2rem] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 h-full flex flex-col min-h-[450px] border border-gray-100 ">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-gray-100 rounded-t-[1.5rem]">
                        <img
                            src={
                                post?.image
                                    ? `/storage/images/post/${post?.image}`
                                    : "/assets/img/noimage/no_img.jpg"
                            }
                            alt={post?.title || post?.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/assets/img/noimage/no_img.jpg";
                            }}
                        />

                        {/* Category Badge */}
                        {post?.category && (
                            <div className="absolute top-4 left-4 z-10">
                                <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold font-body rounded-full shadow-md uppercase tracking-wider">
                                    {post.category?.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow bg-white">
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 font-body">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-primary" />
                                <span>{formatDate(post?.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-primary" />
                                <span>
                                    {calculateReadTime(post?.description)}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl  font-title text-neutral-dark mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-grow uppercase">
                            {post?.title || post?.name}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-base text-gray-600 font-body leading-relaxed mb-4 line-clamp-3">
                            {extractText(
                                post?.extract || post?.description,
                                120,
                            )}
                        </p>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-primary font-bold font-body group-hover:gap-4 transition-all duration-300 mt-auto">
                            <span>Leer más</span>
                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}
