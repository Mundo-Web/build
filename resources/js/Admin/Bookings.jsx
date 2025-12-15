import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import BookingsRest from '../Actions/Admin/BookingsRest';
import Table from '../Components/Adminto/Table';
import DxButton from '../Components/dx/DxButton';
import CreateReactScript from '../Utils/CreateReactScript';
import ReactAppend from '../Utils/ReactAppend';
import Swal from 'sweetalert2';

const bookingsRest = new BookingsRest();

const Bookings = () => {
  const gridRef = useRef();
  const [statusFilter, setStatusFilter] = useState('all');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getRestParams = () => {
    const filters = [];
    if (statusFilter !== 'all') {
      filters.push(['status', '=', statusFilter]);
    }
    return {
      filters: JSON.stringify(filters),
      orderBy: 'check_in',
      orderDirection: 'desc'
    };
  };

  useEffect(() => {
    if (gridRef.current) {
      $(gridRef.current).dxDataGrid('instance').refresh();
    }
  }, [statusFilter]);

  const onViewDetails = (booking) => {
    const modalId = 'modal-booking-details';
    
    const guestInfo = booking.guest_info ? JSON.parse(booking.guest_info) : {};
    
    const statusBadges = {
      pending: '<span class="badge badge-warning">Pendiente</span>',
      confirmed: '<span class="badge badge-success">Confirmada</span>',
      cancelled: '<span class="badge badge-danger">Cancelada</span>',
      completed: '<span class="badge badge-info">Completada</span>',
      no_show: '<span class="badge badge-secondary">No Show</span>',
    };

    const form = `
      <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" data-backdrop="static">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="mdi mdi-calendar-check mr-2"></i>
                Detalles de la Reserva #${booking.id?.substring(0, 8)}
              </h5>
              <button type="button" class="close text-white" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row mb-3">
                <div class="col-12">
                  <div class="alert alert-light border">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Estado:</strong> ${statusBadges[booking.status] || booking.status}
                      </div>
                      <div>
                        <strong>Código de Reserva:</strong> <code>${booking.booking_code || 'N/A'}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <h6 class="text-primary"><i class="mdi mdi-bed-double mr-1"></i> Información de la Habitación</h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>Habitación:</strong></td>
                      <td>${booking.item?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Tipo:</strong></td>
                      <td>${booking.item?.room_type || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Check-in:</strong></td>
                      <td><i class="mdi mdi-calendar-arrow-right text-success"></i> ${formatDate(booking.check_in)}</td>
                    </tr>
                    <tr>
                      <td><strong>Check-out:</strong></td>
                      <td><i class="mdi mdi-calendar-arrow-left text-danger"></i> ${formatDate(booking.check_out)}</td>
                    </tr>
                    <tr>
                      <td><strong>Noches:</strong></td>
                      <td>${booking.nights} noche${booking.nights !== 1 ? 's' : ''}</td>
                    </tr>
                  </table>
                </div>

                <div class="col-md-6">
                  <h6 class="text-primary"><i class="mdi mdi-account-multiple mr-1"></i> Información de Huéspedes</h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>Total de Huéspedes:</strong></td>
                      <td>${booking.guests} persona${booking.guests !== 1 ? 's' : ''}</td>
                    </tr>
                    <tr>
                      <td><strong>Adultos:</strong></td>
                      <td>${booking.adults}</td>
                    </tr>
                    <tr>
                      <td><strong>Niños:</strong></td>
                      <td>${booking.children}</td>
                    </tr>
                    ${guestInfo.name ? `
                    <tr>
                      <td><strong>Nombre:</strong></td>
                      <td>${guestInfo.name}</td>
                    </tr>
                    ` : ''}
                    ${guestInfo.email ? `
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>${guestInfo.email}</td>
                    </tr>
                    ` : ''}
                    ${guestInfo.phone ? `
                    <tr>
                      <td><strong>Teléfono:</strong></td>
                      <td>${guestInfo.phone}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-12">
                  <h6 class="text-primary"><i class="mdi mdi-currency-usd mr-1"></i> Información de Pago</h6>
                  <table class="table table-sm">
                    <tr>
                      <td><strong>Precio Base (por noche):</strong></td>
                      <td>S/ ${Number(booking.base_price || 0).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td><strong>Total:</strong></td>
                      <td class="text-success"><strong>S/ ${Number(booking.total_price || 0).toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td><strong>ID de Venta:</strong></td>
                      <td><a href="/admin/sales?id=${booking.sale_id}" target="_blank">${booking.sale_id?.substring(0, 8)}</a></td>
                    </tr>
                  </table>
                </div>
              </div>

              ${booking.special_requests ? `
              <div class="row mt-3">
                <div class="col-12">
                  <h6 class="text-primary"><i class="mdi mdi-note-text mr-1"></i> Solicitudes Especiales</h6>
                  <div class="alert alert-light border">
                    ${booking.special_requests}
                  </div>
                </div>
              </div>
              ` : ''}

              ${booking.cancellation_reason ? `
              <div class="row mt-3">
                <div class="col-12">
                  <h6 class="text-danger"><i class="mdi mdi-alert-circle mr-1"></i> Razón de Cancelación</h6>
                  <div class="alert alert-danger">
                    ${booking.cancellation_reason}
                  </div>
                </div>
              </div>
              ` : ''}

              <div class="row mt-3">
                <div class="col-12">
                  <small class="text-muted">
                    <strong>Creado:</strong> ${formatDateTime(booking.created_at)}
                    ${booking.updated_at ? ` | <strong>Actualizado:</strong> ${formatDateTime(booking.updated_at)}` : ''}
                  </small>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="btn-group mr-auto" role="group">
                ${booking.status === 'pending' ? `
                  <button type="button" class="btn btn-success" id="btn-confirm-booking" data-booking-id="${booking.id}">
                    <i class="mdi mdi-check-circle mr-1"></i> Confirmar
                  </button>
                ` : ''}
                ${booking.status === 'confirmed' ? `
                  <button type="button" class="btn btn-info" id="btn-complete-booking" data-booking-id="${booking.id}">
                    <i class="mdi mdi-check-all mr-1"></i> Marcar como Completada
                  </button>
                ` : ''}
                ${['pending', 'confirmed'].includes(booking.status) ? `
                  <button type="button" class="btn btn-danger" id="btn-cancel-booking" data-booking-id="${booking.id}">
                    <i class="mdi mdi-close-circle mr-1"></i> Cancelar Reserva
                  </button>
                ` : ''}
              </div>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                <i class="mdi mdi-close mr-1"></i> Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    ReactAppend(form, 'modal-booking-details');
    $(`#${modalId}`).modal('show');
    $(`#${modalId}`).on('hidden.bs.modal', function () {
      $(this).remove();
    });

    // Event handlers para los botones de acción
    $('#btn-confirm-booking').on('click', function() {
      const bookingId = $(this).data('booking-id');
      onConfirmBooking(bookingId);
    });

    $('#btn-complete-booking').on('click', function() {
      const bookingId = $(this).data('booking-id');
      onCompleteBooking(bookingId);
    });

    $('#btn-cancel-booking').on('click', function() {
      const bookingId = $(this).data('booking-id');
      onCancelBooking(bookingId);
    });
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
          $('.modal').modal('hide');
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
          $('.modal').modal('hide');
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
          $('.modal').modal('hide');
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      cancelled: 'badge-danger',
      completed: 'badge-info',
      no_show: 'badge-secondary',
    };
    
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
      no_show: 'No Show',
    };

    return { badge: badges[status] || 'badge-secondary', label: labels[status] || status };
  };

  return (
    <Table
      gridRef={gridRef}
      title="Reservas"
      rest={bookingsRest}
      restParams={getRestParams()}
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
          dataField: 'booking_code',
          caption: 'Código',
          width: '12%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container,
              <code>{data.booking_code || data.id?.substring(0, 8)}</code>
            );
          }
        },
        {
          dataField: 'item.name',
          caption: 'Habitación',
          width: '18%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container,
              <div>
                <strong>{data.item?.name || 'N/A'}</strong>
                <div className="small text-muted">{data.item?.room_type || ''}</div>
              </div>
            );
          }
        },
        {
          dataField: 'check_in',
          caption: 'Check-in / Check-out',
          width: '18%',
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
                <div className="small text-muted">{data.nights} noche{data.nights !== 1 ? 's' : ''}</div>
              </div>
            );
          }
        },
        {
          dataField: 'guests',
          caption: 'Huéspedes',
          width: '12%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container,
              <div className="text-center">
                <div>
                  <i className="mdi mdi-account-multiple text-primary"></i> {data.guests}
                </div>
                <div className="small text-muted">
                  {data.adults} adulto{data.adults !== 1 ? 's' : ''}
                  {data.children > 0 && `, ${data.children} niño${data.children !== 1 ? 's' : ''}`}
                </div>
              </div>
            );
          }
        },
        {
          dataField: 'total_price',
          caption: 'Total',
          width: '12%',
          cellTemplate: (container, { data }) => {
            ReactAppend(container,
              <strong className="text-success">S/ {Number(data.total_price || 0).toFixed(2)}</strong>
            );
          }
        },
        {
          dataField: 'status',
          caption: 'Estado',
          width: '12%',
          cellTemplate: (container, { data }) => {
            const { badge, label } = getStatusBadge(data.status);
            ReactAppend(container,
              <span className={`badge ${badge}`}>{label}</span>
            );
          }
        },
        {
          caption: 'Acciones',
          cellTemplate: (container, { data }) => {
            container.css('text-overflow', 'unset');
            container.append(DxButton({
              className: 'btn btn-xs btn-soft-primary',
              title: 'Ver Detalles',
              icon: 'fa fa-eye',
              onClick: () => onViewDetails(data)
            }));
          },
          allowFiltering: false,
          allowExporting: false
        }
      ]}
    />
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<BaseAdminto {...properties} title='Reservas'>
    <Bookings {...properties} />
  </BaseAdminto>);
});
