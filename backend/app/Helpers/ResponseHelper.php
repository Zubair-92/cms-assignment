<?php

if (!function_exists('api_response')) {
    /**
     * Standardized API Response Helper
     */
    function api_response(bool $success, string $message, mixed $data = null, int $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ], $code);
    }
}