import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function BlogPostCardWebQuirurgica({ 
    data, 
    featured = false, 
    compact = false,
    listView = false,
    post 
}) {

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Función para extraer texto plano del HTML
    const extractText = (html, maxLength = 150) => {
        if (!html) return '';
        const div = document.createElement('div');
        div.innerHTML = html;
        const text = div.textContent || div.innerText || '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Función para calcular tiempo de lectura estimado
    const calculateReadTime = (content) => {
        if (!content) return '5 min';
        const wordsPerMinute = 200;
        const text = extractText(content, 10000);
        const wordCount = text.split(' ').length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min`;
    };

    // Versión Featured (grande)
    if (featured) {
        return (
            <article className="group h-full">
                <a href={`/post/${post?.slug}`} className="block h-full">
                    <div className="bg-white shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 h-full flex flex-col">
                        
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-[16/10] bg-gray-200">
                            <img
                                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                            
                            {/* Category Badge */}
                            {post?.category && (
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-full shadow-lg">
                                        {post.category?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow bg-white">
                            
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{calculateReadTime(post?.description)}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-700 font-normal leading-relaxed mb-6 line-clamp-3 flex-grow">
                                {extractText(post?.extract || post?.description, 180)}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all duration-300">
                                <span>Leer más</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Versión Compact (para featured posts secundarios)
    if (compact) {
        return (
            <article className="group h-full">
                <a href={`/post/${post?.slug}`} className="block h-full">
                    <div className="bg-white shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 h-full flex">
                        
                        {/* Image */}
                        <div className="relative overflow-hidden w-2/5 bg-gray-200">
                            <img
                                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 w-3/5 flex flex-col justify-between bg-white">
                            
                            {/* Category */}
                            {post?.category && (
                                <span className="text-primary text-sm font-medium mb-2 inline-block">
                                    {post.category?.name}
                                </span>
                            )}

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-4">
                                {extractText(post?.extract || post?.description, 100)}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Versión List (horizontal)
    if (listView) {
        console.log('Rendering list view for post:', post?.title);
        return (
            <article className="group h-full min-h-[300px]">
                <a href={`/post/${post?.slug}`} className="block h-full">
                    <div className="bg-white shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 flex flex-row h-full">
                        
                        {/* Image */}
                        <div className="relative w-2/5 flex-shrink-0 bg-gray-200">
                            <img
                                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                            
                            {/* Category Badge */}
                            {post?.category && (
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-full shadow-lg">
                                        {post.category?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 w-3/5 flex flex-col justify-between bg-white">
                            
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{calculateReadTime(post?.description)}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-base text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-grow">
                                {extractText(post?.extract || post?.description, 150)}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all duration-300">
                                <span>Leer más</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        );
    }

    // Versión Default (Grid)
    console.log('Rendering grid view for post:', post?.title);
    return (
        <article className="group h-full">
            <a href={`/post/${post?.slug}`} className="block h-full">
                <div className="bg-white shadow-lg rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 h-full flex flex-col min-h-[450px]">
                    
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/10] bg-gray-200">
                        <img
                            src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                            alt={post?.title || post?.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.target.src = '/assets/img/noimage/no_img.jpg';
                            }}
                        />
                        
                        {/* Category Badge */}
                        {post?.category && (
                            <div className="absolute top-4 left-4 z-10">
                                <span className="px-4 py-2 bg-primary text-white text-xs font-medium rounded-full shadow-lg">
                                    {post.category?.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow bg-white">
                        
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>{formatDate(post?.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} />
                                <span>{calculateReadTime(post?.description)}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-grow">
                            {post?.title || post?.name}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-base text-gray-600 leading-relaxed mb-4 line-clamp-3">
                            {extractText(post?.extract || post?.description, 120)}
                        </p>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all duration-300">
                            <span>Leer más</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}
