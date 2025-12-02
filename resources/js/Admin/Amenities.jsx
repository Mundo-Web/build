import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import BaseAdminto from '@Adminto/Base';
import AmenitiesRest from '../Actions/Admin/AmenitiesRest';
import Table from '../Components/Adminto/Table';
import Modal from '../Components/Adminto/Modal';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import TextareaFormGroup from '../Components/Adminto/form/TextareaFormGroup';
import SwitchFormGroup from '../Components/Adminto/form/SwitchFormGroup';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Fillable from '../Utils/Fillable';
import Swal from 'sweetalert2';
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaCoffee,
  FaUtensils,
  FaConciergeBell,
  FaSpa,
  FaSmokingBan,
  FaDog,
  FaWheelchair,
  FaShuttleVan,
  FaBriefcase,
  FaBaby,
  FaLock,
  FaFan,
  FaHotTub,
  FaUmbrellaBeach,
  FaGlassMartini,
  FaGamepad
} from 'react-icons/fa';

const amenitiesRest = new AmenitiesRest();

// Amenidades predefinidas con iconos
const predefinedAmenities = [
  { id: 'wifi', name: 'WiFi', icon: FaWifi, iconRef: 'fas fa-wifi' },
  { id: 'tv', name: 'TV', icon: FaTv, iconRef: 'fas fa-tv' },
  { id: 'aire', name: 'Aire Acondicionado', icon: FaSnowflake, iconRef: 'fas fa-snowflake' },
  { id: 'estacionamiento', name: 'Estacionamiento', icon: FaParking, iconRef: 'fas fa-parking' },
  { id: 'piscina', name: 'Piscina', icon: FaSwimmingPool, iconRef: 'fas fa-swimming-pool' },
  { id: 'gimnasio', name: 'Gimnasio', icon: FaDumbbell, iconRef: 'fas fa-dumbbell' },
  { id: 'desayuno', name: 'Desayuno', icon: FaCoffee, iconRef: 'fas fa-coffee' },
  { id: 'restaurante', name: 'Restaurante', icon: FaUtensils, iconRef: 'fas fa-utensils' },
  { id: 'servicio-habitacion', name: 'Servicio a la Habitación', icon: FaConciergeBell, iconRef: 'fas fa-concierge-bell' },
  { id: 'spa', name: 'Spa', icon: FaSpa, iconRef: 'fas fa-spa' },
  { id: 'no-fumar', name: 'No Fumar', icon: FaSmokingBan, iconRef: 'fas fa-smoking-ban' },
  { id: 'pet-friendly', name: 'Pet Friendly', icon: FaDog, iconRef: 'fas fa-dog' },
  { id: 'accesible', name: 'Accesible', icon: FaWheelchair, iconRef: 'fas fa-wheelchair' },
  { id: 'transfer', name: 'Transfer Aeropuerto', icon: FaShuttleVan, iconRef: 'fas fa-shuttle-van' },
  { id: 'business', name: 'Centro de Negocios', icon: FaBriefcase, iconRef: 'fas fa-briefcase' },
  { id: 'cuna', name: 'Cuna Disponible', icon: FaBaby, iconRef: 'fas fa-baby' },
  { id: 'caja-fuerte', name: 'Caja Fuerte', icon: FaLock, iconRef: 'fas fa-lock' },
  { id: 'ventilador', name: 'Ventilador', icon: FaFan, iconRef: 'fas fa-fan' },
  { id: 'jacuzzi', name: 'Jacuzzi', icon: FaHotTub, iconRef: 'fas fa-hot-tub' },
  { id: 'playa', name: 'Acceso a Playa', icon: FaUmbrellaBeach, iconRef: 'fas fa-umbrella-beach' },
  { id: 'bar', name: 'Bar', icon: FaGlassMartini, iconRef: 'fas fa-glass-martini' },
  { id: 'entretenimiento', name: 'Entretenimiento', icon: FaGamepad, iconRef: 'fas fa-gamepad' }
];

