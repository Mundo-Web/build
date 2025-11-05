import React from 'react';
import { Smartphone, Download } from 'lucide-react';
import { resolveSystemAsset } from './bannerUtils';

const BannerMobileApp = ({ data = {}, generals = {}, items = [] }) => {
  // Si no hay apps, no mostrar el banner
  if (!items || items.length === 0) {
    return null;
  }

  // Asegurar que data sea un objeto
  const safeData = data || {};

  // Obtener apps disponibles (cualquier tienda)
  const getApps = () => {
    // Tomar las primeras 2 apps disponibles, sin importar la tienda
    const availableApps = items.filter(app => app.link).slice(0, 2);
    
    return {
      apps: availableApps
    };
  };

  // Calcular total de descargas desde items (apps)
  const calculateTotalDownloads = () => {

    let total = 0;
    items.forEach(app => {
      const downloads = parseInt(app.downloads) || 0;
      const unit = (app.downloads_unit || '').toUpperCase();
      
      let multiplier = 1;
      if (unit === 'M') multiplier = 1000000;
      else if (unit === 'K') multiplier = 1000;
      
      total += downloads * multiplier;
    });

    // Formatear el total
    if (total >= 1000000) {
      return '+' + (total / 1000000).toFixed(1) + 'M';
    } else if (total >= 1000) {
      return '+' + Math.floor(total / 1000) + 'K';
    }
    return '+' + total;
  };

  // Calcular rating promedio desde items (apps)
  const calculateAverageRating = () => {
    const sum = items.reduce((acc, app) => acc + (parseFloat(app.rating) || 0), 0);
    return (sum / items.length).toFixed(1);
  };

  const totalDownloads = calculateTotalDownloads();
  const averageRating = calculateAverageRating();
  const { apps } = getApps();
  
  // Resolver la imagen del fondo (screenshot de la primera app)
  const backgroundImage = items.length > 0 && items[0].image 
    ? `/storage/images/app/${items[0].image}`
    : resolveSystemAsset(safeData.image);

  return (
    <section className={`py-20 ${safeData.class_section || 'bg-primary'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${safeData.class_container || ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={safeData.class_content || ''}>
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${safeData.class_title || 'text-white'}`}>
              {safeData.name || 'Lleva FirstClass contigo'}
            </h2>
            <p className={`text-xl opacity-90 mb-8 ${safeData.class_description || 'text-white'}`}>
              {safeData.description || 'Descarga nuestra app móvil y gestiona tus envíos desde cualquier lugar. Rastrea paquetes, recibe notificaciones y más.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {apps.map((app, index) => (
                <a
                  key={index}
                  href={app.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-3"
                >
                  {app.logo && (
                    <img
                      src={`/storage/images/app/${app.logo}`}
                      alt={app.name}
                      className="h-8 w-8 object-contain"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                  <span>Descargar {app.name}</span>
                </a>
              ))}
            </div>

            <div className={`flex items-center space-x-8 ${safeData.class_stats || ''}`}>
              <div className="flex items-center">
                <Download className="h-6 w-6 text-white mr-2" />
                <span className="text-white">{totalDownloads} descargas</span>
              </div>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary-light text-lg">★</span>
                  ))}
                </div>
                <span className="text-white ml-2">{averageRating}/5</span>
              </div>
            </div>
          </div>

          {/* Imagen */}
          <div className={`flex justify-center ${safeData.class_phone_mockup || ''}`}>
            {backgroundImage ? (
              <img
                src={backgroundImage}
                alt="Mobile App"
                className="max-w-full h-auto rounded-lg shadow-2xl"
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-12">
                <Smartphone className="h-32 w-32 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerMobileApp;
