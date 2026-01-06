import React from "react";
import BlogPostCardWebQuirurgica from "./BlogPostCardWebQuirurgica";
import TextWithHighlight from "../../../../Utils/TextWithHighlight";

const BlogHeaderWebQuirurgica = ({ data, headerPosts, filteredData }) => {
    return (
        <main className="bg-sections-color">
            {/* Hero Section */}
            <section className="px-4 py-24">
                <div className="max-w-7xl mx-auto space-y-16">
                    
                    {/* Header Text */}
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line">
                            <TextWithHighlight 
                                text={data?.name || 'Nuestro *Blog*'} 
                                color="bg-primary font-light"
                            />
                        </h1>
                        
                        {data?.description && (
                            <p className="text-lg text-neutral-dark font-light leading-relaxed whitespace-pre-line max-w-3xl mx-auto">
                                <TextWithHighlight 
                                    text={data.description} 
                                    color="bg-accent"
                                />
                            </p>
                        )}
                    </div>

                    {/* Featured Posts Grid */}
                    {headerPosts && headerPosts.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Main Featured Post */}
                            <div className="md:col-span-1">
                                <BlogPostCardWebQuirurgica 
                                    data={data} 
                                    featured 
                                    post={headerPosts[0]} 
                                />
                            </div>

                            {/* Secondary Featured Posts */}
                            <div className="grid gap-8">
                                {headerPosts.slice(1, 3).map((post) => (
                                    <BlogPostCardWebQuirurgica 
                                        data={data} 
                                        compact 
                                        key={post.id} 
                                        post={post} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BlogHeaderWebQuirurgica;
