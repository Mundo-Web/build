import BaseAdminto from '@Adminto/Base';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import TextareaFormGroup from '@Adminto/form/TextareaFormGroup';
import ImageFormGroup from '@Adminto/form/ImageFormGroup';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import PostTagsRest from '../Actions/Admin/PostTagsRest';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Global from '../Utils/Global';
import Fillable from '../Utils/Fillable';

const postTagsRest = new PostTagsRest()

const PostTags = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
 // const backgroundColorRef = useRef()
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
    //backgroundColorRef.current.value = data?.background_color ?? Global.APP_COLOR_PRIMARY
    //textColorRef.current.value = data?.text_color ?? '#ffffff'

    // Fechas promocionales
    //startDateRef.current.value = data?.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : ''
    //endDateRef.current.value = data?.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : ''

    //iconRef.image.src = `/storage/images/tag/${data?.icon ?? "undefined"}`;
   // imageRef.image.src = `/storage/images/tag/${data?.image ?? "undefined"}`;

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    // Validación de fechas
   // const startDate = startDateRef.current.value
   // const endDate = endDateRef.current.value

  /*  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      await Swal.fire({
        title: 'Error de Validación',
        text: 'La fecha de inicio debe ser anterior a la fecha de fin',
        icon: 'error'
      })
      return
    } */

    const formData = new FormData()
    formData.append('id', idRef.current.value || '')
    formData.append('name', nameRef.current.value)
    formData.append('description', descriptionRef.current.value)
    formData.append('tag_type', 'post')
   // formData.append('background_color', backgroundColorRef.current.value)
    //formData.append('text_color', textColorRef.current.value)
    //formData.append('tag_type', 'post') // Identificador para tags de posts

    // Fechas promocionales
  /*  if (startDateRef.current.value) {
      formData.append('start_date', startDateRef.current.value)
    }
    if (endDateRef.current.value) {
      formData.append('end_date', endDateRef.current.value)
    } */

    // Agregar icono si se seleccionó una nueva
 /*   if (iconRef.current.files && iconRef.current.files[0]) {
      formData.append('icon', iconRef.current.files[0])
    } */

    // Agregar imagen principal si se seleccionó una nueva
    /*if (imageRef.current.files && imageRef.current.files[0]) {
      formData.append('image', imageRef.current.files[0])
    } */

    const result = await postTagsRest.save(formData)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await postTagsRest.boolean({ id, field: 'visible', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar tag de post',
      text: '¿Estás seguro de eliminar este tag de post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await postTagsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Tags de Posts' rest={postTagsRest}
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
            text: 'Nuevo Tag de Post',
            hint: 'Nuevo Tag de Post',
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
          caption: 'Tag',
          width: '25%',
        },
        Fillable.has('tags', 'description') && {
          dataField: 'description',
          caption: 'Descripción',
          width: '25%',
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar Tag de Post' : 'Agregar Tag de Post'} onSubmit={onModalSubmit} size='sm'>
      <div className='row' id='post-tags-container'>
        <input ref={idRef} type='hidden' />

       

        <InputFormGroup eRef={nameRef} label='Nombre del Tag' col='col-12' required hidden={!Fillable.has('tags', 'name')} />

        <TextareaFormGroup eRef={descriptionRef} label='Descripción' col='col-12' rows={2} hidden={!Fillable.has('tags', 'description')} />



        {/*
        
        <div className='col-md-6' hidden={!Fillable.has('tags', 'start_date')}>
          <div className="form-group mb-2">
            <label className="form-label">
              <i className="fas fa-play-circle text-success me-1"></i>
              Fecha de Inicio
            </label>
            <input
              ref={startDateRef}
              type="datetime-local"
              className="form-control"
              placeholder="Opcional: Fecha de inicio"
            />
            <small className="text-muted">Opcional: Para tags temporales</small>
          </div>
        </div>

        <div className='col-md-6' hidden={!Fillable.has('tags', 'end_date')}>
          <div className="form-group mb-2">
            <label className="form-label">
              <i className="fas fa-stop-circle text-danger me-1"></i>
              Fecha de Fin
            </label>
            <input
              ref={endDateRef}
              type="datetime-local"
              className="form-control"
              placeholder="Opcional: Fecha de fin"
            />
            <small className="text-muted">Opcional: Para tags temporales</small>
          </div>
        </div>
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
     <ImageFormGroup eRef={iconRef} name="icon" label='Icono del Tag' col='col-md-6' aspect='1/1' hidden={!Fillable.has('tags', 'icon')} />

        <ImageFormGroup eRef={imageRef} name="image" label='Imagen Representativa' col='col-md-6' aspect='16/9' hidden={!Fillable.has('tags', 'image')} />
 */}
     
   
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Tags de Posts'>
    <PostTags {...properties} />
  </BaseAdminto>);
})