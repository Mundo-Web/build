import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const SliderSimple = ({ data, items }) => {

  const onFormSubmit = (e) => {
    e.preventDefault()
    const input = document.querySelector('[name="search"]')
    location.href = `${data?.link_catalog}?search=${input.value}`
  }

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
          return <SwiperSlide key={`slider-${i}`}>
            <div className="gap-20 bg-no-repeat object-top bg-center bg-cover w-full px-[5%] h-[600px] xl:h-[650px] flex flex-row items-center"
              style={{ backgroundImage: `url('/storage/images/slider/${slider.bg_image}')` }}>
              <div className="flex flex-row justify-center items-center gap-2 w-full xl:w-2/3 py-12 lg:py-24">
                <div className="flex flex-col gap-5 lg:gap-10 items-start px-0 lg:px-[2%]">
                  <h2 className='text-white text-3xl sm:text-5xl md:text-6xl tracking-normal font-poppins_black font-bold uppercase' style={{ textShadow: '0 0 20px rgba(0, 0, 0, .25)' }}>
                    {slider.name}
                  </h2>
                  <p className="text-white text-lg tracking-wider font-poppins_light font-normal" style={{ textShadow: '0 0 20px rgba(0, 0, 0, .25)' }}>
                    {slider.description}
                  </p>
                  <div className="flex flex-row gap-5 md:gap-10 justify-center items-start">
                    <a href={slider.button_link}
                      className="bg-[#CF072C] border-2 border-[#CF072C] flex flex-row items-center gap-3 text-white px-3 md:px-6 py-3 text-base font-poppins_semibold rounded-2xl tracking-wide">
                      {slider.button_text}
                      <i className="ms-1 fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                  <form onSubmit={onFormSubmit} id="tab1" className="flex flex-col sm:flex-row py-2 md:py-4 px-4 tab-content bg-white justify-between items-center gap-2 rounded-2xl w-full md:max-w-[700px]">

                    <div className="w-full">
                      <div className="relative w-full text-left flex flex-col justify-center items-center">
                        <input name='search' type="text" className='w-full py-3 px-3 text-base font-poppins_regular font-semibold text-[#2D464C] border-0 focus:border-0 focus:ring-0' placeholder={data?.placeholder} required />
                      </div>
                    </div>

                    <div className="w-[0.5px] h-[50px] bg-[#E0DEF7] hidden sm:block">
                    </div>

                    <div className="flex justify-start items-center ml-3">
                      <div
                        className="flex flex-row-reverse 2md:flex-row justify-center items-center">
                        <div className="flex flex-row justify-start items-center w-auto">
                          <button 
                            className="bg-[#CF072C] rounded-lg font-poppins_semibold font-medium text-white px-0 md:px-6 py-0 md:py-3 text-center h-full inline-block">
                            <span
                              className="flex w-full md:flex-row md:items-center gap-2 px-10 py-3 md:py-0 sm:px-0">Buscar
                              <i className="fa fa-magnifying-glass"></i></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
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