import React from "react";
import BlogPostCardMiBalon from "./BlogPostCardMiBalon";
import TextWithHighlight from "../../../../Utils/TextWithHighlight";

const BlogHeaderMiBalon = ({ data, headerPosts, filteredData }) => {
    return (
        <main className="bg-gray-50">
            {/* Hero Section */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-7xl mx-auto space-y-12 md:space-y-16">
                    {/* Header Text */}
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl  font-title text-primary  whitespace-pre-line uppercase">
                            <TextWithHighlight
                                text={data?.name || "Nuestro *Blog*"}
                                className="font-title"
                                color="bg-neutral-dark"
                            />
                        </h1>

                        {data?.description && (
                            <p className="text-lg md:text-xl text-neutral-dark font-body leading-relaxed whitespace-pre-line max-w-3xl mx-auto">
                                <TextWithHighlight
                                    text={data.description}
                                    className="font-body"
                                />
                            </p>
                        )}
                    </div>

                    {/* Featured Posts Grid */}
                    {headerPosts && headerPosts.length > 0 && (
                        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                            {/* Main Featured Post */}
                            <div className="lg:col-span-1">
                                <BlogPostCardMiBalon
                                    data={data}
                                    featured
                                    post={headerPosts[0]}
                                />
                            </div>

                            {/* Secondary Featured Posts */}
                            <div className="grid grid-rows-2 gap-8 h-full">
                                {headerPosts.slice(1, 3).map((post) => (
                                    <div key={post.id} className="h-full">
                                        <BlogPostCardMiBalon
                                            data={data}
                                            compact
                                            post={post}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BlogHeaderMiBalon;
