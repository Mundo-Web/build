<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General;

class WelcomeProviderEmailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        General::updateOrCreate(
            ['correlative' => 'welcome_provider_email'],
            [
                'description' => '<p>Hola {name},</p><p>Tu cuenta de proveedor en <strong>Rainstar</strong> ha sido creada exitosamente.</p><p>Estos son tus datos de acceso:</p><ul><li><strong>Usuario:</strong> {email}</li><li><strong>Contraseña:</strong> {password}</li></ul><p>Puedes iniciar sesión en el siguiente enlace: <a href="{loginUrl}">{loginUrl}</a></p><p>Saludos,<br>El equipo de Rainstar</p>',
                'status' => 1
            ]
        );
    }
}
