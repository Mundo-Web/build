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

const amenitiesRest = new AmenitiesRest();

const Amenities = () => {
  const gridRef = useRef();
  const modalRef = useRef();

  // Form elements ref
  const idRef = useRef();
  const nameRef = useRef();
  const imageRef = useRef();
  const descriptionRef = useRef();

  const [isEditing, setIsEditing] = useState(false);

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true);
    else setIsEditing(false);

    // Reset delete flag when opening modal
    if (imageRef.current && imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? '';
    nameRef.current.value = data?.name ?? '';
    descriptionRef.current.value = data?.description ?? '';
    if (imageRef.current && imageRef.image) {
      imageRef.image.src = data?.image ? `/storage/images/amenity/${data.image}` : '';
      imageRef.current.value = null;
    }

    $(modalRef.current).modal('show');
  };

  const onModalSubmit = async (e) => {
    e.preventDefault();

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
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
  
    if (!result) {
    
      return;
    }

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
            caption: 'Imagen/Icono',
            width: '100px',
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              if (data.image) {
                ReactAppend(container, 
                  <img 
                    src={`/storage/images/amenity/${data.image}`} 
                    alt={data.name}
                    style={{ 
                      width: '70px', 
                      height: '70px', 
                      objectFit: 'contain',
                      borderRadius: '4px',
                      padding: '5px',
                      background: '#f8f9fa'
                    }}
                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                  />
                );
              }
            }
          },
                Fillable.has('amenities', 'name') && {
            dataField: 'name',
            caption: 'Nombre',
            width: '30%'
          },
           Fillable.has('amenities', 'description') && {
            dataField: 'description',
            caption: 'Descripción',
            width: '40%'
          },
           Fillable.has('amenities', 'slug') && {
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
        <div className="row" id="amenities-container" >
         <div className="col-md-5">
           <ImageFormGroup
            eRef={imageRef}
            name="image"
            label="Imagen/Icono"
          
            aspect={1}
            required
          />
          <small className="text-muted mb-3">
            <i className="fas fa-info-circle me-1"></i>
            formato cuadrado, PNG con fondo transparente
          </small>
         </div>

         <div className="col-md-7">
           <InputFormGroup
            eRef={nameRef}
            label="Nombre"
            required
          />

          <TextareaFormGroup
            eRef={descriptionRef}
            label="Descripción"

            rows={3}
            hidden={!Fillable.has('amenities', 'description')}
          />
         </div>
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
