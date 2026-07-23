import React from "react";
import { ArrowRight, Calendar } from "lucide-react";

export default function BlogPostCardRainstar({
    data,
    flex = false,
    post,
    featured = false,
}) {
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

    const extractText = (html, maxLength = 150) => {
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

    const variant = data?.variant || data?.type_variant || data?.class_variant || "Rainstar";
    const isSharp =
        variant === "rounded-none" ||
        variant === "fimesac" ||
        variant === "flat" ||
        variant === "sharp" ||
        variant === "Rainstar";
    const isMicjc = variant === "original" || variant === "micjc";

    const roundedCardClass = isMicjc ? "rounded-[2.5rem]" : "rounded-none";

    // ── Flex / horizontal card (sidebar)  ────────────────────────────────────
    if (flex) {
        return (
            <article className="group relative h-full">
                <a
                    href={`/post/${post?.slug}`}
                    className={`flex flex-col md:flex-row overflow-hidden transition-all duration-500 h-full ${roundedCardClass} shadow-md hover:shadow-xl bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
                >
                    {/* Image */}
                    <div className="md:w-2/5 relative overflow-hidden shrink-0 bg-neutral-100 min-h-[160px]">
                        <img
                            src={
                                post?.image
                                    ? `/storage/images/post/${post?.image}`
                                    : "/assets/img/noimage/no_img.jpg"
                            }
                            alt={post?.title || post?.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = "/assets/img/noimage/no_img.jpg";
                            }}
                        />
                    </div>

                    {/* Content */}
                    <div className="p-6 md:w-3/5 flex flex-col justify-between flex-grow bg-white">
                        <div>
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                {post?.category && (
                                    <span className="text-primary text-[10px] md:text-xs font-bold uppercase  block">
                                        {post.category?.name}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base md:text-lg font-bold font-title text-neutral-dark mb-2 line-clamp-2 ">
                                {post?.title || post?.name}
                            </h3>
                            <p className="text-xs md:text-sm text-neutral-500 font-paragraph  mb-1 line-clamp-2">
                                {extractText(
                                    post?.extract || post?.summary || post?.description,
                                    115
                                )}
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-[10px] text-neutral-400 font-semibold">
                            <span>{formatDate(post?.created_at || post?.post_date)}</span>
                            <span>{calculateReadTime(post?.description)}</span>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // ── Standard / vertical card  ────────────────────────────────────────────
    return (
        <article className="h-full">
            <a
                href={`/post/${post?.slug}`}
                className={`group flex flex-col overflow-hidden transition-all duration-500 h-full ${roundedCardClass} shadow-md hover:shadow-xl bg-white border border-transparent hover:border-gray-100 w-full ${data?.class_card || ""}`}
            >
                {/* Image */}
                <div
                    className={`relative w-full overflow-hidden flex-shrink-0 bg-neutral-100 ${featured ? "aspect-[21/9]" : "aspect-[4/3]"}`}
                >
                    <img
                        src={
                            post?.image
                                ? `/storage/images/post/${post?.image}`
                                : "/assets/img/noimage/no_img.jpg"
                        }
                        alt={post?.title || post?.name}
                        className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                        onError={(e) => {
                            e.target.src = "/assets/img/noimage/no_img.jpg";
                        }}
                    />
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow text-left justify-between bg-white">
                    <div className="w-full mb-6">
                        <span className="text-neutral-light text-xs font-bold uppercase  mb-3 block">
                            {post?.category?.name || "Noticias"}
                        </span>
                        <h3
                            className={`${featured ? "text-2xl md:text-3xl" : "text-xl"} font-bold font-title text-primary mb-3 group-hover:text-primary transition-colors duration-300  line-clamp-2`}
                        >
                            {post?.title || post?.name}
                        </h3>
                        <p
                            className={`${featured ? "text-base" : "text-sm"} text-neutral-light font-paragraph mb-2 line-clamp-3`}
                        >
                            {extractText(
                                post?.extract || post?.summary || post?.description,
                                featured ? 250 : 150
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200 text-xs text-neutral-light font-semibold">
                        <span>{formatDate(post?.created_at || post?.post_date)}</span>
                        <span>{calculateReadTime(post?.description)}</span>
                    </div>
                </div>
            </a>
        </article>
    );
}
