<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\General;

$rsaKey = "-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIvNL7WbDyyzsAtaBxvuCCSwaD
py/0Ax/lYfc9CTPmQq27wJD7g8pIGrO4YdzDUiorWqOyRQE9/GGc4+W4X/rOoIsD
GNkqK96e//Wwe67ei/aXM2PvBKoRgk+hAyfyXXx4C1DV0c/xMEo9iCEwZduhFvBd
rVAbZ1ycICGVDX0Q/QIDAQAB
-----END PUBLIC KEY-----";

// Actualizar RSA Public Key
General::updateOrCreate(
    ['correlative' => 'culqi_rsa_public_key'],
    ['description' => $rsaKey, 'name' => 'Culqi RSA Public Key']
);

echo "✅ RSA Public Key actualizada correctamente\n";

// Verificar
$saved = General::where('correlative', 'culqi_rsa_public_key')->first();
echo "Longitud guardada: " . strlen($saved->description) . "\n";
echo "Tiene saltos de línea: " . (strpos($saved->description, "\n") !== false ? 'SÍ' : 'NO') . "\n";
echo "\nContenido:\n" . $saved->description . "\n";
