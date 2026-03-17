<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\RankBonus;
use Illuminate\Http\Request;

class RankBonusController extends BasicController
{
    public $model = RankBonus::class;
    public $reactView = 'Admin/RankBonuses';
    public $with4get = ['rank'];

    public function setReactViewProperties(Request $request)
    {
        return [
            'ranks' => \App\Models\Rank::all()
        ];
    }
}
