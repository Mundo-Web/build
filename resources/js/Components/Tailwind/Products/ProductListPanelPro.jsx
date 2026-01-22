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
      <section  id={data?.element_id || "productListPanelPro"} className="py-20 sm:py-24 bg-white relative overflow-hidden">
        {/* Decorative elements - igual que BenefitSimple/StrengthSimple */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -ml-48"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -mr-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header - igual que BenefitSimple/StrengthSimple */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4">
              {data?.title || 'Nuestros Productos'}
            </h2>
            <p className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto">
              {data?.subtitle || 'Descubre nuestra selección de productos de alta calidad'}
            </p>
          </div>

          {/* Grid de productos - 2 columnas */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {groupedItems.map((item, index) => {
              const imageUrl = item.image 
                ? `/storage/images/item/${item.image}`
                : '/api/cover/thumbnail/null';
              
              // Obtener información del grupo
              const group = getProductGroup(item);
              const hasVariants = group && group.variants.length > 1;
              const hasAttributes = group && Object.keys(group.allAttributes).length > 0;

              return (
                <div
                  key={item.id || index}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden"
                >
                  {/* Decoración circular */}
                  <div className="absolute top-4 right-4 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500 z-0"></div>

                  {/* Imagen del producto - cubrir todo el ancho */}
                  {item.image && (
                    <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                      />
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Contenido con mejor espaciado */}
                  <div className="relative p-6 sm:p-8">
                    <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-primary/80 transition-colors">
                      {item.name}
                    </h3>

                    {item.description && (
                      <div 
                        className="text-gray-600 leading-relaxed text-base mb-6 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    {/* Botón Ver detalles */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(item);
                      }}
                      className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 hover:gap-3 transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                    >
                      <span>Ver detalles</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>

                  {/* Barra inferior animada */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
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
              className="w-full h-full lg:w-[90vw] lg:h-[90vh] lg:max-w-6xl lg:max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative bg-white lg:border-2 lg:border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row h-full">
                {/* Galería de imágenes - Lado izquierdo */}
                <div className="lg:w-1/2 h-[40vh] lg:h-full bg-gray-50 flex flex-col overflow-hidden">
                  
                
                  
                  {/* Imagen principal - Centrada */}
                  <div className="flex-1 min-h-0 relative flex items-center justify-center ">
                    <Swiper
                      key={`main-swiper-${currentProduct?.id || selectedImage.id}`}
                      modules={[Navigation]}
                      navigation={{
                        prevEl: '.custom-main-prev',
                        nextEl: '.custom-main-next',
                      }}
                      loop={true}
                      spaceBetween={0}
                      slidesPerView={1}
                      onSwiper={setMainSwiper}
                      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {getItemGallery(selectedImage).map((img, index) => (
                        <SwiperSlide key={index}>
                          <div className="w-full h-full flex items-center justify-center">
                            <img
                              src={img.url ? `/storage/images/item/${img.url}` : '/api/cover/thumbnail/null'}
                              alt={img.alt}
                              className="max-w-full h-full object-cover "
                              onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* Botones de navegación */}
                    <button className="custom-main-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button className="custom-main-next absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
             
                </div>

                {/* Información del producto - Lado derecho con scroll */}
                <div className="lg:w-1/2 flex flex-col h-[65vh] lg:h-full bg-white">
                  {/* Contenido scrolleable */}
                  <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    
                    {/* Título */}
                    <h3 className="text-3xl lg:text-6xl text-primary font-title font-bold leading-tight mb-4">
                      {currentProduct?.name || selectedImage.name}
                    </h3>
                    
                    {/* Descripción */}
                    {(currentProduct?.description || selectedImage.description) && (
                      <div 
                        className="text-neutral-dark text-base lg:text-lg leading-relaxed mb-8 prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: currentProduct?.description || selectedImage.description }}
                      />
                    )}

                    {/* ============ SELECTOR DE MEDIDAS ============ */}
                    {(() => {
                      const group = getProductGroup(selectedImage);
                      const hasGroupAttributes = group && Object.keys(group.allAttributes).length > 0;
                      
                      if (!hasGroupAttributes) return null;
                      
                      return (
                        <div className="mb-8">
                          {Object.entries(group.allAttributes).map(([attrName, attrData]) => {
                            const attr = attrData.attribute;
                            const values = attrData.values;
                            const selectedValue = selectedAttributes[attrName];
                            
                            return (
                              <div key={attrName} className="mb-4">
                                <label className="text-base font-bold text-neutral-dark mb-3 block">
                                  {attrName} {attr.unit && <span className="text-neutral-light font-normal">({attr.unit})</span>}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                  {values.map((valueData, idx) => {
                                    const isSelected = selectedValue?.value === valueData.value;
                                    return (
                                      <button
                                        key={idx}
                                        onClick={() => handleAttributeSelect(attrName, valueData)}
                                        className={`min-w-[70px] px-5 py-3 rounded-full font-bold text-base transition-all duration-200 ${
                                          isSelected
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-gray-100 text-neutral-dark hover:bg-primary/10 hover:text-primary'
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

                    {/* ============ CARACTERÍSTICAS ============ */}
                    {(currentProduct?.features || selectedImage.features)?.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-base font-bold text-neutral-dark mb-3 block">Características</h4>
                        <ul className="space-y-2">
                          {(currentProduct?.features || selectedImage.features).slice(0, 6).map((feat, index) => (
                            <li 
                              key={feat.id || index}
                              className="flex items-start gap-3 text-neutral-dark"
                            >
                               <CheckCircle className="w-5 h-5 text-primary" />
                              
                              <span>{feat.feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* ============ APLICACIONES ============ */}
                    {(() => {
                      const group = getProductGroup(selectedImage);
                      const applications = currentProduct?.applications || group?.allApplications || [];
                      
                      if (applications.length === 0) return null;
                      
                      return (
                        <div className="mb-6">
                          <h4 className="text-base font-bold text-neutral-dark mb-3 block">Aplicaciones</h4>
                          <div className="flex flex-wrap gap-2">
                            {applications.map((app, index) => (
                              <span
                                key={app.id || index}
                                className="text-base cursor-pointer  bg-gray-100 text-neutral-dark hover:bg-primary/10 hover:text-primary  px-4 py-2 rounded-full  font-medium"
                              >
                                {app.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* Botón WhatsApp fijo abajo */}
                  <div className="p-5 lg:p-6 border-t border-gray-100 bg-white">
                  
                    {/* Botón de cotización WhatsApp */}
                    <div className="relative">
                      {whatsappAdvisors.length <= 1 ? (
                        <button
                          onClick={() => {
                            const advisor = whatsappAdvisors[0] || { phone: '+51958973943', message: '' };
                            handleWhatsAppQuote(advisor, selectedImage);
                          }}
                          className="w-full bg-success  text-white font-bold py-4 px-5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          Solicitar Cotización
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                            className="w-full bg-success  text-white font-bold py-4 px-5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Solicitar Cotización
                            <svg className={`w-4 h-4 transition-transform ${isAdvisorDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>

                          {/* Dropdown de asesores */}
                          <AnimatePresence>
                            {isAdvisorDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full right-0 right-0 mb-2 bg-white  max-w-max rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-30"
                              >
                                <div className="bg-primary px-4 py-4">
                                  <p className="text-white  text-md">Elige un asesor</p>
                                </div>
                                <div className="max-h-[180px] overflow-y-auto">
                                  {whatsappAdvisors.map((advisor, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleWhatsAppQuote(advisor, selectedImage)}
                                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all text-left border-b border-gray-100 last:border-b-0"
                                    >
                                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
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
                                          <div className="w-full h-full bg-primary  flex items-center justify-center text-white text-lg font-bold">
                                            {advisor.name?.charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-36">
                                        <p className="font-semibold text-neutral-dark text-sm truncate">{advisor.name}</p>
                                        <p className="text-xs text-neutral-light truncate">{advisor.position || 'Asesor'}</p>
                                      </div>
                                      <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                      </svg>
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