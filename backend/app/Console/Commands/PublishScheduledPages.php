<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class PublishScheduledPages extends Command
{
    protected $signature = 'cms:publish-pages';
    protected $description = 'Publish pages scheduled up to the current timestamp';

    public function handle(): int
    {
        $updatedCount = Page::where('status', 'draft')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', Carbon::now())
            ->update(['status' => 'published']);

        $this->info("Successfully published {$updatedCount} scheduled page(s).");

        return Command::SUCCESS;
    }
}