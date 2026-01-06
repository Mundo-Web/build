import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import 'swiper/css';
import TextWithHighlight from '../../../Utils/TextWithHighlight';
import { motion } from 'framer-motion';

const SliderTwoColumnSwiper = ({ items }) => {
  // Animación Ken Burns
  const kenBurnsAnimation = {
    initial: { scale: 1.1, x: 0, y: 0 },
    animate: { 
      scale: 1.2,
      x: [0, 10, 0, -10, 0], // Movimiento suave de lado a lado
      y: [0, 5, 0, -5, 0],    // Movimiento suave arriba y abajo
      transition: {
        duration: 10, // Duración más larga para un efecto más suave
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <div className="relative">
      <Swiper
        className="slider"
        modules={[Pagination]}
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
          el: ".swiper-pagination-slider",
          clickable: true,
          type: 'bullets',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
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
        {items.map((slider, i) => {
          return (
            <SwiperSlide key={`slider-${i}`} className='relative w-full'>
              <motion.div
                className="absolute top-0 left-0 w-full h-full overflow-hidden"
                variants={kenBurnsAnimation}
                initial="initial"
                animate="animate"
              >
                <img 
                  className='w-full h-full object-cover object-center z-0' 
                  src={`/storage/images/slider/${slider.bg_image || 'undefined'}`} 
                  alt={slider.name} 
                  onError={e => e.target.src = '/api/cover/thumbnail/null'} 
                />
              </motion.div>
              
              <div className="relative grid grid-cols-1 lg:grid-cols-2 w-full px-[5%] replace-max-w-here mx-auto p-4 h-[480px] md:h-[600px]">
                <div className="flex flex-col gap-5 2xl:gap-10 items-start justify-center">
                  <h2 className='text-white text-3xl sm:text-5xl md:text-6xl tracking-normal font-semibold font-title !leading-[1.15]'>
                    <TextWithHighlight text={slider?.name}></TextWithHighlight>
                  </h2>
                  
                  <p className="text-white text-lg 2xl:text-xl tracking-wider font-light font-title">
                    {slider.description}
                  </p>
                  
                  <div className="flex flex-row gap-5 md:gap-10 justify-center items-start mt-5">
                    <a href={slider.button_link}
                      className="bg-accent border-2 border-accent customtext-neutral-light flex flex-row items-center px-3 md:px-6 py-2 text-base xl:text-lg 2xl:text-xl rounded-xl tracking-wide font-medium">
                      {slider.button_text}
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="absolute bottom-5 left-0 right-0 z-50 py-4">
        <div className="swiper-pagination-slider flex justify-center items-center"></div>
      </div>
    </div>
  );
};

export default SliderTwoColumnSwiper;