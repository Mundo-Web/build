import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Heart, Shield, Award, Star, Check, Zap } from 'lucide-react';
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const CarruselBenefitsMultivet = ({ items = [], data }) => {
  const [scrollY, setScrollY] = useState(0);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    adjustTextColor(parallaxRef.current);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Iconos disponibles para los benefits
  const iconMap = {
    'heart': Heart,
    'shield': Shield,
    'award': Award,
    'star': Star,
    'check': Check,
    'zap': Zap,
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName?.toLowerCase()] || Heart;
    return IconComponent;
  };

  return (
    <section ref={parallaxRef} className={`relative py-12  overflow-hidden ${data?.background || 'bg-primary'}`}>
    



      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 font-montserrat animate-fade-in  ${data?.class_title || 'text-white'}`}>
            {data?.title || 'Compromiso con la'}
           
          </h2>
          <p className={` text-lg max-w-2xl mx-auto mb-8 customtext-neutral-light animate-slide-up ${data?.class_description || ''}`}>
            {data?.description || 'Más de una década brindando soluciones integrales para el cuidado animal'}
          </p>
          
          {/* Benefits List */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              {items.map((benefit, index) => {
                const IconComponent = getIcon(benefit.icon);
                return (
                  <div 
                    key={index}
                    className="flex flex-col items-center space-y-3 animate-slide-up bg-white/10 backdrop-blur-sm rounded-lg p-4"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className={`p-3 rounded-full ${data?.accent_bg || 'bg-primary'}`}>
                      {benefit.symbol ? (
                        <img
                          src={`/storage/images/indicator/${benefit.symbol}`}
                          alt={benefit.name}
                          className="w-8 h-8 filter brightness-0 invert"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <IconComponent 
                        className={`w-8 h-8 ${data?.accent_color || 'text-brand-gold'} ${benefit.symbol ? 'hidden' : ''}`}
                      />
                    </div>
                    <h3 className="font-bold text-lg customtext-primary">
                      {benefit.name}
                    </h3>
                    <p className="text-base customtext-neutral-light text-center">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

         
        </div>
      </div>


    </section>
  );
};

export default CarruselBenefitsMultivet;