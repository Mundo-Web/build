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
                            <h2 className="text-5xl md:text-6xl font-extralight text-primary leading-tight whitespace-pre-line">
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
                            <div className="pt-8 overflow-hidden w-full">
                                <Swiper
                                    modules={[Autoplay]}
                                  
                                    spaceBetween={10}
                                    slidesPerView={2}
                                    autoplay={{
                                        delay: 3000,
                                        disableOnInteraction: false,
                                    }}
                                    loop={items.length > 1}
                                    breakpoints={{
                                        768: {
                                            slidesPerView: 3,
                                            loop: items.length > 3,
                                        },
                                    }}
                                    className="!overflow-hidden"
                                >
                                    {items.map((item, index) => {
                                        const symbolUrl = item.symbol
                                            ? `/storage/images/indicator/${item.symbol}`
                                            : '/api/cover/thumbnail/null';

                                        return (
                                            <SwiperSlide key={index}>
                                                <div className="text-center space-y-3 group">
                                                    <div className="inline-flex bg-primary lg:bg-transparent p-4 lg:invert rounded-2xl hover:bg-primary hover:invert-0 transition-all duration-300">
                                                        <img
                                                            src={symbolUrl}
                                                            alt={item.name}
                                                            className="w-8 h-8 object-contain transition-all duration-300"
                                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                        />
                                                    </div>
                                                    <div className="text-4xl font-light text-primary">
                                                        <TextWithHighlight
                                                            text={item.name}
                                                            counter={true}
                                                            color="bg-accent"
                                                            className="font-light"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-light whitespace-pre-line">
                                                        <TextWithHighlight
                                                            text={item.description}
                                                            color="bg-primary"
                                                        />
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
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
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
