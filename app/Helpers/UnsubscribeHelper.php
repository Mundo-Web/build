<?php

namespace App\Helpers;

use Illuminate\Support\Str;

class UnsubscribeHelper
{
    /**
     * Generar token y URL de desuscripción para un notifiable (User, Subscription, etc.)
     * 
     * @param mixed $notifiable El modelo que recibirá la notificación
     * @return array ['token' => string, 'url' => string]
     */
    public static function generateUnsubscribeLink($notifiable)
    {
        // Generar token único
        $token = Str::random(60);
        $hashedToken = hash('sha256', $token);

        // Guardar el token en el modelo si tiene el campo unsubscribe_token
        if (method_exists($notifiable, 'update') && \Schema::hasColumn($notifiable->getTable(), 'unsubscribe_token')) {
            $notifiable->update([
                'unsubscribe_token' => $hashedToken
            ]);
        }

        // Generar URL de desuscripción
        $url = url("/desuscribirse?token={$token}&email=" . urlencode($notifiable->email ?? $notifiable->description ?? ''));

        return [
            'token' => $token,
            'hashed_token' => $hashedToken,
            'url' => $url
        ];
    }

    /**
     * Obtener el HTML del botón de desuscripción
     * 
     * @param string $url URL de desuscripción
     * @return string HTML del botón
     */
    public static function getUnsubscribeButton($url)
    {
        return <<<HTML
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px; margin-bottom: 10px;">
                ¿No deseas recibir más correos de nuestra parte?
            </p>
            <a href="{$url}" style="color: #999; font-size: 11px; text-decoration: underline;">
                Cancelar suscripción
            </a>
        </div>
        HTML;
    }

    /**
     * Agregar automáticamente el botón de desuscripción al final del contenido HTML
     * 
     * @param string $htmlContent Contenido HTML del email
     * @param string $unsubscribeUrl URL de desuscripción
     * @return string HTML con botón de desuscripción agregado
     */
    public static function addUnsubscribeButtonToHtml($htmlContent, $unsubscribeUrl)
    {
        $button = self::getUnsubscribeButton($unsubscribeUrl);
        
        // Intentar insertar antes del </body> si existe
        if (stripos($htmlContent, '</body>') !== false) {
            return str_ireplace('</body>', $button . '</body>', $htmlContent);
        }
        
        // Si no hay </body>, agregar al final
        return $htmlContent . $button;
    }
}
