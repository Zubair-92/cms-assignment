<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

class PageController extends Controller
{
    #[OA\Get(
        path: "/pages",
        summary: "List all pages",
        tags: ["Pages"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "status", in: "query", required: false, schema: new OA\Schema(type: "string"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Pages retrieved successfully"),
            new OA\Response(response: 403, description: "Unauthorized privilege")
        ]
    )]
    public function index(Request $request)
    {
        $query = Page::with('author:id,name,email');

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $pages = $query->latest()->get();
        return api_response(true, 'Pages retrieved successfully.', $pages);
    }

    #[OA\Post(
        path: "/pages",
        summary: "Create new page",
        tags: ["Pages"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["title", "content"],
                properties: [
                    new OA\Property(property: "title", type: "string", example: "About Us"),
                    new OA\Property(property: "slug", type: "string", example: "about-us"),
                    new OA\Property(property: "content", type: "string", example: "<p>Page Content</p>"),
                    new OA\Property(property: "status", type: "string", example: "published")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Page created successfully")
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'slug'         => 'nullable|string|max:255|unique:pages,slug',
            'content'      => 'required|string',
            'status'       => 'nullable|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);
        $validated['created_by'] = $request->user()->id;

        $page = Page::create($validated);
        return api_response(true, 'Page created successfully.', $page, 201);
    }

    #[OA\Get(
        path: "/pages/{id}",
        summary: "Get page by ID",
        tags: ["Pages"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Page details fetched successfully"),
            new OA\Response(response: 404, description: "Page not found")
        ]
    )]
    public function show($id)
    {
        $page = Page::with('author:id,name,email')->find($id);

        if (!$page) {
            return api_response(false, 'Page not found.', null, 404);
        }

        return api_response(true, 'Page details fetched successfully.', $page);
    }

    #[OA\Put(
        path: "/pages/{id}",
        summary: "Update page",
        tags: ["Pages"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "title", type: "string"),
                    new OA\Property(property: "content", type: "string"),
                    new OA\Property(property: "status", type: "string")
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Page updated successfully")
        ]
    )]
    public function update(Request $request, $id)
    {
        $page = Page::find($id);

        if (!$page) {
            return api_response(false, 'Page not found.', null, 404);
        }

        $validated = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'slug'         => 'sometimes|required|string|max:255|unique:pages,slug,' . $id,
            'content'      => 'sometimes|required|string',
            'status'       => 'nullable|in:draft,published,archived',
            'published_at' => 'nullable|date',
        ]);

        if (isset($validated['title']) && !isset($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $page->update($validated);
        return api_response(true, 'Page updated successfully.', $page);
    }

    #[OA\Delete(
        path: "/pages/{id}",
        summary: "Soft delete a page",
        tags: ["Pages"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer"))
        ],
        responses: [
            new OA\Response(response: 200, description: "Page soft-deleted successfully")
        ]
    )]
    public function destroy($id)
    {
        $page = Page::find($id);

        if (!$page) {
            return api_response(false, 'Page not found.', null, 404);
        }

        $page->delete();
        return api_response(true, 'Page soft-deleted successfully.');
    }
}