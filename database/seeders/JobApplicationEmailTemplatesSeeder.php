<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\General;

class JobApplicationEmailTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Plantilla de email para el cliente que envía la solicitud de trabajo
        General::updateOrCreate(
            ['correlative' => 'job_application_email'],
            [
                'correlative' => 'job_application_email',
                'name' => 'Plantilla de Email - Solicitud de Trabajo (Cliente)',
                'data_type' => 'longtext',
                'description' => '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Trabajo Recibida</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background-color: #007bff; color: white; text-align: center; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .highlight { background-color: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .details { margin: 20px 0; }
        .detail-item { margin: 10px 0; padding: 10px; background-color: #f8f9fa; border-radius: 5px; }
        .success-icon { color: #28a745; font-size: 48px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡Solicitud de Trabajo Recibida!</h1>
            <div class="success-icon">✅</div>
        </div>
        
        <div class="content">
            <p>Estimado/a <strong>{nombre}</strong>,</p>
            
            <div class="highlight">
                <p><strong>¡Gracias por tu interés en formar parte de nuestro equipo!</strong></p>
                <p>Hemos recibido tu solicitud de trabajo el <strong>{fecha_solicitud}</strong> y queremos confirmarte que está siendo procesada.</p>
            </div>
            
            <h3>Resumen de tu solicitud:</h3>
            <div class="details">
                <div class="detail-item">
                    <strong>📧 Email:</strong> {email}
                </div>
                <div class="detail-item">
                    <strong>📱 Teléfono:</strong> {telefono}
                </div>
                <div class="detail-item">
                    <strong>💼 Posición de interés:</strong> {posicion}
                </div>
                <div class="detail-item">
                    <strong>📄 CV:</strong> {cv_adjunto}
                </div>
                <div class="detail-item">
                    <strong>💬 Mensaje:</strong><br>{mensaje}
                </div>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #856404; margin-top: 0;">📋 Próximos pasos:</h4>
                <ul style="color: #856404;">
                    <li>Nuestro equipo de Recursos Humanos revisará tu perfil</li>
                    <li>Si tu perfil coincide con nuestras necesidades, te contactaremos</li>
                    <li>El proceso puede tomar entre 5 a 10 días hábiles</li>
                </ul>
            </div>
            
            <p>Valoramos tu tiempo e interés en nuestra empresa. Te mantendremos informado sobre el estado de tu solicitud.</p>
            
            <p style="margin-top: 30px;">
                Saludos cordiales,<br>
                <strong>Equipo de Recursos Humanos</strong><br>
                <em>Mundo Web</em>
            </p>
        </div>
        
        <div class="footer">
            <p>© {year} Mundo Web. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no responder a este mensaje.</p>
        </div>
    </div>
</body>
</html>',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Plantilla de email para el administrador que recibe la notificación
        General::updateOrCreate(
            ['correlative' => 'admin_job_application_email'],
            [
                'correlative' => 'admin_job_application_email',
                'name' => 'Plantilla de Email - Solicitud de Trabajo (Administrador)',
                'data_type' => 'longtext',
                'description' => '<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Solicitud de Trabajo</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background-color: #dc3545; color: white; text-align: center; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .alert { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .candidate-info { background-color: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #007bff; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .urgent { color: #dc3545; font-weight: bold; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 24px; margin: 5px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .btn-primary { background-color: #007bff; color: white; }
        .btn-success { background-color: #28a745; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Nueva Solicitud de Trabajo</h1>
            <p style="margin: 0; font-size: 18px;">Candidato: <strong>{nombre}</strong></p>
        </div>
        
        <div class="content">
            <div class="alert">
                <p class="urgent">⚡ NUEVA SOLICITUD RECIBIDA</p>
                <p>Se ha recibido una nueva solicitud de trabajo el <strong>{fecha_solicitud}</strong> que requiere tu atención.</p>
            </div>
            
            <div class="candidate-info">
                <h3 style="margin-top: 0; color: #007bff;">👤 Información del Candidato</h3>
                
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>📝 Nombre Completo:</strong><br>
                        {nombre}
                    </div>
                    <div class="detail-item">
                        <strong>📧 Email:</strong><br>
                        <a href="mailto:{email}">{email}</a>
                    </div>
                    <div class="detail-item">
                        <strong>📱 Teléfono:</strong><br>
                        <a href="tel:{telefono}">{telefono}</a>
                    </div>
                    <div class="detail-item">
                        <strong>💼 Posición de Interés:</strong><br>
                        {posicion}
                    </div>
                </div>
                
                <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px;">
                    <strong>📄 CV Adjunto:</strong><br>
                    {cv_adjunto}
                </div>
                
                <div style="margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px;">
                    <strong>💬 Mensaje del Candidato:</strong><br>
                    <em>{mensaje}</em>
                </div>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="color: #155724; margin-top: 0;">📋 Acciones Recomendadas:</h4>
                <ul style="color: #155724;">
                    <li>Revisar el CV adjunto</li>
                    <li>Evaluar la experiencia del candidato</li>
                    <li>Contactar al candidato si cumple con los requisitos</li>
                    <li>Actualizar el estado de la solicitud en el sistema</li>
                </ul>
            </div>
            
            <div class="action-buttons">
                <p>🔗 <strong>Accede al panel de administración para gestionar esta solicitud</strong></p>
            </div>
            
            <p style="margin-top: 30px; text-align: center; font-style: italic;">
                Este email fue generado automáticamente por el sistema de gestión de solicitudes de trabajo.
            </p>
        </div>
        
        <div class="footer">
            <p>© {year} Sistema de Gestión - Mundo Web</p>
            <p>Fecha de recepción: {fecha_solicitud}</p>
        </div>
    </div>
</body>
</html>',
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $this->command->info('✅ Plantillas de email para Job Applications creadas exitosamente:');
        $this->command->info('   - job_application_email (Cliente)');
        $this->command->info('   - admin_job_application_email (Administrador)');
    }
}