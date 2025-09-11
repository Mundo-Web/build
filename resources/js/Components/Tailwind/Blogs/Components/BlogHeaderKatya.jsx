import React from "react";
import BlogPostCardKatya from "./BlogPostCardKatya";
import Global from "../../../../Utils/Global";

const BlogHeaderKatya = ({ data, headerPosts, filteredData }) => {
    return (
        <main className="bg-white font-title">
            {/* Hero Section */}
            <section className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-8">
                <div className="space-y-4">
                    <span className="customtext-primary">BLOG</span>
                    <h1 className={`font-title text-3xl md:text-5xl 2xl:text-6xl font-bold tracking-tight ${data?.class_title || 'customtext-primary'}`}>
                        {
                            data?.title
                                ? <span 
                                    dangerouslySetInnerHTML={{ __html: data.title }}
                                    className="leading-tight block"
                                    style={{ lineHeight: '1.1' }}
                                ></span>
                                : <>
                                    Descubre lo mejor:
                                    <br />
                                    Publicaciones sobre el mundo de {Global.APP_NAME}
                                </>
                        }
                    </h1>
                    {
                        data?.description &&
                        <p className="customtext-neutral-dark opacity-80 text-base 2xl:text-xl font-title">
                            {data?.description}
                        </p>
                    }
                </div>

                {/* Featured Posts */}
                <div className="mt-12 flex gap-8 py-[2.5%] rounded-2xl">
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