Markdown# Enterprise CMS Assignment (Laravel 12 API + React JS)

A production-ready Content Management System (CMS) featuring Role-Based Access Control (RBAC), recursive nested menus, scheduled publishing, soft deletes with restoration, and full OpenAPI/Swagger documentation. Built with **Laravel 12** for the backend API and **React** for the frontend.

---

## 🚀 Key Features

* **Authentication & Security:** SPA authentication using Laravel Sanctum with bearer token/cookie support.
* **Role-Based Access Control (RBAC):** Configured via Spatie / Custom Privilege tables (`Admin`, `Moderator`, `User`).
* **Nested Recursive Menus:** Self-referencing parent-child menu hierarchies with automatic page association.
* **Content Scheduling:** Dynamic background publishing engine via custom Artisan console command (`cms:publish-pages`).
* **Audit & Data Integrity:** Complete audit trails (`created_by`, `updated_by`), soft-deletes (`deleted_at`), and restoration capability.
* **Paginated Search:** High-performance title/content filtering with dynamic pagination.
* **API Documentation:** Interactive Swagger UI documentation via `l5-swagger`.

---

## 🛠️ Tech Stack & Requirements

* **PHP:** ^8.2 (Laravel 12 framework)
* **Node.js:** ^18.x or ^20.x
* **Database:** MySQL / MariaDB (SQLite supported for testing)
* **Frontend:** React JS, Axios, React Router
* **Package Managers:** Composer, NPM

---

## 📥 Project Setup & Installation

### 1. Repository Clone
```bash
git clone <your-repository-url> cms-assignment
cd cms-assignment
2. Backend Setup (Laravel 12)Bashcd backend

# Install PHP dependencies
composer install

# Environment Configuration
cp .env.example .env
php artisan key:generate
Configure your .env file with your local MySQL credentials:Code snippetDB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cms_assignment
DB_USERNAME=root
DB_PASSWORD=
Run database migrations and seed the initial roles and admin user:Bashphp artisan migrate:fresh --seed
Start the backend development server:Bashphp artisan serve
# Server running on [http://127.0.0.1:8000](http://127.0.0.1:8000)
3. Frontend Setup (React JS)In a new terminal window:Bashcd frontend

# Install Node dependencies
npm install

# Environment Configuration
cp .env.example .env

# Start React Dev Server
npm start # or npm run dev
🔑 Default Credentials (Seeded)The RolesAndUsersSeeder creates the following test accounts:RoleEmailPasswordPermissionsAdminadmin@example.compasswordFull System Access (Manage Users, Menus, Pages, Hard Delete)Moderatormoderator@example.compasswordCreate/Edit Pages and Menus (No Hard Delete)Useruser@example.compasswordView Published Pages and Public Menus🧪 Running Automated TestsThe backend test suite utilizes an in-memory SQLite database to verify API responses, RBAC permissions, and foreign key integrity across unit and feature tests.Run the test suite via Artisan:Bashphp artisan test
Expected Output:PlaintextPASS  Tests\Unit\ExampleTest
✓ that true is true

PASS  Tests\Feature\ExampleTest
✓ the application returns a successful response

PASS  Tests\Feature\MenuPermissionTest
✓ public can access public menus
✓ authorized user can list and create menus
✓ authorized user can update and delete menu
✓ unauthorized user cannot manage menus

PASS  Tests\Feature\PagePermissionTest
✓ moderator can list and create pages
✓ moderator cannot delete a page
✓ admin can delete a page

Tests: 9 passed (15 assertions)
⏱️ Scheduled Page PublishingTo automatically publish scheduled pages whose published_at timestamp has passed, execute the custom Artisan command:Bashphp artisan cms:publish-pages
To run this task continuously during local development, run the Laravel scheduler worker:Bashphp artisan schedule:work
📑 OpenAPI / Swagger DocumentationThe project includes pre-built Swagger annotations for all API endpoints.To regenerate the documentation:Bashphp artisan l5-swagger:generate
Access the interactive API documentation in your browser while php artisan serve is running:http://127.0.0.1:8000/api/documentation📡 API Endpoint OverviewMethodEndpointAuthorizationDescriptionPOST/api/loginPublicAuthenticate user & receive bearer tokenGET/api/menusPublicList nested menu tree structureGET/api/pagesPublicList published pages (Supports ?search= & ?page=)POST/api/pagesAuthenticatedCreate a new pagePUT/api/pages/{id}AuthenticatedUpdate existing page detailsDELETE/api/pages/{id}Admin OnlySoft delete / remove pagePOST/api/pages/{id}/restoreAdmin OnlyRestore a soft-deleted page