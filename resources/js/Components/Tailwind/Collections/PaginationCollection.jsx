import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import './css/PaginationCollection.css';

const PaginationCollection = ({
  items,
  data,
}) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);

  // Validar configuraciones desde data
  const validAlignments = ["center", "left", "right"];
  const showPagination = data?.showPagination === "true" || data?.showPagination === "si" || data?.showPagination === true;
  const alignmentClassPagination = validAlignments.includes(data?.paginationAlignment) 
    ? data?.paginationAlignment 
    : "center";

  // Configuración responsive para slidesPerView
  const breakpoints = {
    0: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1280: {
      slidesPerView: 5,
      spaceBetween: 40,
    },
    1550: {
      slidesPerView: 6,
      spaceBetween: 50,
    },
  };

  // Estilos para la paginación según la alineación
  const paginationStyle = {
    left: alignmentClassPagination === "left" ? "0" : "auto",
    right: alignmentClassPagination === "right" ? "0" : "auto",
    transform: alignmentClassPagination === "center" ? "translateX(-50%)" : "none",
  }

  return (
    <section className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto font-paragraph pt-12 lg:pt-16">
      <div className="w-full px-primary">
        <h2 className={`${data?.centrado ? data.centrado : 'text-left'} text-3xl sm:text-4xl lg:text-[42px] 2xl:text-5xl font-semibold tracking-normal customtext-neutral-dark max-w-5xl 2xl:max-w-6xl !leading-tight`}>
          {data?.title}
        </h2>

        <div className="relative pt-12">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            loop={true}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
              // Calcular el número total de slides basado en breakpoints y items
              const calculateTotalSlides = () => {
                const windowWidth = window.innerWidth;
                let slidesPerView = 2; // default
                
                if (windowWidth >= 1550) slidesPerView = 6;
                else if (windowWidth >= 1280) slidesPerView = 5;
                else if (windowWidth >= 1024) slidesPerView = 4;
                else if (windowWidth >= 768) slidesPerView = 3;
                else if (windowWidth >= 640) slidesPerView = 2;
                
                return Math.ceil(items.length / slidesPerView);
              };
              setTotalSlides(calculateTotalSlides());
            }}
            onSlideChange={(swiper) => {
              setCurrentSlide(swiper.realIndex);
            }}
            breakpoints={breakpoints}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }}
            className="py-4"
          >
            {items.map((collection) => (
              <SwiperSlide key={collection.id}>
                <div className="group min-w-[150px] px-2 flex-shrink-0 group-hover:shadow-xl">
                  <a
                    href={`/catalogo?collection=${collection.slug}`}
                    className="block group"
                  >
                    <div className="bg-transparent rounded-xl p-0 transition-transform duration-300">
                      <div className="aspect-square relative mb-8 rounded-full overflow-hidden w-3/4 mx-auto">
                        <img
                          src={`/storage/images/collection/${collection.image}`}
                          onError={(e) =>
                          (e.target.src =
                            "assets/img/noimage/no_imagen_circular.png")
                          }
                          alt={collection.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-center font-semibold text-base lg:text-lg 2xl:text-2xl customtext-neutral-dark font-paragraph">
                        {collection.name}
                      </h3>
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Botones de navegación */}
          {data?.shownavigation && (
            <>
              <button
                ref={navigationPrevRef}
                className="absolute -left-3 sm:-left-10 top-1/2 z-10 -translate-y-1/2 bg-accent rounded-full p-2 text-white hover:bg-primary hover:bg-opacity-10"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                ref={navigationNextRef}
                className="absolute -right-3 sm:-right-10 top-1/2 z-10 -translate-y-1/2 bg-accent rounded-full p-2 text-white shadow-md hover:bg-primary"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Añadir el contenedor de paginación */}
        </div>
        
        {/* Paginación personalizada */}
        {showPagination  && (
          <div className="w-full relative flex justify-center mt-8 lg:mt-12 gap-2">
            <div className={`flex gap-2 ${
              alignmentClassPagination === "left" 
                ? "justify-start" 
                : alignmentClassPagination === "right" 
                ? "justify-end" 
                : "justify-center"
            }`}>
              {Array.from({ length: totalSlides }, (_, index) => (
                <div
                  key={`pagination-dot-${index}`}
                  className={`inline-flex mx-1 w-3 h-3 rounded-full cursor-pointer transition-all duration-200 ${
                    currentSlide === index
                      ? "bg-white h-5 w-5 border-2 border-accent"
                      : "bg-gray-300 hover:bg-secondary"
                  }`}
                  onClick={() => {
                    // Aquí puedes agregar lógica para ir a un slide específico si es necesario
                  }}
                >
                  {currentSlide === index && (
                    <div className="w-3 h-3 bg-accent rounded-full m-auto"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </section>
  );
};

export default PaginationCollection;