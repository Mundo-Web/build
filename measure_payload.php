<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

config(['cache.default' => 'array']);

use App\Http\Controllers\SystemController;
use Illuminate\Http\Request;

$output = "--- Diagnostic: Inertia Payload Size ---" . PHP_EOL;

$request = Request::create('/', 'GET');
$controller = new SystemController();
$response = $controller->setReactViewProperties($request);

if (is_array($response)) {
    $props = $response;
} else {
    $output .= "Response is not an array." . PHP_EOL;
    file_put_contents('payload_results.txt', $output);
    exit;
}

$json = json_encode($props);
$output .= "Total JSON Payload Size: " . number_format(strlen($json) / 1024, 2) . " KB" . PHP_EOL . PHP_EOL;

$output .= "Key-by-Key Size:" . PHP_EOL;
foreach ($props as $key => $value) {
    if ($key === 'reactData') {
        $output .= "- reactData (Total): " . number_format(strlen(json_encode($value)) / 1024, 2) . " KB" . PHP_EOL;
        foreach ($value as $k2 => $v2) {
            $s2 = strlen(json_encode($v2)) / 1024;
            if ($s2 > 5) {
                 $output .= "  -- {$k2}: " . number_format($s2, 2) . " KB" . PHP_EOL;
            }
        }
        continue;
    }
    $size = strlen(json_encode($value)) / 1024;
    $output .= "- {$key}: " . number_format($size, 2) . " KB" . PHP_EOL;
}

if (isset($props['systemItems'])) {
    $output .= PHP_EOL . "Breakdown of 'systemItems':" . PHP_EOL;
    foreach ($props['systemItems'] as $id => $items) {
        $size = strlen(json_encode($items)) / 1024;
        $output .= "  - ID {$id}: " . number_format($size, 2) . " KB" . PHP_EOL;
    }
}

file_put_contents('payload_results.txt', $output);
echo "Done. Results saved to payload_results.txt" . PHP_EOL;
