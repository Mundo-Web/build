import { Facebook, Link, TwitterIcon, Share2, ArrowLeft, Clock, Tag } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

// Format date in Spanish
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// Read-time estimator (~200 words per minute)
function readTime(html) {
    if (!html) return 1;
    const text = html.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

export default function PostDetailTwenty({ item, data }) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    const handleShare = (platform) => {
        const text = encodeURIComponent(
            (item?.name || item?.title || "") + " " + shareUrl
        );
        let url = "";
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
                setTimeout(() => setCopied(false), 2000);
                return;
            default:
                return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const mins = readTime(item?.description);

    return (
        <article
            id={data?.element_id || undefined}
            className="min-h-screen bg-black text-white"
            itemScope
            itemType="https://schema.org/BlogPosting"
        >
            {/* ─── Hero Image ─── */}
            {item?.image && (
                <div className="w-full h-[45vh] md:h-[60vh] relative overflow-hidden bg-neutral-950">
                    <motion.img
                        initial={{ scale: 1.06, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        src={`/storage/images/post/${item.image}`}
                        alt={item?.name || "Post imagen"}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        itemProp="image"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>
            )}

            {/* ─── Main Content ─── */}
            <div className="px-[5%] max-w-5xl mx-auto">

                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="pt-10 pb-6"
                >
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 text-xs font-paragraph uppercase tracking-widest text-white hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeft size={14} strokeWidth={2} />
                        Volver al blog
                    </a>
                </motion.div>

                {/* Metadata row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap items-center gap-4 mb-6"
                >
                    {item?.category?.name && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-paragraph uppercase tracking-widest bg-white text-black px-2 py-1">
                            <Tag size={9} strokeWidth={2.5} />
                            <span itemProp="articleSection">{item.category.name}</span>
                        </span>
                    )}
                    {item?.created_at && (
                        <time
                            className="text-[10px] font-paragraph uppercase tracking-widest text-white"
                            dateTime={item.created_at}
                            itemProp="datePublished"
                        >
                            {formatDate(item.created_at)}
                        </time>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-paragraph uppercase tracking-widest text-white/30">
                        <Clock size={9} strokeWidth={2.5} />
                        {mins} min de lectura
                    </span>
                </motion.div>

                {/* Tags */}
                {Array.isArray(item?.tags) && item.tags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="flex flex-wrap gap-2 mb-6"
                    >
                        {item.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="text-[10px] font-paragraph uppercase tracking-widest border border-white/20 text-white/50 px-2 py-0.5"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </motion.div>
                )}

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`text-4xl md:text-6xl lg:text-7xl font-title uppercase leading-[1] text-white mb-10 ${data?.class_title || ""}`}
                    itemProp="headline"
                >
                    <TextWithHighlight
                        text={item?.name || item?.title}
                        className="font-title"
                        color="text-twenty"
                    />
                </motion.h1>

                {/* Separator */}
                <div className="w-full border-t border-white/10 mb-10" />

                {/* Body Content */}
                {item?.description && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="prose prose-invert max-w-none
                            prose-p:text-white prose-p:font-paragraph prose-p:text-md prose-p:leading-relaxed
                            prose-h2:font-title prose-h2:uppercase prose-h2:text-white prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                            prose-h3:font-title prose-h3:uppercase prose-h3:text-white prose-h3:text-xl prose-h3:mt-8
                            prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white
                            prose-strong:text-white prose-strong:font-bold
                            prose-blockquote:border-l-white/30 prose-blockquote:text-white/50 prose-blockquote:font-paragraph prose-blockquote:italic
                            prose-img:rounded-none prose-img:border prose-img:border-white/10
                            prose-hr:border-white/10
                            prose-ul:text-white prose-li:text-white prose-li:font-paragraph prose-li:text-sm
                            [&_img]:w-full"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                        itemProp="articleBody"
                    />
                )}

                {/* Share Section */}
                <div className="mt-16 pt-8 border-t border-white/10 pb-20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <Share2 size={14} className="text-white" />
                            <span className="text-xs font-paragraph uppercase tracking-widest text-white">
                                Compartir artículo
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Facebook */}
                            <button
                                aria-label="Compartir en Facebook"
                                onClick={() => handleShare("facebook")}
                                className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:border-white hover:text-white transition-all duration-200 rounded-none"
                            >
                                <Facebook size={16} strokeWidth={1.5} />
                            </button>

                            {/* Twitter / X */}
                            <button
                                aria-label="Compartir en Twitter"
                                onClick={() => handleShare("twitter")}
                                className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:border-white hover:text-white transition-all duration-200 rounded-none"
                            >
                                <TwitterIcon size={16} strokeWidth={1.5} />
                            </button>

                            {/* WhatsApp */}
                            <button
                                aria-label="Compartir en WhatsApp"
                                onClick={() => handleShare("whatsapp")}
                                className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:border-white hover:text-white transition-all duration-200 rounded-none"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386" />
                                </svg>
                            </button>

                            {/* Copy link */}
                            <button
                                aria-label="Copiar enlace"
                                onClick={() => handleShare("link")}
                                className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:border-white hover:text-white transition-all duration-200 rounded-none"
                            >
                                <Link size={16} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>

                    {/* Copied confirmation */}
                    <AnimatePresence>
                        {copied && (
                            <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-3 text-[10px] font-paragraph uppercase tracking-widest text-white/50"
                            >
                                ✓ Enlace copiado al portapapeles
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </article>
    );
}
