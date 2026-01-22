import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const CategorySimple = ({ data = {}, items = [] }) => {
    return (
        <section id={data?.element_id || null} className="w-full px-[5%] relative mx-auto pt-12 lg:pt-16">
            <div className="w-full">
                <Swiper
                    spaceBetween={30}
                    slidesPerView={4}
                    pagination={{ clickable: true }}
                    className="carruseltop h-max"
                >
                    {items.map((item) => (
                        <SwiperSlide key={item.slug}>
                            <a href={`/${data?.path}/${item.slug}`}>
                                <div className="flex flex-col max-w-[450px] mx-auto relative">
                                    <img
                                        className="w-full h-auto object-cover aspect-square"
                                        src={`/storage/images/category/${item.image}`}
                                        alt={item.name}
                                    />

                                    <div className="absolute inset-x-0 bottom-0 h-[150px] bg-gradient-to-t from-black/95 to-transparent"></div>
                                    <div className="flex flex-row w-full absolute bottom-5">
                                        <div className="flex flex-row justify-center items-center w-full">
                                            <h2 className="text-white text-2xl tracking-widest font-Urbanist_Semibold font-bold text-center uppercase">
                                                {item.name}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategorySimple;
