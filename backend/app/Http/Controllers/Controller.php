<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "CMS Assignment API Documentation",
    description: "API documentation for Laravel 12 / React CMS with Role-Based Access Control (RBAC)"
)]
#[OA\Server(
    url: "http://127.0.0.1:8001/api",
    description: "Local Development Server"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your Sanctum token received from /api/login"
)]
abstract class Controller
{
    //
}