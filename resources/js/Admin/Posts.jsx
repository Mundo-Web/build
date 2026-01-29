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
import TextareaFormGroup from '../Components/Adminto/form/TextareaFormGroup';
import Global from '../Utils/Global';
import Fillable from '../Utils/Fillable';

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
  // SEO fields refs
  const slugRef = useRef()
  const metaTitleRef = useRef()
  const metaDescriptionRef = useRef()
  const metaKeywordsRef = useRef()
  const canonicalUrlRef = useRef()


  const [isEditing, setIsEditing] = useState(false)
  const [slugPreview, setSlugPreview] = useState('')
  const [metaTitleCount, setMetaTitleCount] = useState(0)
  const [metaDescCount, setMetaDescCount] = useState(0)


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

    // SEO fields
    slugRef.current.value = data?.slug ?? ''
    metaTitleRef.current.value = data?.meta_title ?? ''
    metaDescriptionRef.current.value = data?.meta_description ?? ''
    metaKeywordsRef.current.value = data?.meta_keywords ?? ''
    canonicalUrlRef.current.value = data?.canonical_url ?? ''

    setSlugPreview(data?.slug ?? '')
    setMetaTitleCount((data?.meta_title ?? '').length)
    setMetaDescCount((data?.meta_description ?? '').length)

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
      post_date: postDateRef.current.value,
      // SEO fields
      slug: slugRef.current.value,
      meta_title: metaTitleRef.current.value,
      meta_description: metaDescriptionRef.current.value,
      meta_keywords: metaKeywordsRef.current.value,
      canonical_url: canonicalUrlRef.current.value
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
  const handleSlugChange = (e) => {
    const value = e.target.value
    setSlugPreview(value)
    // Actualizar el campo canonical_url automáticamente
    if (canonicalUrlRef.current) {
      canonicalUrlRef.current.value = `${Global.APP_URL}/post/${value}`
    }
  }

  const handleMetaTitleChange = (e) => {
    const value = e.target.value
    setMetaTitleCount(value.length)
  }

  const handleMetaDescChange = (e) => {
    const value = e.target.value
    setMetaDescCount(value.length)
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


  // Helper para saber si un campo es requerido
  const isRequired = (key) => Fillable.has('posts', key) && Fillable.get('posts', key)?.required;

  return (
    <>
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

      <Modal modalRef={modalRef} title={isEditing ? 'Editar post' : 'Agregar post'} onSubmit={onModalSubmit} size='xl'>
        <input ref={idRef} type='hidden' />
        <div id='posts-container'>
          <ul className="nav nav-pills nav-justified mb-4" role="tablist" style={{backgroundColor:'#f8f9fa',borderRadius:'8px',padding:'4px',border:'1px solid #e9ecef'}}>
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="basic-info-tab" data-bs-toggle="pill" data-bs-target="#basic-info" type="button" role="tab" aria-controls="basic-info" aria-selected="true" style={{borderRadius:'6px',fontWeight:'500',transition:'all 0.3s ease'}}>
                <i className="fas fa-info-circle me-2"></i>
                Información Básica
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="contenido-tab" data-bs-toggle="pill" data-bs-target="#contenido" type="button" role="tab" aria-controls="contenido" aria-selected="false" style={{borderRadius:'6px',fontWeight:'500',transition:'all 0.3s ease'}}>
                <i className="fas fa-align-left me-2"></i>
                Contenido
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="multimedia-tab" data-bs-toggle="pill" data-bs-target="#multimedia" type="button" role="tab" aria-controls="multimedia" aria-selected="false" style={{borderRadius:'6px',fontWeight:'500',transition:'all 0.3s ease'}}>
                <i className="fas fa-images me-2"></i>
                Multimedia
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="seo-tab" data-bs-toggle="pill" data-bs-target="#seo" type="button" role="tab" aria-controls="seo" aria-selected="false" style={{borderRadius:'6px',fontWeight:'500',transition:'all 0.3s ease'}}>
                <i className="fas fa-search me-2"></i>
                SEO
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
              <div className="row g-3">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-tag me-2 text-primary"></i>
                        Identificación
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Fillable.has('posts','name') && (
                          <div className="col-md-12">
                            <InputFormGroup eRef={nameRef} label="Título del Post" placeholder="Ej: Cómo mejorar tu SEO" required={isRequired('name')} />
                          </div>
                        )}
                         {Fillable.has('posts','post_date') && (
                          <div className="col-md-6">
                            <InputFormGroup eRef={postDateRef} label='Fecha de publicación' type='date' required={isRequired('post_date')} />
                          </div>
                        )}
                        {Fillable.has('posts','category_id') && (
                          <div className="col-md-6">
                            <SelectAPIFormGroup eRef={categoryRef} searchAPI='/api/admin/blog-categories/paginate' searchBy='name' label='Categoría' required={isRequired('category_id')} dropdownParent='#posts-container' />
                          </div>
                        )}
                        {Fillable.has('posts','summary') && (
                          <div className="col-12">
                            <TextareaFormGroup eRef={descriptionRef} label="Resumen" rows={2} placeholder="Resumen breve del post..." required={isRequired('summary')} />
                          </div>
                        )}
                         {/* Tags siempre visibles */}
                         
                        {Fillable.has('posts','is_tags') && (
                          <div className="col-md-12">
                            <SelectAPIFormGroup id='tags' eRef={tagsRef} searchAPI={'/api/admin/post-tags/paginate'} searchBy='name' label='Tags' dropdownParent='#posts-container' tags multiple />
                          </div>
                        )}
                        
                      
                       
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="contenido" role="tabpanel" aria-labelledby="contenido-tab">
              <div className="row g-3">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-align-left me-2 text-primary"></i>
                        Contenido del Post
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Fillable.has('posts','description') && (
                          <div className="col-12">
                            <QuillFormGroup eRef={descriptionRef} label='Contenido' required={isRequired('description')} height='1000px' />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="multimedia" role="tabpanel" aria-labelledby="multimedia-tab">
              <div className="row g-3">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-images me-2 text-success"></i>
                        Imágenes
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {Fillable.has('posts','image') && (
                          <div className="col-md-12">
                            <ImageFormGroup eRef={imageRef} name="image" label='Imagen' col="col-12" aspect='16/9' />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-pane fade" id="seo" role="tabpanel" aria-labelledby="seo-tab">
              <div className="row g-3">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-light">
                      <h6 className="mb-0">
                        <i className="fas fa-search me-2 text-info"></i>
                        Configuración SEO
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        {Fillable.has('posts','slug') && (
                          <div className="col-md-12">
                            <InputFormGroup
                              eRef={slugRef}
                              label={<><i className="fas fa-link me-1"></i>Slug (URL amigable)</>}
                              placeholder="mi-post-ejemplo"
                              onChange={handleSlugChange}
                              required={isRequired('slug')}
                            />
                            <small className='text-muted d-block mt-1'>
                              <i className="fas fa-globe me-1"></i>
                              Vista previa: <span className='text-primary'>{Global.APP_URL}/post/{slugPreview || 'slug-del-post'}</span>
                            </small>
                          </div>
                        )}
                        {Fillable.has('posts','meta_title') && (
                          <div className="col-md-12">
                            <InputFormGroup
                              eRef={metaTitleRef}
                              label={<><i className="fas fa-heading me-1"></i>Meta Title (SEO)<span className={`badge ms-2 ${metaTitleCount > 60 ? 'bg-danger' : 'bg-info'}`}>{metaTitleCount}/60</span></>}
                              placeholder="Título optimizado para buscadores"
                              maxLength={60}
                              onChange={handleMetaTitleChange}
                              required={isRequired('meta_title')}
                            />
                            <small className='text-muted'>Máximo 60 caracteres. Se auto-completa si se deja vacío.</small>
                          </div>
                        )}
                        {Fillable.has('posts','meta_description') && (
                          <div className="col-12">
                            <TextareaFormGroup
                              eRef={metaDescriptionRef}
                              label={<><i className="fas fa-align-left me-1"></i>Meta Description (SEO)<span className={`badge ms-2 ${metaDescCount > 160 ? 'bg-danger' : 'bg-info'}`}>{metaDescCount}/160</span></>}
                              rows={3}
                              placeholder="Descripción breve del post para buscadores"
                              maxLength={160}
                              onChange={handleMetaDescChange}
                              required={isRequired('meta_description')}
                            />
                            <small className='text-muted'>Máximo 160 caracteres. Se auto-completa si se deja vacío.</small>
                          </div>
                        )}
                        {Fillable.has('posts','meta_keywords') && (
                          <div className="col-md-12">
                            <InputFormGroup
                              eRef={metaKeywordsRef}
                              label={<><i className="fas fa-tags me-1"></i>Meta Keywords</>}
                              placeholder="palabra1, palabra2, palabra3"
                              required={isRequired('meta_keywords')}
                            />
                            <small className='text-muted d-block mt-n2 mb-2'>Separadas por comas</small>
                          </div>
                        )}
                        {Fillable.has('posts','canonical_url') && (
                          <div className="col-md-12">
                            <InputFormGroup
                              eRef={canonicalUrlRef}
                              label={<><i className="fas fa-external-link-alt me-1"></i>URL Canónica</>}
                              placeholder="Se genera automáticamente"
                              readOnly
                              required={isRequired('canonical_url')}
                            />
                            <small className='text-muted'>Se genera automáticamente desde el slug</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    
    </Modal>
  </> // Cierre del fragmento
  ); // Cierre del return
} // Cierre del componente

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Posts'>
    <Posts {...properties} />
  </BaseAdminto>);
});