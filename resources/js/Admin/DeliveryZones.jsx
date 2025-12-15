import BaseAdminto from '@Adminto/Base';
import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Swal from 'sweetalert2';
import DeliveryZonesRest from '../Actions/Admin/DeliveryZonesRest';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import Modal from '../Components/Adminto/Modal';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import Number2Currency, { CurrencySymbol } from '../Utils/Number2Currency';

const deliveryZonesRest = new DeliveryZonesRest()

const DeliveryZones = () => {

  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  // Form elements ref
  const idRef = useRef()
  const districtRef = useRef()
  const zoneRef = useRef()
  const priceRef = useRef()
  const deliveryDaysRef = useRef()

  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    districtRef.current.value = data?.district ?? ''
    zoneRef.current.value = data?.zone ?? ''
    priceRef.current.value = data?.price ?? ''
    deliveryDaysRef.current.value = data?.delivery_days ?? ''

    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    const request = {
      id: idRef.current.value || undefined,
      district: districtRef.current.value,
      zone: zoneRef.current.value,
      price: priceRef.current.value,
      delivery_days: deliveryDaysRef.current.value
    }

    const result = await deliveryZonesRest.save(request)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
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
    const result = await deliveryZonesRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  return (<>
    <Table gridRef={gridRef} title='Zonas' rest={deliveryZonesRest}
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
      pageSize={20}
      columns={[
        {
          dataField: 'id',
          caption: 'ID',
          visible: false
        },
        {
          dataField: 'district',
          caption: 'Distrito',
          width: '20%',
        },
        {
          dataField: 'zone',
          caption: 'Zona',
          width: '20%',
        },
        {
          dataField: 'price',
          dataType: 'number',
          caption: 'Precio',
          width: '15%',
          cellTemplate: (container, { value }) => {
            container.text(`${CurrencySymbol()} ${Number2Currency(value)}`)
          }
        },
        {
          dataField: 'delivery_days',
          caption: 'Días de entrega',
          width: '25%',
          cellTemplate: (container, { value }) => {
            const days = {
              L: 'Lunes',
              M: 'Martes',
              X: 'Miércoles',
              J: 'Jueves',
              V: 'Viernes',
              S: 'Sábado',
              D: 'Domingo'
            }
            container.text(value.map(day => days[day]).join(', '))
          }
        },
        {
          caption: 'Acciones',
          width: '20%',
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
    <Modal modalRef={modalRef} title={isEditing ? 'Editar zona' : 'Agregar zona'} onSubmit={onModalSubmit} size='sm'>
      <div className='row' id='zones-container'>
        <input ref={idRef} type='hidden' />
        <InputFormGroup eRef={districtRef} label='Distrito' col='col-12' required />
        <InputFormGroup eRef={zoneRef} label='Zona' col='col-12' required />
        <InputFormGroup eRef={priceRef} label='Precio' type='number' step='0.01' col='col-12' required />
        <SelectFormGroup eRef={deliveryDaysRef} label='Días de entrega' multiple col='col-12' required dropdownParent='#zones-container'>
          <option value="D">Domingo</option>
          <option value="L">Lunes</option>
          <option value="M">Martes</option>
          <option value="X">Miércoles</option>
          <option value="J">Jueves</option>
          <option value="V">Viernes</option>
          <option value="S">Sábado</option>
        </SelectFormGroup>
      </div>
    </Modal>
  </>
  )
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Zonas de Cobertura'>
    <DeliveryZones {...properties} />
  </BaseAdminto>);
})