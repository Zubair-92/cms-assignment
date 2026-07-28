<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Fetch tree structure of top-level menus with nested children
     */
    public function index()
    {
        $menus = Menu::whereNull('parent_id')
            ->with(['childrenRecursive', 'page:id,title,slug'])
            ->orderBy('order', 'asc')
            ->get();

        return api_response(true, 'Menu structure retrieved successfully.', $menus);
    }

    /**
     * Create menu item
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'url'       => 'nullable|string',
            'page_id'   => 'nullable|exists:pages,id',
            'parent_id' => 'nullable|exists:menus,id',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $menu = Menu::create($validated);

        return api_response(true, 'Menu item created successfully.', $menu, 201);
    }

    /**
     * Update menu item
     */
    public function update(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return api_response(false, 'Menu item not found.', null, 404);
        }

        $validated = $request->validate([
            'title'     => 'sometimes|required|string|max:255',
            'url'       => 'nullable|string',
            'page_id'   => 'nullable|exists:pages,id',
            'parent_id' => 'nullable|exists:menus,id',
            'order'     => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $menu->update($validated);

        return api_response(true, 'Menu item updated successfully.', $menu);
    }

    /**
     * Delete menu item
     */
    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return api_response(false, 'Menu item not found.', null, 404);
        }

        $menu->delete();

        return api_response(true, 'Menu item deleted successfully.');
    }
}