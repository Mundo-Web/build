<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceRestController;
use App\Http\Controllers\UnsubscribeController;
// use App\Http\Controllers\RemainingHistoryController;
use Illuminate\Support\Facades\Route;

// Route::get('/remainings-history', [RemainingHistoryController::class, 'set']);
// Route::post('/clients', [ClientController::class, 'save']);

// Rutas públicas para servicios
Route::get('/services/categories', [ServiceRestController::class, 'categoriesWithServices']);
Route::post('/services/paginate', [ServiceRestController::class, 'paginate']);

// Rutas de desuscripción
//Route::get('/desuscribirse', [UnsubscribeController::class, 'showUnsubscribeForm'])->name('unsubscribe.form');
Route::post('/api/unsubscribe', [UnsubscribeController::class, 'unsubscribe'])->name('unsubscribe.process');
