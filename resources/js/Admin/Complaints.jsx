import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '@Utils/CreateReactScript';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import ReactAppend from '@Utils/ReactAppend';
import ComplaintsRest from '@Rest/Admin/ComplaintsRest';
import Modal from '@Adminto/Modal';
import Swal from 'sweetalert2';
import Number2Currency, { CurrencySymbol } from '../Utils/Number2Currency';
import { renderToString } from 'react-dom/server';

const complaintsRest = new ComplaintsRest()

const Complaints = () => {
    const gridRef = useRef()
    const modalRef = useRef()

    const [dataLoaded, setDataLoaded] = useState(null)

    const onDeleteClicked = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Eliminar reclamo',
            text: '¿Estas seguro de eliminar este reclamo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        })
        if (!isConfirmed) return
        const result = await complaintsRest.delete(id)
        if (!result) return
        $(gridRef.current).dxDataGrid('instance').refresh()
    }

    const onModalOpen = (data) => {
        setDataLoaded(data)
        $(modalRef.current).modal('show');
    }

    const getTypeDocument = (type) => {
        const types = {
            'dni': 'DNI',
            'ce': 'Carné de Extranjería',
            'pasaporte': 'Pasaporte',
            'ruc': 'RUC'
        }
        return types[type] || type
    }

    const getTypeComplaint = (type) => {
        const types = {
            'reclamo': 'Reclamo',
            'queja': 'Queja'
        }
        return types[type] || type
    }

    return (<>
        <Table gridRef={gridRef} title='Reclamos y Quejas' rest={complaintsRest}
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
                    dataField: 'code',
                    caption: 'Código',
                    width: 150
                },
                {
                    dataField: 'nombre',
                    caption: 'Nombre',
                    cellTemplate: (container, { data }) => {
                        ReactAppend(container, <span style={{
                            width: '100%',
                            cursor: 'pointer'
                        }} onClick={() => onModalOpen(data)}>
                            {data.nombre}
                        </span>)
                    }
                },
                {
                    dataField: 'correo_electronico',
                    caption: 'Correo',
                },
                {
                    dataField: 'tipo_documento',
                    caption: 'Tipo Doc.',
                    cellTemplate: (container, { data }) => {
                        ReactAppend(container, <span>{getTypeDocument(data.tipo_documento)}</span>)
                    }
                },
                {
                    dataField: 'numero_identidad',
                    caption: 'Nº Identidad',
                },
                {
                    dataField: 'tipo_reclamo',
                    caption: 'Tipo',
                    cellTemplate: (container, { data }) => {
                        const badgeClass = data.tipo_reclamo === 'reclamo' ? 'bg-warning' : 'bg-info';
                        ReactAppend(container, <span className={`badge ${badgeClass} rounded-pill`}>
                            {getTypeComplaint(data.tipo_reclamo)}
                        </span>)
                    }
                },

                {
                    dataField: "monto_reclamado",
                    caption: "Monto",
                    dataType: "number",
                    cellTemplate: (container, { data }) => {
                        container.html(
                            renderToString(
                                <>

                                    <small
                                        className="d-block "

                                    >
                                        {CurrencySymbol()} {Number2Currency(data?.monto_reclamado)}
                                    </small>


                                </>
                            )
                        );
                    },
                },
                {
                    dataField: 'created_at',
                    caption: 'Fecha',
                    dataType: 'datetime',
                    format: 'yyyy-MM-dd HH:mm:ss',
                    sortOrder: 'desc'
                },
                {
                    caption: 'Acciones',
                    cellTemplate: (container, { data }) => {
                        container.append(DxButton({
                            className: 'btn btn-xs btn-soft-dark',
                            title: 'Ver reclamo',
                            icon: 'fa fa-eye',
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
        <Modal modalRef={modalRef} title='Detalle del Reclamo/Queja' size='lg' hideFooter >
            <div className="row">
                <div className="col-md-6">
                    <h6 className="mb-3">Datos Personales</h6>
                    <p>
                        <b>Nombre</b>:
                        <span className='ms-1'>{dataLoaded?.nombre}</span>
                    </p>
                    <p>
                        <b>Tipo de Documento</b>:
                        <span className='ms-1'>{getTypeDocument(dataLoaded?.tipo_documento)}</span>
                    </p>
                    <p>
                        <b>Número de Identidad</b>:
                        <span className='ms-1'>{dataLoaded?.numero_identidad}</span>
                    </p>
                    <p>
                        <b>Correo</b>:
                        <span className='ms-1'>{dataLoaded?.correo_electronico || <i className='text-muted'>- Sin correo -</i>}</span>
                    </p>
                    <p>
                        <b>Celular</b>:
                        <span className='ms-1'>{dataLoaded?.celular || <i className='text-muted'>- Sin celular -</i>}</span>
                    </p>
                    <p>
                        <b>Dirección</b>:
                        <span className='ms-1'>{dataLoaded?.direccion}</span>
                    </p>
                    <p>
                        <b>Ubicación</b>:
                        <span className='ms-1'>{dataLoaded?.distrito}, {dataLoaded?.provincia}, {dataLoaded?.departamento}</span>
                    </p>
                </div>
                <div className="col-md-6">
                    <h6 className="mb-3">Datos del Reclamo</h6>
                    <p>
                        <b>Código</b>:
                        <span className='ms-1 badge bg-dark'>{dataLoaded?.code || <i>Sin código</i>}</span>
                    </p>
                    <p>
                        <b>Tipo</b>:
                        <span className='ms-1'>{getTypeComplaint(dataLoaded?.tipo_reclamo)}</span>
                    </p>
                    <p>
                        <b>Tipo de Producto</b>:
                        <span className='ms-1'>{dataLoaded?.tipo_producto}</span>
                    </p>
                    <p>
                        <b>Descripción del Producto</b>:
                        <span className='ms-1'>{dataLoaded?.descripcion_producto}</span>
                    </p>
                    <p>
                        <b>Monto Reclamado</b>:
                        <span className='ms-1'>S/ {dataLoaded?.monto_reclamado}</span>
                    </p>
                    <p>
                        <b>Fecha de Ocurrencia</b>:
                        <span className='ms-1'>{dataLoaded?.fecha_ocurrencia}</span>
                    </p>
                    {dataLoaded?.numero_pedido && (
                        <p>
                            <b>Número de Pedido</b>:
                            <span className='ms-1'>{dataLoaded?.numero_pedido}</span>
                        </p>
                    )}
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <h6 className="mb-3">Detalle del Reclamo</h6>
                    <div className="border rounded p-3 bg-light">
                        {dataLoaded?.detalle_reclamo}
                    </div>
                </div>
            </div>
        </Modal>
    </>
    )
}

CreateReactScript((el, properties) => {

    createRoot(el).render(<BaseAdminto {...properties} title='Reclamos y Quejas'>
        <Complaints {...properties} />
    </BaseAdminto>);
})