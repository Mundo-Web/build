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

const indicatorsRest = new IndicatorsRest()

const Indicators = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const symbolRef = useRef()
  const nameRef = useRef()
  const descriptionRef = useRef()
  const buttonTextRef = useRef()
  const buttonLinkRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    // Reset delete flag when opening modal
    if (symbolRef.resetDeleteFlag) symbolRef.resetDeleteFlag();

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    descriptionRef.current.value = data?.description ?? ''
    buttonTextRef.current.value = data?.button_text ?? ''
    buttonLinkRef.current.value = data?.button_link ?? ''

    symbolRef.current.value = null
    symbolRef.image.src = data?.symbol ? `/storage/images/indicator/${data.symbol}` : ''

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      button_text: buttonTextRef.current.value,
      button_link: buttonLinkRef.current.value,
    }

    const formData = new FormData()
    for (const key in request) {
      formData.append(key, request[key])
    }

    const symbol = symbolRef.current.files[0]
    if (symbol) {
      formData.append('symbol', symbol)
    }

    // Check for image deletion flag
    if (symbolRef.getDeleteFlag && symbolRef.getDeleteFlag()) {
      formData.append('symbol_delete', 'DELETE');
    }

    const result = await indicatorsRest.save(formData)
    if (!result) return

    // Reset delete flag after successful save
    if (symbolRef.resetDeleteFlag) symbolRef.resetDeleteFlag();

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
        {
          dataField: 'symbol',
          caption: 'Símbolo',
          width: 100,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, <img src={`/storage/images/indicator/${data.symbol}`} style={{ width: '60px', height: '60px', objectFit: 'contain', objectPosition: 'center', borderRadius: '4px' }} onError={e => e.target.src = '/api/cover/thumbnail/null'} />)
          }
        },
        {
          dataField: 'name',
          caption: 'Número',
          width: 100,
        },
        {
          dataField: 'description',
          caption: 'Descripción',
        },
        {
          dataField: 'button_text',
          caption: 'Texto del Botón',
          width: 150,
        },
        {
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
      <div className='row' id='indicators-container'>
        <input ref={idRef} type='hidden' />

        {/* Información Principal (Izquierda) e Imagen (Derecha) */}
        <div className="col-md-7 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

              <InputFormGroup
                eRef={nameRef}
                label='Título'
                col='col-12'
                required
                placeholder="Ej: 100+"
              />
              <TextareaFormGroup
                eRef={descriptionRef}
                label='Descripción'
                col='col-12'
                rows={4}
                placeholder="Descripción del indicador"
              />
            </div>
          </div>
        </div>

        {/* Símbolo (Derecha) */}
        <div className="col-md-5 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">

              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <ImageFormGroup
                  eRef={symbolRef}
                  name="symbol"
                  label='Imagen del símbolo'
                  col='col-12'
                  required={!isEditing}
                  aspect='1/1'
                />
              </div>
              <small className="text-muted mt-2">
                <i className="mdi mdi-information me-1"></i>
                Recomendado: imagen cuadrada (1:1)
              </small>
            </div>
          </div>
        </div>

        {/* Botón de Acción (Abajo, ancho completo) */}
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">
                <i className="mdi mdi-link-variant me-2"></i>
                Botón de Acción (Opcional)
              </h6>
              <div className="row">
                <InputFormGroup
                  eRef={buttonTextRef}
                  label='Texto del Botón'
                  col='col-md-6'
                  placeholder="Ej: Ver más"
                />
                <InputFormGroup
                  eRef={buttonLinkRef}
                  label='Enlace del Botón'
                  col='col-md-6'
                  placeholder="Ej: /productos"
                />
              </div>
              <small className="text-muted">
                <i className="mdi mdi-information me-1"></i>
                El botón solo se mostrará si ambos campos están completos
              </small>
            </div>
          </div>
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