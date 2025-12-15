import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '@Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import ReactAppend from '@Utils/ReactAppend';
import WhistleblowingsRest from '@Rest/Admin/WhistleblowingsRest';
import Modal from '@Adminto/Modal';
import Swal from 'sweetalert2';
import { renderToString } from 'react-dom/server';

const whistleblowingsRest = new WhistleblowingsRest()

const Whistleblowings = () => {
    const gridRef = useRef()
    const modalRef = useRef()

    const [dataLoaded, setDataLoaded] = useState(null)
    const [notasAdmin, setNotasAdmin] = useState('')

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Eliminar denuncia',
            text: '¿Estas seguro de eliminar esta denuncia?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        })
        if (!isConfirmed) return
        const result = await whistleblowingsRest.delete(id)
        if (!result) return
        $(gridRef.current).dxDataGrid('instance').refresh()
    }

    const onModalOpen = (data) => {
        setDataLoaded(data)
        setNotasAdmin(data.notas_admin || '')
        $(modalRef.current).modal('show');
    }

    const onStatusChange = async (id, newStatus) => {
        const result = await whistleblowingsRest.save({ id, estado: newStatus })
        if (!result) return
        $(gridRef.current).dxDataGrid('instance').refresh()
       
    }

    const onNotasChange = async () => {
        const result = await whistleblowingsRest.save({ id: dataLoaded.id, notas_admin: notasAdmin })
        if (!result) return
        Swal.fire('Notas guardadas', '', 'success')
        $(modalRef.current).modal('hide')
        $(gridRef.current).dxDataGrid('instance').refresh()
    }

    return (<>
        <Table gridRef={gridRef} title='Denuncias' rest={whistleblowingsRest}
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
                    dataField: 'nombre',
                    caption: 'Nombre',
                    cellTemplate: (container, { data }) => {
                        ReactAppend(container, <span style={{
                            cursor: 'pointer',
                            color: '#007bff',
                            textDecoration: 'underline'
                        }} onClick={() => onModalOpen(data)}>
                            {data.nombre}
                        </span>)
                    }
                },
                {
                    dataField: 'email',
                    caption: 'Email',
                },
                {
                    dataField: 'ambito',
                    caption: 'Ámbito',
                    cellTemplate: (container, { data }) => {
                        const colors = {
                            'Laboral': 'primary',
                            'Ético': 'warning',
                            'Técnico u operativo': 'info',
                            'Comercial o ventas': 'success',
                            'Seguridad': 'danger',
                            'Discriminación o acoso': 'dark',
                            'Otro': 'secondary'
                        };
                        const color = colors[data.ambito] || 'secondary';
                        ReactAppend(container, 
                            <span className={`badge bg-${color} rounded-pill`}>
                                {data.ambito}
                            </span>
                        )
                    }
                },
                {
                    dataField: 'relacion_compania',
                    caption: 'Relación',
                    width: 120
                },
                {
                    dataField: 'departamento',
                    caption: 'Departamento',
                    width: 120
                },
                {
                    dataField: 'estado',
                    caption: 'Estado',
                    cellTemplate: (container, { data }) => {
                        const colors = {
                            'Pendiente': 'warning',
                            'En revisión': 'info',
                            'Resuelta': 'success',
                            'Archivada': 'secondary'
                        };
                        const color = colors[data.estado] || 'secondary';
                        
                        const selectHtml = `
                            <select class="form-select form-select-sm bg-${color} text-white border-0" 
                                    onchange="window.handleStatusChange('${data.id}', this.value)"
                                    style="cursor: pointer; font-weight: 500;">
                                <option value="Pendiente" ${data.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="En revisión" ${data.estado === 'En revisión' ? 'selected' : ''}>En revisión</option>
                                <option value="Resuelta" ${data.estado === 'Resuelta' ? 'selected' : ''}>Resuelta</option>
                                <option value="Archivada" ${data.estado === 'Archivada' ? 'selected' : ''}>Archivada</option>
                            </select>
                        `;
                        container.html(selectHtml);
                        
                        // Guardar referencia a la función
                        window.handleStatusChange = onStatusChange;
                    }
                },
                {
                    dataField: 'created_at',
                    caption: 'Fecha',
                    dataType: 'datetime',
                    format: 'yyyy-MM-dd HH:mm',
                    sortOrder: 'desc',
                    width: 150
                },
                {
                    caption: 'Acciones',
                    width: 120,
                    cellTemplate: (container, { data }) => {
                        container.append(DxButton({
                            className: 'btn btn-xs btn-soft-primary',
                            title: 'Ver denuncia',
                            icon: 'fa fa-eye',
                            onClick: () => onModalOpen(data)
                        }))
                        container.append(DxButton({
                            className: 'btn btn-xs btn-soft-danger ms-1',
                            title: 'Eliminar',
                            icon: 'fa fa-trash',
                            onClick: () => onDeleteClicked(data.id)
                        }))
                    },
                    allowFiltering: false,
                    allowExporting: false
                }
            ]} />
        
        <Modal modalRef={modalRef} title='Detalle de la Denuncia' size='xl' hideFooter>
            <div className="row">
                <div className="col-md-6">
                    <h6 className="mb-3 text-primary">
                        <i className="mdi mdi-map-marker me-2"></i>Ubicación del Incidente
                    </h6>
                    <div className="bg-light p-3 rounded mb-3">
                        <p className="mb-2">
                            <strong>Departamento:</strong> {dataLoaded?.departamento}
                        </p>
                        <p className="mb-2">
                            <strong>Ciudad:</strong> {dataLoaded?.ciudad}
                        </p>
                        <p className="mb-0">
                            <strong>Dirección:</strong> {dataLoaded?.direccion_exacta}
                        </p>
                    </div>

                    <h6 className="mb-3 text-primary mt-4">
                        <i className="mdi mdi-account me-2"></i>Información de Contacto
                    </h6>
                    <div className="bg-light p-3 rounded">
                        <p className="mb-2">
                            <strong>Nombre:</strong> {dataLoaded?.nombre}
                        </p>
                        <p className="mb-2">
                            <strong>Email:</strong> {dataLoaded?.email}
                        </p>
                        <p className="mb-0">
                            <strong>Teléfono:</strong> {dataLoaded?.telefono || <i className="text-muted">No proporcionado</i>}
                        </p>
                    </div>
                </div>

                <div className="col-md-6">
                    <h6 className="mb-3 text-primary">
                        <i className="mdi mdi-alert-circle me-2"></i>Detalles del Incidente
                    </h6>
                    <div className="bg-light p-3 rounded mb-3">
                        <p className="mb-2">
                            <strong>Ámbito:</strong> 
                            <span className="badge bg-primary ms-2">{dataLoaded?.ambito}</span>
                        </p>
                        <p className="mb-2">
                            <strong>Relación:</strong> {dataLoaded?.relacion_compania}
                        </p>
                        <p className="mb-2">
                            <strong>Empresa:</strong> {dataLoaded?.empresa || <i className="text-muted">No especificada</i>}
                        </p>
                        <p className="mb-2">
                            <strong>Fecha del incidente:</strong> {dataLoaded?.cuando_ocurrio}
                        </p>
                        <p className="mb-0">
                            <strong>Estado:</strong> 
                            <span className={`badge bg-${dataLoaded?.estado === 'Pendiente' ? 'warning' : dataLoaded?.estado === 'En revisión' ? 'info' : dataLoaded?.estado === 'Resuelta' ? 'success' : 'secondary'} ms-2`}>
                                {dataLoaded?.estado}
                            </span>
                        </p>
                    </div>

                    <h6 className="mb-3 text-primary mt-4">
                        <i className="mdi mdi-information me-2"></i>Metadata
                    </h6>
                    <div className="bg-light p-3 rounded">
                        <p className="mb-2">
                            <strong>IP:</strong> <code>{dataLoaded?.ip_address}</code>
                        </p>
                        <p className="mb-0">
                            <strong>Fecha de registro:</strong> {new Date(dataLoaded?.created_at).toLocaleString('es-PE')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <h6 className="mb-3 text-primary">
                        <i className="mdi mdi-file-document me-2"></i>¿Qué ha sucedido?
                    </h6>
                    <div className="border rounded p-3 bg-light">
                        {dataLoaded?.que_sucedio}
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-md-6">
                    <h6 className="mb-3 text-primary">
                        <i className="mdi mdi-account-multiple me-2"></i>¿Quién está implicado?
                    </h6>
                    <div className="border rounded p-3 bg-light">
                        {dataLoaded?.quien_implicado}
                    </div>
                </div>

                <div className="col-md-6">
                    <h6 className="mb-3 text-primary">
                        <i className="mdi mdi-message-text me-2"></i>Diálogo con superior
                    </h6>
                    <div className="border rounded p-3 bg-light">
                        {dataLoaded?.dialogo_superior || <i className="text-muted">No especificado</i>}
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <h6 className="mb-3 text-danger">
                        <i className="mdi mdi-shield-lock me-2"></i>Notas Internas (Confidencial)
                    </h6>
                    <textarea
                        className="form-control"
                        rows="4"
                        value={notasAdmin}
                        onChange={(e) => setNotasAdmin(e.target.value)}
                        placeholder="Agregar notas internas sobre el seguimiento de esta denuncia..."
                    />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={onNotasChange}
                    >
                        <i className="mdi mdi-content-save me-1"></i>
                        Guardar Notas
                    </button>
                </div>
            </div>
        </Modal>
    </>)
}

CreateReactScript((el, properties) => {
    createRoot(el).render(<BaseAdminto {...properties} title='Denuncias'>
        <Whistleblowings {...properties} />
    </BaseAdminto>);
})

