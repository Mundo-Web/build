<?php
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\General;

$rsaKey = '-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIvNL7WbDyyzsAtaBxvuCCSwaD
py/0Ax/lYfc9CTPmQq27wJD7g8pIGrO4YdzDUiorWqOyRQE9/GGc4+W4X/rOoIsD
GNkqK96e//Wwe67ei/aXM2PvBKoRgk+hAyfyXXx4C1DV0c/xMEo9iCEwZduhFvBd
rVAbZ1ycICGVDX0Q/QIDAQAB
-----END PUBLIC KEY-----';

$updated = General::where('correlative', 'checkout_culqi_rsa_public_key')
    ->update(['description' => $rsaKey]);

echo "RSA Key actualizada: " . ($updated ? "SI" : "NO") . "\n";

// Verificar
$saved = General::where('correlative', 'checkout_culqi_rsa_public_key')->first();
echo "Valor guardado:\n" . $saved->description . "\n";
