<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Item;
use App\Models\Sale;
use App\Models\RoomAvailability;
use App\Notifications\BookingSummaryNotification;
use App\Notifications\AdminBookingNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;
use SoDe\Extend\Trace;

class BookingController extends Controller
{
    /**
     * Buscar habitaciones disponibles
     */
    public function search(Request $request)
    {
        $response = new Response();
        
        try {
            $validated = $request->validate([
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
                'guests' => 'nullable|integer|min:1|max:10',
                'room_type' => 'nullable|string',
            ]);

            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);
            $guests = $validated['guests'] ?? 1;
            $nights = $checkIn->diffInDays($checkOut);

            // Buscar habitaciones disponibles
            $query = Item::rooms()
                ->where('status', true)
                ->where('visible', true)
                ->with(['amenities', 'images']);

            // Filtrar por capacidad
            if ($guests) {
                $query->where('max_occupancy', '>=', $guests);
            }

            // Filtrar por tipo de habitación
            if (!empty($validated['room_type'])) {
                $query->where('room_type', $validated['room_type']);
            }

            $rooms = $query->get()->map(function ($room) use ($checkIn, $checkOut, $nights) {
                // Verificar disponibilidad en el rango de fechas
                $available = RoomAvailability::checkAvailability(
                    $room->id,
                    $checkIn,
                    $checkOut
                );

                $room->available_count = $available;
                $room->is_available = $available > 0;
                $room->nights = $nights;
                $room->total_price = $room->price * $nights;
                $room->total_price_with_discount = $room->final_price * $nights;

                return $room;
            })->filter(function ($room) {
                return $room->is_available;
            })->values();

            $response->status = 200;
            $response->message = 'Habitaciones disponibles encontradas';
            $response->data = [
                'rooms' => $rooms,
                'check_in' => $checkIn->format('Y-m-d'),
                'check_out' => $checkOut->format('Y-m-d'),
                'nights' => $nights,
                'guests' => $guests,
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Crear una nueva reserva desde el sitio web
     */
    public function create(Request $request)
    {
        $response = new Response();
        
        try {
            $validated = $request->validate([
                'item_id' => 'required|exists:items,id',
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
                'guests' => 'required|integer|min:1|max:10',
                'guest_name' => 'required|string|max:255',
                'guest_email' => 'required|email|max:255',
                'guest_phone' => 'required|string|max:20',
                'special_requests' => 'nullable|string|max:1000',
            ]);

            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);
            $nights = $checkIn->diffInDays($checkOut);

            // Verificar que la habitación exista y sea del tipo room
            $room = Item::rooms()->findOrFail($validated['item_id']);

            // Verificar disponibilidad
            $available = RoomAvailability::checkAvailability(
                $room->id,
                $checkIn,
                $checkOut
            );

            if ($available < 1) {
                throw new \Exception('La habitación no está disponible para las fechas seleccionadas');
            }

            DB::beginTransaction();

            // Reservar la habitación
            RoomAvailability::reserveRooms($room->id, $checkIn, $checkOut, 1);

            // Crear la reserva
            $booking = Booking::create([
                'item_id' => $room->id,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'nights' => $nights,
                'guests' => $validated['guests'],
                'guest_name' => $validated['guest_name'],
                'guest_email' => $validated['guest_email'],
                'guest_phone' => $validated['guest_phone'],
                'price_per_night' => $room->final_price,
                'total_price' => $room->final_price * $nights,
                'status' => 'pending',
                'special_requests' => $validated['special_requests'] ?? null,
                'confirmation_code' => strtoupper(Str::random(8)),
            ]);

            DB::commit();

            $response->status = 200;
            $response->message = 'Reserva creada exitosamente';
            $response->data = $booking->load('item');

        } catch (\Throwable $th) {
            DB::rollBack();
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Rastrear una reserva por código de confirmación
     */
    public function track(Request $request, string $code)
    {
        $response = new Response();
        
        try {
            $booking = Booking::where('confirmation_code', strtoupper($code))
                ->with(['item.amenities', 'sale'])
                ->firstOrFail();

            $response->status = 200;
            $response->message = 'Reserva encontrada';
            $response->data = $booking;

        } catch (\Throwable $th) {
            $response->status = 404;
            $response->message = 'Reserva no encontrada';
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Obtener detalles de una reserva por código de venta
     * Este método es usado por la página de confirmación
     */
    public function getBookingOrder(Request $request)
    {
        try {
            $code = $request->code;
            
            if (!$code) {
                return response()->json([
                    'status' => false,
                    'message' => 'Código de reserva no proporcionado',
                ], 400);
            }

            // Buscar la venta por código
            $sale = Sale::where('code', $code)->first();
            
            if (!$sale) {
                return response()->json([
                    'status' => false,
                    'message' => 'Reserva no encontrada',
                ], 404);
            }

            // Obtener los bookings asociados a esta venta
            $bookings = Booking::where('sale_id', $sale->id)
                ->with(['item.images', 'item.amenities'])
                ->get();

            if ($bookings->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No se encontraron habitaciones reservadas',
                ], 404);
            }

            // Formatear los items (habitaciones) para la respuesta
            $items = $bookings->map(function ($booking) {
                $room = $booking->item;
                return [
                    'id' => $room->id ?? null,
                    'name' => $room->name ?? 'Habitación',
                    'image' => $room->image ?? null,
                    'room_type' => $room->room_type ?? null,
                    'max_occupancy' => $room->max_occupancy ?? null,
                    'check_in' => $booking->check_in ? $booking->check_in->format('Y-m-d') : null,
                    'check_out' => $booking->check_out ? $booking->check_out->format('Y-m-d') : null,
                    'nights' => $booking->nights,
                    'guests' => $booking->guests,
                    'adults' => $booking->adults ?? $booking->guests,
                    'children' => $booking->children ?? 0,
                    'price' => $booking->price_per_night,
                    'final_price' => $booking->price_per_night,
                    'total_price' => $booking->total_price,
                    'status' => $booking->status,
                    'special_requests' => $booking->special_requests,
                    'amenities' => $room->amenities ?? [],
                ];
            });

            // Calcular totales
            $totalAmount = $bookings->sum('total_price');

            // Devolver respuesta en el mismo formato que getOrder de MercadoPago
            return response()->json([
                'status' => true,
                'order' => [
                    'code' => $sale->code,
                    'created_at' => $sale->created_at ? $sale->created_at->format('d/m/Y H:i') : null,
                    'payment_status' => $sale->payment_status,
                    'payment_method' => $sale->payment_method,
                    'amount' => $totalAmount,
                    'total_amount' => $sale->amount ?? $totalAmount,
                    'coupon_id' => $sale->coupon_id,
                    'coupon_code' => $sale->coupon_code,
                    'coupon_discount' => $sale->coupon_discount ?? 0,
                    'payment_commission' => $sale->payment_commission ?? 0,
                    // Información del cliente
                    'name' => $sale->name,
                    'lastname' => $sale->lastname,
                    'fullname' => $sale->fullname ?? ($sale->name . ' ' . $sale->lastname),
                    'email' => $sale->email,
                    'phone' => $sale->phone,
                    'phone_prefix' => $sale->phone_prefix ?? '51',
                    'document' => $sale->document,
                    'documentType' => $sale->documentType,
                    'invoiceType' => $sale->invoiceType,
                    'businessName' => $sale->businessName,
                    // Items (habitaciones)
                    'items' => $items,
                    // Información adicional
                    'comment' => $sale->comment,
                    'special_requests' => $sale->reference,
                ],
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al obtener los detalles de la reserva',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Procesar checkout de reservas de habitaciones con comprobante de pago
     * Este método maneja pagos con voucher (Yape, Transferencia)
     */
    public function checkout(Request $request)
    {
        $response = new Response();
        
        try {
            // Parsear detalles de habitaciones
            $details = $request->details;
            if (is_string($details)) {
                $details = json_decode($details, true);
            }
            
            if (empty($details) || !is_array($details)) {
                throw new \Exception('No se encontraron habitaciones para reservar');
            }

            DB::beginTransaction();

            // Generar código único para la venta/reserva
            $saleCode = Trace::getId();
            
            // Procesar imagen de comprobante de pago si existe
            $paymentProof = null;
            if ($request->hasFile('payment_proof')) {
                $file = $request->file('payment_proof');
                $uuid = Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $path = "images/sale/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($file));
                $paymentProof = "{$uuid}.{$ext}";
            }

            // Calcular totales
            $totalAmount = 0;
            $roomsData = [];

            foreach ($details as $room) {
                $roomItem = Item::rooms()->find($room['id']);
                if (!$roomItem) {
                    throw new \Exception("Habitación no encontrada: {$room['id']}");
                }

                $checkIn = Carbon::parse($room['check_in']);
                $checkOut = Carbon::parse($room['check_out']);
                $nights = $room['nights'] ?? $checkIn->diffInDays($checkOut);
                $guests = $room['guests'] ?? 2;
                $pricePerNight = $room['final_price'] ?? $roomItem->final_price;
                $roomTotal = $pricePerNight * $nights;

                // Verificar disponibilidad
                $available = RoomAvailability::checkAvailability($roomItem->id, $checkIn, $checkOut);
                if ($available < 1) {
                    throw new \Exception("La habitación '{$roomItem->name}' no está disponible para las fechas seleccionadas");
                }

                $totalAmount += $roomTotal;
                $roomsData[] = [
                    'item' => $roomItem,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'nights' => $nights,
                    'guests' => $guests,
                    'adults' => $room['adults'] ?? $guests,
                    'children' => $room['children'] ?? 0,
                    'price_per_night' => $pricePerNight,
                    'total_price' => $roomTotal,
                ];
            }

            // Aplicar descuento de cupón si existe
            $couponDiscount = floatval($request->coupon_discount ?? 0);
            $paymentCommission = floatval($request->payment_commission ?? 0);
            $finalTotal = $totalAmount - $couponDiscount + $paymentCommission;

            // Crear la venta/orden
            $sale = Sale::create([
                'code' => $saleCode,
                'user_id' => Auth::id(),
                'name' => $request->name,
                'lastname' => $request->lastname,
                'fullname' => $request->fullname ?? ($request->name . ' ' . $request->lastname),
                'email' => $request->email,
                'phone' => $request->phone,
                'phone_prefix' => $request->phone_prefix ?? '51',
                'country' => $request->country ?? 'Perú',
                'department' => $request->department ?? null,
                'province' => $request->province ?? null,
                'district' => $request->district ?? null,
                'address' => $request->address ?? null,
                'number' => $request->number ?? null,
                'comment' => $request->comment ?? null,
                'reference' => $request->special_requests ?? null,
                'delivery' => 0,
                'delivery_type' => 'booking', // Tipo especial para reservas
                'amount' => $finalTotal,
                'payment_method' => $request->payment_method,
                'payment_proof' => $paymentProof,
                'payment_status' => 'pendiente',
                'invoiceType' => $request->invoiceType ?? 'boleta',
                'documentType' => $request->documentType ?? 'dni',
                'document' => $request->document ?? null,
                'businessName' => $request->businessName ?? null,
                'status_id' => 'bd60fc99-c0c0-463d-b738-1c72d7b085f5', // Estado inicial pendiente
                'coupon_id' => $request->coupon_id,
                'coupon_discount' => $couponDiscount,
                'booking_type' => 'rooms', // Identificador para reservas de hotel
            ]);

            // Crear las reservas (bookings) asociadas
            $bookings = [];
            foreach ($roomsData as $roomData) {
                // Reservar la disponibilidad
                RoomAvailability::reserveRooms(
                    $roomData['item']->id,
                    $roomData['check_in'],
                    $roomData['check_out'],
                    1
                );

                // Crear el booking
                $booking = Booking::create([
                    'sale_id' => $sale->id,
                    'item_id' => $roomData['item']->id,
                    'check_in' => $roomData['check_in'],
                    'check_out' => $roomData['check_out'],
                    'nights' => $roomData['nights'],
                    'guests' => $roomData['guests'],
                    'adults' => $roomData['adults'] ?? $roomData['guests'],
                    'children' => $roomData['children'] ?? 0,
                    'price_per_night' => $roomData['price_per_night'],
                    'total_price' => $roomData['total_price'],
                    'status' => 'pending',
                    'special_requests' => $request->special_requests ?? null,
                ]);

                $bookings[] = $booking->load('item');
            }

            DB::commit();

            // Enviar correos de confirmación
            try {
                // Cargar la relación de status para los correos
                $sale->load('status');
                
                // Enviar correo al cliente
                Notification::route('mail', $sale->email)
                    ->notify(new BookingSummaryNotification($sale, $bookings));
                
                // Enviar correo al administrador
                $coorporativeEmail = \App\Models\General::where('correlative', 'coorporative_email')->first();
                if ($coorporativeEmail && $coorporativeEmail->description) {
                    Notification::route('mail', $coorporativeEmail->description)
                        ->notify(new AdminBookingNotification($sale, $bookings));
                }
                
            } catch (\Throwable $emailError) {
                // Log del error pero no fallar la reserva
                \Illuminate\Support\Facades\Log::error('Error al enviar correos de reserva', [
                    'sale_id' => $sale->id,
                    'error' => $emailError->getMessage()
                ]);
            }

            $response->status = 200;
            $response->message = 'Reserva procesada exitosamente';
            $response->data = [
                'sale' => $sale,
                'bookings' => $bookings,
                'code' => $saleCode,
            ];

        } catch (\Throwable $th) {
            DB::rollBack();
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }
}
