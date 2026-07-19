import BaseAdminto from '@Adminto/Base';
import InputFormGroup from '@Adminto/form/InputFormGroup';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import CatalogsRest from '../Actions/Admin/CatalogsRest';
import Fillable from '../Utils/Fillable';

const catalogsRest = new CatalogsRest();

const Catalogs = () => {
  const gridRef = useRef();
  const modalRef = useRef();

  const idRef = useRef();
  const nameRef = useRef();
  const descriptionRef = useRef();
  const visibleRef = useRef();
  const imageRef = useRef();
  const fileInputRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const onModalOpen = (data) => {
    if (data?.id) {
      setIsEditing(true);
      setCurrentPdfUrl(`/storage/images/catalog/${data.file}`);
    } else {
      setIsEditing(false);
      setCurrentPdfUrl('');
    }

    idRef.current.value = data?.id ?? '';
    nameRef.current.value = data?.name ?? '';
    descriptionRef.current.value = data?.description ?? '';
    
    // Set visible check box
    const isVisible = data ? data.visible == 1 : true;
    $(visibleRef.current).prop('checked', isVisible);

    // Load cover image preview
    if (imageRef.current && imageRef.image) {
      imageRef.image.src = data?.image
        ? `/storage/images/catalog/${data.image}`
        : '';
      imageRef.current.value = null;
      if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
    }

    // Reset PDF input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    $(modalRef.current).modal('show');
  };

  const onModalSubmit = async (e) => {
    e.preventDefault();

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      visible: visibleRef.current.checked ? 1 : 0
    };

    const formData = new FormData();
    for (const key in request) {
      if (request[key] !== undefined) {
        formData.append(key, request[key]);
      }
    }

    // Add cover image if exists
    if (imageRef.current) {
      const file = imageRef.current.files[0];
      if (file) {
        formData.append('image', file);
      }
      if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
        formData.append('image_delete', 'DELETE');
      }
    }

    // Add PDF file if exists
    if (fileInputRef.current) {
      const pdfFile = fileInputRef.current.files[0];
      if (pdfFile) {
        formData.append('file', pdfFile);
      }
    }

    const result = await catalogsRest.save(formData);
    if (!result) return;

    $(gridRef.current).dxDataGrid('instance').refresh();
    $(modalRef.current).modal('hide');
  };

  const onVisibleChange = async ({ id, value }) => {
    const result = await catalogsRest.boolean({ id, field: 'visible', value });
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar registro',
      text: '¿Estás seguro de eliminar este catálogo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!isConfirmed) return;
    const result = await catalogsRest.delete(id);
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  return (
    <>
      <Table
        gridRef={gridRef}
        title="Catálogos PDF"
        rest={catalogsRest}
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
              text: 'Nuevo registro',
              hint: 'Nuevo registro',
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
            caption: 'Portada',
            width: '90px',
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(
                container,
                <img
                  src={data.image ? `/storage/images/catalog/${data.image}` : '/images/no-image.png'}
                  style={{
                    width: '60px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #e9ecef'
                  }}
                  onError={(e) => (e.target.src = '/images/no-image.png')}
                />
              );
            }
          },
          {
            dataField: 'name',
            caption: 'Catálogo',
            width: '25%'
          },
          {
            dataField: 'description',
            caption: 'Descripción',
            width: '40%'
          },
          {
            dataField: 'file',
            caption: 'Archivo',
            width: '120px',
            allowFiltering: false,
            cellTemplate: (container, { data }) => {
              ReactAppend(
                container,
                <a
                  href={`/storage/images/catalog/${data.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-soft-danger d-inline-flex align-items-center gap-1"
                >
                  <i className="mdi mdi-file-pdf fs-5"></i>
                  Ver PDF
                </a>
              );
            }
          },
          {
            dataField: 'visible',
            caption: 'Visible',
            dataType: 'boolean',
            width: '100px',
            cellTemplate: (container, { data }) => {
              $(container).empty();
              ReactAppend(
                container,
                <SwitchFormGroup
                  checked={data.visible == 1}
                  onChange={() =>
                    onVisibleChange({
                      id: data.id,
                      value: !data.visible
                    })
                  }
                />
              );
            }
          },
          {
            caption: 'Acciones',
            width: '150px',
            cellTemplate: (container, { data }) => {
              container.css('text-overflow', 'unset');
              container.append(
                DxButton({
                  className: 'btn btn-xs btn-soft-primary me-1',
                  title: 'Editar',
                  icon: 'fa fa-pen',
                  onClick: () => onModalOpen(data)
                })
              );
              container.append(
                DxButton({
                  className: 'btn btn-xs btn-soft-danger',
                  title: 'Eliminar',
                  icon: 'fa fa-trash',
                  onClick: () => onDeleteClicked(data.id)
                })
              );
            },
            allowFiltering: false,
            allowExporting: false
          }
        ]}
      />

      <Modal
        modalRef={modalRef}
        title={isEditing ? 'Editar Catálogo' : 'Agregar Catálogo'}
        onSubmit={onModalSubmit}
        size="md"
      >
        <div className="row" id="catalogs-container">
          <input ref={idRef} type="hidden" />
          
          <InputFormGroup
            eRef={nameRef}
            label="Nombre del Catálogo"
            col="col-12"
            required
            placeholder="Ej. Catálogo de Invierno 2026"
          />

          <TextareaFormGroup
            eRef={descriptionRef}
            label="Descripción corta"
            col="col-12"
            rows={3}
            placeholder="Descripción detallada o notas del catálogo..."
          />

          <div className="col-12 mb-3">
            <label className="form-label mb-1">Archivo PDF del Catálogo {!isEditing && <b className="text-danger">*</b>}</label>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              className="form-control"
              required={!isEditing}
            />
            {isEditing && currentPdfUrl && (
              <div className="mt-2">
                <a
                  href={currentPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs btn-light d-inline-flex align-items-center gap-1 border"
                >
                  <i className="mdi mdi-file-pdf text-danger fs-5"></i>
                  Descargar / Ver PDF subido
                </a>
              </div>
            )}
          </div>

          <ImageFormGroup
            eRef={imageRef}
            name="image"
            label="Imagen de Portada (Opcional)"
            col="col-12"
            aspect="3/4"
          />

          <SwitchFormGroup
            eRef={visibleRef}
            label="Visible para Vendedores"
            info="Controla si este catálogo aparece en la vista de los vendedores"
            col="col-12"
          />
        </div>
      </Modal>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title="Catálogos PDF">
      <Catalogs {...properties} />
    </BaseAdminto>
  );
});
