import React from "react";

const BannerPidelo = ({ data }) => {
    // Procesar el nombre para resaltar palabras entre *asteriscos*
    const renderName = (name) => {
        if (!name) return null;
        return name.split(/(\*[\w\sáéíóúÁÉÍÓÚüÜñÑ]+\*)/g).map((part, idx) => {
            if (/^\*[\w\sáéíóúÁÉÍÓÚüÜñÑ]+\*$/.test(part)) {
                return (
                    <span key={idx} className="customtext-primary">
                        {part.replace(/\*/g, "")}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <section>
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 w-full mx-auto py-[5%] md:py-[1.5%]">
                <div
                    className="w-full aspect-square lg:aspect-[5/2] rounded-2xl flex flex-col items-center justify-center shadow-lg text-center relative overflow-hidden"
                    style={{
                        backgroundImage: `url('/storage/images/system/${data?.background}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {/* Overlay oscuro */}
                    {data?.overlay && (

                        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-2xl z-0"></div>

                    )}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full gap-6">
                        <h1 className="text-3xl font-title  md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-widest text-white drop-shadow-lg mb-2">
                            {renderName(data?.name)}
                        </h1>
                        <p className="text-white italic text-base md:text-lg lg:text-xl 2xl:text-2xl font-paragraph max-w-2xl mx-auto drop-shadow-lg">
                            {data?.description}
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-8 w-full py-5 max-w-lg 2xl:max-w-xl mx-auto">
                            {data?.button_link && data?.button_text && (
                                <a
                                    className={` text-base 2xl:text-xl tracking-normal cursor-pointer w-max px-5 sm:px-10 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 flex items-center justify-center shadow-lg ${data?.class_button || "bg-primary text-white"}`}
                                    href={data?.button_link}
                                >
                                    {data?.button_text}
                                </a>
                            )}
                          {data?.btn_secondary &&(
                              <a
                                href="/catalogo"
                                className="border-white hover:border-black hover:bg-primary text-white text-base 2xl:text-xl tracking-normal border cursor-pointer w-full sm:w-max px-5 sm:px-10 py-2.5 rounded-full hover:opacity-90 transition-all duration-300 flex items-center justify-center shadow-lg"
                            >
                                Ver Productos
                            </a>
                          )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerPidelo;
