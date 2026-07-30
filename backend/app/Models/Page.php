<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Page extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'cover_image',
        'status',
        'published_at',
        'menu_id',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * User who created the page
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * User who last updated the page (Audit requirement)
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Linked menu item
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}