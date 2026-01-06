import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const BlogCarrusel = ({ items, itemVariants, hoverCard, hoverImage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const swiperRef = useRef(null);

  // Calcular slidesPerView basado en el tamaño de pantalla actual
  const getSlidesPerView = () => {
    if (typeof window === 'undefined') return 1;
    const width = window.innerWidth;
    if (width >= 1600) return 3;
    if (width >= 640) return 2;
    return 1;
  };

  // Calcular total de páginas basado en slidesPerView
  const getTotalPages = () => {
    const slidesPerView = getSlidesPerView();
    return Math.ceil(items.length / slidesPerView);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const goToPage = (pageIndex) => {
    const slidesPerView = getSlidesPerView();
    const slideIndex = pageIndex * slidesPerView;
    goToSlide(slideIndex);
  };

  // Configurar navegación cuando el componente se monte
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      
      // Actualizar parámetros de navegación
      swiper.params.navigation.prevEl = navigationPrevRef.current;
      swiper.params.navigation.nextEl = navigationNextRef.current;
      
      // Reinicializar navegación
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  // Manejar cambios de tamaño de ventana para recalcular páginas
  useEffect(() => {
    const handleResize = () => {
      const slidesPerView = getSlidesPerView();
      const newCurrentPage = Math.floor(currentSlide / slidesPerView);
      setCurrentPage(newCurrentPage);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentSlide]);

  return (
    <motion.div 
      variants={itemVariants}
      className="col-span-1 lg:col-span-2 rounded-2xl p-4"
    >
      <div className="relative xl:px-12">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          loop={true}
          navigation={{
            prevEl: '.blog-nav-prev',
            nextEl: '.blog-nav-next',
          }}
          onSwiper={(swiper) => {
            // Configurar navegación después de que Swiper esté listo
            setTimeout(() => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
              swiper.navigation.destroy();
              swiper.navigation.init();
              swiper.navigation.update();
            }, 100);
          }}
          onSlideChange={(swiper) => {
            setCurrentSlide(swiper.realIndex);
            // Calcular página actual basándose en el slide y slidesPerView
            const slidesPerView = getSlidesPerView();
            const currentPageIndex = Math.floor(swiper.realIndex / slidesPerView);
            setCurrentPage(currentPageIndex);
          }}
          
          slidesPerView={1}
          breakpoints={{
            0:{
              slidesPerView: 1,
              spaceBetween: 30
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            1600: {
              slidesPerView: 3,
              spaceBetween: 20
            },
          }}
          className="mySwiper"
        >
          {items.map((item, index) => {
            const content = document.createElement("div");
            content.innerHTML = item?.description;
            const text = content.textContent || content.innerText || "";

            return (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm h-auto cursor-pointer">
                  <div className="w-full aspect-square overflow-hidden rounded-xl">
                    <motion.img
                      src={`/storage/images/post/${item?.image}`}
                      alt={item?.title}
                      className="w-full h-full object-cover"
                      whileHover={hoverImage}
                    />
                  </div>
                  <div className="py-4">
                    <h3 className="text-2xl font-semibold mt-1 mb-2 leading-tight">
                      {item?.name}
                    </h3>
                    <p className="text-base line-clamp-2">
                      {text}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Botones de navegación en los laterales */}
        <button
          ref={navigationPrevRef}
          className="blog-nav-prev hidden xl:flex absolute top-1/2 -left-2 z-10 w-12 h-12 bg-secondary backdrop-blur-sm border border-gray-200 rounded-full items-center justify-center text-white hover:bg-primary hover:shadow-lg transition-all duration-300 -translate-y-1/2"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <button
          ref={navigationNextRef}
          className="blog-nav-next hidden xl:flex absolute top-1/2 -right-2 z-10 w-12 h-12 bg-secondary backdrop-blur-sm border border-gray-200 rounded-full items-center justify-center text-white hover:bg-primary hover:shadow-lg transition-all duration-300 -translate-y-1/2"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        
        {/* Paginación glassmorphism para móvil */}
        {getTotalPages() > 1 && (
          <div className="flex lg:hidden justify-center mt-8">
            <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              {/* Dots Indicator - Un punto por página */}
              <div className="flex space-x-3">
                {Array.from({ length: getTotalPages() }).map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => goToPage(pageIndex)}
                    className={`transition-all duration-300 ${
                      pageIndex === currentPage
                        ? 'w-8 h-3 bg-accent rounded-full'
                        : 'w-3 h-3 bg-white/50 rounded-full hover:bg-primary/70'
                    }`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="w-px h-5 bg-white/30"></div>
              <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-300 rounded-full"
                  style={{ 
                    width: `${((currentPage + 1) / getTotalPages()) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogCarrusel;