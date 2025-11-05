import React from 'react';

const StrengthFirstClass = ({ items = [], data = {} }) => {
  // Asegurar que data sea un objeto
  const safeData = data || {};

  // Si no hay items, no mostrar nada
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={`py-20 ${safeData.class_section || 'bg-gray-50'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${safeData.class_container || ''}`}>
        <div className={`text-center mb-16 ${safeData.class_header || ''}`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${safeData.class_title || 'customtext-primary-dark'}`}>
            {safeData.title || '¿Por qué elegir FirstClass?'}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${safeData.class_subtitle || 'customtext-primary-light'}`}>
            {safeData.subtitle || 'Más de 50,000 clientes confían en nosotros para sus envíos internacionales'}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ${safeData.class_grid || ''}`}>
          {items.map((strength, index) => {
            return (
              <div
                key={index}
                className={`p-6 group rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${safeData.class_card || 'bg-white'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${safeData.class_icon_container || 'bg-gray-50 group-hover:bg-gray-100'}`}>
                  <img 
                    src={`/storage/images/strength/${strength.image}`}
                    alt={strength.name}
                    className={`h-7 w-7 object-contain ${safeData.class_icon || 'customtext-primary-dark'}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className={`text-xl font-semibold mb-3 ${safeData.class_benefit_title || 'customtext-primary-dark'}`}>
                  {strength.name}
                </h3>
                <p className={`${safeData.class_benefit_description || 'customtext-primary-light'}`}>
                  {strength.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StrengthFirstClass;
