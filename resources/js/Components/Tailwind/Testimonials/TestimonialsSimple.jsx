import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const TestimonialsSimple = ({ items, data }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.15
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3 + (i * 0.08),
        type: "spring",
        stiffness: 300,
        damping: 12
      }
    })
  };

  return (
    <section id={data?.element_id || 'testimonialsSimple'} className={`py-20 sm:py-24 bg-sections-color ${data?.class_section || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4"
            variants={titleVariants}
          >
            {data?.title || 'Lo Que Dicen Nuestros Clientes'}
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl lg:text-2xl  text-neutral-light max-w-3xl mx-auto"
            variants={titleVariants}
          >
            {data?.subtitle || 'La confianza de profesionales que exigen lo mejor'}
          </motion.p>
        </motion.div>

        {/* Render Card Function */}
        {(() => {
          const renderCard = (testimonial, index) => {
            const imageUrl = testimonial.image
              ? `/storage/images/testimony/${testimonial.image}`
              : null;

            return (
              <motion.div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-md border border-gray-100 relative overflow-hidden h-full"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.3 }
                }}
              >
                {/* Decorative circle */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full -mr-16 -mt-16 opacity-50"
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.5 }}
                />

                <div className="relative">
                  {/* Quote Icon */}
                  <motion.svg
                    className="w-12 h-12 text-primary mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    variants={quoteVariants}
                  >
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </motion.svg>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(parseInt(testimonial.rating) || 5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        viewBox="0 0 24 24"
                        custom={i}
                        variants={starVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </motion.svg>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <motion.p
                    className="text-neutral-dark leading-relaxed mb-6 text-lg"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    "{testimonial.description}"
                  </motion.p>

                  {/* Author Info */}
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    {imageUrl ? (
                      <motion.img
                        src={imageUrl}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = document.createElement('div');
                          fallback.className = 'w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg';
                          fallback.textContent = testimonial.name?.charAt(0) || '?';
                          e.target.parentNode.insertBefore(fallback, e.target);
                        }}
                      />
                    ) : (
                      <motion.div
                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {testimonial.name?.charAt(0) || '?'}
                      </motion.div>
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
                  </motion.div>
                </div>
              </motion.div>
            );
          };

          return (
            <>
              {/* Mobile: Swiper carousel */}
              <motion.div
                className="block md:hidden overflow-hidden mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={containerVariants}
              >
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1.2}
                  centeredSlides={false}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                  }}
                  loop={items.length > 1}
                  className="!overflow-visible"
                >
                  {items.map((testimonial, index) => (
                    <SwiperSlide key={index} className="h-auto">
                      {renderCard(testimonial, index)}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </motion.div>

              {/* Desktop: Grid layout */}
              <motion.div
                className="hidden md:grid md:grid-cols-2 gap-8 mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={containerVariants}
              >
                {items.map((testimonial, index) => renderCard(testimonial, index))}
              </motion.div>
            </>
          );
        })()}


      </div>
    </section>
  );
};

export default TestimonialsSimple;
