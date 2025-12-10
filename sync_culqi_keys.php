<?php
/**
 * Script para sincronizar las claves de Culqi
 * Actualiza la BD para usar las claves del .env
 */

require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\General;

echo "=== SINCRONIZACIÓN DE CLAVES CULQI ===" . PHP_EOL . PHP_EOL;

// Valores del .env
$envPublicKey = env('CULQI_PUBLIC_KEY');
$envPrivateKey = env('CULQI_PRIVATE_KEY');

echo "Claves en .env:" . PHP_EOL;
echo "  - Public Key: " . $envPublicKey . PHP_EOL;
echo "  - Private Key: " . ($envPrivateKey ? substr($envPrivateKey, 0, 20) . '...' : 'NO DEFINIDA') . PHP_EOL . PHP_EOL;

// Valores actuales en BD
$bdPublicKey = General::where('correlative', 'checkout_culqi_public_key')->first();
$bdPrivateKey = General::where('correlative', 'checkout_culqi_private_key')->first();

echo "Claves actuales en BD:" . PHP_EOL;
echo "  - Public Key: " . ($bdPublicKey?->description ?? 'NULL') . PHP_EOL;
echo "  - Private Key: " . ($bdPrivateKey?->description ? substr($bdPrivateKey->description, 0, 20) . '...' : 'NULL') . PHP_EOL . PHP_EOL;

// Preguntar si desea sincronizar
echo "¿Las RSA keys fueron creadas para la cuenta del .env ({$envPublicKey})?" . PHP_EOL;
echo "Si es así, ejecuta: php sync_culqi_keys.php --sync" . PHP_EOL . PHP_EOL;

if (in_array('--sync', $argv ?? [])) {
    echo "Sincronizando..." . PHP_EOL;
    
    if ($bdPublicKey) {
        $bdPublicKey->description = $envPublicKey;
        $bdPublicKey->save();
        echo "✅ Public Key actualizada a: {$envPublicKey}" . PHP_EOL;
    }
    
    if ($bdPrivateKey && $envPrivateKey) {
        $bdPrivateKey->description = $envPrivateKey;
        $bdPrivateKey->save();
        echo "✅ Private Key actualizada" . PHP_EOL;
    }
    
    echo PHP_EOL . "¡Sincronización completada!" . PHP_EOL;
    echo "Ahora la BD y el .env usan las mismas claves." . PHP_EOL;
}
