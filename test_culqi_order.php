<?php
/**
 * Test de creación de orden Culqi
 */

require_once 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Helpers\CulqiConfig;
use Culqi\Culqi;

$secretKey = CulqiConfig::getSecretKey();
echo "Secret Key: " . substr($secretKey, 0, 15) . "..." . PHP_EOL;

$culqi = new Culqi(['api_key' => $secretKey]);

$config = [
    "amount" => 10000, // S/ 100.00
    "currency_code" => "PEN",
    "description" => "Test Order",
    "order_number" => "TEST-" . time(),
    "client_details" => [
        "first_name" => "Test",
        "last_name" => "User",
        "email" => "test@test.com",
        "phone_number" => "999999999"
    ],
    "expiration_date" => time() + 1800, // 30 minutos
    "confirm" => false
];

echo "Config: " . json_encode($config, JSON_PRETTY_PRINT) . PHP_EOL;

try {
    $order = $culqi->Orders->create($config);
    
    echo "Tipo de respuesta: " . gettype($order) . PHP_EOL;
    
    if (is_string($order)) {
        echo "Respuesta string: " . $order . PHP_EOL;
    } else {
        echo "Order ID: " . ($order->id ?? 'NO ID') . PHP_EOL;
        print_r($order);
    }
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . PHP_EOL;
}
