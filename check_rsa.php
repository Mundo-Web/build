<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\General;
use App\Helpers\CulqiConfig;

// Verificar ambos correlatives
$rsaId1 = General::where('correlative', 'culqi_rsa_id')->first()?->description;
$rsaId2 = General::where('correlative', 'checkout_culqi_rsa_id')->first()?->description;
$rsaPublicKey1 = General::where('correlative', 'culqi_rsa_public_key')->first()?->description;
$rsaPublicKey2 = General::where('correlative', 'checkout_culqi_rsa_public_key')->first()?->description;
$publicKey1 = General::where('correlative', 'culqi_public_key')->first()?->description;
$publicKey2 = General::where('correlative', 'checkout_culqi_public_key')->first()?->description;

// Lo que CulqiConfig devuelve
$configRsaId = CulqiConfig::getRsaId();
$configRsaPublicKey = CulqiConfig::getRsaPublicKey();
$configPublicKey = CulqiConfig::getPublicKey();

echo "=== VERIFICACIÓN RSA CULQI ===" . PHP_EOL . PHP_EOL;

echo "1. Correlatives en BD:" . PHP_EOL;
echo "   - culqi_rsa_id: " . ($rsaId1 ?? "NULL") . PHP_EOL;
echo "   - checkout_culqi_rsa_id: " . ($rsaId2 ?? "NULL") . PHP_EOL;
echo "   - culqi_public_key: " . ($publicKey1 ?? "NULL") . PHP_EOL;
echo "   - checkout_culqi_public_key: " . ($publicKey2 ?? "NULL") . PHP_EOL . PHP_EOL;

echo "2. Lo que CulqiConfig devuelve (lo que se usa):" . PHP_EOL;
echo "   - getRsaId(): " . ($configRsaId ?? "NULL") . PHP_EOL;
echo "   - getPublicKey(): " . ($configPublicKey ?? "NULL") . PHP_EOL;
echo "   - getRsaPublicKey() longitud: " . strlen($configRsaPublicKey ?? '') . " chars" . PHP_EOL . PHP_EOL;

echo "3. RSA Public Key de CulqiConfig:" . PHP_EOL;
if ($configRsaPublicKey) {
    echo "   - Tiene newlines: " . (strpos($configRsaPublicKey, "\n") !== false ? "SI" : "NO") . PHP_EOL;
    echo "   - Empieza con BEGIN: " . (str_starts_with(trim($configRsaPublicKey), '-----BEGIN') ? "SI" : "NO") . PHP_EOL;
    echo "---START---" . PHP_EOL;
    echo $configRsaPublicKey . PHP_EOL;
    echo "---END---" . PHP_EOL;
} else {
    echo "   ⚠️ RSA PUBLIC KEY ESTÁ VACÍA!" . PHP_EOL;
}

echo PHP_EOL . "4. ENV values:" . PHP_EOL;
echo "   - CULQI_PUBLIC_KEY: " . env('CULQI_PUBLIC_KEY', 'no definido') . PHP_EOL;
echo "   - CULQI_RSA_ID: " . env('CULQI_RSA_ID', 'no definido') . PHP_EOL;

echo PHP_EOL . "5. Private Key (Secret Key):" . PHP_EOL;
$privateKey = CulqiConfig::getSecretKey();
echo "   - getSecretKey(): " . ($privateKey ? substr($privateKey, 0, 15) . '...' : 'NULL/VACÍO') . PHP_EOL;
echo "   - Longitud: " . strlen($privateKey ?? '') . PHP_EOL;

$bdPrivateKey = General::where('correlative', 'checkout_culqi_private_key')->first()?->description;
echo "   - BD checkout_culqi_private_key: " . ($bdPrivateKey ? substr($bdPrivateKey, 0, 15) . '...' : 'NULL/VACÍO') . PHP_EOL;

echo PHP_EOL . "6. RSA Public Key COMPLETA (para verificar formato):" . PHP_EOL;
$rsaKey = General::where('correlative', 'checkout_culqi_rsa_public_key')->first()?->description;
echo "---INICIO---" . PHP_EOL;
echo $rsaKey . PHP_EOL;
echo "---FIN---" . PHP_EOL;
echo "Longitud total: " . strlen($rsaKey) . " caracteres" . PHP_EOL;

// Verificar si tiene caracteres extraños
$hasCarriageReturn = strpos($rsaKey, "\r") !== false;
$hasNewline = strpos($rsaKey, "\n") !== false;
$hasBackslashN = strpos($rsaKey, "\\n") !== false;
echo "Tiene \\r: " . ($hasCarriageReturn ? "SI" : "NO") . PHP_EOL;
echo "Tiene \\n real: " . ($hasNewline ? "SI" : "NO") . PHP_EOL;
echo "Tiene \\\\n literal: " . ($hasBackslashN ? "SI" : "NO") . PHP_EOL;
