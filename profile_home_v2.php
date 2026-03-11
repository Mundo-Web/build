<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\SystemController;
use Illuminate\Http\Request;

$request = Request::create('/', 'GET');
$controller = new SystemController();
$props = $controller->setReactViewProperties($request);

echo "--- Props Size Breakdown ---\n";
foreach ($props as $key => $value) {
    $size = strlen(json_encode($value));
    if ($size > 1024) {
        echo sprintf("%-20s: %10.2f KB\n", $key, $size / 1024);
    } else {
        echo sprintf("%-20s: %10d bytes\n", $key, $size);
    }
}

if (isset($props['systemItems'])) {
    echo "\n--- systemItems Breakdown ---\n";
    foreach ($props['systemItems'] as $id => $items) {
        $count = count($items);
        $size = strlen(json_encode($items));
        echo "ID {$id}: {$count} items (" . round($size / 1024, 2) . " KB)\n";
        if ($count > 0) {
            echo "First item keys: " . implode(', ', array_keys($items[0]->toArray())) . "\n";
        }
    }
}

if (isset($props['filteredData'])) {
    echo "\n--- filteredData Breakdown ---\n";
    foreach ($props['filteredData'] as $model => $data) {
        $size = strlen(json_encode($data));
        echo "Model {$model}: " . round($size / 1024, 2) . " KB\n";
    }
}
