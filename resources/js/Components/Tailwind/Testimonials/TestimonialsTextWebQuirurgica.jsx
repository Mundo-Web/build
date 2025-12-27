import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TestimonialsTextWebQuirurgica = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section id="testimonios" className="py-24 px-4 bg-sections-color">
      <div className="max-w-5xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight">
            Historias de <span className="font-light">Éxito</span>
          </h2>
          <div className=" mx-auto"></div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev-testimonial',
              nextEl: '.swiper-button-next-testimonial',
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination-testimonial',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="testimonials-swiper"
          >
            {items.map((testimonial, index) => {
              const imageUrl = testimonial.image
                ? `/storage/images/testimony/${testimonial.image}`
                : '/api/cover/thumbnail/null';

              return (
                <SwiperSlide key={index}>
                  <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-100">
                    {/* Estrellas de rating */}
                    <div className="flex gap-1 mb-6 justify-center">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-accent fill-accent"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>

                    {/* Descripción del testimonio */}
                    <blockquote className="text-xl md:text-2xl font-light text-neutral-dark text-center mb-8 leading-relaxed min-h-[120px] flex items-center justify-center">
                      "{testimonial.description}"
                    </blockquote>

                    {/* Autor */}
                    <div className="text-center">
                      <img
                        src={imageUrl}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-accent"
                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                      />
                      <div className="text-lg font-light text-primary">{testimonial.name}</div>
                      <div className="text-sm text-neutral-light font-light">
                        {testimonial.role || testimonial.country}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Botones de navegación personalizados */}
          <button className="swiper-button-prev-testimonial absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 transform flex items-center justify-center text-primary z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="swiper-button-next-testimonial absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 transform flex items-center justify-center text-primary z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Paginación personalizada */}
          <div className="swiper-pagination-testimonial flex justify-center gap-2 mt-8"></div>

          <style jsx>{`
            .swiper-pagination-testimonial .swiper-pagination-bullet {
              width: 8px !important;
              height: 8px !important;
              background: #d1d5db !important;
              border-radius: 9999px !important;
              transition: all 0.3s !important;
              opacity: 1 !important;
              margin: 0 4px !important;
            }
            
            .swiper-pagination-testimonial .swiper-pagination-bullet-active {
              background: var(--bg-primary) !important;
              width: 32px !important;
              height: 8px !important;
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsTextWebQuirurgica;
