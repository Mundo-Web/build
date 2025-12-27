import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import TextWithHighlight from '../../../../Utils/TextWithHighlight';

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
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 h-full flex flex-col">
                        
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-[16/10]">
                            <img
                                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                            
                            {/* Category Badge */}
                            {post?.category && (
                                <div className="absolute top-6 left-6">
                                    <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-primary text-sm font-light rounded-full">
                                        {post.category?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow">
                            
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-neutral-dark font-light mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="opacity-60" />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="opacity-60" />
                                    <span>{calculateReadTime(post?.description)}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-light text-primary mb-4 group-hover:underline transition-all line-clamp-2">
                                <TextWithHighlight 
                                    text={post?.title || post?.name}
                                    color="bg-accent"
                                />
                            </h3>

                            {/* Excerpt */}
                            <p className="text-neutral-dark font-light leading-relaxed mb-6 line-clamp-3 flex-grow">
                                {extractText(post?.extract || post?.description, 180)}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center gap-2 text-primary font-light group-hover:gap-4 transition-all duration-300">
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
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 h-full flex">
                        
                        {/* Image */}
                        <div className="relative overflow-hidden w-2/5">
                            <img
                                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 w-3/5 flex flex-col justify-between">
                            
                            {/* Category */}
                            {post?.category && (
                                <span className="text-primary text-sm font-light mb-2 inline-block">
                                    {post.category?.name}
                                </span>
                            )}

                            {/* Title */}
                            <h3 className="text-xl font-light text-primary mb-3 group-hover:underline transition-all line-clamp-2">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-neutral-dark font-light text-sm leading-relaxed line-clamp-2 mb-4">
                                {extractText(post?.extract || post?.description, 100)}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-xs text-neutral-dark font-light">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} className="opacity-60" />
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
        return (
            <article className="group">
                <a href={`/post/${post?.slug}`} className="block">
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 flex">
                        
                        {/* Image */}
                        <div className="relative overflow-hidden w-1/3">
                            <img
                                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                                alt={post?.title || post?.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                            
                            {/* Category Badge */}
                            {post?.category && (
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary text-xs font-light rounded-full">
                                        {post.category?.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 w-2/3 flex flex-col justify-between">
                            
                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-neutral-dark font-light mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="opacity-60" />
                                    <span>{formatDate(post?.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="opacity-60" />
                                    <span>{calculateReadTime(post?.description)}</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-light text-primary mb-3 group-hover:underline transition-all line-clamp-2">
                                {post?.title || post?.name}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-neutral-dark font-light leading-relaxed mb-4 line-clamp-2">
                                {extractText(post?.extract || post?.description, 200)}
                            </p>

                            {/* Read More Link */}
                            <div className="flex items-center gap-2 text-primary font-light group-hover:gap-4 transition-all duration-300">
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
    return (
        <article className="group h-full">
            <a href={`/post/${post?.slug}`} className="block h-full">
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 h-full flex flex-col">
                    
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[16/10]">
                        <img
                            src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                            alt={post?.title || post?.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                                e.target.src = '/assets/img/noimage/no_img.jpg';
                            }}
                        />
                        
                        {/* Category Badge */}
                        {post?.category && (
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-2 bg-white/95 backdrop-blur-sm text-primary text-sm font-light rounded-full">
                                    {post.category?.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                        
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-neutral-dark font-light mb-3">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="opacity-60" />
                                <span>{formatDate(post?.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="opacity-60" />
                                <span>{calculateReadTime(post?.description)}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-light text-primary mb-3 group-hover:underline transition-all line-clamp-2 flex-grow">
                            {post?.title || post?.name}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-neutral-dark font-light text-sm leading-relaxed mb-4 line-clamp-3">
                            {extractText(post?.extract || post?.description, 120)}
                        </p>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-primary font-light group-hover:gap-4 transition-all duration-300">
                            <span>Leer más</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </a>
        </article>
    );
}
