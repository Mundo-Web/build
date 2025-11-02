import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TestimonialsFirstClass = ({ items = [], data = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default testimonials if no items provided
  const defaultTestimonials = [
    {
      name: "María González",
      role: "Empresaria",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "FirstClass ha revolucionado mi negocio. Puedo importar productos desde EE.UU. de manera confiable y rápida. El servicio al cliente es excepcional.",
      rating: 5
    },
    {
      name: "Carlos Rivera",
      role: "Freelancer",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Llevo 3 años usando FirstClass y nunca me han fallado. Precios justos, entrega puntual y seguimiento en tiempo real. Totalmente recomendado.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Estudiante",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      description: "Como estudiante, necesito libros y materiales específicos. FirstClass me permite acceder a productos que no están disponibles localmente.",
      rating: 5
    }
  ];

  const testimonials = items.length > 0 ? items : defaultTestimonials;

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
    <section className={`py-20 ${data.class_section || 'bg-gray-50'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${data.class_container || ''}`}>
        <div className={`text-center mb-16 ${data.class_header || ''}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${data.class_title || 'text-gray-900'}`}>
            {data.title || 'Lo que dicen nuestros clientes'}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${data.class_subtitle || 'text-gray-600'}`}>
            {data.subtitle || 'Miles de clientes satisfechos confían en FirstClass para sus envíos internacionales'}
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
                <div key={index} className="w-full flex-shrink-0">
                  <div className={`p-8 rounded-2xl shadow-lg mx-4 ${data.class_card || 'bg-white'}`}>
                    <div className={`flex items-center mb-6 ${data.class_author || ''}`}>
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className={`w-16 h-16 rounded-full object-cover mr-4 ${data.class_image || ''}`}
                      />
                      <div>
                        <h3 className={`text-xl font-semibold ${data.class_name || 'text-gray-900'}`}>
                          {testimonial.name}
                        </h3>
                        <p className={`${data.class_role || 'text-gray-600'}`}>
                          {testimonial.role || testimonial.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    {testimonial.rating && (
                      <div className={`flex mb-4 ${data.class_rating || ''}`}>
                        {[...Array(parseInt(testimonial.rating) || 5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-primary fill-current" />
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-lg italic ${data.class_text || 'text-gray-700'}`}>
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
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${data.class_button || 'bg-white'}`}
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className={`h-6 w-6 ${data.class_icon || 'text-gray-600'}`} />
          </button>
          
          <button
            onClick={nextSlide}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 ${data.class_button || 'bg-white'}`}
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className={`h-6 w-6 ${data.class_icon || 'text-gray-600'}`} />
          </button>

          {/* Dots Indicator */}
          <div className={`flex justify-center mt-8 space-x-2 ${data.class_dots || ''}`}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? (data.class_dot_active || 'bg-primary') : (data.class_dot_inactive || 'bg-gray-300')
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
