<?php

use Illuminate\Support\Facades\Route;

// Admin
use App\Http\Controllers\Admin\AboutusController as AdminAboutusController;
use App\Http\Controllers\Admin\IndicatorController as AdminIndicatorController;
use App\Http\Controllers\Admin\MessageController as AdminMessageController;
use App\Http\Controllers\Admin\ComplaintController as AdminComplaintController;
use App\Http\Controllers\Admin\WhistleblowingController as AdminWhistleblowingController;
use App\Http\Controllers\Admin\SliderController as AdminSliderController;
use App\Http\Controllers\Admin\TestimonyController as AdminTestimonyController;
use App\Http\Controllers\Admin\CaseStudyController as AdminCaseStudyController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\BlogCategoryController as AdminBlogCategoryController;

use App\Http\Controllers\Admin\CollectionController as AdminCollectionController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\InnovationController as AdminInnovationController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\ServiceCategoryController as AdminServiceCategoryController;
use App\Http\Controllers\Admin\ServiceSubCategoryController as AdminServiceSubCategoryController;
use App\Http\Controllers\Admin\SocialController as AdminSocialController;
use App\Http\Controllers\Admin\StrengthController as AdminStrengthController;
use App\Http\Controllers\Admin\BenefitController as AdminBenefitController;
use App\Http\Controllers\Admin\AppController as AdminAppController;
use App\Http\Controllers\Admin\CertificationController as AdminCertificationController;
use App\Http\Controllers\Admin\PartnerController as AdminPartnerController;
use App\Http\Controllers\Admin\GeneralController as AdminGeneralController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\AdController as AdminAdController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\DiscountRulesController as AdminDiscountRulesController;
use App\Http\Controllers\Admin\AmenityController as AdminAmenityController;
use App\Http\Controllers\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Admin\RoomAvailabilityController as AdminRoomAvailabilityController;

use App\Http\Controllers\Admin\DeliveryPriceController as AdminDeliveryPriceController;
use App\Http\Controllers\Admin\TypesDeliveryController as AdminTypesDeliveryController;
use App\Http\Controllers\Admin\StoreController as AdminStoreController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\SaleController as AdminSaleController;
use App\Http\Controllers\Admin\SaleExportController as AdminSaleExportController;
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\Customer\SaleController as CustomerSaleController;

use App\Http\Controllers\Admin\SubCategoryController as AdminSubCategoryController;
use App\Http\Controllers\Admin\SystemColorController as AdminSystemColorController;
use App\Http\Controllers\Admin\SystemController as AdminSystemController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\PostTagController as AdminPostTagController;
use App\Http\Controllers\Admin\WebDetailController as AdminWebDetailController;

use App\Http\Controllers\Admin\ItemImageController as AdminItemImageController;
use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\Admin\ComboController as AdminComboController;
use App\Http\Controllers\Admin\DeliveryZoneController as AdminDeliveryZoneController;
use App\Http\Controllers\Admin\ImageUploadController;
use App\Http\Controllers\Admin\NotificationVariableController;
use App\Http\Controllers\Api\NotificationVariablesController;
use App\Http\Controllers\Admin\RepositoryController as AdminRepositoryController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\SaleStatusController as AdminSaleStatusController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Admin\JobApplicationController as AdminJobApplicationController;
use App\Http\Controllers\Admin\FillableController;
use App\Http\Controllers\Admin\RoleHasMenuController;
use App\Http\Controllers\AuthClientController;
use App\Http\Controllers\JobApplicationController;
// Public
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogCategoryController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\WhistleblowingController;
use App\Http\Controllers\CoverController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\DeliveryPriceController;
use App\Http\Controllers\TypeDeliveryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemImportController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\RoomAvailabilityController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\OpenPayController;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ScrapController;
use App\Http\Controllers\StrengthController;
use App\Http\Controllers\BenefitController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\TemporalyImageController;
use App\Http\Controllers\UnifiedImportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/ubigeo/search', [DeliveryPriceController::class, 'search'])->name('ubigeo.search');
Route::get('/ubigeo/find/{code}', [DeliveryPriceController::class, 'findByCode'])->name('ubigeo.find');

// Type Delivery routes
Route::get('/type-delivery/{slug}', [TypeDeliveryController::class, 'getBySlug']);

// Rutas públicas para tiendas (checkout)
Route::get('/stores', [AdminStoreController::class, 'getActiveStores']);
Route::get('/stores/main', [AdminStoreController::class, 'getMainStore']);
Route::get('/stores/by-ubigeo/{ubigeo}', [AdminStoreController::class, 'getByUbigeo']);

Route::post('/scrap', [ScrapController::class, 'scrap']);
Route::post('/scrap-shopsimon', [ScrapController::class, 'scrapShopSimon']);

Route::post('/import-items', [ItemImportController::class, 'import']);

// Unified Import API
Route::post('/unified-import', [UnifiedImportController::class, 'import']);
Route::post('/unified-import/preview', [UnifiedImportController::class, 'preview']);
Route::get('/unified-import/field-mappings', [UnifiedImportController::class, 'getFieldMappings']);

Route::post('/complaints', [ComplaintController::class, 'saveComplaint'])
    ->middleware(\App\Http\Middleware\FormSecurityMiddleware::class);
Route::post('/whistleblowings', [WhistleblowingController::class, 'saveWhistleblowing'])
    ->middleware(\App\Http\Middleware\FormSecurityMiddleware::class);
Route::get('/notification-variables/{type}', [NotificationVariablesController::class, 'getVariables']);

