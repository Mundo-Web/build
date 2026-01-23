import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ServiceCarousel = ({ data, items = [] }) => {
    const activeItems = items?.filter(item => item.visible && item.status) || [];

    return (
        <section id={data?.element_id || null} className="py-12" style={{ backgroundColor: data?.bg_color }}>
            <div className="2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                <div className="text-center mb-8">
                    {data?.title && (
                        <h2 className="text-3xl font-bold mb-3" style={{ color: data?.title_color }}>
                            {data.title}
                        </h2>
                    )}
                    {data?.subtitle && (
                        <p className="text-lg" style={{ color: data?.subtitle_color }}>
                            {data.subtitle}
                        </p>
                    )}
                </div>
                
                <div className="relative">
                {activeItems.length > 0 && (
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={40}
                        slidesPerView={2}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-service',
                            prevEl: '.swiper-button-prev-service',
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 20
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 40
                            }
                        }}
                        className="service-swiper px-10"
                    >
                        {activeItems.map((service, index) => (
                            <SwiperSlide key={service.id || index}>
                                <div className="bg-white rounded-lg p-8 h-full">
                                    {service.image && (
                                        <div className="mb-6">
                                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                                                <img
                                                    src={`/storage/images/service/${service.image}`}
                                                    alt={service.name}
                                                    className="w-8 h-8 object-contain"
                                                    style={{ filter: 'brightness(0) invert(1)' }}
                                                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <h3 className="customtext-neutralDark text-2xl font-bold mb-4 leading-tight">
                                        {service.name}
                                    </h3>
                                    <p className="customtext-neutral-dark text-base leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
                
                <div className="swiper-button-prev-service absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-primary/80 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <div className="swiper-button-next-service absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-primary/80 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceCarousel;
