import React from "react";
import { ArrowRight } from "lucide-react";
import { Calendar } from "lucide-react";

export default function BlogPostCardRainstar({
    data,
    flex = false,
    post,
    featured = false,
}) {
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const extractText = (html, maxLength = 150) => {
        if (!html) return "";
        const div = document.createElement("div");
        div.innerHTML = html;
        const text = div.textContent || div.innerText || "";
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // ── Flex / horizontal card (sidebar)  ────────────────────────────────────
    if (flex) {
        return (
            <article className="group relative h-full bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-150">
                <a
                    href={`/post/${post?.slug}`}
                    className="flex h-full flex-col"
                >
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Image */}
                        <div className="md:w-2/5 relative overflow-hidden shrink-0">
                            <img
                                src={
                                    post?.image
                                        ? `/storage/images/post/${post?.image}`
                                        : "/assets/img/noimage/no_img.jpg"
                                }
                                alt={post?.title || post?.name}
                                className="w-full h-full min-h-[160px] object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src =
                                        "/assets/img/noimage/no_img.jpg";
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 md:w-3/5 flex flex-col justify-between">
                            <div>
                                {post?.category && (
                                    <span className="inline-block px-2 py-0.5 bg-neutral-dark/5 text-neutral-dark/40 text-[10px] font-black tracking-widest uppercase mb-3">
                                        {post.category?.name}
                                    </span>
                                )}
                                <h3 className="text-lg md:text-xl font-bold tracking-tight leading-tight text-neutral-dark line-clamp-2 mb-3">
                                    {post?.title || post?.name}
                                </h3>
                                <p className="text-sm md:text-base text-neutral-dark/50 line-clamp-2 leading-relaxed">
                                    {extractText(
                                        post?.extract || post?.description,
                                        120,
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                                <span className="flex items-center gap-2 text-[11px] text-neutral-dark/40 font-bold uppercase tracking-wider">
                                    <Calendar
                                        size={12}
                                        className="text-neutral-dark/20"
                                    />
                                    {formatDate(post?.created_at)}
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-neutral-dark/50 group-hover:text-neutral-dark group-hover:gap-2.5 transition-all duration-300">
                                    Leer
                                    <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // ── Standard / vertical card  ────────────────────────────────────────────
    return (
        <article
            className={`group relative bg-white border border-gray-100 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1.5 transition-all duration-300 ${featured ? "h-full" : ""}`}
        >
            <a href={`/post/${post?.slug}`} className="flex h-full flex-col">
                {/* Image */}
                <div
                    className={`relative overflow-hidden ${featured ? "aspect-[21/9]" : "aspect-[16/9]"}`}
                >
                    <img
                        src={
                            post?.image
                                ? `/storage/images/post/${post?.image}`
                                : "/assets/img/noimage/no_img.jpg"
                        }
                        alt={post?.title || post?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        onError={(e) => {
                            e.target.src = "/assets/img/noimage/no_img.jpg";
                        }}
                    />
                    {/* Category badge */}
                    {post?.category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-neutral-dark text-[10px] font-black tracking-widest uppercase shadow-sm">
                                {post.category?.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                        <h3
                            className={`${featured ? "text-2xl md:text-3xl" : "text-xl"} font-black tracking-tight leading-tight text-neutral-dark mb-4 line-clamp-2`}
                        >
                            {post?.title || post?.name}
                        </h3>
                        <p
                            className={`${featured ? "text-base" : "text-sm md:text-base"} text-neutral-dark/50 mb-6 line-clamp-3 leading-relaxed`}
                        >
                            {extractText(
                                post?.extract || post?.description,
                                featured ? 250 : 160,
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-auto">
                        <span className="flex items-center gap-2 text-[11px] text-neutral-dark/40 font-bold uppercase tracking-wider">
                            <Calendar
                                size={12}
                                className="text-neutral-dark/20"
                            />
                            {formatDate(post?.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-neutral-dark/50 group-hover:text-neutral-dark group-hover:gap-2.5 transition-all duration-300">
                            Leer más
                            <ArrowRight size={12} />
                        </span>
                    </div>
                </div>
            </a>
        </article>
    );
}