// CAPTCHA routes (seguridad mejorada)
Route::post('/captcha/generate', [App\Http\Controllers\CaptchaController::class, 'generate'])->middleware('throttle:30,1');
Route::post('/captcha/verify', [App\Http\Controllers\CaptchaController::class, 'verify'])->middleware('throttle:20,1');

// Tracking de ecommerce
Route::post('/tracking/add-to-cart', [App\Http\Controllers\Ecommerce\EcommerceTrackingController::class, 'trackAddToCart']);
Route::post('/tracking/initiate-checkout', [App\Http\Controllers\Ecommerce\EcommerceTrackingController::class, 'trackInitiateCheckout']);
Route::get('/tracking/purchase/{orderId}', [App\Http\Controllers\Ecommerce\EcommerceTrackingController::class, 'trackPurchase']);

// Strengths API
Route::get('/strengths', [StrengthController::class, 'getStrengths']);

// Benefits API
Route::get('/benefits', [BenefitController::class, 'getBenefits']);

// Applications API
Route::get('/applications', [ApplicationController::class, 'getApplications']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);

Route::post('/login-client', [AuthClientController::class, 'login']);
Route::post('/signup-client', [AuthClientController::class, 'signup']);

// Job Applications
Route::post('/job-applications', [JobApplicationController::class, 'save']);
Route::post('/forgot-password-client', [AuthClientController::class, 'forgotPassword']);
Route::post('/reset-password-client', [AuthClientController::class, 'resetPassword']);

// Google OAuth routes
Route::post('/google-login', [App\Http\Controllers\GoogleAuthController::class, 'loginWithGoogle']);

// Rutas públicas para cupones
Route::post('/coupons/validate', [AdminCouponController::class, 'validateCoupon']);

Route::post('/delivery-prices', [DeliveryPriceController::class, 'getDeliveryPrice']);
Route::post('/prices-type', [DeliveryPriceController::class, 'getPrices']);

Route::get('/banners/media/{uuid}', [AdminBannerController::class, 'media']);
Route::get('/sliders/media/{uuid}', [AdminSliderController::class, 'media']);
Route::get('/categories/media/{uuid}', [AdminCategoryController::class, 'media']);
Route::get('/collections/media/{uuid}', [AdminCollectionController::class, 'media']);
Route::get('/subcategories/media/{uuid}', [AdminSubCategoryController::class, 'media']);
Route::get('/brands/media/{uuid}', [AdminBrandController::class, 'media']);
Route::get('/testimonies/media/{uuid}', [AdminTestimonyController::class, 'media']);
Route::get('/posts/media/{uuid}', [AdminPostController::class, 'media']);
Route::get('/innovations/media/{uuid}', [AdminInnovationController::class, 'media']);
Route::get('/services/media/{uuid}', [AdminServiceController::class, 'media']);
Route::get('/service-categories/media/{uuid}', [AdminServiceCategoryController::class, 'media']);
Route::get('/service-subcategories/media/{uuid}', [AdminServiceSubCategoryController::class, 'media']);

// Public route for service views tracking
Route::post('/services/update-views', [AdminServiceController::class, 'updateViews']);

Route::get('/items/media/{uuid}', [AdminItemController::class, 'media']);

Route::get('/item_images/media/{uuid}', [AdminItemImageController::class, 'media']);

Route::get('/indicators/media/{uuid}', [AdminIndicatorController::class, 'media']);

Route::get('/aboutuses/media/{uuid}', [AdminAboutusController::class, 'media']);
Route::get('/strengths/media/{uuid}', [AdminStrengthController::class, 'media']);
Route::get('/benefits/media/{uuid}', [AdminBenefitController::class, 'media']);
Route::get('/apps/media/{uuid}', [App\Http\Controllers\Admin\AppController::class, 'media']);
Route::get('/certifications/media/{uuid}', [AdminCertificationController::class, 'media']);
Route::get('/partners/media/{uuid}', [AdminCertificationController::class, 'media']);
Route::get('/ads/media/{uuid}', [AdminAdController::class, 'media'])->withoutMiddleware('throttle');
Route::get('/stores/media/{uuid}', [AdminStoreController::class, 'media']);
Route::get('/job-applications/media/{uuid}', [AdminJobApplicationController::class, 'media']);
Route::get('/amenities/media/{uuid}', [AdminAmenityController::class, 'media']);

Route::post('/posts/paginate', [PostController::class, 'paginate']);
Route::post('/items/paginate', [ItemController::class, 'paginate']);
Route::post('/items/convert-slugs', [ItemController::class, 'convertSlugsToIds']);

Route::post('/messages', [MessageController::class, 'save']);
Route::post('/subscriptions', [SubscriptionController::class, 'save']);
Route::post('/unsubscribe', [SubscriptionController::class, 'unsubscribe']);

Route::get('/cover/{uuid}', [CoverController::class, 'full']);
Route::get('/cover/thumbnail/{uuid}', [CoverController::class, 'thumbnail']);
Route::get('/mailing/notify', [BlogController::class, 'notifyToday']);
Route::delete('/mailing/down/{id}', [SubscriptionController::class, 'delete'])->name('mailing.down');

Route::post('/items/verify-stock', [ItemController::class, 'verifyStock']);
Route::post('/items/combo-items', [ItemController::class, 'verifyCombo']);
Route::post('/items/update-items', [ItemController::class, 'updateViews']);
Route::post('/items/relations-items', [ItemController::class, 'relationsItems']);
Route::post('/items/variations-items', [ItemController::class, 'variationsItems'])->withoutMiddleware('throttle');
Route::post('/items/sizes-items', [ItemController::class, 'getSizesItems'])->withoutMiddleware('throttle');
Route::post('/items/colors-items', [ItemController::class, 'getColorsItems'])->withoutMiddleware('throttle');
Route::post('/items/searchProducts', [ItemController::class, 'searchProduct']);
Route::get('/items/tags', [ItemController::class, 'getTags']);
Route::get('/catalog/context', [App\Http\Controllers\CatalogController::class, 'context']);

