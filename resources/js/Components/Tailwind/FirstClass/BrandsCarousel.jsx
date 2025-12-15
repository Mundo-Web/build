import React, { useState, useEffect } from 'react';

const BrandsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const brands = [
    {
      name: "Amazon",
      domain: "amazon.com",
      category: "Marketplace",
      color: "from-orange-400 to-yellow-500",
      textColor: "text-orange-600"
    },
    {
      name: "Apple",
      domain: "apple.com",
      category: "Technology",
      color: "from-gray-400 to-gray-600",
      textColor: "text-gray-700"
    },
    {
      name: "Nike",
      domain: "nike.com",
      category: "Sports",
      color: "from-orange-500 to-red-500",
      textColor: "text-orange-600"
    },
    {
      name: "Adidas",
      domain: "adidas.com",
      category: "Sports",
      color: "from-black to-gray-700",
      textColor: "text-gray-900"
    },
    {
      name: "Walmart",
      domain: "walmart.com",
      category: "Retail",
      color: "from-blue-500 to-yellow-400",
      textColor: "text-blue-600"
    },
    {
      name: "Target",
      domain: "target.com",
      category: "Retail",
      color: "from-red-600 to-red-500",
      textColor: "text-red-600"
    },
    {
      name: "Best Buy",
      domain: "bestbuy.com",
      category: "Electronics",
      color: "from-blue-600 to-yellow-400",
      textColor: "text-blue-700"
    },
    {
      name: "Macy's",
      domain: "macys.com",
      category: "Department",
      color: "from-red-600 to-red-700",
      textColor: "text-red-700"
    },
    {
      name: "eBay",
      domain: "ebay.com",
      category: "Marketplace",
      color: "from-red-500 to-yellow-500",
      textColor: "text-red-600"
    },
    {
      name: "Gap",
      domain: "gap.com",
      category: "Fashion",
      color: "from-blue-700 to-blue-900",
      textColor: "text-blue-800"
    },
    {
      name: "Sephora",
      domain: "sephora.com",
      category: "Beauty",
      color: "from-black to-gray-800",
      textColor: "text-gray-900"
    },
    {
      name: "Coach",
      domain: "coach.com",
      category: "Luxury",
      color: "from-amber-700 to-amber-900",
      textColor: "text-amber-800"
    }
  ];

  // Duplicate brands for seamless infinite scroll
  const extendedBrands = [...brands, ...brands, ...brands];

  // Auto-scroll functionality
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % brands.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovered, brands.length]);

  // Calculate visible brands (show 6 on desktop, 3 on tablet, 2 on mobile)
  const getVisibleBrands = () => {
    const startIndex = currentIndex;
    const visibleCount = 6;
    const result = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % brands.length;
      result.push(brands[index]);
    }
    
    return result;
  };

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % brands.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + brands.length) % brands.length);
  };

  // Add animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="relative">
      {/* Main Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Gradient Overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Brands Grid */}
        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {getVisibleBrands().map((brand, index) => (
              <div
                key={`${brand.name}-${currentIndex}-${index}`}
                className="group relative"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInScale 0.6s ease-out forwards'
                }}
              >
                {/* Brand Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 hover:border-primary/20 group cursor-pointer relative overflow-hidden">
                  
                  {/* Animated Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                  
                  {/* Brand Logo Container */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 mb-3 flex items-center justify-center bg-white rounded-xl  transition-all duration-300 overflow-hidden   ">
                      <img 
                        src={`https://logo.clearbit.com/${brand.domain}`}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback: mostrar nombre de la marca en texto estilizado
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.fallback-text');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="fallback-text hidden w-full h-full items-center justify-center">
                        <span className={`text-xl font-bold ${brand.textColor}`}>
                          {brand.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Brand Name */}
                    <h3 className={`text-sm font-bold ${brand.textColor} group-hover:scale-105 transition-all duration-300 text-center leading-tight`}>
                      {brand.name}
                    </h3>
                    
                    {/* Category Badge */}
                    <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300 mt-1">
                      {brand.category}
                    </span>
                  </div>

                  {/* Hover Effect Dots */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Floating Animation Elements */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200 hover:border-primary/20"
          aria-label="Previous brands"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-sm p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200 hover:border-primary/20"
          aria-label="Next brands"
        >
          <svg className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Infinite Scroll Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {brands.slice(0, 6).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / 1) % 6 === index 
                ? 'bg-primary scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to brand group ${index + 1}`}
          />
        ))}
      </div>

      {/* Popular Brands Highlight */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl px-8 py-4 border border-primary/20">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Más populares:</span>
          </div>
          <div className="flex items-center space-x-4 text-sm font-semibold">
            <span className="text-primary">Amazon</span>
            <span className="text-gray-300">•</span>
            <span className="text-secondary">Apple</span>
            <span className="text-gray-300">•</span>
            <span className="text-primary">Nike</span>
            <span className="text-gray-300">•</span>
            <span className="text-secondary">Walmart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsCarousel;
