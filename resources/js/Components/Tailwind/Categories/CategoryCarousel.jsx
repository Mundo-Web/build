import React from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CategoryCarousel = ({ data, items }) => {
    return (
        <div id={data?.element_id || null} className="bg-white">
            <div className="px-[5%] replace-max-w-here w-full mx-auto  py-[5%] md:py-[2.5%]">
                <div className="flex flex-wrap justify-between mb-[2%]">
                    <div>
                        {data?.title && (
                            <h1 className="text-2xl font-bold mb-[2%]">
                                {data?.title}
                            </h1>
                        )}
                        {data?.description && (
                            <p className="text-sm mb-[3%]">
                                {data?.description}
                            </p>
                        )}
                    </div>
                    <button
                        href={data?.link_catalog}
                        className="text-primary font-bold"
                    >
                        <span>Ver todas las categorías</span>
                        <i className="mdi mdi-arrow-top-right"></i>
                    </button>
                </div>
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    breakpoints={{
                        0: {
                            slidesPerView: 1.2,
                            spaceBetween: 5,
                        },
                        640: {
                            slidesPerView: 2.2,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 3.2,
                            spaceBetween: 15,
                        },
                        1024: {
                            slidesPerView: 4.2,
                            spaceBetween: 20,
                        },
                    }}
                >
                    {items?.map((item, index) => (
                        <SwiperSlide
                            key={index}
                            className="p-4 shadow-md rounded-2xl bg-white w-full aspect-[4/3] !grid items-center justify-start"
                        >
                            <img
                                className="absolute w-full h-full rounded-2xl top-0 left-0 object-cover object-center"
                                src={`/storage/images/category/${item.image}`}
                                alt=""
                            />
                            <div className="relative block">
                                <h2
                                    className="text-2xl text-white font-bold line-clamp-1 text-ellipsis mb-2"
                                    style={{
                                        textShadow: "0 0 10px rgba(0,0,0,.5)",
                                    }}
                                >
                                    {item.name}
                                </h2>
                                <button
                                    href={`/${data?.path}/${item.slug}`}
                                    className="bg-secondary px-4 py-2 rounded-full font-bold"
                                >
                                    Ver productos
                                    <i className="ms-1 mdi mdi-arrow-top-right"></i>
                                </button>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default CategoryCarousel;
