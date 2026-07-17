<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use App\Models\SaleStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends BasicController
{
    public $reactView = 'Customer/Dashboard';

    public function setReactViewProperties(Request $request)
    {
        $userId = Auth::id();

        // Get all sale statuses to know their IDs dynamically
        $statuses = SaleStatus::all()->keyBy('name');
        
        $pendingIds = [];
        foreach (['Pendiente', 'En producción', 'Enviado', 'Pagado - Por verificar', 'Pagado'] as $statusName) {
            if (isset($statuses[$statusName])) {
                $pendingIds[] = $statuses[$statusName]->id;
            }
        }

        $deliveredId = isset($statuses['Entregado']) ? $statuses['Entregado']->id : null;
        $anuladoId = isset($statuses['Anulado']) ? $statuses['Anulado']->id : null;
        $rechazadoId = isset($statuses['Rechazado']) ? $statuses['Rechazado']->id : null;

        $salesQuery = Sale::where('user_id', $userId);

        // Get total orders
        $totalOrders = (clone $salesQuery)->count();

        // Get pending/in-progress orders
        $pendingOrders = 0;
        if (!empty($pendingIds)) {
            $pendingOrders = (clone $salesQuery)->whereIn('status_id', $pendingIds)->count();
        }

        // Get completed/delivered orders
        $completedOrders = $deliveredId ? (clone $salesQuery)->where('status_id', $deliveredId)->count() : 0;

        // Get total spent: we sum the calculated totals of all sales that are NOT canceled/rejected
        $excludeIds = array_filter([$anuladoId, $rechazadoId]);
        $spentQuery = clone $salesQuery;
        if (!empty($excludeIds)) {
            $spentQuery->whereNotIn('status_id', $excludeIds);
        }
        $allSales = $spentQuery->get();
        
        $totalSpent = 0;
        foreach ($allSales as $sale) {
            $totalSpent += (float)$sale->amount 
                + (float)($sale->delivery ?? 0) 
                + (float)($sale->seguro_importacion_total ?? 0) 
                + (float)($sale->derecho_arancelario_total ?? 0) 
                + (float)($sale->flete_total ?? 0) 
                - (float)($sale->bundle_discount ?? 0) 
                - (float)($sale->renewal_discount ?? 0) 
                - (float)($sale->coupon_discount ?? 0);
        }

        // Fetch last 5 orders
        $recentOrders = Sale::with(['status', 'store'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Fetch support contact details dynamically
        $supportPhone = \App\Models\General::where('correlative', 'support_phone')->value('description')
            ?? \App\Models\General::where('correlative', 'phone_contact')->value('description');
        if ($supportPhone) {
            $supportPhone = trim(explode(',', $supportPhone)[0]);
        }

        $supportEmail = \App\Models\General::where('correlative', 'support_email')->value('description')
            ?? \App\Models\General::where('correlative', 'email_contact')->value('description');
        if ($supportEmail) {
            $supportEmail = trim(explode(',', $supportEmail)[0]);
        }

        return [
            'stats' => [
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'completed_orders' => $completedOrders,
                'total_spent' => $totalSpent,
            ],
            'recentOrders' => $recentOrders,
            'support' => [
                'phone' => $supportPhone,
                'email' => $supportEmail,
            ],
            'session' => Auth::user(),
        ];
    }
}
