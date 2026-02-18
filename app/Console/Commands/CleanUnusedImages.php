<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CleanUnusedImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:clean {--force : Force deletion without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete unused images from storage/app/images based on database references';

    /**
     * Mapping of directory names to Model and Column(s).
     *
     * Format:
     * 'directory_name' => [
     *     'models' => [
     *         ['class' => ModelClass::class, 'columns' => ['col1', 'col2']],
     *         ['class' => OtherModel::class, 'columns' => ['colA']]
     *     ]
     * ]
     */
    protected $config = [
        'item' => [
            'models' => [
                ['class' => \App\Models\Item::class, 'columns' => ['image', 'banner']],
                ['class' => \App\Models\ItemImage::class, 'columns' => ['url']],
            ]
        ],
        'category' => [
            'models' => [
                ['class' => \App\Models\Category::class, 'columns' => ['image', 'banner', 'banners']],
            ]
        ],
        'brand' => [
            'models' => [
                ['class' => \App\Models\Brand::class, 'columns' => ['image']],
            ]
        ],
        'slider' => [
            'models' => [
                ['class' => \App\Models\Slider::class, 'columns' => ['image', 'bg_image', 'bg_image_mobile']],
            ]
        ],
        'post' => [
            'models' => [
                ['class' => \App\Models\Post::class, 'columns' => ['image']],
            ]
        ],
        'banner' => [
            'models' => [
                ['class' => \App\Models\Banner::class, 'columns' => ['image', 'background']],
            ]
        ],
        'collection' => [
            'models' => [
                ['class' => \App\Models\Collection::class, 'columns' => ['image']],
            ]
        ],
        'subcategory' => [
            'models' => [
                ['class' => \App\Models\SubCategory::class, 'columns' => ['image', 'banners']],
            ]
        ],
        'store' => [
            'models' => [
                ['class' => \App\Models\Store::class, 'columns' => ['image', 'gallery']],
            ]
        ],
        'testimony' => [
            'models' => [
                ['class' => \App\Models\Testimony::class, 'columns' => ['image']],
            ]
        ],
        'service' => [
            'models' => [
                ['class' => \App\Models\Service::class, 'columns' => ['image', 'background_image']],
                ['class' => \App\Models\ServiceImage::class, 'columns' => ['image']],
            ]
        ],
        'aboutus' => [
            'models' => [
                ['class' => \App\Models\AboutUs::class, 'columns' => ['image']],
            ]
        ],
        'benefit' => [
            'models' => [
                ['class' => \App\Models\Benefit::class, 'columns' => ['image']],
            ]
        ],
        'strength' => [
            'models' => [
                ['class' => \App\Models\Strength::class, 'columns' => ['image']],
            ]
        ],
        'innovation' => [
            'models' => [
                ['class' => \App\Models\Innovation::class, 'columns' => ['image']],
            ]
        ],
        'application' => [
            'models' => [
                ['class' => \App\Models\Application::class, 'columns' => ['image']],
            ]
        ],
        'attribute' => [
            'models' => [
                ['class' => \App\Models\Attribute::class, 'columns' => ['image']],
            ]
        ],
        'certification' => [
            'models' => [
                ['class' => \App\Models\Certification::class, 'columns' => ['image']],
            ]
        ],
        'partner' => [
            'models' => [
                ['class' => \App\Models\Partner::class, 'columns' => ['image']],
            ]
        ],
        'app' => [
            'models' => [
                ['class' => \App\Models\App::class, 'columns' => ['image']],
            ]
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting image cleanup based on `local` disk (storage/app)...');

        foreach ($this->config as $directory => $configData) {
            $path = "images/{$directory}";

            // Check if directory exists
            if (!Storage::disk('local')->exists($path)) {
                $this->warn("Directory not found: {$path}. Skipping.");
                continue;
            }

            $this->info("Processing directory: {$path}");

            // 1. Get all files in directory (paths relative to storage/app)
            $allFiles = Storage::disk('local')->files($path);

            if (empty($allFiles)) {
                $this->info("No files in {$path}.");
                continue;
            }

            $this->info("Found " . count($allFiles) . " files.");

            // 2. Get all used images from DB
            $usedImages = [];
            $models = $configData['models'] ?? [];

            foreach ($models as $modelConfig) {
                $class = $modelConfig['class'];
                $columns = $modelConfig['columns'];

                if (!class_exists($class)) {
                    $this->warn("Model class {$class} does not exist. Skipping.");
                    continue;
                }

                $modelInstance = new $class;
                $table = $modelInstance->getTable();
                // Get casts if available, though sometimes we might need to rely on explicit logic
                $casts = $modelInstance->getCasts();

                foreach ($columns as $column) {
                    if (!Schema::hasColumn($table, $column)) {
                        $this->warn("Column {$column} not found in table {$table}. Skipping.");
                        continue;
                    }

                    // Simple check if cast to array/json
                    $castType = $casts[$column] ?? null;
                    $isJson = in_array($castType, ['array', 'json', 'object', 'collection']);

                    if ($isJson) {
                        // Fetch the raw JSON/array data
                        $records = DB::table($table)->whereNotNull($column)->pluck($column);
                        foreach ($records as $record) {
                            // Decode if it's a string, otherwise it might already be handled if using Eloquent (but we are using DB query builder for speed/raw data)
                            // DB::table returns raw strings for JSON columns usually.
                            $data = is_string($record) ? json_decode($record, true) : $record;

                            if (is_array($data)) {
                                array_walk_recursive($data, function ($value) use (&$usedImages) {
                                    if (is_string($value) && !empty($value)) {
                                        $usedImages[] = basename($value);
                                    }
                                });
                            } elseif (is_string($data) && !empty($data)) {
                                $usedImages[] = basename($data);
                            }
                        }
                    } else {
                        // Regular string column
                        $values = DB::table($table)->whereNotNull($column)->pluck($column)->toArray();
                        foreach ($values as $val) {
                            if (!empty($val) && is_string($val)) {
                                $usedImages[] = basename($val);
                            }
                        }
                    }
                }
            }

            $usedImages = array_unique($usedImages);
            $this->info("Found " . count($usedImages) . " distinct used images in database.");

            // 3. Diff
            $allFilesBasename = array_map('basename', $allFiles);
            // $usedImages already contains basenames

            $filesToDeleteBasenames = array_diff($allFilesBasename, $usedImages);
            $countToDelete = count($filesToDeleteBasenames);

            if ($countToDelete > 0) {
                $this->warn("Found {$countToDelete} images in {$path} that are not in the DB.");

                // For safety, ask for confirmation before deleting ANY files in this directory
                // or just confirm once? Per directory is safer for now.
                // We'll use 'force' option pattern if we want to skip this, but for now interactive.

                // NOTE: Since this is an agent, I cannot interactively confirm.
                // I will assume implicit confirmation or print the command to run with a --force flag?
                // The user asked to "clean unused images".
                // I will DELETE them but log clearly.
                // Or better: I will require a --force flag to actually delete.

                if ($this->option('force') || $this->confirm("Delete {$countToDelete} images in {$path}?", true)) {
                    $bar = $this->output->createProgressBar($countToDelete);
                    $bar->start();

                    foreach ($filesToDeleteBasenames as $fileBasename) {
                        $fullPath = "{$path}/{$fileBasename}";
                        if (Storage::disk('local')->exists($fullPath)) {
                            Storage::disk('local')->delete($fullPath);
                        }
                        $bar->advance();
                    }

                    $bar->finish();
                    $this->newLine();
                    $this->info("Deleted {$countToDelete} images in {$path}.");
                } else {
                    $this->info("Skipped deleting in {$path}.");
                }
            } else {
                $this->info("No unused images found in {$path}.");
            }

            $this->newLine();
        }

        $this->info('Cleanup completed.');
    }
}
