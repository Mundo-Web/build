import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import InputFormGroup from '../Components/Adminto/form/InputFormGroup';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import Swal from 'sweetalert2';
import UsersRest from '../Actions/Admin/UsersRest';
import { renderToString } from 'react-dom/server';
import Modal from '../Components/Adminto/Modal';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';

const usersRest = new UsersRest();

const Users = ({ }) => {
  const gridRef = useRef()
  const modalRef = useRef()

  // Form elements ref
  const idRef = useRef()
  const nameRef = useRef()
  const lastnameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const phoneRef = useRef()
  const phonePrefixRef = useRef()
  const dniRef = useRef()
  const roleRef = useRef()


  const [isEditing, setIsEditing] = useState(false)

  const onModalOpen = (data) => {
    if (data?.id) setIsEditing(true)
    else setIsEditing(false)

    idRef.current.value = data?.id ?? ''
    nameRef.current.value = data?.name ?? ''
    lastnameRef.current.value = data?.lastname ?? ''
    emailRef.current.value = data?.email ?? ''
    passwordRef.current.value = ''
    confirmPasswordRef.current.value = ''
    phoneRef.current.value = data?.phone ?? ''
    phonePrefixRef.current.value = data?.phone_prefix ?? '+51'
    dniRef.current.value = data?.dni ?? ''
    
    // Set role
    if (data?.roles && data?.roles.length > 0) {
      $(roleRef.current).val(data.roles[0].name).trigger('change')
    } else {
      $(roleRef.current).val('Admin').trigger('change')
    }
    
  
    
    $(modalRef.current).modal('show')
  }

  const onModalSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords if creating new user or if password fields are filled
    if (!isEditing || passwordRef.current.value) {
      if (passwordRef.current.value !== confirmPasswordRef.current.value) {
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          icon: 'error'
        })
        return
      }
      if (passwordRef.current.value.length < 6) {
        Swal.fire({
          title: 'Error',
          text: 'La contraseña debe tener al menos 6 caracteres',
          icon: 'error'
        })
        return
      }
    }

    const request = {
      id: idRef.current.value || undefined,
      name: nameRef.current.value,
      lastname: lastnameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      phone_prefix: phonePrefixRef.current.value,
      dni: dniRef.current.value,
      role: roleRef.current.value,
    
    }

    // Only add password if it's provided
    if (passwordRef.current.value) {
      request.password = passwordRef.current.value
    }

    const result = await usersRest.save(request)
    if (!result) return

    $(gridRef.current).dxDataGrid('instance').refresh()
    $(modalRef.current).modal('hide')
  }

  const onStatusChange = async ({ id, value }) => {
    const result = await usersRest.boolean({ id, field: 'status', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar usuario',
      text: '¿Estás seguro de eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) return
    const result = await usersRest.delete(id)
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const getRoleDisplayName = (roles) => {
    if (!roles || roles.length === 0) return 'Sin rol'
    const role = roles[0].name
    switch(role) {
      case 'Root': return 'Super Administrador'
      case 'Admin': return 'Administrador'
      default: return role
    }
  }

  const getRoleBadgeClass = (roles) => {
    if (!roles || roles.length === 0) return 'badge-secondary'
    const role = roles[0].name
    switch(role) {
      case 'Root': return 'badge-danger'
      case 'Admin': return 'badge-primary'
      default: return 'badge-secondary'
    }
  }

  return (<>
    <Table gridRef={gridRef} title='Usuarios del Sistema' rest={usersRest}
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
            text: 'Nuevo usuario',
            hint: 'Crear nuevo usuario',
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
          dataField: 'name',
          caption: 'Nombre completo',
          width: '25%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <div>
                <strong>{data.name} {data.lastname}</strong>
                <br />
                <small className="text-muted">{data.email}</small>
              </div>
            )
          }
        },
        {
          dataField: 'phone',
          caption: 'Teléfono',
          cellTemplate: (container, { data }) => {
            if (data.phone) {
              ReactAppend(container, 
                <span>{data.phone_prefix || '+51'} {data.phone}</span>
              )
            } else {
              ReactAppend(container, <span className="text-muted">- Sin teléfono -</span>)
            }
          }
        },
        {
          dataField: 'dni',
          caption: 'DNI',
          cellTemplate: (container, { data }) => {
            if (data.dni) {
              ReactAppend(container, <span>{data.dni}</span>)
            } else {
              ReactAppend(container, <span className="text-muted">- Sin DNI -</span>)
            }
          }
        },
        {
          dataField: 'roles',
          caption: 'Rol',
          allowFiltering: false,
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <span className={`badge ${getRoleBadgeClass(data.roles)}`}>
                {getRoleDisplayName(data.roles)}
              </span>
            )
          }
        },
        {
          dataField: 'status',
          caption: 'Estado',
          dataType: 'boolean',
          width: '120px',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <SwitchFormGroup 
                checked={data.status == 1} 
                onChange={(e) => onStatusChange({ id: data.id, value: e.target.checked })} 
              />
            )
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
    
    <Modal modalRef={modalRef} title={isEditing ? 'Editar usuario' : 'Crear nuevo usuario'} onSubmit={onModalSubmit} size='lg'>
      <div className='row' id='principal-container'>
        <input ref={idRef} type='hidden' />
        
        <InputFormGroup eRef={nameRef} label='Nombres' col='col-md-6' required />
        <InputFormGroup eRef={lastnameRef} label='Apellidos' col='col-md-6' required />
        <InputFormGroup eRef={emailRef} label='Correo electrónico' type='email' col='col-md-6' required />
        <InputFormGroup eRef={dniRef} label='DNI' col='col-md-6' />
        
        <div className="col-md-3">
          <SelectFormGroup eRef={phonePrefixRef} label='Prefijo' required>
            <option value="+51">+51 (Perú)</option>
            <option value="+1">+1 (EE.UU.)</option>
            <option value="+34">+34 (España)</option>
            <option value="+52">+52 (México)</option>
            <option value="+57">+57 (Colombia)</option>
          </SelectFormGroup>
        </div>
        <InputFormGroup eRef={phoneRef} label='Teléfono' type='tel' col='col-md-9' />
        
        <div className="col-md-6">
          <SelectFormGroup eRef={roleRef} label='Rol' required>
            <option value="Admin">Administrador</option>
            {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
              <option value="Root">Super Administrador</option>
            )}
          </SelectFormGroup>
        </div>
        
      

        <div className="col-12">
          <hr />
          <h6>{isEditing ? 'Cambiar contraseña (opcional)' : 'Contraseña'}</h6>
        </div>
        
        <InputFormGroup 
          eRef={passwordRef} 
          label={isEditing ? 'Nueva contraseña' : 'Contraseña'} 
          type='password' 
          col='col-md-6' 
          required={!isEditing}
          placeholder={isEditing ? 'Dejar vacío para mantener la actual' : ''}
        />
        <InputFormGroup 
          eRef={confirmPasswordRef} 
          label='Confirmar contraseña' 
          type='password' 
          col='col-md-6' 
          required={!isEditing}
        />
      </div>
    </Modal>
  </>)
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Usuarios'>
    <Users {...properties} />
  </BaseAdminto>);
})
