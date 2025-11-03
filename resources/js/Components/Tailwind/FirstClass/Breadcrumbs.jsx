import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items, className = '' }) => {
  // Generate automatic breadcrumbs if no items provided
  const generateBreadcrumbs = () => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Inicio', path: '/', icon: Home }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Custom labels for known routes
      const routeLabels = {
        'casillero-virtual': 'Casillero Virtual',
        'tiendas-disponibles': 'Tiendas Disponibles',
        'blog': 'Blog',
        'categoria': 'Categoría',
        'guias-importacion': 'Guías de Importación',
        'noticias-comercio': 'Noticias de Comercio',
        'consejos-compras': 'Consejos de Compras',
        'tecnologia-logistica': 'Tecnología y Logística',
        'casos-exito': 'Casos de Éxito',
        'tendencias-ecommerce': 'Tendencias E-commerce'
      };

      const label = routeLabels[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Don't add path for last segment (current page)
      breadcrumbs.push({
        label,
        path: index === pathSegments.length - 1 ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-white mx-2" />
              )}
              
              {item.path ? (
                <a
                  href={item.path}
                  className="flex items-center text-white  transition-colors duration-200 font-medium"
                >
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {item.label}
                </a>
              ) : (
                <span className="flex items-center text-gray-900 font-semibold">
                  {Icon && <Icon className="w-4 h-4 mr-1" />}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
