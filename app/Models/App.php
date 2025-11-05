<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class App extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    protected $fillable = [
        'name',
        'store',
        'logo',
        'image',
        'link',
        'downloads',
        'downloads_unit',
        'rating',
        'visible',
        'status',
    ];

    protected $casts = [
        'downloads' => 'integer',
        'rating' => 'decimal:1',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    /**
     * Get all visible apps
     */
    public static function getVisibleApps()
    {
        return self::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Calculate total downloads from all visible apps
     */
    public static function getTotalDownloads()
    {
        $apps = self::getVisibleApps();
        $total = 0;

        foreach ($apps as $app) {
            $multiplier = 1;
            $unit = strtoupper($app->downloads_unit ?? '');
            switch ($unit) {
                case 'M':
                    $multiplier = 1000000;
                    break;
                case 'K':
                    $multiplier = 1000;
                    break;
            }
            $total += (int)$app->downloads * $multiplier;
        }

        return $total;
    }

    /**
     * Get formatted downloads string
     */
    public static function getFormattedDownloads()
    {
        $total = self::getTotalDownloads();

        if ($total >= 1000000) {
            return '+' . number_format($total / 1000000, 1) . 'M';
        } elseif ($total >= 1000) {
            return '+' . number_format($total / 1000, 0) . 'K';
        }

        return '+' . number_format($total);
    }

    /**
     * Calculate average rating from all visible apps
     */
    public static function getAverageRating()
    {
        return self::where('visible', true)
            ->where('status', true)
            ->avg('rating') ?? 0;
    }
}
