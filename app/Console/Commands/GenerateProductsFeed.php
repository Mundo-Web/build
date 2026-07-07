<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Item;

class GenerateProductsFeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products-feed:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Genera el archivo products-feed.json de forma estática en la carpeta pública';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando la generación del feed de productos estático...');

        $products = Item::where('status', 1)
            ->where('visible', 1)
            ->select('sku', 'name', 'slug', 'price', 'discount', 'final_price', 'stock', 'sold_out', 'image', 'description', 'summary', 'meta_title', 'meta_description')
            ->get()
            ->map(function ($item) {
                $imageUrl = null;
                if ($item->image) {
                    if (filter_var($item->image, FILTER_VALIDATE_URL)) {
                        $imageUrl = $item->image;
                    } else {
                        $imageUrl = url('/storage/images/item/' . $item->image);
                    }
                }

                $rawDescription = $item->description ?: ($item->summary ?: $item->meta_description);
                $description = $rawDescription ? strip_tags($rawDescription) : '';
                if ($description) {
                    $description = \Illuminate\Support\Str::limit($description, 250);
                }

                $name = $item->name ?: $item->meta_title;

                $productData = [
                    'sku' => $item->sku,
                    'name' => $name,
                    'description' => $description,
                    'image_url' => $imageUrl,
                    'url' => url('/product/' . $item->slug),
                    'price' => (float) $item->price,
                    'discount' => (float) $item->discount,
                    'final_price' => (float) $item->final_price,
                    'in_stock' => !$item->sold_out,
                ];

                if ($item->stock > 0) {
                    $productData['stock_qty'] = (int) $item->stock;
                }

                return $productData;
            });

        $feedData = [
            'store_name' => env('APP_NAME'),
            'feed_generated_at' => now()->toIso8601String(),
            'products_count' => $products->count(),
            'products' => $products
        ];

        $json = json_encode($feedData, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        $filePath = public_path('products-feed.json');
        
        if (file_put_contents($filePath, $json) !== false) {
            $this->info("✅ Feed generado correctamente en: {$filePath}");
        } else {
            $this->error("❌ Error al guardar el feed en: {$filePath}");
        }
    }
}
