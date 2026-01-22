import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { resolveSystemAsset } from './bannerUtils';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const BannerAboutStatsPanelPro = ({ data, items = [] }) => {
    const imageUrl = resolveSystemAsset(data?.image) || '/api/cover/thumbnail/null';

    return (
        <section id={data?.element_id || null} className={`py-24 px-primary 2xl:px-0 bg-white ${data?.class || ''}`}>
            <div className="2xl:max-w-7xl mx-auto">
                <div className=" gap-16 items-center">
                    {/* Contenido de texto y estadísticas */}
                    <div className="space-y-8 min-w-0 max-w-4xl mx-auto">
                        <div className="space-y-4">
                            <h2 className={`text-5xl text-center  md:text-6xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line`}>
                                <TextWithHighlight
                                    text={data?.name}
                                    color={`bg-primary font-light`}
                                    className={data?.class_title || ""}
                                />
                            </h2>

                        </div>

                        <p className="text-lg text-neutral-dark text-center leading-relaxed font-light whitespace-pre-line">
                            <TextWithHighlight
                                text={data?.description}
                                color="bg-primary"
                            />
                        </p>

                    </div>

                        {/* Estadísticas dinámicas desde items (Indicators) */}
                        {items.length > 0 && (
                            <div className="py-8 overflow-hidden w-full">
                                <Swiper
                                    modules={[Autoplay]}
                                    spaceBetween={20}
                                    slidesPerView={1.2}
                                    autoplay={{
                                        delay: 3500,
                                        disableOnInteraction: false,
                                    }}
                                    loop={items.length > 1}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        },
                                        768: {
                                            slidesPerView: 4,
                                            spaceBetween: 14,
                                            loop: items.length > 3,
                                        },
                                    }}
                                    className="!overflow-visible"
                                >
                                    {items.map((item, index) => {
                                        const symbolUrl = item.symbol
                                            ? `/storage/images/indicator/${item.symbol}`
                                            : '/api/cover/thumbnail/null';

                                        return (
                                            <SwiperSlide key={index} className="h-auto">
                                                <div className="group h-full">
                                                    {/* Card con diseño premium */}
                                                    <div className={`relative h-full min-h-[320px] bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg hover:shadow-2xl border border-neutral-200/50 hover:border-accent/30 transition-all duration-700 overflow-hidden flex flex-col rounded-2xl ${data?.class_indicators_card || ''}`}>
                                                      
                                                        {/* Contenido */}
                                                        <div className="relative flex flex-col items-center text-center space-y-4 flex-1">
                                                            {/* Icono con backdrop blur */}
                                                            <div className="relative flex-shrink-0">
                                                                <div 
                                                                    className={`relative backdrop-blur-sm p-5 rounded-full group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 ${data?.class_indicators_icon || ''}`}
                                                                    style={{
                                                                       backgroundColor: item.bg_color==='transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={symbolUrl}
                                                                        alt={item.name}
                                                                        className="w-10 h-10 object-contain  opacity-100 group-hover:opacity-100 transition-all duration-700"
                                                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Número contador */}
                                                            <div className="text-5xl font-light text-primary group-hover:scale-105 transition-transform duration-700 flex-shrink-0">
                                                                <TextWithHighlight
                                                                    text={item.name}
                                                                    counter={true}
                                                                    color="bg-accent"
                                                                   
                                                                />
                                                            </div>

                                                            {/* Descripción */}
                                                            <p className="text-base text-neutral-dark font-light leading-relaxed whitespace-pre-line flex-1 flex items-center justify-center group-hover:text-neutral-dark transition-colors duration-700">
                                                                <TextWithHighlight
                                                                    text={item.description}
                                                                    color="bg-primary"
                                                                />
                                                            </p>
                                                        </div>

                                                        {/* Línea decorativa inferior */}
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>
                        )}
                 
                </div>
            </div>
        </section>
    );
};

export default BannerAboutStatsPanelPro;
