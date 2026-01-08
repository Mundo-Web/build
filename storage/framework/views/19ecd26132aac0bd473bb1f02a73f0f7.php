<?php
    $component = Route::currentRouteName();
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <?php
        // Obtener datos SEO de generals
        $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? env('APP_NAME');
        $siteDescription = $generals->where('correlative', 'site_description')->first()?->description ?? '';
        $siteKeywords = $generals->where('correlative', 'site_keywords')->first()?->description ?? '';
        $ogTitle = $generals->where('correlative', 'og_title')->first()?->description ?? ($data['name'] ?? $siteTitle);
        $ogDescription = $generals->where('correlative', 'og_description')->first()?->description ?? ($data['description'] ?? $siteDescription);
        $ogImage = $generals->where('correlative', 'og_image')->first()?->description ?? '';
        $ogUrl = $generals->where('correlative', 'og_url')->first()?->description ?? url()->current();
        $twitterTitle = $generals->where('correlative', 'twitter_title')->first()?->description ?? $ogTitle;
        $twitterDescription = $generals->where('correlative', 'twitter_description')->first()?->description ?? $ogDescription;
        $twitterImage = $generals->where('correlative', 'twitter_image')->first()?->description ?? $ogImage;
        $twitterCard = $generals->where('correlative', 'twitter_card')->first()?->description ?? 'summary_large_image';
        $canonicalUrl = $generals->where('correlative', 'canonical_url')->first()?->description ?? url()->current();
    ?>

    <title><?php echo e($data['name'] ?? $ogTitle ?? $siteTitle); ?></title>

    <!-- Favicon -->
      <link rel="shortcut icon" href="/assets/resources/icon.png?v=<?php echo e(uniqid()); ?>" type="image/png">

    <!-- Meta básicas -->
    <meta name="description" content="<?php echo e($data['description'] ?? $ogDescription ?? $siteDescription); ?>">
    <?php if($siteKeywords || (isset($data['keywords']) && $data['keywords'])): ?>
        <meta name="keywords" content="<?php echo e(isset($data['keywords']) ? implode(', ', $data['keywords']) : $siteKeywords); ?>">
    <?php endif; ?>
    <meta name="author" content="Powered by Mundo Web">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo e($canonicalUrl); ?>">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo e($ogUrl); ?>">
    <meta property="og:title" content="<?php echo e($ogTitle); ?>">
    <meta property="og:description" content="<?php echo e($ogDescription); ?>">
    <?php if($ogImage): ?>
        <meta property="og:image" content="<?php echo e($ogImage); ?>">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
    <?php endif; ?>
    <meta property="og:site_name" content="<?php echo e($siteTitle); ?>">

    <!-- Twitter -->
    <meta property="twitter:card" content="<?php echo e($twitterCard); ?>">
    <meta property="twitter:url" content="<?php echo e($ogUrl); ?>">
    <meta property="twitter:title" content="<?php echo e($twitterTitle); ?>">
    <meta property="twitter:description" content="<?php echo e($twitterDescription); ?>">
    <?php if($twitterImage): ?>
        <meta property="twitter:image" content="<?php echo e($twitterImage); ?>">
    <?php endif; ?>

    <!-- Carga diferida de select2 CSS -->
    <link rel="preload" href="/lte/assets/libs/select2/css/select2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/lte/assets/libs/select2/css/select2.min.css"></noscript>
    
    <!-- Carga diferida de icons CSS -->
    <link rel="preload" href="/lte/assets/css/icons.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/lte/assets/css/icons.min.css"></noscript>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    

    <link rel="preload" href='https://fonts.googleapis.com/css?family=Poppins' as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href='https://fonts.googleapis.com/css?family=Poppins'></noscript>
    
    
    <!-- Carga diferida de Tailwind CSS -->
    <link rel="preload" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"></noscript>
    
    <script src="https://cdn.tailwindcss.com" defer></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" rel="stylesheet">
    
    <?php
        $pixelScripts = App\Helpers\PixelHelper::getPixelScripts();
    ?>
    
    <?php echo $pixelScripts['head']; ?>


    <?php if($data['fonts']['title']['url'] && $data['fonts']['title']['source'] !== 'true'): ?>
        <link rel="stylesheet" href="<?php echo e($data['fonts']['title']['url']); ?>">
    <?php endif; ?>

    <?php if($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] !== 'true'): ?>
        <link rel="stylesheet" href="<?php echo e($data['fonts']['paragraph']['url']); ?>">
    <?php endif; ?>

    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()]); ?>
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>

    <?php if($component == 'BlogArticle.jsx'): ?>
        <link href="/lte/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" />
        <link href="/lte/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" />
        <style>
            .ql-editor blockquote {
                border-left: 4px solid #f8b62c;
                padding-left: 16px;
            }

            .ql-editor * {
                /* color: #475569; */
            }

            .ql-editor img {
                border-radius: 8px;
            }
        </style>
    <?php endif; ?>
    <style>
        body {
            /* background-image: url('/assets/img/maqueta/home-mobile.png');*/
            width: 100%;
            height: auto;
            background-size: 100% auto;
            background-repeat: no-repeat;
            /* Asegura que la imagen no se repita */
            background-position: top center;
            /* Centra la imagen en la parte superior */
        }
    </style>

    <?php if($data['fonts']['title']['url'] && $data['fonts']['title']['source'] == 'true'): ?>
        <style>
            @font-face {
                font-family: "<?php echo e($data['fonts']['title']['name']); ?>";
                src: url('<?php echo e($data['fonts']['title']['url']); ?>') format('woff2');
            }
        </style>
    <?php endif; ?>
    <?php if($data['fonts']['title']['name']): ?>
        <style>
            .font-title {
                font-family: "<?php echo e($data['fonts']['title']['name']); ?>", sans-serif;
            }
        </style>
    <?php endif; ?>
    <?php if($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] == 'true'): ?>
        <style>
            @font-face {
                font-family: "<?php echo e($data['fonts']['paragraph']['name']); ?>";
                src: url('<?php echo e($data['fonts']['paragraph']['url']); ?>') format('woff2');
            }
        </style>
    <?php endif; ?>
    <?php if($data['fonts']['paragraph']['name']): ?>
        <style>
            * {
                font-family: "<?php echo e($data['fonts']['paragraph']['name']); ?>", sans-serif;
            }
        </style>
    <?php endif; ?>
    <?php $__currentLoopData = $data['colors']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $color): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <style>
            /* Variables CSS para Tailwind */
            :root {
                --bg-<?php echo e($color->name); ?>: <?php echo e($color->description); ?>;
            }
            
            /* Clases customtext-* para migración gradual */
            .customtext-<?php echo e($color->name); ?> {
                color: <?php echo e($color->description); ?>;
            }
            .hover\:customtext-<?php echo e($color->name); ?>:hover {
                color: <?php echo e($color->description); ?>;
            }
            .active\:customtext-<?php echo e($color->name); ?>:active {
                color: <?php echo e($color->description); ?>;
            }
            .placeholder\:customtext-<?php echo e($color->name); ?>::placeholder {
                color: <?php echo e($color->description); ?>;
            }
        </style>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

    <style>
        .font-emoji {
            font-family: "Noto Color Emoji", sans-serif;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            top: 50%;
            transform: translateY(-50%);
        }
    </style>
    
