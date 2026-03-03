import { Facebook, Link, TwitterIcon } from "lucide-react";
import { useState, useEffect } from "react";
import BlogPostCardRainstar from "../Blogs/Components/BlogPostCardRainstar";
import PostsRest from "../../../Actions/PostsRest";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const postsRest = new PostsRest();
postsRest.is_use_notify = false;

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
            className="min-h-screen bg-white font-sans text-neutral-dark py-16 md:py-24"
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    {/* Category & Date */}
                    <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold tracking-widest text-neutral-dark/40 mb-8 uppercase">
                        <span className="hover:text-primary transition-colors cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
                            {item?.category?.name}
                        </span>
                        <span className="opacity-50">•</span>
                        <time>{formatDate(item?.created_at)}</time>
                    </div>

                    {/* Title */}
                    <h1
                        className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] mb-10 text-neutral-dark ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight text={item?.name} />
                    </h1>

                    {/* Tags */}
                    {Array.isArray(item?.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3">
                            {item.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-block border border-gray-100 bg-gray-50 px-6 py-2 text-xs font-bold tracking-wider text-neutral-dark/60 rounded-full hover:bg-neutral-dark hover:text-white transition-all cursor-default"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full mb-16 md:mb-24"
                >
                    <div className="mx-auto w-full max-w-7xl border border-gray-100 p-3 bg-white shadow-2xl">
                        <div className="relative aspect-[21/9] w-full bg-gray-50 overflow-hidden">
                            <img
                                src={`/storage/images/post/${item?.image}`}
                                alt={item?.name}
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <div className="max-w-3xl mx-auto">
                    <div
                        className="prose prose-lg md:prose-xl max-w-none 
                        prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-neutral-dark 
                        prose-p:text-neutral-dark/80 prose-p:font-medium prose-p:leading-relaxed 
                        prose-strong:text-neutral-dark 
                        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 
                        prose-blockquote:py-8 prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:font-bold 
                        prose-img:border prose-img:border-gray-100 prose-img:p-2"
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                    />

                    {/* Share Section */}
                    <div className="mt-24 pt-12 border-t border-gray-100 flex flex-col items-center">
                        <h3 className="text-xs font-bold tracking-widest text-neutral-dark/40 mb-10 uppercase">
                            Compartir este artículo
                        </h3>
                        <div className="flex gap-4">
                            <button
                                aria-label="Compartir en Facebook"
                                className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-100 bg-white text-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-500 shadow-sm"
                                onClick={() => handleShare("facebook")}
                            >
                                <Facebook className="w-5 h-5 stroke-[1.5]" />
                            </button>
                            <button
                                aria-label="Compartir en Twitter"
                                className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-100 bg-white text-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-500 shadow-sm"
                                onClick={() => handleShare("twitter")}
                            >
                                <TwitterIcon className="w-5 h-5 stroke-[1.5]" />
                            </button>

                            <button
                                aria-label="Copiar enlace"
                                className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-100 bg-white text-neutral-dark hover:bg-neutral-dark hover:text-white transition-all duration-500 shadow-sm relative group"
                                onClick={() => handleShare("link")}
                            >
                                <Link className="w-5 h-5 stroke-[1.5]" />
                                {copied && (
                                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-neutral-dark text-white text-[10px] font-bold py-2 px-4 rounded shadow-xl whitespace-nowrap">
                                        Copiado
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <div className="mt-24 md:mt-40 border-t border-black/5 pt-24">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                            <div className="max-w-2xl">
                                <span className="text-[11px] font-black tracking-[0.2em] text-primary mb-4 block uppercase whitespace-nowrap">
                                    SIGUE EXPLORANDO
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-neutral-dark">
                                    Artículos Relacionados
                                </h2>
                            </div>
                            <div className="shrink-0">
                                <a
                                    href="/blog"
                                    className="text-[11px] font-black tracking-[0.2em] uppercase border-b-2 border-neutral-dark pb-2 hover:text-primary hover:border-primary transition-all duration-300"
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
