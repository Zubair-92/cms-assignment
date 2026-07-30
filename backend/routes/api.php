<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

// Public endpoint for published nested navigation menus
Route::get('/menus/public', [MenuController::class, 'index']);

// Public endpoint for fetching dynamic page content by slug
Route::get('/pages/slug/{slug}', [PageController::class, 'showBySlug']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Sanctum Auth Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // User Profile & Session
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- Pages API Routes with Privilege Checks ---
    Route::middleware('privilege:pages.list')->group(function () {
        Route::get('/pages', [PageController::class, 'index']);
        Route::get('/pages/{id}', [PageController::class, 'show']);
    });
    
    Route::middleware('privilege:pages.add')->post('/pages', [PageController::class, 'store']);
    Route::middleware('privilege:pages.edit')->put('/pages/{id}', [PageController::class, 'update']);
    Route::middleware('privilege:pages.delete')->delete('/pages/{id}', [PageController::class, 'destroy']);

    // --- Menus Management Routes ---
    Route::middleware('privilege:pages.edit')->group(function () {
        // Specific static routes MUST come before parameter routes ({id})
        Route::get('/menus/tree', [MenuController::class, 'tree']);
        Route::post('/menus/reorder', [MenuController::class, 'reorder']);
        
        // General CRUD routes
        Route::get('/menus', [MenuController::class, 'index']);
        Route::post('/menus', [MenuController::class, 'store']);
        Route::put('/menus/{id}', [MenuController::class, 'update']);
        Route::delete('/menus/{id}', [MenuController::class, 'destroy']);
    });
});