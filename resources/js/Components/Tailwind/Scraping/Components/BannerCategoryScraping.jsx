import React from 'react';

function BannerCategoryScraping() {
    return (
        <div className="w-full font-paragraph ">
            <a
                href="#moda"
                className="relative block overflow-hidden rounded-3xl group"
            >
                {/* Imagen de fondo */}
                <div className="h-[326px]  w-full">
                    <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3b62b2bff3452b3236d3e9af5d2dd741.png-mmnB5mvjslKHJ6OXHQaCGGZZSeZFSZ.jpeg"
                        alt="Moda Americana Street Style"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Degradado */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 t to-transparent transition-opacity group-hover:opacity-75" />

                {/* Contenido de texto */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10">
                    <div className="space-y-2 w-72">
                        <h2 className="text-2xl  w-56 font-bold  text-white">
                            Todo <span className='customtext-primary'>Modas Americana Street</span>
                        </h2>

                        <p className="text-white text-base">
                            Praesent non euismod arcu, eu dignissim erat. Aliquam erat volutpat...
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default BannerCategoryScraping;