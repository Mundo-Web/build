import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Aos from "aos";
import "swiper/css";
import "swiper/css/pagination";
import "aos/dist/aos.css";
import em from "../../../Utils/em";

const SliderBoxed = ({ sliders, data }) => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <section id={data?.element_id || null} className="bg-gradient-to-r from-[#c4b8d3] to-[#dbc8c9] md:px-[10%] md:py-[2.5%]">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        loop={true}
        className="banner-swiper"
      >
        {sliders.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-[#907755] w-full px-[5%] py-[25%] md:px-[7.5%] md:py-[10%] [background-position:left] md:[background-position:center] md:rounded-3xl"
              style={{
                backgroundImage: `url('/storage/images/slider/${slide.bg_image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h1 className="text-2xl text-white w-2/3 lg:w-1/3" data-aos="fade-down">
                {em(slide.name)}
              </h1>
              <p className="text-white py-4 w-2/3 lg:w-1/3" data-aos="fade-up">
                {slide.description}
              </p>
              {(slide.button_text && slide.button_link) && (
                <a
                  href={slide.button_link}
                  className="bg-[#DAAD9A] text-white text-sm px-4 py-3 rounded border border-white inline-block uppercase"
                  data-aos="fade-up"
                >
                  {slide.button_text}
                </a>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SliderBoxed;
