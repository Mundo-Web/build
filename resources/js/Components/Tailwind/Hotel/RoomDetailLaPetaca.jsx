import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/pagination';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { CurrencySymbol } from '../../../Utils/Number2Currency';

import { 
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    FloatingFocusManager,
} from '@floating-ui/react';
import { 
    Users, 
    Bed, 
    Maximize2, 
    Calendar, 
    ChevronRight, 
    Star, 
    Shield, 
    Clock, 
    MapPin,
    Coffee,
    Check,
    X,
    Heart,
    Share2,
    ImageIcon,
    Sparkles,
    UserPlus,
    UserMinus,
    Info,
    AlertCircle,
    MessageCircle,
    CreditCard,
    ArrowLeft,
    Plus,
    Minus,
    ChevronDown,
    ShoppingCart
} from 'lucide-react';
import General from '../../../Utils/General';

const RoomDetailLaPetaca = ({ item, data, cart, setCart, generals }) => {
    const accentColor = data?.accentColor || '#a89765';
    
    // Estados para galería
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    
    // Estados para reserva
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [adults, setAdults] = useState(() => {
        // Iniciar con 1 adulto como mínimo, o 2 si la capacidad lo permite
        const maxCapacity = item?.max_occupancy || 2;
        return Math.min(2, maxCapacity) || 1;
    });
    const [children, setChildren] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showGuestsPicker, setShowGuestsPicker] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    
    // Calcular total de huéspedes
    const guests = adults + children;
    
    // Estados para disponibilidad
    const [blockedDates, setBlockedDates] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    
    // Estados para WhatsApp multi-asesor
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    
    // Estados para modal de reserva
    const [showReservationModal, setShowReservationModal] = useState(false);
    const [reservationData, setReservationData] = useState(null);
    
    // Refs
    const guestsRef = useRef(null);
    
    // Obtener asesores de WhatsApp
    const whatsappAdvisors = General.whatsapp_advisors || [];

    // Bloquear scroll cuando el modal está abierto
    useEffect(() => {
        if (showReservationModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showReservationModal]);

    // Configuración de Floating UIpara el dropdown de asesores
    const { refs, floatingStyles, context } = useFloating({
        open: isAdvisorDropdownOpen,
        onOpenChange: setIsAdvisorDropdownOpen,
        placement: 'top',
        middleware: [
            offset(10),
            flip({
                fallbackPlacements: ['top', 'bottom', 'top-start', 'bottom-start'],
            }),
            shift({ padding: 8 }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);
    
    // Cerrar pickers al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guestsRef.current && !guestsRef.current.contains(event.target)) {
                setShowGuestsPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Cargar fechas bloqueadas Y reservas pendientes/confirmadas
    useEffect(() => {
        const loadBlockedDates = async () => {
            if (!item?.id) return;
            
            setLoadingAvailability(true);
            try {
                const response = await fetch(`/api/hotels/rooms/${item.id}/blocked-dates`);
                const result = await response.json();
                
                if (result.status === 200) {
                    const allBlockedDates = [];
                    
                    // 1. Fechas bloqueadas manualmente
                    if (result.data?.blocked_dates) {
                        result.data.blocked_dates.forEach(dateStr => {
                            allBlockedDates.push(new Date(dateStr + 'T00:00:00'));
                        });
                    }
                    
                    // 2. Fechas de bookings pendientes y confirmadas
                    if (result.data?.booked_dates) {
                        result.data.booked_dates.forEach(dateStr => {
                            allBlockedDates.push(new Date(dateStr + 'T00:00:00'));
                        });
                    }
                    
                    setBlockedDates(allBlockedDates);
                }
            } catch (error) {
                console.error('Error al cargar fechas bloqueadas:', error);
            }
            setLoadingAvailability(false);
        };
        
        loadBlockedDates();
    }, [item?.id]);
    
    // Estilos personalizados para el DatePicker moderno
    useEffect(() => {
        const style = document.createElement('style');
        style.id = 'lapetaca-datepicker-modern-styles';
        style.textContent = `
            /* Estilos mejorados para el DatePicker moderno estilo Booking */
            .lapetaca-datepicker-modern .react-datepicker {
                font-family: inherit;
                border: none;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(40, 20, 9, 0.15), 0 0 0 1px rgba(40, 20, 9, 0.05);
                background: white;
                overflow: visible;
                padding: 20px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__header {
                background: white;
                border: none;
                padding: 0 0 12px 0;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__current-month {
                color: #281409;
                font-weight: 700;
                font-size: 1rem;
                margin-bottom: 12px;
                text-align: center;
                text-transform: capitalize;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day-names {
                display: flex;
                justify-content: space-around;
                margin: 0 0 8px 0;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day-name {
                color: #78673A;
                font-weight: 600;
                width: 40px;
                line-height: 40px;
                font-size: 0.7rem;
                text-transform: uppercase;
                margin: 0;
                text-align: center;
                letter-spacing: 0.5px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__month {
                margin: 0;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__week {
                display: flex;
                justify-content: space-around;
                margin-bottom: 2px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day {
                width: 40px;
                height: 40px;
                line-height: 40px;
                border-radius: 8px;
                color: #281409;
                font-weight: 500;
                margin: 2px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                font-size: 0.9rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day:hover:not(.react-datepicker__day--disabled):not(.react-datepicker__day--selected):not(.react-datepicker__day--in-range) {
                background: #f5f5f5;
                transform: scale(1.05);
                border-radius: 8px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--selected,
            .lapetaca-datepicker-modern .react-datepicker__day--range-start,
            .lapetaca-datepicker-modern .react-datepicker__day--range-end {
                background: linear-gradient(135deg, #281409 0%, #3d2011 100%) !important;
                color: white !important;
                font-weight: 700;
                border-radius: 8px !important;
                box-shadow: 0 2px 8px rgba(40, 20, 9, 0.3);
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--in-range:not(.react-datepicker__day--range-start):not(.react-datepicker__day--range-end) {
                background: rgba(168, 151, 101, 0.15) !important;
                color: #281409 !important;
                border-radius: 0 !important;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--range-start {
                border-radius: 8px 0 0 8px !important;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--range-end {
                border-radius: 0 8px 8px 0 !important;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--range-start.react-datepicker__day--range-end {
                border-radius: 8px !important;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--disabled {
                background: transparent !important;
                color: #ddd !important;
                cursor: not-allowed !important;
                opacity: 0.4;
                position: relative;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--disabled::after {
                content: '';
                position: absolute;
                width: 80%;
                height: 1px;
                background: #ddd;
                top: 50%;
                left: 10%;
                transform: translateY(-50%) rotate(-45deg);
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--today:not(.react-datepicker__day--selected):not(.react-datepicker__day--in-range) {
                font-weight: 700;
                color: #a89765;
                background: rgba(168, 151, 101, 0.08);
                border: 2px solid #a89765;
                border-radius: 8px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__day--today:hover:not(.react-datepicker__day--selected) {
                background: rgba(168, 151, 101, 0.15);
            }
            
            .lapetaca-datepicker-modern .react-datepicker__navigation {
                top: 20px;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                background: #f5f5f5;
                transition: all 0.2s ease;
                border: none;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__navigation:hover {
                background: #281409;
                transform: scale(1.1);
                box-shadow: 0 2px 8px rgba(40, 20, 9, 0.2);
            }
            
            .lapetaca-datepicker-modern .react-datepicker__navigation-icon::before {
                border-color: #78673A;
                border-width: 2px 2px 0 0;
                width: 8px;
                height: 8px;
                top: 10px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before {
                border-color: white;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__navigation--previous {
                left: 20px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__navigation--next {
                right: 20px;
            }
            
            .lapetaca-datepicker-modern .react-datepicker-popper {
                z-index: 9999 !important;
                transform: translateY(4px) !important;
            }
            
            .lapetaca-datepicker-modern .react-datepicker__triangle {
                display: none;
            }
            
            /* Animación de entrada */
            .lapetaca-datepicker-modern .react-datepicker {
                animation: datePickerFadeIn 0.2s ease-out;
            }
            
            @keyframes datePickerFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes fadeInScale {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fadeIn {
                animation: fadeInScale 0.3s ease-out;
            }
            
            .animate-slideUp {
                animation: slideUp 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            const existingStyle = document.getElementById('lapetaca-datepicker-modern-styles');
            if (existingStyle) existingStyle.remove();
        };
    }, []);
    
    // Verificar si una fecha está bloqueada
    const isDateBlocked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return blockedDates.some(blockedDate => {
            const blockedStr = blockedDate.toISOString().split('T')[0];
            return dateStr === blockedStr;
        });
    };
    
    // Tipos de habitación
    const roomTypes = {
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
        'single': 'Individual',
        'double': 'Doble',
    };
    
    // Helper para obtener el nombre del amenity
    const getAmenityName = (amenity) => {
        if (typeof amenity === 'string') return amenity;
        return amenity?.name || '';
    };

    // Helper para obtener la imagen del amenity
    const getAmenityImage = (amenity, size = 20) => {
        if (typeof amenity === 'object' && amenity?.image) {
            return (
                <img 
                    src={`/storage/images/amenity/${amenity.image}`} 
                    alt={amenity.name || ''}
                    className="object-contain"
                    style={{ width: `${size}px`, height: `${size}px` }}
                    onError={(e) => e.target.style.display = 'none'}
                />
            );
        }
        return <Coffee size={size} className="customtext-accent" />;
    };

    // Calcular noches
    const nights = checkIn && checkOut 
        ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        : 0;
    
    // Calcular precio total
    const pricePerNight = parseFloat(item?.final_price || item?.price) || 0;
    const totalPrice = pricePerNight * nights;
    const grandTotal = totalPrice;
    
    // Verificar descuento
    const hasDiscount = item?.price && item?.discount && parseFloat(item.discount) > 0;
    const originalPrice = parseFloat(item?.price) || 0;
    const discountPercentage = hasDiscount
        ? Math.round(((originalPrice - parseFloat(item.discount)) / originalPrice) * 100)
        : 0;
    
    const totalSavings = hasDiscount ? (originalPrice - pricePerNight) * nights : 0;

    // Preparar imágenes para galería
    const allImages = [
        { url: item?.image, type: 'main', alt: item?.name || 'Habitación' },
        ...(item?.images || []).map((img, index) => ({
            url: img.url,
            type: 'gallery',
            index,
            alt: `${item?.name} - Imagen ${index + 1}`
        }))
    ].filter(img => img.url);

    // Verificar si hay fechas bloqueadas en el rango
    const hasBlockedDatesInRange = () => {
        if (!checkIn || !checkOut || blockedDates.length === 0) return false;
        
        let current = new Date(checkIn);
        while (current < checkOut) {
            if (isDateBlocked(current)) return true;
            current.setDate(current.getDate() + 1);
        }
        return false;
    };

    // Handler para reservar
    const handleReserve = async () => {
        if (!checkIn || !checkOut) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas requeridas',
                text: 'Por favor selecciona las fechas de check-in y check-out',
                confirmButtonColor: '#281409',
                confirmButtonText: 'Entendido',
                background: '#fff',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-2xl font-bold customtext-primary',
                    htmlContainer: 'text-gray-600',
                    confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all'
                },
                showClass: {
                    popup: 'animate-fadeIn'
                },
                buttonsStyling: false
            });
            return;
        }

        if (nights <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas inválidas',
                text: 'La fecha de check-out debe ser posterior a la de check-in',
                confirmButtonColor: '#281409',
                confirmButtonText: 'Entendido',
                background: '#fff',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-2xl font-bold customtext-primary',
                    htmlContainer: 'text-gray-600',
                    confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all'
                },
                showClass: {
                    popup: 'animate-fadeIn'
                },
                buttonsStyling: false
            });
            return;
        }

        if (hasBlockedDatesInRange()) {
            Swal.fire({
                icon: 'error',
                title: 'Fechas no disponibles',
                text: 'Algunas fechas en el rango seleccionado no están disponibles. Por favor selecciona otras fechas.',
                confirmButtonColor: '#d9534f',
                confirmButtonText: 'Buscar otras fechas',
                background: '#fff',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-2xl font-bold text-red-700',
                    htmlContainer: 'text-gray-600',
                    confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all'
                },
                showClass: {
                    popup: 'animate-fadeIn'
                },
                buttonsStyling: false
            });
            return;
        }

        if (guests > (item?.max_occupancy || 2)) {
            Swal.fire({
                icon: 'warning',
                title: 'Capacidad excedida',
                html: `
                    <p class="text-gray-600 mb-3">Esta habitación tiene capacidad máxima para <strong class="customtext-primary">${item?.max_occupancy || 2} personas</strong></p>
                    <p class="text-sm text-gray-500">Por favor ajusta el número de huéspedes o elige otra habitación.</p>
                `,
                confirmButtonColor: '#281409',
                confirmButtonText: 'Ajustar huéspedes',
                background: '#fff',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-2xl font-bold customtext-primary',
                    htmlContainer: 'text-gray-600',
                    confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all'
                },
                showClass: {
                    popup: 'animate-fadeIn'
                },
                buttonsStyling: false
            });
            return;
        }

        setLoading(true);

        try {
            const existingBooking = cart.find(
                (c) =>
                    c.type === 'booking' &&
                    c.id === item.id &&
                    c.check_in === checkIn.toISOString().split('T')[0] &&
                    c.check_out === checkOut.toISOString().split('T')[0]
            );

            if (existingBooking) {
                const result = await Swal.fire({
                    icon: 'info',
                    title: '¡Ya está en tu carrito!',
                    html: `
                        <p class="text-gray-600 mb-4">Esta reserva ya fue agregada a tu carrito de compras.</p>
                        <p class="text-sm customtext-accent font-semibold">¿Deseas proceder con la reserva?</p>
                    `,
                    confirmButtonText: 'Ir al carrito',
                    showCancelButton: true,
                    cancelButtonText: 'Continuar viendo',
                    confirmButtonColor: '#281409',
                    cancelButtonColor: '#78673a',
                    background: '#fff',
                    customClass: {
                        popup: 'rounded-2xl shadow-2xl',
                        title: 'text-2xl font-bold customtext-primary',
                        htmlContainer: 'text-gray-600',
                        confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all mr-2',
                        cancelButton: 'rounded-xl px-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all'
                    },
                    showClass: {
                        popup: 'animate-fadeIn'
                    },
                    buttonsStyling: false
                });
                
                if (result.isConfirmed) {
                    window.location.href = '/cart';
                }
                setLoading(false);
                return;
            }

            const booking = {
                id: item.id,
                type: 'booking',
                name: item.name,
                slug: item.slug,
                image: item.image,
                price: pricePerNight,
                final_price: pricePerNight,
                discount: item.discount || 0,
                check_in: checkIn.toISOString().split('T')[0],
                check_out: checkOut.toISOString().split('T')[0],
                nights: nights,
                guests: guests,
                adults: adults,
                children: children,
                max_occupancy: item.max_occupancy,
                beds_count: item.beds_count,
                room_type: item.room_type,
                amenities: item.amenities || [],
                quantity: 1,
                total_price: totalPrice,
            };

            const newCart = [...cart, booking];
            setCart(newCart);

            // Mostrar modal personalizado
            setReservationData({
                item,
                checkIn,
                checkOut,
                nights,
                guests,
                adults,
                children,
                pricePerNight,
                totalPrice
            });
            setShowReservationModal(true);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops... Algo salió mal',
                html: `
                    <p class="text-gray-600 mb-3">${error.message || 'Ocurrió un error al procesar la reserva'}</p>
                    <p class="text-sm customtext-neutral-light">Por favor intenta nuevamente o contacta con soporte si el problema persiste.</p>
                `,
                confirmButtonColor: '#d9534f',
                confirmButtonText: 'Entendido',
                background: '#fff',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-2xl font-bold text-red-700',
                    htmlContainer: 'text-gray-600',
                    confirmButton: 'rounded-xl px-8 py-3 font-bold shadow-lg hover:shadow-xl transition-all'
                },
                showClass: {
                    popup: 'animate-fadeIn'
                },
                buttonsStyling: false
            });
        } finally {
            setLoading(false);
        }
    };

    // WhatsApp multi-asesor
    const handleAdvisorSelect = (advisor) => {
        let message = `Hola, me interesa la habitación "${item?.name}"`;
        if (checkIn && checkOut) {
            message += `\n\nFechas de interés:\n- Check-in: ${checkIn.toLocaleDateString('es-PE')}\n- Check-out: ${checkOut.toLocaleDateString('es-PE')}\n- ${nights} noche(s)\n- ${guests} huésped(es)`;
        }
        
        const phoneNumber = advisor.phone.replace(/\D/g, '');
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setIsAdvisorDropdownOpen(false);
    };

    const handleWhatsAppClick = () => {
        if (whatsappAdvisors.length === 1) {
            // Si solo hay un asesor, abrir directamente
            handleAdvisorSelect(whatsappAdvisors[0]);
        } else if (whatsappAdvisors.length > 1) {
            // Si hay múltiples asesores, mostrar dropdown
            setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen);
        }
    };
    
    // Share
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item?.name,
                    text: `Mira esta habitación: ${item?.name}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                icon: 'success',
                title: '¡Enlace copiado!',
                text: 'El enlace ha sido copiado al portapapeles',
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div className="bg-sections-color min-h-screen">
           

            {/* Galería estilo Booking */}
            <div className="relative bg-white">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 relative">
                    {/* Grid adaptativo según cantidad de imágenes */}
                    {allImages.length === 1 ? (
                        // Solo una imagen - mostrar en grande
                        <div className="hidden md:block h-[500px] rounded-2xl overflow-hidden">
                            <div 
                                className="relative cursor-pointer group h-full overflow-hidden"
                                onClick={() => setShowGalleryModal(true)}
                            >
                                <img
                                    src={`/storage/images/item/${allImages[0].url}`}
                                    alt={item?.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                            </div>
                        </div>
                    ) : allImages.length === 2 ? (
                        // Dos imágenes - layout 50/50
                        <div className="hidden md:grid md:grid-cols-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
                            {allImages.map((img, index) => (
                                <div 
                                    key={index}
                                    className="relative cursor-pointer group overflow-hidden"
                                    onClick={() => {
                                        setSelectedImage(index);
                                        setShowGalleryModal(true);
                                    }}
                                >
                                    <img
                                        src={`/storage/images/item/${img.url}`}
                                        alt={img.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                </div>
                            ))}
                        </div>
                    ) : allImages.length === 3 ? (
                        // Tres imágenes - una mitad del ancho, las otras dos en la otra mitad divididas verticalmente
                        <div className="hidden md:flex gap-2 h-[500px] rounded-2xl overflow-hidden">
                            <div 
                                className="w-1/2 relative cursor-pointer group overflow-hidden"
                                onClick={() => setShowGalleryModal(true)}
                            >
                                <img
                                    src={`/storage/images/item/${allImages[0].url}`}
                                    alt={item?.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-2">
                                {allImages.slice(1, 3).map((img, index) => (
                                    <div 
                                        key={index}
                                        className="h-1/2 relative cursor-pointer group overflow-hidden"
                                        onClick={() => {
                                            setSelectedImage(index + 1);
                                            setShowGalleryModal(true);
                                        }}
                                    >
                                        <img
                                            src={`/storage/images/item/${img.url}`}
                                            alt={img.alt}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : allImages.length === 4 ? (
                        // Cuatro imágenes - grid 2x2 (mitad ancho y mitad altura cada una)
                        <div className="hidden md:grid md:grid-cols-2 md:grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
                            {allImages.map((img, index) => (
                                <div 
                                    key={index}
                                    className="relative cursor-pointer group overflow-hidden"
                                    onClick={() => {
                                        setSelectedImage(index);
                                        setShowGalleryModal(true);
                                    }}
                                >
                                    <img
                                        src={`/storage/images/item/${img.url}`}
                                        alt={img.alt}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // 5 o más imágenes - una grande (mitad ancho) y 4 pequeñas (mitad ancho en grid 2x2)
                        <div className="hidden md:flex gap-2 h-[500px] rounded-2xl overflow-hidden">
                            {/* Imagen principal - ocupa la mitad del ancho */}
                            <div 
                                className="w-1/2 relative cursor-pointer group overflow-hidden rounded-l-2xl"
                                onClick={() => setShowGalleryModal(true)}
                            >
                                <img
                                    src={`/storage/images/item/${allImages[0].url}`}
                                    alt={item?.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                            </div>
                            
                            {/* Grid de 4 imágenes secundarias - 2x2 en la otra mitad del ancho */}
                            <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2">
                                {[1, 2, 3, 4].map((index) => (
                                    <div 
                                        key={index}
                                        className="relative cursor-pointer group overflow-hidden"
                                        onClick={() => {
                                            setSelectedImage(index);
                                            setShowGalleryModal(true);
                                        }}
                                    >
                                        {allImages[index] ? (
                                            <>
                                                <img
                                                    src={`/storage/images/item/${allImages[index].url}`}
                                                    alt={`${item?.name} - ${index}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                                
                                                {/* Botón ver todas - en la última imagen */}
                                                {index === 4 && allImages.length > 5 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <button className="bg-white customtext-primary px-2 py-1.5 rounded-lg font-semibold text-[10px] flex items-center gap-1 hover:bg-sections-color transition-colors shadow-lg">
                                                            <ImageIcon size={12} />
                                                            +{allImages.length - 5}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-sections-color flex items-center justify-center">
                                                <ImageIcon size={20} className="customtext-neutral-light opacity-30" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Galería móvil */}
                    <div className="md:hidden">
                        <Swiper
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation={true}
                            pagination={{ clickable: true }}
                            modules={[Navigation, Pagination]}
                            className="aspect-[4/3] rounded-2xl overflow-hidden"
                        >
                            {allImages.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={`/storage/images/item/${img.url}`}
                                        alt={img.alt}
                                        className="w-full h-full object-cover"
                                        onClick={() => setShowGalleryModal(true)}
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    
                    {/* Badges y acciones flotantes - dentro del contenedor */}
                    <div className="absolute top-10 left-4 right-4 lg:left-12 lg:right-12 flex items-start justify-between z-10 pointer-events-none">
                        <div className="flex gap-2 pointer-events-auto">
                            {hasDiscount && (
                                <div className="bg-danger text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-xl">
                                    <Sparkles size={14} />
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                            {item?.room_type && (
                                <div className="bg-white/95 backdrop-blur-sm customtext-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                    {roomTypes[item.room_type] || item.room_type}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-2 pointer-events-auto">
                            <button 
                                onClick={handleShare}
                                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                            >
                                <Share2 size={18} className="customtext-primary" />
                            </button>
                           {/*
                            <button 
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                            >
                                <Heart 
                                    size={18} 
                                    className={isFavorite ? 'text-danger fill-danger' : 'customtext-primary'} 
                                />
                            </button>
                           */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h1 className="text-3xl lg:text-4xl font-bold customtext-primary mb-4">
                                {item?.name}
                            </h1>
                            
                           
                            
                            <div className="flex flex-wrap items-center gap-6 customtext-neutral-light">
                                {item?.max_occupancy > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Users size={20} className="customtext-accent" />
                                        <span className="font-medium">{item.max_occupancy} huéspedes</span>
                                    </div>
                                )}
                                {item?.beds_count > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Bed size={20} className="customtext-accent" />
                                        <span className="font-medium">{item.beds_count} cama{item.beds_count !== 1 ? 's' : ''}</span>
                                    </div>
                                )}
                                {item?.size_m2 > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Maximize2 size={20} className="customtext-accent" />
                                        <span className="font-medium">{item.size_m2} m²</span>
                                    </div>
                                )}
                            </div>
                        </div>
              
                        {/* Descripción */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold customtext-primary mb-4">Acerca de esta habitación</h2>
                            <div 
                                className="prose prose-gray max-w-none customtext-neutral-light leading-relaxed text-[15px]"
                                dangerouslySetInnerHTML={{ 
                                    __html: item?.description || item?.summary || '<p>Disfruta de una experiencia única en nuestra habitación, diseñada para brindarte el máximo confort y conexión con la naturaleza amazónica.</p>' 
                                }}
                            />
                        </div>
                        
                        {/* Amenidades con imágenes - estilo mejorado */}
                        {item?.amenities && item.amenities.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold customtext-primary mb-6">Todo lo que incluye</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {item.amenities.map((amenity, i) => (
                                        <div 
                                            key={amenity.id || i}
                                            className="flex items-center gap-4 p-4 rounded-xl hover:bg-sections-color transition-all duration-200 group cursor-pointer"
                                        >
                                            <div className="w-12 h-12 bg-sections-color group-hover:bg-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                                                {getAmenityImage(amenity, 24)}
                                            </div>
                                            <span className="customtext-primary font-medium text-[15px] group-hover:customtext-secondary transition-colors">
                                                {getAmenityName(amenity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Columna derecha - Card de reserva sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 space-y-4">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                {/* Header precio */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-3xl font-bold customtext-primary">
                                            {CurrencySymbol()}{pricePerNight.toFixed(0)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-lg customtext-neutral-light line-through">
                                                {CurrencySymbol()}{originalPrice.toFixed(0)}
                                            </span>
                                        )}
                                        <span className="customtext-neutral-light text-sm">/ noche</span>
                                    </div>
                                    {hasDiscount && (
                                        <div className="inline-flex items-center gap-1.5 bg-green-50 customtext-success px-3 py-1.5 rounded-lg text-xs font-semibold">
                                            <Sparkles size={12} />
                                            Ahorras {CurrencySymbol()}{(originalPrice - pricePerNight).toFixed(0)} por noche
                                        </div>
                                    )}
                                </div>
                                
                                {/* Formulario de reserva */}
                                <div className="p-6 space-y-4">
                                    {/* Selector de fechas moderno */}
                                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-accent transition-colors">
                                        <div className="grid grid-cols-2 divide-x-2 divide-gray-200">
                                            {/* Check-in */}
                                            <div className="p-4 lapetaca-datepicker-modern">
                                                <label className="block text-[10px] font-bold customtext-neutral-light uppercase tracking-wider mb-2">
                                                    Llegada
                                                </label>
                                                <DatePicker
                                                    selected={checkIn}
                                                    onChange={(date) => {
                                                        setCheckIn(date);
                                                        if (checkOut && date >= checkOut) {
                                                            setCheckOut(null);
                                                        }
                                                    }}
                                                    selectsStart
                                                    startDate={checkIn}
                                                    endDate={checkOut}
                                                    minDate={new Date()}
                                                    excludeDates={blockedDates}
                                                    filterDate={(date) => !isDateBlocked(date)}
                                                    locale={es}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Seleccionar"
                                                    disabled={loadingAvailability}
                                                    className="w-full text-sm font-semibold customtext-primary focus:outline-none bg-transparent cursor-pointer"
                                                />
                                            </div>
                                            
                                            {/* Check-out */}
                                            <div className="p-4 lapetaca-datepicker-modern">
                                                <label className="block text-[10px] font-bold customtext-neutral-light uppercase tracking-wider mb-2">
                                                    Salida
                                                </label>
                                                <DatePicker
                                                    selected={checkOut}
                                                    onChange={(date) => setCheckOut(date)}
                                                    selectsEnd
                                                    startDate={checkIn}
                                                    endDate={checkOut}
                                                    minDate={checkIn || new Date()}
                                                    excludeDates={blockedDates}
                                                    filterDate={(date) => !isDateBlocked(date)}
                                                    locale={es}
                                                    dateFormat="dd/MM/yyyy"
                                                    placeholderText="Seleccionar"
                                                    disabled={loadingAvailability || !checkIn}
                                                    className="w-full text-sm font-semibold customtext-primary focus:outline-none bg-transparent cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Selector de huéspedes */}
                                        <div className="border-t-2 border-gray-200" ref={guestsRef}>
                                            <div 
                                                className="p-4 cursor-pointer hover:bg-sections-color transition-colors"
                                                onClick={() => setShowGuestsPicker(!showGuestsPicker)}
                                            >
                                                <label className="block text-[10px] font-bold customtext-neutral-light uppercase tracking-wider mb-2">
                                                    Huéspedes
                                                </label>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold customtext-primary">
                                                        {guests} {guests === 1 ? 'huésped' : 'huéspedes'}
                                                    </span>
                                                    <ChevronRight 
                                                        size={18} 
                                                        className={`customtext-neutral-light transition-transform duration-200 ${showGuestsPicker ? 'rotate-90' : ''}`} 
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* Dropdown de huéspedes */}
                                            {showGuestsPicker && (
                                                <div className="px-4 pb-4 border-t border-gray-100 pt-4 animate-slideUp">
                                                    {/* Adultos */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <p className="font-semibold customtext-primary text-sm">Adultos</p>
                                                            <p className="text-xs customtext-neutral-light">Edad 13+</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (adults > 1) setAdults(adults - 1);
                                                                }}
                                                                disabled={adults <= 1}
                                                                className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span className="w-8 text-center font-bold customtext-primary text-lg">{adults}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (guests < (item?.max_occupancy || 4)) setAdults(adults + 1);
                                                                }}
                                                                disabled={guests >= (item?.max_occupancy || 4)}
                                                                className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Niños */}
                                                    <div className="flex items-center justify-between pb-3">
                                                        <div>
                                                            <p className="font-semibold customtext-primary text-sm">Niños</p>
                                                            <p className="text-xs customtext-neutral-light">Edad 0-12</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (children > 0) setChildren(children - 1);
                                                                }}
                                                                disabled={children <= 0}
                                                                className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span className="w-8 text-center font-bold customtext-primary text-lg">{children}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (guests < (item?.max_occupancy || 4)) setChildren(children + 1);
                                                                }}
                                                                disabled={guests >= (item?.max_occupancy || 4)}
                                                                className="w-9 h-9 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-current"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-xs customtext-neutral-light pt-2 border-t border-gray-100">
                                                        Capacidad máxima: {item?.max_occupancy || 4} personas
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Indicadores de estado */}
                                    {loadingAvailability && (
                                        <div className="flex items-center gap-2 text-sm customtext-neutral-light bg-sections-color px-4 py-3 rounded-xl">
                                            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                            Verificando disponibilidad...
                                        </div>
                                    )}
                                    
                                    {/* Mostrar mensaje solo si hay conflicto con fechas seleccionadas */}
                                    {!loadingAvailability && checkIn && checkOut && hasBlockedDatesInRange() && (
                                        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                                            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                            <span>Las fechas seleccionadas no están disponibles. Por favor elige otras fechas.</span>
                                        </div>
                                    )}
                                    
                                    {/* Resumen de noches */}
                                    {nights > 0 && (
                                        <div className="bg-sections-color px-4 py-3 rounded-xl">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="customtext-neutral-light">Tu estadía</span>
                                                <span className="font-semibold customtext-primary">
                                                    {nights} {nights === 1 ? 'noche' : 'noches'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Botón de reserva grande */}
                                    <button
                                        onClick={handleReserve}
                                        disabled={loading || !checkIn || !checkOut}
                                        className="w-full py-4 bg-primary hover:bg-secondary text-white font-bold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard size={20} />
                                                Reservar ahora
                                            </>
                                        )}
                                    </button>
                                
                                    
                                    {/* Desglose de precios */}
                                    {nights > 0 && (
                                        <div className="space-y-3 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-sm">
                                                <span className="customtext-neutral-light underline decoration-dotted cursor-help">
                                                    {CurrencySymbol()}{pricePerNight.toFixed(0)} × {nights} {nights === 1 ? 'noche' : 'noches'}
                                                </span>
                                                <span className="font-medium customtext-primary">{CurrencySymbol()}{totalPrice.toFixed(2)}</span>
                                            </div>
                                            {totalSavings > 0 && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="customtext-success font-medium">Descuento especial</span>
                                                    <span className="customtext-success font-bold">-{CurrencySymbol()}{totalSavings.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold text-lg customtext-primary pt-3 border-t border-gray-200">
                                                <span>Total</span>
                                                <span>{CurrencySymbol()}{grandTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* WhatsApp */}
                                {whatsappAdvisors.length > 0 && (
                                    <div className="px-6 pb-6 relative">
                                        <button
                                            ref={refs.setReference}
                                            {...getReferenceProps()}
                                            onClick={handleWhatsAppClick}
                                            className="group w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transform"
                                        >
                                            <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386"/>
                                            </svg>
                                            <span className="text-base">¿Dudas? Escríbenos</span>
                                            {whatsappAdvisors.length > 1 && (
                                                <ChevronDown 
                                                    size={18} 
                                                    className={`transition-transform duration-300 group-hover:translate-y-0.5 ${isAdvisorDropdownOpen ? 'rotate-180' : ''}`}
                                                />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                          
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal de galería fullscreen */}
            {showGalleryModal && (
                <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-10 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                        <button
                            onClick={() => setShowGalleryModal(false)}
                            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                        >
                            <X size={24} className="text-white" />
                        </button>
                        <span className="text-white font-semibold text-lg">
                            {selectedImage + 1} / {allImages.length}
                        </span>
                        <div className="w-12"></div>
                    </div>
                    
                    {/* Swiper fullscreen */}
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={true}
                        zoom={true}
                        initialSlide={selectedImage}
                        onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
                        modules={[Navigation, Zoom]}
                        className="h-full"
                    >
                        {allImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="swiper-zoom-container h-full flex items-center justify-center p-12">
                                    <img
                                        src={`/storage/images/item/${img.url}`}
                                        alt={img.alt}
                                        className="max-h-full max-w-full object-contain"
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* Thumbnails */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex justify-center gap-2 overflow-x-auto pb-2">
                            {allImages.slice(0, 10).map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                                        selectedImage === index 
                                            ? 'border-white scale-110 opacity-100' 
                                            : 'border-transparent opacity-50 hover:opacity-80 hover:scale-105'
                                    }`}
                                >
                                    <img
                                        src={`/storage/images/item/${img.url}`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Dropdown de Selección de Asesores */}
            {isAdvisorDropdownOpen && whatsappAdvisors.length > 1 && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-[1000]"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white">
                            <h3 className="font-bold text-base">Elige un asesor</h3>
                            <p className="text-xs text-white mt-1">
                                ¿Con quién quieres hablar?
                            </p>
                        </div>

                        {/* Lista de asesores */}
                        <div className="max-h-[400px] overflow-y-auto" style={{ minWidth: '280px', maxWidth: '320px' }}>
                            {whatsappAdvisors.map((advisor, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAdvisorSelect(advisor)}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                                >
                                    {/* Foto del asesor */}
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                            {advisor.photo ? (
                                                <img
                                                    src={`/assets/resources/${advisor.photo}`}
                                                    alt={advisor.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/assets/img/placeholder-user.png';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold">
                                                    {advisor.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Info del asesor */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {advisor.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {advisor.position || 'Asesor'}
                                        </p>
                                    </div>

                                    {/* Icono de WhatsApp */}
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.892 3.386"/>
                                        </svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </FloatingFocusManager>
            )}

            {/* Modal de Reserva Exitosa */}
            {showReservationModal && reservationData && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                        {/* Header con icono de éxito */}
                        <div className="relative p-5 text-center ">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <Check size={28} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold customtext-success mb-1">¡Reserva agregada!</h2>
                            <p className="text-sm customtext-neutral-light">Tu habitación está lista</p>
                            <button
                                onClick={() => setShowReservationModal(false)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-110 shadow-md"
                            >
                                <X size={18} className="customtext-neutral-dark" />
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="p-5 space-y-4">
                            {/* Card de la habitación */}
                            <div className="bg-sections-color rounded-2xl p-4 ">
                                <div className="flex items-start gap-3 mb-3">
                                    <img 
                                        src={`/storage/images/item/${reservationData.item.image}`}
                                        alt={reservationData.item.name}
                                        className="w-16 h-16 rounded-xl object-cover shadow-md flex-shrink-0"
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold customtext-primary text-base mb-0.5 truncate">
                                            {reservationData.item.name}
                                        </h3>
                                        <p className="text-xs customtext-neutral-light">
                                            {roomTypes[reservationData.item.room_type] || 'Habitación'}
                                        </p>
                                    </div>
                                </div>

                                {/* Detalles de la reserva */}
                                <div className="bg-white rounded-2xl p-3 space-y-2.5 text-sm">
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="customtext-accent" />
                                            <span className="text-xs customtext-neutral-light">Check-in</span>
                                        </div>
                                        <span className="font-semibold customtext-primary text-sm">
                                            {reservationData.checkIn.toLocaleDateString('es-PE', { 
                                                day: '2-digit', 
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="customtext-accent" />
                                            <span className="text-xs customtext-neutral-light">Check-out</span>
                                        </div>
                                        <span className="font-semibold customtext-primary text-sm">
                                            {reservationData.checkOut.toLocaleDateString('es-PE', { 
                                                day: '2-digit', 
                                                month: 'short'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="customtext-accent" />
                                            <span className="text-xs customtext-neutral-light">Duración</span>
                                        </div>
                                        <span className="font-semibold customtext-primary text-sm">
                                            {reservationData.nights} {reservationData.nights === 1 ? 'noche' : 'noches'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="customtext-accent" />
                                            <span className="text-xs customtext-neutral-light">Huéspedes</span>
                                        </div>
                                        <span className="font-semibold customtext-primary text-sm">
                                            {reservationData.guests} {reservationData.guests === 1 ? 'persona' : 'personas'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className=" rounded-xl p-4 ">
                                
                                <div className="flex items-center justify-between ">
                                    <span className="text-base font-bold customtext-primary">Total:</span>
                                    <span className="text-2xl font-bold customtext-neutral-dark">
                                        {CurrencySymbol()}{reservationData.totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col sm:flex-row gap-2.5">
                                <button
                                    onClick={() => {
                                        setShowReservationModal(false);
                                        window.location.href = '/cart';
                                    }}
                                    className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <ShoppingCart size={18} />
                                    <span>Ir al carrito</span>
                                </button>
                                <button
                                    onClick={() => setShowReservationModal(false)}
                                    className="flex-1 bg-white hover:bg-sections-color customtext-primary font-semibold py-3 px-6 rounded-full transition-all duration-300 border-2 border-gray-200 hover:border-accent shadow-md hover:shadow-lg"
                                >
                                    Seguir explorando
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetailLaPetaca;