const Amenities = () => {
  const gridRef = useRef();
  const modalRef = useRef();

  // Form elements ref
  const idRef = useRef();
  const nameRef = useRef();
  const slugRef = useRef();
  const iconRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleIconChange = (iconId) => {
    const amenity = predefinedAmenities.find(a => a.id === iconId);
    setSelectedIcon(amenity);
  };

  useEffect(() => {
    // Configurar el evento de cambio para Select2
    const setupSelect2Event = () => {
      if (iconRef.current) {
        $(iconRef.current).on('change', function () {
          const value = $(this).val();
          handleIconChange(value);
        });
      }
    };

    // Configurar después de que el modal se abra
    $(modalRef.current).on('shown.bs.modal', setupSelect2Event);

    return () => {
      if (iconRef.current) {
        $(iconRef.current).off('change');
      }
      $(modalRef.current).off('shown.bs.modal', setupSelect2Event);
    };
  }, []);

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true);
    else setIsEditing(false);

    // Reset delete flag when opening modal
    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? '';
    nameRef.current.value = data?.name ?? '';
    slugRef.current.value = data?.slug ?? '';
    descriptionRef.current.value = data?.description ?? '';
    if (imageRef.current && imageRef.image) {
      imageRef.image.src = data?.image ? `/api/amenities/media/${data.id}` : '';
      imageRef.current.value = null;
    }
    
    // Buscar la amenidad predefinida por iconRef
    const amenity = predefinedAmenities.find(a => a.iconRef === data?.icon);
    
    if (amenity) {
      setSelectedIcon(amenity);
      // Configurar el valor después de que el modal se muestre
      setTimeout(() => {
        $(iconRef.current).val(amenity.id).trigger('change');
      }, 100);
    } else {
      setSelectedIcon(null);
      setTimeout(() => {
        $(iconRef.current).val('').trigger('change');
      }, 100);
    }

    $(modalRef.current).modal('show');
  };

  const onModalSubmit = async (e) => {
    e.preventDefault();

    if (!selectedIcon) {
      Swal.fire('Error', 'Por favor selecciona un icono', 'error');
      return;
    }

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      slug: slugRef.current.value,
      icon: selectedIcon.iconRef,
      description: descriptionRef.current.value,
    };

    const formData = new FormData();
    for (const key in request) {
      formData.append(key, request[key]);
    }
    
    if (imageRef.current) {
      const file = imageRef.current.files[0];
      if (file) {
        formData.append('image', file);
      }

      // Check for image deletion flag
      if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
        formData.append('image_delete', 'DELETE');
      }
    }

    const result = await amenitiesRest.save(formData);
    if (!result) return;

    // Reset delete flag after successful save
    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh();
    $(modalRef.current).modal('hide');
  };

  const onVisibleChange = async ({ id, value }) => {
    const result = await amenitiesRest.boolean({ id, field: 'visible', value });
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  const onStatusChange = async ({ id, value }) => {
    const result = await amenitiesRest.boolean({ id, field: 'status', value });
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar amenidad',
      text: '¿Estás seguro de eliminar esta amenidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;
    const result = await amenitiesRest.delete(id);
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  // Auto-generate slug when name changes
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    slugRef.current.value = slug;
  };

  return (
    <>
      <Table
        gridRef={gridRef}
        title="Amenidades"
        rest={amenitiesRest}
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
              text: 'Nueva amenidad',
              hint: 'Nueva amenidad',
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
                    src={`/api/amenities/media/${data.id}`} 
                    alt={data.name}
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                  />
                );
              }
            }
          },
          {
            dataField: 'icon',
            caption: 'Icono',
            width: '80px',
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              const amenity = predefinedAmenities.find(a => a.iconRef === data.icon);
              if (amenity) {
                const IconComponent = amenity.icon;
                container.html(renderToString(
                  <div className="d-flex justify-content-center align-items-center">
                    <IconComponent size={32} />
                  </div>
                ));
              } else if (data.icon) {
                container.html(renderToString(
                  <div className="d-flex justify-content-center align-items-center">
                    <i className={data.icon} style={{ fontSize: '32px' }}></i>
                  </div>
                ));
              }
            }
          },
          {
            dataField: 'name',
            caption: 'Nombre',
            width: '30%'
          },
          {
            dataField: 'description',
            caption: 'Descripción',
            width: '40%'
          },
          {
            dataField: 'slug',
            caption: 'Slug',
            width: '20%'
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
          if (col.dataField === 'image' && !Fillable.has('amenities', 'image')) return false;
          return true;
        })}
      />
      <Modal
        modalRef={modalRef}
        title={isEditing ? 'Editar amenidad' : 'Nueva amenidad'}
        onSubmit={onModalSubmit}
        size="md"
      >
        <input ref={idRef} type="hidden" />
        <div className="row" id="amenities-container">
          {Fillable.has('amenities', 'image') && (
            <ImageFormGroup
              eRef={imageRef}
              name="image"
              label="Imagen"
              col="col-md-12"
              aspect={1}
            />
          )}
          
          <div className="col-12 mb-3">
            <label className="form-label">Icono <span className="text-danger">*</span></label>
            <SelectFormGroup
              eRef={iconRef}
              dropdownParent="#amenities-container"
              required
              templateResult={(state) => {
                if (!state.id) return state.text;
                const amenity = predefinedAmenities.find(a => a.id === state.id);
                if (!amenity) return state.text;
                const IconComponent = amenity.icon;
                return $(`<span><i class="${amenity.iconRef}" style="margin-right: 8px;"></i>${state.text}</span>`);
              }}
              templateSelection={(state) => {
                if (!state.id) return state.text;
                const amenity = predefinedAmenities.find(a => a.id === state.id);
                if (!amenity) return state.text;
                return $(`<span><i class="${amenity.iconRef}" style="margin-right: 8px;"></i>${state.text}</span>`);
              }}
            >
              <option value="">Seleccionar icono...</option>
              {predefinedAmenities.map((amenity) => (
                <option key={amenity.id} value={amenity.id}>
                  {amenity.name}
                </option>
              ))}
            </SelectFormGroup>
          </div>

          {selectedIcon && (
            <div className="col-12 mb-3">
              <div className="alert alert-info d-flex align-items-center">
                <selectedIcon.icon className="me-2" size={24} />
                <span>Icono seleccionado: <strong>{selectedIcon.name}</strong></span>
              </div>
            </div>
          )}

          <InputFormGroup
            eRef={nameRef}
            label="Nombre"
            col="col-md-12"
            required
            onChange={handleNameChange}
          />
          <input ref={slugRef} type="hidden" />
          <TextareaFormGroup
            eRef={descriptionRef}
            label="Descripción"
            col="col-md-12"
            rows={3}
            hidden={!Fillable.has('amenities', 'description')}
          />
        </div>
      </Modal>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Amenidades'>
    <Amenities {...properties} />
  </BaseAdminto>);
});
