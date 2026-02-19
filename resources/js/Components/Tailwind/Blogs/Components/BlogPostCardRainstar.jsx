import React from "react";
import { ArrowRight } from "lucide-react";

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

    if (flex) {
        // Version flex (horizontal)
        return (
            <article className="group relative h-full bg-white border-4 border-black hover:border-black transition-all duration-300">
                <a
                    href={`/post/${post?.slug}`}
                    className="flex h-full flex-col"
                >
                    <div className="flex flex-col md:flex-row h-full">
                        <div className="md:w-2/5 relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black">
                            <img
                                src={
                                    post?.image
                                        ? `/storage/images/post/${post?.image}`
                                        : "/assets/img/noimage/no_img.jpg"
                                }
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src =
                                        "/assets/img/noimage/no_img.jpg";
                                }}
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                        </div>

                        <div className="p-6 md:w-3/5 flex flex-col justify-between group-hover:bg-black group-hover:text-white transition-colors duration-300">
                            <div>
                                {post?.category && (
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors duration-300">
                                            {post.category?.name}
                                        </span>
                                    </div>
                                )}

                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 leading-none">
                                    {post?.title || post?.name}
                                </h3>

                                <p className="text-sm font-medium opacity-80 line-clamp-3 mb-4 uppercase tracking-wide">
                                    {extractText(
                                        post?.extract || post?.description,
                                        120,
                                    )}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-black/10 group-hover:border-white/20">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                                    {formatDate(post?.created_at)}
                                </span>
                                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                                    Leer Artículo
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </span>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Version standard (vertical)
    return (
        <article
            className={`group relative bg-white border-4 border-black transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${featured ? "h-full" : ""}`}
        >
            <a href={`/post/${post?.slug}`} className="flex h-full flex-col">
                <div className="relative overflow-hidden border-b-4 border-black aspect-[4/3]">
                    <img
                        src={
                            post?.image
                                ? `/storage/images/post/${post?.image}`
                                : "/assets/img/noimage/no_img.jpg"
                        }
                        alt={post?.title || post?.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = "/assets/img/noimage/no_img.jpg";
                        }}
                    />

                    <div className="absolute top-4 left-4">
                        {post?.category && (
                            <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                                {post.category?.name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between group-hover:bg-black group-hover:text-white transition-colors duration-300">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-4 leading-none line-clamp-3">
                            {post?.title || post?.name}
                        </h3>

                        <p className="text-xs font-bold opacity-70 mb-6 uppercase tracking-wide line-clamp-3 leading-relaxed">
                            {extractText(
                                post?.extract || post?.description,
                                100,
                            )}
                        </p>
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-black/10 group-hover:border-white/20 pt-4 mt-auto">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                            {formatDate(post?.created_at)}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform duration-300">
                            <span>Leer Más</span>
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}
