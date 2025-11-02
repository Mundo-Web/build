import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import SlidersRest from '../Actions/Admin/SlidersRest';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import getYTVideoId from '../Utils/getYTVideoId';
import Fillable from '../Utils/Fillable';

const slidersRest = new SlidersRest()

const Sliders = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const subtitleRef = useRef()
  const descriptionRef = useRef()
  const imageRef = useRef()
  const bgImageRef = useRef()
  const bgImageMobileRef = useRef()
  const bgVideoRef = useRef()
  const buttonTextRef = useRef()
  const buttonLinkRef = useRef()
  const secondaryButtonTextRef = useRef()
  const secondaryButtonLinkRef = useRef()
  const titleColorRef = useRef()
  const descriptionColorRef = useRef()

  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('image')
  const [activeFormTab, setActiveFormTab] = useState('content')
  const [iframeSrc, setIframeSrc] = useState('')

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    subtitleRef.current.value = data?.subtitle ?? ''
    descriptionRef.current.value = data?.description ?? ''
    setActiveTab(data?.bg_type ?? 'image')
    setActiveFormTab('content')
    setIframeSrc(data?.bg_video ?? '')
    imageRef.current.value = null
    imageRef.image.src = data?.image ? `/storage/images/slider/${data.image}` : ''
    bgImageRef.current.value = null
    bgImageRef.image.src = data?.bg_image ? `/storage/images/slider/${data.bg_image}` : ''
    bgImageMobileRef.current.value = null
    bgImageMobileRef.image.src = data?.bg_image_mobile ? `/storage/images/slider/${data.bg_image_mobile}` : ''
    bgVideoRef.current.value = data?.bg_video ? `https://youtu.be/${data.bg_video}` : ''
    buttonTextRef.current.value = data?.button_text ?? ''
    buttonLinkRef.current.value = data?.button_link ?? ''
    secondaryButtonTextRef.current.value = data?.secondary_button_text ?? ''
    secondaryButtonLinkRef.current.value = data?.secondary_button_link ?? ''
    titleColorRef.current.value = data?.title_color ?? '#000000'
    descriptionColorRef.current.value = data?.description_color ?? '#000000'

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      subtitle: subtitleRef.current.value,
      description: descriptionRef.current.value,
      button_text: buttonTextRef.current.value,
      button_link: buttonLinkRef.current.value,
      secondary_button_text: secondaryButtonTextRef.current.value,
      secondary_button_link: secondaryButtonLinkRef.current.value,
      title_color: titleColorRef.current.value,
      description_color: descriptionColorRef.current.value,
      bg_type: activeTab,
      bg_video: activeTab == 'video' ? iframeSrc : null
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }

    if (activeTab == 'image') {
      const file = bgImageRef.current.files[0]
      if (file) {
        formData.append('bg_image', file)
      }

      const mobileFile = bgImageMobileRef.current.files[0]
      if (mobileFile) {
        formData.append('bg_image_mobile', mobileFile)
      }

      const image = imageRef.current.files[0]
      if (image) {
        formData.append('image', image)
      }
    } else {
      formData.append('bg_image', null)
      formData.append('bg_image_mobile', null)
    }

      // Check for image deletion flags
    if (bgImageRef.getDeleteFlag && bgImageRef.getDeleteFlag()) {
        formData.append('bg_image_delete', 'DELETE');
    }
    if (bgImageMobileRef.getDeleteFlag && bgImageMobileRef.getDeleteFlag()) {
        formData.append('bg_image_mobile_delete', 'DELETE');
    }
    if (imageRef.getDeleteFlag && imageRef.getDeleteFlag()) {
        formData.append('image_delete', 'DELETE');
    }

    const result = await slidersRest.save(formData)
    if (!result) return


    if (bgImageRef.resetDeleteFlag) bgImageRef.resetDeleteFlag();
    if (bgImageMobileRef.resetDeleteFlag) bgImageMobileRef.resetDeleteFlag();
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();


    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onStatusChange = async ({ id, status }) => {
    const result = await slidersRest.status({ id, status })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await slidersRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar slider',
      text: '¿Estas seguro de eliminar este slider?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await slidersRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  // Función para manejar el reordering remoto
  const onReorder = async (e) => {
    // e.toIndex es la nueva posición donde se quiere insertar el elemento
    const newOrderIndex = e.toIndex
    
    try {
      const result = await slidersRest.reorder(e.itemData.id, newOrderIndex)
      if (result) {
        await e.component.refresh()
      }
    } catch (error) {
      console.error('Error reordering slider:', error)
    }
  }

  return (<>
    <Table gridRef={gridRef} title='Sliders' rest={slidersRest}
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
            text: 'Nuevo slider',
            hint: 'Nuevo slider',
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
        Fillable.has('sliders', 'name') && {

          dataField: 'name',
          caption: 'Titulo',
          width: '75%',

        },
        Fillable.has('sliders', 'bg_image') &&
        {
          dataField: 'bg_image',
          caption: 'Imagen',
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={data.bg_type == 'image' ? `/storage/images/slider/${data.bg_image}` : `//img.youtube.com/vi/${data.bg_video}/mqdefault.jpg`}
              style={{
                width: '80px', height: '48px',
                objectFit: 'cover', objectPosition: 'center',
                borderRadius: '4px'
              }}
              onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
          Fillable.has('sliders', 'bg_image_mobile') &&
        {
          dataField: 'bg_image_mobile',
          caption: 'Imagen Mobile',
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={data.bg_type == 'image' ? `/storage/images/slider/${data.bg_image_mobile}` : `//img.youtube.com/vi/${data.bg_video}/mqdefault.jpg`}
              style={{
                width: '80px', height: '48px',
                objectFit: 'cover', objectPosition: 'center',
                borderRadius: '4px'
              }}
              onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        Fillable.has('sliders', 'image') &&
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '90px',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={data.bg_type == 'image' ? `/storage/images/slider/${data.image}` : `//img.youtube.com/vi/${data.bg_video}/mqdefault.jpg`}
              style={{
                width: '80px', height: '48px',
                objectFit: 'cover', objectPosition: 'center',
                borderRadius: '4px'
              }}
              onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        {
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
        // {
        //   dataField: 'status',
        //   caption: 'Estado',
        //   dataType: 'boolean',
        //   cellTemplate: (container, { data }) => {
        //     switch (data.status) {
        //       case 1:
        //         ReactAppend(container, <span className='badge bg-success rounded-pill'>Activo</span>)
        //         break
        //       case 0:
        //         ReactAppend(container, <span className='badge bg-danger rounded-pill'>Inactivo</span>)
        //         break
        //       default:
        //         ReactAppend(container, <span className='badge bg-dark rounded-pill'>Eliminado</span>)
        //         break
        //     }
        //   }
        // },
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar slider' : 'Agregar slider'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='sliders-container'>
        <input ref={idRef} type='hidden' />
        
        {/* Form Tabs Navigation */}
        <div className="col-12 mb-3">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <a 
                href="#form-tab-content" 
                className={`nav-link ${activeFormTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveFormTab('content')}
              >
                Contenido
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#form-tab-media" 
                className={`nav-link ${activeFormTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveFormTab('media')}
              >
                Multimedia
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#form-tab-buttons" 
                className={`nav-link ${activeFormTab === 'buttons' ? 'active' : ''}`}
                onClick={() => setActiveFormTab('buttons')}
              >
                Botones
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#form-tab-colors" 
                className={`nav-link ${activeFormTab === 'colors' ? 'active' : ''}`}
                onClick={() => setActiveFormTab('colors')}
              >
                Colores
              </a>
            </li>
          </ul>
        </div>

        {/* Content Tab */}
        <div className={`col-12 ${activeFormTab !== 'content' ? 'd-none' : ''}`}>
          <div className='row'>
            <TextareaFormGroup eRef={nameRef} label='Título principal' col='col-12' rows={2} required />
            <TextareaFormGroup eRef={subtitleRef} label='Subtítulo (aparecerá resaltado)' col='col-12' rows={2} />
            <TextareaFormGroup eRef={descriptionRef} label='Descripción' rows={3} col='col-12' />
          </div>
        </div>

        {/* Media Tab */}
        <div className={`col-12 ${activeFormTab !== 'media' ? 'd-none' : ''}`}>
          <ul hidden={!Fillable.has('sliders', 'image') || !Fillable.has('sliders', 'bg_image') || !Fillable.has('sliders', 'bg_video')} className="nav nav-pills navtab-bg nav-justified">
            <li className="nav-item">
              <a href="#tab-image" data-bs-toggle="tab" aria-expanded="false" className={`nav-link ${activeTab == 'image' && 'active'}`} onClick={() => setActiveTab('image')}>
                Imagen
              </a>
            </li>
            <li className="nav-item">
              <a href="#tab-video" data-bs-toggle="tab" aria-expanded="true" className={`nav-link ${activeTab == 'video' && 'active'}`} onClick={() => setActiveTab('video')}>
                Video
              </a>
            </li>
          </ul>
          <div className="tab-content">
            <div className={`tab-pane ${activeTab == 'image' && 'show active'}`} id="tab-image">
              <div className='row'>
                <ImageFormGroup 
                  hidden={!Fillable.has('sliders', 'bg_image')} 
                  eRef={bgImageRef} 
                  name="bg_image" 
                  aspect={Fillable.has('sliders', 'bg_image_mobile') ? '4/3' : '16/9'}
                  label='Imagen de fondo (Desktop)' 
                  col={Fillable.has('sliders', 'bg_image_mobile') ? 'col-md-8' : 'col-12'}
                />
                <ImageFormGroup 
                  hidden={!Fillable.has('sliders', 'bg_image_mobile')} 
                  eRef={bgImageMobileRef} 
                  name="bg_image_mobile" 
                  aspect='9/14'
                  label='Imagen (Mobile)' 
                  col="col-md-4"
                />
              </div>
              <ImageFormGroup hidden={!Fillable.has('sliders', 'image')} eRef={imageRef} name="image" label='Imagen' />
            </div>
            <div hidden={!Fillable.has('sliders', 'bg_video')} className={`tab-pane ${activeTab == 'video' && 'show active'}`} id="tab-video">
              <InputFormGroup eRef={bgVideoRef} label='URL (Youtube)' type='link' onChange={e => setIframeSrc(getYTVideoId(e.target.value))} />
              <iframe src={`https://www.youtube.com/embed/${iframeSrc}`} className='w-100 rounded border mb-2' style={{
                aspectRatio: 21 / 9
              }} />
            </div>
          </div>
        </div>

        {/* Buttons Tab */}
        <div className={`col-12 ${activeFormTab !== 'buttons' ? 'd-none' : ''}`}>
          <div className='row'>
            <div className='col-12 mb-3'>
              <h6 className='text-muted'>Botón Principal</h6>
            </div>
            <InputFormGroup eRef={buttonTextRef} label='Texto del botón' col='col-sm-6' required />
            <InputFormGroup eRef={buttonLinkRef} label='URL del botón' col='col-sm-6' required />
            
            <div className='col-12 mt-3 mb-3'>
              <h6 className='text-muted'>Botón Secundario</h6>
            </div>
            <InputFormGroup eRef={secondaryButtonTextRef} label='Texto del botón secundario' col='col-sm-6' />
            <InputFormGroup eRef={secondaryButtonLinkRef} label='URL del botón secundario' col='col-sm-6' />
          </div>
        </div>

        {/* Colors Tab */}
        <div className={`col-12 ${activeFormTab !== 'colors' ? 'd-none' : ''}`}>
          <div className='row'>
            <div className='col-sm-6'>
              <label className='form-label'>Color del título</label>
              <input 
                ref={titleColorRef} 
                type='color' 
                className='form-control form-control-color' 
                defaultValue='#000000'
                title='Seleccionar color del título'
              />
            </div>
            <div className='col-sm-6'>
              <label className='form-label'>Color de la descripción</label>
              <input 
                ref={descriptionColorRef} 
                type='color' 
                className='form-control form-control-color' 
                defaultValue='#000000'
                title='Seleccionar color de la descripción'
              />
            </div>
          </div>
        </div>

      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Sliders'>
    <Sliders {...properties} />
  </BaseAdminto>);
})