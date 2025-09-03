import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

const BlogSectionMultivet = ({ items = [], data }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Usar items de la base de datos o fallback vacío
  const blogPosts = items.length > 0 ? items : [];

  // Configuración de paginación: 6 posts por página (máximo 12 posts totales = 2 páginas)
  const postsPerPage = data?.posts_per_page || 6;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);

  const getCurrentPosts = () => {
    const startIndex = currentPage * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return blogPosts.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentPosts = getCurrentPosts();

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
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  };

  // Función para obtener color de categoría dinámicamente
  const getCategoryColor = (categoryName) => {
    if (!categoryName) return 'bg-brand-gold/20 customtext-secondary';
    
    // Mapeo dinámico basado en el nombre de la categoría
    const colorMap = {
      'innovación': 'bg-blue-100 text-blue-800',
      'innovacion': 'bg-blue-100 text-blue-800',
      'prevención': 'bg-green-100 text-green-800',
      'prevencion': 'bg-green-100 text-green-800',
      'nutrición': 'bg-orange-100 text-orange-800',
      'nutricion': 'bg-orange-100 text-orange-800',
      'bioseguridad': 'bg-red-100 text-red-800',
      'diagnóstico': 'bg-purple-100 text-purple-800',
      'diagnostico': 'bg-purple-100 text-purple-800',
      'regulación': 'bg-gray-100 customtext-primary',
      'regulacion': 'bg-gray-100 customtext-primary',
      'salud': 'bg-emerald-100 text-emerald-800',
      'medicina': 'bg-indigo-100 text-indigo-800',
      'veterinaria': 'bg-cyan-100 text-cyan-800',
      'animales': 'bg-amber-100 text-amber-800',
      'cuidado': 'bg-pink-100 text-pink-800',
      'tratamiento': 'bg-violet-100 text-violet-800'
    };
    
    const normalizedName = categoryName.toLowerCase().trim();
    return colorMap[normalizedName] || 'bg-accent customtext-primary';
  };

  // Si no hay posts, mostrar mensaje
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section className={`py-16 ${data?.section_background || 'bg-gray-50'} ${data?.class_section || ''}`}>
        <div className="max-w-7xl mx-auto px-primary text-center">
          <h2 className={`text-3xl font-title md:text-4xl font-bold mb-4  ${data?.title_color || 'customtext-secondary'}`}>
            {data?.title || 'Últimas Publicaciones del Blog'}
          </h2>
          <p className="customtext-neutral-light">No hay artículos disponibles en este momento.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${data?.section_background || 'bg-gray-50'} ${data?.class_section || ''}`}>
      <div className="max-w-7xl mx-auto px-primary">
        {/* Header */}
        <div className={`text-center mb-12 ${data?.class_header || ''}`}>
          <h2 className={`text-3xl font-title md:text-5xl font-bold mb-4  ${data?.title_color || 'customtext-secondary'} ${data?.class_title || ''}`}>
            {data?.title || 'Últimas Publicaciones del Blog'}
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${data?.subtitle_color || 'customtext-neutral-light'} ${data?.class_subtitle || ''}`}>
            {data?.subtitle || 'Mantente actualizado con las últimas tendencias, consejos y novedades del mundo veterinario'}
          </p>
        </div>

        {/* Blog Posts Carousel */}
        <div className="relative">
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ${data?.class_grid || ''}`}>
            {/* Main posts */}
            {currentPosts.map((post, index) => (
              <article
                key={post.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer ${data?.class_card || ''}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image ? `/storage/images/post/${post.image}` : '/assets/img/noimage/no_img.jpg'}
                    alt={post.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = '/assets/img/noimage/no_img.jpg';
                    }}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category?.name)}`}>
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

                  <h3 className={`text-lg font-bold mb-3 group-hover:customtext-secondary transition-colors line-clamp-2  ${data?.post_title_color || 'customtext-primary'} ${data?.class_post_title || ''}`}>
                    {post.name}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-3 ${data?.post_excerpt_color || 'customtext-neutral-light'} ${data?.class_post_excerpt || ''}`}>
                    {extractText(post.description)}
                  </p>

                  <div className="flex items-center justify-between">
                    {post.autor && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm customtext-neutral-light">{post.autor}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => window.location.href = `/blog/${post.id}`}
                      className={`font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform ${data?.read_more_color || 'customtext-secondary hover:customtext-primary'} ${data?.class_read_more || ''}`}
                    >
                      <span>{data?.read_more_text || 'Leer más'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Navigation Controls - Solo mostrar si hay múltiples páginas */}
          {totalPages > 1 && (
            <div className={`flex items-center justify-center lg:justify-between ${data?.class_navigation || ''}`}>
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`hidden lg:flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === 0
                    ? `${data?.nav_disabled_bg || 'bg-gray-200'} ${data?.nav_disabled_color || 'text-gray-400'} cursor-not-allowed`
                    : `${data?.nav_active_bg || 'bg-secondary'} ${data?.nav_active_color || 'text-white'} hover:bg-primary-600 transform hover:scale-105`
                } ${data?.class_nav_button || ''}`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>{data?.prev_text || 'Anterior'}</span>
              </button>

              {/* Page indicators */}
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentPage
                        ? `${data?.indicator_active || 'bg-secondary'} scale-125`
                        : `${data?.indicator_inactive || 'bg-gray-300 hover:bg-gray-400'}`
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className={`hidden lg:flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === totalPages - 1
                    ? `${data?.nav_disabled_bg || 'bg-gray-200'} ${data?.nav_disabled_color || 'text-gray-400'} cursor-not-allowed`
                    : `${data?.nav_active_bg || 'bg-secondary'} ${data?.nav_active_color || 'text-white'} hover:bg-primary-600 transform hover:scale-105`
                } ${data?.class_nav_button || ''}`}
              >
                <span>{data?.next_text || 'Siguiente'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* View All Blog Button */}
        {data?.show_view_all !== false && (
          <div className={`text-center mt-12 ${data?.class_view_all_container || ''}`}>
            <button 
              onClick={() => window.location.href = data?.blog_url || '/blog'}
              className={`px-8 py-4 text-lg font-semibold transform hover:scale-105 flex items-center space-x-2 mx-auto transition-all duration-300 ${data?.view_all_bg || 'bg-secondary text-white rounded-lg'} ${data?.class_view_all || ''}`}
            >
              <span>{data?.view_all_text || 'Ver más artículos'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSectionMultivet;