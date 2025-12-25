import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import getYTVideoId from '../../../Utils/getYTVideoId';

const TestimonialsVideosWebQuirurgica = ({ items }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <section id="casos" className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight">
              Casos <span className="font-light">Reales</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
            <p className="text-lg text-neutral-dark font-light leading-relaxed">
              Conoce historias reales de transformación y procedimientos quirúrgicos
            </p>
          </div>

          <div className="relative px-12">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              pagination={{
                clickable: true,
                el: '.swiper-pagination-custom',
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="videos-swiper"
            >
              {items.map((video, index) => {
                const videoId = getYTVideoId(video.video_url);
                const thumbnail = videoId 
                  ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                  : '/api/cover/thumbnail/null';

                return (
                  <SwiperSlide key={video.id || index}>
                    <div className="px-2 h-full py-10">
                      <div
                        onClick={() => setSelectedVideo(video)}
                        className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                      >
                        <img
                          src={thumbnail}
                          alt={video.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            if (e.target.src.includes('maxresdefault')) {
                              e.target.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
                            } else {
                              e.target.src = '/api/cover/thumbnail/null';
                            }
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-all duration-300"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/80 group-hover:scale-110 transition-all duration-300 shadow-xl">
                            <svg className="w-8 h-8 text-white fill-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                          <p className="text-sm font-light text-center line-clamp-2 px-2">{video.name}</p>
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine"></div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 transform flex items-center justify-center text-primary border border-gray-200 hover:bg-primary hover:text-white z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 transform flex items-center justify-center text-primary border border-gray-200 hover:bg-primary hover:text-white z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Custom Pagination */}
          <div className="swiper-pagination-custom flex justify-center gap-2 mt-8"></div>
        </div>
      </section>

      {/* Modal de video */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div 
            className="max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${getYTVideoId(selectedVideo.video_url)}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                title={selectedVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {selectedVideo.description && (
              <div className="bg-white p-6">
                <h3 className="text-xl font-light text-primary mb-2">{selectedVideo.name}</h3>
                <p className="text-gray-600 font-light">{selectedVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <style>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #d1d5db !important;
          opacity: 1 !important;
          transition: all 0.3s !important;
          border-radius: 9999px !important;
          margin: 0 4px !important;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 32px !important;
          height: 8px !important;
          background: var(--bg-primary) !important;
        }
      `}</style>
    </>
  );
};

export default TestimonialsVideosWebQuirurgica;
