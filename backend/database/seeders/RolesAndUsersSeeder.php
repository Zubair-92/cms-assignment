<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Privilege;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolesAndUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Privileges
        $pPageList   = Privilege::create(['slug' => 'pages.list',   'name' => 'List Pages']);
        $pPageAdd    = Privilege::create(['slug' => 'pages.add',    'name' => 'Add Pages']);
        $pPageEdit   = Privilege::create(['slug' => 'pages.edit',   'name' => 'Edit Pages']);
        $pPageDelete = Privilege::create(['slug' => 'pages.delete', 'name' => 'Delete Pages']);
        $pUserManage = Privilege::create(['slug' => 'users.manage', 'name' => 'Manage Users & Roles']);

        // 2. Roles
        $adminRole = Role::create(['name' => 'Admin', 'description' => 'Full administrative access']);
        $moderatorRole = Role::create(['name' => 'Moderator', 'description' => 'Can manage pages but cannot delete or manage users']);

        // 3. Attach Privileges
        $adminRole->privileges()->sync([
            $pPageList->id, $pPageAdd->id, $pPageEdit->id, $pPageDelete->id, $pUserManage->id
        ]);

        $moderatorRole->privileges()->sync([
            $pPageList->id, $pPageAdd->id, $pPageEdit->id
        ]);

        // 4. Create Admin User
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);
        $adminUser->roles()->attach($adminRole);

        // 5. Create Moderator User
        $modUser = User::create([
            'name' => 'Moderator User',
            'email' => 'moderator@example.com',
            'password' => Hash::make('password123'),
        ]);
        $modUser->roles()->attach($moderatorRole);
    }
}