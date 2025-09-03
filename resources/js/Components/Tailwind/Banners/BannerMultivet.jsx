import React from "react";
import TextWithHighlight_Second from "../../../Utils/TextWithHighlight_Second";

const BannerMultivet = ({ data }) => {
    
    // Estilos para posicionamiento avanzado de imagen
    const imageOverflowStyle = 'xl:absolute xl:right-0 xl:bottom-0 xl:top-4 xl:w-1/2 xl:h-auto xl:overflow-visible xl:z-10';
    
    return (
        <section className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-12 xl:py-16 ${data?.section_background || 'bg-white'} ${data?.class_section || ''}`}>
            <div className={`flex flex-col xl:flex-row justify-start items-stretch w-full rounded-3xl relative overflow-hidden min-h-[400px] xl:min-h-[500px] ${data?.container_background || 'bg-gradient-to-br from-[#F2F2F2] to-[#91502D1A]'} ${data?.class_container || ''}`}>
                
                {/* Contenido de texto */}
                <div className={`flex flex-col gap-5 py-8 px-6 sm:px-8 lg:pl-12 xl:pl-16 2xl:pl-20 justify-center items-start w-full xl:w-7/12 2xl:w-8/12 text-left z-20 relative ${data?.class_content || ''}`}>
                    <h1 className={`font-bold font-title text-3xl sm:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl leading-tight ${data?.title_color || 'customtext-secondary'} ${data?.title_opacity || 'text-opacity-90'} ${data?.class_title || ''}`}>
                      {data?.name}
                    </h1>

                    <p className={`font-normal text-sm sm:text-base lg:text-lg xl:text-lg 2xl:text-xl leading-relaxed max-w-lg xl:max-w-xl 2xl:max-w-2xl ${data?.description_color || 'customtext-neutral-dark'} ${data?.description_opacity || 'opacity-70'} ${data?.class_description || ''}`}>
                        {data?.description}
                    </p>
                    
                    {data?.button_link && data?.button_text && (
                        <div className="flex flex-col mt-2">
                            <a 
                                href={data?.button_link} 
                                className={`inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 2xl:py-4 2xl:px-8 rounded-lg text-white font-semibold leading-none text-sm sm:text-base 2xl:text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${data?.button_background || 'bg-secondary hover:bg-primary'} ${data?.class_button || ''}`}
                            >
                                {data?.button_text}
                            </a>
                        </div>
                    )}
                </div>

                {/* Contenedor de imagen mejorado */}
                <div className={`flex flex-col w-full xl:w-5/12 2xl:w-4/12 items-end justify-end relative ${data?.image_position === 'overflow' ? imageOverflowStyle : 'xl:relative'} ${data?.class_image_container || ''}`}>
                    <div className="w-full h-full relative">
                        <img
                            src={`/storage/images/system/${data?.image}`}
                            onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                            alt={data?.name || 'Banner image'}
                            className={`w-full h-full object-contain object-bottom min-h-[250px] sm:min-h-[300px] xl:min-h-[400px] 2xl:min-h-[450px] ${data?.image_position === 'overflow' ? 'xl:object-right-bottom xl:scale-110 xl:translate-y-4' : ''} ${data?.class_image || ''}`}
                        />
                        
                        {/* Overlay decorativo opcional */}
                        {data?.show_image_overlay && (
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent ${data?.class_overlay || ''}`}></div>
                        )}
                    </div>
                </div>

                {/* Elementos decorativos opcionales */}
                {data?.show_decorations && (
                    <>
                        {/* Círculo decorativo */}
                        <div className={`absolute top-8 right-8 w-16 h-16 rounded-full opacity-20 ${data?.decoration_color || 'bg-primary'} hidden xl:block`}></div>
                        
                        {/* Líneas decorativas */}
                        <div className={`absolute bottom-8 left-8 w-12 h-1 opacity-30 ${data?.decoration_color || 'bg-primary'} hidden xl:block`}></div>
                        <div className={`absolute bottom-6 left-8 w-8 h-1 opacity-30 ${data?.decoration_color || 'bg-primary'} hidden xl:block`}></div>
                    </>
                )}
            </div>
        </section>
    );
};

export default BannerMultivet;
