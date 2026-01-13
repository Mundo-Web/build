import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import Swal from 'sweetalert2';
import AdsRest from '../Actions/Admin/AdsRest';
import { renderToString } from 'react-dom/server';
import TextareaFormGroup from '../Components/Adminto/form/TextareaFormGroup';
import Modal from '../Components/Adminto/Modal';

const adsRest = new AdsRest();

const Ads = ({ }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()
  const dateBeginRef = useRef()
  const dateEndRef = useRef()
  const secondsRef = useRef()
  const linkRef = useRef()
  const buttonTextRef = useRef()
  const invasivoRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    // Reset delete flag when opening modal
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    descriptionRef.current.value = data?.description ?? ''
    imageRef.image.src = `/api/ads/media/${data?.image}`
    imageRef.current.value = null
    dateBeginRef.current.value = data?.date_begin ?? ''
    dateEndRef.current.value = data?.date_end ?? ''
    secondsRef.current.value = data?.seconds ?? 0
    linkRef.current.value = data?.link ?? ''
    buttonTextRef.current.value = data?.button_text ?? 'Ver más'
    if (data?.invasivo) {
      $(invasivoRef.current).prop('checked', false).trigger('click')
    } else {
      $(invasivoRef.current).prop('checked', true).trigger('click')
    }
    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      date_begin: dateBeginRef.current.value,
      date_end: dateEndRef.current.value,
      seconds: secondsRef.current.value || 0,
      link: linkRef.current.value,
      button_text: buttonTextRef.current.value || 'Ver más',
      invasivo: invasivoRef.current.checked ? 1 : 0
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }
    const file = imageRef.current.files[0]
    if (file) {
      formData.append('image', file)
    }

    // Check for image deletion flag
    if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
      formData.append('image_delete', 'DELETE');
    }

    const result = await adsRest.save(formData)
    if (!result) return

    // Reset delete flag after successful save
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await adsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar anuncio',
      text: '¿Estás seguro de eliminar este anuncio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await adsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Anuncios' rest={adsRest}
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
            text: 'Nuevo anuncio',
            hint: 'Nuevo anuncio',
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
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <div className="d-flex align-items-center justify-content-center">
                <img 
                  src={`/api/ads/media/${data.image}`} 
                  style={{ 
                    width: '80px', 
                    height: '80px',
                    objectFit: 'cover', 
                    objectPosition: 'center', 
                   
                   
                  }} 
                />
              </div>
            )
          }
        },
        {
          dataField: 'name',
          caption: 'Contenido',
          width: '35%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, (data.name || data.description)
              ? <div style={{ width: '100%' }}>
                <p className='mb-1 font-weight-bold' style={{ fontSize: '14px' }}>{data.name}</p>
                <p className='mb-0 text-muted' style={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}>{data.description}</p>
              </div>
              : <span className='text-muted font-italic'>- Sin contenido -</span>
            )
          }
        },
        {
          dataField: 'date_begin',
          caption: 'Configuración',
          width: '25%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <div className="small">
                <div className="d-flex align-items-center mb-1">
                  <i className="fas fa-calendar-alt text-primary mr-2" style={{ width: '14px' }}></i>
                  {(data.date_begin && data.date_end)
                    ? <span>{moment(data.date_begin).format('DD/MM')} - {moment(data.date_end).format('DD/MM/YY')}</span>
                    : <span className="text-success">Siempre visible</span>
                  }
                </div>
                <div className="d-flex align-items-center mb-1">
                  <i className="fas fa-clock text-info mr-2" style={{ width: '14px' }}></i>
                  <span>{data.seconds > 0 ? `${data.seconds}s de delay` : 'Sin delay'}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className={`fas fa-${data.invasivo ? 'exclamation-triangle text-warning' : 'check-circle text-success'} mr-2`} style={{ width: '14px' }}></i>
                  <span>{data.invasivo ? 'Invasivo' : 'Normal'}</span>
                </div>
              </div>
            )
          }
        },
        {
          dataField: 'link',
          caption: 'Enlace',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, data.link 
              ? <div>
                  <a href={data.link} target="_blank" rel="noopener noreferrer" className="text-primary d-block text-truncate" style={{ maxWidth: '200px' }}>
                    <i className="fas fa-external-link-alt mr-1"></i>
                    {data.link}
                  </a>
                  {data.button_text && (
                    <small className="text-muted">
                      <i className="fas fa-mouse-pointer mr-1"></i>
                      "{data.button_text}"
                    </small>
                  )}
                </div>
              : <span className='text-muted font-italic'>- Sin enlace -</span>
            )
          }
        },
        {
          dataField: 'visible',
          caption: 'Visible',
          dataType: 'boolean',
          width: '90px',
          alignment: 'center',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <SwitchFormGroup checked={data.visible} onChange={(e) => onVisibleChange({ id: data.id, value: e.target.checked })} />)
          }
        },
        {
          caption: 'Acciones',
          width: '100px',
          alignment: 'center',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset')
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary mr-1',
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar anuncio' : 'Nuevo anuncio'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='principal-container'>
        <input ref={idRef} type='hidden' />
        
        {/* Columna izquierda - Imagen */}
        <div className="col-md-5">
          <ImageFormGroup 
            eRef={imageRef} 
            name="image" 
            label='Imagen del anuncio' 
            col='col-12' 
            aspect={4/5} 
            fit='cover' 
            required 
          />
          <div className="alert alert-light border small mt-2">
            <i className="fas fa-info-circle text-info mr-1"></i>
            Tamaño recomendado: 800x1000px (4:5)
          </div>
        </div>
        
        {/* Columna derecha - Contenido */}
        <div className="col-md-7">
          {/* Contenido del anuncio */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-light py-2">
              <h6 className="mb-0"><i className="fas fa-align-left mr-2"></i>Contenido</h6>
            </div>
            <div className="card-body py-3">
              <InputFormGroup eRef={nameRef} label='Título' placeholder="Ej: ¡Gran Oferta!" />
              <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={3} placeholder="Descripción del anuncio..." />
            </div>
          </div>
          
          {/* Enlace y botón */}
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-light py-2">
              <h6 className="mb-0"><i className="fas fa-link mr-2"></i>Enlace</h6>
            </div>
            <div className="card-body py-3">
              <div className="row">
                <div className="col-md-7">
                  <InputFormGroup eRef={linkRef} label='URL de destino' placeholder="https://ejemplo.com/oferta" />
                </div>
                <div className="col-md-5">
                  <InputFormGroup eRef={buttonTextRef} label='Texto del botón' placeholder="Ver más" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Configuración de visualización */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light py-2">
              <h6 className="mb-0"><i className="fas fa-cog mr-2"></i>Configuración</h6>
            </div>
            <div className="card-body py-3">
              <div className="row">
                <div className="col-md-6">
                  <InputFormGroup eRef={dateBeginRef} label='Mostrar desde' type='date' />
                </div>
                <div className="col-md-6">
                  <InputFormGroup eRef={dateEndRef} label='Mostrar hasta' type='date' />
                </div>
              </div>
              <InputFormGroup eRef={secondsRef} label='Delay de aparición (segundos)' type='number' col='col-12' placeholder="0 = aparece inmediatamente" />
              <div className="mt-2">
                <SwitchFormGroup eRef={invasivoRef} label='Anuncio invasivo' specification='No se puede cerrar haciendo clic fuera del modal' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Pop-ups'>
    <Ads {...properties} />
  </BaseAdminto>);
})