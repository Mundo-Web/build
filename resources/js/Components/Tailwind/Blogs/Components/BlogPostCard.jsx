import { Calendar } from "lucide-react";
import React from "react";

export default function BlogPostCard({
    data,
    flex = false,
    post,
    featured = false,
}) {
    return (
        <article className={`group relative  ${featured ? "h-full" : ""}`}>
            <a
                href={`/post/${post?.slug}`}
                className={`block ${flex && "flex gap-4 "}`}
            >
                <div
                    className={`relative aspect-[3/2] overflow-hidden rounded-2xl ${
                        flex && "w-1/2"
                    } `}
                >
                    <img
                        src={`/storage/images/post/${post?.image}`}
                        alt={post?.name}
                        className={`object-cover h-full transition-transform duration-300 group-hover:scale-105 w-full`}
                    />
                </div>
                <div
                    className={`flex flex-col justify-center py-2 space-y-1 ${flex && "w-1/2 mt-0 gap-1"}`}
                >
                    <span className="text-primary opacity-90 font-semibold text-base 2xl:text-lg line-clamp-1 ">
                        {post?.category?.name}
                    </span>
                    <h3 className="text-base md:text-lg xl:text-xl line-clamp-3 lg:line-clamp-4 2xl:text-2xl font-bold customtext-neutral-dark group-hover:customtext-primary transition-colors duration-300 leading-tight">
                        {post?.name}
                    </h3>
                    <p className="line-clamp-3  font-paragraph  text-neutral-dark  text-sm md:text-base  2xl:text-lg !leading-snug">
                        {post?.summary}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary pt-4">
                        <Calendar className="w-4 h-4" />
                        <time className="font-medium">
                            {(() => {
                                const dateToParse =
                                    post?.post_date || post?.created_at;
                                if (!dateToParse) return "Sin fecha";

                                try {
                                    const date = new Date(
                                        dateToParse.includes("T")
                                            ? dateToParse
                                            : `${dateToParse}T00:00:00`,
                                    );
                                    return isNaN(date.getTime())
                                        ? dateToParse
                                        : date.toLocaleDateString("es-ES", {
                                              day: "2-digit",
                                              month: "short",
                                              year: "numeric",
                                          });
                                } catch (e) {
                                    return dateToParse;
                                }
                            })()}
                        </time>
                        {data?.["bool:show_seen"] && (
                            <div className="flex items-center gap-2 ml-2 border-l pl-2 border-gray-100">
                                <i className="mdi mdi-eye-outline"></i>
                                <span>Leído recientemente</span>
                            </div>
                        )}
                    </div>
                </div>
            </a>
        </article>
    );
}
