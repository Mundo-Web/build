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
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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

  // Estados para modal de registro directo (walk-in)
  const modalRegisterRef = useRef();
  const [registerData, setRegisterData] = useState({
    fullname: '',
    email: '',
    phone: '',
    phone_prefix: '+51',
    document_type: 'dni',
    document: '',
    guests: 1,
    nights: 1,
    check_in: new Date(),
    check_out: new Date(new Date().setDate(new Date().getDate() + 1)),
    special_requests: '',
    payment_method: 'efectivo',
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

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

  // Recalcular precio cuando cambian las noches
  useEffect(() => {
    if (selectedRoom && registerData.nights > 0) {
      setTotalPrice(registerData.nights * Number(selectedRoom?.price || 0));
    }
  }, [registerData.nights]);

  // Cambiar fecha del resumen
  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadSummary(date);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    const colors = {
      available: { bg: '#28a745', text: '#ffffff', label: 'Disponible', icon: 'mdi-check-circle' },
      occupied: { bg: '#dc3545', text: '#ffffff', label: 'Ocupada', icon: 'mdi-bed' },
      reserved: { bg: '#ffc107', text: '#000000', label: 'Reservada', icon: 'mdi-clock' },
      cleaning: { bg: '#fd7e14', text: '#ffffff', label: 'En Limpieza', icon: 'mdi-broom' },
      maintenance: { bg: '#6c757d', text: '#ffffff', label: 'Mantenimiento', icon: 'mdi-tools' },
      full: { bg: '#17a2b8', text: '#ffffff', label: 'Sin disponibilidad', icon: 'mdi-information' },
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

  // Abrir modal de mantenimiento
  const openMaintenanceModal = (room) => {
    setSelectedRoom(room);
    setBlockStartDate(new Date());
    setBlockEndDate(new Date());
    setBlockReason('');
    setBlockAction(true);
    $(modalBlockRef.current).modal('show');
  };

  // Abrir modal de registro directo
  const openRegisterModal = (room) => {
    setSelectedRoom(room);
    const checkIn = new Date();
    const checkOut = new Date();
    checkOut.setDate(checkOut.getDate() + 1);

    setRegisterData({
      fullname: '',
      email: '',
      phone: '',
      phone_prefix: '+51',
      document_type: 'dni',
      document: '',
      guests: 1,
      nights: 1,
      check_in: checkIn,
      check_out: checkOut,
      special_requests: '',
      payment_method: 'efectivo',
    });
    setTotalPrice(Number(room?.price || 0));
    $(modalRegisterRef.current).modal('show');
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

  // Registrar ocupación directa (walk-in)
  const handleRegisterOccupation = async (e) => {
    // Prevenir comportamiento por defecto
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    console.log('🔍 Iniciando registro de ocupación...');

    // Validar datos requeridos
    if (!registerData.fullname || !registerData.document) {
      await Swal.fire('Error', 'Complete todos los campos obligatorios (Nombre y N° Documento)', 'error');
      return false;
    }

    // Validar email solo si se proporcionó
    if (registerData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email)) {
        await Swal.fire('Error', 'Ingrese un email válido', 'error');
        return false;
      }
    }

    setRegisterLoading(true);

    try {
      console.log('📤 Enviando datos al servidor...');

      const response = await fetch('/api/admin/bookings/direct-register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          fullname: registerData.fullname,
          email: registerData.email || null,
          phone: registerData.phone,
          phone_prefix: registerData.phone_prefix,
          document_type: registerData.document_type,
          document: registerData.document,
          guests: registerData.guests,
          nights: registerData.nights,
          check_in: moment(registerData.check_in).format('YYYY-MM-DD'),
          check_out: moment(registerData.check_out).format('YYYY-MM-DD'),
          special_requests: registerData.special_requests,
          payment_method: registerData.payment_method,
          total_price: totalPrice,
        })
      });

      console.log('📥 Respuesta recibida:', response.status);

      const result = await response.json();
      console.log('📊 Resultado parseado:', result);

      if (result.status === 200) {
        console.log('✅ Registro exitoso!');

        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          html: `
            <p>Habitación ocupada correctamente</p>
            <p><strong>Código de reserva:</strong> ${result.data?.sale?.code || ''}</p>
          `,
          confirmButtonText: 'Aceptar'
        });

        // Solo cerrar modal y recargar si fue exitoso
        $(modalRegisterRef.current).modal('hide');
        loadSummary();
        return true;
      } else {
        console.log('❌ Error en el registro:', result);

        // Mostrar errores de validación si existen
        let errorMessage = result.message || 'Error al registrar la ocupación';

        if (result.errors) {
          const errorList = Object.values(result.errors).flat();
          errorMessage = errorList.join('<br>');
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          html: errorMessage,
          confirmButtonText: 'Aceptar'
        });

        return false;
      }
    } catch (error) {
      console.error('💥 Error al registrar:', error);

      await Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifique su conexión.',
        confirmButtonText: 'Aceptar'
      });

      return false;
    } finally {
      setRegisterLoading(false);
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

  // Check-in (Confirmar reserva)
  const handleCheckIn = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Check-In',
      html: `
        <p>¿Confirmar el check-in del huésped?</p>
        <small class="text-muted">Fecha y hora: ${new Date().toLocaleString('es-PE')}</small>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="mdi mdi-check-circle"></i> Confirmar Check-In',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        }
      });

      const data = await response.json();
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: '¡Check-In Realizado!',
          text: 'El huésped ha hecho el check-in correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
        if (selectedRoom) {
          await openCalendarModal(selectedRoom);
        }
        loadSummary();
      } else {
        Swal.fire('Error', data.message || 'Error al realizar check-in', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
    }
  };

  // Check-out (Completar reserva)
  const handleCheckOut = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Check-Out',
      html: `
        <p>¿Confirmar el check-out del huésped?</p>
        <small class="text-muted">Fecha y hora: ${new Date().toLocaleString('es-PE')}</small>
        <div class="alert alert-info mt-3 mb-0">
          <i class="mdi mdi-information"></i>
          La habitación pasará a estado de <strong>limpieza</strong>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="mdi mdi-check-all"></i> Confirmar Check-Out',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        }
      });

      const data = await response.json();
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: '¡Check-Out Realizado!',
          html: `
            <p>La reserva ha sido completada correctamente</p>
            <div class="alert alert-warning mt-2">
              <i class="mdi mdi-broom"></i> Habitación en proceso de limpieza
            </div>
          `,
          timer: 2500,
          showConfirmButton: false,
        });
        if (selectedRoom) {
          await openCalendarModal(selectedRoom);
        }
        loadSummary();
      } else {
        Swal.fire('Error', data.message || 'Error al realizar check-out', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
    }
  };

  // Cancelar reserva
  const handleCancelBooking = async (bookingId) => {
    const { value: reason } = await Swal.fire({
      title: 'Cancelar Reserva',
      input: 'textarea',
      inputLabel: 'Razón de la cancelación',
      inputPlaceholder: 'Ej: Cliente solicitó cancelación, cambio de planes, etc.',
      inputAttributes: {
        'aria-label': 'Razón de cancelación'
      },
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="mdi mdi-close-circle"></i> Cancelar Reserva',
      cancelButtonText: 'No cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una razón para la cancelación';
        }
      }
    });

    if (!reason) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: '¡Reserva Cancelada!',
          text: 'La reserva ha sido cancelada correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
        if (selectedRoom) {
          await openCalendarModal(selectedRoom);
        }
        loadSummary();
      } else {
        Swal.fire('Error', data.message || 'Error al cancelar la reserva', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
    }
  };

  // Completar limpieza
  const handleCompleteCleaning = async (roomId) => {
    const result = await Swal.fire({
      title: 'Finalizar Limpieza',
      html: `
        <p>¿Confirmar que la limpieza ha sido completada?</p>
        <div class="alert alert-success mt-3 mb-0">
          <i class="mdi mdi-check-circle"></i>
          La habitación quedará <strong>disponible</strong> para nuevas reservas
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="mdi mdi-check-all"></i> Limpieza Completada',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/room-availability/${roomId}/complete-cleaning`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      if (data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '¡Limpieza Completada!',
          text: 'La habitación está disponible nuevamente',
          timer: 2000,
          showConfirmButton: false,
        });

        // Recargar resumen
        loadSummary();

        // Si el calendario está abierto, actualizarlo
        if ($(modalCalendarRef.current).hasClass('show') && selectedRoom) {
          openCalendarModal(selectedRoom);
        }
      } else {
        Swal.fire('Error', data.message || 'Error al completar limpieza', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
    }
  };

  // No Show
  const handleNoShow = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Marcar como No Show',
      text: '¿El huésped no se presentó para el check-in?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c757d',
      cancelButtonColor: '#17a2b8',
      confirmButtonText: '<i class="mdi mdi-account-off"></i> Marcar No Show',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/no-show`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN')),
        }
      });

      const data = await response.json();
      if (data.status) {
        Swal.fire({
          icon: 'info',
          title: 'Marcada como No Show',
          text: 'La reserva ha sido marcada como no show',
          timer: 2000,
          showConfirmButton: false,
        });
        if (selectedRoom) {
          await openCalendarModal(selectedRoom);
        }
        loadSummary();
      } else {
        Swal.fire('Error', data.message || 'Error al marcar como no show', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Error al procesar la solicitud', 'error');
    }
  };

  // Normalizar fecha a formato YYYY-MM-DD
  const normalizeDate = (dateInput) => {
    if (!dateInput) return null;

    let date;
    if (typeof dateInput === 'string') {
      // Si es string, agregar T00:00:00 para evitar conversión UTC
      date = new Date(dateInput);
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

              let bgColor = '#28a745'; // Verde brillante - disponible
              let textColor = '#ffffff';
              let statusText = 'Disponible';

              if (isBlocked) {
                bgColor = '#6c757d'; // Gris - mantenimiento
                textColor = '#ffffff';
                statusText = 'Mantenimiento';
              } else if (hasConfirmedBookings) {
                bgColor = '#dc3545'; // Rojo - ocupado (huésped activo, ya hizo check-in)
                textColor = '#ffffff';
                statusText = 'Ocupada';
              } else if (hasPendingBookings) {
                bgColor = '#ffc107'; // Amarillo - reservado (pagó pero sin check-in)
                textColor = '#000000';
                statusText = 'Reservada';
              } else if (day.available_rooms === 0) {
                bgColor = '#ffc107'; // Amarillo - sin disponibilidad
                textColor = '#000000';
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
                  {isBlocked && <i className="mdi mdi-tools position-absolute" style={{ fontSize: '10px', top: '2px', right: '2px' }}></i>}
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
                <span className="badge px-3 py-2" style={{ backgroundColor: '#28a745', color: '#ffffff' }}>
                  <i className="mdi mdi-check-circle mr-1"></i> Disponible
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#dc3545', color: '#ffffff' }}>
                  <i className="mdi mdi-bed mr-1"></i> Ocupada
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#ffc107', color: '#000000' }}>
                  <i className="mdi mdi-clock mr-1"></i> Reservada
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#fd7e14', color: '#ffffff' }}>
                  <i className="mdi mdi-broom mr-1"></i> En Limpieza
                </span>
                <span className="badge px-3 py-2" style={{ backgroundColor: '#6c757d', color: '#ffffff' }}>
                  <i className="mdi mdi-tools mr-1"></i> Mantenimiento
                </span>
              </div>

              {/* Grid de habitaciones */}
              <div className="row">
                {roomsSummary.map(room => {
                  const statusInfo = getStatusColor(room.status);
                  return (
                    <div key={room.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4">
                      <div
                        className="room-card"
                        style={{
                          '--status-color': statusInfo.bg,
                          '--status-text': statusInfo.text
                        }}
                      >
                        {/* Status Badge Superior */}
                        <div className="room-status-badge" style={{ backgroundColor: statusInfo.bg }}>
                          <i className={`mdi ${statusInfo.icon}`}></i>
                          <span>{statusInfo.label}</span>
                        </div>

                        {/* Header del Card */}
                        <div className="room-header">
                          <div className="room-title-section">
                            <div className="room-icon-badge" style={{ backgroundColor: `${statusInfo.bg}15`, color: statusInfo.bg }}>
                              <i className="mdi mdi-bed"></i>
                            </div>
                            <h5 className="room-name">{room.name}</h5>
                          </div>
                        </div>

                        {/* Body del Card */}
                        <div className="room-body">
                          <div className="room-quick-info">
                            <div className="info-pill">
                              <i className="mdi mdi-account-multiple"></i>
                              <span>{room.max_occupancy || room.capacity} personas</span>
                            </div>
                            <div className="info-pill info-pill-price">
                              <i className="mdi mdi-cash-multiple"></i>
                              <span>S/ {Number(room.price).toFixed(2)}</span>
                            </div>
                          </div>

                          {room.active_booking && (
                            <div className="room-booking-info">
                              <div className="booking-header">
                                <i className="mdi mdi-account-circle"></i>
                                <span className="booking-label">Huésped Actual</span>
                              </div>
                              <div className="booking-details">
                                <div className="guest-name">
                                  {room.active_booking.guest_name || 'N/A'}
                                </div>
                                <div className="checkout-date">
                                  <i className="mdi mdi-calendar-export"></i>
                                  {moment(room.active_booking.check_out).format('DD/MM/YYYY')}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Botones de acción con íconos y tooltips */}
                          <div className="room-actions-icons">
                            {room.status === 'available' && (
                              <Tippy content="Ocupar Ahora" placement="top">
                                <button
                                  className="room-icon-btn room-icon-btn-success"
                                  onClick={() => openRegisterModal(room)}
                                >
                                  <i className="mdi mdi-account-plus mdi-24px"></i>
                                </button>
                              </Tippy>
                            )}

                            {room.status === 'occupied' && room.active_booking && (
                              <Tippy content="Check-Out" placement="top">
                                <button
                                  className="room-icon-btn room-icon-btn-info"
                                  onClick={() => handleCheckOut(room.active_booking.id)}
                                >
                                  <i className="mdi mdi-logout mdi-24px"></i>
                                </button>
                              </Tippy>
                            )}

                            {room.status === 'cleaning' && (
                              <Tippy content="Limpieza Completada" placement="top">
                                <button
                                  className="room-icon-btn room-icon-btn-success"
                                  onClick={() => handleCompleteCleaning(room.id)}
                                >
                                  <i className="mdi mdi-check-all mdi-24px"></i>
                                </button>
                              </Tippy>
                            )}

                            <Tippy content="Ver Calendario" placement="top">
                              <button
                                className="room-icon-btn room-icon-btn-secondary"
                                onClick={() => openCalendarModal(room)}
                              >
                                <i className="mdi mdi-calendar mdi-24px"></i>
                              </button>
                            </Tippy>

                            <Tippy content="Mantenimiento" placement="top">
                              <button
                                className="room-icon-btn room-icon-btn-warning"
                                onClick={() => openMaintenanceModal(room)}
                              >
                                <i className="mdi mdi-tools mdi-24px"></i>
                              </button>
                            </Tippy>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <style>{`
                .room-card {
                  background: white;
                  border-radius: 12px;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                  transition: all 0.2s ease;
                  height: 100%;
                  position: relative;
                  overflow: hidden;
                  border: 1px solid #e8e8e8;
                  display: flex;
                  flex-direction: column;
                }
                
                .room-card:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                }
                
                .room-status-badge {
                  position: absolute;
                  top: 10px;
                  right: 10px;
                  padding: 4px 10px;
                  border-radius: 12px;
                  font-size: 10px;
                  font-weight: 600;
                  color: white;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                  z-index: 1;
                }
                
                .room-status-badge i {
                  font-size: 12px;
                }
                
                .room-header {
                  padding: 16px 120px 16px 16px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  border-bottom: 1px solid #f0f0f0;
                }
                
                .room-title-section {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  flex: 1;
                }
                
                .room-icon-badge {
                  width: 36px;
                  height: 36px;
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  flex-shrink: 0;
                }
                
                .room-name {
                  margin: 0;
                  font-size: 1.1rem;
                  font-weight: 700;
                  color: #2d3748;
                }
                
                .room-body {
                  padding: 14px;
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                }
                
                .room-quick-info {
                  margin-bottom: 10px;
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                }
                
                .info-pill {
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                  padding: 6px 12px;
                  border-radius: 12px;
                  font-size: 12px;
                  color: #4a5568;
                  font-weight: 600;
                  border: 1px solid #e2e8f0;
                }
                
                .info-pill i {
                  font-size: 16px;
                  color: #4299e1;
                }
                
                .info-pill span {
                  font-weight: 600;
                }
                
                .info-pill-price {
                  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                  border-color: #28a745;
                }
                
                .info-pill-price i {
                  color: #28a745;
                }
                
                .info-pill-price span {
                  color: #155724;
                  font-weight: 700;
                }
                
                .room-booking-info {
                  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                  border-radius: 10px;
                  padding: 10px 12px;
                  margin-bottom: 10px;
                  border: 1px solid #e2e8f0;
                }
                
                .booking-header {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  margin-bottom: 8px;
                  padding-bottom: 6px;
                  border-bottom: 1px solid #e2e8f0;
                }
                
                .booking-header i {
                  font-size: 16px;
                  color: #4299e1;
                }
                
                .booking-label {
                  font-size: 11px;
                  font-weight: 600;
                  text-transform: uppercase;
                  color: #4a5568;
                  letter-spacing: 0.5px;
                }
                
                .booking-details {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  gap: 8px;
                }
                
                .guest-name {
                  font-size: 13px;
                  font-weight: 600;
                  color: #2d3748;
                  flex: 1;
                  min-width: 0;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                
                .checkout-date {
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  font-size: 12px;
                  color: #dc3545;
                  font-weight: 600;
                  flex-shrink: 0;
                }
                
                .checkout-date i {
                  font-size: 14px;
                }
                
                .room-actions-icons {
                  display: flex;
                  gap: 6px;
                  justify-content: center;
                  flex-wrap: wrap;
                  margin-top: auto;
                  padding-top: 10px;
                }
                
                .room-icon-btn {
                  width: 40px;
                  height: 40px;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .room-icon-btn:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .room-icon-btn-success {
                  background: #28a745;
                  color: white;
                }
                
                .room-icon-btn-success:hover {
                  background: #218838;
                }
                
                .room-icon-btn-info {
                  background: #17a2b8;
                  color: white;
                }
                
                .room-icon-btn-info:hover {
                  background: #138496;
                }
                
                .room-icon-btn-secondary {
                  background: #f7fafc;
                  color: #4a5568;
                  border: 1px solid #e2e8f0;
                }
                
                .room-icon-btn-secondary:hover {
                  background: #edf2f7;
                  border-color: #cbd5e0;
                }
                
                .room-icon-btn-warning {
                  background: #ffc107;
                  color: #000;
                }
                
                .room-icon-btn-warning:hover {
                  background: #e0a800;
                }
              `}</style>

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
        size="xl"
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
            <div className="d-flex gap-2 mb-3 flex-wrap justify-content-center">
              <span className="badge px-2 py-1" style={{ backgroundColor: '#28a745', color: '#ffffff', fontSize: '11px' }}>
                <i className="mdi mdi-check-circle mr-1"></i> Disponible
              </span>
              <span className="badge px-2 py-1" style={{ backgroundColor: '#dc3545', color: '#ffffff', fontSize: '11px' }}>
                <i className="mdi mdi-bed mr-1"></i> Ocupado
              </span>
              <span className="badge px-2 py-1" style={{ backgroundColor: '#ffc107', color: '#000000', fontSize: '11px' }}>
                <i className="mdi mdi-clock mr-1"></i> Reservado
              </span>
              <span className="badge px-2 py-1" style={{ backgroundColor: '#6c757d', color: '#ffffff', fontSize: '11px' }}>
                <i className="mdi mdi-tools mr-1"></i> Mantenimiento
              </span>
            </div>

            {/* Layout de 2 columnas */}
            <div className="row">
              {/* Columna Izquierda - Tabla de Reservas */}
              <div className="col-md-5">
                <div className="border rounded p-3" style={{ backgroundColor: '#f8f9fa', maxHeight: '600px', overflowY: 'auto' }}>
                  {calendarData?.bookings?.length > 0 ? (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3 sticky-top bg-light py-2 px-2 rounded" style={{ top: 0, zIndex: 1 }}>
                        <h6 className="mb-0 font-weight-bold">
                          <i className="mdi mdi-account-group mx-2 text-primary"></i>
                          Reservas
                        </h6>
                        <span className="badge badge-primary badge-pill">{calendarData.bookings.length}</span>
                      </div>
                      {calendarData.bookings.map(booking => {
                        const getBookingStatusBadge = (status) => {
                          const badges = {
                            pending: { badge: 'badge-warning', label: 'Pendiente', color: '#f1b44c', bg: '#fff3cd', icon: 'mdi-clock-outline' },
                            confirmed: { badge: 'badge-success', label: 'Confirmada', color: '#28a745', bg: '#d4edda', icon: 'mdi-check-circle' },
                            cancelled: { badge: 'badge-danger', label: 'Cancelada', color: '#dc3545', bg: '#f8d7da', icon: 'mdi-close-circle' },
                            completed: { badge: 'badge-info', label: 'Completada', color: '#17a2b8', bg: '#d1ecf1', icon: 'mdi-checkbox-marked-circle' },
                            no_show: { badge: 'badge-secondary', label: 'No Show', color: '#6c757d', bg: '#e2e3e5', icon: 'mdi-account-off' },
                          };
                          return badges[status] || { badge: 'badge-secondary', label: status || 'Sin estado', color: '#6c757d', bg: '#e2e3e5', icon: 'mdi-help-circle' };
                        };
                        const statusInfo = getBookingStatusBadge(booking.status);

                        return (
                          <div
                            key={booking.id}
                            className="card mb-3 shadow-sm"
                            style={{
                              borderLeft: `4px solid ${statusInfo.color}`,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div className="card-body p-3">
                              {/* Header con nombre y estado */}
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mr-2"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      backgroundColor: statusInfo.bg,
                                      color: statusInfo.color
                                    }}
                                  >
                                    <i className={`mdi ${statusInfo.icon} mdi-24px`}></i>
                                  </div>
                                  <div className='mx-2'>
                                    <h6 className="mb-0 font-weight-bold">{booking.sale?.name} {booking.sale?.lastname}</h6>
                                    <small className="text-muted">#{booking.sale?.code || 'N/A'}</small>
                                  </div>
                                </div>
                                <span
                                  className="badge px-2 py-1"
                                  style={{
                                    backgroundColor: statusInfo.bg,
                                    color: statusInfo.color,
                                    fontWeight: '600',
                                    fontSize: '11px',
                                    letterSpacing: '0.5px'
                                  }}
                                >
                                  {statusInfo.label.toUpperCase()}
                                </span>
                              </div>

                              {/* Información de contacto */}
                              <div className="mb-2 pb-2 border-bottom">
                                <div className="d-flex align-items-center mb-1">
                                  <i className="mdi mdi-email text-muted mx-2"></i>
                                  <small className="text-truncate" style={{ maxWidth: '250px' }}>
                                    {booking.sale?.email}
                                  </small>
                                </div>
                                <div className="d-flex align-items-center">
                                  <i className="mdi mdi-phone text-muted mx-2"></i>
                                  <small>
                                    {booking.sale?.phone_prefix || ''} {booking.sale?.phone || 'N/A'}
                                  </small>
                                </div>
                              </div>

                              {/* Fechas de reserva */}
                              <div className="mb-3">
                                <div className="row text-center">
                                  <div className="col-5">
                                    <div className="p-2 rounded" style={{ backgroundColor: '#e7f5ec' }}>
                                      <i className="mdi mdi-login text-success d-block mb-1"></i>
                                      <small className="d-block text-muted" style={{ fontSize: '10px' }}>CHECK-IN</small>
                                      <strong className="d-block" style={{ fontSize: '13px' }}>
                                        {new Date(booking.check_in).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                                      </strong>
                                    </div>
                                  </div>
                                  <div className="col-2 d-flex align-items-center justify-content-center">
                                    <div className="text-center">
                                      <i className="mdi mdi-arrow-right text-muted"></i>
                                      <small className="d-block text-muted">{booking.nights}n</small>
                                    </div>
                                  </div>
                                  <div className="col-5">
                                    <div className="p-2 rounded" style={{ backgroundColor: '#ffeaea' }}>
                                      <i className="mdi mdi-logout text-danger d-block mb-1"></i>
                                      <small className="d-block text-muted" style={{ fontSize: '10px' }}>CHECK-OUT</small>
                                      <strong className="d-block" style={{ fontSize: '13px' }}>
                                        {new Date(booking.check_out).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Información adicional */}
                              <div className="d-flex justify-content-around mb-3 py-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                <div className="text-center">
                                  <i className="mdi mdi-account-multiple text-primary"></i>
                                  <small className="d-block">{booking.guests || 1} huésped{(booking.guests || 1) > 1 ? 'es' : ''}</small>
                                </div>
                                <div className="text-center">
                                  <i className="mdi mdi-cash-multiple text-success"></i>
                                  <small className="d-block">{CurrencySymbol()} {Number2Currency(booking.total_price || 0)}</small>
                                </div>
                              </div>

                              {/* Botones de acción */}
                              <div className="d-flex gap-2 flex-wrap">
                                {booking.status === 'pending' && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-success flex-fill"
                                      onClick={() => handleCheckIn(booking.id)}
                                      title="Check-In"
                                    >
                                      <i className="mdi mdi-login mr-1"></i> Check-In
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleCancelBooking(booking.id)}
                                      title="Cancelar"
                                    >
                                      <i className="mdi mdi-close"></i>
                                    </button>
                                  </>
                                )}
                                {booking.status === 'confirmed' && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-info flex-fill"
                                      onClick={() => handleCheckOut(booking.id)}
                                      title="Check-Out"
                                    >
                                      <i className="mdi mdi-logout mr-1"></i> Check-Out
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-secondary"
                                      onClick={() => handleNoShow(booking.id)}
                                      title="No Show"
                                    >
                                      <i className="mdi mdi-account-off"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleCancelBooking(booking.id)}
                                      title="Cancelar"
                                    >
                                      <i className="mdi mdi-close"></i>
                                    </button>
                                  </>
                                )}
                                {['completed', 'cancelled', 'no_show'].includes(booking.status) && (
                                  <div className="text-center w-100 py-2 text-muted">
                                    <i className="mdi mdi-information-outline mr-1"></i>
                                    Reserva finalizada
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="text-center text-muted py-5">
                      <i className="mdi mdi-calendar-blank mdi-48px"></i>
                      <p className="mt-2">No hay reservas en este período</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha - Calendario Visual */}
              <div className="col-md-7">
                <div className="border rounded p-2" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <h6 className="mb-3 sticky-top bg-white py-2" style={{ top: 0, zIndex: 1 }}>
                    <i className="mdi mdi-calendar mr-1"></i>
                    Vista de Calendario
                  </h6>
                  {renderCalendar()}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Mantenimiento */}
      <Modal
        modalRef={modalBlockRef}
        title={`Mantenimiento - ${selectedRoom?.name || ''}`}
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
                <i className="mdi mdi-tools mr-1 text-warning"></i>
                Poner en mantenimiento
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
                <i className="mdi mdi-check mr-1 text-success"></i>
                Finalizar mantenimiento
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

        <div className="alert alert-warning">
          <i className="mdi mdi-information mr-1"></i>
          {blockAction
            ? 'Las fechas en mantenimiento no estarán disponibles para reservas.'
            : 'Al finalizar el mantenimiento, las fechas volverán a estar disponibles.'}
        </div>
      </Modal>

      {/* Modal de Registro Directo (Walk-in) */}
      <Modal
        modalRef={modalRegisterRef}
        title={`Registrar Ocupación - ${selectedRoom?.name || ''}`}
        size="xl"
        buttonSubmit={registerLoading ? 'Procesando...' : 'Registrar Ocupación'}
        onSubmit={handleRegisterOccupation}
      >
        {/* Header Info */}
        <div className="bg-light border-bottom p-3 mb-4" style={{ margin: '-1rem -1rem 1.5rem -1rem' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="bg-white rounded-circle p-2 mr-3" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="mdi mdi-account-plus mdi-24px text-primary"></i>
              </div>
              <div>
                <h5 className="mb-1">Registro Presencial de Huésped</h5>
                <small className="text-muted">Complete la información para ocupar la habitación inmediatamente</small>
              </div>
            </div>
            <span className="badge badge-primary badge-lg px-3 py-2">
              <i className="mdi mdi-bed mr-1"></i>
              {selectedRoom?.name}
            </span>
          </div>
        </div>

        {/* Sección 1: Información del Huésped */}
        <div className="mb-5">
          <h6 className="text-uppercase text-muted mb-4" style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
            <i className="mdi mdi-account-circle mr-2"></i>
            1. Información del Huésped
          </h6>

          <div className="row">
            <div className="col-md-8">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">Nombre Completo <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={registerData.fullname}
                  onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
                  placeholder="Ej: Juan Pérez García"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">Email <small className="text-muted">(opcional)</small></label>
                <input
                  type="email"
                  className="form-control"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">Teléfono <small className="text-muted">(opcional)</small></label>
                <div className="input-group">
                  <select
                    className="form-control"
                    style={{ maxWidth: '120px' }}
                    value={registerData.phone_prefix}
                    onChange={(e) => setRegisterData({ ...registerData, phone_prefix: e.target.value })}
                  >
                    <option value="+51">🇵🇪 +51</option>
                    {/* <option value="+1">🇺🇸 +1</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+57">🇨🇴 +57</option>*/}
                  </select>
                  <input
                    type="tel"
                    className="form-control"
                    value={registerData.phone}
                    onChange={(e) => {
                      // Solo permitir números
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setRegisterData({ ...registerData, phone: value });
                    }}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    placeholder="987654321"
                    maxLength="15"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">Tipo de Documento <span className="text-danger">*</span></label>
                <select
                  className="form-control"
                  value={registerData.document_type}
                  onChange={(e) => setRegisterData({ ...registerData, document_type: e.target.value, document: '' })}
                >
                  <option value="dni">DNI (8 dígitos)</option>
                  <option value="ce">Carnet de Extranjería</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="ruc">RUC (11 dígitos)</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">N° de Documento <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  value={registerData.document}
                  onChange={(e) => {
                    let value = e.target.value;
                    const docType = registerData.document_type;
                    
                    // Validación según tipo de documento
                    if (docType === 'dni') {
                      // DNI: Solo números, máximo 8 dígitos
                      value = value.replace(/[^0-9]/g, '').slice(0, 8);
                    } else if (docType === 'ruc') {
                      // RUC: Solo números, máximo 11 dígitos
                      value = value.replace(/[^0-9]/g, '').slice(0, 11);
                    } else if (docType === 'ce') {
                      // Carnet de Extranjería: Alfanumérico, máximo 12 caracteres
                      value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);
                    } else if (docType === 'pasaporte') {
                      // Pasaporte: Alfanumérico, máximo 20 caracteres
                      value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                    }
                    
                    setRegisterData({ ...registerData, document: value });
                  }}
                  placeholder={
                    registerData.document_type === 'dni' ? '8 dígitos numéricos' :
                    registerData.document_type === 'ruc' ? '11 dígitos numéricos' :
                    registerData.document_type === 'ce' ? 'Alfanumérico (máx. 12)' :
                    'Alfanumérico (máx. 20)'
                  }
                  maxLength={
                    registerData.document_type === 'dni' ? 8 :
                    registerData.document_type === 'ruc' ? 11 :
                    registerData.document_type === 'ce' ? 12 : 20
                  }
                  required
                />
                <small className="text-muted d-block mt-1">
                  {registerData.document_type === 'dni' && `${registerData.document.length}/8 dígitos`}
                  {registerData.document_type === 'ruc' && `${registerData.document.length}/11 dígitos`}
                  {registerData.document_type === 'ce' && `${registerData.document.length}/12 caracteres`}
                  {registerData.document_type === 'pasaporte' && `${registerData.document.length}/20 caracteres`}
                </small>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Sección 2: Detalles de la Estadía */}
        <div className="mb-5">
          <h6 className="text-uppercase text-muted mb-4" style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
            <i className="mdi mdi-calendar-check mr-2"></i>
            2. Detalles de la Estadía
          </h6>

          <div className="row">
            <div className="col-md-3">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">
                  <i className="mdi mdi-calendar-import text-success mr-1"></i>
                  Fecha Check-In
                </label>
                <DatePicker
                  selected={registerData.check_in}
                  onChange={(date) => {
                    setRegisterData({ ...registerData, check_in: date });
                    if (registerData.check_out) {
                      const nights = Math.ceil((registerData.check_out - date) / (1000 * 60 * 60 * 24));
                      setRegisterData(prev => ({ ...prev, nights: nights > 0 ? nights : 1 }));
                    }
                  }}
                  minDate={new Date()}
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">
                  <i className="mdi mdi-calendar-export text-danger mr-1"></i>
                  Fecha Check-Out
                </label>
                <DatePicker
                  selected={registerData.check_out}
                  onChange={(date) => {
                    setRegisterData({ ...registerData, check_out: date });
                    if (registerData.check_in) {
                      const nights = Math.ceil((date - registerData.check_in) / (1000 * 60 * 60 * 24));
                      setRegisterData(prev => ({ ...prev, nights: nights > 0 ? nights : 1 }));
                    }
                  }}
                  minDate={registerData.check_in || new Date()}
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">
                  <i className="mdi mdi-weather-night mr-1"></i>
                  N° de Noches
                </label>
                <input
                  type="number"
                  className="form-control text-center"
                  min="1"
                  value={registerData.nights}
                  onChange={(e) => {
                    const nights = parseInt(e.target.value) || 1;
                    const newCheckOut = new Date(registerData.check_in);
                    newCheckOut.setDate(newCheckOut.getDate() + nights);
                    setRegisterData({ ...registerData, nights, check_out: newCheckOut });
                  }}
                  style={{ fontWeight: 'bold' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">
                  <i className="mdi mdi-account-multiple mr-1"></i>
                  N° de Huéspedes
                </label>
                <input
                  type="number"
                  className="form-control text-center"
                  min="1"
                  max={selectedRoom?.capacity || 10}
                  value={registerData.guests}
                  onChange={(e) => setRegisterData({ ...registerData, guests: parseInt(e.target.value) || 1 })}
                  style={{ fontWeight: 'bold' }}
                />
                <small className="text-muted d-block mt-2">Máx: {selectedRoom?.capacity || 0}</small>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Sección 3: Pago y Observaciones */}
        <div className="mb-5">
          <h6 className="text-uppercase text-muted mb-4" style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
            <i className="mdi mdi-cash-multiple mr-2"></i>
            3. Pago y Observaciones
          </h6>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">
                  <i className="mdi mdi-credit-card mr-1"></i>
                  Método de Pago
                </label>
                <select
                  className="form-control"
                  value={registerData.payment_method}
                  onChange={(e) => setRegisterData({ ...registerData, payment_method: e.target.value })}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                </select>
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-group mb-4">
                <label className="font-weight-bold mb-2">
                  <i className="mdi mdi-message-text mr-1"></i>
                  Solicitudes Especiales
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={registerData.special_requests}
                  onChange={(e) => setRegisterData({ ...registerData, special_requests: e.target.value })}
                  placeholder="Ej: Cama extra, cuna para bebé, late check-out, alergias alimentarias..."
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Sección 4: Total a Pagar */}
        <div className="bg-light border rounded p-4">
          <div className="row align-items-center">
            <div className="col-md-5">
              <h6 className="text-uppercase text-muted mb-3" style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
                <i className="mdi mdi-calculator mr-2"></i>
                Total a Pagar
              </h6>
              <div className="input-group" style={{ height: '60px' }}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-success text-white font-weight-bold" style={{ fontSize: '1.5rem', width: '60px', justifyContent: 'center' }}>S/</span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={totalPrice}
                  onChange={(e) => setTotalPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#28a745' }}
                />
              </div>
              <small className="text-muted d-block mt-2">
                <i className="mdi mdi-pencil mr-1"></i>
                Editable según negociación con el cliente
              </small>
            </div>
            <div className="col-md-1 text-center d-none d-md-block">
              <i className="mdi mdi-arrow-right mdi-36px text-muted"></i>
            </div>
            <div className="col-md-6">
              <div className="card mb-0 shadow-sm">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 font-weight-bold text-dark">Desglose del Precio</h6>
                </div>
                <div className="card-body">
                  <table className="table table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="py-2">
                          <span className="text-muted">Precio por noche:</span>
                        </td>
                        <td className="text-right py-2">
                          <strong className="text-dark">S/ {Number(selectedRoom?.price || 0).toFixed(2)}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">
                          <span className="text-muted">Número de noches:</span>
                        </td>
                        <td className="text-right py-2">
                          <strong className="text-dark">× {registerData.nights}</strong>
                        </td>
                      </tr>
                      <tr className="border-top">
                        <td className="py-3">
                          <strong className="text-dark">Precio sugerido:</strong>
                        </td>
                        <td className="text-right py-3">
                          <h5 className="mb-0 text-success font-weight-bold">
                            S/ {(registerData.nights * Number(selectedRoom?.price || 0)).toFixed(2)}
                          </h5>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
    <BaseAdminto {...properties} title='Disponibilidad de Habitaciones'>
      <RoomAvailability {...properties} />
    </BaseAdminto>
  );
});
