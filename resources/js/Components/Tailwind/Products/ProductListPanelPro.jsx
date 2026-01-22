import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import General from '../../../Utils/General';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { CheckCircle } from 'lucide-react';

const ProductListPanelPro = ({ items, data, onClickTracking }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mainSwiper, setMainSwiper] = useState(null);
  
  // Estado para variantes y selección de atributos
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  
  // Estado para mostrar más detalles
  const [showDetails, setShowDetails] = useState(false);

  // Obtener asesores de WhatsApp (igual que en WhatsApp.jsx y ProductDetailKatya.jsx)
  const whatsappAdvisors = General.whatsapp_advisors || [];

  // Agrupar productos por nombre para evitar repeticiones
  const groupedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    
    const groups = {};
    items.forEach(item => {
      const groupKey = item.name?.trim().toLowerCase() || item.id;
      if (!groups[groupKey]) {
        groups[groupKey] = {
          main: item,
          variants: [item],
          allAttributes: {},
          allApplications: []
        };
      } else {
        groups[groupKey].variants.push(item);
      }
      
      // Recopilar todos los atributos del grupo
      if (item.attributes && item.attributes.length > 0) {
        item.attributes.forEach(attr => {
          const attrName = attr.name || attr.slug;
          if (!groups[groupKey].allAttributes[attrName]) {
            groups[groupKey].allAttributes[attrName] = {
              attribute: attr,
              values: []
            };
          }
          const value = attr.pivot?.value || attr.value;
          if (value && !groups[groupKey].allAttributes[attrName].values.find(v => v.value === value)) {
            groups[groupKey].allAttributes[attrName].values.push({
              value,
              itemId: item.id,
              item: item
            });
          }
        });
      }
      
      // Recopilar todas las aplicaciones del grupo
      if (item.applications && item.applications.length > 0) {
        item.applications.forEach(app => {
          if (!groups[groupKey].allApplications.find(a => a.id === app.id)) {
            groups[groupKey].allApplications.push(app);
          }
        });
      }
    });
    
    return Object.values(groups).map(group => group.main);
  }, [items]);

  // Obtener datos del grupo del producto seleccionado
  const getProductGroup = (item) => {
    if (!items || !item) return null;
    
    const groupKey = item.name?.trim().toLowerCase() || item.id;
    const variants = items.filter(i => (i.name?.trim().toLowerCase() || i.id) === groupKey);
    
    const allAttributes = {};
    const allApplications = [];
    
    variants.forEach(variant => {
      // Recopilar atributos
      if (variant.attributes && variant.attributes.length > 0) {
        variant.attributes.forEach(attr => {
          const attrName = attr.name || attr.slug;
          if (!allAttributes[attrName]) {
            allAttributes[attrName] = {
              attribute: attr,
              values: []
            };
          }
          const value = attr.pivot?.value || attr.value;
          if (value && !allAttributes[attrName].values.find(v => v.value === value)) {
            allAttributes[attrName].values.push({
              value,
              itemId: variant.id,
              item: variant
            });
          }
        });
      }
      
      // Recopilar aplicaciones
      if (variant.applications && variant.applications.length > 0) {
        variant.applications.forEach(app => {
          if (!allApplications.find(a => a.id === app.id)) {
            allApplications.push(app);
          }
        });
      }
    });
    
    return { variants, allAttributes, allApplications };
  };

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      setActiveIndex(0); // Resetear a la primera imagen
      // Resetear selecciones al abrir modal
      setSelectedVariant(selectedImage);
      setShowDetails(false); // Reset details
      
      // Preseleccionar los atributos del producto actual
      const initialAttributes = {};
      if (selectedImage.attributes && selectedImage.attributes.length > 0) {
        selectedImage.attributes.forEach(attr => {
          const attrName = attr.name || attr.slug;
          const value = attr.pivot?.value || attr.value;
          if (value) {
            initialAttributes[attrName] = {
              value,
              itemId: selectedImage.id,
              item: selectedImage
            };
          }
        });
      }
      setSelectedAttributes(initialAttributes);
    } else {
      document.body.style.overflow = 'unset';
      setThumbsSwiper(null); // Reset thumbsSwiper cuando se cierra el modal
      setMainSwiper(null); // Reset mainSwiper
      setActiveIndex(0);
      setSelectedVariant(null);
      setSelectedAttributes({});
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Obtener el producto actual (variante seleccionada o principal)
  const currentProduct = selectedVariant || selectedImage;

  // Obtener aplicaciones del producto actual
  const currentApplications = useMemo(() => {
    if (!currentProduct) return [];
    return currentProduct.applications || [];
  }, [currentProduct]);

  if (!items || items.length === 0) {
    return null;
  }

  const handleProductClick = (item) => {
    // Trackear el click antes de abrir el modal
    if (onClickTracking) {
      onClickTracking(item);
    }
    setSelectedImage(item);
    setSelectedVariant(item);
  };

  // Manejar selección de atributo
  const handleAttributeSelect = (attrName, valueData) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrName]: valueData
    }));
    // Cambiar a la variante correspondiente si existe
    if (valueData.item) {
      setSelectedVariant(valueData.item);
    }
  };

  const handleWhatsAppQuote = (advisor, item) => {
    const productToQuote = selectedVariant || item;
    const group = getProductGroup(item);
    
    // Construir mensaje personalizado con información del producto
    let customMessage = `🌟 ¡Hola! Me interesa solicitar información sobre:\n\n`;
    customMessage += `📦 *Producto:* ${productToQuote.name}\n`;
    
    // Agregar atributos seleccionados
    if (Object.keys(selectedAttributes).length > 0) {
      customMessage += `\n📐 *Especificaciones seleccionadas:*\n`;
      Object.entries(selectedAttributes).forEach(([attrName, valueData]) => {
        const attr = group?.allAttributes[attrName]?.attribute;
        const unit = attr?.unit || '';
        customMessage += `  • ${attrName}: ${valueData.value}${unit}\n`;
      });
    } else if (productToQuote.attributes && productToQuote.attributes.length > 0) {
      // Si no hay selección, mostrar los atributos del producto actual
      customMessage += `\n📐 *Especificaciones:*\n`;
      productToQuote.attributes.slice(0, 5).forEach(attr => {
        const value = attr.pivot?.value || attr.value || '';
        const unit = attr.unit || '';
        customMessage += `  • ${attr.name}: ${value}${unit}\n`;
      });
    }
    
    // Agregar características si existen
    if (productToQuote.features && productToQuote.features.length > 0) {
      customMessage += `\n✅ *Características:*\n`;
      productToQuote.features.slice(0, 3).forEach(feat => {
        customMessage += `  • ${feat.feature}\n`;
      });
      if (productToQuote.features.length > 3) {
        customMessage += `  • Y ${productToQuote.features.length - 3} características más...\n`;
      }
    }
    
    // Agregar aplicaciones si existen
    const apps = productToQuote.applications || [];
    if (apps.length > 0) {
      customMessage += `\n🏭 *Aplicaciones de interés:*\n`;
      apps.slice(0, 3).forEach(app => {
        customMessage += `  • ${app.name}\n`;
      });
    }
    
    customMessage += `\n💬 Me gustaría recibir más información y cotización.\n¡Gracias!`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(customMessage)}`;
    window.open(whatsappUrl, '_blank');
    setIsAdvisorDropdownOpen(false);
  };

  // Preparar galería de imágenes para el modal (usa el producto actual/variante)
  const getItemGallery = (item) => {
    const productToShow = selectedVariant || item;
    const gallery = [
      { url: productToShow?.image, type: 'main', alt: 'Imagen principal' }
    ];
    
    if (productToShow?.images && productToShow.images.length > 0) {
      productToShow.images.forEach((img, index) => {
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
      <section  id={data?.element_id || "productListPanelPro"} className="py-20 sm:py-28 bg-sections-color relative overflow-hidden">
        
        {/* Patrón decorativo de fondo sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
       
        <div className="2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative">
          {/* Header - Estilo maderero elegante */}
          <div className="text-center mb-16 sm:mb-20">
            {/* Subtítulo decorativo */}
            {data?.subtitle && (
            
            <div className="flex items-center justify-center gap-4 mb-6">
          
              <span className="text-sm font-bold text-primary uppercase tracking-[0.3em]">{data?.subtitle}</span>
            
            </div>
            )  }
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-dark font-title mb-6">
              {data?.title || 'Nuestros Productos'}
            </h2>
            
            {/* Línea decorativa 
            
                    <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="w-16 h-1 bg-gradient-to-l from-primary to-secondary rounded-full"></div>
            </div>
            */}
    
            
            <p className="text-lg sm:text-xl text-neutral-light max-w-2xl mx-auto leading-relaxed">
              {data?.description || 'Tableros de madera de la más alta calidad para sus proyectos'}
            </p>
          </div>

          {/* Grid de productos - Cards horizontales estilo catálogo maderero */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {groupedItems.map((item, index) => {
              const imageUrl = item.image 
                ? `/storage/images/item/${item.image}`
                : '/api/cover/thumbnail/null';

              return (
                <div
                  key={item.id || index}
                  onClick={() => handleProductClick(item)}
                  className="group cursor-pointer"
                >
                  {/* Card horizontal - Diseño limpio y elegante */}
                  <div className="relative flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-neutral-200/60 hover:border-primary/40 transition-all duration-500 h-[320px] sm:h-[280px]">
                    
                    {/* Sección de imagen - Izquierda */}
                    <div className="relative sm:w-2/5 h-40 sm:h-full overflow-hidden bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-yellow-50/60">
                     
                      
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                      />
                      
                    
                   
                    </div>

                    {/* Sección de contenido - Derecha */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between relative">
                      
                      <div className="pt-2 flex-1 flex flex-col">
                        {/* Título */}
                        <h3 className="
                        text-5xl font-light text-primary  transition-transform duration-700 flex-shrink-0
                        
                        
                        ">
                          {item.name}
                        </h3>

                        {/* Descripción */}
                        {item.description && (
                          <div 
                            className="text-neutral-light text-sm sm:text-base leading-relaxed line-clamp-4 flex-1"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        )}
                      </div>

                      {/* Botón de acción */}
                      <div className="pt-5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(item);
                          }}
                          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-primary/25 group/btn"
                        >
                          <span>Ver detalles</span>
                          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

       
        </div>
      </section>

      {/* Modal de Producto - Diseño Premium */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-0 lg:p-6 backdrop-blur-sm"
            onClick={() => {
              setSelectedImage(null);
              setIsAdvisorDropdownOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full h-full lg:w-[95vw] lg:h-[92vh] lg:max-w-7xl lg:max-h-[92vh] lg:rounded-3xl shadow-2xl overflow-hidden relative bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar - Esquina superior derecha */}
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setIsAdvisorDropdownOpen(false);
                }}
                className="absolute top-4 right-4 z-[60] w-11 h-11 bg-white/90 hover:bg-primary text-neutral-dark hover:text-white transition-all duration-300 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col lg:flex-row h-full">
                {/* Galería de imágenes - Lado izquierdo */}
                <div className="lg:w-1/2 h-[35vh] lg:h-full  flex flex-col overflow-hidden relative">
                  
                  {/* Imagen principal */}
                  <div className="flex-1 min-h-full relative flex items-center justify-center ">
                    <Swiper
                      key={`main-swiper-${currentProduct?.id || selectedImage.id}`}
                      modules={[Navigation]}
                      navigation={{
                        prevEl: '.custom-main-prev',
                        nextEl: '.custom-main-next',
                      }}
                      loop={getItemGallery(selectedImage).length > 1}
                      spaceBetween={0}
                      slidesPerView={1}
                      onSwiper={setMainSwiper}
                      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                       className='!h-full !m-0 !p-0'
                    
                    >
                      {getItemGallery(selectedImage).map((img, index) => (
                        <SwiperSlide key={index} className="w-full">
                          <div className="w-full h-full flex items-center justify-center">
                            <img
                              src={img.url ? `/storage/images/item/${img.url}` : '/api/cover/thumbnail/null'}
                              alt={img.alt}
                              className="w-full h-full object-cover drop-shadow-lg"
                              onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* Botones de navegación - Solo si hay más de una imagen */}
                    {getItemGallery(selectedImage).length > 1 && (
                      <>
                        <button className="custom-main-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-neutral-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <button className="custom-main-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-neutral-200">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Indicadores de imagen */}
                  {getItemGallery(selectedImage).length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {getItemGallery(selectedImage).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => mainSwiper?.slideTo(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            activeIndex === index ? 'bg-primary w-6' : 'bg-neutral-300 hover:bg-neutral-light'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Información del producto - Lado derecho */}
                <div className="lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-white">
                  {/* Contenido scrolleable */}
                  <div className="flex-1 overflow-y-auto p-6 lg:p-10">
                    
                    {/* Título con estilo premium */}
                    <h3 className="
                    
                    
                     text-5xl lg:text-7xl font-light text-primary mb-2  transition-transform duration-700 flex-shrink-0
                        
                        ">
                      {currentProduct?.name || selectedImage.name}
                    </h3>

                
                    
                    {/* Descripción */}
                    {(currentProduct?.description || selectedImage.description) && (
                      <div 
                        className="text-neutral-dark text-lg lg:text-xl leading-relaxed mb-8 prose prose-neutral max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentProduct?.description || selectedImage.description }}
                      />
                    )}

                    {/* ============ SELECTOR DE MEDIDAS ============ */}
                    {(() => {
                      const group = getProductGroup(selectedImage);
                      const hasGroupAttributes = group && Object.keys(group.allAttributes).length > 0;
                      
                      if (!hasGroupAttributes) return null;
                      
                      return (
                        <div className="mb-10">
                          {Object.entries(group.allAttributes).map(([attrName, attrData]) => {
                            const attr = attrData.attribute;
                            const values = attrData.values;
                            const selectedValue = selectedAttributes[attrName];
                            
                            return (
                              <div key={attrName} className="mb-6 last:mb-0">
                                <h4 className="text-base font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                                  {attrName}
                                  {attr.unit && <span className="text-neutral-light font-normal">({attr.unit})</span>}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                  {values.map((valueData, idx) => {
                                    const isSelected = selectedValue?.value === valueData.value;
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handleAttributeSelect(attrName, valueData)}
                                        className={`min-w-[70px] px-5 py-3 text-lg font-medium transition-all duration-200 rounded-xl border-2 ${
                                          isSelected
                                            ? 'border-primary text-primary shadow-sm'
                                            : 'border-neutral-200 text-neutral-dark  hover:border-neutral-300 hover:bg-neutral-50'
                                        }`}
                                      >
                                        {valueData.value}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* ============ CARACTERÍSTICAS Y APLICACIONES EN GRID ============ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      
                      {/* Características */}
                      {(currentProduct?.features || selectedImage.features)?.length > 0 && (
                        <div>
                          <h4 className="text-base font-semibold text-neutral-dark mb-5">Características</h4>
                          <ul className="space-y-3">
                            {(currentProduct?.features || selectedImage.features).map((feat, index) => (
                              <li 
                                key={feat.id || index}
                                className="flex items-start gap-3 text-base text-neutral-dark "
                              >
                                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feat.feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Aplicaciones */}
                      {(() => {
                        const group = getProductGroup(selectedImage);
                        const applications = currentProduct?.applications || group?.allApplications || [];
                        
                        if (applications.length === 0) return null;
                        
                        return (
                          <div>
                            <h4 className="text-base font-semibold text-neutral-dark mb-5">Ideal para</h4>
                            <div className="flex flex-wrap gap-2.5">
                              {applications.map((app, index) => (
                                <span
                                  key={app.id || index}
                                  className="text-lg text-neutral-dark  bg-neutral-100 px-4 py-2 rounded-lg"
                                >
                                  {app.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                  </div>

                  {/* Botón WhatsApp fijo abajo */}
                  <div className="p-5 lg:p-6 border-t border-neutral-100 bg-white">
                  
                    {/* Botón de cotización WhatsApp */}
                    <div className="relative flex items-end justify-end">
                      {whatsappAdvisors.length <= 1 ? (
                        <button
                          onClick={() => {
                            const advisor = whatsappAdvisors[0] || { phone: '+51958973943', message: '' };
                            handleWhatsAppQuote(advisor, selectedImage);
                          }}
                          className="w-full bg-success  text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 flex items-center justify-center gap-3"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          <span>Solicitar Cotización</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                            className="max-w-max bg-success hover:bg-success  text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 flex items-center justify-center gap-3"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>Solicitar Cotización</span>
                            <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${isAdvisorDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {/* Dropdown de asesores */}
                          <AnimatePresence>
                            {isAdvisorDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute bottom-full max-w-max right-0  mb-2 bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-30"
                              >
                                <div className="p-3 bg-primary border-b border-neutral-100">
                                  <p className="text-base font-medium text-white">Selecciona un asesor</p>
                                </div>
                                <div className="max-h-[200px] x overflow-y-auto">
                                  {whatsappAdvisors.map((advisor, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleWhatsAppQuote(advisor, selectedImage)}
                                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-success/5 transition-colors text-left border-b border-neutral-100 last:border-b-0"
                                    >
                                      <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 flex-shrink-0">
                                        {advisor.photo ? (
                                          <img
                                            src={`/assets/resources/${advisor.photo}`}
                                            alt={advisor.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              e.target.src = '/api/cover/thumbnail/null';
                                            }}
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
                                            {advisor.name?.charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-neutral-dark 0 text-base">{advisor.name}</p>
                                        <p className="text-sm text-neutral-light">{advisor.position || 'Asesor'}</p>
                                      </div>
                                      <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                      </div>
                                    </button>
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