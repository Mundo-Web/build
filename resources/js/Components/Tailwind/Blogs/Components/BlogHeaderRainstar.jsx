import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import BlogPostCardRainstar from "./BlogPostCardRainstar";

const BlogHeaderRainstar = ({ data, headerPosts, filteredData }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "circOut" },
        },
    };

    return (
        <main className="bg-white min-h-[50vh] pt-16 md:pt-24 pb-12 w-full px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.section
                ref={ref}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="mb-20 text-center"
            >
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black mb-8">
                    {data?.title || "Noticias Destacadas"}
                </h1>

                <div className="w-32 h-2 bg-black mx-auto mb-12"></div>

                <p className="max-w-4xl mx-auto text-lg md:text-2xl font-bold uppercase tracking-widest opacity-80 leading-relaxed">
                    {data?.description ||
                        "Mantente informado con las últimas novedades y actualizaciones. Información clara y directa."}
                </p>
            </motion.section>

            {/* Featured Posts Grid */}
            {headerPosts && headerPosts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full"
                    >
                        <BlogPostCardRainstar
                            data={data}
                            featured={true}
                            post={headerPosts[0]}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col gap-8 h-full"
                    >
                        {headerPosts.slice(1, 3).map((post, index) => (
                            <div key={post.id} className="flex-1">
                                <BlogPostCardRainstar
                                    data={data}
                                    flex={true}
                                    post={post}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            )}
        </main>
    );
};

export default BlogHeaderRainstar;
