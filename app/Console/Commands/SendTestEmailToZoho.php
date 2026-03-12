<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendTestEmailToZoho extends Command
{
    protected $signature = 'send:test-zoho {email : Email destino}';
    protected $description = 'Envía un correo de prueba específico a Zoho Mail con logging detallado';

    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("📧 Enviando correo de prueba a: {$email}");
        $this->info("📋 Configuración actual:");
        $this->line("   From: " . config('mail.from.address'));
        $this->line("   Host: " . config('mail.mailers.smtp.host'));
        $this->line("   Port: " . config('mail.mailers.smtp.port'));
        
        try {
            $timestamp = now()->format('Y-m-d H:i:s');
            
            Mail::html($this->getTestEmailContent($timestamp), function ($message) use ($email, $timestamp) {
                $message->to($email)
                        ->subject("🧪 PRUEBA TÉCNICA - {$timestamp}")
                        ->from(config('mail.from.address'), config('mail.from.name'))
                        ->replyTo(config('mail.from.address'), config('mail.from.name'));
                
                // Headers específicos para Zoho
                $domain = parse_url(config('app.url'), PHP_URL_HOST);
                $message->getHeaders()
                        ->addTextHeader('X-Mailer', 'Laravel-STP')
                        ->addTextHeader('X-Priority', '3')
                        ->addTextHeader('Message-ID', '<' . uniqid() . '@' . $domain . '>');
            });
            
            $this->info("✅ Correo enviado exitosamente");
            $this->line("");
            $this->warn("🔍 INSTRUCCIONES PARA EL CLIENTE:");
            $this->line("1. Revisar bandeja de entrada en Zoho Mail");
            $this->line("2. SI NO ESTÁ: Revisar carpeta de SPAM/JUNK");
            $this->line("3. Si está en spam: Marcar como 'No es spam'");
            $this->line("4. Agregar el remitente a tus contactos");
            $this->line("");
            $this->info("📋 Asunto del correo: 🧪 PRUEBA TÉCNICA - {$timestamp}");
            
            Log::info('SendTestEmailToZoho - Correo enviado', [
                'to' => $email,
                'timestamp' => $timestamp,
                'from' => config('mail.from.address'),
                'host' => config('mail.mailers.smtp.host')
            ]);
            
        } catch (\Exception $e) {
            $this->error("❌ Error enviando correo: " . $e->getMessage());
            Log::error('SendTestEmailToZoho - Error', [
                'to' => $email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    private function getTestEmailContent($timestamp)
    {
        $domain = parse_url(config('app.url'), PHP_URL_HOST);
        return "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
            <h2 style='color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;'>
                🧪 Prueba Técnica de Correo
            </h2>
            
            <p><strong>Timestamp:</strong> {$timestamp}</p>
            <p><strong>Desde:</strong> " . config('mail.from.address') . "</p>
            <p><strong>Servidor:</strong> " . config('mail.mailers.smtp.host') . "</p>
            
            <div style='background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                <h3 style='color: #059669; margin-top: 0;'>✅ ¡Este correo llegó correctamente!</h3>
                <p>Si ves este mensaje, significa que la configuración de correo está funcionando.</p>
            </div>
            
            <h3 style='color: #dc2626;'>🚨 Si encontraste este correo en SPAM:</h3>
            <ol>
                <li>Márcalo como <strong>'No es spam'</strong></li>
                <li>Agrega el remitente a tus contactos</li>
                <li>Ve a Configuración → Filtros y agrega una regla para permitir correos de <strong>*.{$domain}</strong></li>
            </ol>
            
            <hr style='margin: 30px 0; border: 1px solid #e5e7eb;'>
            
            <p style='font-size: 12px; color: #6b7280;'>
                Este es un correo de prueba técnica para verificar la entrega a Zoho Mail.<br>
                Sistema: Stech Perú - Laravel Framework
            </p>
        </div>
        ";
    }
}