// ====================================
// Hotel Public APIs
// ====================================
Route::prefix('hotels')->group(function () {
    // Buscar habitaciones disponibles
    Route::post('/rooms/search', [BookingController::class, 'search']);
    
    // Verificar disponibilidad de una habitación específica
    Route::post('/rooms/{id}/availability', [RoomAvailabilityController::class, 'check']);
    
    // Obtener calendario de disponibilidad
    Route::get('/rooms/{id}/calendar', [RoomAvailabilityController::class, 'calendar']);
    
    // Obtener fechas bloqueadas/no disponibles (para deshabilitar en DatePicker)
    Route::get('/rooms/{id}/blocked-dates', [AdminRoomAvailabilityController::class, 'getBlockedDates']);
    
    // Crear reserva (pre-venta)
    Route::post('/bookings', [BookingController::class, 'create']);
    
    // Checkout de reservas con pago (Yape, Transferencia, etc.)
    Route::post('/bookings/checkout', [BookingController::class, 'checkout']);
    
    // Obtener detalles de reserva por código (para página de confirmación)
    Route::post('/bookings/order', [BookingController::class, 'getBookingOrder']);
    
    // Rastrear reserva por código
    Route::get('/bookings/{code}/track', [BookingController::class, 'track']);
});

// Combos API para carrito
Route::get('/combos-as-products', [App\Http\Controllers\Api\ComboApiController::class, 'index']);
Route::get('/combos-as-products/{id}', [App\Http\Controllers\Api\ComboApiController::class, 'show']);
Route::get('/items/{id}/combos', [ItemController::class, 'getItemCombos']);

Route::post('/pago', [PaymentController::class, 'charge']);
Route::post('/pago/charge-completed', [PaymentController::class, 'chargeCompleted']);
Route::post('/pago/3ds', [PaymentController::class, 'charge3DS']);
Route::get('/pago/{sale_id}', [PaymentController::class, 'getPaymentStatus']);

// Ruta para crear orden de Culqi (habilita Yape, bancaMovil, etc.)
Route::post('/culqi/checkout-order', [\App\Http\Controllers\CulqiController::class, 'createCheckoutOrder']);

// Nuevas rutas para MercadoPago
Route::post('/mercadopago/preference', [MercadoPagoController::class, 'createPreference']);
Route::get('/mercadopago/success', [MercadoPagoController::class, 'handleSuccess']);
Route::get('/mercadopago/failure', [MercadoPagoController::class, 'handleFailure']);
Route::get('/mercadopago/pending', [MercadoPagoController::class, 'handlePending']);

// Rutas para OpenPay
Route::post('/openpay/charge', [OpenPayController::class, 'createCharge']);
Route::post('/openpay/webhook', [OpenPayController::class, 'webhook']);

Route::post('/temporaly-image', [TemporalyImageController::class, 'save'])->name('save_temporaly_image');
Route::post('/temporaly-image/{id}', [TemporalyImageController::class, 'delete'])->name('delete_temporaly_image');

Route::post('/vouchers/temp', [TemporalyImageController::class, 'storeTemp'])->name('voucher.temp');
Route::delete('/vouchers/temp/{id}', [TemporalyImageController::class, 'deleteTemp'])->name('voucher.delete');
Route::post('/guardarvoucher', [TemporalyImageController::class, 'guardarVoucher'])->name('guardarvoucher');

Route::post('/coupons', [CouponController::class, 'save']);
Route::post('/coupons/is-first', [CouponController::class, 'isFirst']);

//pedido
Route::post('/orders', [MercadoPagoController::class, 'getOrder']);

Route::post('/sales', [SaleController::class, 'save']);
Route::get('/sales/track/{code}', [SaleController::class, 'track']);

Route::get('/person/{dni}', [PersonController::class, 'find']);

// Ruta pública para aplicar reglas de descuento al carrito
Route::post('/discount-rules/apply-to-cart', [AdminDiscountRulesController::class, 'applyToCart']);

    Route::post('/blog-categories/paginate', [BlogCategoryController::class, 'paginate']);

