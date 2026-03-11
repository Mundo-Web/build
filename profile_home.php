<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\SystemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

DB::enableQueryLog();
$start = microtime(true);

$request = Request::create('/', 'GET');
$controller = new SystemController();
$props = $controller->setReactViewProperties($request);

$time = microtime(true) - $start;
$queries = DB::getQueryLog();

echo "Time: " . $time . "s\n";
echo "Queries count: " . count($queries) . "\n";
echo "Props size: " . strlen(json_encode($props)) . " bytes\n";

foreach ($queries as $i => $query) {
    echo ($i+1) . ". [" . $query['time'] . "ms] " . $query['query'] . " [" . implode(',', $query['bindings']) . "]\n";
}
