import React from 'react';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';

export default function BlogPostCardMultivet({ data, flex = false, post, featured = false }) {

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
    if (!categoryName) return 'bg-primary/20 text-primary';
    
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
      'regulación': 'bg-gray-100 text-gray-800',
      'regulacion': 'bg-gray-100 text-gray-800',
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

  if (flex) {
    // Versión flex (para featured posts horizontales)
    return (
      <article className="group relative font-title h-full">
        <a href={`/post/${post?.slug}`} className="block h-full">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer h-full flex">
            <div className="relative overflow-hidden w-1/2">
              <img
                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                alt={post?.name}
                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500`}
                onError={(e) => {
                  e.target.src = '/assets/img/noimage/no_img.jpg';
                }}
              />
              {post?.category && (
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category?.name)}`}>
                    {post.category?.name}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post?.created_at || post?.post_date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{calculateReadTime(post?.description || post?.summary)}</span>
                  </div>
                </div>

                <h3 className="text-lg font-title font-bold mb-3 group-hover:customtext-primary transition-colors line-clamp-2 customtext-primary">
                  {post?.name}
                </h3>

                <p className="text-sm mb-4 line-clamp-3 customtext-neutral-light">
                  {extractText(post?.description || post?.summary)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                {post?.autor && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm customtext-neutral-light">{post.autor}</span>
                  </div>
                )}
                <button className="customtext-secondary hover:customtext-primary font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Leer más</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </a>
      </article>
    );
  }

  return (
    <article className={`group relative font-title ${featured ? "h-full" : ""}`}>
      <a href={`/post/${post?.slug}`} className="block h-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer h-full">
          <div className="relative overflow-hidden">
            <img
              src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
              alt={post?.name}
              className={`w-full  object-cover group-hover:scale-110 transition-transform duration-500 ${featured ? "h-full aspect-[4/2]" : "h-48"}`}
              onError={(e) => {
                e.target.src = '/assets/img/noimage/no_img.jpg';
              }}
            />
            {post?.category && (
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
                <span>{formatDate(post?.created_at || post?.post_date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{calculateReadTime(post?.description || post?.summary)}</span>
              </div>
            </div>

            <h3 className="text-lg font-title font-bold mb-3 group-hover:customtext-primary transition-colors line-clamp-2 customtext-primary">
              {post?.name}
            </h3>

            <p className="text-sm mb-4 line-clamp-3 customtext-neutral-light">
              {extractText(post?.description || post?.summary)}
            </p>

            <div className="flex items-center justify-between">
              {post?.autor && (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm customtext-neutral-light">{post.autor}</span>
                </div>
              )}
              <button className="customtext-secondary hover:customtext-primary font-semibold text-sm flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Leer más</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {data?.['bool:show_seen'] && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                <i className="mdi mdi-circle-medium"></i>
                <span>Leído hace 5 minutos</span>
              </div>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}
