<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class CaptchaController extends Controller
{
    /**
     * Genera un nuevo CAPTCHA con token seguro
     */
    public function generate(Request $request)
    {
        // 1. Rate limiting por IP
        $ip = $request->ip();
        $rateLimitKey = "captcha_generate_ip:{$ip}";
        $attempts = Cache::get($rateLimitKey, 0);

        if ($attempts >= 20) { // Máximo 20 generaciones en 10 minutos
            return response()->json([
                'error' => 'Demasiadas solicitudes. Intenta en unos minutos.'
            ], 429);
        }

        Cache::put($rateLimitKey, $attempts + 1, now()->addMinutes(10));

        // 2. Generar texto aleatorio (sin caracteres confusos)
        $chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        $captchaText = '';
        for ($i = 0; $i < 6; $i++) {
            $captchaText .= $chars[random_int(0, strlen($chars) - 1)];
        }

        // 3. Generar token único
        $token = Str::random(40);

        // 4. Hashear la respuesta correcta
        $hashedAnswer = hash_hmac('sha256', strtolower($captchaText), config('app.key'));

        // 5. Guardar en cache con expiración (10 minutos)
        Cache::put("captcha:{$token}", [
            'answer' => $hashedAnswer,
            'attempts' => 0,
            'created_at' => now()->timestamp,
        ], now()->addMinutes(10));

        // 6. Generar imagen distorsionada
        $imageBase64 = $this->generateDistortedImage($captchaText);

        return response()->json([
            'token' => $token,
            'image' => $imageBase64,
            'expires_in' => 600, // segundos
        ]);
    }

    /**
     * Valida el CAPTCHA ingresado por el usuario
     */
    public function verify(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'answer' => 'required|string|max:10',
        ]);

        $token = $request->input('token');
        $userAnswer = $request->input('answer');
        $ip = $request->ip();

        // 1. Rate limiting por IP (intentos de validación)
        $rateLimitKey = "captcha_verify_ip:{$ip}";
        $verifyAttempts = Cache::get($rateLimitKey, 0);

        if ($verifyAttempts >= 10) { // Máximo 10 intentos en 10 minutos
            Log::warning("CAPTCHA: Demasiados intentos de verificación desde IP: {$ip}");
            return response()->json([
                'success' => false,
                'error' => 'Demasiados intentos. Intenta en unos minutos.'
            ], 429);
        }

        Cache::put($rateLimitKey, $verifyAttempts + 1, now()->addMinutes(10));

        // 2. Obtener datos del CAPTCHA
        $captchaData = Cache::get("captcha:{$token}");

        if (!$captchaData) {
            Log::warning("CAPTCHA: Token inválido o expirado: {$token} desde IP: {$ip}");
            return response()->json([
                'success' => false,
                'error' => 'CAPTCHA expirado o inválido. Genera uno nuevo.'
            ], 400);
        }

        // 3. Verificar límite de intentos por token
        if ($captchaData['attempts'] >= 5) {
            Cache::forget("captcha:{$token}"); // Invalidar token
            Log::warning("CAPTCHA: Token bloqueado por exceso de intentos: {$token} desde IP: {$ip}");
            return response()->json([
                'success' => false,
                'error' => 'Demasiados intentos fallidos. Genera un nuevo CAPTCHA.'
            ], 400);
        }

        // 4. Hashear la respuesta del usuario
        $userHash = hash_hmac('sha256', strtolower($userAnswer), config('app.key'));

        // 5. Comparar hashes
        if (hash_equals($captchaData['answer'], $userHash)) {
            // ✅ CAPTCHA correcto - Marcar como verificado pero NO eliminar aún
            $captchaData['verified'] = true;
            $captchaData['verified_at'] = now()->timestamp;
            Cache::put("captcha:{$token}", $captchaData, now()->addMinutes(5)); // 5 min para enviar el form
            
            Log::info("CAPTCHA: Verificación exitosa para token: {$token} desde IP: {$ip}");
            
            return response()->json([
                'success' => true,
                'message' => 'CAPTCHA verificado correctamente.'
            ]);
        }

        // ❌ CAPTCHA incorrecto - incrementar intentos
        $captchaData['attempts']++;
        Cache::put("captcha:{$token}", $captchaData, now()->addMinutes(10));

        Log::warning("CAPTCHA: Intento fallido ({$captchaData['attempts']}/5) para token: {$token} desde IP: {$ip}");

        return response()->json([
            'success' => false,
            'error' => 'Código incorrecto. Intenta nuevamente.',
            'attempts_remaining' => 5 - $captchaData['attempts']
        ], 400);
    }

    /**
     * Genera imagen del CAPTCHA con distorsión avanzada
     */
    private function generateDistortedImage($text)
    {
        // Crear canvas 300x100
        $width = 300;
        $height = 100;
        
        $image = imagecreatetruecolor($width, $height);

        // Fondo con gradiente
        $bg1 = imagecolorallocate($image, 240, 249, 255); // #f0f9ff
        $bg2 = imagecolorallocate($image, 224, 231, 255); // #e0e7ff
        
        for ($i = 0; $i < $height; $i++) {
            $ratio = $i / $height;
            $r = 240 - ($ratio * 16);
            $g = 249 - ($ratio * 18);
            $b = 255;
            $color = imagecolorallocate($image, $r, $g, $b);
            imagefilledrectangle($image, 0, $i, $width, $i + 1, $color);
        }

        // Añadir puntos aleatorios (ruido)
        for ($i = 0; $i < 150; $i++) {
            $noiseColor = imagecolorallocate($image, rand(150, 200), rand(150, 200), rand(150, 200));
            imagesetpixel($image, rand(0, $width), rand(0, $height), $noiseColor);
        }

        // Añadir líneas de ruido
        $lineColor = imagecolorallocate($image, 148, 163, 184); // #94a3b8
        for ($i = 0; $i < 5; $i++) {
            imageline(
                $image,
                rand(0, $width / 2),
                rand(0, $height),
                rand($width / 2, $width),
                rand(0, $height),
                $lineColor
            );
        }

        // Color del texto
        $textColor = imagecolorallocate($image, 30, 41, 59); // Gris oscuro

        // Dibujar cada letra con rotación y posición variable
        $fontPath = public_path('fonts/arial.ttf'); // Asegúrate de tener una fuente TTF
        $letterSpacing = $width / (strlen($text) + 1);
        
        for ($i = 0; $i < strlen($text); $i++) {
            $letter = $text[$i];
            $fontSize = rand(28, 36);
            $angle = rand(-25, 25);
            $x = ($i + 1) * $letterSpacing + rand(-10, 10);
            $y = ($height / 2) + rand(-15, 15);

            // Si existe la fuente, usar imagettftext, sino usar imagestring
            if (file_exists($fontPath)) {
                imagettftext($image, $fontSize, $angle, $x, $y, $textColor, $fontPath, $letter);
            } else {
                imagestring($image, 5, $x, $y - 10, $letter, $textColor);
            }
        }

        // Convertir a base64
        ob_start();
        imagepng($image);
        $imageData = ob_get_clean();
        imagedestroy($image);

        return 'data:image/png;base64,' . base64_encode($imageData);
    }
}
