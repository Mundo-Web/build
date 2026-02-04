<?php

use Illuminate\Support\Facades\Route;

// Admin
use App\Http\Controllers\Admin\AboutusController as AdminAboutusController;
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\Admin\IndicatorController as AdminIndicatorController;
use App\Http\Controllers\Admin\SliderController as AdminSliderController;
use App\Http\Controllers\Admin\TestimonyController as AdminTestimonyController;
use App\Http\Controllers\Admin\CaseStudyController as AdminCaseStudyController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\BlogCategoryController as AdminBlogCategoryController;
use App\Http\Controllers\Admin\CollectionController as AdminCollectionController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\InnovationController as AdminInnovationController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\ServiceCategoryController as AdminServiceCategoryController;
use App\Http\Controllers\Admin\ServiceSubCategoryController as AdminServiceSubCategoryController;
use App\Http\Controllers\Admin\SocialController as AdminSocialController;
use App\Http\Controllers\Admin\StrengthController as AdminStrengthController;
use App\Http\Controllers\Admin\BenefitController as AdminBenefitController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\AttributeController as AdminAttributeController;
use App\Http\Controllers\Admin\AppController as AdminAppController;
use App\Http\Controllers\Admin\CertificationController as AdminCertificationController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\GeneralController as AdminGeneralController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Test\PixelTestController;
use App\Http\Controllers\Test\NotificationTestController;
use App\Http\Controllers\Customer\SaleController as CustomerSaleController;
use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\AdController as AdminAdController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\SystemController as AdminSystemController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\PostTagController as AdminPostTagController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\ComboController as AdminComboController;
use App\Http\Controllers\Admin\DeliveryPriceController as AdminDeliveryPriceController;
use App\Http\Controllers\Admin\DeliveryZoneController as AdminDeliveryZoneController;
use App\Http\Controllers\Admin\StoreController as AdminStoreController;
use App\Http\Controllers\Admin\SaleController as AdminSaleController;
use App\Http\Controllers\Admin\SaleExportController as AdminSaleExportController;
use App\Http\Controllers\Admin\SubCategoryController as AdminSubCategoryController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\DiscountRulesController as AdminDiscountRulesController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\RepositoryController as AdminRepositoryController;
use App\Http\Controllers\Admin\SaleStatusController as AdminSaleStatusController;
use App\Http\Controllers\Admin\ComplaintController as AdminComplaintController;
use App\Http\Controllers\Admin\WhistleblowingController as AdminWhistleblowingController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Admin\ProviderController;
use App\Http\Controllers\Admin\JobApplicationController as AdminJobApplicationController;
use App\Http\Controllers\Admin\RoleHasMenuController;
// Public 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RepositoryController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SystemController;
use SoDe\Extend\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', fn() => view('coming-soon'));

// Ruta de test para píxeles (solo para desarrollo)
Route::get('/test/pixels', [PixelTestController::class, 'index'])->name('test.pixels');
Route::get('/test/product-tracking', fn() => view('examples.product-tracking'))->name('test.product-tracking');

// Test de notificaciones
Route::get('/test/notifications', [NotificationTestController::class, 'index'])->name('test.notifications');
Route::post('/test/notifications/contact', [NotificationTestController::class, 'testContactNotification']);
Route::post('/test/notifications/purchase', [NotificationTestController::class, 'testPurchaseNotification']);
Route::get('/test/notifications/corporate-email', [NotificationTestController::class, 'checkCorporateEmail']);

// Verificar si el archivo existe, si no, crear uno vacío
$filePath = storage_path('app/pages.json');
if (!file_exists($filePath)) {
    file_put_contents($filePath, json_encode([]));
}

$pages = json_decode(File::get($filePath), true);

// Public routes
foreach ($pages as $page) {
    Route::get($page['path'], [SystemController::class, 'reactView'])->name('System.jsx');
}

Route::get('/base-template', [SystemController::class, 'reactView'])->name('System.jsx');
Route::get('/login', [AuthController::class, 'loginView'])->name('Login.jsx');

// Google OAuth web routes
Route::get('/auth/google', [App\Http\Controllers\GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [App\Http\Controllers\GoogleAuthController::class, 'handleGoogleCallback']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [AdminProfileController::class, 'reactView'])->name('Admin/Profile.jsx');
    Route::get('/account', [AdminAccountController::class, 'reactView'])->name('Admin/Account.jsx');
});

