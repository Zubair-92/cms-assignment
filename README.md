Markdown
## 📥 Project Setup & Installation

### 1. Clone Repository
```bash
git clone [https://github.com/Zubair-92/cms-assignment.git](https://github.com/Zubair-92/cms-assignment.git)
cd cms-assignment
2. Backend Setup (Laravel 12 API)
Bash
cd backend

# Install PHP dependencies
composer install

# Create environment configuration
cp .env.example .env

# Generate application key
php artisan key:generate
Configure your .env file with your local MySQL credentials:

Code snippet
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cms_assignment
DB_USERNAME=root
DB_PASSWORD=
Run database migrations and seed initial roles, admin user, and sample data:

Bash
php artisan migrate:fresh --seed

# Start the backend API server
php artisan serve
Backend server will run on http://127.0.0.1:8000.

3. Frontend Setup (React SPA)
Open a new terminal window:

Bash
cd frontend

# Install Node dependencies
npm install

# Start React Dev Server
npm run dev
Frontend will run on http://localhost:5173.


---

### Commands to push to GitHub:

After saving the `README.md` in your root folder (`C:\xampp\htdocs\cms-assignment\README.md`), run these commands in PowerShell:

```powershell
git add README.md
git commit -m "docs: add clear setup instructions to root README"
git push origin master# Enterprise CMS Assignment (Laravel 12 API + React JS)

A production-ready Content Management System (CMS) featuring Role-Based Access Control (RBAC), recursive nested menus, scheduled publishing, soft deletes with restoration, dynamic LTR/RTL Arabic language support, and full OpenAPI/Swagger documentation. Built with **Laravel 12** for the backend API and **React** for the frontend.

---

## 🚀 Key Features

* **Authentication & Security:** SPA authentication using Laravel Sanctum with bearer token support.
* **Role-Based Access Control (RBAC):** Configured via custom permissions & roles (`Admin`, `Moderator`, `User`).
* **Nested Recursive Menus:** Self-referencing parent-child menu hierarchies with automatic page association.
* **Multi-Language & RTL:** Built-in LTR/RTL toggle for full Arabic and English site navigation.
* **Content Scheduling:** Dynamic background publishing engine via custom Artisan console command (`cms:publish-pages`).
* **Audit & Data Integrity:** Complete audit trails (`created_by`, `updated_by`), soft-deletes (`deleted_at`), and restoration capability.
* **Paginated Search:** High-performance title/content filtering with dynamic pagination.
* **API Documentation:** Interactive Swagger UI documentation via `l5-swagger`.

---

## 🛠️ Tech Stack & Requirements

* **PHP:** ^8.2 (Laravel 12 framework)
* **Node.js:** ^18.x or ^20.x
* **Database:** MySQL / MariaDB (SQLite supported for testing)
* **Frontend:** React JS, Axios, React Router, Tailwind CSS
* **Package Managers:** Composer, NPM

---

## 📥 Project Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/Zubair-92/cms-assignment.git
cd cms-assignment