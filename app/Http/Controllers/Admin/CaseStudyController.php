<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\CaseStudy;

class CaseStudyController extends BasicController
{
    public $model = CaseStudy::class;
    public $reactView = 'Admin/CaseStudies';
    public $defaultOrderBy = 'order_index';
    public $imageFields = ['image'];
}