// Admin routes
Route::middleware(['can:Admin', 'auth'])->prefix('admin')->group(function () {

    Route::get('/', fn() => redirect()->route('Admin/Home.jsx'));
    Route::get('/home', [AdminHomeController::class, 'reactView'])->name('Admin/Home.jsx');
    Route::get('/sales', [AdminSaleController::class, 'reactView'])->name('Admin/Sales.jsx');
    Route::get('/sales/export-data', [AdminSaleExportController::class, 'exportData'])->name('admin.sales.export');
    Route::get('/items', [AdminItemController::class, 'reactView'])->name('Admin/Items.jsx');
    Route::get('/coupons', [AdminCouponController::class, 'reactView'])->name('Admin/Coupons.jsx');
    Route::get('/discount-rules', [AdminDiscountRulesController::class, 'reactView'])->name('Admin/DiscountRules.jsx');
    Route::get('/ads', [AdminAdController::class, 'reactView'])->name('Admin/Ads.jsx');
    Route::get('/job-applications', [AdminJobApplicationController::class, 'reactView'])->name('Admin/JobApplications.jsx');

    Route::get('/combos', [AdminComboController::class, 'reactView'])->name('Admin/Combos.jsx');

    Route::get('/categories', [AdminCategoryController::class, 'reactView'])->name('Admin/Categories.jsx');
    Route::get('/blog-categories', [AdminBlogCategoryController::class, 'reactView'])->name('Admin/BlogCategories.jsx');
    Route::get('/collections', [AdminCollectionController::class, 'reactView'])->name('Admin/Collections.jsx');
    Route::get('/subcategories', [AdminSubCategoryController::class, 'reactView'])->name('Admin/SubCategories.jsx');
    Route::get('/brands', [AdminBrandController::class, 'reactView'])->name('Admin/Brands.jsx');
    Route::get('/tags', [AdminTagController::class, 'reactView'])->name('Admin/Tags.jsx');
    Route::get('/post-tags', [AdminPostTagController::class, 'reactView'])->name('Admin/PostTags.jsx');
    Route::get('/amenities', [App\Http\Controllers\Admin\AmenityController::class, 'reactView'])->name('Admin/Amenities.jsx');
    Route::get('/rooms', [AdminItemController::class, 'roomsView'])->name('Admin/Rooms.jsx');
    Route::get('/bookings', [App\Http\Controllers\Admin\BookingController::class, 'reactView'])->name('Admin/Bookings.jsx');
    Route::get('/room-availability', [App\Http\Controllers\Admin\RoomAvailabilityController::class, 'reactView'])->name('Admin/RoomAvailability.jsx');
    Route::get('/prices', [AdminDeliveryPriceController::class, 'reactView'])->name('Admin/DeliveryPricesType.jsx');
    Route::get('/stores', [AdminStoreController::class, 'reactView'])->name('Admin/Stores.jsx');
    Route::get('/messages', [AdminSubscriptionController::class, 'reactView'])->name('Admin/Messages.jsx');
    Route::get('/complaints', [AdminComplaintController::class, 'reactView'])->name('Admin/Complaints.jsx');
    Route::get('/whistleblowings', [AdminWhistleblowingController::class, 'reactView'])->name('Admin/Whistleblowings.jsx');
    Route::get('/subscriptions', [AdminSubscriptionController::class, 'reactView'])->name('Admin/Subscriptions.jsx');

    Route::get('/posts', [AdminPostController::class, 'reactView'])->name('Admin/Posts.jsx');
    Route::get('/innovations', [AdminInnovationController::class, 'reactView'])->name('Admin/Innovations.jsx');
    Route::get('/services', [AdminServiceController::class, 'reactView'])->name('Admin/Services.jsx');
    Route::get('/service-categories', [AdminServiceCategoryController::class, 'reactView'])->name('Admin/ServiceCategories.jsx');
    Route::get('/service-subcategories', [AdminServiceSubCategoryController::class, 'reactView'])->name('Admin/ServiceSubcategory.jsx');
    Route::get('/about', [AdminAboutusController::class, 'reactView'])->name('Admin/About.jsx');
    Route::get('/delivery-zones', [AdminDeliveryZoneController::class, 'reactView'])->name('Admin/DeliveryZones.jsx');
    Route::get('/indicators', [AdminIndicatorController::class, 'reactView'])->name('Admin/Indicators.jsx');
    Route::get('/sliders', [AdminSliderController::class, 'reactView'])->name('Admin/Sliders.jsx');
    Route::get('/banners', [AdminBannerController::class, 'reactView'])->name('Admin/Banners.jsx');
    Route::get('/testimonies', [AdminTestimonyController::class, 'reactView'])->name('Admin/Testimonies.jsx');
    Route::get('/case-studies', [AdminCaseStudyController::class, 'reactView'])->name('Admin/CaseStudies.jsx');
    Route::get('/socials', [AdminSocialController::class, 'reactView'])->name('Admin/Socials.jsx');
    Route::get('/statuses', [AdminSaleStatusController::class, 'reactView'])->name('Admin/Statuses.jsx');
    Route::get('/strengths', [AdminStrengthController::class, 'reactView'])->name('Admin/Strengths.jsx');
    Route::get('/benefits', [AdminBenefitController::class, 'reactView'])->name('Admin/Benefits.jsx');
    Route::get('/applications', [AdminApplicationController::class, 'reactView'])->name('Admin/Applications.jsx');
    Route::get('/attributes', [AdminAttributeController::class, 'reactView'])->name('Admin/Attributes.jsx');
    Route::get('/apps', [AdminAppController::class, 'reactView'])->name('Admin/Apps.jsx');
    Route::get('/certifications', [AdminCertificationController::class, 'reactView'])->name('Admin/Certifications.jsx');
    Route::get('/partners', [AdminPartnerController::class, 'reactView'])->name('Admin/Partners.jsx');
    Route::get('/generals', [AdminGeneralController::class, 'reactView'])->name('Admin/Generals.jsx');
    Route::get('/coupons', [AdminCouponController::class, 'reactView'])->name('Admin/Coupons.jsx');
    Route::get('/faqs', [AdminFaqController::class, 'reactView'])->name('Admin/Faqs.jsx');
    Route::get('/users', [AdminUserController::class, 'reactView'])->name('Admin/Users.jsx');
    Route::get('/clients', [AdminClientController::class, 'reactView'])->name('Admin/Clients.jsx');
    Route::get('/providers', [ProviderController::class, 'reactView'])->name('Admin/Providers.jsx');


    Route::get('/gallery', [AdminGalleryController::class, 'reactView'])->name('Admin/Gallery.jsx');
    Route::get('/repository', [AdminRepositoryController::class, 'reactView'])->name('Admin/Repository.jsx');

    Route::middleware(['can:Root'])->get('/system', [AdminSystemController::class, 'reactView'])->name('Admin/System.jsx');
    Route::middleware(['can:Root'])->get('/menus', [RoleHasMenuController::class, 'reactView'])->name('Admin/Menus.jsx');
});

