<?php
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Helpers\CulqiConfig;

$rsaId = CulqiConfig::getRSAId();
$rsaKey = CulqiConfig::getRSAPublicKey();

echo "=== ANÁLISIS RSA CULQI ===\n\n";

echo "RSA ID:\n";
echo "  - Value: " . ($rsaId ?: 'NULL') . "\n";
echo "  - Length: " . strlen($rsaId ?? '') . "\n\n";

echo "RSA Public Key:\n";
echo "  - Length: " . strlen($rsaKey ?? '') . "\n";
echo "  - Has BEGIN tag: " . (strpos($rsaKey ?? '', '-----BEGIN') !== false ? 'YES' : 'NO') . "\n";
echo "  - Has END tag: " . (strpos($rsaKey ?? '', '-----END') !== false ? 'YES' : 'NO') . "\n";
echo "  - Has \\n (escaped): " . (strpos($rsaKey ?? '', '\\n') !== false ? 'YES' : 'NO') . "\n";
echo "  - Has real newlines: " . (strpos($rsaKey ?? '', "\n") !== false ? 'YES' : 'NO') . "\n";

// Mostrar los primeros y últimos caracteres
if ($rsaKey) {
    echo "\n  - First 80 chars:\n    " . substr($rsaKey, 0, 80) . "\n";
    echo "\n  - Last 80 chars:\n    " . substr($rsaKey, -80) . "\n";
    
    // Extraer solo el body (sin headers PEM)
    $body = $rsaKey;
    $body = str_replace('-----BEGIN PUBLIC KEY-----', '', $body);
    $body = str_replace('-----END PUBLIC KEY-----', '', $body);
    $body = str_replace("\n", '', $body);
    $body = str_replace("\\n", '', $body);
    $body = trim($body);
    
    echo "\n  - Body only (sin PEM headers): " . strlen($body) . " chars\n";
    echo "    " . substr($body, 0, 60) . "...\n";
}

echo "\n=== FIN ANÁLISIS ===\n";
