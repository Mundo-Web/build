import BaseAdminto from '@Adminto/Base';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import PostsRest from '../Actions/Admin/PostsRest';
import BasicEditing from '../Components/Adminto/Basic/BasicEditing';
import ImageFormGroup from '../Components/Adminto/form/ImageFormGroup';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import QuillFormGroup from '../Components/Adminto/form/QuillFormGroup';
import SelectAPIFormGroup from '../Components/Adminto/form/SelectAPIFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import html2string from '../Utils/html2string';
import ReactAppend from '../Utils/ReactAppend';
import SetSelectValue from '../Utils/SetSelectValue';

const postsRest = new PostsRest()

const Posts = ({ details }) => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const categoryRef = useRef()
  const descriptionRef = useRef()
  const tagsRef = useRef()
  const imageRef = useRef()
  const postDateRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    // Reset delete flag when opening modal
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    SetSelectValue(categoryRef.current, data?.category?.id, data?.category?.name);
    descriptionRef.editor.root.innerHTML = data?.description ?? ''
    imageRef.image.src = data?.image ? `/storage/images/post/${data.image}` : ''
    imageRef.current.value = null
    SetSelectValue(tagsRef.current, data?.tags ?? [], 'id', 'name')
    postDateRef.current.value = data?.post_date ?? moment().format('YYYY-MM-DD')

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      category_id: categoryRef.current.value,
      summary: html2string(descriptionRef.current.value),
      description: descriptionRef.current.value,
      tags: $(tagsRef.current).val(),
      post_date: postDateRef.current.value
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

    const result = await postsRest.save(formData)
    if (!result) return

    // Reset delete flag after successful save
    if (imageRef.resetDeleteFlag) imageRef.resetDeleteFlag();

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onVisibleChange = async ({ id, value }) => {
    const result = await postsRest.boolean({ id, field: 'visible', value })
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
    const result = await postsRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title={<BasicEditing correlative='blog' details={details} />} rest={postsRest}
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
          dataField: 'category.name',
          caption: 'Categoría',
        },
        {
          dataField: 'name',
          caption: 'Título',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <>
              {data.name}<br />
              {data.tags?.map((tag, index) => <span key={index} className='badge badge-soft-success me-1'>{tag.name}</span>)}
            </>)
          }
        },
        {
          dataField: 'image',
          caption: 'Imagen',
          width: '90px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={`/storage/images/post/${data.image}`} style={{ width: '80px', height: '48px', objectFit: 'cover', objectPosition: 'center', borderRadius: '4px' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        {
          caption: 'Acciones',
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar post' : 'Agregar post'} onSubmit={onModalSubmit} size='md'>
      <div className='row' id='posts-container'>
        <input ref={idRef} type='hidden' />

        <ImageFormGroup eRef={imageRef} name="image" label='Imagen' />
        <SelectAPIFormGroup eRef={categoryRef} searchAPI='/api/admin/blog-categories/paginate' searchBy='name' label='Categoría' required dropdownParent='#posts-container' />
        <InputFormGroup eRef={nameRef} label='Título' rows={2} required />
        <QuillFormGroup eRef={descriptionRef} label='Contenido' />
        {/* <TextareaFormGroup eRef={tagsRef} label='Tags (Separado por comas)' rows={1} /> */}
        <SelectAPIFormGroup id='tags' eRef={tagsRef} searchAPI={'/api/admin/post-tags/paginate'} searchBy='name' label='Tags' dropdownParent='#posts-container' tags multiple />
        <InputFormGroup eRef={postDateRef} label='Fecha de publicación' type='date' required />
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {

  createRoot(el).render(<BaseAdminto {...properties} title='Posts'>
    <Posts {...properties} />
  </BaseAdminto>);
})