Route::middleware(['can:Customer', 'auth'])->prefix('customer')->group(function () {
    Route::get('/dashboard', [CustomerSaleController::class, 'reactView'])->name('Customer/Sales.jsx');
    Route::get('/orders', [CustomerSaleController::class, 'reactView'])->name('Customer/Sales.jsx');
});

Route::middleware(['can:Provider', 'auth'])->prefix('provider')->group(function () {
    Route::get('/home', [ProviderController::class, 'dashboard'])->name('Provider/Home.jsx');
});


if (env('APP_ENV') === 'local') {
    Route::get('/cloud/{uuid}', [RepositoryController::class, 'media']);
}

// Ruta para ejecutar migraciones manualmente (protegida con token secreto)
Route::get('/deploy/migrate/{token}', function ($token) {
    // Token secreto para proteger la ruta
    $secretToken = env('DEPLOY_TOKEN', 'mundoweb-admin-2025-fsdreweaaqwsrdatypoe4532013848752ddsd2cxcafgveras');

    if ($token !== $secretToken) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    try {
        // 1. Ejecutar migraciones
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = \Illuminate\Support\Facades\Artisan::output();

        // 2. Limpiar todas las cachés
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        $optimizeOutput = \Illuminate\Support\Facades\Artisan::output();

        return response()->json([
            'success' => true,
            'message' => 'Deploy ejecutado correctamente',
            'migrate' => $migrateOutput,
            'optimize_clear' => $optimizeOutput
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error al ejecutar deploy',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Catch-all for Referral Codes (Smart Links)
// This must be the LAST route to avoid conflicts with existing pages or assets
Route::get('/{referral_code}', [\App\Http\Controllers\SystemController::class, 'handleReferralRoot'])
    ->where('referral_code', '[A-Za-z0-9\-]+');
