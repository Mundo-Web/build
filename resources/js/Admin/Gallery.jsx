import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import GalleryRest from '../Actions/Admin/GalleryRest';
import GalleryConfigRest from '../Actions/Admin/GalleryConfigRest';

import slugify from '../Utils/slugify';
import { toast, Toaster } from 'sonner';

const galleryRest = new GalleryRest()
const galleryConfigRest = new GalleryConfigRest()

const Gallery = ({ images: imagesJSON = [], allImages: allImagesJSON = [], isDevelopment = false, canEdit = false, session = {}, hasRootRole: backendRootRole = false, imageVisibilityConfig = {} }) => {

  const [images, setImages] = useState(imagesJSON.map(x => {
    x.uuid = crypto.randomUUID()
    return x
  }));

  // Estados para gestión de visibilidad de imágenes
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [imageVisibility, setImageVisibility] = useState({});
  const [savingVisibility, setSavingVisibility] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [newImageForm, setNewImageForm] = useState({
    title: '', // Nombre que se mostrará en el card
    filename: '', // Nombre del archivo
    description: '',
    src: '',
    fit: 'cover', // Siempre será cover
    aspect: '1',
    file: null
  });

  const [isLoading, setIsLoading] = useState(false);


  const imageFormRef = useRef();

  // Función para verificar si el usuario tiene rol Root
  const hasRootRole = useCallback(() => {
    const roles = session?.roles || session?.user?.roles;
    const result = backendRootRole || (roles?.some(role => role.name === 'Root') ?? false);
    console.log('🔐 hasRootRole ejecutándose:', {
      backendRootRole,
      session,
      sessionRoles: session?.roles,
      userRoles: session?.user?.roles,
      roles,
      result
    });
    return result;
  }, [backendRootRole, session]);

  // Memoizar imágenes para usar las recibidas del backend (YA FILTRADAS)
  const visibleImages = useMemo(() => {
    console.log('📊 visibleImages - usando images directamente (backend ya filtró):', images);
    return images;
  }, [images]);

  // Verificar si estamos en entorno local/desarrollo
  // Combina verificación del cliente Y del servidor para mayor seguridad
  const isLocalEnvironment = (window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.hostname.includes('local') ||
                            window.location.port === '8000') && 
                            (isDevelopment || canEdit);

  useEffect(() => {
    $(".image-popup").magnificPopup({
      type: "image",
      closeOnContentClick: !0,
      mainClass: "mfp-fade",
      gallery: {
        enabled: !0,
        navigateByImgClick: !0,
        preload: [0, 1]
      }
    })
  }, [images])

  // Inicializar estado de visibilidad de imágenes (solo para Root - para el modal)
  useEffect(() => {
    console.log('🚨 Gallery Debug - Inicializando visibilidad:', {
      hasRootRole: hasRootRole(),
      allImagesJSON,
      session,
      backendRootRole
    });

    if (hasRootRole()) {
      const visibility = {};
      
      // Inicializar desde allImagesJSON (todas las imágenes, incluyendo no visibles)
      if (allImagesJSON && allImagesJSON.length > 0) {
        allImagesJSON.forEach(image => {
          if (image) {
            const imageKey = image.filename || image.src;
            // Si tiene is_visible definido, usarlo, sino true por defecto
            visibility[imageKey] = image.is_visible !== undefined ? image.is_visible : true;
            
            console.log(`🔍 Imagen "${image.name}" (${imageKey}):`, {
              is_visible: image.is_visible,
              visibility: visibility[imageKey]
            });
          }
        });
      }
      
      console.log('✅ Visibilidad inicial configurada:', visibility);
      setImageVisibility(visibility);
    } else {
      console.log('❌ Usuario no es Root, no se inicializa visibilidad');
    }
  }, [allImagesJSON, hasRootRole]);

  const onImageChange = async (e) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    e.target.value = null
    const name = e.target.name

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file)
      formData.append('name', name)

      const result = await galleryRest.save(formData)
      if (!result) return

      setImages(old => {
        return old.map(x => {
          if (x.src == name) x.uuid = crypto.randomUUID()
          return x
        })
      })
      
      toast.success('Imagen actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la imagen');
      console.error('Error updating image:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddNewImage = () => {
    setNewImageForm({
      title: '',
      filename: '',
      description: '',
      src: '',
      fit: 'cover',
      aspect: '1',
      file: null
    });
    setEditingImage(null);
    setShowAddModal(true);
  }

  const handleEditImage = (image, index) => {
    setNewImageForm({
      title: image.name || image.title, // Compatibilidad con nombres existentes
      filename: image.filename || image.src,
      description: image.description,
      src: image.src,
      fit: 'cover', // Siempre cover
      aspect: image.aspect,
      file: null // No hay archivo al editar, solo propiedades
    });
    setEditingImage(index);
    setShowAddModal(true);
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        e.target.value = null;
        return;
      }
      
      // Actualizar el estado con el archivo seleccionado
      setNewImageForm(prev => ({
        ...prev,
        file: file,
        src: file.name, // Mostrar el nombre del archivo original
        filename: prev.filename || file.name.split('.')[0] // Auto-generar filename si está vacío
      }));
    }
  }

  const handleSaveImageConfig = async () => {
    if (!newImageForm.title) {
      toast.error('Por favor completa el título de la imagen');
      return;
    }

    if (!newImageForm.filename) {
      toast.error('Por favor completa el nombre del archivo');
      return;
    }

    // Para nuevas imágenes, requiere archivo
    if (editingImage === null && !newImageForm.file) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    setIsLoading(true);
    try {
      let imageSrc = newImageForm.src;
      
      // Si hay un archivo nuevo, subirlo primero
      if (newImageForm.file) {
        const formData = new FormData();
        formData.append('image', newImageForm.file);
        
        // Forzar extensión PNG (el backend debe procesar esto)
        const fileName = `${newImageForm.filename.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
        
        formData.append('name', fileName);
        formData.append('convert_to_png', 'true'); // Indicar al backend que convierta a PNG
        
        const uploadResult = await galleryRest.save(formData);
        if (!uploadResult) {
          toast.error('Error al subir la imagen');
          return;
        }
        
        imageSrc = fileName;
      }

      // Check for image deletion flag
      if (imageFormRef.current?.getDeleteFlag && imageFormRef.current.getDeleteFlag()) {
        const formData = new FormData();
        formData.append('image_delete', 'DELETE');
        
        const deleteResult = await galleryRest.save(formData);
        if (!deleteResult) {
          toast.error('Error al eliminar la imagen');
          return;
        }
        
        imageSrc = null; // Clear the image source
      }

      const updatedImages = [...images];
      const imageData = {
        name: newImageForm.title, // Usar title como name para mostrar en el card
        title: newImageForm.title, // Mantener title también
        filename: newImageForm.filename,
        description: newImageForm.description,
        src: imageSrc,
        fit: 'cover', // Siempre cover
        aspect: newImageForm.aspect,
        uuid: crypto.randomUUID()
      };
      
      if (editingImage !== null) {
        // Editando imagen existente
        updatedImages[editingImage] = imageData;
      } else {
        // Agregando nueva imagen
        updatedImages.push(imageData);
      }

      // Guardar la configuración en el backend (solo imágenes dinámicas, no del sistema)
      const dynamicImages = updatedImages.filter(img => !img.is_system).map(img => {
        const { uuid, is_system, ...cleanImg } = img;
        return cleanImg;
      });

      const result = await galleryConfigRest.save(dynamicImages);
      
      if (result) {
        setImages(updatedImages);
        setShowAddModal(false);
        toast.success(editingImage !== null ? 'Imagen actualizada correctamente' : 'Nueva imagen agregada correctamente');
      }
    } catch (error) {
      toast.error('Error al guardar la configuración de la imagen');
      console.error('Error saving image config:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Funciones para gestión de visibilidad de imágenes
  const handleToggleImageVisibility = (imageKey) => {
    setImageVisibility(prev => ({
      ...prev,
      [imageKey]: !prev[imageKey]
    }));
  };

  const handleSaveVisibility = async () => {
    setSavingVisibility(true);
    try {
      // Verificar que hay cambios que guardar
      if (Object.keys(imageVisibility).length === 0) {
        toast.error('No hay imágenes para actualizar');
        return;
      }

      // Usar el servicio REST que maneja CSRF automáticamente
      const response = await galleryRest.updateVisibility(imageVisibility);

      if (response.success) {
        toast.success('Configuración de visibilidad guardada correctamente');
        setShowVisibilityModal(false);
        // Recargar la página para reflejar los cambios
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(response.message || 'Error al guardar la configuración de visibilidad');
      }
    } catch (error) {
      console.error('Error saving visibility:', error);
      toast.error('Error al guardar la configuración de visibilidad: ' + error.message);
    } finally {
      setSavingVisibility(false);
    }
  };

  const handleDeleteImage = async (index) => {
    const imageToDelete = images[index];
    
    // No permitir eliminar imágenes del sistema
    if (imageToDelete.is_system) {
      toast.error('No se pueden eliminar las imágenes del sistema');
      return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      setIsLoading(true);
      try {
        const updatedImages = images.filter((_, i) => i !== index);
        
        // Guardar la configuración actualizada en el backend (solo imágenes dinámicas)
        const dynamicImages = updatedImages.filter(img => !img.is_system).map(img => {
          const { uuid, is_system, ...cleanImg } = img;
          return cleanImg;
        });

        const result = await galleryConfigRest.save(dynamicImages);
        
        if (result) {
          setImages(updatedImages);
          toast.success('Imagen eliminada correctamente');
        }
      } catch (error) {
        toast.error('Error al eliminar la imagen');
        console.error('Error deleting image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (<div className='port'>
    {/* Header con botones de acción */}
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 className="mb-0">Galería de Imágenes</h4>
        <small className="text-muted">
          {hasRootRole() ? 'Administrador Root - Vista completa' : 'Vista de usuario'}
        </small>
      </div>
      
      <div className="d-flex gap-2">
        {/* Botón de gestión de visibilidad - Solo para root */}
        {(() => {
          const isRoot = hasRootRole();
          console.log('🎯 Renderizando botón de visibilidad:', { isRoot });
          return isRoot && (
            <button 
              type="button" 
              className="btn btn-info"
              onClick={() => setShowVisibilityModal(true)}
              disabled={isLoading}
            >
              <i className="mdi mdi-eye-settings me-1"></i>
              Gestionar Visibilidad
            </button>
          );
        })()}
        
        {/* Botón agregar - Solo en desarrollo */}
        {isLocalEnvironment && (
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleAddNewImage}
            disabled={isLoading}
          >
            <i className="mdi mdi-plus me-1"></i>
            Agregar Nueva Imagen
          </button>
        )}
      </div>
    </div>

    <div className="row portfolioContainer">
      {visibleImages.map((image, index) => {
        const slug = slugify(image.name)
        const isSystemImage = image.is_system === true;
        
        return <div key={index} className="col-xl-3 col-lg-4 col-md-6 natural personal">
          <div className="gal-detail thumb">
            {/* Badge para imágenes del sistema */}
            {isSystemImage && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                zIndex: 10,
                backgroundColor: 'rgba(13, 110, 253, 0.9)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                SISTEMA
              </div>
            )}
            
            <div style={{ position: 'relative' }}>
              <img src={`/assets/resources/${image.src}?v=${image.uuid}`} className="thumb-img img-fluid"
                alt="work-thumbnail" onError={e => e.target.src = '/assets/resources/cover-404.svg'} style={{
                  aspectRatio: image.aspect,
                  objectFit: 'cover', // Siempre cover
                  objectPosition: 'center',
                  width: '100%'
                }} />
              <div className='d-flex px-2 py-1 justify-content-center gap-1' style={{
                backgroundColor: 'rgba(0, 0, 0, .25)',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderRadius: '0 0 3px 3px'
              }}>
                <a href={`/assets/resources/${image.src}`} className="btn btn-xs btn-primary image-popup" title={image.name}>
                  <i className='mdi mdi-eye me-1'></i>
                  Abrir
                </a>
                <input type="file" name={image.src} id={`image-${slug}`} onChange={onImageChange} hidden accept='image/*' disabled={isLoading} />
                <label htmlFor={`image-${slug}`} className={`btn btn-xs btn-dark ${isLoading ? 'disabled' : ''}`}>
                  <i className='mdi mdi-image-edit me-1'></i>
                  Cambiar
                </label>
                {/* Botones de editar y eliminar solo en desarrollo y solo para imágenes no-sistema */}
                {isLocalEnvironment && !isSystemImage && (
                  <>
                    <button 
                      type="button"
                      className="btn btn-xs btn-info"
                      onClick={() => handleEditImage(image, index)}
                      disabled={isLoading}
                    >
                      <i className='mdi mdi-pencil me-1'></i>
                      Editar
                    </button>
                    <button 
                      type="button"
                      className="btn btn-xs btn-danger"
                      onClick={() => handleDeleteImage(index)}
                      disabled={isLoading}
                    >
                      <i className='mdi mdi-delete me-1'></i>
                      Eliminar
                    </button>
                  </>
                )}
                {/* Para imágenes del sistema, mostrar solo botón de información */}
                {isLocalEnvironment && isSystemImage && (
                  <button 
                    type="button"
                    className="btn btn-xs btn-secondary"
                    title="Imagen del sistema - Solo se puede cambiar el archivo"
                    disabled
                  >
                    <i className='mdi mdi-information me-1'></i>
                    Sistema
                  </button>
                )}
              </div>
            </div>

            <div className="text-center">
              <h4>
                {image.name}
                {isSystemImage && (
                  <span className="badge bg-primary ms-2" style={{fontSize: '10px'}}>
                    SISTEMA
                  </span>
                )}
              </h4>
              <p className="font-13 text-muted mb-2">{image.description}</p>
              {/* Información técnica solo en desarrollo */}
              {isLocalEnvironment && (
                <small className="text-muted">
                  Aspect: {image.aspect} | Archivo: {image.filename || image.src}
                  {isSystemImage && <span className="text-primary"> | Imagen del sistema</span>}
                </small>
              )}
            </div>
          </div>
        </div>
      })}
    </div>

    {/* Modal para agregar/editar imagen - Solo en desarrollo */}
    {isLocalEnvironment && showAddModal && (
      <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingImage !== null ? 'Editar Imagen' : 'Agregar Nueva Imagen'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowAddModal(false)}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Título de la imagen *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Ej: Logo de login, Imagen de signup, etc."
                        value={newImageForm.title}
                        onChange={(e) => setNewImageForm({...newImageForm, title: e.target.value})}
                        disabled={isLoading}
                      />
                      <small className="text-muted">Este es el nombre que se mostrará en el card</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre del archivo *</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Ej: logo-login, bg-signup, header-email"
                        value={newImageForm.filename}
                        onChange={(e) => setNewImageForm({...newImageForm, filename: e.target.value})}
                        disabled={isLoading}
                      />
                      <small className="text-muted">Solo letras, números y guiones (sin espacios ni caracteres especiales)</small>
                    </div>
                  </div>
                </div>

                {/* Campo de archivo de imagen */}
                <div className="mb-3">
                  <label className="form-label">
                    Seleccionar imagen {editingImage === null && <span className="text-danger">*</span>}
                  </label>
                  <input 
                    type="file" 
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <small className="text-muted">
                    {editingImage === null 
                      ? 'Selecciona un archivo de imagen (JPG, PNG, GIF, SVG, etc.)'
                      : 'Opcional: Selecciona una nueva imagen para reemplazar la actual'
                    }
                  </small>
                  {newImageForm.file && (
                    <div className="mt-2">
                      <small className="text-success">
                        <i className="mdi mdi-check-circle me-1"></i>
                        Archivo seleccionado: {newImageForm.file.name}
                      </small>
                    </div>
                  )}
                </div>

                <div className="row">
                
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea 
                        className="form-control" 
                        rows="4"
                        placeholder="Descripción de dónde y cómo se usa esta imagen"
                        value={newImageForm.description}
                        onChange={(e) => setNewImageForm({...newImageForm, description: e.target.value})}
                        disabled={isLoading}
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Aspect Ratio</label>
                      <select 
                        className="form-select"
                        value={newImageForm.aspect}
                        onChange={(e) => setNewImageForm({...newImageForm, aspect: e.target.value})}
                        disabled={isLoading}
                      >
                        <optgroup label="Cuadrados">
                          <option value="1">1:1 (Cuadrado)</option>
                        </optgroup>
                        <optgroup label="Horizontales (Landscape)">
                          <option value="4/3">4:3 (Estándar)</option>
                          <option value="16/9">16:9 (Panorámico)</option>
                          <option value="3/2">3:2 (Fotografía)</option>
                          <option value="21/9">21:9 (Ultrawide)</option>
                          <option value="5/3">5:3 (Ancho)</option>
                          <option value="2/1">2:1 (Banner)</option>
                        </optgroup>
                        <optgroup label="Verticales (Portrait)">
                          <option value="3/4">3:4 (Vertical estándar)</option>
                          <option value="9/16">9:16 (Vertical móvil)</option>
                          <option value="2/3">2:3 (Fotografía vertical)</option>
                          <option value="3/5">3:5 (Vertical estrecho)</option>
                          <option value="1/2">1:2 (Vertical banner)</option>
                        </optgroup>
                        <optgroup label="Otros">
                          <option value="auto">Auto (Original)</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>
                </div>


         
              </form>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddModal(false)}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSaveImageConfig}
                disabled={isLoading || !newImageForm.title || !newImageForm.filename || (editingImage === null && !newImageForm.file)}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-content-save me-1"></i>
                    {editingImage !== null ? 'Actualizar' : 'Agregar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Modal para gestionar visibilidad de imágenes - Solo para root */}
    {hasRootRole() && showVisibilityModal && (
      <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="mdi mdi-eye-settings me-2"></i>
                Gestionar Visibilidad de Imágenes
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowVisibilityModal(false)}
                disabled={savingVisibility}
              ></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                <i className="mdi mdi-information me-2"></i>
                Configura qué imágenes serán visibles para los usuarios que no tienen rol Root.
                Las imágenes desmarcadas solo serán visibles para administradores Root.
              </div>
              
              <div className="row">
                {(allImagesJSON || images).map((image, index) => {
                  const imageKey = image.filename || image.src;
                  const isSystemImage = image.is_system === true;
                  
                  return (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="form-check form-switch me-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`visibility-${imageKey}`}
                                checked={imageVisibility[imageKey] || false}
                                onChange={() => handleToggleImageVisibility(imageKey)}
                                disabled={savingVisibility}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <img 
                                  src={`/assets/resources/${image.src}?v=${image.uuid}`} 
                                  alt={image.name}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    marginRight: '10px'
                                  }}
                                  onError={e => e.target.src = '/assets/resources/cover-404.svg'}
                                />
                                <div>
                                  <div className="fw-bold">
                                    {image.name}
                                    {isSystemImage && (
                                      <span className="badge bg-primary ms-2" style={{fontSize: '9px'}}>
                                        SISTEMA
                                      </span>
                                    )}
                                  </div>
                                  <small className="text-muted">{image.filename || image.src}</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowVisibilityModal(false)}
                disabled={savingVisibility}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSaveVisibility}
                disabled={savingVisibility}
              >
                {savingVisibility ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-content-save me-1"></i>
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    <Toaster />
  </div>)
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Galeria'>
    <Gallery {...properties} />
  </BaseAdminto>);
})