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
    $isDetailPage = isset($data['using']['slug']) && is_array($data['using']['slug']) && isset($data['using']['slug']['model']);
    $modelName = $isDetailPage ? $data['using']['slug']['model'] : null;
    $item = null;
    if ($isDetailPage && isset($data[$modelName]) && $data[$modelName]) { $item = $data[$modelName]; }

    if ($item) {
    $pageTitle = $item->meta_title ?? $item->name;
    $pageDescription = $item->meta_description ?? strip_tags($item->summary ?? '');
    $pageKeywords = $item->meta_keywords ?? '';
    $modelClass = get_class($item);
    $snake_case = Illuminate\Support\Str::snake(str_replace('App\\Models\\', '', $modelClass));
    if ($snake_case === 'item_image') { $snake_case = 'item'; }
    $pageImage = $item->image ? asset("storage/images/{$snake_case}/{$item->image}") : '';
    $pageUrl = $item->canonical_url ?? url()->current();

    $ogTitle = $pageTitle; $ogDescription = $pageDescription; $ogImage = $pageImage; $ogUrl = $pageUrl;
    $twitterTitle = $pageTitle; $twitterDescription = $pageDescription; $twitterImage = $pageImage;
    $twitterCard = 'summary_large_image'; $canonicalUrl = $pageUrl;
    $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? env('APP_NAME');
    } else {
    $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? env('APP_NAME');
    $siteDescription = $generals->where('correlative', 'site_description')->first()?->description ?? '';
    $siteKeywords = $generals->where('correlative', 'site_keywords')->first()?->description ?? '';
    $pageTitle = $data['name'] ?? $siteTitle;
    $pageDescription = $data['description'] ?? $siteDescription;
    $pageKeywords = isset($data['keywords']) ? implode(', ', $data['keywords']) : $siteKeywords;

    $ogTitle = $generals->where('correlative', 'og_title')->first()?->description ?? $pageTitle;
    $ogDescription = $generals->where('correlative', 'og_description')->first()?->description ?? $pageDescription;
    $ogImage = $generals->where('correlative', 'og_image')->first()?->description ?? '';
    $ogUrl = $generals->where('correlative', 'og_url')->first()?->description ?? url()->current();

    $twitterTitle = $generals->where('correlative', 'twitter_title')->first()?->description ?? $ogTitle;
    $twitterDescription = $generals->where('correlative', 'twitter_description')->first()?->description ?? $ogDescription;
    $twitterImage = $generals->where('correlative', 'twitter_image')->first()?->description ?? $ogImage;
    $twitterCard = $generals->where('correlative', 'twitter_card')->first()?->description ?? 'summary_large_image';
    $canonicalUrl = $generals->where('correlative', 'canonical_url')->first()?->description ?? url()->current();
    }
    ?>

    <title><?php echo $pageTitle; ?> | <?php echo env('APP_NAME', 'Base Template'); ?></title>
    <link rel="shortcut icon" href="/assets/resources/icon.png?v=<?php echo uniqid(); ?>" type="image/png">
    <link rel="preload" href="/assets/resources/logo.png" as="image" type="image/png">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="dns-prefetch" href="//cdn.tailwindcss.com">

    <meta name="description" content="<?php echo $pageDescription; ?>">
    <?php if($pageKeywords): ?>
    <meta name="keywords" content="<?php echo $pageKeywords; ?>"> <?php endif; ?>
    <meta name="author" content="Powered by Mundo Web">
    <link rel="canonical" href="<?php echo $canonicalUrl; ?>">

    <meta property="og:type" content="<?php echo $isDetailPage ? 'article' : 'website'; ?>">
    <meta property="og:url" content="<?php echo $ogUrl; ?>">
    <meta property="og:title" content="<?php echo $ogTitle; ?>">
    <meta property="og:description" content="<?php echo $ogDescription; ?>">
    <?php if($ogImage): ?>
    <meta property="og:image" content="<?php echo $ogImage; ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <?php endif; ?>
    <meta property="og:site_name" content="<?php echo $siteTitle; ?>">

    <?php if($isDetailPage && $item): ?>
    <?php if($item->created_at): ?>
    <meta property="article:published_time" content="<?php echo $item->created_at; ?>"> <?php endif; ?>
    <?php if($item->updated_at): ?>
    <meta property="article:modified_time" content="<?php echo $item->updated_at; ?>"> <?php endif; ?>
    <?php if($item->category): ?>
    <meta property="article:section" content="<?php echo $item->category->name; ?>"> <?php endif; ?>
    <?php if($item->tags && count($item->tags) > 0): ?>
    <?php $__currentLoopData = $item->tags; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tag): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <meta property="article:tag" content="<?php echo $tag->name; ?>"> <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    <?php endif; ?>
    <?php endif; ?>

    <meta property="twitter:card" content="<?php echo $twitterCard; ?>">
    <meta property="twitter:url" content="<?php echo $ogUrl; ?>">
    <meta property="twitter:title" content="<?php echo $twitterTitle; ?>">
    <meta property="twitter:description" content="<?php echo $twitterDescription; ?>">
    <?php if($twitterImage): ?>
    <meta property="twitter:image" content="<?php echo $twitterImage; ?>"> <?php endif; ?>

    <link rel="preload" href="/lte/assets/libs/select2/css/select2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="/lte/assets/libs/select2/css/select2.min.css">
    </noscript>

    <link rel="preload" href="/lte/assets/css/icons.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="/lte/assets/css/icons.min.css">
    </noscript>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link rel="preload" href='https://fonts.googleapis.com/css?family=Poppins' as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href='https://fonts.googleapis.com/css?family=Poppins'>
    </noscript>

    <link rel="preload" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
    </noscript>

    <script src="https://cdn.tailwindcss.com" defer></script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" rel="stylesheet">

    <?php $pixelScripts = App\Helpers\PixelHelper::getPixelScripts(); ?>
    <?php echo $pixelScripts['head']; ?>


    <?php if($data['fonts']['title']['url'] && $data['fonts']['title']['source'] !== 'true'): ?>
    <link rel="stylesheet" href="<?php echo $data['fonts']['title']['url']; ?>">
    <?php endif; ?>

    <?php if($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] !== 'true'): ?>
    <link rel="stylesheet" href="<?php echo $data['fonts']['paragraph']['url']; ?>">
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

        .ql-editor img {
            border-radius: 8px;
        }
    </style>
    <?php endif; ?>
    <style>
        body {
            width: 100%;
            height: auto;
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: top center;
        }
    </style>

    <?php if($data['fonts']['title']['url'] && $data['fonts']['title']['source'] == 'true'): ?>
    <style>
        @font-face {
            font-family: "<?php echo $data['fonts']['title']['name']; ?>";
            src: url('<?php echo $data['fonts']['title']['url']; ?>') format('woff2');
        }
    </style>
    <?php endif; ?>
    <?php if($data['fonts']['title']['name']): ?>
    <style>
        .font-title {
            font-family: "<?php echo $data['fonts']['title']['name']; ?>", sans-serif;
        }
    </style>
    <?php endif; ?>
    <?php if($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] == 'true'): ?>
    <style>
        @font-face {
            font-family: "<?php echo $data['fonts']['paragraph']['name']; ?>";
            src: url('<?php echo $data['fonts']['paragraph']['url']; ?>') format('woff2');
        }
    </style>
    <?php endif; ?>
    <?php if($data['fonts']['paragraph']['name']): ?>
    <style>
        * {
            font-family: "<?php echo $data['fonts']['paragraph']['name']; ?>", sans-serif;
        }
    </style>
    <?php endif; ?>

    <style>
        /* CSS Variables - Using PHP Echo to avoid Blade formatter issues */
        :root {
            <?php foreach ($data['colors'] as $color): ?>--bg-<?php echo $color->name; ?>: <?php echo $color->description; ?>;
            <?php endforeach; ?>
        }

        /* Classes and Overrides */
        <?php foreach ($data['colors'] as $color): ?><?php if ($color->name === 'bg_primary_gradient' && !empty($color->description)): ?>.bg-primary {
            background: var(--bg-<?php echo $color->name; ?>) !important;
        }

        <?php endif; ?>.customtext-<?php echo $color->name; ?> {
            color: <?php echo $color->description; ?>;
        }

        .hover\:customtext-<?php echo $color->name; ?>:hover {
            color: <?php echo $color->description; ?>;
        }

        .active\:customtext-<?php echo $color->name; ?>:active {
            color: <?php echo $color->description; ?>;
        }

        .placeholder\:customtext-<?php echo $color->name; ?>::placeholder {
            color: <?php echo $color->description; ?>;
        }

        <?php endforeach; ?>.font-emoji {
            font-family: "Noto Color Emoji", sans-serif;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            top: 50%;
            transform: translateY(-50%);
        }
    </style>

