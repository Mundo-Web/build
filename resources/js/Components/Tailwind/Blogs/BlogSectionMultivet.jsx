import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight, Clock } from 'lucide-react';

const BlogSectionMultivet = ({ items = [], data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const blogPosts = items.length > 0 ? items : [];
  const postsPerPage = parseInt(data?.posts_per_page) || 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const getCurrentPosts = () => {
    const startIndex = currentPage * postsPerPage;
    return blogPosts.slice(startIndex, startIndex + postsPerPage);
  };

  const currentPosts = getCurrentPosts();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const extractText = (html, maxLength = 150) => {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min';
    const wordCount = content.split(' ').length;
    return `${Math.ceil(wordCount / 200)} min`;
  };

  if (!blogPosts.length) {
    return (
      <section className={`py-16 bg-gray-50 ${data?.class_section || ''}`}>
        <div className="max-w-7xl mx-auto px-primary text-center">
          <h2 className="text-3xl font-title md:text-4xl font-bold mb-4 customtext-secondary">
            {data?.title || 'Últimas Publicaciones del Blog'}
          </h2>
          <p className="customtext-neutral-light">No hay artículos disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-gray-50 ${data?.class_section || ''}`}>
      <div className="2xl:max-w-7xl mx-auto px-primary 2xl:px-0">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-title md:text-5xl font-bold mb-4 customtext-secondary">
            {data?.title || 'Últimas Publicaciones del Blog'}
          </h2>
          {data?.subtitle && (
            <p className="max-w-2xl mx-auto text-lg customtext-neutral-light">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Blog Posts Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentPosts.map((post) => (
              <a href={`/post/${post?.slug}`} key={post.id} className="block h-full">
                <article className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer h-full ${data?.class_card || ''}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={post.image ? `/storage/images/post/${post.image}` : '/assets/img/noimage/no_img.jpg'}
                      alt={post.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = '/assets/img/noimage/no_img.jpg'; }}
                    />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-accent customtext-primary ${data?.class_badge_category || ''}`}>
                          {post.category?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{calculateReadTime(post.description)}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-title font-bold mb-3 group-hover:customtext-secondary transition-colors line-clamp-2 customtext-primary">
                      {post.name}
                    </h3>

                    <p className="text-sm mb-4 line-clamp-3 customtext-neutral-light">
                      {extractText(post.description)}
                    </p>

                    <div className="flex items-center justify-between">
                      {post.autor && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm customtext-neutral-light">{post.autor}</span>
                        </div>
                      )}
                      <span className="font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform customtext-secondary">
                        <span>{data?.read_more_text || 'Leer más'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>

          {/* Navigation - Solo si hay múltiples páginas */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center lg:justify-between">
              <button
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className={`hidden lg:flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${data?.class_button || ''} ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-secondary text-white hover:opacity-90 transform hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Anterior</span>
              </button>

              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentPage ? 'bg-secondary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className={`hidden lg:flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${data?.class_button || ''} ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-secondary text-white hover:opacity-90 transform hover:scale-105'
                }`}
              >
                <span>Siguiente</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* View All Button */}
        {data?.blog_url && (
          <div className="text-center mt-12">
            <a 
              href={data.blog_url}
              className={`inline-flex px-8 py-4 text-lg font-semibold transform hover:scale-105 items-center space-x-2 transition-all duration-300 bg-secondary text-white rounded-lg ${data?.class_button || ''}`}
            >
              <span>{data?.view_all_text || 'Ver más artículos'}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSectionMultivet;