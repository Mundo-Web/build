import React from 'react';

const TestimonialsSimple = ({ items, data }) => {
  if (!items || items.length === 0) {
    return null;
  }



  return (
    <section className={`py-20 sm:py-24 bg-white ${data?.class_section || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-primary mb-4">
            {data?.title || 'Lo Que Dicen Nuestros Clientes'}
          </h2>
          <p className="text-lg sm:text-xl text-neutral-light max-w-3xl mx-auto">
            {data?.subtitle || 'La confianza de profesionales que exigen lo mejor'}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {items.map((testimonial, index) => {
            const imageUrl = testimonial.image
              ? `/storage/images/testimony/${testimonial.image}`
              : null;

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden"
              >
                {/* Decorative circle */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full -mr-16 -mt-16 opacity-50"></div>

                <div className="relative">
                  {/* Quote Icon */}
                  <svg 
                    className="w-12 h-12 text-primary mb-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-neutral-dark leading-relaxed mb-6 italic text-lg">
                    "{testimonial.description}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg';
                          fallback.textContent = testimonial.name?.charAt(0) || '?';
                          e.target.parentNode.insertBefore(fallback, e.target);
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name?.charAt(0) || '?'}
                      </div>
                    )}

                    <div>
                      <div className="font-bold text-primary">{testimonial.name}</div>
                      {testimonial.role && (
                        <div className="text-sm text-neutral-light">{testimonial.role}</div>
                      )}
                      {testimonial.company && (
                        <div className="text-sm text-primary font-medium">{testimonial.company}</div>
                      )}
                      {!testimonial.company && testimonial.country && (
                        <div className="text-sm text-neutral-light">{testimonial.country}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
};

export default TestimonialsSimple;
