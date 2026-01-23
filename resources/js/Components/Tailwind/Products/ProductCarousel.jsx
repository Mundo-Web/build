import React from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../Components/ProductCard";

const ProductCarousel = ({ data, items, cart, setCart }) => {
    if (items.length == 0) return;

    return (
        <div className="bg-gray-50" id={data?.element_id || null}>
            <div className="px-[5%] w-full mx-auto py-[5%] md:py-[2.5%]">
                <div className="flex flex-wrap justify-between items-center mb-[2%]">
                    <div>
                        {data?.title && (
                            <h1 className="text-2xl font-bold mb-[2%]">
                                {data?.title}
                            </h1>
                        )}
                        {data?.description && (
                            <p className="mb-[3%]">
                                {data?.description}
                            </p>
                        )}
                    </div>
                    <button
                        href={data?.link_catalog}
                        className="text-primary font-bold bg-primary rounded-full px-4 py-2 text-white"
                    >
                        <span>{data?.button_text || 'Ver todos los productos'}</span>
                        <i className="mdi mdi-arrow-top-right ms-1"></i>
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
                            slidesPerView: 1,
                            spaceBetween: 5,
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 15,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    }}
                >
                    {items?.map((item, index) => (
                        <SwiperSlide key={index}>
                            <ProductCard
                                data={data}
                                item={item}
                                cart={cart}
                                setCart={setCart}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductCarousel;
