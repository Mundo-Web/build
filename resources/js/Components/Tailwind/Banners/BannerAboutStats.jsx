import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { resolveSystemAsset } from './bannerUtils';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const BannerAboutStats = ({ data, items = [] }) => {
    const imageUrl = resolveSystemAsset(data?.image) || '/api/cover/thumbnail/null';

    return (
        <section className={`py-24 px-primary 2xl:px-0 bg-white ${data?.class || ''}`}>
            <div className="2xl:max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Contenido de texto y estadísticas */}
                    <div className="space-y-8 min-w-0">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line">
                                <TextWithHighlight
                                    text={data?.name}
                                    color="bg-primary font-light"
                                    className=""
                                />
                            </h2>

                        </div>

                        <p className="text-lg text-neutral-dark leading-relaxed font-light whitespace-pre-line">
                            <TextWithHighlight
                                text={data?.description}
                                color="bg-primary"
                            />
                        </p>

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
                                            slidesPerView: 3,
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
                                            <SwiperSlide key={index}>
                                                <div className="group h-full">
                                                    {/* Card con diseño premium */}
                                                    <div className="relative h-full bg-gradient-to-br from-white via-neutral-50/50 to-white -3xl p-8 shadow-lg hover:shadow-2xl border border-neutral-200/50 hover:border-accent/30 transition-all duration-700 overflow-hidden">
                                                      
                                                        {/* Contenido */}
                                                        <div className="relative flex flex-col items-center text-center space-y-4">
                                                            {/* Icono con backdrop blur */}
                                                            <div className="relative">
                                                                <div className="relative bg-primary backdrop-blur-sm p-5 -full group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                                                                    <img
                                                                        src={symbolUrl}
                                                                        alt={item.name}
                                                                        className="w-10 h-10 object-contain  opacity-100 group-hover:opacity-100 transition-all duration-700"
                                                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Número contador */}
                                                            <div className="text-5xl font-light text-primary group-hover:scale-105 transition-transform duration-700">
                                                                <TextWithHighlight
                                                                    text={item.name}
                                                                    counter={true}
                                                                    color="bg-accent"
                                                                   
                                                                />
                                                            </div>

                                                            {/* Descripción */}
                                                            <p className="text-sm text-neutral-dark/70 font-light leading-relaxed whitespace-pre-line min-h-[3rem] group-hover:text-neutral-dark transition-colors duration-700">
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

                    {/* Imagen */}
                    <div className="relative">
                        <div className="relative -3xl border-secondary border-8 overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                            <img
                                src={imageUrl}
                                alt={data?.name || 'Banner'}
                                className="aspect-[3/4] w-full object-cover"
                                onError={(e) =>
                                (e.target.src =
                                    "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                       
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerAboutStats;
