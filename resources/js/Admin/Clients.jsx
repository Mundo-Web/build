import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import ReactAppend from '../Utils/ReactAppend';
import DxButton from '../Components/dx/DxButton';
import SwitchFormGroup from '@Adminto/form/SwitchFormGroup';
import Swal from 'sweetalert2';
import ClientsRest from '../Actions/Admin/ClientsRest';
import { renderToString } from 'react-dom/server';

const clientsRest = new ClientsRest();

const Clients = ({ }) => {
  const gridRef = useRef()

  const onStatusChange = async ({ id, value }) => {
    const { isConfirmed } = await Swal.fire({
      title: value ? 'Activar cliente' : 'Desactivar cliente',
      text: `¿Estás seguro de ${value ? 'activar' : 'desactivar'} este cliente?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    })
    if (!isConfirmed) {
      // Revert the switch
      $(gridRef.current).dxDataGrid('instance').refresh()
      return
    }

    const result = await clientsRest.boolean({ id, field: 'status', value })
    if (!result) return
    $(gridRef.current).dxDataGrid('instance').refresh()
  }

  const onViewDetails = (data) => {
    const createdDate = new Date(data.created_at)
    const formattedDate = createdDate.toLocaleDateString('es-ES') + ' ' + createdDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

    Swal.fire({
      title: 'Detalles del Cliente',
      html: `
        <div style="text-align: left; max-width: 100%;">
          <form style="padding: 20px 0;">
            <div class="row">
              
              <!-- Columna Izquierda -->
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Nombre Completo</label>
                  <input type="text" class="form-control" value="${data.name} ${data.lastname || ''}" readonly style="background-color: #f8f9fa;">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Email</label>
                  <input type="email" class="form-control" value="${data.email || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Teléfono</label>
                  <input type="text" class="form-control" value="${data.phone ? (data.phone_prefix || '+51') + ' ' + data.phone : ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                ${data.alternate_phone ? `
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Teléfono Alternativo</label>
                  <input type="text" class="form-control" value="${data.alternate_phone}" readonly style="background-color: #f8f9fa;">
                </div>
                ` : ''}
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Tipo de Documento</label>
                  <input type="text" class="form-control" value="${data.document_type || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
              </div>
              
              <!-- Columna Derecha -->
              <div class="col-md-6">
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Número de Documento</label>
                  <input type="text" class="form-control" value="${data.document_number || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Dirección</label>
                  <input type="text" class="form-control" value="${data.address || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificada">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Distrito</label>
                  <input type="text" class="form-control" value="${data.district || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Provincia</label>
                  <input type="text" class="form-control" value="${data.province || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
                
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Departamento</label>
                  <input type="text" class="form-control" value="${data.department || ''}" readonly style="background-color: #f8f9fa;" placeholder="No especificado">
                </div>
              </div>
              
              <!-- Fila completa para campos adicionales -->
              <div class="col-12">
                ${data.reference ? `
                <div class="form-group mb-3">
                  <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Referencia</label>
                  <textarea class="form-control" readonly style="background-color: #f8f9fa; resize: none;" rows="2">${data.reference}</textarea>
                </div>
                ` : ''}
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Estado</label>
                      <input type="text" class="form-control ${data.status == 1 ? 'border-success' : 'border-danger'}" 
                             value="${data.status == 1 ? 'Activo' : 'Inactivo'}" readonly 
                             style="background-color: ${data.status == 1 ? '#d4edda' : '#f8d7da'}; 
                                    color: ${data.status == 1 ? '#155724' : '#721c24'}; 
                                    font-weight: 600;">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group mb-3">
                      <label class="form-label" style="font-weight: 600; color: #495057; margin-bottom: 5px;">Fecha de Registro</label>
                      <input type="text" class="form-control" value="${formattedDate}" readonly style="background-color: #f8f9fa;">
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </form>
        </div>
      `,
      width: '800px',
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#6c757d',
      allowOutsideClick: true,
      allowEscapeKey: true,
      customClass: {
        popup: 'client-details-modal'
      },
      didOpen: () => {
        // Agregar estilos CSS para el modal
        const style = document.createElement('style');
        style.innerHTML = `
          .client-details-modal {
            border-radius: 8px !important;
          }
          .client-details-modal .swal2-title {
            color: #495057 !important;
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            margin-bottom: 10px !important;
          }
          .client-details-modal .swal2-html-container {
            margin: 0 !important;
            padding: 0 20px 20px 20px !important;
          }
          .client-details-modal .form-control:read-only {
            cursor: default !important;
          }
          .client-details-modal .form-label {
            font-size: 0.9rem !important;
          }
        `;
        document.head.appendChild(style);
      }
    })
  }

  return (<>
    <Table gridRef={gridRef} title='Clientes' rest={clientsRest}
      toolBar={(container) => {
        container.unshift({
          widget: 'dxButton', location: 'after',
          options: {
            icon: 'refresh',
            hint: 'Refrescar tabla',
            onClick: () => $(gridRef.current).dxDataGrid('instance').refresh()
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
          caption: 'Cliente',
          width: '25%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container, 
              <div>
                <strong>{data.name} {data.lastname || ''}</strong>
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
          dataField: 'document_number',
          caption: 'Documento',
          cellTemplate: (container, { data }) => {
            if (data.document_number) {
              ReactAppend(container, 
                <div>
                  <span>{data.document_type || 'DOC'}: {data.document_number}</span>
                </div>
              )
            } else {
              ReactAppend(container, <span className="text-muted">- Sin documento -</span>)
            }
          }
        },
        {
          dataField: 'city',
          caption: 'Ubicación',
          cellTemplate: (container, { data }) => {
            const location = [data.city, data.department].filter(Boolean).join(', ')
            if (location) {
              ReactAppend(container, <span>{location}</span>)
            } else {
              ReactAppend(container, <span className="text-muted">- Sin ubicación -</span>)
            }
          }
        },
        {
          dataField: 'created_at',
          caption: 'Registro',
          dataType: 'date',
          cellTemplate: (container, { data }) => {
            const date = new Date(data.created_at)
            container.html(renderToString(<>
              <div>{date.toLocaleDateString('es-ES')}</div>
              <small className="text-muted">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</small>
            </>))
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
              className: 'btn btn-xs btn-soft-info',
              title: 'Ver detalles',
              icon: 'fa fa-eye',
              onClick: () => onViewDetails(data)
            }))
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]} />
  </>)
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Clientes'>
    <Clients {...properties} />
  </BaseAdminto>);
})
