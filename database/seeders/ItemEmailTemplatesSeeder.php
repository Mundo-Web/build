<?php
namespace Database\Seeders;

use App\Models\General;
use Illuminate\Database\Seeder;

class ItemEmailTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'correlative' => 'item_status_changed_email',
                'name' => 'Plantilla de Email - Cambio de Estado de Producto (Proveedor)',
                'data_type' => 'longtext',
                'description' => '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de revisión de producto</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background-color: #0d6efd; color: white; text-align: center; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status-box { background-color: #e7f3ff; padding: 15px; border-left: 4px solid #0d6efd; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Actualización de tu producto</h1>
        </div>
        <div class="content">
            <p>Hola,</p>
            <p>Te informamos que el estado de revisión de tu producto <strong>{{nombre_producto}}</strong> ha sido actualizado.</p>
            
            <div class="status-box">
                <p><strong>Nuevo Estado:</strong> {{estado}}</p>
                <p>{{mensaje}}</p>
            </div>
            
            <p>Puedes ingresar a tu panel de proveedor para ver más detalles o realizar cambios si es necesario.</p>
            
            <p style="margin-top: 30px;">
                Saludos cordiales,<br>
                <strong>Equipo de {{config(\'app.name\')}}</strong>
            </p>
        </div>
        <div class="footer">
            <p>© {{year}} {{config(\'app.name\')}}. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>',
                'status' => true
            ],
            [
                'correlative' => 'admin_new_item_email',
                'name' => 'Plantilla de Email - Nuevo Producto Creado (Administrador)',
                'data_type' => 'longtext',
                'description' => '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo producto para revisión</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background-color: #dc3545; color: white; text-align: center; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .info-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Nuevo producto pendiente</h1>
        </div>
        <div class="content">
            <p>Se ha registrado un nuevo producto en la plataforma que requiere revisión.</p>
            
            <div class="info-box">
                <p><strong>Producto:</strong> {{nombre_producto}}</p>
                <p><strong>Proveedor:</strong> {{nombre_proveedor}} ({{email_proveedor}})</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{admin_url}}" class="btn">Revisar Producto</a>
            </div>
            
            <p>Por favor, ingresa al panel administrativo para aprobar o rechazar esta solicitud.</p>
        </div>
        <div class="footer">
            <p>© {{year}} {{config(\'app.name\')}}. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>',
                'status' => true
            ]
        ];

        foreach ($templates as $data) {
            General::updateOrCreate(
                ['correlative' => $data['correlative']],
                [
                    'name' => $data['name'],
                    'data_type' => $data['data_type'],
                    'description' => $data['description'],
                    'status' => $data['status'],
                    'updated_at' => now(),
                ]
            );
        }

        $this->command->info('✅ Plantillas de email para Items creadas exitosamente:');
        $this->command->info('   - item_status_changed_email (Proveedor)');
        $this->command->info('   - admin_new_item_email (Administrador)');
    }
}
