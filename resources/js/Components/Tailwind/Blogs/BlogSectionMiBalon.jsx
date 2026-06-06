import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import BlogPostCardMiBalon from "./Components/BlogPostCardMiBalon";

const BlogSectionMiBalon = ({ data, items = [] }) => {
    // Tomar solo los últimos 3 o 4 posts (items)
    // El componente padre (Blog.jsx) ya suele pasar los items
    const latestPosts = items.slice(0, 3);

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <section
            id={data?.element_id || null}
            className={`py-20 md:py-28 bg-[#F7F9FB] ${data?.class_section || ""}`}
        >
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0"
            >
                {/* Header */}
                <div
                    className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 ${data?.class_header || ""}`}
                >
                    <motion.div
                        variants={itemVariants}
                        className="space-y-4 max-w-2xl"
                    >
                        <h2
                            className={`text-4xl md:text-7xl  font-title uppercase text-primary leading-tight ${data?.class_title || ""}`}
                        >
                            <TextWithHighlight
                                text={data?.title || "Últimas *Novedades*"}
                                className="font-title"
                                color="bg-neutral-dark"
                            />
                        </h2>
                        {data?.description && (
                            <p className="text-lg md:text-xl text-neutral-dark/60 font-medium">
                                {data.description}
                            </p>
                        )}
                    </motion.div>

                    <motion.a
                        variants={itemVariants}
                        href="/blogs"
                        className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-100 rounded-full text-neutral-dark font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm whitespace-nowrap"
                    >
                        Ver todos los artículos
                    </motion.a>
                </div>

                {/* Grid de Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts.map((post, index) => (
                        <motion.div
                            key={post.id || index}
                            variants={itemVariants}
                            className="h-full"
                        >
                            <BlogPostCardMiBalon data={data} post={post} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default BlogSectionMiBalon;
