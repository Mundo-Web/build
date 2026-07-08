<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Slider;
use App\Http\Requests\StoreSliderRequest;
use App\Http\Requests\UpdateSliderRequest;
use Illuminate\Http\Request;

class SliderController extends BasicController
{
    public $model = Slider::class;
    public $reactView = 'Admin/Sliders';
    public $imageFields = ['bg_image', 'bg_image_mobile', 'image'];
    public $softDeletion = false;
    public $defaultOrderBy = 'order_index'; // Ordenar por order_index por defecto

    public $booleanLimits = [
        'is_seo' => [
            'max' => 1,
            'label' => 'SEO H1',
            'message' => 'Solo se permite un slider con SEO H1 activo.',
        ]
    ];

    public function beforeSave(Request $request)
    {
        $data = parent::beforeSave($request);
        if (isset($data['is_seo']) && filter_var($data['is_seo'], FILTER_VALIDATE_BOOLEAN)) {
            $id = $data['id'] ?? null;
            $query = Slider::where('is_seo', true);
            if ($id) {
                $query->where('id', '<>', $id);
            }
            $query->update(['is_seo' => false]);
        }
        return $data;
    }

    public function setReactViewProperties(Request $request)
    {
        return [];
    }


}
