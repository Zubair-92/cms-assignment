<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/login",
        summary: "User Login",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", example: "admin@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login successful"),
            new OA\Response(response: 401, description: "Invalid credentials")
        ]
    )]
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return api_response(false, 'Invalid login credentials.', null, 401);
        }

        $token = $user->createToken('cms_auth_token')->plainTextToken;
        $user->load('roles.privileges');

        return api_response(true, 'Login successful.', [
            'user'  => $user,
            'token' => $token,
        ]);
    }

    #[OA\Get(
        path: "/profile",
        summary: "Get Current User Profile",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Profile details fetched successfully"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function profile(Request $request)
    {
        $user = $request->user()->load('roles.privileges');
        return api_response(true, 'User profile fetched successfully.', $user);
    }

    #[OA\Post(
        path: "/logout",
        summary: "User Logout",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Logged out successfully"),
            new OA\Response(response: 401, description: "Unauthenticated")
        ]
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return api_response(true, 'Logged out successfully.');
    }
}