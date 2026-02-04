import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import { Copy, ExternalLink, Check } from 'lucide-react';
import Swal from 'sweetalert2';

const Home = ({ user, storeUrl }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopied(true);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Enlace copiado',
        showConfirmButton: false,
        timer: 1500,
        toast: true
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card">
          <div className="card-body text-center p-5">
            <h2 className="mb-4">¡Bienvenido, {user.name}!</h2>
            <p className="lead text-muted mb-5">
              Aquí está tu enlace personalizado de tienda. Compártelo con tus clientes para comenzar a recibir pedidos.
            </p>

            <div className="form-group mb-4">
              <label className="fw-bold mb-2">Tu Enlace de Tienda</label>
              <div className="input-group input-group-lg">
                <input 
                  type="text" 
                  className="form-control text-center bg-light" 
                  value={storeUrl} 
                  readOnly 
                />
                <button 
                  className="btn btn-primary" 
                  type="button" 
                  onClick={copyToClipboard}
                  title="Copiar enlace"
                >
                  {copied ? <i className='fa fa-check'></i> : <i className='fa fa-copy'></i>} Copiar
                </button>
                <a 
                  href={storeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary"
                  title="Abrir enlace"
                >
                  <i className='fa fa-external-link-alt'></i>
                </a>
              </div>
            </div>

            <div className="mt-5">
              <div className="alert alert-info border-0 shadow-sm" role="alert">
                <i className="mdi mdi-information me-2"></i>
                Cualquier compra realizada a través de este enlace se registrará automáticamente en tu cuenta.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Dashboard de Proveedor">
      <Home {...properties} />
    </BaseAdminto>
  );
});