</head>

<?php $bodyCustomHtml = $generals->where('correlative', 'body_custom_html')->first()?->description ?? ''; ?>

<body class="font-paragraph relative" style="background: var(--bg-page-background);">
    <?php if($bodyCustomHtml): ?> <?php echo $bodyCustomHtml; ?> <?php endif; ?>

    <div id="native-loader" style="position:fixed;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;background:var(--bg-page-background);z-index:9999;transition:opacity 0.5s ease-out,visibility 0.5s ease-out;">
        <style>
            @keyframes pulse-loader {

                0%,
                100% {
                    opacity: 1;
                    transform: scale(1)
                }

                50% {
                    opacity: 0.7;
                    transform: scale(0.98)
                }
            }

            #native-loader img {
                animation: pulse-loader 2s ease-in-out infinite
            }
        </style>
        <div style="position:relative;">
            <div style="position:absolute;inset:0;margin:-2rem;border-radius:50%;opacity:0.05;animation:pulse-loader 2s ease-in-out infinite;"></div>
            <img src="/assets/resources/loading.png?v=<?php echo uniqid(); ?>" alt="Cargando..." style="width:300px;max-width:80vw;height:auto;position:relative;" onerror="this.src='/assets/resources/logo.png?v=<?php echo uniqid(); ?>';this.style.background='white';this.style.padding='0.5rem';this.style.borderRadius='8px';">
        </div>
    </div>
    <script>
        (function() {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    var loader = document.getElementById('native-loader');
                    if (loader) {
                        loader.style.opacity = '0';
                        loader.style.visibility = 'hidden';
                    }
                    setTimeout(function() {
                        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
                    }, 500);
                }, 300);
            });
        })();
    </script>

    <?php echo $pixelScripts['body']; ?>

    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
    <script src="/lte/assets/js/vendor.min.js" defer></script>

    <?php $appColorPrimary = $data['colors']->firstWhere('name', 'primary')?->description ?? '#000000'; ?>
    <script type="text/javascript">
        window.APP_URL = "<?php echo e(url('/')); ?>";
        window.APP_COLOR_PRIMARY = "<?php echo $appColorPrimary; ?>";
        window.APP_NAME = "<?php echo env('APP_NAME', 'Mi Empresa'); ?>";
    </script>

    <?php
    $culqiEnabledRaw = $generals->where('correlative', 'checkout_culqi')->first()?->description ?? 'false';
    $culqiEnabled = in_array(strtolower($culqiEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
    $culqiPublicKey = $generals->where('correlative', 'checkout_culqi_public_key')->first()?->description ?? '';
    $culqiRsaId = $generals->where('correlative', 'checkout_culqi_rsa_id')->first()?->description ?? '';
    $culqiRsaPublicKey = $generals->where('correlative', 'checkout_culqi_rsa_public_key')->first()?->description ?? '';
    ?>
    <?php if($culqiEnabled && $culqiPublicKey): ?>
    <script type="text/javascript" src="https://js.culqi.com/checkout-js"></script>
    <script type="text/javascript">
        window.CULQI_PUBLIC_KEY = "<?php echo $culqiPublicKey; ?>";
        window.CULQI_ENABLED = true;
        <?php if($culqiRsaId && $culqiRsaPublicKey): ?>
        window.CULQI_RSA_ID = "<?php echo $culqiRsaId; ?>";
        window.CULQI_RSA_PUBLIC_KEY = `<?php echo $culqiRsaPublicKey; ?>`;
        <?php endif; ?>
        console.log("✅ Culqi configurado");
    </script>
    <?php else: ?>
    <script type="text/javascript">
        window.CULQI_ENABLED = false;
    </script>
    <?php endif; ?>

    <?php
    $openpayEnabledRaw = $generals->where('correlative', 'checkout_openpay')->first()?->description ?? 'false';
    $openpayEnabled = in_array(strtolower($openpayEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
    $openpayMerchantId = $generals->where('correlative', 'checkout_openpay_merchant_id')->first()?->description ?? '';
    $openpayPublicKey = $generals->where('correlative', 'checkout_openpay_public_key')->first()?->description ?? '';
    $openpayIsSandbox = $generals->where('correlative', 'checkout_openpay_sandbox_mode')->first()?->description ?? 'false';
    $openpayIsSandbox = in_array(strtolower($openpayIsSandbox), ['true', '1', 'on', 'yes', 'si']);
    ?>
    <?php if($openpayEnabled && $openpayMerchantId && $openpayPublicKey): ?>
    <script type="text/javascript" src="https://js.openpay.pe/openpay.v1.min.js"></script>
    <script type="text/javascript" src="https://js.openpay.pe/openpay-data.v1.min.js"></script>
    <script type="text/javascript">
        window.OPENPAY_MERCHANT_ID = "<?php echo $openpayMerchantId; ?>";
        window.OPENPAY_PUBLIC_KEY = "<?php echo $openpayPublicKey; ?>";
        window.OPENPAY_SANDBOX_MODE = <?php echo $openpayIsSandbox ? 'true' : 'false'; ?>;
        console.log("✅ OpenPay configurado");
    </script>
    <?php else: ?>
    <script type="text/javascript">
        console.log("⚠️ OpenPay no está configurado");
    </script>
    <?php endif; ?>

    <script src="/lte/assets/libs/select2/js/select2.full.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js" defer></script>
    <script src="/lte/assets/libs/moment/min/moment.min.js" defer></script>
    <script src="/lte/assets/libs/moment/moment-timezone.js" defer></script>
    <script src="/lte/assets/libs/moment/locale/es.js" defer></script>
    <script src="/lte/assets/libs/quill/quill.min.js" defer></script>

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
        });
    </script>
</body>

</html><?php /**PATH C:\xampp\htdocs\projects\cadmo\resources\views/public.blade.php ENDPATH**/ ?>