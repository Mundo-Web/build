import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import BenefitsRest from '../Actions/Admin/BenefitsRest';
import BasicEditing from '../Components/Adminto/Basic/BasicEditing';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import Fillable from '../Utils/Fillable';

const benefitsRest = new BenefitsRest()

const Benefits = ({ details }) => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()
  const bgColorRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [useBackground, setUseBackground] = useState(false)
  const [currentColor, setCurrentColor] = useState('#71b6f9')

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    
    if (Fillable.has('benefits', 'name')) {
      nameRef.current.value = data?.name ?? ''
    }
    if (Fillable.has('benefits', 'description')) {
      descriptionRef.current.value = data?.description ?? ''
    }

    // Configurar color de fondo
    if (Fillable.has('benefits', 'bg_color')) {
      const bgColor = data?.bg_color ?? 'transparent'
      if (bgColor !== 'transparent' && bgColor !== '') {
        setUseBackground(true)
        setCurrentColor(bgColor.startsWith('#') ? bgColor : '#71b6f9')
      } else {
        setUseBackground(false)
        setCurrentColor('#71b6f9')
      }
    }

    if (Fillable.has('benefits', 'image') && imageRef.current && imageRef.image) {
      imageRef.current.value = null
      imageRef.image.src = data?.image ? `/storage/images/benefit/${data.image}` : ''
    }

    // Reset delete flag when opening modal
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
    }
    
    if (Fillable.has('benefits', 'name')) {
      request.name = nameRef.current.value
    }
    if (Fillable.has('benefits', 'description')) {
      request.description = descriptionRef.current.value
    }
    if (Fillable.has('benefits', 'bg_color')) {
      request.bg_color = useBackground ? currentColor : 'transparent'
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }

    // Validar si image está disponible (Fillable)
    if (imageRef.current && Fillable.has('benefits', 'image')) {
      const image = imageRef.current.files[0]
      if (image) {
        formData.append('image', image)
      }
      // Check for image deletion flag
      if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
        formData.append('image_delete', 'DELETE');
      }
    }

    const result = await benefitsRest.save(formData)
    if (!result) return

    // Reset delete flag after successful save
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await benefitsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar registro',
      text: '¿Estas seguro de eliminar este registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await benefitsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  // Función para manejar el reordering remoto
  const onReorder = async (e) => {
    // e.toIndex es la nueva posición donde se quiere insertar el elemento
    const newOrderIndex = e.toIndex
    
    try {
      const result = await benefitsRest.reorder(e.itemData.id, newOrderIndex)
      if (result) {
        await e.component.refresh()
      }
    } catch (error) {
      console.error('Error reordering benefit:', error)
    }
  }

  return (<>
    <Table gridRef={gridRef} title={<BasicEditing correlative='benefits' details={details} />} rest={benefitsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'plus',
            text: 'Nuevo beneficio',
            hint: 'Nuevo beneficio',
            onClick: () => onModalOpen()
          }
        });
      }}
      rowDragging={{
        allowReordering: true,
        onReorder: onReorder,
        dropFeedbackMode: 'push'
      }}
      sorting={{
        mode: 'single'
      }}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'order_index',
          caption: 'Orden',
          visible: false,
          sortOrder: 'asc',
          sortIndex: 0
        },
        Fillable.has('benefits', 'name') && {
          dataField: 'name',
          caption: 'Beneficio',
          width: '30%',
        },
        Fillable.has('benefits', 'description') && {
          dataField: 'description',
          caption: 'Descripción',
          width: '50%',
        },
        Fillable.has('benefits', 'image') && {
          dataField: 'image',
          caption: 'Imagen',
          cellTemplate: (container, { data }) => {
            const imageUrl = data.image ? `/storage/images/benefit/${data.image}` : '/api/cover/thumbnail/null'
            const bgColor = data.bg_color || 'transparent'
            ReactAppend(container, 
              <div style={{ width: '80px', height: '80px', backgroundColor: bgColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />
              </div>
            )
          }
        },
        Fillable.has('benefits', 'visible') && {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.visible == 1} onChange={() => onVisibleChange({
              id: data.id,
              value: !data.visible
            })} />)
          }
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Editar',
              icon: 'fa fa-pen',
              onClick: () => onModalOpen(data)
            }))
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-danger',
              title: 'Eliminar',
              icon: 'fa fa-trash',
              onClick: () => onDeleteClicked(data.id)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
    <Modal modalRef={modalRef} title={isEditing ? 'Editar beneficio' : 'Agregar beneficio'} onSubmit={onModalSubmit} size='lg'>
      <input ref={idRef} type='hidden' />
      
      <div id='benefits-container'>
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
              aria-controls="basic-info" 
              aria-selected="true"
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
          {Fillable.has('benefits', 'image') && (
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
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-image me-2"></i>
                Multimedia
              </button>
            </li>
          )}
        </ul>

        {/* Contenido de las Pestañas */}
        <div className="tab-content">
          {/* Pestaña: Información Básica */}
          <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
            <div className="row g-3">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-tag me-2 text-primary"></i>
                      Información del Beneficio
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {Fillable.has('benefits', 'name') && (
                        <div className="col-12">
                          <InputFormGroup
                            eRef={nameRef}
                            label='Beneficio'
                            col='col-12'
                            required
                            placeholder="Ej: Envío gratis"
                          />
                        </div>
                      )}
                      {Fillable.has('benefits', 'description') && (
                        <div className="col-12">
                          <TextareaFormGroup
                            eRef={descriptionRef}
                            label='Descripción'
                            rows={3}
                            placeholder="Descripción del beneficio"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pestaña: Multimedia */}
          {Fillable.has('benefits', 'image') && (
            <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-image me-2 text-primary"></i>
                        Imagen del Beneficio
                      </h6>
                    </div>
                    <div className="card-body">
                      <ImageFormGroup
                        eRef={imageRef}
                        name="image"
                        label='Imagen'
                        col='col-12'
                        aspect='1/1'
                        required={!isEditing}
                      />
                      <small className="text-muted d-block mt-2">
                        <i className="mdi mdi-information me-1"></i>
                        Recomendado: 100x100px (1:1)
                      </small>
                    </div>
                  </div>
                </div>

                {Fillable.has('benefits', 'bg_color') && (
                  <div className="col-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="fas fa-palette me-2 text-warning"></i>
                          Color de Fondo del Icono
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="form-check form-switch mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="useBackgroundToggle"
                            checked={useBackground}
                            onChange={(e) => setUseBackground(e.target.checked)}
                          />
                          <label className="form-check-label fw-semibold" htmlFor="useBackgroundToggle">
                            Activar color de fondo personalizado
                          </label>
                        </div>

                        {useBackground && (
                          <div className="row g-4">
                            <div className="col-md-12">
                              <div className="row g-3">
                                <div className="col-12">
                                  <label className="form-label fw-semibold mb-3">
                                    <i className="fas fa-palette me-2 text-primary"></i>
                                    Selector de Color
                                  </label>
                                  <div className="d-flex gap-3 align-items-start">
                                    <div className="text-center">
                                      <input 
                                        ref={bgColorRef}
                                        type="color" 
                                        value={currentColor}
                                        onChange={(e) => setCurrentColor(e.target.value)}
                                        style={{ 
                                          width: '100px', 
                                          height: '100px', 
                                          cursor: 'pointer', 
                                          border: '3px solid #dee2e6',
                                          borderRadius: '12px',
                                          display: 'block',
                                          padding: '0',
                                          backgroundColor: 'transparent',
                                          WebkitAppearance: 'none',
                                          MozAppearance: 'none',
                                          appearance: 'none'
                                        }}
                                        title="Click para seleccionar color"
                                      />
                                      <small className="text-muted d-block mt-2">
                                        <i className="fas fa-hand-pointer me-1"></i>
                                        Click aquí
                                      </small>
                                    </div>
                                    <div className="flex-grow-1">
                                      <label className="form-label small text-muted mb-2">
                                        <i className="fas fa-code me-1"></i>
                                        Código Hexadecimal
                                      </label>
                                      <input 
                                        type="text" 
                                        className="form-control form-control-lg" 
                                        value={currentColor}
                                        onChange={(e) => setCurrentColor(e.target.value)}
                                        placeholder="#71b6f9"
                                        style={{ 
                                          fontFamily: 'monospace', 
                                          fontSize: '1.1rem', 
                                          letterSpacing: '1px',
                                          fontWeight: '600'
                                        }}
                                      />
                                      <small className="text-muted d-block mt-2">
                                        <i className="mdi mdi-information-outline me-1"></i>
                                        También puedes escribir el código manualmente
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!useBackground && (
                          <div className="alert alert-secondary mb-0 py-2" style={{ fontSize: '0.875rem' }}>
                            <i className="mdi mdi-check-circle me-2"></i>
                            El icono se mostrará sin color de fondo (transparente)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Beneficios'>
    <Benefits {...properties} />
  </BaseAdminto>);
})
