<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General;

class InviteProviderEmailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        General::updateOrCreate(
            ['correlative' => 'invite_provider_email'],
            [
                'name' => 'Plantilla de invitación a proveedores',
                'description' => '<h1>¡Hola!</h1><p>Has sido invitado a unirte como proveedor en Rainstar Store.</p><p>Para completar tu registro, haz clic en el siguiente enlace:</p><p><a href="{{invitationUrl}}">Unirse ahora</a></p><p>Si el botón no funciona, copia y pega este enlace: {{invitationUrl}}</p><p>Atentamente,<br>El equipo de Rainstar Store</p>',
                'status' => 1
            ]
        );
    }
}
