<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Page;
use App\Models\Role;
use App\Models\Privilege;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;

class PagePermissionTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $modUser;
    protected $page;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Create Privileges using exact route middleware slugs
        $listPages   = Privilege::firstOrCreate(['slug' => 'pages.list'], ['name' => 'List Pages']);
        $addPages    = Privilege::firstOrCreate(['slug' => 'pages.add'], ['name' => 'Add Pages']);
        $editPages   = Privilege::firstOrCreate(['slug' => 'pages.edit'], ['name' => 'Edit Pages']);
        $deletePages = Privilege::firstOrCreate(['slug' => 'pages.delete'], ['name' => 'Delete Pages']);

        // 2. Create Admin Role & Attach All Privileges
        $adminRole = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        if (method_exists($adminRole, 'privileges')) {
            $adminRole->privileges()->sync([$listPages->id, $addPages->id, $editPages->id, $deletePages->id]);
        }

        // 3. Create Moderator Role & Attach Limited Privileges (no pages.delete)
        $modRole = Role::firstOrCreate(['slug' => 'moderator'], ['name' => 'Moderator']);
        if (method_exists($modRole, 'privileges')) {
            $modRole->privileges()->sync([$listPages->id, $addPages->id, $editPages->id]);
        }

        // 4. Create Users & Assign Roles
        $this->adminUser = User::factory()->create();
        $this->modUser   = User::factory()->create();

        if (method_exists($this->adminUser, 'roles')) {
            $this->adminUser->roles()->attach($adminRole->id);
            $this->modUser->roles()->attach($modRole->id);
        } else {
            $this->adminUser->update(['role_id' => $adminRole->id]);
            $this->modUser->update(['role_id' => $modRole->id]);
        }

        // 5. Create Sample Page
        $this->page = Page::create([
            'title'      => 'Test Page',
            'slug'       => 'test-page',
            'content'    => '<p>Sample content</p>',
            'status'     => 'published',
            'created_by' => $this->adminUser->id,
        ]);
    }

    #[Test]
    public function moderator_can_list_and_create_pages()
    {
        Sanctum::actingAs($this->modUser);

        $response = $this->getJson('/api/pages');
        $response->assertStatus(200);

        $createResponse = $this->postJson('/api/pages', [
            'title'   => 'Mod Page',
            'slug'    => 'mod-page',
            'content' => '<p>Mod body content</p>',
            'status'  => 'draft',
        ]);

        $createResponse->assertStatus(201);
    }

    #[Test]
    public function moderator_cannot_delete_a_page()
    {
        Sanctum::actingAs($this->modUser);

        $response = $this->deleteJson("/api/pages/{$this->page->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('pages', ['id' => $this->page->id]);
    }

    #[Test]
    public function admin_can_delete_a_page()
    {
        Sanctum::actingAs($this->adminUser);

        $response = $this->deleteJson("/api/pages/{$this->page->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('pages', ['id' => $this->page->id]);
    }
}