import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import IndicatorsRest from '../Actions/Admin/IndicatorsRest';
import Modal from '../Components/Adminto/Modal';
import DxButton from '../Components/dx/DxButton';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import Table from '../Components/Adminto/Table';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import Fillable from '../Utils/Fillable';

const indicatorsRest = new IndicatorsRest()

const Indicators = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const symbolRef = useRef()
  const bgImageRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const buttonTextRef = useRef()
  const buttonLinkRef = useRef()
  const badgeRef = useRef()
  const subtitleRef = useRef()
  const bgColorRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [useBackground, setUseBackground] = useState(false)
  const [currentColor, setCurrentColor] = useState('#71b6f9')

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    // Reset delete flags when opening modal
    if (symbolRef.current && symbolRef.resetDeleteFlag) symbolRef.resetDeleteFlag();
    if (bgImageRef.current && bgImageRef.resetDeleteFlag) bgImageRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? ''
    
    if (Fillable.has('indicators', 'name')) {
      nameRef.current.value = data?.name ?? ''
    }
    if (Fillable.has('indicators', 'description')) {
      descriptionRef.current.value = data?.description ?? ''
    }
    if (Fillable.has('indicators', 'button_text')) {
      buttonTextRef.current.value = data?.button_text ?? ''
    }
    if (Fillable.has('indicators', 'button_link')) {
      buttonLinkRef.current.value = data?.button_link ?? ''
    }
    if (Fillable.has('indicators', 'badge')) {
      badgeRef.current.value = data?.badge ?? ''
    }
    if (Fillable.has('indicators', 'subtitle')) {
      subtitleRef.current.value = data?.subtitle ?? ''
    }
    
    // Configurar color de fondo
    if (Fillable.has('indicators', 'bg_color')) {
      const bgColor = data?.bg_color ?? 'transparent'
      if (bgColor !== 'transparent' && bgColor !== '') {
        setUseBackground(true)
        setCurrentColor(bgColor.startsWith('#') ? bgColor : '#71b6f9')
      } else {
        setUseBackground(false)
        setCurrentColor('#71b6f9')
      }
    }

    if (Fillable.has('indicators', 'symbol') && symbolRef.current && symbolRef.image) {
      symbolRef.current.value = null
      symbolRef.image.src = data?.symbol ? `/storage/images/indicator/${data.symbol}` : ''
    }

    if (Fillable.has('indicators', 'bg_image') && bgImageRef.current && bgImageRef.image) {
      bgImageRef.current.value = null
      bgImageRef.image.src = data?.bg_image ? `/storage/images/indicator/${data.bg_image}` : ''
    }

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
    }
    
    if (Fillable.has('indicators', 'name')) {
      request.name = nameRef.current.value
    }
    if (Fillable.has('indicators', 'description')) {
      request.description = descriptionRef.current.value
    }
    if (Fillable.has('indicators', 'button_text')) {
      request.button_text = buttonTextRef.current.value
    }
    if (Fillable.has('indicators', 'button_link')) {
      request.button_link = buttonLinkRef.current.value
    }
    if (Fillable.has('indicators', 'badge')) {
      request.badge = badgeRef.current.value
    }
    if (Fillable.has('indicators', 'subtitle')) {
      request.subtitle = subtitleRef.current.value
    }
    if (Fillable.has('indicators', 'bg_color')) {
      request.bg_color = useBackground ? currentColor : 'transparent'
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }

    // Validar si symbol está disponible (Fillable)
    if (symbolRef.current && Fillable.has('indicators', 'symbol')) {
      const symbol = symbolRef.current.files[0]
      if (symbol) {
        formData.append('symbol', symbol)
      }
      // Check for image deletion flag
      if (symbolRef.getDeleteFlag && symbolRef.getDeleteFlag()) {
        formData.append('symbol_delete', 'DELETE');
      }
    }

    // Validar si bg_image está disponible (Fillable)
    if (bgImageRef.current && Fillable.has('indicators', 'bg_image')) {
      const bgImage = bgImageRef.current.files[0]
      if (bgImage) {
        formData.append('bg_image', bgImage)
      }
      // Check for image deletion flag
      if (bgImageRef.getDeleteFlag && bgImageRef.getDeleteFlag()) {
        formData.append('bg_image_delete', 'DELETE');
      }
    }

    const result = await indicatorsRest.save(formData)
    if (!result) return

    // Reset delete flags after successful save
    if (symbolRef.current && symbolRef.resetDeleteFlag) symbolRef.resetDeleteFlag();
    if (bgImageRef.current && bgImageRef.resetDeleteFlag) bgImageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onStatusChange = async ({ id, status }) => {
    const result = await indicatorsRest.status({ id, status })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await indicatorsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar indicador',
      text: '¿Estas seguro de eliminar este indicador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await indicatorsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  // Función para manejar el reordering remoto
  const onReorder = async (e) => {
    // e.toIndex es la nueva posición donde se quiere insertar el elemento
    const newOrderIndex = e.toIndex
    
    try {
      const result = await indicatorsRest.reorder(e.itemData.id, newOrderIndex)
      if (result) {
        await e.component.refresh()
      }
    } catch (error) {
      console.error('Error reordering indicator:', error)
    }
  }

  return (<>
    <Table gridRef={gridRef} title='Indicadores' rest={indicatorsRest}
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
            text: 'Nuevo indicador',
            hint: 'Nuevo indicador',
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
        Fillable.has('indicators', 'symbol') && {
          dataField: 'symbol',
          caption: 'Icono',
          width: 100,
          cellTemplate: (container, { data }) => {
            const imageUrl = data.symbol ? `/storage/images/indicator/${data.symbol}` : '/api/cover/thumbnail/null'
            const bgColor = data.bg_color || 'transparent'
            ReactAppend(container, 
              <div style={{ width: '60px', height: '60px', backgroundColor: bgColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />
              </div>
            )
          }
        },
        Fillable.has('indicators', 'name') && {
          dataField: 'name',
          caption: 'Título',
          width: 150,
        },
        Fillable.has('indicators', 'description') && {
          dataField: 'description',
          caption: 'Descripción',
        },
        Fillable.has('indicators', 'button_text') && {
          dataField: 'button_text',
          caption: 'Texto del Botón',
          width: 150,
        },
        Fillable.has('indicators', 'visible') && {
          dataField: 'visible',
          caption: 'Visible',
          width: 80,
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
          width: 120,
          cellTemplate: (container, { data }) => {
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar indicador' : 'Agregar indicador'} onSubmit={onModalSubmit} size='lg'>
      <input ref={idRef} type='hidden' />
      
      <div id='indicators-container'>
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
          {(Fillable.has('indicators', 'symbol') || Fillable.has('indicators', 'bg_image')) && (
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
                <i className="fas fa-images me-2"></i>
                Multimedia
              </button>
            </li>
          )}
          {(Fillable.has('indicators', 'button_text') || Fillable.has('indicators', 'button_link')) && (
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="action-tab" 
                data-bs-toggle="pill" 
                data-bs-target="#action" 
                type="button" 
                role="tab" 
                aria-controls="action" 
                aria-selected="false"
                style={{
                  borderRadius: '6px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-link me-2"></i>
                Botón de Acción
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
                      Información del Indicador
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {Fillable.has('indicators', 'name') && (
                        <div className={`${Fillable.has('indicators', 'subtitle') ? 'col-md-6' : 'col-12'}`}>
                          <InputFormGroup
                            eRef={nameRef}
                            label='Título'
                            required
                            placeholder="Ej: Oferta Especial"
                          />
                        </div>
                      )}
                      {Fillable.has('indicators', 'subtitle') && (
                        <div className="col-md-6">
                          <InputFormGroup
                            eRef={subtitleRef}
                            label='Subtítulo'
                            placeholder="Ej: 20% de descuento"
                          />
                        </div>
                      )}
                      {Fillable.has('indicators', 'description') && (
                        <div className="col-12">
                          <TextareaFormGroup
                            eRef={descriptionRef}
                            label='Descripción'
                            rows={3}
                            placeholder="Descripción del indicador"
                          />
                        </div>
                      )}
                      {Fillable.has('indicators', 'badge') && (
                        <div className="col-md-6">
                          <InputFormGroup
                            eRef={badgeRef}
                            label='Badge'
                            placeholder="Ej: ¡Limitado!"
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
          {(Fillable.has('indicators', 'symbol') || Fillable.has('indicators', 'bg_image')) && (
            <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
              <div className="row g-3">
                {Fillable.has('indicators', 'symbol') && (
                  <div className={`${Fillable.has('indicators', 'bg_image') ? 'col-md-6' : 'col-12'}`}>
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="fas fa-icons me-2 text-primary"></i>
                          Icono / Símbolo
                        </h6>
                      </div>
                      <div className="card-body">
                        <ImageFormGroup
                          eRef={symbolRef}
                          name="symbol"
                          label='Icono del Indicador'
                          col='col-12'
                          required={!isEditing}
                          aspect='1/1'
                        />
                        <small className="text-muted d-block">
                          <i className="mdi mdi-information me-1"></i>
                          Recomendado: 100x100px (1:1)
                        </small>
                      </div>
                    </div>
                  </div>
                )}
                
                {Fillable.has('indicators', 'bg_image') && (
                  <div className={`${Fillable.has('indicators', 'symbol') ? 'col-md-6' : 'col-12'}`}>
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0">
                          <i className="fas fa-image me-2 text-success"></i>
                          Imagen de Fondo
                        </h6>
                      </div>
                      <div className="card-body">
                        <ImageFormGroup
                          eRef={bgImageRef}
                          name="bg_image"
                          label='Imagen de Fondo del Indicador'
                          col='col-12'
                          aspect='16/9'
                        />
                        <small className="text-muted">
                          <i className="mdi mdi-information me-1"></i>
                          Recomendado: 1200x675px (16:9)
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {Fillable.has('indicators', 'bg_color') && (
                  <div className="col-12">
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
                            {/* Columna Izquierda: Controles de Color */}
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

          {/* Pestaña: Botón de Acción */}
          {(Fillable.has('indicators', 'button_text') || Fillable.has('indicators', 'button_link')) && (
            <div className="tab-pane fade" id="action" role="tabpanel" aria-labelledby="action-tab">
              <div className="row g-3">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="mdi mdi-link-variant me-2 text-info"></i>
                        Configuración del Botón (Opcional)
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Fillable.has('indicators', 'button_text') && (
                          <div className="col-md-6">
                            <InputFormGroup
                              eRef={buttonTextRef}
                              label='Texto del Botón'
                              placeholder="Ej: Ver más"
                            />
                          </div>
                        )}
                        {Fillable.has('indicators', 'button_link') && (
                          <div className="col-md-6">
                            <InputFormGroup
                              eRef={buttonLinkRef}
                              label='Enlace del Botón'
                              placeholder="Ej: /productos"
                            />
                          </div>
                        )}
                      </div>
                      <small className="text-muted mt-2 d-block">
                        <i className="mdi mdi-information me-1"></i>
                        El botón solo se mostrará en el frontend si ambos campos están completos
                      </small>
                    </div>
                  </div>
                </div>
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

  createRoot(el).render(<BaseAdminto {...properties} title='Indicadores'>
    <Indicators {...properties} />
  </BaseAdminto>);
})