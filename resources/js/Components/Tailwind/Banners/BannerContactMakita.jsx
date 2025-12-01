import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const benefits = [
  "Lubricación automática de la cadena.",
  "La ventana de visualización del aceite de la cadena permite al operario comprobar fácilmente el nivel de aceite.",
  "Tecnología de protección extrema (XPT) diseñada para ofrecer una mayor resistencia al polvo y al agua en las duras condiciones del lugar de trabajo.",
  "Palanca de bloqueo accesible desde ambos lados.",
  "Freno eléctrico para máxima productividad y mayor seguridad del operador"
];


const BannerContactMakita = ({ data }) => {
  const imageUrl = resolveSystemAsset(data?.image);
  return (
    <section className="relative w-full bg-accent py-16 text-white overflow-hidden">
      <div className="mx-auto px-[5%] 2xl:max-w-7xl 2xl:px-0">
     
        <div className="relative border-2 border-secondary rounded-3xl p-8 md:p-10 backdrop-blur-sm bg-gradient-to-br from-accent/50 to-transparent shadow-2xl hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-500">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            {/* Product Image */}
            <div className="md:col-span-3 flex items-center justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <img
                  src={imageUrl}
                  onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                  alt={data?.name || 'Banner image'}
                  className={`relative w-full h-auto max-h-64 object-contain transform group-hover:scale-105 transition-transform duration-500 ${data?.image_position === 'overflow' ? 'xl:object-right-bottom xl:scale-110 xl:translate-y-4' : ''} ${data?.class_image || ''}`}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="md:col-span-6 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {data?.name}
              </h2>

              <p className="text-base md:text-lg text-gray-200 leading-relaxed max-w-2xl">
                {data?.description}
              </p>
            </div>

            {/* CTA Button */}
            <div className="md:col-span-3 flex items-center justify-center md:justify-end">
              <a
                href={data?.button_link || "#contacto"}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-secondary rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--color-secondary-rgb),0.5)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {data?.button_text || "Ponerme en contacto"}
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};



export default BannerContactMakita;
