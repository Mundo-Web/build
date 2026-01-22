import React, { useState } from 'react';
import { motion } from 'framer-motion';
import getYTVideoId from '../../../Utils/getYTVideoId';

const TestimonialsVideosWebQuirurgica = ({ items, data }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!items || items.length === 0) {
    return null;
  }

  // Generar alturas dinámicas según cantidad de items
  const generateHeights = (count) => {
    // Si hay 2 o menos items, misma altura (1 por columna)
    if (count <= 2) {
      return Array(count).fill(550);
    }
    
    // Si hay 3 items (impar), los primeros 2 con misma altura, el 3ro ocupa 2 columnas
    if (count === 3) {
      return [550, 550, 500];
    }
    
    // Si es impar, los primeros (count-1) tienen alturas variadas, el último una altura especial
    const isOdd = count % 2 !== 0;
    const itemsToVary = isOdd ? count - 1 : count;
    
    // Si hay más de 3, usar alturas variadas
    const baseHeights = [450, 600, 500, 550, 400, 600, 650, 480, 520, 580];
    const heights = [];
    
    for (let i = 0; i < itemsToVary; i++) {
      heights.push(baseHeights[i % baseHeights.length]);
    }
    
    // Si es impar, agregar altura para el último elemento (que ocupará 2 columnas)
    if (isOdd) {
      heights.push(500); // Altura fija para el elemento que ocupa ambas columnas
    }
    
    return heights;
  };

  const dynamicHeights = generateHeights(items.length);

  return (
    <>
      <section id={data?.element_id || 'casos'} className="w-full bg-secondary py-0">
        {/* Header con padding */}
        <div className="py-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/10 text-white text-sm font-medium tracking-wide uppercase">
                Testimonios
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-white leading-tight">
              Casos <span className="font-light">Reales</span>
            </h2>
            <p className="text-lg text-white font-light leading-relaxed">
              Conoce historias reales de transformación y procedimientos quirúrgicos
            </p>
          </motion.div>
        </div>

        {/* Masonry con CSS columns */}
        <div className="w-full" style={{ 
          columns: '1 auto',
          columnGap: 0
        }}>
          <style>{`
            @media (min-width: 640px) {
              .masonry-container {
                columns: 2 auto;
              }
            }
            @media (min-width: 1024px) {
              .masonry-container {
                columns: 2 auto;
              }
            }
          `}</style>
          <div className="masonry-container" style={{ columnGap: 0 }}>
            {items.map((video, index) => {
              const videoId = getYTVideoId(video.video_url);
              const thumbnail = video.image 
                ? `/storage/images/case_study/${video.image}`
                : (videoId
                    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                    : '/api/cover/thumbnail/null');

              // Altura específica para este item
              const height = dynamicHeights[index];
              
              // Si es el último item y el total es impar, ocupa todas las columnas
              const isLastAndOdd = (items.length % 2 !== 0) && (index === items.length - 1);

              return (
                <motion.div
                  key={video.id || index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ 
                    height: `${height}px`,
                    breakInside: 'avoid',
                    marginBottom: 0,
                    display: 'block',
                    columnSpan: isLastAndOdd ? 'all' : 'none'
                  }}
                  className="group cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedVideo(video)}
                >
                {/* DEBUG: Mostrar el index 
                  <div className="absolute top-2 left-2 z-50 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">
                  Index: {index} | Height: {height}px
                </div> 
                
                */}
             
                <img
                  src={thumbnail}
                  alt={video.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ display: 'block' }}
                  onError={(e) => {
                    if (e.target.src.includes('maxresdefault')) {
                      e.target.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
                    } else {
                      e.target.src = '/api/cover/thumbnail/null';
                    }
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-accent/90 transition-all duration-300 shadow-2xl border-2 border-white/30"
                    style={{ borderRadius: '50%' }}
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                  
                  <h3 className="text-sm md:text-base font-medium text-center line-clamp-2 px-2">
                    {video.name}
                  </h3>
                  
                  {video.description && (
                    <p className="text-xs font-light text-center line-clamp-2 px-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shine"></div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 md:top-8 right-4 md:right-8 text-white hover:text-gray-300 transition-colors z-10 w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center group"
            style={{ borderRadius: '50%' }}
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl w-full shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYTVideoId(selectedVideo.video_url)}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {selectedVideo.description && (
              <div className="bg-white p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-light text-primary mb-3">{selectedVideo.name}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{selectedVideo.description}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </>
  );
};

export default TestimonialsVideosWebQuirurgica;
