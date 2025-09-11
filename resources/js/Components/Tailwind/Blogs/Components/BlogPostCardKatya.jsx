import React from 'react';
import { Calendar, Clock, ArrowRight, Eye, Heart, Plus } from 'lucide-react';

export default function BlogPostCardKatya({ data, flex = false, post, featured = false }) {

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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

  // Función para obtener colores específicos de Katya
  const getCategoryColorKatya = (categoryName) => {
    if (!categoryName) return 'bg-primary/10 text-primary';
    
    // Paleta de colores específica para Katya
    const colorMapKatya = {
      'belleza': 'bg-pink-100 text-pink-800',
      'cuidado': 'bg-rose-100 text-rose-800',
      'maquillaje': 'bg-purple-100 text-purple-800',
      'skincare': 'bg-green-100 text-green-800',
      'tratamientos': 'bg-blue-100 text-blue-800',
      'consejos': 'bg-amber-100 text-amber-800',
      'productos': 'bg-indigo-100 text-indigo-800',
      'tendencias': 'bg-violet-100 text-violet-800',
      'tutorial': 'bg-emerald-100 text-emerald-800',
      'reseñas': 'bg-cyan-100 text-cyan-800',
      'lifestyle': 'bg-orange-100 text-orange-800',
      'wellness': 'bg-teal-100 text-teal-800'
    };
    
    const normalizedName = categoryName.toLowerCase().trim();
    return colorMapKatya[normalizedName] || 'bg-primary/10 text-primary';
  };

  if (flex) {
    // Versión flex (para featured posts horizontales)
    return (
      <article className="group relative font-title h-full">
        <a href={`/post/${post?.slug}`} className="block h-full">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer h-full flex border border-gray-100">
            <div className="relative overflow-hidden w-2/5">
              <img
                src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
                alt={post?.title || post?.name}
               className={`w-full h-full aspect-[3/2] object-cover group-hover:scale-110 transition-transform duration-500`}
                onError={(e) => {
                  e.target.src = '/assets/img/noimage/no_img.jpg';
                }}
              />
              
              {/* Overlay gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
            
            </div>

            <div className="p-5 w-3/5 flex flex-col justify-between">
              <div>
                {post?.category && (
                <div className="">
                 <span className={`customtext-secondary text-sm  font-semibold  `}>
                    {post.category?.name}
                  </span>
                </div>
              )}

                <h3 className="text-2xl font-bold mb-2 customtext-neutral-dark group-hover:text-primary transition-colors line-clamp-2 ">
                  {post?.title || post?.name}
                </h3>

                <p className="text-base customtext-neutral-dark line-clamp-3 ">
                  {extractText(post?.extract || post?.description)}
                </p>
              </div>

              <div className="flex text-sm font-medium items-center customtext-neutral-dark justify-between mt-3 pt-3  ">
               <span className='flex gap-2 items-center'> Leer más
                <Plus className="w-4 h-4  group-hover:translate-x-1 transition-transform duration-300" /></span>
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer h-full border border-gray-100">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={post?.image ? `/storage/images/post/${post?.image}` : '/assets/img/noimage/no_img.jpg'}
              alt={post?.title || post?.name}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${featured ? "h-80 aspect-[4/3]" : "h-48"}`}
              onError={(e) => {
                e.target.src = '/assets/img/noimage/no_img.jpg';
              }}
            />
            
            {/* Overlay gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
          
           
          </div>

          <div className="p-6">
           

 {post?.category && (
              <div className="">
                <span className={`customtext-secondary text-sm  font-semibold  `}>
                  {post.category?.name}
                </span>
              </div>
            )}
            <h3 className={`font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight text-2xl`}>
              {post?.title || post?.name}
            </h3>

            <p className="text-base customtext-neutral-dark mb-4 line-clamp-2 ">
              {extractText(post?.extract || post?.description)}
            </p>

            <div className="flex items-center justify-between">
             
              
              <div className="flex items-center space-x-2 customtext-neutral-dark font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                <span>Leer más</span>
                <Plus className="w-4 h-4" />
              </div>
            </div>

            {/* Barra de progreso de lectura (opcional) */}
            {data?.['bool:show_reading_progress'] && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Progreso de lectura</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div className="bg-primary h-1 rounded-full w-0 transition-all duration-300"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}