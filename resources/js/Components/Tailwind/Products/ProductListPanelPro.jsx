import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import General from '../../../Utils/General';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

const ProductListPanelPro = ({ items, generals }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Obtener asesores de WhatsApp (igual que en WhatsApp.jsx y ProductDetailKatya.jsx)
  const whatsappAdvisors = General.whatsapp_advisors || [];

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      setActiveIndex(0); // Resetear a la primera imagen
    } else {
      document.body.style.overflow = 'unset';
      setThumbsSwiper(null); // Reset thumbsSwiper cuando se cierra el modal
      setActiveIndex(0);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  if (!items || items.length === 0) {
    return null;
  }

  const handleWhatsAppQuote = (advisor, item) => {
    // Construir mensaje personalizado con información del producto
    let customMessage = `🌟 ¡Hola! Me interesa solicitar información sobre:\n\n`;
    customMessage += `📦 *Producto:* ${item.name}\n`;
    
    // Agregar características si existen
    if (item.features && item.features.length > 0) {
      customMessage += `\n✅ *Características:*\n`;
      item.features.slice(0, 3).forEach(feat => {
        customMessage += `  • ${feat.feature}\n`;
      });
      if (item.features.length > 3) {
        customMessage += `  • Y ${item.features.length - 3} características más...\n`;
      }
    }
    
    customMessage += `\n💬 Me gustaría recibir más información y cotización.\n¡Gracias!`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(customMessage)}`;
    window.open(whatsappUrl, '_blank');
    setIsAdvisorDropdownOpen(false);
  };

  // Preparar galería de imágenes para el modal
  const getItemGallery = (item) => {
    const gallery = [
      { url: item?.image, type: 'main', alt: 'Imagen principal' }
    ];
    
    if (item?.images && item.images.length > 0) {
      item.images.forEach((img, index) => {
        gallery.push({
          url: img.url,
          type: 'gallery',
          index,
          alt: `Imagen ${index + 1}`
        });
      });
    }
    
    return gallery;
  };

 
 
  
  return (
    <>
      <section id="productListPanelPro" className="py-20 sm:py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-title font-bold text-primary mb-4">
              Tableros de Ingeniería: La Base de tus Grandes Proyectos
            </h2>
            <p className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto">
              En PanelPro, seleccionamos cada tablero bajo estándares de Grado Mueblería. Ya sea que busques la economía del MDP, la versatilidad del MDF o la resistencia estructural del Triplay, nuestras planchas de importación directa (Brasil, Tailandia y China) garantizan cortes limpios y acabados de lujo. Somos especialistas en volumen para el Parque Industrial de Villa El Salvador.
            </p>
          </motion.div>

          {/* Grid de productos - 2 columnas para mejor visualización */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {items.map((item, index) => {
              const imageUrl = item.image 
                ? `/storage/images/item/${item.image}`
                : '/api/cover/thumbnail/null';

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Image container con aspect ratio más alto para productos de madera */}
                  <div className="relative h-80 sm:h-96 overflow-hidden bg-gray-50">
                    {/* Decoración circular */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                    />
                    {/* Overlay gradient sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                    {/* Click indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 cursor-pointer"
                         onClick={() => setSelectedImage(item)}>
                      <div className="bg-white rounded-full p-5 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative p-6 sm:p-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <div 
                        className="text-neutral-light leading-relaxed text-base line-clamp-4 mb-6"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    {/* Action button */}
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-4 transition-all duration-300 group/btn"
                    >
                      <span>Ver más</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                  
                  </div>
                </motion.div>
              );
            })}
          </div>

       
        </div>
      </section>

      {/* Modal de Producto Mejorado */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => {
              setSelectedImage(null);
              setIsAdvisorDropdownOpen(false);
            }}
          >
            {/* Botón cerrar mejorado */}
            <button
              onClick={() => {
                setSelectedImage(null);
                setIsAdvisorDropdownOpen(false);
              }}
              className="fixed top-6 right-6 z-[60] w-12 h-12 bg-white hover:bg-gray-50 text-neutral-dark hover:text-primary transition-all duration-300 rounded-full flex items-center justify-center group shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl w-full max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative bg-white border-2 border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid lg:grid-cols-6 h-full">
                {/* Galería de imágenes - 3 columnas */}
                <div className="lg:col-span-3 bg-white flex items-center justify-center overflow-hidden relative">
                  {/* Imagen principal */}
                  <Swiper
                    key={`main-swiper-${selectedImage.id}`}
                    modules={[Navigation, Thumbs]}
                    navigation={{
                      prevEl: '.custom-main-prev',
                      nextEl: '.custom-main-next',
                    }}
                    spaceBetween={0}
                    slidesPerView={1}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    className="w-full h-full product-modal-swiper"
                  >
                    {getItemGallery(selectedImage).map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="w-full h-full bg-white">
                          <img
                            src={img.url ? `/storage/images/item/${img.url}` : '/api/cover/thumbnail/null'}
                            alt={img.alt}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Botones de navegación CUSTOMIZADOS - Fuera del Swiper */}
                  <button className="custom-main-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center group hover:bg-primary transition-all duration-300 hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6 text-neutral-dark group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button className="custom-main-next absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/95 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center group hover:bg-primary transition-all duration-300 hover:scale-110 active:scale-95">
                    <svg className="w-6 h-6 text-neutral-dark group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Contador de imágenes */}
                  {getItemGallery(selectedImage).length > 1 && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-neutral-dark px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-gray-200 z-10">
                      {activeIndex + 1} / {getItemGallery(selectedImage).length}
                    </div>
                  )}
                  
                  {/* Estilos para deshabilitar botones */}
                  <style jsx>{`
                    .custom-main-prev.swiper-button-disabled,
                    .custom-main-next.swiper-button-disabled {
                      opacity: 0.3;
                      cursor: not-allowed;
                      pointer-events: none;
                    }
                  `}</style>
                </div>

                {/* Información del producto - 2 columnas */}
                <div className="lg:col-span-3 p-6 md:p-8 overflow-y-auto max-h-[90vh] lg:max-h-[90vh] flex flex-col bg-white">
                  {/* Header */}
                  <div className="mb-6 pb-4 border-b-2 border-neutral-light">
                    <h3 className="text-2xl md:text-5xl lg:text-7xl text-primary font-title font-bold leading-tight">
                      {selectedImage.name}
                    </h3>
                  </div>

                  {/* Descripción */}
                  {selectedImage.description && (
                    <div 
                      className="text-neutral-dark leading-relaxed mb-6 text-lg prose prose-sm max-w-none prose-p:my-2"
                      dangerouslySetInnerHTML={{ __html: selectedImage.description }}
                    />
                  )}

                  {/* Especificaciones Técnicas */}
                  {selectedImage.features && selectedImage.features.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-neutral-dark uppercase tracking-wide mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                        Características
                      </h4>
                      <div className="bg-white rounded-xl p-5 space-y-3 ">
                        {selectedImage.features.map((feat, index) => (
                          <div 
                            key={feat.id || index}
                            className="flex items-start gap-3 pb-3 last:pb-0 "
                          >
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-neutral-dark text-base leading-relaxed">{feat.feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Galería de miniaturas */}
                  {getItemGallery(selectedImage).length > 1 && (
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-neutral-dark uppercase tracking-wide mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        Galería de Imágenes
                      </h4>
                      <div className="relative group/thumbs">
                        <Swiper
                          key={`thumbs-swiper-${selectedImage.id}`}
                          modules={[FreeMode, Thumbs, Navigation]}
                          onSwiper={setThumbsSwiper}
                          navigation={{
                            prevEl: '.thumbs-button-prev',
                            nextEl: '.thumbs-button-next',
                          }}
                          spaceBetween={10}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          className="rounded-lg thumbs-swiper !p-2"
                        >
                          {getItemGallery(selectedImage).map((img, index) => (
                            <SwiperSlide key={index}>
                              <div className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                                activeIndex === index 
                                  ? 'border-primary shadow-lg scale-105' 
                                  : 'border-gray-200 hover:border-primary hover:shadow-md'
                              }`}>
                                <img
                                  src={img.url ? `/storage/images/item/${img.url}` : '/api/cover/thumbnail/null'}
                                  alt={img.alt}
                                  className="w-full h-full object-cover"
                                  onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                />
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        
                        {/* Botones de navegación para miniaturas */}
                        <button className="thumbs-button-prev absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity duration-300 hover:bg-primary hover:scale-110">
                          <svg className="w-4 h-4 text-neutral-dark thumbs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button className="thumbs-button-next absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/thumbs:opacity-100 transition-opacity duration-300 hover:bg-primary hover:scale-110">
                          <svg className="w-4 h-4 text-neutral-dark thumbs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        <style jsx>{`
                          .thumbs-button-prev:hover .thumbs-icon,
                          .thumbs-button-next:hover .thumbs-icon {
                            color: white;
                          }
                          .thumbs-button-prev.swiper-button-disabled,
                          .thumbs-button-next.swiper-button-disabled {
                            opacity: 0.3 !important;
                            cursor: not-allowed;
                            pointer-events: none;
                          }
                        `}</style>
                      </div>
                    </div>
                  )}

                  {/* Botones de acción - Fixed al fondo */}
                  <div className="mt-auto pt-6 ">
                    {/* Botón de cotización WhatsApp */}
                    <div className="relative">
                      {whatsappAdvisors.length <= 1 ? (
                        <button
                          onClick={() => {
                            const advisor = whatsappAdvisors[0] || { phone: '+51958973943', message: '' };
                            handleWhatsAppQuote(advisor, selectedImage);
                          }}
                          className="w-full bg-success hover:bg-primary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          Solicitar Cotización
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                            className="w-full bg-success hover:bg-primary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Solicitar Cotización
                            <svg className={`w-5 h-5 transition-transform duration-300 ${isAdvisorDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>

                          {/* Dropdown hacia ARRIBA */}
                          <AnimatePresence>
                            {isAdvisorDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute bottom-full left-0 right-0 mb-3 bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden z-30"
                              >
                                {/* Header del dropdown */}
                                <div className="bg-primary px-5 py-4">
                                  <p className="text-white font-bold text-base">Elige un asesor</p>
                                  <p className="text-white/90 text-sm">Te atenderemos de inmediato</p>
                                </div>
                                
                                {/* Lista de asesores */}
                                <div className="max-h-[220px] overflow-y-auto">
                                  {whatsappAdvisors.map((advisor, index) => (
                                    <motion.button
                                      key={index}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      onClick={() => handleWhatsAppQuote(advisor, selectedImage)}
                                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-all duration-200 text-left border-b border-gray-100 last:border-b-0 group"
                                    >
                                      {/* Avatar */}
                                      <div className="flex-shrink-0">
                                        {advisor.photo ? (
                                          <img
                                            src={`/assets/resources/${advisor.photo}`}
                                            alt={advisor.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.style.display = 'none';
                                              e.target.nextSibling.style.display = 'flex';
                                            }}
                                          />
                                        ) : null}
                                        <div 
                                          className={`w-12 h-12 rounded-full bg-primary items-center justify-center text-white font-bold text-lg ${advisor.photo ? 'hidden' : 'flex'}`}
                                        >
                                          {advisor.name?.charAt(0).toUpperCase()}
                                        </div>
                                      </div>
                                      
                                      {/* Info */}
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-neutral-dark text-base truncate group-hover:text-primary transition-colors">{advisor.name}</p>
                                        <p className="text-sm text-neutral-dark/70 truncate">{advisor.position || 'Asesor comercial'}</p>
                                      </div>
                                      
                                      {/* Icono WhatsApp */}
                                      <svg className="w-6 h-6 text-success flex-shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                      </svg>
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductListPanelPro;