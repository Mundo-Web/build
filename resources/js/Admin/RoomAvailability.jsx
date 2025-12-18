import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import BaseAdminto from '@Adminto/Base';
import CreateReactScript from '../Utils/CreateReactScript';
import { Cookies } from 'sode-extend-react';
import Swal from 'sweetalert2';
import Number2Currency, { CurrencySymbol } from '../Utils/Number2Currency';
import Modal from '../Components/Adminto/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

const RoomAvailability = ({ rooms = [] }) => {
  const modalCalendarRef = useRef();
  const modalBlockRef = useRef();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [roomsSummary, setRoomsSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [calendarData, setCalendarData] = useState(null);
  const [calendarLoading, setCalendarLoading] = useState(false);
  
  // Estados para bloqueo de fechas
  const [blockStartDate, setBlockStartDate] = useState(null);
  const [blockEndDate, setBlockEndDate] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockAction, setBlockAction] = useState(true); // true = bloquear, false = desbloquear

  // Cargar resumen de habitaciones
  const loadSummary = async (date = selectedDate) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/admin/room-availability/summary?date=${dateStr}`, {
        headers: {
          'Accept': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        }
      });
      const result = await response.json();
      if (result.status === 200) {
        setRoomsSummary(result.data.rooms || []);
      }
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  // Cambiar fecha del resumen
  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadSummary(date);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    const colors = {
      available: { bg: '#d4edda', text: '#155724', label: 'Disponible' },
      occupied: { bg: '#f8d7da', text: '#721c24', label: 'Ocupada' },
      reserved: { bg: '#fff3cd', text: '#856404', label: 'Reservada' },
      blocked: { bg: '#e2e3e5', text: '#383d41', label: 'Bloqueada' },
      full: { bg: '#cce5ff', text: '#004085', label: 'Sin disponibilidad' },
    };
    return colors[status] || colors.available;
  };

  // Abrir modal de calendario
  const openCalendarModal = async (room) => {
    setSelectedRoom(room);
    setCalendarLoading(true);
    $(modalCalendarRef.current).modal('show');
    
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);
      
      const response = await fetch(
        `/api/admin/room-availability/${room.id}/calendar?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`,
        {
          headers: {
            'Accept': 'application/json',
            'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
          }
        }
      );
      const result = await response.json();
      if (result.status === 200) {
        setCalendarData(result.data);
      }
    } catch (error) {
      console.error('Error al cargar calendario:', error);
    }
    setCalendarLoading(false);
  };

  // Abrir modal de bloqueo
  const openBlockModal = (room) => {
    setSelectedRoom(room);
    setBlockStartDate(new Date());
    setBlockEndDate(new Date());
    setBlockReason('');
    setBlockAction(true);
    $(modalBlockRef.current).modal('show');
  };

  // Bloquear/Desbloquear fechas
  const handleBlockDates = async () => {
    if (!blockStartDate || !blockEndDate) {
      Swal.fire('Error', 'Selecciona las fechas', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/admin/room-availability/${selectedRoom.id}/block`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: JSON.stringify({
          start_date: blockStartDate.toISOString().split('T')[0],
          end_date: blockEndDate.toISOString().split('T')[0],
          block: blockAction,
          reason: blockReason,
        })
      });
      
      const result = await response.json();
      if (result.status === 200) {
        Swal.fire('¡Éxito!', result.message, 'success');
        $(modalBlockRef.current).modal('hide');
        loadSummary();
        if (calendarData) {
          openCalendarModal(selectedRoom);
        }
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
    }
  };

  // Generar disponibilidad
  const handleGenerateAvailability = async (roomId) => {
    const result = await Swal.fire({
      title: 'Generar disponibilidad',
      text: '¿Generar disponibilidad para los próximos 365 días?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/room-availability/${roomId}/generate`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: JSON.stringify({ days: 365 })
      });
      
      const data = await response.json();
      if (data.status === 200) {
        Swal.fire('¡Éxito!', data.message, 'success');
        loadSummary();
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al generar disponibilidad', 'error');
    }
  };

  // Normalizar fecha a formato YYYY-MM-DD
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  // Renderizar calendario visual
  const renderCalendar = () => {
    if (!calendarData) return null;
    
    const { availability, bookings } = calendarData;
    
    // Crear mapa de fechas con reservas
    const bookingsByDate = {};
    bookings?.forEach(booking => {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      let current = new Date(start);
      
      while (current < end) {
        const dateStr = normalizeDate(current);
        if (!bookingsByDate[dateStr]) {
          bookingsByDate[dateStr] = [];
        }
        bookingsByDate[dateStr].push(booking);
        current.setDate(current.getDate() + 1);
      }
    });

    // Agrupar por mes
    const months = {};
    availability?.forEach(day => {
      const normalizedDate = normalizeDate(day.date);
      const date = new Date(day.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      months[monthKey].push({
        ...day,
        date: normalizedDate, // Usar fecha normalizada
        bookings: bookingsByDate[normalizedDate] || []
      });
    });

    return Object.entries(months).map(([monthKey, days]) => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(year, month - 1).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
      
      return (
        <div key={monthKey} className="mb-4">
          <h5 className="text-capitalize mb-3">{monthName}</h5>
          <div className="d-flex flex-wrap gap-1">
            {days.map(day => {
              const date = new Date(day.date);
              const dayNum = date.getDate();
              const isBlocked = day.is_blocked;
              const hasBookings = day.bookings.length > 0;
              const isAvailable = day.available_rooms > 0 && !isBlocked;
              
              let bgColor = '#d4edda'; // Verde - disponible
              let textColor = '#155724';
              
              if (isBlocked) {
                bgColor = '#e2e3e5';
                textColor = '#383d41';
              } else if (hasBookings) {
                bgColor = '#f8d7da'; // Rojo - ocupado
                textColor = '#721c24';
              } else if (day.available_rooms === 0) {
                bgColor = '#fff3cd'; // Amarillo - sin disponibilidad
                textColor = '#856404';
              }

              return (
                <div
                  key={day.date}
                  className="text-center rounded p-1"
                  style={{
                    width: '40px',
                    height: '50px',
                    backgroundColor: bgColor,
                    color: textColor,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title={`${day.date}\nDisponibles: ${day.available_rooms}\nReservados: ${day.booked_rooms}${isBlocked ? '\n⛔ Bloqueado' : ''}${day.bookings.map(b => `\n👤 ${b.sale?.name || 'Cliente'}`).join('')}`}
                >
                  <div className="font-weight-bold">{dayNum}</div>
                  <small>{day.available_rooms}/{selectedRoom?.total_rooms || 1}</small>
                  {isBlocked && <i className="mdi mdi-lock text-danger" style={{ fontSize: '10px' }}></i>}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="header-title mb-0">
                  <i className="mdi mdi-calendar-check mr-2"></i>
                  Disponibilidad de Habitaciones
                </h4>
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <label className="small text-muted mb-1 d-block">Fecha de consulta:</label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      className="form-control form-control-sm"
                    />
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => loadSummary()}
                    disabled={loading}
                  >
                    <i className="mdi mdi-refresh mr-1"></i>
                    {loading ? 'Cargando...' : 'Actualizar'}
                  </button>
                </div>
              </div>

              {/* Leyenda */}
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <span className="badge px-3 py-2" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                  <i className="mdi mdi-check-circle mr-1"></i> Disponible
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                  <i className="mdi mdi-bed mr-1"></i> Ocupada
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                  <i className="mdi mdi-clock mr-1"></i> Reservada (pendiente)
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#e2e3e5', color: '#383d41' }}>
                  <i className="mdi mdi-lock mr-1"></i> Bloqueada
                </span>
              </div>

              {/* Grid de habitaciones */}
              <div className="row">
                {roomsSummary.map(room => {
                  const statusInfo = getStatusColor(room.status);
                  return (
                    <div key={room.id} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                      <div 
                        className="card h-100 border shadow-sm"
                        style={{ borderLeft: `4px solid ${statusInfo.text}` }}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex">
                            {/* Imagen */}
                            <div className="mr-3" style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                              <img
                                src={`/storage/images/item/${room.image}`}
                                alt={room.name}
                                className="rounded"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.src = '/assets/img/noimage/no_img.jpg'; }}
                              />
                            </div>
                            
                            {/* Info */}
                            <div className="flex-grow-1">
                              <h5 className="mb-1">{room.name}</h5>
                              <span 
                                className="badge mb-2"
                                style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                              >
                                {statusInfo.label}
                              </span>
                              
                              <div className="small text-muted">
                                <i className="mdi mdi-bed mr-1"></i>
                                {room.available_rooms}/{room.total_rooms} disponibles
                              </div>
                              <div className="small text-muted">
                                <i className="mdi mdi-account-multiple mr-1"></i>
                                Máx. {room.max_occupancy} personas
                              </div>
                              <div className="small text-success font-weight-bold">
                                {CurrencySymbol()} {Number2Currency(room.price || 0)} /noche
                              </div>
                            </div>
                          </div>

                          {/* Huésped activo */}
                          {room.active_booking && (
                            <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                              <div className="small font-weight-bold text-primary mb-1">
                                <i className="mdi mdi-account mr-1"></i>
                                Huésped actual:
                              </div>
                              <div className="small">{room.active_booking.guest_name}</div>
                              <div className="small text-muted">
                                <i className="mdi mdi-calendar-range mr-1"></i>
                                {new Date(room.active_booking.check_in).toLocaleDateString('es-PE')} - {new Date(room.active_booking.check_out).toLocaleDateString('es-PE')}
                              </div>
                              <div className="small text-muted">
                                <i className="mdi mdi-weather-night mr-1"></i>
                                {room.active_booking.nights} noches · {room.active_booking.guests} huéspedes
                              </div>
                              <div className="small">
                                <span className={`badge badge-${room.active_booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                                  {room.active_booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Reservas próximas */}
                          {!room.active_booking && room.upcoming_bookings > 0 && (
                            <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#fff3cd' }}>
                              <div className="small font-weight-bold text-warning mb-1">
                                <i className="mdi mdi-calendar-clock mr-1"></i>
                                Próximas reservas:
                              </div>
                              <div className="small">
                                {room.upcoming_bookings} reserva{room.upcoming_bookings > 1 ? 's' : ''} en los próximos 7 días
                              </div>
                              <button 
                                className="btn btn-xs btn-outline-warning mt-1"
                                onClick={() => openCalendarModal(room)}
                              >
                                Ver calendario
                              </button>
                            </div>
                          )}

                          {/* Botones */}
                          <div className="mt-3 d-flex gap-2 flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openCalendarModal(room)}
                              title="Ver calendario"
                            >
                              <i className="mdi mdi-calendar"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => openBlockModal(room)}
                              title="Bloquear fechas"
                            >
                              <i className="mdi mdi-lock"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleGenerateAvailability(room.id)}
                              title="Generar disponibilidad"
                            >
                              <i className="mdi mdi-plus-circle"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {roomsSummary.length === 0 && !loading && (
                <div className="text-center text-muted py-5">
                  <i className="mdi mdi-bed-empty mdi-48px"></i>
                  <p className="mt-2">No hay habitaciones registradas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Calendario */}
      <Modal
        modalRef={modalCalendarRef}
        title={`Calendario - ${selectedRoom?.name || ''}`}
        size="lg"
        hideButtonSubmit
      >
        {calendarLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando calendario...</p>
          </div>
        ) : (
          <div>
            {/* Leyenda del calendario */}
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <span className="badge px-2 py-1" style={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '11px' }}>
                Disponible
              </span>
              <span className="badge px-2 py-1" style={{ backgroundColor: '#f8d7da', color: '#721c24', fontSize: '11px' }}>
                Ocupado
              </span>
              <span className="badge px-2 py-1" style={{ backgroundColor: '#fff3cd', color: '#856404', fontSize: '11px' }}>
                Sin disponibilidad
              </span>
              <span className="badge px-2 py-1" style={{ backgroundColor: '#e2e3e5', color: '#383d41', fontSize: '11px' }}>
                Bloqueado
              </span>
            </div>
            
            {renderCalendar()}

            {/* Reservas activas */}
            {calendarData?.bookings?.length > 0 && (
              <div className="mt-4">
                <h6>Reservas en este período:</h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Huésped</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calendarData.bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>
                            {booking.sale?.name} {booking.sale?.lastname}
                            <br/>
                            <small className="text-muted">{booking.sale?.email}</small>
                          </td>
                          <td>{new Date(booking.check_in).toLocaleDateString('es-PE')}</td>
                          <td>{new Date(booking.check_out).toLocaleDateString('es-PE')}</td>
                          <td>
                            <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                              {booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal Bloquear Fechas */}
      <Modal
        modalRef={modalBlockRef}
        title={`Bloquear/Desbloquear - ${selectedRoom?.name || ''}`}
        size="md"
        buttonSubmit="Aplicar"
        onSubmit={handleBlockDates}
      >
        <div className="form-group">
          <label>Acción</label>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="blockAction"
                checked={blockAction}
                onChange={() => setBlockAction(true)}
              />
              <label className="form-check-label" htmlFor="blockAction">
                <i className="mdi mdi-lock mr-1 text-danger"></i>
                Bloquear fechas
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id="unblockAction"
                checked={!blockAction}
                onChange={() => setBlockAction(false)}
              />
              <label className="form-check-label" htmlFor="unblockAction">
                <i className="mdi mdi-lock-open mr-1 text-success"></i>
                Desbloquear fechas
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Fecha inicio</label>
              <DatePicker
                selected={blockStartDate}
                onChange={(date) => setBlockStartDate(date)}
                selectsStart
                startDate={blockStartDate}
                endDate={blockEndDate}
                minDate={new Date()}
                locale={es}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Fecha fin</label>
              <DatePicker
                selected={blockEndDate}
                onChange={(date) => setBlockEndDate(date)}
                selectsEnd
                startDate={blockStartDate}
                endDate={blockEndDate}
                minDate={blockStartDate || new Date()}
                locale={es}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Razón (opcional)</label>
          <textarea
            className="form-control"
            rows="3"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Ej: Mantenimiento, limpieza profunda, evento privado..."
          />
        </div>

        <div className="alert alert-info">
          <i className="mdi mdi-information mr-1"></i>
          {blockAction 
            ? 'Las fechas bloqueadas no estarán disponibles para reservas.' 
            : 'Las fechas desbloqueadas volverán a estar disponibles para reservas.'}
        </div>
      </Modal>
    </>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <BaseAdminto {...properties} title='Disponibilidad de Habitaciones'>
      <RoomAvailability {...properties} />
    </BaseAdminto>
  );
});
