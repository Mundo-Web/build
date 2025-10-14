import React from "react";
import General from "../../../Utils/General";

const IndicatorHuaillys = ({ items, data, generals }) => {
  const phoneWhatsapp = General.get("phone_whatsapp");

  return (
    <section 
      className={`bg-accent bg-cover bg-opacity-100 relative ${data?.class || ""}`}
      style={{ backgroundImage: `url(${data?.url_background || ""})` }}
    >
      {/* Overlay oscuro */}
      <div className="w-full h-full bg-accent absolute opacity-50"></div>
      
      {/* Imagen de gallina */}
      {data?.url_image && (
      <div className="absolute bottom-0 top-0 flex flex-col justify-end items-start">
        <img 
          className={`w-20 md:w-28 ${data?.class_chicken || ""}`}
          src={`${data?.url_image}`}
          alt="secondary image" 
        />
      </div>)}
      
      <div className="px-[8%] py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 py-5">
          {/* Primeros 3 items del array */}
          {items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex flex-col items-start justify-center w-full z-10">
              <div className="flex flex-row gap-2 items-center justify-start">
                <img 
                  className={`max-w-12 ${data?.class_icon || ""}`}
                  src={`/storage/images/indicator/${item.symbol}`}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/img/noimage/no_imagen_circular.png';
                  }}
                />
                <p className={`customtext-primary text-4xl font-title w-full ${data?.class_title || ""}`}>
                  {item.name}
                </p>
              </div>
              <div className="pt-1">
                <p className={`text-white text-md font-paragraph w-full leading-tight ${data?.class_description || ""}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Cuarto elemento con WhatsApp */}
          <div className="flex flex-col items-start justify-center w-full gap-1 z-10 text-right md:text-left">
            <p className={`text-white text-md font-paragraph w-full leading-tight ${data?.class_whatsapp_text || ""}`}>
              Escríbenos a nuestro Whatsapp
            </p>

            <p className={`customtext-primary text-6xl font-title w-full ${data?.class_whatsapp_number || ""}`}>
              {phoneWhatsapp || "+51 945873435"}
            </p>

            <p className={`text-white text-md font-paragraph w-full leading-tight ${data?.class_whatsapp_subtitle || ""}`}>
              y escoge tu plato favorito
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndicatorHuaillys;
