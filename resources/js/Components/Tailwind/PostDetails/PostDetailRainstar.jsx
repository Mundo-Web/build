import { Facebook, Link, TwitterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import BlogPostCardRainstar from "../Blogs/Components/BlogPostCardRainstar";
import PostsRest from "../../../Actions/PostsRest";

const postsRest = new PostsRest();

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export default function PostDetailRainstar({ item, data }) {
    const [copied, setCopied] = useState(false);
    const shareUrl = window.location.href;

    const handleShare = (platform) => {
        let url = "";
        const text = encodeURIComponent(item.title + " " + shareUrl);
        switch (platform) {
            case "facebook":
                url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
                break;
            case "twitter":
                url = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case "whatsapp":
                url = `https://wa.me/?text=${text}`;
                break;
            case "link":
                navigator.clipboard.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
                return;
            default:
                return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!item?.category?.id) return;

            try {
                const posts = await postsRest.related(
                    item.category.id,
                    item.id,
                );
                if (posts) {
                    setRelatedPosts(posts);
                }
            } catch (error) {
                console.error("Error fetching related posts:", error);
            } finally {
                setLoadingRelated(false);
            }
        };

        fetchRelated();
    }, [item]);

    return (
        <article
            id={data?.element_id || null}
            className="min-h-screen bg-white font-sans text-black"
        >
            <div className="container mx-auto px-4 md:px-6 2xl:px-0 2xl:max-w-7xl py-12 md:py-20">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    {/* Category & Date */}
                    <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-6">
                        <span className="hover:text-black transition-colors cursor-pointer border-b border-transparent hover:border-black pb-0.5">
                            {item?.category?.name}
                        </span>
                        <span className="opacity-50">•</span>
                        <time>{formatDate(item?.created_at)}</time>
                    </div>

                    {/* Title */}
                    <h1
                        className={`text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-8 ${data?.class_title || ""}`}
                    >
                        {item?.name}
                    </h1>

                    {/* Tags */}
                    {Array.isArray(item?.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {item.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-block border border-neutral-200 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all cursor-default"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                <div className="w-full mb-16 md:mb-20">
                    <div className="mx-auto w-full max-w-7xl border-4 border-black p-2 bg-white">
                        <div className="relative aspect-[21/9] w-full bg-neutral-100 overflow-hidden">
                            <img
                                src={`/storage/images/post/${item?.image}`}
                                alt={item?.title}
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-neutral-600 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-black prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-bold prose-img:border-2 prose-img:border-black prose-img:p-1"
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                    />

                    {/* Share Section */}
                    <div className="mt-16 pt-12 border-t-4 border-black flex flex-col items-center">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8">
                            Compartir este artículo
                        </h3>
                        <div className="flex gap-6">
                            <button
                                aria-label="Compartir en Facebook"
                                className="p-4 border-2 border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group"
                                onClick={() => handleShare("facebook")}
                            >
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button
                                aria-label="Compartir en Twitter"
                                className="p-4 border-2 border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group"
                                onClick={() => handleShare("twitter")}
                            >
                                <TwitterIcon className="w-5 h-5" />
                            </button>

                            <button
                                aria-label="Copiar enlace"
                                className="p-4 border-2 border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-all duration-300 group relative"
                                onClick={() => handleShare("link")}
                            >
                                <Link className="w-5 h-5" />
                                {copied && (
                                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 whitespace-nowrap">
                                        Copiado
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-20 md:mt-32 border-t-4 border-black pt-20">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                            <div className="max-w-2xl">
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                                    Explorar Más
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                                    Artículos Relacionados
                                </h2>
                            </div>
                            <div className="hidden md:block">
                                <a
                                    href="/blog"
                                    className="text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-60 transition-opacity"
                                >
                                    Ver Todo el Blog
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPosts.map((post) => (
                                <BlogPostCardRainstar
                                    key={post.id}
                                    post={post}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
