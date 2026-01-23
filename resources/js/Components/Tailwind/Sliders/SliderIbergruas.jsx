import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SliderIbergruas = ({ items, data, generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isDragging = useRef(false);
  const startPos = useRef(0);
  const currentTranslate = useRef(0);

  // Sort items by order_index
  const sortedItems = items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];

  // Get WhatsApp info from generals
  const phoneWhatsappObj = generals?.find(
    (item) => item.correlative === "phone_whatsapp"
  );

  const messageWhatsappObj = generals?.find(
    (item) => item.correlative === "message_whatsapp"
  );

  const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
  const messageWhatsapp = messageWhatsappObj?.description ?? null;

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || sortedItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, sortedItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sortedItems.length) % sortedItems.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    isDragging.current = true;
    startPos.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    currentTranslate.current = e.touches[0].clientX - startPos.current;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const threshold = 50;
    if (currentTranslate.current > threshold) {
      prevSlide();
    } else if (currentTranslate.current < -threshold) {
      nextSlide();
    }
    currentTranslate.current = 0;
  };

  // Parse title with highlighted words (words between *)
  const parseTitle = (text) => {
    if (!text) return null;

    const parts = text.split(/(\*[^*]+\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const word = part.slice(1, -1);
        return (
          <span key={index} className="customtext-primary">
            {word}
          </span>
        );
      }
      return <span key={index} className="text-white">{part}</span>;
    });
  };

  // Animation variants
  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0, y: -30 }
  };

  if (!sortedItems || sortedItems.length === 0) {
    return null;
  }

  return (
    <section id={data?.element_id || null} className="relative h-[calc(100dvh-5rem)] lg:h-[700px] overflow-hidden">
      {/* Slides Container */}
      <div
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {sortedItems.map((slide, index) => {
            if (index !== currentSlide) return null;

            return (
              <motion.div
                key={slide?.id || index}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                {/* Background - Video has priority, then Image */}
                {slide?.bg_video && slide.bg_video.trim() !== '' ? (
                  // YouTube Video Background
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${slide.bg_video}?autoplay=1&mute=1&loop=1&playlist=${slide.bg_video}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                      className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
                      allow="autoplay; encrypted-media"
                      frameBorder="0"
                      title={`Video ${index}`}
                    />
                  </div>
                ) : (
                  // Image Background
                  <>
                    {/* Desktop Image */}
                    <div className="hidden md:block absolute inset-0">
                      <img
                        src={`/api/sliders/media/${slide?.bg_image}`}
                        alt={slide?.name || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                    {/* Mobile Image */}
                    <div className="block md:hidden absolute inset-0">
                      <img
                        src={`/api/sliders/media/${slide?.bg_image_mobile || slide?.bg_image}`}
                        alt={slide?.name || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </>
                )}

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Content */}
                <div className="relative h-full flex items-center justify-center">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`content-${currentSlide}`}
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="max-w-3xl mx-auto text-center"
                      >
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-title max-w-lg mx-auto font-bold mb-6 leading-tight">
                          {parseTitle(slide?.name)}
                        </h1>

                        {/* Description */}
                        {slide?.description && (
                          <p className="text-lg md:text-xl lg:text-2xl text-white mb-8 max-w-2xl mx-auto">
                            {slide.description}
                          </p>
                        )}

                        {/* Button */}
                        {slide?.button_text && slide?.button_link && (
                          <a
                            href={slide.button_link}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-primary customtext-primary text-lg font-bold hover:bg-primary hover:text-white transition-all duration-300"
                          >
                            <span>{slide.button_text}</span>
                          </a>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {sortedItems.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-300 hidden md:block"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-300 hidden md:block"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {sortedItems.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {sortedItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${index === currentSlide
                ? 'w-8 h-3 bg-primary rounded-full'
                : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {sortedItems.length > 1 && (
        <div className="absolute bottom-8 right-8 z-10 hidden md:flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {String(currentSlide + 1).padStart(2, '0')}
            </span>
            <span className="text-white/50">/</span>
            <span className="text-white/50">
              {String(sortedItems.length).padStart(2, '0')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{
                width: `${((currentSlide + 1) / sortedItems.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SliderIbergruas;