<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\General;

class DashboardVisibilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Configuración por defecto de visibilidad del dashboard
        $defaultVisibilityConfig = [
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
            'top_clients' => true
        ];

        // Verificar si ya existe el registro
        $existingRecord = General::where('correlative', 'VisibilityDashboard')->first();
        
        if (!$existingRecord) {
            // Crear el registro de visibilidad del dashboard
            General::create([
                'correlative' => 'VisibilityDashboard',
                'name' => 'Configuración de Visibilidad del Dashboard',
                'description' => json_encode($defaultVisibilityConfig),
                'status' => 1, // Activo
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            $this->command->info('✅ Registro VisibilityDashboard creado exitosamente');
        } else {
            $this->command->info('ℹ️  El registro VisibilityDashboard ya existe');
        }
    }
}