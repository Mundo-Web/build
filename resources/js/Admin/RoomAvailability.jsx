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
      endDate.setMonth(endDate.getMonth() + 3);
      
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
  const normalizeDate = (dateInput) => {
    if (!dateInput) return null;
    
    let date;
    if (typeof dateInput === 'string') {
      // Si es string, agregar T00:00:00 para evitar conversión UTC
      date = new Date(dateInput + 'T00:00:00');
    } else {
      // Si ya es un objeto Date, usarlo directamente
      date = dateInput;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Renderizar calendario visual
  const renderCalendar = () => {
    if (!calendarData) return null;
    
    const { availability, bookings } = calendarData;
    
    console.log('📅 DEBUG CALENDARIO:', {
      totalBookings: bookings?.length,
      bookings: bookings?.map(b => ({
        id: b.id,
        check_in: b.check_in,
        check_out: b.check_out,
        status: b.status,
        guest: b.sale?.name
      })),
      availabilityDates: availability?.slice(0, 5).map(d => d.date)
    });
    
    // Crear mapa de reservas por fecha
    const bookingsByDate = {};
    bookings?.forEach(booking => {
      // Parsear fechas manualmente para evitar problemas de UTC
      // booking.check_in puede venir como "2026-01-01" o "2026-01-01 00:00:00"
      const checkInDate = booking.check_in.split(' ')[0]; // Obtener solo YYYY-MM-DD
      const checkOutDate = booking.check_out.split(' ')[0];
      
      const [startYear, startMonth, startDay] = checkInDate.split('-');
      const [endYear, endMonth, endDay] = checkOutDate.split('-');
      
      const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, parseInt(startDay));
      const endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, parseInt(endDay));
      let current = new Date(startDate);
      
      // Incluir día de check-out para limpieza
      while (current <= endDate) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        if (!bookingsByDate[dateStr]) {
          bookingsByDate[dateStr] = [];
        }
        bookingsByDate[dateStr].push(booking);
        current.setDate(current.getDate() + 1);
      }
    });
    
    console.log('🗓️ MAPA DE BOOKINGS POR FECHA:', {
      totalDates: Object.keys(bookingsByDate).length,
      dates: Object.keys(bookingsByDate).slice(0, 10),
      sampleBooking: bookingsByDate[Object.keys(bookingsByDate)[0]]
    });

    // Agrupar por mes
    const months = {};
    availability?.forEach(day => {
      // Parsear fecha manualmente para evitar problemas de UTC
      // day.date viene como "2025-12-22T05:00:00.000000Z", extraer solo YYYY-MM-DD
      const dayDateStr = day.date.split('T')[0]; // "2026-01-01"
      const [year, month, dayNum] = dayDateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(dayNum));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      
      months[monthKey].push({
        ...day,
        date: dayDateStr, // Usar formato YYYY-MM-DD en lugar del timestamp
        bookings: bookingsByDate[dayDateStr] || [] // Buscar con YYYY-MM-DD
      });
    });
    
    console.log('📊 DÍAS CON BOOKINGS:', {
      totalDays: Object.values(months).flat().length,
      daysWithBookings: Object.values(months).flat().filter(d => d.bookings.length > 0).length,
      sample: Object.values(months).flat().slice(0, 5).map(d => ({
        date: d.date,
        bookings: d.bookings.length,
        statuses: d.bookings.map(b => b.status)
      }))
    });

    return Object.entries(months).map(([monthKey, days]) => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(year, month - 1).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
      
      return (
        <div key={monthKey} className="mb-4">
          <h5 className="text-capitalize mb-3">{monthName}</h5>
          <div className="d-flex flex-wrap gap-1">
            {days.map(day => {
              // Parsear fecha manualmente para evitar problemas de UTC
              const [year, month, dayNum] = day.date.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(dayNum));
              const dayNumber = date.getDate();
              const isBlocked = day.is_blocked;
              const hasBookings = day.bookings.length > 0;
              
              // Verificar si hay reservas confirmadas (check-in realizado) o pendientes (pagó pero sin check-in)
              const hasConfirmedBookings = day.bookings.some(b => b.status === 'confirmed');
              const hasPendingBookings = day.bookings.some(b => b.status === 'pending');
              
              let bgColor = '#d4edda'; // Verde - disponible
              let textColor = '#155724';
              let statusText = 'Disponible';
              
              if (isBlocked) {
                bgColor = '#e2e3e5';
                textColor = '#383d41';
                statusText = 'Bloqueada';
              } else if (hasConfirmedBookings) {
                bgColor = '#f8d7da'; // Rojo - ocupado (huésped activo, ya hizo check-in)
                textColor = '#721c24';
                statusText = 'Ocupada';
              } else if (hasPendingBookings) {
                bgColor = '#fff3cd'; // Amarillo - reservado (pagó pero sin check-in)
                textColor = '#856404';
                statusText = 'Reservada';
              } else if (day.available_rooms === 0) {
                bgColor = '#fff3cd'; // Amarillo - sin disponibilidad
                textColor = '#856404';
                statusText = 'Sin disponibilidad';
              }

              return (
                <div
                  key={day.date}
                  className="text-center rounded p-2 d-flex align-items-center justify-content-center position-relative"
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: bgColor,
                    color: textColor,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                  title={`${day.date}\n${statusText}${day.bookings.map(b => `\n👤 ${b.sale?.name || 'Cliente'}`).join('')}`}
                >
                  {dayNumber}
                  {isBlocked && <i className="mdi mdi-lock position-absolute" style={{ fontSize: '10px', top: '2px', right: '2px' }}></i>}
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
                            <div className="flex-grow-1 position-relative px-2">
                              <h5 className="mb-1">{room.name}</h5>
                              <span 
                                className="badge mb-2"
                                style={{ backgroundColor: statusInfo.bg, color: statusInfo.text }}
                              >
                                {statusInfo.label}
                              </span>
                              
                              <div className="small text-muted">
                                <i className="mdi mdi-bed mr-1"></i>
                                {room.available_rooms ? 'Disponible' : 'Reservada'}
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
                      {calendarData.bookings.map(booking => {
                        const getBookingStatusBadge = (status) => {
                          const badges = {
                            pending: { badge: 'badge-warning', label: 'Pendiente', color: '#f1b44c', bg: '#fff3cd' },
                            confirmed: { badge: 'badge-success', label: 'Confirmada', color: '#28a745', bg: '#d4edda' },
                            cancelled: { badge: 'badge-danger', label: 'Cancelada', color: '#dc3545', bg: '#f8d7da' },
                            completed: { badge: 'badge-info', label: 'Completada', color: '#17a2b8', bg: '#d1ecf1' },
                            no_show: { badge: 'badge-secondary', label: 'No Show', color: '#6c757d', bg: '#e2e3e5' },
                          };
                          return badges[status] || { badge: 'badge-secondary', label: status || 'Sin estado', color: '#6c757d', bg: '#e2e3e5' };
                        };
                        const statusInfo = getBookingStatusBadge(booking.status);
                        
                        return (
                          <tr key={booking.id}>
                            <td>
                              {booking.sale?.name} {booking.sale?.lastname}
                              <br/>
                              <small className="text-muted">{booking.sale?.email}</small>
                            </td>
                            <td>{new Date(booking.check_in).toLocaleDateString('es-PE')}</td>
                            <td>{new Date(booking.check_out).toLocaleDateString('es-PE')}</td>
                            <td>
                              <span 
                                className="badge"
                                style={{
                                  backgroundColor: statusInfo.bg,
                                  color: statusInfo.color,
                                  fontWeight: '500'
                                }}
                              >
                                {statusInfo.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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
