<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$components = App\Models\System::where('page_id', 'bf3dbee8-8b1e-4857-b3c4-1a673836bac6')
    ->orderBy('order', 'asc')
    ->pluck('component')
    ->toArray();

echo json_encode($components, JSON_PRETTY_PRINT);
