import React from "react";
import BlogPostCardKatya from "./BlogPostCardKatya";
import Global from "../../../../Utils/Global";

const BlogHeaderKatya = ({ data, headerPosts, filteredData }) => {
    return (
        <main className="bg-white font-title">
            {/* Hero Section */}
            <section className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-8">
                <div className="space-y-4">

                    <h1 className={`font-title text-3xl md:text-5xl 2xl:text-6xl font-semibold tracking-tight ${data?.class_title || 'customtext-neutral-dark'}`}>
                     Noticias destacas
                    </h1>
                 
                        <p className="customtext-neutral-dark opacity-80 text-base 2xl:text-xl font-title">
                     Mantente informado con las últimas novedades, tendencias y actualizaciones más relevantes. Aquí encontrarás la información más importante de manera clara y actualizada.
                        </p>
                  
                </div>

                {/* Featured Posts */}
                <div className="mt-0 flex gap-8 py-[2.5%] rounded-2xl">
                    <div className="w-full md:w-1/2">
                        <BlogPostCardKatya data={data} featured post={headerPosts[0]} />
                    </div>
                    <div className="hidden md:flex space-y-4 flex-col w-1/2">
                        {headerPosts.slice(1, 3).map((post) => (
                            <BlogPostCardKatya data={data} flex key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default BlogHeaderKatya;