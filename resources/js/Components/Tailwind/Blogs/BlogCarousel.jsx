import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import getYTVideoId from "../../../Utils/getYTVideoId";
import YouTube from "react-youtube";

const BlogCarousel = ({ data, items }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYTVideoId(data?.url_video);
  return <>
    <div id={data?.element_id || null} className="w-full mx-auto p-[5%]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{data?.title}</h2>
        <a href={data?.link_blog} className="font-bold">
          {data?.button_text} <i className="mdi mdi-chevron-right"></i>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[2.5%]">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-accent rounded-2xl p-4">
          <Swiper
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 20 }
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={items.length > 1}
            className="!pb-4"
          >
            {items.map((item, index) => {
              const content = document.createElement('div');
              content.innerHTML = item?.description;
              const text = content.textContent || content.innerText || '';

              return <SwiperSlide key={index}>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm h-full">
                  <img
                    src={`/storage/images/post/${item?.image}`}
                    alt={item?.title}
                    className="inset-0 w-full object-cover aspect-[4/3]"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-green-700 mb-2 leading-tight">
                      {item?.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 ">
                      {text}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            })}
          </Swiper>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <div className="relative aspect-[296/512]">
            {!isPlaying ? (
              <>
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/hq720.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute top-1/2 left-1/2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 rounded-full p-4"
                >
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="absolute h-max self-end inset-0 flex flex-col justify-end p-4">
                  <button className="bg-white hover:bg-gray-100 text-green-700 border border-green-700 rounded-full w-full py-2 z-10">
                    {data?.button_video_text}
                  </button>
                </div>
              </>
            ) : (
              <YouTube
                videoId={videoId}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: {
                    autoplay: isPlaying ? 1 : 0,
                    controls: 0,
                    disablekb: 1,
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0
                  },
                }}
                onPause={() => setIsPlaying(false)}
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </>
}
export default BlogCarousel;