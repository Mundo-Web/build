import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause, MessageCircle, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const SliderMultivet = ({ items, data, generals = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDarkBg, setIsDarkBg] = useState(false);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);

  // Obtener datos de WhatsApp de generals
  const phoneWhatsappObj = generals?.find(
    (item) => item.correlative === "phone_whatsapp"
  );
  const messageWhatsappObj = generals?.find(
    (item) => item.correlative === "message_whatsapp"
  );
  
  const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
  const messageWhatsapp = messageWhatsappObj?.description ?? null;

  // Ordenar items por order_index
  const sortedItems = items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];


  // Validaciones para mostrar controles
  const validAlignments = ["center", "left", "right"];
  const validPosition = ["yes", "true", "si"];
  const showPagination = validAlignments.includes(data?.paginationAlignment);
  const alignmentClassPagination = showPagination ? data?.paginationAlignment : "center";
  const showNavigation = validPosition.includes(data?.showNavigation);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || sortedItems.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, sortedItems.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sortedItems.length) % sortedItems.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Función para renderizar texto con palabras destacadas
  const renderTextWithHighlight = (text) => {
    if (!text) return '';
    
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const highlightedText = part.slice(1, -1);
        return (
          <span key={index} className="font-title customtext-accent !uppercase font-extrabold">
            {highlightedText}
          </span>
        );
      }
      return part;
    });
  };

  // Touch and drag handlers
  const isEventOnButtonOrLink = (e) => {
    let el = e.target;
    while (el) {
      if (el.tagName === 'A' || el.tagName === 'BUTTON') return true;
      el = el.parentElement;
    }
    return false;
  };

  const handleTouchStart = (e) => {
    if (isEventOnButtonOrLink(e)) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.touches[0].pageX - startX.current;
    currentTranslate.current = deltaX;
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

  // Función para detectar si la imagen es oscura
  const checkImageDarkness = (src) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r, g, b, avg;
      let colorSum = 0;
      
      for (let x = 0, len = data.length; x < len; x += 4) {
        r = data[x];
        g = data[x + 1];
        b = data[x + 2];
        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
      }
      
      const brightness = Math.floor(colorSum / (canvas.width * canvas.height));
      setIsDarkBg(brightness < 128);
    };
    img.src = src;
  };

  // Verificar oscuridad de la imagen actual
  useEffect(() => {
    if (sortedItems[currentSlide]) {
      const currentItem = sortedItems[currentSlide];
      const imageSrc = `/storage/images/slider/${currentItem.bg_image || "undefined"}`;
      checkImageDarkness(imageSrc);
    }
  }, [currentSlide, sortedItems]);

  // Animation variants
  const imageVariants = {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: 1,
      transition: { duration: 20, repeat: Infinity, repeatType: "loop" }
    },
    exit: { scale: 1, opacity: 0.8, transition: { duration: 0.3 } }
  };

  const titleVariants = {
    initial: { opacity: 0, y: 60, scale: 0.8 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, delay: 0.3, ease: "easeOut" }
    },
    exit: { opacity: 0, y: -30, scale: 0.9, transition: { duration: 0.4 } }
  };

  const descriptionVariants = {
    initial: { opacity: 0, y: 40, filter: "blur(10px)" },
    animate: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.7, delay: 0.6, ease: "easeOut" }
    },
    exit: { opacity: 0, y: -20, filter: "blur(8px)", transition: { duration: 0.3 } }
  };

  const buttonsVariants = {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, delay: 0.9, ease: "easeOut" }
    },
    exit: { opacity: 0, y: 20, scale: 0.8, transition: { duration: 0.2 } }
  };

  if (!sortedItems || sortedItems.length === 0) {
    return (
      <div className="w-full px-primary p-4 mx-auto">
        - No hay slides disponibles -
      </div>
    );
  }

  return (
    <section className="relative h-[calc(100dvh-12dvh)] lg:h-[700px] overflow-hidden">
      {/* Slides Container */}
      <div 
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {sortedItems.map((slide, index) => (
          <div
            key={slide?.id || index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            {/* Background Images */}
            <AnimatePresence>
              {currentSlide === index && (
                <>
                  {/* Desktop Image */}
                  <motion.img
                    key={`image-desktop-${index}`}
                    src={`/storage/images/slider/${slide?.bg_image || "undefined"}`}
                    alt={slide?.name}
                    loading="lazy"
                    className={`hidden md:block absolute top-0 left-0 h-full w-full object-cover ${data?.imageBgPosition || "object-center"} z-0`}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  />
                  {/* Mobile Image */}
                  <motion.img
                    key={`image-mobile-${index}`}
                    src={`/storage/images/slider/${slide?.bg_image_mobile || slide?.bg_image || "undefined"}`}
                    alt={slide?.name}
                    loading="lazy"
                    className={`block md:hidden absolute top-0 left-0 h-full w-full object-cover ${data?.imageBgPosition || "object-center"} z-0`}
                    variants={imageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Overlays */}
            {(slide?.show_overlay !== false && slide?.show_overlay !== 0) && (
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${
                    slide?.overlay_direction === 'to-r' ? 'to right' :
                    slide?.overlay_direction === 'to-l' ? 'to left' :
                    slide?.overlay_direction === 'to-t' ? 'to top' :
                    slide?.overlay_direction === 'to-b' ? 'to bottom' :
                    slide?.overlay_direction === 'to-tr' ? 'to top right' :
                    slide?.overlay_direction === 'to-tl' ? 'to top left' :
                    slide?.overlay_direction === 'to-br' ? 'to bottom right' :
                    slide?.overlay_direction === 'to-bl' ? 'to bottom left' :
                    'to bottom'
                  }, ${slide?.overlay_color || '#000000'}${Math.round((slide?.overlay_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')}, transparent)`
                }}
              ></div>
            )}
            {/* Default gradient overlay from data config if overlay is disabled */}
            {(slide?.show_overlay === false || slide?.show_overlay === 0) && data?.class_overlay && (
              <div className={`absolute inset-0 ${data?.class_overlay}`}></div>
            )}
        
          

            {/* Content */}
            {index === currentSlide && (
              <div className={`relative z-10 h-full flex items-center ${data?.class_content_slider}`}>
                <div className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                  <div className="grid lg:grid-cols-1 gap-12 items-center h-full">
                    {/* Text Content */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`content-${currentSlide}-${slide?.name}`}
                        className={`space-y-6 ${isDarkBg ? "text-white" : "customtext-neutral-dark"}`}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                      {/* Title */}
                      <motion.h1 
                        variants={titleVariants}
                        className={`text-4xl lg:text-7xl lg:max-w-2xl font-bold font-title ${data?.class_title}`}
                        style={{
                          color: slide?.title_color || (isDarkBg ? "#FFFFFF" : "#000000"),
                          textShadow: "0 0 20px rgba(0, 0, 0, .25)"
                        }}
                      >
                        <TextWithHighlight text={slide?.name} color="" />
                      </motion.h1>
                      
                      {/* Description */}
                      <motion.p 
                        variants={descriptionVariants}
                        className={`text-base lg:text-2xl leading-relaxed max-w-2xl font-paragraph ${data?.class_description}`}
                        style={{
                          color: slide?.description_color || (isDarkBg ? "#FFFFFF" : "#000000"),
                          textShadow: "0 0 20px rgba(0, 0, 0, .25)"
                        }}
                      >
                        {slide?.description}
                      </motion.p>

                      {/* Buttons */}
                      {slide?.button_text && slide?.button_link && (
                        <motion.div 
                          variants={buttonsVariants}
                          className="flex flex-col md:flex-row gap-4 pt-4"
                        >
                          <a
                            href={slide?.button_link}
                            className={`bg-primary border-none flex items-center justify-center gap-2 py-3 lg:gap-3 lg:px-8 lg:py-4 text-base rounded-md tracking-wide font-bold text-white ${data?.class_button_primary || ""} transform hover:scale-105 transition-all duration-300`}
                          >
                            <span>{slide?.button_text}</span>
                            <ArrowRight className="w-5 h-5" />
                          </a>

                          {/* WhatsApp Button */}
                          {/*data?.whatsapp_info && phoneWhatsapp && (
                            <a
                              href={`https://wa.me/${phoneWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(messageWhatsapp || '¡Hola! Me interesa obtener más información sobre sus productos.')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white flex items-center justify-center gap-2 py-3 lg:gap-3 px-6 lg:py-4 text-base rounded-xl tracking-wide font-bold hover:bg-white/30 transition-all duration-300 ${data?.class_button_primary || ""}`}
                            >
                              <MessageCircle className="w-5 h-5" />
                              <span>Contactar ahora</span>
                            </a>
                          )*/}
                        </motion.div>
                      )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showNavigation && sortedItems.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hidden lg:flex absolute top-1/2 left-4 lg:left-8 transform -translate-y-1/2 z-20 w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full  items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden lg:flex absolute top-1/2 right-4 lg:right-8 transform -translate-y-1/2 z-20 w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full  items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      {showPagination && sortedItems.length > 1 && (
        <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center space-x-6 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {sortedItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-3 bg-accent rounded-full'
                      : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play Control */}
            <div className="w-px h-6 bg-white/30"></div>
            <button
              onClick={toggleAutoPlay}
              className="text-white hover:text-primary transition-colors duration-300"
              title={isAutoPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Progress Bar */}
            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-300 rounded-full"
                style={{ 
                  width: `${((currentSlide + 1) / sortedItems.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Slide Counter */}
      {sortedItems.length > 1 && (
        <div className="absolute top-8 right-8 z-20">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <span className="text-white font-title">
              <span className="text-primary font-bold text-lg">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="text-white/60 mx-2">/</span>
              <span className="text-white/80">{String(sortedItems.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default SliderMultivet;