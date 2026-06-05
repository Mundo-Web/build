<?php

namespace App\Observers;

use App\Models\Item;

class ItemPriceObserver
{
  public function created(Item $item)
  {
    $final_price = $item->price;
    $discount_percent = 0;

    if ($item->discount > 0) {
      $final_price = min($item->price, $item->discount);
      $discount_percent = $item->price > 0 ? 100 - ($item->discount / $item->price * 100) : 0;
    }

    Item::where('id', $item->id)->update([
      'final_price' => $final_price,
      'discount_percent' => $discount_percent
    ]);
  }

  public function updating(Item $item)
  {
    if ($item->isDirty('price') || $item->isDirty('discount')) {
      $final_price = $item->price;
      $discount_percent = 0;

      if ($item->discount > 0) {
        $final_price = min($item->price, $item->discount);
        $discount_percent = $item->price > 0 ? 100 - ($item->discount / $item->price * 100) : 0;
      }

      Item::where('id', $item->id)->update([
        'final_price' => $final_price,
        'discount_percent' => $discount_percent
      ]);
    }
  }
}
