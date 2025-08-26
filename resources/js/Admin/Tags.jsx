import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import ImageFormGroup from '@Adminto/form/ImageFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import TagsRest from '../Actions/Admin/TagsRets';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Global from '../Utils/Global';
import Fillable from '../Utils/Fillable';

const tagsRest = new TagsRest()

const Tags = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const backgroundColorRef = useRef()
  const textColorRef = useRef()
  const iconRef = useRef()
  const imageRef = useRef()
  const startDateRef = useRef()
  const endDateRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    descriptionRef.current.value = data?.description ?? ''
    backgroundColorRef.current.value = data?.background_color ?? Global.APP_COLOR_PRIMARY
    textColorRef.current.value = data?.text_color ?? '#ffffff'

    // Fechas promocionales
    startDateRef.current.value = data?.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : ''
    endDateRef.current.value = data?.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : ''

    // Para el icono (imagen pequeña que va al lado del texto)


    iconRef.image.src = data?.icon ? `/storage/images/tag/${data.icon}` : '';



    imageRef.image.src = data?.image ? `/storage/images/tag/${data.image}` : '';


    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    // Validación de fechas
    const startDate = startDateRef.current.value
    const endDate = endDateRef.current.value

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      await Swal.fire({
        title: 'Error de Validación',
        text: 'La fecha de inicio debe ser anterior a la fecha de fin',
        icon: 'error'
      })
      return
    }

    const formData = new FormData()
    formData.append('id', idRef.current.value || '')
    formData.append('name', nameRef.current.value)
    formData.append('description', descriptionRef.current.value)
    formData.append('background_color', backgroundColorRef.current.value)
    formData.append('text_color', textColorRef.current.value)
    formData.append('tag_type', 'item') // Identificador para tags de items

    // Fechas promocionales
    if (startDateRef.current.value) {
      formData.append('start_date', startDateRef.current.value)
    }
    if (endDateRef.current.value) {
      formData.append('end_date', endDateRef.current.value)
    }

    // Agregar icono (imagen pequeña) si se seleccionó una nueva
    if (iconRef.current.files && iconRef.current.files[0]) {
      formData.append('icon', iconRef.current.files[0])
    }

    // Agregar imagen principal si se seleccionó una nueva
    if (imageRef.current.files && imageRef.current.files[0]) {
      formData.append('image', imageRef.current.files[0])
    }


    // Check for image deletion flag
    if (iconRef.getDeleteFlag && iconRef.getDeleteFlag()) {
      formData.append('icon_delete', 'DELETE');
    }

    if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
      formData.append('image_delete', 'DELETE');
    }
    const result = await tagsRest.save(formData)
    if (!result) return

    // Reset delete flag after successful save
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();
    if (iconRef.resetDeleteFlag) iconRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await tagsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onMenuChange = async ({ id, value }) => {
    const result = await tagsRest.boolean({ id, field: 'menu', value })
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
    const result = await tagsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Tags de Productos' rest={tagsRest}
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
            icon: 'clock',
            text: 'Actualizar Estados',
            hint: 'Actualizar estados promocionales',
            onClick: async () => {
              const { isConfirmed } = await Swal.fire({
                title: 'Actualizar Estados Promocionales',
                text: '¿Deseas actualizar el estado de todas las etiquetas promocionales basado en sus fechas?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, actualizar',
                cancelButtonText: 'Cancelar'
              })
              if (!isConfirmed) return

              try {
                Swal.fire({
                  title: 'Actualizando...',
                  text: 'Por favor espera mientras se actualizan los estados',
                  allowOutsideClick: false,
                  didOpen: () => Swal.showLoading()
                })

                const response = await fetch('/api/admin/tags/update-promotional-status', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                  }
                })

                const result = await response.json()

                if (result.success) {
                  await Swal.fire({
                    title: '¡Actualización completada!',
                    html: `
                      <div class="text-start">
                        <p><strong>📊 Estadísticas:</strong></p>
                        <ul class="list-unstyled">
                          <li>🔄 Permanentes: ${result.data.permanent || 0}</li>
                          <li>✅ Activos: ${result.data.active || 0}</li>
                          <li>❌ Expirados: ${result.data.expired || 0}</li>
                          <li>📝 Actualizados: ${result.data.updated || 0}</li>
                        </ul>
                      </div>
                    `,
                    icon: 'success'
                  })
                  $(gridRef.current).dxDataGrid('instance').refresh()
                } else {
                  throw new Error(result.message || 'Error al actualizar estados')
                }
              } catch (error) {
                Swal.fire({
                  title: 'Error',
                  text: error.message || 'No se pudieron actualizar los estados',
                  icon: 'error'
                })
              }
            }
          }
        });
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'plus',
            text: 'Nuevo Tag de Producto',
            hint: 'Nuevo Tag de Producto',
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
        Fillable.has('tags', 'name') && {
          dataField: 'name',
          caption: 'Etiqueta',
          width: '25%',
        },
        Fillable.has('tags', 'description') && {
          dataField: 'description',
          caption: 'ToolTip',
          width: '20%',
        },
        Fillable.has('tags', 'promotional_status') && {
          dataField: 'promotional_status',
          caption: 'Estado Promocional',
          width: '15%',
          allowSorting: true,
          allowFiltering: true,
          cellTemplate: (container, { data }) => {
            $(container).empty()

            const statusConfig = {
              'permanent': {
                text: 'Permanente',
                class: 'success',
                icon: 'fas fa-infinity'
              },
              'active': {
                text: 'Activo',
                class: 'primary',
                icon: 'fas fa-play-circle'
              },
              'expired': {
                text: 'Expirado',
                class: 'danger',
                icon: 'fas fa-stop-circle'
              }
            }

            const config = statusConfig[data.promotional_status] || {
              text: 'Desconocido',
              class: 'secondary',
              icon: 'fas fa-question-circle'
            }

            const content = (
              <span className={`badge bg-${config.class} d-flex align-items-center gap-1`} style={{ fontSize: '11px' }}>
                <i className={config.icon}></i>
                {config.text}
              </span>
            )
            ReactAppend(container, content)
          }
        },
        Fillable.has('tags', 'menu') &&
        {
          dataField: 'preview',
          caption: 'Vista Previa',
          width: '20%',
          allowSorting: false,
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            $(container).empty()
            const tagStyle = {
              backgroundColor: data.background_color || '#3b82f6',
              color: data.text_color || '#ffffff',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              maxWidth: '150px'
            }

            const content = (
              <div>
                <span style={tagStyle}>
                  {data.icon && <img src={`/storage/images/tag/${data.icon}`} style={{ width: '16px', height: '16px', borderRadius: '2px' }} alt="icon" onError={(e) =>
                  (e.target.src =
                    "/api/cover/thumbnail/null")
                  } />}
                  <span>{data.name}</span>
                </span>
                {/* Mostrar fechas si es promocional */}
           {Fillable.has('tags', 'start_date') && Fillable.has('tags', 'end_date') && 
                 (data.start_date || data.end_date) && (
                  <div style={{ fontSize: '10px', color: '#6c757d', marginTop: '2px' }}>
                    {data.start_date && (
                      <div>📅 Inicio: {new Date(data.start_date).toLocaleDateString()}</div>
                    )}
                    {data.end_date && (
                      <div>🏁 Fin: {new Date(data.end_date).toLocaleDateString()}</div>
                    )}
                  </div>
                )}
             
              </div>
            )
            ReactAppend(container, content)
          }
        },

        Fillable.has('tags', 'image') && {
          dataField: 'image',
          caption: 'Imagen Principal',
          width: '15%',
          allowSorting: false,
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            $(container).empty()
            if (data.image) {
              const content = (
                <img
                  src={`/storage/images/tag/${data.image}`}
                  style={{
                    width: '40px',
                    height: '24px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  alt="imagen principal"
                />
              )
              ReactAppend(container, content)
            } else {
              container.text('Sin imagen')
            }
          }
        },
        Fillable.has('tags', 'menu') && {
          dataField: 'menu',
          caption: 'Menú',
          dataType: 'boolean',
          cellTemplate: (container, { data }) => {
            $(container).empty()
            ReactAppend(container, <SwitchFormGroup checked={data.menu == 1} onChange={() => onMenuChange({
              id: data.id,
              value: !data.menu
            })} />)
          }
        },
        Fillable.has('tags', 'visible') && {
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar Tag de Producto' : 'Agregar Tag de Producto'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='tags-container'>
        <input ref={idRef} type='hidden' />

        <div className='row'>
          <div className='col-md-8'>
            <InputFormGroup eRef={nameRef} label='Nombre del Tag' col='col-12' required hidden={!Fillable.has('tags', 'name')} />

            <InputFormGroup eRef={descriptionRef} label='ToolTip' col='col-12' hidden={!Fillable.has('tags', 'description')} />
          </div>
          <ImageFormGroup eRef={iconRef} name="icon" label='Icono' col='col-md-4' aspect='6/5' hidden={!Fillable.has('tags', 'icon')} />

        </div>
        {/* Sección de Fechas Promocionales */}
        {Fillable.has('tags', 'start_date') && Fillable.has('tags', 'end_date') && (
          <div className="col-12">
            <div className="alert alert-info mb-3">
              <h6 className="alert-heading mb-2">
                <i className="fas fa-calendar-alt me-2"></i>
                Configuración Promocional
              </h6>
              <div className="row small">
                <div className="col-md-6">
                  <p className="mb-1"><strong>🔄 Etiquetas Permanentes:</strong></p>
                  <p className="mb-2">Sin fechas → Siempre visibles</p>
                  <p className="mb-1"><strong>📅 Etiquetas Promocionales:</strong></p>
                  <p className="mb-0">Con fechas → Solo activas en el período especificado</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Ejemplos de uso:</strong></p>
                  <ul className="mb-0 small">
                    <li>Black Friday: 29/11/2024 - 02/12/2024</li>
                    <li>Cyber Monday: 02/12/2024 - 03/12/2024</li>
                    <li>Descuentos Navideños: 15/12/2024 - 25/12/2024</li>
                    <li>Ofertas de Año Nuevo: 26/12/2024 - 05/01/2025</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>)}

        <div className='col-md-6' hidden={!Fillable.has('tags', 'start_date')}>
          <div className="form-group mb-2">
            <label className="form-label">
              <i className="fas fa-play-circle text-success me-1"></i>
              Fecha y Hora de Inicio
            </label>
            <input
              ref={startDateRef}
              type="datetime-local"
              className="form-control"
              placeholder="Opcional: Fecha de inicio de la promoción"
            />
            <small className="text-muted">Opcional: Deja vacío para etiqueta permanente</small>
          </div>
        </div>

        <div className='col-md-6' hidden={!Fillable.has('tags', 'end_date')}>
          <div className="form-group mb-2">
            <label className="form-label">
              <i className="fas fa-stop-circle text-danger me-1"></i>
              Fecha y Hora de Fin
            </label>
            <input
              ref={endDateRef}
              type="datetime-local"
              className="form-control"
              placeholder="Opcional: Fecha de fin de la promoción"
            />
            <small className="text-muted">Opcional: Deja vacío para etiqueta permanente</small>
          </div>
        </div>

      <div className='row col-md-6'>
          <div className='col-md-6' hidden={!Fillable.has('tags', 'background_color')}>
          <div className="form-group mb-2">
            <label className="form-label">Color de Fondo</label>
            <input ref={backgroundColorRef} type="color" className="form-control form-control-color" defaultValue="#3b82f6" />
          </div>
        </div>

        <div className='col-md-6' hidden={!Fillable.has('tags', 'text_color')}>
          <div className="form-group mb-2">
            <label className="form-label">Color de Texto</label>
            <input ref={textColorRef} type="color" className="form-control form-control-color" defaultValue="#ffffff" />
          </div>
        </div>
      </div>


        <ImageFormGroup eRef={imageRef} name="image" label='Imagen Principal (para otros fines)' col='col-md-6' aspect='16/9' hidden={!Fillable.has('tags', 'image')} />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Tags de Productos'>
    <Tags {...properties} />
  </BaseAdminto>);
})