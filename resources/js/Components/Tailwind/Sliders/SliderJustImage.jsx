import React from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SliderJustImage = ({ data, items }) => {
  const onFormSubmit = (e) => {
    e.preventDefault();
    const input = document.querySelector('[name="search"]');
    location.href = `${data?.link_catalog}?search=${input.value}`;
  };

  return (
    <Swiper
      id={data?.element_id || null}
      className="slider"
      slidesPerView={1}
      modules={[Autoplay]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
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
      {items.map((slider, i) => {
        return (
          <SwiperSlide className="!w-full relative" key={`slider-${i}`}>
            {slider.bg_type === 'image' ? (
              <img
                src={`/storage/images/slider/${slider.bg_image}`}
                alt=""
                className="w-full apect-[14/5] object-cover"
                onError={e => e.target.src = '/api/cover/thumbnail/null'}
              />
            ) : (
              <div className="relative w-full aspect-[14/5] overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${slider.bg_video}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${slider.bg_video}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2"
                  frameBorder="0"
                  title="YouTube video player"
                />
              </div>
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default SliderJustImage;
