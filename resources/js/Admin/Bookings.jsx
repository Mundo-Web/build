import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import BaseAdminto from '@Adminto/Base';
import BookingsRest from '../Actions/Admin/BookingsRest';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import Modal from '../Components/Adminto/Modal';
import SelectFormGroup from '../Components/Adminto/form/SelectFormGroup';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Swal from 'sweetalert2';
import Global from '../Utils/Global';
import Number2Currency, { CurrencySymbol } from '../Utils/Number2Currency';
import Tippy from '@tippyjs/react';

const bookingsRest = new BookingsRest();

const Bookings = ({ statuses = [] }) => {
  const gridRef = useRef();
  const modalRef = useRef();
  const notifyClientRef = useRef();
  const isProcessingStatus = useRef(false); // Flag para evitar doble ejecución
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookingLoaded, setBookingLoaded] = useState(null);
  const [allBookingsInSale, setAllBookingsInSale] = useState([]);
  const [saleStatuses, setSaleStatuses] = useState([]);
  const [statusLoading, setStatusLoading] = useState(false);

  // Agregar estilos personalizados para el select
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .select2-container--default .select2-results__option {
        padding: 4px !important;
        background: white !important;
      }
      .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background-color: #f8f9fa !important;
      }
      .select2-container--default .select2-results__option:hover {
        background-color: #f8f9fa !important;
      }
      .select2-container--default .select2-selection--single {
        border: 1px solid #e3ebf0 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return moment(date).format("YYYY-MM-DD HH:mm");
  };

  // Obtener filterValue basado en el status seleccionado
  const getFilterValue = () => {
    if (statusFilter === 'all') return [];
    return ['status', '=', statusFilter];
  };

  // Refrescar la tabla cuando cambia el filtro
  useEffect(() => {
    if (gridRef.current) {
      const instance = $(gridRef.current).dxDataGrid('instance');
      if (instance) {
        instance.option('filterValue', getFilterValue());
        instance.refresh();
      }
    }
  }, [statusFilter]);

  const onModalOpen = async (bookingId) => {
    try {
      const result = await bookingsRest.get(bookingId);
      if (result && result.data) {
        setBookingLoaded(result.data);
        setAllBookingsInSale(result.all_bookings || []);
        
        // Cargar historial de estados
        await loadSaleStatusHistory(bookingId);
      } else if (result) {
        setBookingLoaded(result);
        setAllBookingsInSale([]);
        setSaleStatuses([]);
      } else {
        Swal.fire('Error', 'No se pudo cargar la reserva', 'error');
      }
    } catch (error) {
      console.error('Error al cargar reserva:', error);
      Swal.fire('Error', 'No se pudo cargar la reserva', 'error');
    }
  };

  const onDeleteClicked = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Eliminar reserva',
      text: '¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!isConfirmed) return;
    const result = await bookingsRest.delete(id);
    if (!result) return;
    $(gridRef.current).dxDataGrid('instance').refresh();
  };

  // Efecto para mostrar modal cuando se carga un booking
  useEffect(() => {
    if (bookingLoaded && modalRef.current) {
      $(modalRef.current).modal('show');
    }
  }, [bookingLoaded]);

  const loadSaleStatusHistory = async (bookingId) => {
    if (!bookingId) return;
    try {
      const history = await bookingsRest.getSaleStatusHistory(bookingId);
      setSaleStatuses(history || []);
    } catch (error) {
      console.error('Error al cargar historial de estados:', error);
      setSaleStatuses([]);
    }
  };

  const onStatusChange = async (e, booking) => {
    // Usar el booking pasado como parámetro (igual que Sales.jsx)
    const sale = booking?.sale || bookingLoaded?.sale;
    const bookingId = booking?.id || bookingLoaded?.id;
    
    // Evitar doble ejecución con useRef (más confiable que useState)
    if (isProcessingStatus.current) return;
    
    const status = statuses.find((s) => s.id == e.target.value);
    if (!status) return;

    if (status.reversible == 0) {
      const { isConfirmed } = await Swal.fire({
        title: "Cambiar estado",
        text: `¿Estás seguro de cambiar el estado a ${status.name}?\nEsta acción no se puede revertir`,
        icon: "warning",
        showCancelButton: true,
      });
      if (!isConfirmed) return;
    }

    isProcessingStatus.current = true;
    setStatusLoading(true);
    
    try {
      const result = await bookingsRest.updateSaleStatus(bookingId, {
        status_id: status.id,
        notify_client: notifyClientRef.current?.checked || false
      });
      
      if (result?.status) {
        // Actualizar booking
        const newBooking = await bookingsRest.get(bookingId);
        if (newBooking?.data) {
          setBookingLoaded(newBooking.data);
          setAllBookingsInSale(newBooking.all_bookings || []);
        }
        
        // Cargar historial de estados
        await loadSaleStatusHistory(bookingId);
        
        $(gridRef.current).dxDataGrid('instance').refresh();
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
    }
    
    setStatusLoading(false);
    // Dar tiempo a Select2 para estabilizarse antes de permitir otra ejecución
    setTimeout(() => {
      isProcessingStatus.current = false;
    }, 500);
  };

  const onConfirmBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Confirmar Reserva',
      text: '¿Estás seguro de confirmar esta reserva?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await bookingsRest.confirm(id);
        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: '¡Confirmada!',
            text: 'La reserva ha sido confirmada correctamente',
            timer: 2000,
            showConfirmButton: false,
          });
          // Recargar la reserva
          await onModalOpen(id);
          $(gridRef.current).dxDataGrid('instance').refresh();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al confirmar la reserva',
        });
      }
    }
  };

  const onCompleteBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Completar Reserva',
      text: '¿El huésped ya ha hecho el check-out?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, completar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await bookingsRest.complete(id);
        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: '¡Completada!',
            text: 'La reserva ha sido marcada como completada',
            timer: 2000,
            showConfirmButton: false,
          });
          await onModalOpen(id);
          $(gridRef.current).dxDataGrid('instance').refresh();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al completar la reserva',
        });
      }
    }
  };

  const onCancelBooking = async (id) => {
    const { value: reason } = await Swal.fire({
      title: 'Cancelar Reserva',
      input: 'textarea',
      inputLabel: 'Razón de la cancelación',
      inputPlaceholder: 'Ingresa la razón de la cancelación...',
      inputAttributes: {
        'aria-label': 'Razón de cancelación'
      },
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'No cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una razón para la cancelación';
        }
      }
    });

    if (reason) {
      try {
        const response = await bookingsRest.cancel(id, { reason });
        if (response.status) {
          Swal.fire({
            icon: 'success',
            title: '¡Cancelada!',
            text: 'La reserva ha sido cancelada correctamente',
            timer: 2000,
            showConfirmButton: false,
          });
          await onModalOpen(id);
          $(gridRef.current).dxDataGrid('instance').refresh();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cancelar la reserva',
        });
      }
    }
  };

  const onNoShowBooking = async (id) => {
    const result = await Swal.fire({
      title: 'Marcar como No Show',
      text: '¿El huésped no se presentó?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c757d',
      cancelButtonColor: '#17a2b8',
      confirmButtonText: 'Sí, marcar No Show',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const response = await bookingsRest.noShow(id);
        if (response.status) {
          Swal.fire({
            icon: 'info',
            title: 'Marcada como No Show',
            text: 'La reserva ha sido marcada como no show',
            timer: 2000,
            showConfirmButton: false,
          });
          await onModalOpen(id);
          $(gridRef.current).dxDataGrid('instance').refresh();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al marcar como no show',
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { badge: 'badge-warning', label: 'Pendiente', color: '#f1b44c' },
      confirmed: { badge: 'badge-success', label: 'Confirmada', color: '#28a745' },
      cancelled: { badge: 'badge-danger', label: 'Cancelada', color: '#dc3545' },
      completed: { badge: 'badge-info', label: 'Completada', color: '#17a2b8' },
      no_show: { badge: 'badge-secondary', label: 'No Show', color: '#6c757d' },
    };
    return badges[status] || { badge: 'badge-secondary', label: status, color: '#6c757d' };
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      pendiente: { badge: 'badge-warning', label: 'Pendiente' },
      pagado: { badge: 'badge-success', label: 'Pagado' },
      fallido: { badge: 'badge-danger', label: 'Fallido' },
      reembolsado: { badge: 'badge-info', label: 'Reembolsado' },
    };
    return badges[status] || { badge: 'badge-secondary', label: status || 'N/A' };
  };

  // Template para el select de estados
  const statusTemplate = (e) => {
    const data = $(e.element).data('status');
    if (!e.id) return;
    
    const baseColor = data?.color || "#333";
    const element = $(renderToString(
      <span 
        title={data?.description || ''}
        className="d-flex align-items-center"
        style={{
          color: baseColor,
          padding: "4px 8px",
          fontSize: "14px",
          fontWeight: "500"
        }}
      >
        <i 
          className={`${data?.icon || 'mdi mdi-circle'} me-2`}
          style={{ 
            color: baseColor,
            fontSize: "12px"
          }}
        ></i>
        {e.text}
      </span>
    ));
    
    return element;
  };

  // Calcular totales para el modal
  const calculateTotals = () => {
    if (allBookingsInSale.length === 0 && bookingLoaded) {
      return {
        totalRooms: 1,
        totalNights: bookingLoaded.nights || 0,
        totalAmount: Number(bookingLoaded.total_price || 0)
      };
    }
    
    return allBookingsInSale.reduce((acc, booking) => ({
      totalRooms: acc.totalRooms + 1,
      totalNights: acc.totalNights + (booking.nights || 0),
      totalAmount: acc.totalAmount + Number(booking.total_price || 0)
    }), { totalRooms: 0, totalNights: 0, totalAmount: 0 });
  };

  const totals = calculateTotals();

  return (
    <>
      <Table
        gridRef={gridRef}
        title="Reservas de Hotel"
        rest={bookingsRest}
        filterValue={getFilterValue()}
        withRelations="item,sale,sale.status"
        toolBar={(container) => {
          container.unshift(
            {
              widget: 'dxButton',
              location: 'before',
              options: {
                text: 'Todas',
                type: statusFilter === 'all' ? 'default' : 'normal',
                stylingMode: statusFilter === 'all' ? 'contained' : 'outlined',
                onClick: () => setStatusFilter('all')
              }
            },
            {
              widget: 'dxButton',
              location: 'before',
              options: {
                text: 'Pendientes',
                type: statusFilter === 'pending' ? 'default' : 'normal',
                stylingMode: statusFilter === 'pending' ? 'contained' : 'outlined',
                onClick: () => setStatusFilter('pending')
              }
            },
            {
              widget: 'dxButton',
              location: 'before',
              options: {
                text: 'Confirmadas',
                type: statusFilter === 'confirmed' ? 'default' : 'normal',
                stylingMode: statusFilter === 'confirmed' ? 'contained' : 'outlined',
                onClick: () => setStatusFilter('confirmed')
              }
            },
            {
              widget: 'dxButton',
              location: 'before',
              options: {
                text: 'Completadas',
                type: statusFilter === 'completed' ? 'default' : 'normal',
                stylingMode: statusFilter === 'completed' ? 'contained' : 'outlined',
                onClick: () => setStatusFilter('completed')
              }
            },
            {
              widget: 'dxButton',
              location: 'before',
              options: {
                text: 'Canceladas',
                type: statusFilter === 'cancelled' ? 'default' : 'normal',
                stylingMode: statusFilter === 'cancelled' ? 'contained' : 'outlined',
                onClick: () => setStatusFilter('cancelled')
              }
            }
          );
          container.unshift({
            widget: 'dxButton',
            location: 'after',
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
            dataField: 'sale.code',
            caption: 'Orden',
            width: '250px',
            cellTemplate: (container, { data }) => {
              container.css('cursor', 'pointer');
              container.on('click', () => {
                onModalOpen(data.id);
              });
              ReactAppend(container,
                <p className="mb-0" style={{ width: '100%' }}>
                  <b className="d-block">
                    {data.sale?.fullname || data.sale?.name || 'N/A'}
                  </b>
                  <small
                    className="text-nowrap text-muted"
                    style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      fontFamily: 'monospace',
                    }}
                  >
                    #{Global.APP_CORRELATIVE}-{data.sale?.code || 'N/A'}
                  </small>
                </p>
              );
            }
          },
          {
            dataField: 'created_at',
            caption: 'Fecha',
            dataType: 'date',
            sortOrder: 'desc',
            cellTemplate: (container, { data }) => {
              container.text(moment(data.created_at).subtract(5, 'hours').format("LLL"));
            }
          },
          {
            dataField: 'item.name',
            caption: 'Habitación',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <strong>{data.item?.name || 'N/A'}</strong>
                  <div className="small text-muted text-capitalize">
                    {data.item?.room_type || ''}
                  </div>
                </div>
              );
            }
          },
          {
            dataField: 'check_in',
            caption: 'Check In / Out',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <div className="small">
                    <i className="mdi mdi-calendar-arrow-right text-success mr-1"></i>
                    {formatDate(data.check_in)}
                  </div>
                  <div className="small">
                    <i className="mdi mdi-calendar-arrow-left text-danger mr-1"></i>
                    {formatDate(data.check_out)}
                  </div>
                  <div className="small text-muted">
                    <i className="mdi mdi-weather-night mr-1"></i>
                    {data.nights} noche{data.nights !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            }
          },
          {
            dataField: 'guests',
            caption: 'Huéspedes',
            width: '90px',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div className="text-center">
                  <i className="mdi mdi-account-multiple text-primary"></i> {data.guests}
                </div>
              );
            }
          },
          {
            dataField: 'total_price',
            caption: 'Total',
            cellTemplate: (container, { data }) => {
              ReactAppend(container,
                <div>
                  <strong className="text-success">
                    {CurrencySymbol()} {Number2Currency(data.total_price || 0)}
                  </strong>
                </div>
              );
            }
          },
          {
            dataField: 'sale.status.name',
            caption: 'Estado Pago',
            cellTemplate: (container, { data }) => {
              const status = data.sale?.status;
              ReactAppend(container,
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: status?.color ? `${status.color}2e` : '#3333332e',
                    color: status?.color ?? '#333',
                  }}
                >
                  {status?.name || 'Sin estado'}
                </span>
              );
            }
          },
          {
            dataField: 'status',
            caption: 'Estado Reserva',
            cellTemplate: (container, { data }) => {
              const { badge, label } = getStatusBadge(data.status);
              ReactAppend(container,
                <span className={`badge ${badge}`}>{label}</span>
              );
            }
          },
          {
            caption: 'Acciones',
            width: '100px',
            cellTemplate: (container, { data }) => {
              container.css('text-overflow', 'unset');
              container.append(DxButton({
                className: 'btn btn-xs btn-light mr-1',
                title: 'Ver pedido',
                icon: 'fa fa-eye',
                onClick: () => onModalOpen(data.id)
              }));
              container.append(DxButton({
                className: 'btn btn-xs btn-soft-danger',
                title: 'Eliminar',
                icon: 'fa fa-trash',
                onClick: () => onDeleteClicked(data.id)
              }));
            },
            allowFiltering: false,
            allowExporting: false
          }
        ]}
      />

      {/* Modal de Detalles - Similar a Sales.jsx */}
      <Modal
        modalRef={modalRef}
        title={`Detalles de la reserva #${Global.APP_CORRELATIVE}-${bookingLoaded?.sale?.code || ''}`}
        size="xl"
        bodyStyle={{
          backgroundColor: "#ebeff2",
        }}
        hideButtonSubmit
      >
        <div className="row">
          {/* Columna Izquierda - Detalles */}
          <div className="col-md-8">
            {/* Información del Cliente */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-account mr-1"></i>
                  Información del Cliente
                </h5>
              </div>
              <div className="card-body p-2">
                <table className="table table-borderless table-sm mb-0">
                  <tbody>
                    <tr>
                      <th width="30%">Nombre:</th>
                      <td>{bookingLoaded?.sale?.fullname || bookingLoaded?.sale?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Email:</th>
                      <td>
                        <a href={`mailto:${bookingLoaded?.sale?.email}`}>
                          {bookingLoaded?.sale?.email || 'N/A'}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th>Teléfono:</th>
                      <td>
                        <a href={`tel:${bookingLoaded?.sale?.phone}`}>
                          {bookingLoaded?.sale?.phone_prefix || ''}{bookingLoaded?.sale?.phone || 'N/A'}
                        </a>
                      </td>
                    </tr>
                    {(bookingLoaded?.sale?.documentType || bookingLoaded?.sale?.document_type) && (
                      <tr>
                        <th>Documento:</th>
                        <td>
                          {bookingLoaded?.sale?.documentType || bookingLoaded?.sale?.document_type}: {bookingLoaded?.sale?.document || 'N/A'}
                        </td>
                      </tr>
                    )}
                    {bookingLoaded?.sale?.businessName && (
                      <tr>
                        <th>Razón Social:</th>
                        <td>{bookingLoaded?.sale?.businessName}</td>
                      </tr>
                    )}
                    {bookingLoaded?.sale?.invoiceType && (
                      <tr>
                        <th>Comprobante:</th>
                        <td className="text-capitalize">{bookingLoaded?.sale?.invoiceType}</td>
                      </tr>
                    )}
                    {bookingLoaded?.sale?.payment_method && (
                      <tr>
                        <th>Método de Pago:</th>
                        <td className="text-capitalize">{bookingLoaded?.sale?.payment_method}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Habitaciones Reservadas */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-bed-double mr-1"></i>
                  Habitaciones Reservadas ({allBookingsInSale.length || 1})
                </h5>
              </div>
              <div className="card-body p-2 table-responsive">
                <table className="table table-striped table-bordered table-sm table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Habitación</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Noches</th>
                      <th>Huéspedes</th>
                      <th>Precio/Noche</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(allBookingsInSale.length > 0 ? allBookingsInSale : [bookingLoaded]).map((booking, index) => {
                      if (!booking) return null;
                      const statusInfo = getStatusBadge(booking.status);
                      return (
                        <tr key={index}>
                          <td>
                            <strong>{booking.item?.name || 'N/A'}</strong>
                            <div className="small text-muted text-capitalize">
                              {booking.item?.room_type || ''}
                            </div>
                          </td>
                          <td>
                            <i className="mdi mdi-calendar-arrow-right text-success mr-1"></i>
                            {formatDate(booking.check_in)}
                          </td>
                          <td>
                            <i className="mdi mdi-calendar-arrow-left text-danger mr-1"></i>
                            {formatDate(booking.check_out)}
                          </td>
                          <td className="text-center">{booking.nights}</td>
                          <td className="text-center">
                            {booking.guests}
                            <div className="small text-muted">
                              {booking.adults || booking.guests} adulto{(booking.adults || booking.guests) !== 1 ? 's' : ''}
                              {booking.children > 0 && `, ${booking.children} niño${booking.children !== 1 ? 's' : ''}`}
                            </div>
                          </td>
                          <td className="text-right">
                            {CurrencySymbol()} {Number2Currency(booking.price_per_night || 0)}
                          </td>
                          <td className="text-right">
                            <strong>{CurrencySymbol()} {Number2Currency(booking.total_price || 0)}</strong>
                          </td>
                          <td>
                            <span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen de Totales */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-calculator mr-1"></i>
                  Resumen
                </h5>
              </div>
              <div className="card-body p-2">
                <div className="d-flex justify-content-between">
                  <b>Total Habitaciones:</b>
                  <span>{totals.totalRooms}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <b>Total Noches:</b>
                  <span>{totals.totalNights}</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between">
                  <b>Total:</b>
                  <span>
                    <strong>{CurrencySymbol()} {Number2Currency(totals.totalAmount)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Comprobante de Pago */}
            {bookingLoaded?.sale?.payment_proof && (
              <div className="card">
                <div className="card-header p-2">
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-file-image mr-1"></i>
                    Comprobante de Pago
                  </h5>
                </div>
                <div className="card-body p-2 text-center">
                  <Tippy content="Ver comprobante de pago" placement="top">
                    <a
                      href={`/storage/images/sale/${bookingLoaded.sale.payment_proof}`}
                      target="_blank"
                    >
                      <img
                        src={`/storage/images/sale/${bookingLoaded.sale.payment_proof}`}
                        alt="Comprobante de pago"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", cursor: "pointer" }}
                      />
                    </a>
                  </Tippy>
                </div>
              </div>
            )}

            {/* Solicitudes Especiales */}
            {bookingLoaded?.special_requests && (
              <div className="card">
                <div className="card-header p-2">
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-note-text mr-1"></i>
                    Solicitudes Especiales
                  </h5>
                </div>
                <div className="card-body p-2">
                  <div className="alert alert-light border mb-0">
                    {bookingLoaded.special_requests}
                  </div>
                </div>
              </div>
            )}

            {/* Comentarios del Cliente */}
            {bookingLoaded?.sale?.comment && (
              <div className="card">
                <div className="card-header p-2">
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-comment-text mr-1"></i>
                    Comentarios del Cliente
                  </h5>
                </div>
                <div className="card-body p-2">
                  <div className="alert alert-info mb-0">
                    {bookingLoaded.sale.comment}
                  </div>
                </div>
              </div>
            )}

            {/* Razón de Cancelación */}
            {bookingLoaded?.cancellation_reason && (
              <div className="card">
                <div className="card-header p-2 bg-danger text-white">
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-alert-circle mr-1"></i>
                    Razón de Cancelación
                  </h5>
                </div>
                <div className="card-body p-2">
                  <div className="alert alert-danger mb-0">
                    {bookingLoaded.cancellation_reason}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna Derecha - Estado y Acciones */}
          <div className="col-md-4">
            {/* Estado del Pedido (Sale) */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-clipboard-check mr-1"></i>
                  Estado del Pedido
                </h5>
              </div>
              <div className="card-body p-2 position-relative" id="statusSelectContainer">
                {statusLoading && (
                  <div className="position-absolute d-flex align-items-center justify-content-center" style={{
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.125)',
                    backdropFilter: 'blur(2px)',
                    cursor: 'not-allowed'
                  }}>
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <SelectFormGroup 
                  label='Estado actual' 
                  dropdownParent='#statusSelectContainer' 
                  minimumResultsForSearch={-1} 
                  templateResult={statusTemplate} 
                  templateSelection={statusTemplate} 
                  onChange={(e) => onStatusChange(e, bookingLoaded)} 
                  value={bookingLoaded?.sale?.status_id} 
                  changeWith={[bookingLoaded]} 
                  disabled={statusLoading || bookingLoaded?.sale?.status?.reversible == 0}
                >
                  {statuses.map((status, index) => (
                    <option key={index} value={status.id} data-status={JSON.stringify(status)}>
                      {status.name}
                    </option>
                  ))}
                </SelectFormGroup>
                <div className="form-check" style={{
                  cursor: bookingLoaded?.sale?.status?.reversible == 0 ? 'not-allowed' : 'pointer'
                }}>
                  <input
                    ref={notifyClientRef}
                    className="form-check-input"
                    type="checkbox"
                    id="notifyClient"
                    defaultChecked
                    disabled={bookingLoaded?.sale?.status?.reversible == 0}
                    style={{
                      cursor: bookingLoaded?.sale?.status?.reversible == 0 ? 'not-allowed' : 'pointer'
                    }}
                  />
                  <label className="form-check-label" htmlFor="notifyClient" style={{
                    cursor: bookingLoaded?.sale?.status?.reversible == 0 ? 'not-allowed' : 'pointer'
                  }}>
                    Notificar al cliente
                  </label>
                </div>
              </div>
            </div>

            {/* Historial de Cambios de Estado */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-history mr-1"></i>
                  Historial de Estados
                </h5>
              </div>
              <div className="card-body p-2 d-flex flex-column gap-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {saleStatuses.length > 0 ? (
                  saleStatuses.map((ss, index) => {
                    const statusData = statuses.find(s => s.id === ss.status_id || s.name === ss.name);
                    const statusColor = statusData?.color || ss.color || "#333";
                    
                    return (
                      <article
                        key={index}
                        className="border py-1 px-2 ms-3"
                        style={{
                          position: "relative",
                          borderRadius: "16px 4px 4px 16px",
                          backgroundColor: statusColor ? `${statusColor}2e` : "#3333332e",
                        }}
                      >
                        <i
                          className={`${ss.icon || statusData?.icon || 'mdi mdi-circle'} left-2`}
                          style={{
                            color: statusColor,
                            position: "absolute",
                            left: "-25px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        ></i>
                        <b style={{ color: statusColor }}>
                          {ss?.name}
                        </b>
                        <small className="d-block text-truncate">
                          {ss?.user_name} {ss?.user_lastname}
                        </small>
                        <small className="d-block text-muted">
                          {moment(ss.created_at).format("YYYY-MM-DD HH:mm")}
                        </small>
                      </article>
                    );
                  })
                ) : (
                  <div className="text-muted text-center py-2">
                    <i className="mdi mdi-information-outline mr-1"></i>
                    Sin historial de estados
                  </div>
                )}
              </div>
            </div>

            {/* Estado de la Reserva */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-calendar-check mr-1"></i>
                  Estado de la Reserva
                </h5>
              </div>
              <div className="card-body p-2">
                <div className="mb-2">
                  <strong>Estado actual:</strong>{' '}
                  <span className={`badge ${getStatusBadge(bookingLoaded?.status).badge}`}>
                    {getStatusBadge(bookingLoaded?.status).label}
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {bookingLoaded?.status === 'pending' && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-success"
                      onClick={() => onConfirmBooking(bookingLoaded.id)}
                    >
                      <i className="mdi mdi-check-circle mr-1"></i> Confirmar
                    </button>
                  )}
                  {bookingLoaded?.status === 'confirmed' && (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-info"
                        onClick={() => onCompleteBooking(bookingLoaded.id)}
                      >
                        <i className="mdi mdi-check-all mr-1"></i> Completar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-secondary"
                        onClick={() => onNoShowBooking(bookingLoaded.id)}
                      >
                        <i className="mdi mdi-account-off mr-1"></i> No Show
                      </button>
                    </>
                  )}
                  {['pending', 'confirmed'].includes(bookingLoaded?.status) && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => onCancelBooking(bookingLoaded.id)}
                    >
                      <i className="mdi mdi-close-circle mr-1"></i> Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Información de Fechas */}
            <div className="card">
              <div className="card-header p-2">
                <h5 className="card-title mb-0">
                  <i className="mdi mdi-clock-outline mr-1"></i>
                  Información de Registro
                </h5>
              </div>
              <div className="card-body p-2">
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td><strong>Creado:</strong></td>
                      <td>{formatDateTime(bookingLoaded?.created_at)}</td>
                    </tr>
                    {bookingLoaded?.confirmed_at && (
                      <tr>
                        <td><strong>Confirmado:</strong></td>
                        <td>{formatDateTime(bookingLoaded?.confirmed_at)}</td>
                      </tr>
                    )}
                    {bookingLoaded?.cancelled_at && (
                      <tr>
                        <td><strong>Cancelado:</strong></td>
                        <td>{formatDateTime(bookingLoaded?.cancelled_at)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title='Reservas de Hotel'>
      <Bookings {...properties} />
    </BaseAdminto>
  );
});
