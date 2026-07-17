import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import BlogPostCardRainstar from "./Components/BlogPostCardRainstar";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const BlogSectionRainstar = ({ data, items = [] }) => {
    if (!items || items.length === 0) return null;

    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    // Limit to exactly the first 3 posts
    const latestPosts = items.slice(0, 3);

    return (
        <section
            id={data?.element_id || null}
            className={`bg-white py-16 md:py-24 relative overflow-hidden ${data?.class_section || ""}`}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto z-10 relative">
                {/* ── Title / Header ─────────────────────────────────────── */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <span className="text-[11px] font-black tracking-[0.3em] text-neutral-dark/40 uppercase mb-4">
                        {data?.subtitle || data?.badge || "Explora nuestras"}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-neutral-dark mb-6 max-w-4xl font-title">
                        <TextWithHighlight
                            text={data?.title || "Últimas Noticias Y Artículos"}
                            className="font-title"
                        />
                    </h2>
                    {data?.description && (
                        <p className="text-base md:text-lg text-neutral-dark/50 max-w-2xl leading-relaxed font-medium">
                            {data.description}
                        </p>
                    )}
                </motion.div>

                {/* ── Grid Layout ────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* Main featured (Large card) */}
                    {latestPosts[0] && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-6 h-full"
                        >
                            <BlogPostCardRainstar
                                data={data}
                                featured={true}
                                post={latestPosts[0]}
                            />
                        </motion.div>
                    )}

                    {/* Secondary featured (Sidebar cards) */}
                    {latestPosts.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-6 flex flex-col gap-6"
                        >
                            {latestPosts.slice(1, 3).map((post, index) => (
                                <div key={post.id || index} className="flex-1">
                                    <BlogPostCardRainstar
                                        data={data}
                                        flex={true}
                                        post={post}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BlogSectionRainstar;
