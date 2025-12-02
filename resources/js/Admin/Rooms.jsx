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

  const [isEditing, setIsEditing] = useState(false);
  const [amenities, setAmenities] = useState([]);

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

    // Add amenities
    const selectedAmenities = $(amenitiesRef.current).val() || [];
    formData.append('amenities', JSON.stringify(selectedAmenities));

    const result = await itemsRest.save(formData);
    if (!result) return;

    // Reset delete flag after successful save
    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh();
    $(modalRef.current).modal('hide');
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
        <input ref={idRef} type="hidden" />
        <div className="row" id="rooms-container">
          {Fillable.has('items', 'image') && (
            <div className="col-md-12 mb-3">
              <ImageFormGroup
                eRef={imageRef}
                name="image"
                label="Imagen Principal"
                col="col-md-12"
                aspect={16 / 9}
              />
            </div>
          )}

          <InputFormGroup
            eRef={nameRef}
            label="Nombre de la Habitación"
            col="col-md-6"
            required
            placeholder="Ej: Habitación Doble Standard"
          />
          
          <InputFormGroup
            eRef={skuRef}
            label="SKU"
            col="col-md-3"
            required
            placeholder="Ej: ROOM-001"
          />

          <div className="col-md-3">
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

          <TextareaFormGroup
            eRef={summaryRef}
            label="Resumen"
            col="col-md-12"
            rows={2}
            placeholder="Breve descripción..."
          />

          <TextareaFormGroup
            eRef={descriptionRef}
            label="Descripción Completa"
            col="col-md-12"
            rows={4}
            placeholder="Descripción detallada de la habitación..."
          />

          <InputFormGroup
            eRef={maxOccupancyRef}
            label="Capacidad Máxima"
            type="number"
            col="col-md-3"
            required
            min="1"
            max="10"
            specification="Número máximo de huéspedes"
          />

          <InputFormGroup
            eRef={bedsCountRef}
            label="Número de Camas"
            type="number"
            col="col-md-3"
            required
            min="1"
            max="5"
          />

          <InputFormGroup
            eRef={sizeM2Ref}
            label="Tamaño (m²)"
            type="number"
            col="col-md-3"
            min="0"
            step="0.1"
          />

          <InputFormGroup
            eRef={totalRoomsRef}
            label="Total de Habitaciones"
            type="number"
            col="col-md-3"
            required
            min="1"
            specification="Cantidad disponible de este tipo"
          />

          <InputFormGroup
            eRef={priceRef}
            label="Precio por Noche (S/)"
            type="number"
            col="col-md-6"
            required
            min="0"
            step="0.01"
          />

          <InputFormGroup
            eRef={discountRef}
            label="Descuento (%)"
            type="number"
            col="col-md-6"
            min="0"
            max="100"
            step="0.01"
          />

          <div className="col-md-12 mt-3">
            <label className="form-label">Amenidades</label>
            <SelectFormGroup
              eRef={amenitiesRef}
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
      </Modal>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Habitaciones'>
    <Rooms {...properties} />
  </BaseAdminto>);
});
