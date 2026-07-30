<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => $this->content, // Maps your DB 'content' column to 'body'
            'cover_image' => $this->cover_image ? asset('storage/' . $this->cover_image) : null,
            'status' => $this->status,
            'published_at' => $this->published_at?->toIso8601String(),
            'menu_id' => $this->menu_id,
            'created_by' => $this->author ? [
                'id' => $this->author->id,
                'name' => $this->author->name,
            ] : null,
            'updated_by' => $this->updater ? [
                'id' => $this->updater->id,
                'name' => $this->updater->name,
            ] : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}