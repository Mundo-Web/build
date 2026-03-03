import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import BlogPostCardRainstar from "./BlogPostCardRainstar";

const BlogHeaderRainstar = ({ data, headerPosts, filteredData }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <div className="bg-white">
            {/* ── Hero section / Title ─────────────────────────────────────── */}
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden pt-12 pb-8 md:pt-16 md:pb-12"
            >
                <div className="relative z-10 px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <span className="text-[11px] font-black tracking-[0.3em] text-neutral-dark/40 uppercase mb-4">
                            Explora nuestras
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-neutral-dark mb-6 max-w-4xl">
                            {data?.title || "Últimas Noticias Y Artículos"}
                        </h1>
                        {data?.description && (
                            <p className="text-base md:text-lg text-neutral-dark/50 max-w-2xl leading-relaxed font-medium">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Featured Posts ────────────────────────────────────────────── */}
            {headerPosts && headerPosts.length > 0 && (
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto pb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-[11px] font-black tracking-[0.2em] text-neutral-dark uppercase whitespace-nowrap">
                            LO MÁS DESTACADO
                        </h2>
                        <div className="h-px bg-gray-100 w-full" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Main featured (Large card) */}
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
                                post={headerPosts[0]}
                            />
                        </motion.div>

                        {/* Secondary featured (Sidebar cards) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-6 flex flex-col gap-6"
                        >
                            {headerPosts.slice(1, 3).map((post, index) => (
                                <div key={post.id || index} className="flex-1">
                                    <BlogPostCardRainstar
                                        data={data}
                                        flex={true}
                                        post={post}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogHeaderRainstar;
