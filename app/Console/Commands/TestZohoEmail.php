<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\General;

class TestZohoEmail extends Command
{
    protected $signature = 'test:zoho-email {--email= : Email específico para probar}';
    protected $description = 'Prueba el envío de correos específicamente a Zoho Mail';

    public function handle()
    {
        $this->info('🚀 Iniciando prueba de correo para Zoho Mail...');
        
        $targetEmail = $this->option('email');
        if (!$targetEmail) {
            $corporate = General::where('correlative', 'coorporative_email')->first();
            $targetEmail = $corporate ? $corporate->description : null;
        }
        
        if (!$targetEmail) {
            $this->error('❌ No se pudo obtener el email objetivo. Usa --email=tu@email.com');
            return 1;
        }
        
        $this->info("📧 Email objetivo: {$targetEmail}");
        $this->showCurrentConfig();
        
        $this->testBasicEmail($targetEmail);
        
        $this->info('✅ Pruebas completadas.');
        return 0;
    }
    
    private function showCurrentConfig()
    {
        $this->info('📋 Configuración actual de correo:');
        $this->line("   Host: " . config('mail.mailers.smtp.host'));
        $this->line("   Puerto: " . config('mail.mailers.smtp.port'));
        $this->line("   From: " . config('mail.from.address'));
        $this->newLine();
    }
    
    private function testBasicEmail($targetEmail)
    {
        $this->info('🧪 Enviando correo de prueba...');
        try {
            Mail::raw('Prueba de entrega para Zoho Mail.', function ($message) use ($targetEmail) {
                $message->to($targetEmail)
                        ->subject('Prueba de correo - ' . now()->format('Y-m-d H:i:s'))
                        ->from(config('mail.from.address'), config('mail.from.name'));
            });
            $this->info('✅ Correo enviado exitosamente');
        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
        }
    }
    
    private function isZohoEmail($email)
    {
        if (!$email) return false;
        $domain = substr(strrchr($email, "@"), 1);
        $possibleZohoDomains = [parse_url(config('app.url'), PHP_URL_HOST)];
        return in_array(strtolower($domain), $possibleZohoDomains);
    }
}
