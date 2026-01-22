import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const CategoryOneLine = ({ data = {}, items = [] }) => {
    return (
        <section id={data?.element_id || null} className="w-full px-[5%] relative mx-auto bg-accent">
            <div className="w-full">
                <Swiper
                    spaceBetween={10}
                    slidesPerView="auto"
                    loop={true}
                    className="category-swiper"
                >
                    {items.map((item) => (
                        <SwiperSlide key={item.slug} className="!w-auto my-2">
                            <a
                                href={`/${data?.path}/${item.slug}`}
                                className="block px-4 py-1.5 rounded-full text-sm font-medium font-paragraph hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
                            >
                                {item.name}
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryOneLine;
