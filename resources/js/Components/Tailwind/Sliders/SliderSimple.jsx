import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const SliderSimple = ({ items, data }) => {

  return (
    <Swiper
      id={data?.element_id || null}
      className="slider"
      slidesPerView={1}
      loop={true}
      grabCursor={true}
      centeredSlides={false}
      initialSlide={0}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      pagination={{
        el: ".swiper-pagination",
      }}
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 1,
        },
      }}
    >
      {
        items.map((slider, i) => {
          return <SwiperSlide key={`slider-${i}`} className='relative w-full'>
            <img className='absolute top-0 left-0 w-full h-full object-cover object-center z-0' src={`/storage/images/slider/${slider.bg_image || 'undefined'}`} alt={slider.name} />
            <div className="relative w-full px-[5%] replace-max-w-here mx-auto p-4 h-[480px] md:h-[600px] flex flex-col items-start justify-center">
              <div className="flex flex-col gap-5 lg:gap-10 items-start">
                <h2 
                  className='text-3xl sm:text-5xl md:text-6xl tracking-normal font-poppins_black font-bold' 
                  style={{ 
                    color: slider.title_color || '#FFFFFF',
                    textShadow: '0 0 20px rgba(0, 0, 0, .25)' 
                  }}
                >
                  {slider.name}
                </h2>
                <p 
                  className="text-lg tracking-wider font-poppins_light font-normal" 
                  style={{ 
                    color: slider.description_color || '#FFFFFF',
                    textShadow: '0 0 20px rgba(0, 0, 0, .25)' 
                  }}
                >
                  {slider.description}
                </p>
                <div className="flex flex-row gap-5 md:gap-10 justify-center items-start">
                  <a href={slider.button_link}
                    className="bg-[#ffd632] border-2 border-[#ffd632] flex flex-row items-center gap-3 px-3 md:px-6 py-3 text-base rounded-2xl tracking-wide font-bold">
                    {slider.button_text}
                    <i className="ms-1 mdi mdi-chevron-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        })
      }
    </Swiper>

  );
};



export default SliderSimple;