<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

class Booking extends Model
{
    use HasFactory, HasUuids, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'sale_id',
        'item_id',
        'check_in',
        'check_out',
        'nights',
        'guests',
        'adults',
        'children',
        'price_per_night',
        'total_price',
        'status',
        'special_requests',
        'confirmed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Ruta para notificaciones por email
     */
    public function routeNotificationForMail($notification)
    {
        return $this->sale->email ?? null;
    }

    // ============ RELACIONES ============

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function room()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    /**
     * Alias de room() para compatibilidad
     */
    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function saleDetail()
    {
        return $this->hasOne(SaleDetail::class);
    }

    // ============ SCOPES ============

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'confirmed']);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('check_in', '>=', now());
    }

    public function scopePast($query)
    {
        return $query->where('check_out', '<', now());
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // ============ MÉTODOS ============

    /**
     * Calcular número de noches
     */
    public function calculateNights()
    {
        return $this->check_in->diffInDays($this->check_out);
    }

    /**
     * Verificar si la reserva puede ser modificada
     */
    public function isModifiable()
    {
        return $this->check_in->isFuture() 
            && in_array($this->status, ['pending', 'confirmed']);
    }

    /**
     * Verificar si puede ser cancelada
     */
    public function isCancellable()
    {
        // Permitir cancelación hasta 24h antes del check-in
        return $this->check_in->subDay()->isFuture() 
            && in_array($this->status, ['pending', 'confirmed']);
    }

    /**
     * Confirmar reserva
     */
    public function confirm()
    {
        $this->update([
            'status' => 'confirmed',
            'confirmed_at' => now()
        ]);

        // Reservar habitación en el calendario de disponibilidad
        RoomAvailability::reserveRooms(
            $this->item_id,
            $this->check_in,
            $this->check_out,
            1
        );
    }

    /**
     * Cancelar reserva
     */
    public function cancel($reason = null)
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason
        ]);

        // Liberar disponibilidad
        RoomAvailability::releaseRooms(
            $this->item_id,
            $this->check_in,
            $this->check_out,
            1
        );
    }

    /**
     * Completar reserva (después del check-out)
     */
    public function complete()
    {
        $this->update([
            'status' => 'completed'
        ]);

        // Liberar disponibilidad después del check-out
        RoomAvailability::releaseRooms(
            $this->item_id,
            $this->check_in,
            $this->check_out,
            1
        );
    }

    /**
     * Marcar como no show
     */
    public function markAsNoShow()
    {
        $this->update([
            'status' => 'no_show'
        ]);

        // Liberar disponibilidad
        RoomAvailability::releaseRooms(
            $this->item_id,
            $this->check_in,
            $this->check_out,
            1
        );
    }
}
