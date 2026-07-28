<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPrivilege
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $privilege): Response
    {
        $user = $request->user();

        if (!$user || !$user->hasPrivilege($privilege)) {
            return api_response(
                false,
                'Unauthorized. You do not have the required privilege: ' . $privilege,
                null,
                403
            );
        }

        return $next($request);
    }
}