<?php

use App\Models\Page;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('cms:publish-pages', function () {
    $updatedCount = Page::where('status', 'draft')
        ->whereNotNull('published_at')
        ->where('published_at', '<=', Carbon::now())
        ->update(['status' => 'published']);

    $this->info("Successfully published {$updatedCount} scheduled page(s).");
})->purpose('Publish pages that are scheduled up to the current timestamp');

Schedule::command('cms:publish-pages')->everyMinute();
