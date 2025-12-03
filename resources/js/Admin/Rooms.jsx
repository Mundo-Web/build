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
  const totalRoomsRef = useRef();
  const priceRef = useRef();
  const discountRef = useRef();
  const imageRef = useRef();
  const amenitiesRef = useRef();

  // Multimedia refs
  const galleryRef = useRef();
  const pdfRef = useRef();
  const videoUrlRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [amenities, setAmenities] = useState([]);

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
    totalRoomsRef.current.value = data?.total_rooms ?? 1;
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

    // Set amenities
    const selectedAmenities = data?.amenities?.map(a => a.id.toString()) || [];
    setTimeout(() => {
      $(amenitiesRef.current).val(selectedAmenities).trigger('change');
    }, 100);

    // Load gallery
    if (data?.gallery) {
      try {
        const galleryData = typeof data.gallery === 'string' ? JSON.parse(data.gallery) : data.gallery;
        setGallery(galleryData.map(img => ({
          url: `/storage/images/item/${img}`,
          toDelete: false
        })));
      } catch (e) {
        setGallery([]);
      }
    } else {
      setGallery([]);
    }

    // Load PDFs
    if (data?.pdf) {
      try {
        const pdfData = typeof data.pdf === 'string' ? JSON.parse(data.pdf) : data.pdf;
        setPdfs(pdfData.map(pdf => ({
          name: pdf.split('/').pop(),
          url: `/storage/images/item/${pdf}`,
          toDelete: false
        })));
      } catch (e) {
        setPdfs([]);
      }
    } else {
      setPdfs([]);
    }

    // Load videos
    if (data?.linkvideo) {
      try {
        const videoData = typeof data.linkvideo === 'string' ? JSON.parse(data.linkvideo) : data.linkvideo;
        setVideos(videoData.map(url => ({ url, toDelete: false })));
      } catch (e) {
        setVideos([]);
      }
    } else {
      setVideos([]);
    }

    $(modalRef.current).modal('show');
  };

  const onModalSubmit = async (e) => {
    e.preventDefault();

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
      total_rooms: totalRoomsRef.current.value,
      price: priceRef.current.value,
      discount: discountRef.current.value,
    };

    const formData = new FormData();
    for (const key in request) {
      formData.append(key, request[key]);
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
    let galleryIndex = 0;
    let galleryIdsIndex = 0;
    
    // Crear array con el orden de las imágenes (solo las no marcadas para eliminar)
    const galleryOrder = [];
    
    gallery.forEach((img, index) => {
      if (!img.toDelete) {
        if (img.file) {
          formData.append(`gallery[${galleryIndex}]`, img.file); // Imágenes nuevas
          galleryOrder.push({ type: 'new', index: galleryIndex });
          galleryIndex++;
        } else if (img.id) {
          formData.append(`gallery_ids[${galleryIdsIndex}]`, img.id); // IDs de imágenes existentes
          galleryOrder.push({ type: 'existing', id: img.id, index: galleryIdsIndex });
          galleryIdsIndex++;
        }
      }
    });
    
    // Enviar el orden de la galería al backend
    if (galleryOrder.length > 0) {
      formData.append('gallery_order', JSON.stringify(galleryOrder));
    }

    // Imágenes marcadas para eliminar
    const deletedImages = gallery
      .filter((img) => img.toDelete && img.id)
      .map((img) => img.id);
    if (deletedImages.length > 0) {
      deletedImages.forEach((id, index) => {
        formData.append(`deleted_images[${index}]`, id);
      });
    }

    // PDFs - Con orden correcto
    const pdfFiles = pdfs.filter(pdf => !pdf.toDelete);
    let pdfIndex = 0;
    pdfFiles.forEach((pdf) => {
      if (pdf.file) {
        // Nuevo archivo PDF
        formData.append(`pdf[${pdfIndex}]`, pdf.file);
        pdfIndex++;
      }
    });
    
    // Enviar el orden de los PDFs
    const pdfOrder = pdfFiles.map((pdf, index) => ({
      index,
      order: index + 1,
      name: pdf.name || 'Documento.pdf'
    }));
    if (pdfOrder.length > 0) {
      formData.append('pdf_order', JSON.stringify(pdfOrder));
    }
    
    // PDFs marcados para eliminar
    const deletedPdfs = pdfs
      .map((pdf, index) => pdf.toDelete ? index : null)
      .filter(index => index !== null);
    if (deletedPdfs.length > 0) {
      formData.append('deleted_pdfs', JSON.stringify(deletedPdfs));
    }

    // Videos - Con orden correcto
    const videoLinks = videos.filter(video => !video.toDelete);
    const videoData = videoLinks.map((video, index) => ({
      url: video.url,
      order: index + 1
    }));
    if (videoData.length > 0) {
      formData.append('linkvideo', JSON.stringify(videoData));
    }
    
    // Videos marcados para eliminar
    const deletedVideos = videos
      .map((video, index) => video.toDelete ? index : null)
      .filter(index => index !== null);
    if (deletedVideos.length > 0) {
      formData.append('deleted_videos', JSON.stringify(deletedVideos));
    }

    // Amenities
    const selectedAmenities = $(amenitiesRef.current).val() || [];
    formData.append('amenities', JSON.stringify(selectedAmenities));

    const result = await itemsRest.save(formData);
    if (!result) return;

    // Reset delete flag after successful save
    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh();
    $(modalRef.current).modal('hide');
    
    // Limpiar estados de multimedia
    setGallery([]);
    setPdfs([]);
    setVideos([]);
  };

  const onVisibleChange = async ({ id, value }) => {
    const result = await itemsRest.boolean({ id, field: 'visible', value });
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
          {
            dataField: 'name',
            caption: 'Habitación',
            width: '20%',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <strong>{data.name}</strong>
                  <div className="small text-muted">
                    <span className="badge badge-soft-secondary">{data.sku}</span>
                    {data.room_type && (
                      <span className="badge badge-soft-info ml-1">
                        {roomTypes[data.room_type] || data.room_type}
                      </span>
                    )}
                  </div>
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
                  <div className="small">
                    <i className="mdi mdi-account-multiple text-primary mr-1"></i>
                    {data.max_occupancy || 0} personas
                  </div>
                  <div className="small">
                    <i className="mdi mdi-bed text-success mr-1"></i>
                    {data.beds_count || 0} cama{data.beds_count !== 1 ? 's' : ''}
                  </div>
                  {data.size_m2 > 0 && (
                    <div className="small">
                      <i className="mdi mdi-ruler-square text-info mr-1"></i>
                      {data.size_m2} m²
                    </div>
                  )}
                </div>
              );
            }
          },
          {
            dataField: 'total_rooms',
            caption: 'Disponibles',
            width: '10%',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div className="text-center">
                  <h5 className="mb-0">
                    <span className="badge badge-soft-primary">{data.total_rooms || 0}</span>
                  </h5>
                  <small className="text-muted">habitaciones</small>
                </div>
              );
            }
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
          {
            dataField: 'visible',
            caption: 'Visible',
            dataType: 'boolean',
            cellTemplate: (container, { data }) => {
              $(container).empty();
              ReactAppend(container,
                <SwitchFormGroup
                  checked={data.visible == 1}
                  onChange={() => onVisibleChange({ id: data.id, value: !data.visible })}
                />
              );
            }
          },
          {
            dataField: 'status',
            caption: 'Activo',
            dataType: 'boolean',
            cellTemplate: (container, { data }) => {
              $(container).empty();
              ReactAppend(container,
                <SwitchFormGroup
                  checked={data.status == 1}
                  onChange={() => onStatusChange({ id: data.id, value: !data.status })}
                />
              );
            }
          },
          {
            caption: 'Acciones',
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
        ].filter(col => {
          if (!col) return false;
          if (col.dataField === 'image' && !Fillable.has('items', 'image')) return false;
          return true;
        })}
      />

      <Modal
        modalRef={modalRef}
        title={isEditing ? 'Editar habitación' : 'Nueva habitación'}
        onSubmit={onModalSubmit}
        size="xl"
      >
        <div id="rooms-container">
          <input ref={idRef} type="hidden" />

          {/* Sistema de Pestañas */}
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
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
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
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-list-ul me-2"></i>
                Detalles
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="amenities-tab"
                data-bs-toggle="pill"
                data-bs-target="#amenities"
                type="button"
                role="tab"
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-star me-2"></i>
                Amenidades
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
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-images me-2"></i>
                Multimedia
              </button>
            </li>
          </ul>

          {/* Contenido de las Pestañas */}
          <div className="tab-content">
            {/* Pestaña: Información Básica */}
            <div className="tab-pane fade show active" id="basic-info" role="tabpanel">
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
                        placeholder="Ej: Habitación Doble Standard"
                      />
                      <InputFormGroup
                        eRef={skuRef}
                        label="SKU"
                        required
                        placeholder="Ej: ROOM-001"
                      />
                      <div className="mb-3">
                        <label className="form-label">Tipo de Habitación <span className="text-danger">*</span></label>
                        <SelectFormGroup
                          eRef={roomTypeRef}
                          dropdownParent="#rooms-container"
                          required
                        >
                          <option value="standard">Estándar</option>
                          <option value="suite">Suite</option>
                          <option value="deluxe">Deluxe</option>
                          <option value="presidential">Presidencial</option>
                          <option value="family">Familiar</option>
                          <option value="executive">Ejecutiva</option>
                        </SelectFormGroup>
                      </div>
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
                        rows={3}
                        placeholder="Breve descripción..."
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
                      <QuillFormGroup eRef={descriptionRef} label="Descripción Detallada" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña: Detalles */}
            <div className="tab-pane fade" id="details" role="tabpanel">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-users me-2"></i>Capacidad</h6>
                    </div>
                    <div className="card-body">
                      <InputFormGroup
                        eRef={maxOccupancyRef}
                        label="Capacidad Máxima"
                        type="number"
                        required
                        min="1"
                        max="10"
                        specification="Número máximo de huéspedes"
                      />
                      <InputFormGroup
                        eRef={bedsCountRef}
                        label="Número de Camas"
                        type="number"
                        required
                        min="1"
                        max="5"
                      />
                      <InputFormGroup
                        eRef={sizeM2Ref}
                        label="Tamaño (m²)"
                        type="number"
                        min="0"
                        step="0.1"
                      />
                      <InputFormGroup
                        eRef={totalRoomsRef}
                        label="Total de Habitaciones"
                        type="number"
                        required
                        min="1"
                        specification="Cantidad disponible de este tipo"
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
                      />
                      <InputFormGroup
                        eRef={discountRef}
                        label="Descuento (%)"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pestaña: Amenidades */}
            <div className="tab-pane fade" id="amenities" role="tabpanel">
              <div className="card border-0 shadow-sm">
                <div className="card-header">
                  <h6 className="mb-0"><i className="fas fa-star me-2"></i>Amenidades Incluidas</h6>
                </div>
                <div className="card-body">
                  <SelectFormGroup
                    eRef={amenitiesRef}
                    label="Selecciona las amenidades"
                    dropdownParent="#rooms-container"
                    multiple
                  >
                    {amenities.map(amenity => (
                      <option key={amenity.id} value={amenity.id}>
                        {amenity.name}
                      </option>
                    ))}
                  </SelectFormGroup>
                  <small className="text-muted">Selecciona las amenidades incluidas en esta habitación</small>
                </div>
              </div>
            </div>

            {/* Pestaña: Multimedia */}
            <div className="tab-pane fade" id="multimedia" role="tabpanel">
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
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-images me-2"></i>Galería de Imágenes</h6>
                    </div>
                    <div className="card-body">
                      <label className="form-label fw-semibold text-dark mb-3">
                        <i className="fas fa-images me-2 text-primary"></i>
                        Galería de Imágenes
                        {gallery.filter(img => !img.toDelete).length > 0 && (
                          <span className="badge bg-primary ms-2">
                            {gallery.filter(img => !img.toDelete).length}
                          </span>
                        )}
                      </label>

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
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        border: '2px dashed #dee2e6',
                        minHeight: '160px'
                      }}>
                        {gallery.filter(image => !image.toDelete).map((image, index) => {
                          const originalIndex = gallery.findIndex(img => img === image);
                          const displayIndex = index + 1;
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
                                borderRadius: '12px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                cursor: 'grab',
                                transform: draggedIndex === originalIndex ? 'scale(1.05)' : 'scale(1)',
                                opacity: draggedIndex === originalIndex ? 0.8 : 1,
                                border: '3px solid transparent',
                                background: 'white'
                              }}
                            >
                              <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{
                                  width: '24px',
                                  height: '24px',
                                  fontSize: '11px',
                                  fontWeight: 'bold'
                                }}>
                                  {displayIndex}
                                </span>
                              </div>

                              <img
                                src={image.url}
                                alt={`Imagen ${displayIndex}`}
                                className="w-100 h-100"
                                style={{
                                  objectFit: 'cover',
                                  pointerEvents: 'none'
                                }}
                              />

                              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
                                background: 'rgba(0,0,0,0.7)',
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                              }} onMouseEnter={(e) => e.currentTarget.style.opacity = 1} onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                                <div className="d-flex gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '32px', height: '32px' }}
                                    onClick={(e) => removeGalleryImage(e, originalIndex)}
                                    title="Eliminar imagen"
                                  >
                                    <i className="fas fa-trash text-white"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <div
                          className="gallery-add-button d-flex flex-column align-items-center justify-content-center"
                          style={{
                            aspectRatio: '1',
                            border: '3px dashed #0d6efd',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(13, 110, 253, 0.05)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minHeight: '120px'
                          }}
                          onClick={() => galleryRef.current.click()}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          <div className="text-center">
                            <div className="mb-2 bg-primary" style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto'
                            }}>
                              <i className="fas fa-plus text-white fa-lg"></i>
                            </div>
                            <p className="mb-0 text-primary fw-semibold" style={{ fontSize: '12px' }}>
                              Agregar Imagen
                            </p>
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              Arrastra o haz clic
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-file-pdf me-2 text-danger"></i>Documentos PDF</h6>
                    </div>
                    <div className="card-body">
                      <label className="form-label fw-semibold text-dark mb-3">
                        <i className="fas fa-file-pdf me-2 text-danger"></i>
                        Archivos PDF (Folletos / Planos)
                        {pdfs.filter(pdf => !pdf.toDelete).length > 0 && (
                          <span className="badge bg-danger ms-2">
                            {pdfs.filter(pdf => !pdf.toDelete).length}
                          </span>
                        )}
                      </label>

                      <input
                        ref={pdfRef}
                        type="file"
                        multiple
                        accept=".pdf"
                        hidden
                        onChange={handlePdfChange}
                      />

                      <div className="list-group mb-3">
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
                              className="list-group-item d-flex align-items-center justify-content-between"
                              style={{
                                cursor: 'grab',
                                opacity: draggedPdfIndex === originalIndex ? 0.5 : 1,
                                backgroundColor: draggedPdfIndex === originalIndex ? '#f8f9fa' : 'white',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
                                <span className="badge bg-danger me-3" style={{ minWidth: '28px' }}>
                                  {index + 1}
                                </span>
                                <i className="fas fa-grip-vertical text-muted me-3"></i>
                                <i className="fas fa-file-pdf text-danger me-2"></i>
                                <span className="text-truncate" style={{ maxWidth: '250px' }}>{pdf.name}</span>
                              </div>
                              <div className="d-flex gap-2 flex-shrink-0">
                                {!pdf.file && (
                                  <a
                                    href={pdf.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </a>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => removePdf(e, originalIndex)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline-danger w-100"
                        onClick={() => pdfRef.current.click()}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Agregar PDFs
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0"><i className="fas fa-video me-2 text-success"></i>Videos</h6>
                    </div>
                    <div className="card-body">
                      <label className="form-label fw-semibold text-dark mb-3">
                        <i className="fas fa-video me-2 text-success"></i>
                        Links de Videos (Tour Virtual)
                        {videos.filter(video => !video.toDelete).length > 0 && (
                          <span className="badge bg-success ms-2">
                            {videos.filter(video => !video.toDelete).length}
                          </span>
                        )}
                      </label>

                      <div className="list-group mb-3">
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
                              className="list-group-item d-flex align-items-center justify-content-between"
                              style={{
                                cursor: 'grab',
                                opacity: draggedVideoIndex === originalIndex ? 0.5 : 1,
                                backgroundColor: draggedVideoIndex === originalIndex ? '#f8f9fa' : 'white',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0, overflow: 'hidden' }}>
                                <span className="badge bg-success me-3 flex-shrink-0" style={{ minWidth: '28px' }}>
                                  {index + 1}
                                </span>
                                <i className="fas fa-grip-vertical text-muted me-3 flex-shrink-0"></i>
                                <i className="fas fa-video text-success me-2 flex-shrink-0"></i>
                                <span
                                  className="small"
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%'
                                  }}
                                  title={video.url}
                                >
                                  {video.url}
                                </span>
                              </div>
                              <div className="d-flex gap-2 flex-shrink-0 ms-2">
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="fas fa-external-link-alt"></i>
                                </a>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => removeVideo(e, originalIndex)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="input-group">
                        <input
                          ref={videoUrlRef}
                          type="url"
                          className="form-control"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={addVideo}
                        >
                          <i className="fas fa-plus me-2"></i>
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
