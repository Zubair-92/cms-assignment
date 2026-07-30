<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Menu;
use App\Models\Role;
use App\Models\Privilege;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;

class MenuPermissionTest extends TestCase
{
    use RefreshDatabase;

    protected $authorizedUser;
    protected $unauthorizedUser;
    protected $menu;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create the required privilege matching route middleware
        $editPages = Privilege::firstOrCreate(['slug' => 'pages.edit'], ['name' => 'Edit Pages']);
        $listPages = Privilege::firstOrCreate(['slug' => 'pages.list'], ['name' => 'List Pages']);

        // 2. Create Roles
        $editorRole  = Role::firstOrCreate(['slug' => 'editor'], ['name' => 'Editor']);
        $viewerRole  = Role::firstOrCreate(['slug' => 'viewer'], ['name' => 'Viewer']);

        if (method_exists($editorRole, 'privileges')) {
            $editorRole->privileges()->sync([$editPages->id, $listPages->id]);
            $viewerRole->privileges()->sync([$listPages->id]);
        }

        // 3. Create Users
        $this->authorizedUser   = User::factory()->create();
        $this->unauthorizedUser = User::factory()->create();

        if (method_exists($this->authorizedUser, 'roles')) {
            $this->authorizedUser->roles()->attach($editorRole->id);
            $this->unauthorizedUser->roles()->attach($viewerRole->id);
        } else {
            $this->authorizedUser->update(['role_id' => $editorRole->id]);
            $this->unauthorizedUser->update(['role_id' => $viewerRole->id]);
        }

        // 4. Create Sample Menu Item
        $this->menu = Menu::create([
            'title'      => 'Main Menu',
            'url'        => '/home',
            'order'      => 1,
            'is_active'  => true,
        ]);
    }

    #[Test]
    public function public_can_access_public_menus()
    {
        $response = $this->getJson('/api/menus/public');

        $response->assertStatus(200);
    }

    #[Test]
    public function authorized_user_can_list_and_create_menus()
    {
        Sanctum::actingAs($this->authorizedUser);

        // Test GET /api/menus
        $response = $this->getJson('/api/menus');
        $response->assertStatus(200);

        // Test POST /api/menus
        $createResponse = $this->postJson('/api/menus', [
            'title'     => 'About Us',
            'url'       => '/about',
            'order'     => 2,
            'is_active' => true,
        ]);

        $createResponse->assertStatus(201);
    }

    #[Test]
    public function authorized_user_can_update_and_delete_menu()
    {
        Sanctum::actingAs($this->authorizedUser);

        // Test PUT /api/menus/{id}
        $updateResponse = $this->putJson("/api/menus/{$this->menu->id}", [
            'title' => 'Updated Home Menu',
            'url'   => '/home-updated',
        ]);
        $updateResponse->assertStatus(200);

        // Test DELETE /api/menus/{id}
        $deleteResponse = $this->deleteJson("/api/menus/{$this->menu->id}");
        $deleteResponse->assertStatus(200);
    }

    #[Test]
    public function unauthorized_user_cannot_manage_menus()
    {
        Sanctum::actingAs($this->unauthorizedUser);

        // Attempt POST
        $createResponse = $this->postJson('/api/menus', [
            'title' => 'Unauthorized Menu',
            'url'   => '/forbidden',
        ]);
        $createResponse->assertStatus(403);

        // Attempt DELETE
        $deleteResponse = $this->deleteJson("/api/menus/{$this->menu->id}");
        $deleteResponse->assertStatus(403);
    }
}