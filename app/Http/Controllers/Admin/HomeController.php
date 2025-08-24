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
            // Nuevas funcionalidades analíticas
            'mostViewedProducts' => $mostViewedProducts,
            'visitsThisMonth' => $visitsThisMonth,
            'categoriesWithProducts' => $categoriesWithProducts,
            'brandsWithProducts' => $brandsWithProducts,
            'totalCategories' => $totalCategories,
            'totalBrands' => $totalBrands,
            'totalActiveProducts' => $totalActiveProducts,
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
            // Configuración por defecto si no existe el registro
            return [
                'total_orders' => true,
                'total_revenue' => true,
                'new_users' => true,
                'customer_satisfaction' => true,
                'statistics_chart' => true,
                'orders_statistics' => true,
                'sales_by_location' => true,
                'top_selling_products' => true,
                'new_featured_products' => true,
                'most_used_coupons' => true,
                'most_used_discount_rules' => true,
                'brands_listing' => true,
                'top_clients' => true,
                // Nuevas funcionalidades analíticas
                'most_viewed_products' => true,
                'visits_chart' => true,
                'categories_chart' => true,
                'brands_chart' => true,
                'analytics_kpis' => true
            ];
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
