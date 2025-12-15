<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends BasicController
{
   public $model = Complaint::class;
   public $reactView = 'Admin/Complaints';

   public function setPaginationInstance(Request $request, string $model)
   {
      return $model::select();
   }
}