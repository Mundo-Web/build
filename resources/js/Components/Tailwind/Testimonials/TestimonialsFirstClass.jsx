import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsFirstClass = ({ items = [], data = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Asegurar que data sea un objeto
  const safeData = data || {};

  // Si no hay items, no mostrar nada
  if (!items || items.length === 0) {
    return null;
  }

  const testimonials = items;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id={data?.element_id || null} className={`py-20 ${safeData.class_section || 'bg-gray-50'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${safeData.class_container || ''}`}>
        <div className={`text-center mb-16 ${safeData.class_header || ''}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${safeData.class_title || 'text-gray-900'}`}>
            {safeData.title || 'Lo que dicen nuestros clientes'}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${safeData.class_subtitle || 'customtext-primary-light'}`}>
            {safeData.subtitle || 'Miles de clientes satisfechos confían en FirstClass para sus envíos internacionales'}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 py-4">
                  <div className={`p-8 rounded-2xl shadow-lg mx-4 ${safeData.class_card || 'bg-white'}`}>
                    <div className={`flex items-center mb-6 ${safeData.class_author || ''}`}>
                      <img
                        src={`/storage/images/testimony/${testimonial.image}`}
                        alt={testimonial.name}
                        className={`w-16 h-16 rounded-full object-cover mr-4 ${safeData.class_image || ''}`}
                        onError={(e) => {
                          e.target.src = '/api/cover/thumbnail/null';
                        }}
                      />
                      <div>
                        <h3 className={`text-xl font-semibold ${safeData.class_name || 'text-gray-900'}`}>
                          {testimonial.name}
                        </h3>
                        <p className={`${safeData.class_role || 'customtext-primary-light'}`}>
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                    
                    {testimonial.rating && (
                      <div className={`flex mb-4 ${safeData.class_rating || ''}`}>
                        {[...Array(parseInt(testimonial.rating) || 5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 customtext-primary fill-current" />
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-lg italic ${safeData.class_text || 'customtext-primary-dark'}`}>
                      "{testimonial.description}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${safeData.class_button || 'bg-white'}`}
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className={`h-6 w-6 ${safeData.class_icon || 'customtext-primary-light'}`} />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${safeData.class_button || 'bg-white'}`}
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className={`h-6 w-6 ${safeData.class_icon || 'customtext-primary-light'}`} />
          </button>

          {/* Dots Indicator */}
          <div className={`flex justify-center mt-8 space-x-2 ${safeData.class_dots || ''}`}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? (safeData.class_dot_active || 'bg-primary') : (safeData.class_dot_inactive || 'bg-gray-300')
                }`}
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsFirstClass;
