<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of all menu items flat or with parent relationship.
     */
    public function index()
    {
        $menus = Menu::orderBy('order', 'asc')->get();
        return response()->json($menus);
    }

    /**
     * Display the dynamic recursive tree structure with nested ordering.
     */
    public function tree()
    {
        $withRecursiveChildren = function ($query) use (&$withRecursiveChildren) {
            $query->orderBy('order', 'asc')->with(['children' => $withRecursiveChildren]);
        };

        $tree = Menu::whereNull('parent_id')
                    ->orderBy('order', 'asc')
                    ->with(['children' => $withRecursiveChildren])
                    ->get();

        return response()->json($tree);
    }

    /**
     * Store a newly created menu item or submenu item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'url'       => 'required|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order'     => 'nullable|integer',
        ]);

        $parentId = $request->filled('parent_id') ? $request->parent_id : null;
        $validated['parent_id'] = $parentId;

        if (!isset($validated['order'])) {
            $maxOrder = Menu::where('parent_id', $parentId)->max('order');
            $validated['order'] = is_null($maxOrder) ? 0 : $maxOrder + 1;
        }

        $menu = Menu::create($validated);

        return response()->json($menu, 201);
    }

    /**
     * Display the specified menu item.
     */
    public function show($id)
    {
        $menu = Menu::findOrFail($id);
        return response()->json($menu);
    }

    /**
     * Update the specified menu item in storage.
     */
    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);

        $validated = $request->validate([
            'title'     => 'sometimes|required|string|max:255',
            'url'       => 'sometimes|required|string|max:255',
            'parent_id' => 'nullable|exists:menus,id',
            'order'     => 'nullable|integer',
        ]);

        if ($request->has('parent_id')) {
            $validated['parent_id'] = $request->filled('parent_id') ? $request->parent_id : null;
        }

        $menu->update($validated);

        return response()->json($menu);
    }

    /**
     * Bulk update order positions for siblings.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items'         => 'required|array',
            'items.*.id'    => 'required|exists:menus,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($validated['items'] as $item) {
            Menu::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Menu order updated successfully.']);
    }

    /**
     * Remove the specified menu item along with nested items.
     */
    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        $menu->delete();

        return response()->json(['message' => 'Menu item deleted successfully.']);
    }
}