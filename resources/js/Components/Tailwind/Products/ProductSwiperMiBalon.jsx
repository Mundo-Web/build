import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardProductMiBalon from "./Components/CardProductMiBalon";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const ProductSwiperMiBalon = ({ items, data, setCart, cart }) => {
    if (!items || items.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section
            id={data?.element_id || null}
            className={`py-16 md:py-24 bg-neutral-50 ${data?.class_container || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div className="text-left">
                        <h2
                            className={`text-4xl md:text-7xl  font-title text-neutral-dark tracking-tight mb-2 ${data?.class_title || ""}`}
                        >
                            <TextWithHighlight
                                text={data?.title}
                                className="text-neutral-dark font-title "
                                color="bg-primary"
                            />
                        </h2>
                        {data?.description && (
                            <p className="text-gray-500 max-w-2xl text-lg">
                                {data.description}
                            </p>
                        )}
                    </div>
                    {/* Custom Navigation */}
                    <div className="flex gap-3">
                        <button
                            ref={prevRef}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-neutral-dark shadow-md hover:bg-primary hover:text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            ref={nextRef}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-neutral-dark shadow-md hover:bg-primary hover:text-white transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Swiper */}
                <div className="relative pb-10">
                    <Swiper
                        modules={[Autoplay, A11y, Keyboard, Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="w-full !px-4 !py-6 -mx-4"
                    >
                        {items.map((product, index) => (
                            <SwiperSlide
                                key={`${product.id}-${index}`}
                                className="h-auto"
                            >
                                <CardProductMiBalon
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    data={data}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {data?.link_catalog && (
                    <div className="text-center mt-4">
                        <a
                            href={data.link_catalog}
                            className="inline-block text-primary font-bold hover:underline transition-colors hover:text-neutral-dark"
                        >
                            Ver todo el catálogo →
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSwiperMiBalon;