</head>

<body class="font-general">
    <?php
        $pixelScripts = App\Helpers\PixelHelper::getPixelScripts();
    ?>
    
    <?php echo $pixelScripts['body']; ?>


    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>

    

    <!-- Vendor js -->
    <script src="/lte/assets/js/vendor.min.js" defer></script>

    <!-- Culqi Custom Checkout v4 -->
    <script src="https://js.culqi.com/checkout-js"></script>
    <!-- Culqi 3DS para autenticación segura -->
    <script src="https://3ds.culqi.com" defer></script>

    <!-- OpenPay SDK -->
    <?php
        $openpayEnabledRaw = $generals->where('correlative', 'checkout_openpay')->first()?->description ?? 'false';
        // Verificar múltiples formatos: 'true', '1', 'on', 'yes', etc.
        $openpayEnabled = in_array(strtolower($openpayEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
        $openpayMerchantId = $generals->where('correlative', 'checkout_openpay_merchant_id')->first()?->description ?? '';
        $openpayPublicKey = $generals->where('correlative', 'checkout_openpay_public_key')->first()?->description ?? '';
    ?>
    <?php if($openpayEnabled && $openpayMerchantId && $openpayPublicKey): ?>
        <script type="text/javascript" src="https://js.openpay.pe/openpay.v1.min.js"></script>
        <script type="text/javascript" src="https://js.openpay.pe/openpay-data.v1.min.js"></script>
        <script type="text/javascript">
            // Configurar OpenPay globalmente ANTES de que React se monte
            window.OPENPAY_MERCHANT_ID = "<?php echo e($openpayMerchantId); ?>";
            window.OPENPAY_PUBLIC_KEY = "<?php echo e($openpayPublicKey); ?>";
            window.OPENPAY_SANDBOX_MODE = true; // Cambiar a false en producción
            
            // Log de configuración (solo desarrollo)
            console.log("✅ OpenPay configurado:", {
                merchantId: window.OPENPAY_MERCHANT_ID,
                publicKey: window.OPENPAY_PUBLIC_KEY ? window.OPENPAY_PUBLIC_KEY.substring(0, 8) + "..." : "N/A",
                sandbox: window.OPENPAY_SANDBOX_MODE
            });
        </script>
    <?php else: ?>
        <script type="text/javascript">
            console.warn("⚠️ OpenPay no está configurado correctamente:", {
                enabledRaw: "<?php echo e($openpayEnabledRaw); ?>",
                enabled: <?php echo e($openpayEnabled ? 'true' : 'false'); ?>,
                hasMerchantId: <?php echo e($openpayMerchantId ? 'true' : 'false'); ?>,
                hasPublicKey: <?php echo e($openpayPublicKey ? 'true' : 'false'); ?>,
                merchantId: "<?php echo e($openpayMerchantId ? substr($openpayMerchantId, 0, 5) . '...' : 'VACÍO'); ?>",
                publicKey: "<?php echo e($openpayPublicKey ? substr($openpayPublicKey, 0, 5) . '...' : 'VACÍO'); ?>"
            });
        </script>
    <?php endif; ?>

    <script src="/lte/assets/libs/select2/js/select2.full.min.js" defer></script>    <!-- App js -->
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js" defer></script>
    <script src="/lte/assets/libs/moment/min/moment.min.js" defer></script>
    <script src="/lte/assets/libs/moment/moment-timezone.js" defer></script>
    <script src="/lte/assets/libs/moment/locale/es.js" defer></script>
    <script src="/lte/assets/libs/quill/quill.min.js" defer></script>
    
    <!-- Ecommerce Tracking System -->
    <script src="/assets/js/ecommerce-tracker.js" defer></script>
    <script>
        document.addEventListener('click', function(event) {
            const target = event.target;

            if (target.tagName === 'BUTTON' && target.hasAttribute('href')) {
                const href = target.getAttribute('href');

                if (target.getAttribute('target') === '_blank') {
                    window.open(href, '_blank');
                } else {
                    location.href = href;
                }
            }
        });
    </script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
            
            if ('IntersectionObserver' in window) {
                let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            let lazyImage = entry.target;
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove('lazy');
                            lazyImageObserver.unobserve(lazyImage);
                        }
                    });
                });
                
                lazyImages.forEach(function(lazyImage) {
                    lazyImageObserver.observe(lazyImage);
                });
            }

            // document.body.removeChild(document.getElementById('page-loader'))
        });
    </script>

</body>

</html>
<?php /**PATH C:\xampp\htdocs\projects\lapetaca_backend\resources\views/public.blade.php ENDPATH**/ ?>