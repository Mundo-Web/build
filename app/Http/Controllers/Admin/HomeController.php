<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Benefit;
use App\Models\Item;
use App\Models\Sale;
use App\Models\SaleStatus;
use App\Models\General;
use App\Models\AnalyticsEvent;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Service;
use App\Models\Message;
use Carbon\Carbon;
use Culqi\Culqi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Support\Facades\Log;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';
    public $reactRootView = 'admin';

    public function setReactViewProperties(Request $request)
    {
        
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfYear = Carbon::now()->startOfYear();

        // Total productos activos (visible = 1, status activo)
        $totalProducts = Item::where('visible', true)->where('status', 1)->count();

        // Total stock disponible
        $totalStock = Item::where('visible', true)->where('status', 1)->sum('stock');

        // Total ventas y monto generado hoy, mes, año
        $salesToday = Sale::whereDate('created_at', $today)->count();
        $salesMonth = Sale::whereBetween('created_at', [$startOfMonth, Carbon::now()])->count();
        $salesYear = Sale::whereBetween('created_at', [$startOfYear, Carbon::now()])->count();

        $incomeToday = Sale::whereDate('created_at', $today)->sum('amount');
        $incomeMonth = Sale::whereBetween('created_at', [$startOfMonth, Carbon::now()])->sum('amount');
        $incomeYear = Sale::whereBetween('created_at', [$startOfYear, Carbon::now()])->sum('amount');

        // Pedidos por estado
        $statuses = SaleStatus::all();
        $ordersByStatus = [];
        foreach ($statuses as $status) {
            $count = Sale::where('status_id', $status->id)->count();
            $ordersByStatus[] = [
                'name' => $status->name,
                'color' => $status->color,
                'count' => $count
            ];
        }

        // Productos más vendidos (top 5)
        $topProducts = DB::table('sale_details')
            ->select('item_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('item_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function($row) {
                $item = Item::find($row->item_id);
                return [
                    'name' => $item ? $item->name : 'Desconocido',
                    'quantity' => $row->total_quantity,
                    'image' => $item ? $item->image : null,
                ];
            });

        // Nuevos productos destacados (is_new o featured)
        $newFeatured = Item::where('visible', true)
            ->where(function ($q) {
                $q->where('is_new', true)
                  ->orWhere('featured', true);
            })
            ->limit(5)
            ->get(['id', 'name', 'image', 'price']);

        // Ventas por dispositivo (simulación / ejemplo)
        // Asumimos que tienes columna 'device' en tabla sales con valores: desktop, mobile, tablet, other
      /*  $salesByDevice = Sale::select('device', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('device')
            ->get();*/

        // Ventas por ubicación (departamento, provincia, distrito)
        $salesByLocation = Sale::select('department', 'province', 'district', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('department', 'province', 'district')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
            $latestTransactions = Sale::latest()->take(5)->get();
        // Cupones más usados (top 5)
        $topCoupons = \App\Models\Coupon::orderByDesc('used_count')->limit(5)->get(['code', 'name', 'used_count', 'value', 'type']);

        // Reglas de descuento más usadas (top 5)
        $topDiscountRules = DB::table('discount_rule_usages')
            ->select('discount_rule_id', DB::raw('COUNT(*) as times_used'), DB::raw('SUM(discount_amount) as total_discount'))
            ->groupBy('discount_rule_id')
            ->orderByDesc('times_used')
            ->limit(5)
            ->get()
            ->map(function($row) {
                $rule = \App\Models\DiscountRule::find($row->discount_rule_id);
                return [
                    'name' => $rule ? $rule->name : 'Desconocido',
                    'times_used' => $row->times_used,
                    'total_discount' => $row->total_discount
                ];
            });

        // Marcas activas y su estado
        $brands = \App\Models\Brand::select('name', 'status', 'featured', 'visible')->get();

        // Top clientes por compras (top 5) usando user_id y users.email
        $topClients = DB::table('sales')
            ->join('users', 'sales.user_id', '=', 'users.id')
            ->select('users.email', DB::raw('COUNT(sales.id) as total_orders'), DB::raw('SUM(sales.amount) as total_spent'))
            ->groupBy('users.email')
            ->orderByDesc('total_spent')
            ->limit(5)
            ->get();

        // Ventas y pedidos últimos 30 días (para gráfica compuesta)
        $salesLast30Days = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $sales = Sale::whereDate('created_at', $date)->sum('amount');
            $orders = Sale::whereDate('created_at', $date)->count();
            $salesLast30Days[] = [
                'date' => $date->format('Y-m-d'),
                'amount' => $sales,
                'orders' => $orders
            ];
        }

        // Nuevos usuarios (hoy, mes, año)
        $usersToday = \App\Models\User::whereDate('created_at', $today)->count();
        $usersMonth = \App\Models\User::whereBetween('created_at', [$startOfMonth, Carbon::now()])->count();
        $usersYear = \App\Models\User::whereBetween('created_at', [$startOfYear, Carbon::now()])->count();

        // Mensajes de contacto (hoy, mes, año)
        $messagesToday = Message::whereDate('created_at', $today)->count();
        $messagesMonth = Message::whereBetween('created_at', [$startOfMonth, Carbon::now()])->count();
        $messagesYear = Message::whereBetween('created_at', [$startOfYear, Carbon::now()])->count();
        
        // Mensajes no leídos
        $messagesUnread = Message::where('seen', false)->count();

        // Satisfacción del cliente (dummy, si no hay tabla de feedback)
        $customerSatisfaction = 94.3;

        // === NUEVAS FUNCIONALIDADES ANALÍTICAS ===
        
        // Productos más vistos usando analytics_events
        $mostViewedProducts = DB::table('analytics_events')
            ->select('item_id', DB::raw('COUNT(*) as view_count'))
            ->where('event_type', 'product_view')
            ->whereNotNull('item_id')
            ->groupBy('item_id')
            ->orderByDesc('view_count')
            ->limit(10)
            ->get()
            ->map(function($row) {
                $item = Item::find($row->item_id);
                return [
                    'id' => $row->item_id,
                    'name' => $item ? $item->name : 'Producto Desconocido',
                    'view_count' => $row->view_count,
                    'image' => $item ? $item->image : null,
                    'price' => $item ? $item->price : 0
                ];
            });

        // Visitas por día del mes actual (para gráfica de barras)
        $visitsThisMonth = [];
        $daysInMonth = Carbon::now()->daysInMonth;
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::now()->startOfMonth()->addDays($day - 1);
            $visits = AnalyticsEvent::whereDate('created_at', $date)
                ->where('event_type', 'product_view')
                ->count();
            $visitsThisMonth[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $day,
                'visits' => $visits,
                'label' => $date->format('d/m')
            ];
        }

        // Categorías y cantidad de productos por categoría (para gráfico circular)
        $categoriesWithProducts = DB::table('categories')
            ->select('categories.name', 'categories.id', DB::raw('COUNT(items.id) as product_count'))
            ->leftJoin('items', function($join) {
                $join->on('categories.id', '=', 'items.category_id')
                     ->where('items.status', 1)
                     ->where('items.visible', true);
            })
            ->where('categories.status', 1)
            ->where('categories.visible', true)
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('product_count')
            ->get()
            ->map(function($row) {
                return [
                    'name' => $row->name,
                    'value' => $row->product_count,
                    'percentage' => 0 // Se calculará en el frontend
                ];
            });

        // Marcas y cantidad de productos por marca (para gráfico circular)
        $brandsWithProducts = DB::table('brands')
            ->select('brands.name', 'brands.id', DB::raw('COUNT(items.id) as product_count'))
            ->leftJoin('items', function($join) {
                $join->on('brands.id', '=', 'items.brand_id')
                     ->where('items.status', 1)
                     ->where('items.visible', true);
            })
            ->where('brands.status', 1)
            ->where('brands.visible', true)
            ->groupBy('brands.id', 'brands.name')
            ->orderByDesc('product_count')
            ->get()
            ->map(function($row) {
                return [
                    'name' => $row->name,
                    'value' => $row->product_count,
                    'percentage' => 0 // Se calculará en el frontend
                ];
            });

        // KPIs adicionales
        $totalCategories = Category::where('status', 1)->where('visible', true)->count();
        $totalBrands = Brand::where('status', 1)->where('visible', true)->count();
        $totalActiveProducts = Item::where('status', 1)->where('visible', true)->count();

        // === ANALYTICS DE SERVICIOS ===
        
        // Total de servicios activos
        $totalServices = Service::where('status', 1)->where('visible', true)->count();
        
        // Total de categorías de servicios activas
        $totalServiceCategories = \App\Models\ServiceCategory::where('status', 1)->where('visible', true)->count();
        
        // Servicios destacados
        $featuredServices = Service::where('status', 1)
            ->where('visible', true)
            ->where('featured', true)
            ->count();
        
        // Servicios más vistos (top 10)
        $mostViewedServices = DB::table('analytics_events')
            ->select('service_id', DB::raw('COUNT(*) as view_count'))
            ->where('event_type', 'service_view')
            ->whereNotNull('service_id')
            ->groupBy('service_id')
            ->orderByDesc('view_count')
            ->limit(10)
            ->get()
            ->map(function($row) {
                $service = Service::find($row->service_id);
                return [
                    'id' => $row->service_id,
                    'name' => $service ? $service->name : 'Servicio Desconocido',
                    'view_count' => $row->view_count,
                    'image' => $service ? $service->image : null,
                    'category' => $service && $service->category ? $service->category->name : null,
                ];
            });

        // Servicios más clickeados (top 10) - NUEVO
        $mostClickedServices = Service::select('id', 'name', 'image', 'clicks')
            ->where('status', 1)
            ->where('visible', true)
            ->orderByDesc('clicks')
            ->limit(10)
            ->get()
            ->map(function($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'clicks' => $service->clicks,
                    'image' => $service->image,
                    'category' => $service->category ? $service->category->name : null,
                ];
            });

        // Clicks de servicios hoy, mes, año - NUEVO
        $serviceClicksToday = DB::table('service_clicks')
            ->whereDate('created_at', $today)
            ->count();
        
        $serviceClicksMonth = DB::table('service_clicks')
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->count();
        
        $serviceClicksYear = DB::table('service_clicks')
            ->whereBetween('created_at', [$startOfYear, Carbon::now()])
            ->count();

        // Clicks únicos vs totales del mes - NUEVO
        $uniqueClickersMonth = DB::table('service_clicks')
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->distinct('user_hash')
            ->count('user_hash');

        // CTR (Click Through Rate) de servicios - NUEVO
        $serviceViewsMonth = AnalyticsEvent::whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->where('event_type', 'service_view')
            ->count();
        
        $serviceCTR = $serviceViewsMonth > 0 
            ? round(($serviceClicksMonth / $serviceViewsMonth) * 100, 2) 
            : 0;

        // Vistas de servicios por día del mes actual
        $serviceVisitsThisMonth = [];
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::now()->startOfMonth()->addDays($day - 1);
            $visits = AnalyticsEvent::whereDate('created_at', $date)
                ->where('event_type', 'service_view')
                ->count();
            $serviceVisitsThisMonth[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $day,
                'visits' => $visits,
                'label' => $date->format('d/m')
            ];
        }

        // Vistas por dispositivo (servicios)
        $serviceViewsByDevice = AnalyticsEvent::select('device_type', DB::raw('COUNT(*) as count'))
            ->where('event_type', 'service_view')
            ->whereNotNull('service_id')
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'unknown',
                    'count' => $row->count,
                ];
            });

        // Últimas 30 días: vistas, clicks y CTR - NUEVO (mejorado)
        $serviceViewsLast30Days = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            
            $views = AnalyticsEvent::whereDate('created_at', $date)
                ->where('event_type', 'service_view')
                ->count();
            
            $clicks = DB::table('service_clicks')
                ->whereDate('created_at', $date)
                ->count();
            
            $uniqueUsers = AnalyticsEvent::whereDate('created_at', $date)
                ->where('event_type', 'service_view')
                ->distinct('session_id')
                ->count('session_id');
            
            $dailyCTR = $views > 0 ? round(($clicks / $views) * 100, 2) : 0;
            
            $serviceViewsLast30Days[] = [
                'date' => $date->format('Y-m-d'),
                'views' => $views,
                'clicks' => $clicks,
                'unique_users' => $uniqueUsers,
                'ctr' => $dailyCTR
            ];
        }

        // Clicks de servicios por día del mes actual - NUEVO
        $serviceClicksThisMonth = [];
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = Carbon::now()->startOfMonth()->addDays($day - 1);
            $clicks = DB::table('service_clicks')
                ->whereDate('created_at', $date)
                ->count();
            $serviceClicksThisMonth[] = [
                'date' => $date->format('Y-m-d'),
                'day' => $day,
                'clicks' => $clicks,
                'label' => $date->format('d/m')
            ];
        }

        // Clicks por dispositivo (servicios) - NUEVO
        $serviceClicksByDevice = DB::table('service_clicks')
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'unknown',
                    'count' => $row->count,
                ];
            });

        // Clicks de hoy por dispositivo - NUEVO
        $serviceClicksTodayByDevice = DB::table('service_clicks')
            ->select('device_type', DB::raw('COUNT(*) as count'))
            ->whereDate('created_at', $today)
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'unknown',
                    'count' => $row->count,
                ];
            });

        // Vistas de hoy por dispositivo - NUEVO
        $serviceViewsTodayByDevice = AnalyticsEvent::select('device_type', DB::raw('COUNT(*) as count'))
            ->where('event_type', 'service_view')
            ->whereNotNull('service_id')
            ->whereDate('created_at', $today)
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'unknown',
                    'count' => $row->count,
                ];
            });

        // ==================== ANALÍTICAS DE CLICKS DE PRODUCTOS ====================
        
        // Productos más clickeados
        $mostClickedProducts = Item::select('id', 'name', 'image', 'clicks')
            ->where('status', 1)
            ->where('visible', true)
            ->orderByDesc('clicks')
            ->limit(10)
            ->get();

        // Clicks de productos - temporal
        $productClicksToday = DB::table('item_clicks')
            ->whereDate('created_at', now())
            ->count();

        $productClicksMonth = DB::table('item_clicks')
            ->whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])
            ->count();

        $productClicksYear = DB::table('item_clicks')
            ->whereYear('created_at', now()->year)
            ->count();

        // Clicks únicos del mes (usuarios únicos)
        $uniqueProductClickersMonth = DB::table('item_clicks')
            ->whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])
            ->distinct('user_hash')
            ->count('user_hash');

        // CTR de productos (Click Through Rate)
        $productViewsMonth = DB::table('analytics_events')
            ->where('event_type', 'product_view')
            ->whereBetween('created_at', [
                now()->startOfMonth(),
                now()->endOfMonth()
            ])
            ->count();

        $productCTR = $productViewsMonth > 0 
            ? round(($productClicksMonth / $productViewsMonth) * 100, 2) 
            : 0;

        // Clicks de productos por día del mes actual
        $productClicksThisMonth = [];
        $daysInMonth = now()->daysInMonth;
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $date = now()->startOfMonth()->addDays($day - 1);
            $clicks = DB::table('item_clicks')
                ->whereDate('created_at', $date)
                ->count();
            $productClicksThisMonth[] = [
                'day' => $date->format('d'),
                'clicks' => $clicks,
            ];
        }

        // Clicks de productos por dispositivo (total histórico)
        $productClicksByDevice = DB::table('item_clicks')
            ->select('device_type', DB::raw('count(*) as count'))
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'unknown',
                    'count' => $row->count,
                ];
            });

        // Clicks de productos hoy por dispositivo
        $productClicksTodayByDevice = DB::table('item_clicks')
            ->select('device_type', DB::raw('count(*) as count'))
            ->whereDate('created_at', now())
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'unknown',
                    'count' => $row->count,
                ];
            });

        return [
            'totalProducts' => $totalProducts,
            'totalStock' => $totalStock,
            'salesToday' => $salesToday,
            'salesMonth' => $salesMonth,
            'salesYear' => $salesYear,
            'incomeToday' => $incomeToday,
            'incomeMonth' => $incomeMonth,
            'incomeYear' => $incomeYear,
            'ordersByStatus' => $ordersByStatus,
            'topProducts' => $topProducts,
            'newFeatured' => $newFeatured,
            'latestTransactions' => $latestTransactions,
            'salesByLocation' => $salesByLocation,
            'topCoupons' => $topCoupons,
            'topDiscountRules' => $topDiscountRules,
            'brands' => $brands,
            'topClients' => $topClients,
            'salesLast30Days' => $salesLast30Days,
            'usersToday' => $usersToday,
            'usersMonth' => $usersMonth,
            'usersYear' => $usersYear,
            'customerSatisfaction' => $customerSatisfaction,
            // Mensajes de contacto
            'messagesToday' => $messagesToday,
            'messagesMonth' => $messagesMonth,
            'messagesYear' => $messagesYear,
            'messagesUnread' => $messagesUnread,
            // Analíticas de productos
            'mostViewedProducts' => $mostViewedProducts,
            'visitsThisMonth' => $visitsThisMonth,
            'categoriesWithProducts' => $categoriesWithProducts,
            'brandsWithProducts' => $brandsWithProducts,
            'totalCategories' => $totalCategories,
            'totalBrands' => $totalBrands,
            'totalActiveProducts' => $totalActiveProducts,
            // Analíticas de servicios
            'totalServices' => $totalServices,
            'totalServiceCategories' => $totalServiceCategories,
            'featuredServices' => $featuredServices,
            'mostViewedServices' => $mostViewedServices,
            'mostClickedServices' => $mostClickedServices,
            'serviceClicksToday' => $serviceClicksToday,
            'serviceClicksMonth' => $serviceClicksMonth,
            'serviceClicksYear' => $serviceClicksYear,
            'uniqueClickersMonth' => $uniqueClickersMonth,
            'serviceCTR' => $serviceCTR,
            'serviceVisitsThisMonth' => $serviceVisitsThisMonth,
            'serviceViewsByDevice' => $serviceViewsByDevice,
            'serviceViewsLast30Days' => $serviceViewsLast30Days,
            'serviceClicksThisMonth' => $serviceClicksThisMonth,
            'serviceClicksByDevice' => $serviceClicksByDevice,
            'serviceClicksTodayByDevice' => $serviceClicksTodayByDevice,
            'serviceViewsTodayByDevice' => $serviceViewsTodayByDevice,
            'hasServicesFeature' => $totalServices > 0, // Indica si el proyecto usa servicios
            // Analíticas de clicks de productos
            'mostClickedProducts' => $mostClickedProducts,
            'productClicksToday' => $productClicksToday,
            'productClicksMonth' => $productClicksMonth,
            'productClicksYear' => $productClicksYear,
            'uniqueProductClickersMonth' => $uniqueProductClickersMonth,
            'productCTR' => $productCTR,
            'productClicksThisMonth' => $productClicksThisMonth,
            'productClicksByDevice' => $productClicksByDevice,
            'productClicksTodayByDevice' => $productClicksTodayByDevice,
            'dashboardVisibility' => $this->getDashboardVisibility(),
            'hasRootRole' => $this->hasRootRole(),
        ];
    }

    /**
     * Obtiene la configuración de visibilidad del dashboard
     */
    private function getDashboardVisibility()
    {
        $visibilityRecord = General::where('correlative', 'VisibilityDashboard')->first();
        
        if (!$visibilityRecord) {
            // Verificar si el proyecto usa servicios
            $hasServices = Service::count() > 0;
            
            // Configuración por defecto si no existe el registro
            $defaultVisibility = [
                'total_orders' => true,
                'total_revenue' => true,
                'new_users' => true,
                'contact_messages' => true,
                'customer_satisfaction' => true,
                'total_categories' => true,
                'total_brands' => true,
                'total_products' => true,
                'statistics_chart' => true,
                'orders_statistics' => true,
                'sales_by_location' => true,
                'top_selling_products' => true,
                'new_featured_products' => true,
                'most_used_coupons' => true,
                'most_used_discount_rules' => true,
                'brands_listing' => true,
                'top_clients' => true,
                // Analíticas de productos
                'most_viewed_products' => true,
                'visits_chart' => true,
                'categories_chart' => true,
                'brands_chart' => true,
                'analytics_kpis' => true,
            ];
            
            // Agregar analíticas de servicios solo si el proyecto las usa
            if ($hasServices) {
                $defaultVisibility['total_services_kpi'] = false; // Desactivado por defecto
                $defaultVisibility['total_service_categories'] = false; // Desactivado por defecto
                $defaultVisibility['service_clicks_kpi'] = false;
                $defaultVisibility['service_ctr_kpi'] = false;
                $defaultVisibility['most_viewed_services'] = false;
                $defaultVisibility['most_clicked_services'] = false;
                $defaultVisibility['service_visits_chart'] = false;
                $defaultVisibility['service_clicks_chart'] = false;
                $defaultVisibility['service_views_by_device'] = false;
                $defaultVisibility['service_clicks_by_device'] = false;
                $defaultVisibility['service_views_trend'] = false;
                $defaultVisibility['service_clicks_vs_views'] = false;
            }
            
            return $defaultVisibility;
        }
        
        return json_decode($visibilityRecord->description, true) ?? [];
    }

    /**
     * Verifica si el usuario actual tiene rol Root
     */
    private function hasRootRole()
    {
        $user = Auth::user();
        if (!$user) {
            return false;
        }
        
        return $user->roles()->where('name', 'Root')->exists();
    }

    /**
     * Actualiza la configuración de visibilidad del dashboard
     */
    public function updateDashboardVisibility(Request $request)
    {
        try {
            // Verificar que el usuario tenga rol Root
            if (!$this->hasRootRole()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para realizar esta acción'
                ], 403);
            }

            $visibilityConfig = $request->input('visibility', []);
            
            // Buscar o crear el registro de visibilidad
            $visibilityRecord = General::where('correlative', 'VisibilityDashboard')->first();
            
            if (!$visibilityRecord) {
                $visibilityRecord = new General();
                $visibilityRecord->correlative = 'VisibilityDashboard';
                $visibilityRecord->name = 'Configuración de Visibilidad del Dashboard';
                $visibilityRecord->status = 1;
            }
            
            $visibilityRecord->description = json_encode($visibilityConfig);
            $visibilityRecord->save();
            
            Log::info('Dashboard visibility updated', [
                'user_id' => Auth::id(),
                'config' => $visibilityConfig
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Configuración de visibilidad actualizada correctamente'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error updating dashboard visibility: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la configuración: ' . $e->getMessage()
            ], 500);
        }
    }
}
