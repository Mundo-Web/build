<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\App;

class AppsRest extends BasicController
{
    public function __construct()
    {
        parent::__construct(
            App::class,
            'apps',
            'app'
        );
    }
}
