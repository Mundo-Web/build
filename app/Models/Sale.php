<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Sale extends Model
{
    use HasFactory, HasUuids, Notifiable;
    /**
     * Route notifications for the mail channel.
     *
     * @return string
     */
    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'user_id',
        'name',
        'lastname',
        'fullname',
        'email',
        'phone',
        'phone_prefix',
        'country',
        'department',
        'province',
        'district',
        'ubigeo',
        'address',
        'number',
        'reference',
        'comment',
        'amount',
        'delivery',
        'delivery_type',
        'status_id',
        'coupon_id',
        'coupon_code',
        'coupon_discount',
        'culqi_charge_id',
        'payment_status',
        'invoiceType',
        'documentType',
        'document',
        'businessName',
        'payment_method',
        'payment_proof',
        'coupon_id',
        'coupon_discount',
        'applied_promotions',
        'promotion_discount',
        'total_amount',
    ];

    protected $casts = [
        'applied_promotions' => 'array',
        'promotion_discount' => 'decimal:2',
        'coupon_discount' => 'decimal:2',
        'amount' => 'decimal:2',
        'delivery' => 'decimal:2',
    ];

    public function details()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function status()
    {
        return $this->belongsTo(SaleStatus::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function scopeWithUser($query)
    {
        return $query->with(['user' => function ($q) {
            $q->select('id', 'name');
        }]);
    }
}
