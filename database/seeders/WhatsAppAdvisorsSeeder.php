<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WhatsAppAdvisorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si el general whatsapp_advisors ya existe
        $exists = DB::table('generals')
            ->where('correlative', 'whatsapp_advisors')
            ->exists();

        if (!$exists) {
            DB::table('generals')->insert([
                'id' => DB::raw('(UUID())'),
                'correlative' => 'whatsapp_advisors',
                'name' => 'Asesores de WhatsApp',
                'description' => '[]', // Array vacío por defecto
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info('✓ General whatsapp_advisors creado correctamente');
        } else {
            $this->command->info('✓ General whatsapp_advisors ya existe');
        }
    }
}