Route::middleware('auth')->group(function () {
  Route::get('/notification-variables/{type}', [NotificationVariableController::class, 'variables']);
  Route::post('/upload-image', [ImageUploadController::class, 'store']);
  Route::delete('logout', [AuthController::class, 'destroy'])
    ->name('logout');
  Route::get('/profile/{uuid}', [AdminProfileController::class, 'full']);
  Route::get('/profile/thumbnail/{uuid}', [AdminProfileController::class, 'thumbnail']);
  Route::post('/profile', [AdminProfileController::class, 'saveProfile']);
  Route::patch('/profile', [AdminProfileController::class, 'save']);

  // Ruta de exportación sin middleware de permisos
  Route::get('/admin/sales/export-data', [AdminSaleExportController::class, 'exportData']);

  Route::middleware('can:Admin')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminHomeController::class, 'dashboard']);
    Route::post('/dashboard/visibility', [AdminHomeController::class, 'updateDashboardVisibility']);
    Route::post('/sales/export-config', [AdminSaleController::class, 'saveExportConfig']);
    Route::get('/sales/export-config-get', [AdminSaleController::class, 'getExportConfig']);
    Route::get('/sales/{id}', [AdminSaleController::class, 'get']);
    Route::post('/sales', [AdminSaleController::class, 'save']);
    Route::post('/sales/paginate', [AdminSaleController::class, 'paginate']);
    Route::patch('/sales/status', [AdminSaleController::class, 'status']);
    Route::patch('/sales/{field}', [AdminSaleController::class, 'boolean']);
    Route::delete('/sales/{id}', [AdminSaleController::class, 'delete']);

    Route::get('/sale-statuses/by-sale/{id}', [AdminSaleStatusController::class, 'bySale']);

    Route::post('/web-details', [AdminWebDetailController::class, 'save']);
    Route::post('/gallery', [AdminGalleryController::class, 'save']);
    Route::post('/gallery/config', [AdminGalleryController::class, 'saveConfig']);
    Route::post('/gallery/visibility', [AdminGalleryController::class, 'updateVisibility']);

    Route::post('/items', [AdminItemController::class, 'save']);
    Route::post('/items/paginate', [AdminItemController::class, 'paginate'])->withoutMiddleware('throttle');
    Route::patch('/items/status', [AdminItemController::class, 'status']);
    Route::patch('/items/{field}', [AdminItemController::class, 'boolean']);
    Route::delete('/items/{id}', [AdminItemController::class, 'delete']);
    Route::get('/items/export', [AdminItemController::class, 'export']);

    // Cupones
    Route::post('/coupons', [AdminCouponController::class, 'save']);
    Route::post('/coupons/paginate', [AdminCouponController::class, 'paginate']);
    Route::patch('/coupons/{field}', [AdminCouponController::class, 'boolean']);
    Route::delete('/coupons/{id}', [AdminCouponController::class, 'delete']);
    Route::post('/coupons/validate', [AdminCouponController::class, 'validateCoupon']);
    Route::get('/coupons/generate-code', [AdminCouponController::class, 'generateCode']);

    // Reglas de Descuento
    Route::post('/discount-rules', [AdminDiscountRulesController::class, 'save']);
    Route::post('/discount-rules/paginate', [AdminDiscountRulesController::class, 'paginate']);
    Route::patch('/discount-rules/{field}', [AdminDiscountRulesController::class, 'boolean']);
    Route::delete('/discount-rules/{id}', [AdminDiscountRulesController::class, 'delete']);
    Route::patch('/discount-rules/{id}/toggle-active', [AdminDiscountRulesController::class, 'toggleActive']);
    Route::post('/discount-rules/{id}/duplicate', [AdminDiscountRulesController::class, 'duplicate']);
    Route::get('/discount-rules/products', [AdminDiscountRulesController::class, 'getProducts']);
    Route::post('/discount-rules/products/by-ids', [AdminDiscountRulesController::class, 'getProductsByIds']);
    Route::get('/discount-rules/categories', [AdminDiscountRulesController::class, 'getCategories']);
    Route::post('/discount-rules/categories/by-ids', [AdminDiscountRulesController::class, 'getCategoriesByIds']);
    Route::get('/discount-rules/rule-types', [AdminDiscountRulesController::class, 'getRuleTypes']);
    Route::get('/discount-rules/{id}/usage-stats', [AdminDiscountRulesController::class, 'getUsageStats']);

    Route::post('/ads', [AdminAdController::class, 'save']);
    Route::post('/ads/paginate', [AdminAdController::class, 'paginate']);
    Route::patch('/ads/status', [AdminAdController::class, 'status']);
    Route::patch('/ads/{field}', [AdminAdController::class, 'boolean']);
    Route::delete('/ads/{id}', [AdminAdController::class, 'delete']);


    //Route::get('/items/filters', [AdminItemController::class, 'getFilters']);

    Route::post('/combos', [AdminComboController::class, 'save']);
    Route::post('/combos/paginate', [AdminComboController::class, 'paginate']);
    Route::patch('/combos/status', [AdminComboController::class, 'status']);
    Route::patch('/combos/{field}', [AdminComboController::class, 'boolean']);
    Route::delete('/combos/{id}', [AdminComboController::class, 'delete']);
    Route::get('/combos/{id}', [AdminComboController::class, 'show']);

    Route::post('/coupons', [AdminCouponController::class, 'save']);
    Route::post('/coupons/paginate', [AdminCouponController::class, 'paginate']);
    Route::patch('/coupons/status', [AdminCouponController::class, 'status']);
    Route::patch('/coupons/{field}', [AdminCouponController::class, 'boolean']);
    Route::delete('/coupons/{id}', [AdminCouponController::class, 'delete']);

    Route::post('/messages', [AdminMessageController::class, 'save']);
    Route::post('/messages/paginate', [AdminMessageController::class, 'paginate']);
    Route::patch('/messages/status', [AdminMessageController::class, 'status']);
    Route::patch('/messages/{field}', [AdminMessageController::class, 'boolean']);
    Route::delete('/messages/{id}', [AdminMessageController::class, 'delete']);

    Route::post('/complaints', [AdminComplaintController::class, 'save']);
    Route::post('/complaints/paginate', [AdminComplaintController::class, 'paginate']);
    Route::patch('/complaints/status', [AdminComplaintController::class, 'status']);
    Route::patch('/complaints/{field}', [AdminComplaintController::class, 'boolean']);
    Route::delete('/complaints/{id}', [AdminComplaintController::class, 'delete']);

    Route::post('/whistleblowings', [AdminWhistleblowingController::class, 'save']);
    Route::post('/whistleblowings/paginate', [AdminWhistleblowingController::class, 'paginate']);
    Route::patch('/whistleblowings/status', [AdminWhistleblowingController::class, 'status']);
    Route::patch('/whistleblowings/{field}', [AdminWhistleblowingController::class, 'boolean']);
    Route::delete('/whistleblowings/{id}', [AdminWhistleblowingController::class, 'delete']);

    Route::post('/subscriptions/paginate', [AdminSubscriptionController::class, 'paginate']);
    Route::patch('/subscriptions/status', [AdminSubscriptionController::class, 'status']);
    Route::delete('/subscriptions/{id}', [AdminSubscriptionController::class, 'delete']);

    Route::post('/posts', [AdminPostController::class, 'save']);
    Route::post('/posts/paginate', [AdminPostController::class, 'paginate']);
    Route::patch('/posts/status', [AdminPostController::class, 'status']);
    Route::patch('/posts/{field}', [AdminPostController::class, 'boolean']);
    Route::delete('/posts/{id}', [AdminPostController::class, 'delete']);

    Route::post('/innovations', [AdminInnovationController::class, 'save']);
    Route::post('/innovations/paginate', [AdminInnovationController::class, 'paginate']);
    Route::patch('/innovations/status', [AdminInnovationController::class, 'status']);
    Route::patch('/innovations/{field}', [AdminInnovationController::class, 'boolean']);
    Route::delete('/innovations/{id}', [AdminInnovationController::class, 'delete']);

    Route::post('/services', [AdminServiceController::class, 'save']);
    Route::post('/services/paginate', [AdminServiceController::class, 'paginate']);
    Route::patch('/services/status', [AdminServiceController::class, 'status']);
    Route::patch('/services/{field}', [AdminServiceController::class, 'boolean']);
    Route::delete('/services/{id}', [AdminServiceController::class, 'delete']);

    Route::post('/service-categories', [AdminServiceCategoryController::class, 'save']);
    Route::post('/service-categories/paginate', [AdminServiceCategoryController::class, 'paginate']);
    Route::patch('/service-categories/status', [AdminServiceCategoryController::class, 'status']);
    Route::patch('/service-categories/{field}', [AdminServiceCategoryController::class, 'boolean']);
    Route::put('/service-categories/{id}/reorder', [AdminServiceCategoryController::class, 'reorder']);
    Route::delete('/service-categories/{id}', [AdminServiceCategoryController::class, 'delete']);

    Route::post('/service-subcategories', [AdminServiceSubCategoryController::class, 'save']);
    Route::post('/service-subcategories/paginate', [AdminServiceSubCategoryController::class, 'paginate']);
    Route::patch('/service-subcategories/status', [AdminServiceSubCategoryController::class, 'status']);
    Route::patch('/service-subcategories/{field}', [AdminServiceSubCategoryController::class, 'boolean']);
    Route::delete('/service-subcategories/{id}', [AdminServiceSubCategoryController::class, 'delete']);

    Route::post('/aboutus', [AdminAboutusController::class, 'save']);
    Route::post('/aboutus/paginate', [AdminAboutusController::class, 'paginate']);
    Route::patch('/aboutus/status', [AdminAboutusController::class, 'status']);
    Route::patch('/aboutus/{field}', [AdminAboutusController::class, 'boolean']);
    Route::delete('/aboutus/{id}', [AdminAboutusController::class, 'delete']);
    Route::put('/aboutus/{id}/reorder', [AdminAboutusController::class, 'reorder']);

    Route::post('/indicators', [AdminIndicatorController::class, 'save']);
    Route::post('/indicators/paginate', [AdminIndicatorController::class, 'paginate']);
    Route::patch('/indicators/status', [AdminIndicatorController::class, 'status']);
    Route::patch('/indicators/{field}', [AdminIndicatorController::class, 'boolean']);
    Route::delete('/indicators/{id}', [AdminIndicatorController::class, 'delete']);
    Route::put('/indicators/{id}/reorder', [AdminIndicatorController::class, 'reorder']);

    Route::post('/faqs', [AdminFaqController::class, 'save']);
    Route::post('/faqs/paginate', [AdminFaqController::class, 'paginate']);
    Route::patch('/faqs/status', [AdminFaqController::class, 'status']);
    Route::patch('/faqs/{field}', [AdminFaqController::class, 'boolean']);
    Route::delete('/faqs/{id}', [AdminFaqController::class, 'delete']);


    Route::post('/banners', [AdminBannerController::class, 'save']);
    Route::post('/banners/paginate', [AdminBannerController::class, 'paginate']);
    Route::patch('/banners/status', [AdminBannerController::class, 'status']);
    Route::patch('/banners/{field}', [AdminBannerController::class, 'boolean']);
    Route::delete('/banners/{id}', [AdminBannerController::class, 'delete']);

    Route::post('/sliders', [AdminSliderController::class, 'save']);
    Route::post('/sliders/paginate', [AdminSliderController::class, 'paginate']);
    Route::patch('/sliders/status', [AdminSliderController::class, 'status']);
    Route::patch('/sliders/{field}', [AdminSliderController::class, 'boolean']);
    Route::put('/sliders/{id}/reorder', [AdminSliderController::class, 'reorder']);
    Route::delete('/sliders/{id}', [AdminSliderController::class, 'delete']);

    Route::post('/testimonies', [AdminTestimonyController::class, 'save']);
    Route::post('/testimonies/paginate', [AdminTestimonyController::class, 'paginate']);
    Route::patch('/testimonies/status', [AdminTestimonyController::class, 'status']);
    Route::patch('/testimonies/{field}', [AdminTestimonyController::class, 'boolean']);
    Route::delete('/testimonies/{id}', [AdminTestimonyController::class, 'delete']);

    Route::post('/case-studies', [AdminCaseStudyController::class, 'save']);
    Route::post('/case-studies/paginate', [AdminCaseStudyController::class, 'paginate']);
    Route::patch('/case-studies/status', [AdminCaseStudyController::class, 'status']);
    Route::patch('/case-studies/{field}', [AdminCaseStudyController::class, 'boolean']);
    Route::put('/case-studies/{id}/reorder', [AdminCaseStudyController::class, 'reorder']);
    Route::delete('/case-studies/{id}', [AdminCaseStudyController::class, 'delete']);

    Route::post('/categories', [AdminCategoryController::class, 'save']);
    Route::post('/categories/paginate', [AdminCategoryController::class, 'paginate']);
    Route::patch('/categories/status', [AdminCategoryController::class, 'status']);
    Route::patch('/categories/{field}', [AdminCategoryController::class, 'boolean']);
    Route::put('/categories/{id}/reorder', [AdminCategoryController::class, 'reorder']);
    Route::delete('/categories/{id}', [AdminCategoryController::class, 'delete']);


 Route::post('/blog-categories', [AdminBlogCategoryController::class, 'save']);
    Route::post('/blog-categories/paginate', [AdminBlogCategoryController::class, 'paginate']);
    Route::patch('/blog-categories/status', [AdminBlogCategoryController::class, 'status']);
    Route::patch('/blog-categories/{field}', [AdminBlogCategoryController::class, 'boolean']);
    Route::delete('/blog-categories/{id}', [AdminBlogCategoryController::class, 'delete']);


    Route::post('/collections', [AdminCollectionController::class, 'save']);
    Route::post('/collections/paginate', [AdminCollectionController::class, 'paginate']);
    Route::patch('/collections/status', [AdminCollectionController::class, 'status']);
    Route::patch('/collections/{field}', [AdminCollectionController::class, 'boolean']);
    Route::put('/collections/{id}/reorder', [AdminCollectionController::class, 'reorder']);
    Route::delete('/collections/{id}', [AdminCollectionController::class, 'delete']);

    Route::post('/subcategories', [AdminSubCategoryController::class, 'save']);
    Route::post('/subcategories/paginate', [AdminSubCategoryController::class, 'paginate']);
    Route::patch('/subcategories/status', [AdminSubCategoryController::class, 'status']);
    Route::patch('/subcategories/{field}', [AdminSubCategoryController::class, 'boolean']);
    Route::put('/subcategories/{id}/reorder', [AdminSubCategoryController::class, 'reorder']);
    Route::delete('/subcategories/{id}', [AdminSubCategoryController::class, 'delete']);

    Route::post('/brands', [AdminBrandController::class, 'save']);
    Route::post('/brands/paginate', [AdminBrandController::class, 'paginate']);
    Route::patch('/brands/status', [AdminBrandController::class, 'status']);
    Route::patch('/brands/{field}', [AdminBrandController::class, 'boolean']);
    Route::put('/brands/{id}/reorder', [AdminBrandController::class, 'reorder']);
    Route::delete('/brands/{id}', [AdminBrandController::class, 'delete']);

    Route::post('/prices', [AdminDeliveryPriceController::class, 'save']);
    Route::post('/prices/paginate', [AdminDeliveryPriceController::class, 'paginate']);
    Route::post('/prices/massive', [AdminDeliveryPriceController::class, 'massive']);
    Route::patch('/prices/status', [AdminDeliveryPriceController::class, 'status']);
    Route::patch('/prices/{field}', [AdminDeliveryPriceController::class, 'boolean']);
    Route::delete('/prices/{id}', [AdminDeliveryPriceController::class, 'delete']);

    Route::post('/types_delivery', [AdminTypesDeliveryController::class, 'save']);
    Route::post('/types_delivery/paginate', [AdminTypesDeliveryController::class, 'paginate']);
    Route::post('/types_delivery/massive', [AdminTypesDeliveryController::class, 'massive']);
    Route::patch('/types_delivery/status', [AdminTypesDeliveryController::class, 'status']);
    Route::patch('/types_delivery/{field}', [AdminTypesDeliveryController::class, 'boolean']);
    Route::delete('/types_delivery/{id}', [AdminTypesDeliveryController::class, 'delete']);

    Route::post('/stores', [AdminStoreController::class, 'save']);
    Route::post('/stores/paginate', [AdminStoreController::class, 'paginate']);
    Route::patch('/stores/status', [AdminStoreController::class, 'status']);
    Route::patch('/stores/{field}', [AdminStoreController::class, 'boolean']);
    Route::delete('/stores/{id}', [AdminStoreController::class, 'delete']);
    Route::get('/stores/{id}', [AdminStoreController::class, 'show']);

    Route::post('/tags', [AdminTagController::class, 'save']);
    Route::post('/tags/paginate', [AdminTagController::class, 'paginate']);
    Route::post('/tags/update-promotional-status', [AdminTagController::class, 'updatePromotionalStatus']);
    Route::patch('/tags/status', [AdminTagController::class, 'status']);
    Route::patch('/tags/{field}', [AdminTagController::class, 'boolean']);
    Route::put('/tags/{id}/reorder', [AdminTagController::class, 'reorder']);
    Route::delete('/tags/{id}', [AdminTagController::class, 'delete']);

    // Post Tags routes
    Route::post('/post-tags', [AdminPostTagController::class, 'save']);
    Route::post('/post-tags/paginate', [AdminPostTagController::class, 'paginate']);
    Route::post('/post-tags/update-promotional-status', [AdminPostTagController::class, 'updatePromotionalStatus']);
    Route::patch('/post-tags/status', [AdminPostTagController::class, 'status']);
    Route::patch('/post-tags/{field}', [AdminPostTagController::class, 'boolean']);
    Route::delete('/post-tags/{id}', [AdminPostTagController::class, 'delete']);

    Route::post('/delivery-zones', [AdminDeliveryZoneController::class, 'save']);
    Route::post('/delivery-zones/paginate', [AdminDeliveryZoneController::class, 'paginate']);
    Route::patch('/delivery-zones/status', [AdminDeliveryZoneController::class, 'status']);
    Route::patch('/delivery-zones/{field}', [AdminDeliveryZoneController::class, 'boolean']);
    Route::delete('/delivery-zones/{id}', [AdminDeliveryZoneController::class, 'delete']);

    Route::post('/strengths', [AdminStrengthController::class, 'save']);
    Route::post('/strengths/paginate', [AdminStrengthController::class, 'paginate']);
    Route::patch('/strengths/status', [AdminStrengthController::class, 'status']);
    Route::patch('/strengths/{field}', [AdminStrengthController::class, 'boolean']);
    Route::delete('/strengths/{id}', [AdminStrengthController::class, 'delete']);

    Route::post('/benefits', [AdminBenefitController::class, 'save']);
    Route::post('/benefits/paginate', [AdminBenefitController::class, 'paginate']);
    Route::patch('/benefits/status', [AdminBenefitController::class, 'status']);
    Route::patch('/benefits/{field}', [AdminBenefitController::class, 'boolean']);
    Route::delete('/benefits/{id}', [AdminBenefitController::class, 'delete']);

    Route::post('/applications', [AdminApplicationController::class, 'save']);
    Route::post('/applications/paginate', [AdminApplicationController::class, 'paginate']);
    Route::patch('/applications/status', [AdminApplicationController::class, 'status']);
    Route::patch('/applications/{field}', [AdminApplicationController::class, 'boolean']);
    Route::delete('/applications/{id}', [AdminApplicationController::class, 'delete']);

    Route::post('/apps', [AdminAppController::class, 'save']);
    Route::post('/apps/paginate', [AdminAppController::class, 'paginate']);
    Route::patch('/apps/status', [AdminAppController::class, 'status']);
    Route::patch('/apps/{field}', [AdminAppController::class, 'boolean']);
    Route::delete('/apps/{id}', [AdminAppController::class, 'delete']);

    Route::post('/certifications', [AdminCertificationController::class, 'save']);
    Route::post('/certifications/paginate', [AdminCertificationController::class, 'paginate']);
    Route::patch('/certifications/status', [AdminCertificationController::class, 'status']);
    Route::patch('/certifications/{field}', [AdminCertificationController::class, 'boolean']);
    Route::delete('/certifications/{id}', [AdminCertificationController::class, 'delete']);

    Route::post('/partners', [AdminPartnerController::class, 'save']);
    Route::post('/partners/paginate', [AdminPartnerController::class, 'paginate']);
    Route::patch('/partners/status', [AdminPartnerController::class, 'status']);
    Route::patch('/partners/{field}', [AdminPartnerController::class, 'boolean']);
    Route::delete('/partners/{id}', [AdminPartnerController::class, 'delete']);

    Route::post('/socials', [AdminSocialController::class, 'save']);
    Route::post('/socials/paginate', [AdminSocialController::class, 'paginate']);
    Route::patch('/socials/status', [AdminSocialController::class, 'status']);
    Route::patch('/socials/{field}', [AdminSocialController::class, 'boolean']);
    Route::delete('/socials/{id}', [AdminSocialController::class, 'delete']);

    // Amenities (Amenidades para habitaciones)
    Route::post('/amenities', [AdminAmenityController::class, 'save']);
    Route::post('/amenities/paginate', [AdminAmenityController::class, 'paginate']);
    Route::patch('/amenities/status', [AdminAmenityController::class, 'status']);
    Route::patch('/amenities/{field}', [AdminAmenityController::class, 'boolean']);
    Route::delete('/amenities/{id}', [AdminAmenityController::class, 'delete']);

    // Bookings (Reservas de habitaciones)
    Route::get('/bookings/{id}', [AdminBookingController::class, 'show']);
    Route::post('/bookings', [AdminBookingController::class, 'save']);
    Route::post('/bookings/paginate', [AdminBookingController::class, 'paginate']);
    Route::post('/bookings/{id}/confirm', [AdminBookingController::class, 'confirm']);
    Route::post('/bookings/{id}/complete', [AdminBookingController::class, 'complete']);
    Route::post('/bookings/{id}/cancel', [AdminBookingController::class, 'cancel']);
    Route::post('/bookings/{id}/no-show', [AdminBookingController::class, 'noShow']);
    Route::post('/bookings/{id}/update-sale-status', [AdminBookingController::class, 'updateSaleStatus']);
    Route::get('/bookings/{id}/sale-status-history', [AdminBookingController::class, 'getSaleStatusHistory']);
    Route::post('/bookings/direct-register', [AdminBookingController::class, 'directRegister']); // Registro directo (walk-in)
    Route::delete('/bookings/{id}', [AdminBookingController::class, 'delete']);

    // Room Availability (Disponibilidad de habitaciones)
    Route::get('/room-availability/summary', [AdminRoomAvailabilityController::class, 'getSummary']);
    Route::get('/room-availability/{roomId}/calendar', [AdminRoomAvailabilityController::class, 'getCalendar']);
    Route::post('/room-availability/{roomId}/block', [AdminRoomAvailabilityController::class, 'blockDates']);
    Route::post('/room-availability/{roomId}/update', [AdminRoomAvailabilityController::class, 'updateAvailability']);
    Route::post('/room-availability/{roomId}/generate', [AdminRoomAvailabilityController::class, 'generateAvailability']);
    Route::post('/room-availability/{roomId}/complete-cleaning', [AdminRoomAvailabilityController::class, 'completeCleaning']);


    //JOB APLICATIONS
    Route::post('/job-applications', [AdminJobApplicationController::class, 'save']);
    Route::post('/job-applications/paginate', [AdminJobApplicationController::class, 'paginate']);
    Route::patch('/job-applications/status', [AdminJobApplicationController::class, 'status']);
    Route::patch('/job-applications/{field}', [AdminJobApplicationController::class, 'boolean']);
    Route::delete('/job-applications/{id}', [AdminJobApplicationController::class, 'delete']);

   Route::post('/statuses', [AdminSaleStatusController::class, 'save']);
    Route::post('/statuses/paginate', [AdminSaleStatusController::class, 'paginate']);
    Route::patch('/statuses/status', [AdminSaleStatusController::class, 'status']);
    Route::patch('/statuses/{field}', [AdminSaleStatusController::class, 'boolean']);
    Route::delete('/statuses/{id}', [AdminSaleStatusController::class, 'delete']);

    // Users management
    Route::post('/users', [AdminUserController::class, 'save']);
    Route::post('/users/paginate', [AdminUserController::class, 'paginate']);
    Route::patch('/users/{field}', [AdminUserController::class, 'boolean']);
    Route::delete('/users/{id}', [AdminUserController::class, 'delete']);

    // Clients management
    Route::post('/clients/paginate', [AdminClientController::class, 'paginate']);
    Route::patch('/clients/{field}', [AdminClientController::class, 'boolean']);


    // System routes - accessible by Admin and Root
    Route::post('/system', [AdminSystemController::class, 'save']);
    Route::post('/system/page', [AdminSystemController::class, 'savePage']);
    Route::delete('/system/page/{id}', [AdminSystemController::class, 'deletePage']);
    Route::patch('/system/order', [AdminSystemController::class, 'updateOrder']);
    Route::delete('/system/{id}', [AdminSystemController::class, 'delete']);
    Route::get('/system/related/{model}/{method}', [AdminSystemController::class, 'getRelatedFilter']);

    // Root-only routes - sensitive operations
    Route::middleware(['can:Root'])->group(function () {
      Route::post('/fillable/{model}', [FillableController::class, 'save']);

      Route::get('/system/backup', [AdminSystemController::class, 'exportBK']);
      Route::post('/system/backup', [AdminSystemController::class, 'importBK']);

      Route::post('/colors', [AdminSystemColorController::class, 'save']);

      Route::post('/role-has-menus', [RoleHasMenuController::class, 'save']);

  Route::post('/boolean-limits', [AdminGeneralController::class, 'saveBooleanLimits']);

      Route::get('/system/fetch-remote-changes', [AdminSystemController::class, 'fetchRemoteChanges']);
      Route::get('/system/has-remote-changes', [AdminSystemController::class, 'hasRemoteChanges']);
    });

    Route::post('/repository', [AdminRepositoryController::class, 'save']);
    Route::post('/repository/paginate', [AdminRepositoryController::class, 'paginate']);
    Route::delete('/repository/{id}', [AdminRepositoryController::class, 'delete']);

    Route::post('/settings', [AdminSettingController::class, 'save']);
    Route::post('/settings/paginate', [AdminSettingController::class, 'paginate']);
    Route::patch('/settings/status', [AdminSettingController::class, 'status']);
    Route::delete('/settings/{id}', [AdminSettingController::class, 'delete']);

    Route::post('/generals', [AdminGeneralController::class, 'save']);
    Route::post('/generals/paginate', [AdminGeneralController::class, 'paginate']);
    Route::post('/generals/visibility', [AdminGeneralController::class, 'updateVisibility']);
    Route::patch('/generals/status', [AdminGeneralController::class, 'status']);
    Route::patch('/generals/{field}', [AdminGeneralController::class, 'boolean']);
    Route::delete('/generals/{id}', [AdminGeneralController::class, 'delete']);



    Route::patch('/account/email', [AdminAccountController::class, 'email']);
    Route::patch('/account/password', [AdminAccountController::class, 'password']);
  });

  Route::middleware('can:Customer')->prefix('customer')->group(function () {

    Route::get('/sales/{id}', [CustomerSaleController::class, 'get']);
    Route::post('/sales', [CustomerSaleController::class, 'save']);
    Route::post('/sales/paginate', [CustomerSaleController::class, 'paginate']);
    Route::patch('/sales/status', [CustomerSaleController::class, 'status']);
    Route::patch('/sales/{field}', [CustomerSaleController::class, 'boolean']);
    Route::delete('/sales/{id}', [CustomerSaleController::class, 'delete']);
  });
});

// TEST: Verificar claves RSA de Culqi (ELIMINAR EN PRODUCCIÓN)
Route::get('/test-culqi-keys', function () {
    return response()->json([
        'public_key' => \App\Helpers\CulqiConfig::getPublicKey(),
        'rsa_id' => \App\Helpers\CulqiConfig::getRsaId(),
        'rsa_public_key' => \App\Helpers\CulqiConfig::getRsaPublicKey(),
        'rsa_public_key_length' => strlen(\App\Helpers\CulqiConfig::getRsaPublicKey() ?? ''),
        'has_newlines' => strpos(\App\Helpers\CulqiConfig::getRsaPublicKey() ?? '', "\n") !== false,
    ]);
});
