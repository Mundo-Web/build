import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import ItemsRest from '../Actions/Admin/ItemsRest';
import AmenitiesRest from '../Actions/Admin/AmenitiesRest';
import Table from '../Components/Adminto/Table';
import Modal from '../Components/Adminto/Modal';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import TextareaFormGroup from '../Components/Adminto/form/TextareaFormGroup';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import SwitchFormGroup from '../Components/Adminto/form/SwitchFormGroup';
import QuillFormGroup from '../Components/Adminto/form/QuillFormGroup';
import DynamicField from '../Components/Adminto/form/DynamicField';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Fillable from '../Utils/Fillable';
import Swal from 'sweetalert2';

const Rooms = () => {
  const gridRef = useRef();
  const modalRef = useRef();

  // Form elements ref
  const idRef = useRef();
  const nameRef = useRef();
  const skuRef = useRef();
  const roomTypeRef = useRef();
  const summaryRef = useRef();
  const descriptionRef = useRef();
  const maxOccupancyRef = useRef();
  const bedsCountRef = useRef();
  const sizeM2Ref = useRef();
  const priceRef = useRef();
  const discountRef = useRef();
  const imageRef = useRef();
  const amenitiesRef = useRef();

  // Multimedia refs
  const galleryRef = useRef();
  const pdfRef = useRef();
  const videoUrlRef = useRef();

  // Features refs
  const featuresRef = useRef([]);

  const [isEditing, setIsEditing] = useState(false);
  const [amenities, setAmenities] = useState([]);

  // Features state (como en Items.jsx)
  const [features, setFeatures] = useState([]);

  // Multimedia states
  const [gallery, setGallery] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [videos, setVideos] = useState([]);

  // Drag states
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedPdfIndex, setDraggedPdfIndex] = useState(null);
  const [draggedVideoIndex, setDraggedVideoIndex] = useState(null);

  const itemsRest = new ItemsRest();
  const amenitiesRest = new AmenitiesRest();

  useEffect(() => {
    getAmenities();
  }, []);

  const getAmenities = async () => {
    const response = await amenitiesRest.paginate({
      page: 1,
      per_page: 100,
      filters: JSON.stringify([['status', '=', 1]]),
    });
    setAmenities(response.data || []);
  };

  // ===================== GALLERY HANDLERS =====================
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      toDelete: false
    }));
    setGallery([...gallery, ...newImages]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const newImages = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      toDelete: false
    }));
    setGallery([...gallery, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeGalleryImage = (e, index) => {
    e.preventDefault();
    const updatedGallery = [...gallery];
    if (updatedGallery[index].file) {
      updatedGallery.splice(index, 1);
    } else {
      updatedGallery[index].toDelete = true;
    }
    setGallery(updatedGallery);
  };

  // Drag and drop reordering for gallery
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOverReorder = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropReorder = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const items = [...gallery];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setGallery(items);
    setDraggedIndex(null);
  };

  // ===================== PDF HANDLERS =====================
  const handlePdfChange = (e) => {
    const files = Array.from(e.target.files);
    const newPdfs = files.map(file => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      toDelete: false
    }));
    setPdfs([...pdfs, ...newPdfs]);
    e.target.value = '';
  };

  const removePdf = (e, index) => {
    e.preventDefault();
    const updatedPdfs = [...pdfs];
    if (updatedPdfs[index].file) {
      updatedPdfs.splice(index, 1);
    } else {
      updatedPdfs[index].toDelete = true;
    }
    setPdfs(updatedPdfs);
  };

  const handlePdfDragStart = (e, index) => {
    setDraggedPdfIndex(index);
  };

  const handlePdfDragEnd = () => {
    setDraggedPdfIndex(null);
  };

  const handlePdfDragOver = (e) => {
    e.preventDefault();
  };

  const handlePdfDropReorder = (e, dropIndex) => {
    e.preventDefault();
    if (draggedPdfIndex === null || draggedPdfIndex === dropIndex) return;

    const items = [...pdfs];
    const draggedItem = items[draggedPdfIndex];
    items.splice(draggedPdfIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setPdfs(items);
    setDraggedPdfIndex(null);
  };

  // ===================== VIDEO HANDLERS =====================
  const addVideo = (e) => {
    e.preventDefault();
    const url = videoUrlRef.current.value.trim();
    if (!url) return;

    setVideos([...videos, { url, toDelete: false }]);
    videoUrlRef.current.value = '';
  };

  const removeVideo = (e, index) => {
    e.preventDefault();
    const updatedVideos = [...videos];
    if (updatedVideos[index].url && !updatedVideos[index].id) {
      updatedVideos.splice(index, 1);
    } else {
      updatedVideos[index].toDelete = true;
    }
    setVideos(updatedVideos);
  };

  const handleVideoDragStart = (e, index) => {
    setDraggedVideoIndex(index);
  };

  const handleVideoDragEnd = () => {
    setDraggedVideoIndex(null);
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
  };

  const handleVideoDropReorder = (e, dropIndex) => {
    e.preventDefault();
    if (draggedVideoIndex === null || draggedVideoIndex === dropIndex) return;

    const items = [...videos];
    const draggedItem = items[draggedVideoIndex];
    items.splice(draggedVideoIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    setVideos(items);
    setDraggedVideoIndex(null);
  };

  // ===================== MODAL HANDLERS =====================
  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true);
    else setIsEditing(false);

    // Reset delete flag when opening modal
    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? '';
    nameRef.current.value = data?.name ?? '';
    skuRef.current.value = data?.sku ?? '';
    summaryRef.current.value = data?.summary ?? '';
    descriptionRef.current.value = data?.description ?? '';
    maxOccupancyRef.current.value = data?.max_occupancy ?? 2;
    bedsCountRef.current.value = data?.beds_count ?? 1;
    sizeM2Ref.current.value = data?.size_m2 ?? 0;
    priceRef.current.value = data?.price ?? 0;
    discountRef.current.value = data?.discount ?? 0;

    if (imageRef.current && imageRef.image) {
      imageRef.image.src = data?.image ? `/storage/images/item/${data.image}` : '';
      imageRef.current.value = null;
    }

    // Set room type
    setTimeout(() => {
      $(roomTypeRef.current).val(data?.room_type || 'standard').trigger('change');
    }, 100);

    // Set amenities - CORREGIDO
    const selectedAmenities = data?.amenities?.map(a => a.id.toString()) || [];
    setTimeout(() => {
      $(amenitiesRef.current).val(selectedAmenities).trigger('change');
    }, 100);

    // Load features (características)
    if (data?.features) {
      try {
        const featuresData = typeof data.features === 'string' ? JSON.parse(data.features) : data.features;
        // Convertir a formato simple si viene como objeto
        const formattedFeatures = Array.isArray(featuresData) 
          ? featuresData.map(f => typeof f === 'object' ? f.feature || f : f)
          : [];
        setFeatures(formattedFeatures);
      } catch (e) {
        setFeatures([]);
      }
    } else {
      setFeatures([]);
    }

    // Load gallery - CORREGIDO: usar 'images' como en Items.jsx
    if (data?.images && Array.isArray(data.images)) {
      const loadedImages = data.images.map(img => ({
        id: img.id,
        url: `/storage/images/item/${img.url}`,
        order: img.order,
        file: null,
        toDelete: false
      }));
      setGallery(loadedImages);
    } else {
      setGallery([]);
    }

    // Load PDFs - CORREGIDO: usar 'pdf' array de objetos como en Items.jsx
    if (data?.pdf && Array.isArray(data.pdf)) {
      setPdfs(data.pdf.map(pdf => ({
        id: pdf.id,
        name: pdf.name || pdf.path?.split('/').pop() || 'Documento.pdf',
        url: `/storage/pdfs/item/${pdf.path}`,
        path: pdf.path,
        order: pdf.order,
        toDelete: false
      })));
    } else {
      setPdfs([]);
    }

    // Load videos - CORREGIDO: usar 'linkvideo' array de objetos como en Items.jsx
    if (data?.linkvideo && Array.isArray(data.linkvideo)) {
      setVideos(data.linkvideo.map(video => ({
        id: video.id,
        url: video.url,
        order: video.order,
        toDelete: false
      })));
    } else {
      setVideos([]);
    }

    $(modalRef.current).modal('show');
  };

  const onModalSubmit = async (e) => {
    e.preventDefault();

    // Limpiar características vacías (como en Items.jsx)
    const cleanFeatures = features.filter(f => {
      if (typeof f === 'string') return f.trim() !== '';
      if (typeof f === 'object') return f.feature?.trim() !== '';
      return false;
    });

    const request = {
      id: idRef.current.value || undefined,
      type: 'room',
      name: nameRef.current.value,
      sku: skuRef.current.value,
      room_type: $(roomTypeRef.current).val(),
      summary: summaryRef.current.value,
      description: descriptionRef.current.value,
      max_occupancy: maxOccupancyRef.current.value,
      beds_count: bedsCountRef.current.value,
      size_m2: sizeM2Ref.current.value,
      price: priceRef.current.value,
      discount: discountRef.current.value,
      features: cleanFeatures,
    };

    const formData = new FormData();
    for (const key in request) {
      if (key === 'features') {
        formData.append(key, JSON.stringify(request[key]));
      } else {
        formData.append(key, request[key]);
      }
    }

    // Main image
    if (imageRef.current) {
      const file = imageRef.current.files[0];
      if (file) {
        formData.append('image', file);
      }
      if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
        formData.append('image_delete', 'DELETE');
      }
    }

    // Gallery - Separar imágenes nuevas y existentes con orden correcto
    gallery.forEach((img) => {
      if (!img.toDelete) {
        if (img.file) {
          formData.append('gallery[]', img.file);
        }
      }
    });

    const deletedImages = gallery
      .filter((img) => img.toDelete && img.id)
      .map((img) => img.id);
    if (deletedImages.length > 0) {
      deletedImages.forEach((id, index) => {
        formData.append(`deleted_images[${index}]`, id);
      });
    }

    // PDFs - CORREGIDO: igual que Items.jsx
    pdfs.forEach((pdf) => {
      if (!pdf.toDelete && pdf.file) {
        formData.append('pdf[]', pdf.file);
      }
    });

    const deletedPdfs = pdfs
      .filter((pdf) => pdf.toDelete && pdf.path)
      .map((pdf) => pdf.path);
    if (deletedPdfs.length > 0) {
      formData.append('deleted_pdfs', JSON.stringify(deletedPdfs));
    }

    // Videos - CORREGIDO: igual que Items.jsx
    const videoUrls = videos
      .filter(video => !video.toDelete)
      .map(v => v.url);
    if (videoUrls.length > 0) {
      formData.append('linkvideo', JSON.stringify(videoUrls));
    }

    const deletedVideos = videos
      .map((video, index) => video.toDelete && video.id ? index : null)
      .filter(index => index !== null);
    if (deletedVideos.length > 0) {
      formData.append('deleted_videos', JSON.stringify(deletedVideos));
    }

    // Amenities - CORREGIDO: enviar como array, no como JSON string
    const selectedAmenities = $(amenitiesRef.current).val() || [];
    if (selectedAmenities.length > 0) {
      selectedAmenities.forEach((amenityId, index) => {
        formData.append(`amenities[${index}]`, amenityId);
      });
    }

    const result = await itemsRest.save(formData);
    if (!result) return;

    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh();
    $(modalRef.current).modal('hide');
    
    // Limpiar estados
    setGallery([]);
    setPdfs([]);
    setVideos([]);
    setFeatures([]);
  };

  const onBooleanChange = async ({ id, value, field }) => {
    const result = await itemsRest.boolean({ id, field: field, value });
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  const onStatusChange = async ({ id, value }) => {
    const result = await itemsRest.boolean({ id, field: 'status', value });
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar habitación',
      text: '¿Estás seguro de eliminar esta habitación? Se eliminarán también las reservas asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;
    const result = await itemsRest.delete(id);
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  const roomTypes = {
    'standard': 'Estándar',
    'suite': 'Suite',
    'deluxe': 'Deluxe',
    'presidential': 'Presidencial',
    'family': 'Familiar',
    'executive': 'Ejecutiva',
    'single': 'Individual',
    'double': 'Doble',
    'triple': 'Triple'
  };

  return (
    <>
      <Table
        gridRef={gridRef}
        title="Habitaciones"
        rest={itemsRest}
        restParams={{ filters: JSON.stringify([['type', '=', 'room']]) }}
        toolBar={(container) => {
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'refresh',
              hint: 'Refrescar tabla',
              onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
            }
          });
          container.unshift({
            widget: 'dxButton',
            location: 'after',
            options: {
              icon: 'plus',
              text: 'Nueva habitación',
              hint: 'Nueva habitación',
              onClick: () => onModalOpen()
            }
          });
        }}
        columns={[
          {
            dataField: 'id',
            caption: 'ID',
            visible: false
          },
          {
            dataField: 'image',
            caption: 'Imagen',
            width: '80px',
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              if (data.image) {
                ReactAppend(container,
                  <img
                    src={`/storage/images/item/${data.image}`}
                    alt={data.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                  />
                );
              } else {
                ReactAppend(container,
                  <div className="bg-light d-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px', borderRadius: '8px' }}>
                    <i className="mdi mdi-bed-double text-muted" style={{ fontSize: '32px' }}></i>
                  </div>
                );
              }
            }
          },
          Fillable.has('items', 'sku') ? {
            dataField: 'name',
            caption: 'Habitación',
           
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <strong>{data.name}</strong>
                  <div className="small text-muted">
                    <span className="badge badge-soft-secondary">{data.sku}</span>
                    {data.room_type && Fillable.has('items', 'room_type') && (
                      <span className="badge badge-soft-info ml-1">
                        {roomTypes[data.room_type] || data.room_type}
                      </span>
                    )}
                  </div>
                </div>
              );
            }
          } : {
            dataField: 'name',
            caption: 'Habitación',
            width: '20%',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <strong>{data.name}</strong>
                  {data.room_type && Fillable.has('items', 'room_type') && (
                    <div className="small text-muted">
                      <span className="badge badge-soft-info">
                        {roomTypes[data.room_type] || data.room_type}
                      </span>
                    </div>
                  )}
                </div>
              );
            }
          },
           {
            dataField: 'summary',
            caption: 'Descripción',
            width: '20%',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <p>{data.summary}</p>
               
                </div>
              );
            }
          },
          {
            dataField: 'max_occupancy',
            caption: 'Capacidad',
            width: '15%',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  {Fillable.has('items', 'max_occupancy') && (
                    <div className="small">
                      <i className="mdi mdi-account-multiple text-primary mr-1"></i>
                      {data.max_occupancy || 0} personas
                    </div>
                  )}
                  {Fillable.has('items', 'beds_count') && (
                    <div className="small">
                      <i className="mdi mdi-bed text-success mr-1"></i>
                      {data.beds_count || 0} cama{data.beds_count !== 1 ? 's' : ''}
                    </div>
                  )}
                  {Fillable.has('items', 'size_m2') && data.size_m2 > 0 && (
                    <div className="small">
                      <i className="mdi mdi-ruler-square text-info mr-1"></i>
                      {data.size_m2} m²
                    </div>
                  )}
                </div>
              );
            },
            visible: Fillable.has('items', 'max_occupancy') || Fillable.has('items', 'beds_count') || Fillable.has('items', 'size_m2')
          },
          {
            dataField: 'price',
            caption: 'Precio/Noche',
            width: '12%',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <strong className="text-success">S/ {Number(data.price || 0).toFixed(2)}</strong>
                  {data.discount > 0 && (
                    <div className="small">
                      <span className="badge badge-soft-danger">-{data.discount}%</span>
                    </div>
                  )}
                </div>
              );
            }
          },
          Fillable.has('items', 'is_amenities') && {
            dataField: 'amenities',
            caption: 'Amenidades',
            width: '15%',
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              const amenitiesList = data.amenities || [];
              ReactAppend(container,
                <div>
                  {amenitiesList.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {amenitiesList.slice(0, 3).map((a, i) => (
                        <span key={i} className="badge badge-soft-success" style={{ fontSize: '10px' }}>
                          {a.name}
                        </span>
                      ))}
                      {amenitiesList.length > 3 && (
                        <span className="badge badge-soft-secondary" style={{ fontSize: '10px' }}>
                          +{amenitiesList.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted small">Sin amenidades</span>
                  )}
                </div>
              );
            }
          },
          Fillable.has('items', 'featured') && {
            dataField: 'featured',
            caption: 'Destacado',
            dataType: 'boolean',
            width: '80px',
            cellTemplate: (container, { data }) => {
              $(container).empty();
              ReactAppend(container,
                <SwitchFormGroup
                  checked={data.featured == 1}
                  onChange={() => onBooleanChange({ id: data.id, value: !data.featured, field: 'featured' })}
                />
              );
            }
          },
          Fillable.has('items', 'visible') && {
            dataField: 'visible',
            caption: 'Visible',
            dataType: 'boolean',
            width: '80px',
            cellTemplate: (container, { data }) => {
              $(container).empty();
              ReactAppend(container,
                <SwitchFormGroup
                  checked={data.visible == 1}
                  onChange={() => onBooleanChange({ id: data.id, value: !data.visible, field: 'visible' })}
                />
              );
            }
          },
          {
            caption: 'Acciones',
            width: '100px',
            cellTemplate: (container, { data }) => {
              container.css('text-overflow', 'unset');
              container.append(DxButton({
                className: 'btn btn-xs btn-soft-primary',
                title: 'Editar',
                icon: 'fa fa-pen',
                onClick: () => onModalOpen(data)
              }));
              container.append(DxButton({
                className: 'btn btn-xs btn-soft-danger',
                title: 'Eliminar',
                icon: 'fa fa-trash',
                onClick: () => onDeleteClicked(data.id)
              }));
            },
            allowFiltering: false,
            allowExporting: false
          }
        ]}
      />

      <Modal
        modalRef={modalRef}
        title={isEditing ? 'Editar habitación' : 'Nueva habitación'}
        onSubmit={onModalSubmit}
        size="xl"
      >
        <div id="rooms-container">
          <input ref={idRef} type="hidden" />

          {/* Sistema de Pestañas - IGUAL QUE Items.jsx */}
          <ul className="nav nav-pills nav-justified mb-4" role="tablist" style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '4px',
            border: '1px solid #e9ecef'
          }}>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="basic-info-tab"
                data-bs-toggle="pill"
                data-bs-target="#basic-info"
                type="button"
                role="tab"
                aria-controls="basic-info"
                aria-selected="true"
                style={{ borderRadius: '6px', fontWeight: '500', transition: 'all 0.3s ease' }}
              >
                <i className="fas fa-info-circle me-2"></i>
                Información Básica
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="details-tab"
                data-bs-toggle="pill"
                data-bs-target="#details"
                type="button"
                role="tab"
                aria-controls="details"
                aria-selected="false"
                style={{ borderRadius: '6px', fontWeight: '500', transition: 'all 0.3s ease' }}
              >
                <i className="fas fa-bed me-2"></i>
                Detalles y Precios
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="multimedia-tab"
                data-bs-toggle="pill"
                data-bs-target="#multimedia"
                type="button"
                role="tab"
                aria-controls="multimedia"
                aria-selected="false"
                style={{ borderRadius: '6px', fontWeight: '500', transition: 'all 0.3s ease' }}
              >
                <i className="fas fa-images me-2"></i>
                Multimedia
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="features-tab"
                data-bs-toggle="pill"
                data-bs-target="#features"
                type="button"
                role="tab"
                aria-controls="features"
                aria-selected="false"
                style={{ borderRadius: '6px', fontWeight: '500', transition: 'all 0.3s ease' }}
              >
                <i className="fas fa-list-ul me-2"></i>
                Características
              </button>
            </li>
          </ul>

          {/* Contenido de las Pestañas */}
          <div className="tab-content">
            {/* Pestaña: Información Básica */}
            <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-tag me-2"></i>Identificación</h6>
                    </div>
                    <div className="card-body">
                      <InputFormGroup
                        eRef={nameRef}
                        label="Nombre de la Habitación"
                        required
                        placeholder="Ej: Suite Amazonas"
                      />
                      <InputFormGroup
                        eRef={skuRef}
                        label="SKU"
                        placeholder="Ej: ROOM-001"
                        hidden={!Fillable.has('items', 'sku')}
                      />
                      <SelectFormGroup
                        eRef={roomTypeRef}
                        label="Tipo de Habitación"
                        dropdownParent="#rooms-container"
                        required
                        hidden={!Fillable.has('items', 'room_type')}
                      >
                        <option value="standard">Estándar</option>
                        <option value="single">Individual</option>
                        <option value="double">Doble</option>
                        <option value="triple">Triple</option>
                        <option value="suite">Suite</option>
                        <option value="deluxe">Deluxe</option>
                        <option value="presidential">Presidencial</option>
                        <option value="family">Familiar</option>

                        <option value="executive">Ejecutiva</option>
                      </SelectFormGroup>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-align-left me-2"></i>Descripción</h6>
                    </div>
                    <div className="card-body">
                      <TextareaFormGroup
                        eRef={summaryRef}
                        label="Resumen"
                        rows={4}
                        placeholder="Breve descripción de la habitación..."
                        hidden={!Fillable.has('items', 'summary')}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-edit me-2"></i>Descripción Completa</h6>
                    </div>
                    <div className="card-body">
                      <QuillFormGroup 
                        eRef={descriptionRef} 
                        label="Descripción Detallada"
                        hidden={!Fillable.has('items', 'description')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña: Detalles y Precios */}
            <div className="tab-pane fade" id="details" role="tabpanel" aria-labelledby="details-tab">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-users me-2"></i>Capacidad</h6>
                    </div>
                    <div className="card-body">
                      <InputFormGroup
                        eRef={maxOccupancyRef}
                        label="Capacidad Máxima (personas)"
                        type="number"
                        required
                        min="1"
                        max="10"
                        hidden={!Fillable.has('items', 'max_occupancy')}
                      />
                      <InputFormGroup
                        eRef={bedsCountRef}
                        label="Número de Camas"
                        type="number"
                        required
                        min="1"
                        max="5"
                        hidden={!Fillable.has('items', 'beds_count')}
                      />
                      <InputFormGroup
                        eRef={sizeM2Ref}
                        label="Tamaño (m²)"
                        type="number"
                        min="0"
                        step="0.1"
                        hidden={!Fillable.has('items', 'size_m2')}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-dollar-sign me-2"></i>Precios</h6>
                    </div>
                    <div className="card-body">
                      <InputFormGroup
                        eRef={priceRef}
                        label="Precio por Noche (S/)"
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        hidden={!Fillable.has('items', 'price')}
                      />
                      <InputFormGroup
                        eRef={discountRef}
                        label="Descuento (%)"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        hidden={!Fillable.has('items', 'discount')}
                      />
                    </div>
                  </div>
                </div>

                {Fillable.has('items', 'is_amenities') && (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="fas fa-star-circle me-2 text-warning"></i>
                          Cualidades / Amenidades
                        </h6>
                      </div>
                      <div className="card-body">
                        <SelectFormGroup
                          eRef={amenitiesRef}
                          label="Seleccionar Cualidades / Amenidades"
                          dropdownParent="#rooms-container"
                          multiple
                          templateResult={(state) => {
                            if (!state.id) return state.text;
                            const $option = $(state.element);
                            const image = $option.data('image');
                            
                            if (image) {
                              return $(`
                                <div style="display: flex; align-items: center; gap: 10px;">
                                  <div style="width: 32px; height: 32px; border-radius: 50%; background: #ebeff2; display: flex; align-items: center; justify-content: center; padding: 5px; flex-shrink: 0;">
                                    <img src="/storage/images/amenity/${image}" 
                                         style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" 
                                         onerror="this.style.display='none'" />
                                  </div>
                                  <span>${state.text}</span>
                                </div>
                              `);
                            }
                            return state.text;
                          }}
                          templateSelection={(state) => {
                            if (!state.id) return state.text;
                            const $option = $(state.element);
                            const image = $option.data('image');
                            
                            if (image) {
                              return $(`
                                <div style="display: flex; align-items: center; gap: 8px;">
                                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #ebeff2; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0;">
                                    <img src="/storage/images/amenity/${image}" 
                                         style="width: 100%; height: 100%; object-fit: contain; border-radius: 50%;" 
                                         onerror="this.style.display='none'" />
                                  </div>
                                  <span>${state.text}</span>
                                </div>
                              `);
                            }
                            return state.text;
                          }}
                        >
                          {amenities.map((amenity) => (
                            <option 
                              key={amenity.id} 
                              value={amenity.id}
                              data-image={amenity.image}
                            >
                              {amenity.name}
                            </option>
                          ))}
                        </SelectFormGroup>
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Selecciona las cualidades o amenidades que destacan esta habitación
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pestaña: Multimedia */}
            <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-image me-2"></i>Imagen Principal</h6>
                    </div>
                    <div className="card-body">
                      <ImageFormGroup
                        eRef={imageRef}
                        name="image"
                        label="Imagen Principal"
                        aspect={16 / 9}
                        hidden={!Fillable.has('items', 'image')}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fas fa-images me-2 text-primary"></i>
                        Galería de Imágenes
                        {gallery.filter(img => !img.toDelete).length > 0 && (
                          <span className="badge bg-primary ms-2">
                            {gallery.filter(img => !img.toDelete).length}
                          </span>
                        )}
                      </h6>
                    </div>
                    <div className="card-body">
                      <input
                        ref={galleryRef}
                        type="file"
                        multiple
                        accept="image/*"
                        hidden
                        onChange={handleGalleryChange}
                      />

                      <div className="gallery-container" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        border: '2px dashed #dee2e6',
                        minHeight: '140px'
                      }}>
                        {gallery.filter(image => !image.toDelete).map((image, index) => {
                          const originalIndex = gallery.findIndex(img => img === image);
                          return (
                            <div
                              key={originalIndex}
                              className="gallery-item position-relative"
                              draggable
                              onDragStart={(e) => handleDragStart(e, originalIndex)}
                              onDragEnd={handleDragEnd}
                              onDragOver={handleDragOverReorder}
                              onDrop={(e) => handleDropReorder(e, originalIndex)}
                              style={{
                                aspectRatio: '1',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'grab',
                                transform: draggedIndex === originalIndex ? 'scale(1.05)' : 'scale(1)',
                                opacity: draggedIndex === originalIndex ? 0.8 : 1,
                                background: 'white'
                              }}
                            >
                              <div className="position-absolute top-0 start-0 m-1">
                                <span className="badge bg-primary rounded-circle" style={{
                                  width: '20px',
                                  height: '20px',
                                  fontSize: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {index + 1}
                                </span>
                              </div>

                              <img
                                src={image.url}
                                alt={`Imagen ${index + 1}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'cover', pointerEvents: 'none' }}
                              />

                              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
                                background: 'rgba(0,0,0,0.7)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                              }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm rounded-circle"
                                  style={{ width: '28px', height: '28px', padding: 0 }}
                                  onClick={(e) => removeGalleryImage(e, originalIndex)}
                                  title="Eliminar"
                                >
                                  <i className="fas fa-trash text-white" style={{ fontSize: '12px' }}></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        <div
                          className="gallery-add-button d-flex flex-column align-items-center justify-content-center"
                          style={{
                            aspectRatio: '1',
                            border: '2px dashed #0d6efd',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(13, 110, 253, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minHeight: '100px'
                          }}
                          onClick={() => galleryRef.current.click()}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          <div className="text-center">
                            <i className="fas fa-plus text-primary fa-lg mb-1"></i>
                            <p className="mb-0 text-primary fw-semibold" style={{ fontSize: '10px' }}>
                              Agregar
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6" hidden={!Fillable.has('items', 'pdf')}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fas fa-file-pdf me-2 text-danger"></i>
                        Documentos PDF
                        {pdfs.filter(pdf => !pdf.toDelete).length > 0 && (
                          <span className="badge bg-danger ms-2">
                            {pdfs.filter(pdf => !pdf.toDelete).length}
                          </span>
                        )}
                      </h6>
                    </div>
                    <div className="card-body">
                      <input
                        ref={pdfRef}
                        type="file"
                        multiple
                        accept=".pdf"
                        hidden
                        onChange={handlePdfChange}
                      />

                      <div className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {pdfs.filter(pdf => !pdf.toDelete).map((pdf, index) => {
                          const originalIndex = pdfs.findIndex(p => p === pdf);
                          return (
                            <div
                              key={originalIndex}
                              draggable
                              onDragStart={(e) => handlePdfDragStart(e, originalIndex)}
                              onDragEnd={handlePdfDragEnd}
                              onDragOver={handlePdfDragOver}
                              onDrop={(e) => handlePdfDropReorder(e, originalIndex)}
                              className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2"
                              style={{
                                cursor: 'grab',
                                opacity: draggedPdfIndex === originalIndex ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
                                <span className="badge bg-danger me-2">{index + 1}</span>
                                <i className="fas fa-grip-vertical text-muted me-2"></i>
                                <i className="fas fa-file-pdf text-danger me-2"></i>
                                <span className="text-truncate" style={{ maxWidth: '150px' }}>{pdf.name}</span>
                              </div>
                              <div className="d-flex gap-1">
                                {!pdf.file && (
                                  <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary py-0">
                                    <i className="fas fa-eye"></i>
                                  </a>
                                )}
                                <button type="button" className="btn btn-sm btn-outline-danger py-0" onClick={(e) => removePdf(e, originalIndex)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => pdfRef.current.click()}>
                        <i className="fas fa-plus me-2"></i>Agregar PDFs
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6" hidden={!Fillable.has('items', 'linkvideo')}>
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fas fa-video me-2 text-success"></i>
                        Videos (Tour Virtual)
                        {videos.filter(video => !video.toDelete).length > 0 && (
                          <span className="badge bg-success ms-2">
                            {videos.filter(video => !video.toDelete).length}
                          </span>
                        )}
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="list-group mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {videos.filter(video => !video.toDelete).map((video, index) => {
                          const originalIndex = videos.findIndex(v => v === video);
                          return (
                            <div
                              key={originalIndex}
                              draggable
                              onDragStart={(e) => handleVideoDragStart(e, originalIndex)}
                              onDragEnd={handleVideoDragEnd}
                              onDragOver={handleVideoDragOver}
                              onDrop={(e) => handleVideoDropReorder(e, originalIndex)}
                              className="list-group-item list-group-item-action d-flex align-items-center justify-content-between py-2"
                              style={{
                                cursor: 'grab',
                                opacity: draggedVideoIndex === originalIndex ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center" style={{ minWidth: 0, overflow: 'hidden' }}>
                                <span className="badge bg-success me-2">{index + 1}</span>
                                <i className="fas fa-grip-vertical text-muted me-2"></i>
                                <i className="fas fa-video text-success me-2"></i>
                                <span className="text-truncate small" style={{ maxWidth: '150px' }} title={video.url}>
                                  {video.url}
                                </span>
                              </div>
                              <div className="d-flex gap-1">
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary py-0">
                                  <i className="fas fa-external-link-alt"></i>
                                </a>
                                <button type="button" className="btn btn-sm btn-outline-danger py-0" onClick={(e) => removeVideo(e, originalIndex)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="input-group input-group-sm">
                        <input
                          ref={videoUrlRef}
                          type="url"
                          className="form-control"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                        <button type="button" className="btn btn-success" onClick={addVideo}>
                          <i className="fas fa-plus me-1"></i>Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña: Características */}
            <div className="tab-pane fade" id="features" role="tabpanel" aria-labelledby="features-tab">
              <div className="row g-3">
                {Fillable.has('items', 'is_features') && (
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header">
                        <h6 className="mb-0"><i className="fas fa-list-ul me-2"></i>Lista de Características</h6>
                      </div>
                      <div className="card-body">
                        <DynamicField
                          ref={featuresRef}
                          label="Características de la Habitación"
                          structure=""
                          value={features}
                          onChange={setFeatures}
                        />
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Agrega características como: "Vista al río", "Balcón privado", "Servicio 24 horas", etc.
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Habitaciones'>
    <Rooms {...properties} />
  </BaseAdminto>);
});
