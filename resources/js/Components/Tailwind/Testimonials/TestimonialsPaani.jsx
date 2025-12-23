import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useRef } from "react";
import "swiper/css";
import { Star } from "lucide-react";
import Global from "../../../Utils/Global";



const backgroundImage =
    `/assets/${Global.APP_CORRELATIVE}/testimonials.png`

const TestimonialsPaani = ({items}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

  const highlightText = (desc) => {
    const parts = desc.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <span key={i} className="font-bold text-primary-700">
          {part.slice(2, -2)}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };
    return (
        <section className="hidden lg:block w-full py-12 md:py-24 bg-white px-primary 2xl:px-0 2xl:max-w-7xl mx-auto  overflow-hidden">
            <div className="  ">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center ">
                   
                    <div className="relative h-[340px] w-[340px] md:h-[440px] md:w-[440px] rounded-xl  bg-primary  md:col-span-2">
                        <img
                            src={`/assets/resources/testimonials.png?v=${crypto.randomUUID()}`}
                            alt={`Testimonios de ${items.length} clientes satisfechos ${Global.APP_NAME}`}
                            className="absolute left-1/2 -translate-x-1/2 -top-24 max-h-[670px] object-cover object-bottom drop-shadow-2xl"
                            style={{
                                objectPosition: "center 100%",
                                zIndex: 2,
                           
                            }}
                              onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/img/logo-bk.svg';
                                }}
                            loading="lazy"
                        />
                    </div>
                    {/* Swiper de testimonios */}
                    <div className="space-y-8 md:col-span-3 flex flex-col items-center">
                        <div className="space-y-4 max-w-xl">
                            <h2 className="text-3xl customtext-neutral-light text-center md:text-4xl font-bold tracking-tight text-gray-900">
                                Historias que inspiran: Resultados reales de nuestras soluciones
                            </h2>
                            <p className="text-lg customtext-neutral-light text-center">
                                Empresas como la tuya ya están marcando la diferencia. Conoce sus logros.
                            </p>
                        </div>
                    <div className="bg-secondary p-6 rounded-xl max-w-2xl">
                            <Swiper
                            slidesPerView={1}
                            spaceBetween={24}
                            loop={true}
                            className="w-full"
                            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                        >
                            {items && items.map((t, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="">
                                        <blockquote className="text-gray-800 text-center text-base md:text-lg font-medium">
                                            &quot;{highlightText(t.description)}&quot;
                                        </blockquote>
                                        <div className="mt-6 flex flex-col items-center">
                                           
                                            <p className="font-medium text-gray-900">{t.name}</p>
                                          
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        {/* Miniaturas debajo */}
                        <div className="flex justify-center gap-4 mt-8">
                            {items && items.map((t, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (swiperRef.current) {
                                            swiperRef.current.slideToLoop(idx);
                                        }
                                    }}
                                    className={`rounded-full border-2  transition-all duration-200 bg-white shadow-md 
                                        ${activeIndex === idx ? "border-primary " : "border-transparent"}
                                    `}
                                    style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}
                                    aria-label={t.name}
                                >
                                    <img
                                        src={`/storage/images/testimony/${t?.image}` || "/api/cover/thumbnail/null"}
                                        alt={t.name}
                                        className="w-12 h-12 object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.src = "/api/cover/thumbnail/null";
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsPaani;