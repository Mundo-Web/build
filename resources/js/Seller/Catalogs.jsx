import BaseAdminto from '@Adminto/Base';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CreateReactScript from '../Utils/CreateReactScript';
import CatalogsRest from '../Actions/Seller/CatalogsRest';

const catalogsRest = new CatalogsRest();

const CatalogCard = ({ catalog }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className="card h-100 border-0 shadow-sm transition-all overflow-hidden" 
      style={{ 
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.04)",
        backgroundColor: "#ffffff",
        transition: "transform 0.3s ease, box-shadow 0.3s ease"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
      }}
    >
      {/* Cabecera (Lo que dice PDF / Línea Roja) */}
      <div className="bg-danger text-white text-center py-1 fw-bold" style={{ fontSize: "10px", letterSpacing: "0.1em", fontFamily: "'Outfit', sans-serif" }}>
        PDF
      </div>

      {/* Portada del Catálogo */}
      <div 
        className="w-100 bg-light overflow-hidden"
        style={{ aspectRatio: "3/4" }}
      >
        {catalog.image && !imageError ? (
          <img 
            src={`/storage/images/catalog/${catalog.image}`} 
            alt={catalog.name} 
            className="w-100 h-100 d-block"
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          /* Fallback de ícono de PDF si no hay portada o si hay error al cargar */
          <div 
            className="w-100 h-100 d-flex align-items-center justify-content-center text-danger"
            style={{ 
              backgroundColor: '#fff1f2',
              fontSize: '3rem'
            }}
          >
            <i className="mdi mdi-file-pdf-box"></i>
          </div>
        )}
      </div>

      {/* Cuerpo de la tarjeta */}
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5 
            className="card-title text-dark fw-bold mb-2 text-truncate-2"
            style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontSize: "15px",
              lineHeight: "1.3"
            }}
            title={catalog.name}
          >
            {catalog.name}
          </h5>
          {catalog.description && (
            <p 
              className="card-text text-muted mb-3"
              style={{ 
                fontSize: "12px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "54px"
              }}
            >
              {catalog.description}
            </p>
          )}
        </div>

        <a 
          href={`/storage/images/catalog/${catalog.file}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 shadow-xs transition-all"
          style={{ 
            fontSize: "13px", 
            fontWeight: "600",
            fontFamily: "'Outfit', sans-serif"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.filter = "brightness(0.95)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.filter = "none";
          }}
        >
          <i className="mdi mdi-download fs-5"></i>
          Descargar Catálogo
        </a>
      </div>
    </div>
  );
};

const Catalogs = () => {
  const [catalogs, setCatalogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const response = await catalogsRest.paginate({ isLoadingAll: true });
      if (response && response.data) {
        setCatalogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching catalogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const filteredCatalogs = catalogs.filter(catalog => {
    const query = searchQuery.toLowerCase();
    return (
      catalog.name.toLowerCase().includes(query) ||
      (catalog.description && catalog.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="container-fluid px-3 py-4">
      {/* Cabecera Premium */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6 mb-3 mb-md-0">
          <h3 className="fw-bold text-dark mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Estantería Digital
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
            Explora y descarga los catálogos oficiales de productos en formato digital PDF.
          </p>
        </div>
        <div className="col-md-6">
          <div className="input-group shadow-sm rounded-pill bg-white border px-2 py-1">
            <span className="input-group-text border-0 bg-transparent text-muted">
              <i className="mdi mdi-magnify fs-4"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-transparent shadow-none"
              placeholder="Buscar catálogos por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: "14px" }}
            />
            {searchQuery && (
              <button
                className="btn border-0 bg-transparent text-muted"
                onClick={() => setSearchQuery('')}
                type="button"
              >
                <i className="mdi mdi-close-circle fs-5"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="row justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-muted mt-2">Cargando catálogos...</p>
          </div>
        </div>
      ) : filteredCatalogs.length > 0 ? (
        <div className="row g-4">
          {filteredCatalogs.map((catalog) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={catalog.id}>
              <CatalogCard catalog={catalog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="row justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="col-md-6 text-center">
            <div className="p-4 rounded-3 bg-light border border-dashed">
              <i className="mdi mdi-book-open-page-variant-outline mdi-48px text-muted mb-3"></i>
              <h4 className="fw-bold text-dark mb-2">No se encontraron catálogos</h4>
              <p className="text-muted mb-0">
                {searchQuery 
                  ? 'No hay catálogos que coincidan con los criterios de búsqueda. Intenta con otra palabra clave.'
                  : 'Aún no se han publicado catálogos digitales para descargar.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Catálogos PDF">
      <Catalogs {...properties} />
    </BaseAdminto>
  );
});
