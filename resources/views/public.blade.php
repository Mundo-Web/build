@php
$component = Route::currentRouteName();
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    @php
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
    @endphp

    @php
    $version = env('APP_VERSION', '1.0.1');
    @endphp

    <title><?php echo $pageTitle; ?> | <?php echo env('APP_NAME', 'Base Template'); ?></title>
    <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ $version }}" type="image/png">
    <link rel="preload" href="/assets/resources/logo.png?v={{ $version }}" as="image" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <meta name="description" content="<?php echo $pageDescription; ?>">
    @if($pageKeywords)
    <meta name="keywords" content="<?php echo $pageKeywords; ?>"> @endif
    <meta name="author" content="Powered by Mundo Web">
    <link rel="canonical" href="<?php echo $canonicalUrl; ?>">

    <meta name="title" content="<?php echo $ogTitle ?? ($generals['meta_title']->description ?? 'Hostal La Petaca'); ?>">
    <meta name="description" content="<?php echo $ogDescription ?? ($generals['meta_description']->description ?? ''); ?>">
    <meta name="keywords" content="<?php echo $generals['meta_keywords']->description ?? ''; ?>">

    <meta property="og:type" content="<?php echo $isDetailPage ? 'article' : 'website'; ?>">
    <meta property="og:url" content="<?php echo $ogUrl; ?>">
    <meta property="og:title" content="<?php echo $ogTitle ?? ($generals['og_title']->description ?? 'Hostal La Petaca'); ?>">
    <meta property="og:description" content="<?php echo $ogDescription ?? ($generals['meta_description']->description ?? ''); ?>">
    <meta property="og:image" content="<?php echo $ogImage ?? ($generals['og_image']->description ?? ''); ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="<?php echo $siteTitle; ?>">

    @if($isDetailPage && isset($item))
    @if($item->created_at)
    <meta property="article:published_time" content="<?php echo $item->created_at; ?>"> @endif
    @if($item->updated_at)
    <meta property="article:modified_time" content="<?php echo $item->updated_at; ?>"> @endif
    @if($item->category)
    <meta property="article:section" content="<?php echo $item->category->name; ?>"> @endif
    @if($item->tags && count($item->tags) > 0)
    @foreach($item->tags as $tag)
    <meta property="article:tag" content="<?php echo $tag->name; ?>"> @endforeach
    @endif
    @endif

    <meta property="twitter:card" content="<?php echo $twitterCard; ?>">
    <meta property="twitter:url" content="<?php echo $ogUrl; ?>">
    <meta property="twitter:title" content="<?php echo $twitterTitle; ?>">
    <meta property="twitter:description" content="<?php echo $twitterDescription; ?>">
    @if($twitterImage)
    <meta property="twitter:image" content="<?php echo $twitterImage; ?>"> @endif

    <link rel="preload" href="/lte/assets/libs/select2/css/select2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="/lte/assets/libs/select2/css/select2.min.css" media="print" onload="this.media='all'">
    </noscript>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">

    <link rel="preload" href='https://fonts.googleapis.com/css?family=Poppins' as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href='https://fonts.googleapis.com/css?family=Poppins'>
    </noscript>


    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap" rel="stylesheet">

    <!-- Pixel injection is handled by InjectPixelsMiddleware with cache -->
    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] !== 'true')
    <link rel="stylesheet" href="<?php echo $data['fonts']['title']['url']; ?>">
    @endif

    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] !== 'true')
    <link rel="stylesheet" href="<?php echo $data['fonts']['paragraph']['url']; ?>">
    @endif

    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
    @inertiaHead

    @if ($component == 'BlogArticle.jsx')
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
    @endif
    <style>
        body {
            width: 100%;
            height: auto;
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: top center;
        }
    </style>

    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] == 'true')
    <style>
        @font-face {
            font-family: "<?php echo $data['fonts']['title']['name']; ?>";
            src: url('<?php echo $data['fonts']['title']['url']; ?>') format('woff2');
        }
    </style>
    @endif
    @if ($data['fonts']['title']['name'])
    <style>
        .font-title {
            font-family: "<?php echo $data['fonts']['title']['name']; ?>", sans-serif;
        }
    </style>
    @endif
    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] == 'true')
    <style>
        @font-face {
            font-family: "<?php echo $data['fonts']['paragraph']['name']; ?>";
            src: url('<?php echo $data['fonts']['paragraph']['url']; ?>') format('woff2');
        }
    </style>
    @endif
    @if ($data['fonts']['paragraph']['name'])
    <style>
        * {
            font-family: "<?php echo $data['fonts']['paragraph']['name']; ?>", sans-serif;
        }
    </style>
    @endif

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

@php $bodyCustomHtml = $generals->where('correlative', 'body_custom_html')->first()?->description ?? ''; @endphp

@php $appColorPrimary = $data['colors']->firstWhere('name', 'primary')?->description ?? '#000000'; @endphp

<body class="font-paragraph relative" style="background: var(--bg-page-background);">
    @if($bodyCustomHtml) {!! $bodyCustomHtml !!} @endif

    <div id="native-loader" style="position:fixed;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;background:var(--bg-page-background);z-index:9999;transition:opacity 0.5s ease-out,visibility 0.5s ease-out;">
        <style>
            @keyframes spin-loader {
                0% {
                    transform: rotate(0deg);
                }

                100% {
                    transform: rotate(360deg);
                }
            }

            @keyframes pulse-loader {
                0% {
                    transform: scale(0.95);
                    opacity: 0.2;
                }

                50% {
                    transform: scale(1.05);
                    opacity: 0.1;
                }

                100% {
                    transform: scale(0.95);
                    opacity: 0.2;
                }
            }
        </style>
        <div style="position:relative; display: flex; flex-direction: column; align-items: center;">
            <img src="/assets/resources/loading.png?v=<?php echo $version; ?>" alt="Logo" style="width:300px;max-width: 80vw;height:auto;opacity:0.8;" onError="this.onerror=null;this.src='/assets/resources/logo.png';" loading="eager">
        </div>
    </div>
    <script>
        (function() {
            window.addEventListener('load', function() {
                var loader = document.getElementById('native-loader');
                if (loader) {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    setTimeout(function() {
                        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
                    }, 200);
                }
            });
        })();
    </script>

    @inertia
    <script src="/lte/assets/js/vendor.min.js?v=<?php echo $version; ?>" defer></script>

    @php $appColorPrimary = $data['colors']->firstWhere('name', 'primary')?->description ?? '#000000'; @endphp
    <script type="text/javascript">
        window.APP_URL = "{{url('/')}}";
        window.APP_COLOR_PRIMARY = "<?php echo $appColorPrimary; ?>";
        window.APP_NAME = "<?php echo env('APP_NAME', 'Mi Empresa'); ?>";
    </script>

    @php
    $isCheckout = ($page->correlative ?? '') === 'checkout' || ($page->component ?? '') === 'checkout';
    @endphp

    @if($isCheckout)
    @php
    $culqiEnabledRaw = $generals->where('correlative', 'checkout_culqi')->first()?->description ?? 'false';
    $culqiEnabled = in_array(strtolower($culqiEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
    $culqiPublicKey = $generals->where('correlative', 'checkout_culqi_public_key')->first()?->description ?? '';
    $culqiRsaId = $generals->where('correlative', 'checkout_culqi_rsa_id')->first()?->description ?? '';
    $culqiRsaPublicKey = $generals->where('correlative', 'checkout_culqi_rsa_public_key')->first()?->description ?? '';
    @endphp
    @if($culqiEnabled && $culqiPublicKey)
    <script type="text/javascript" src="https://js.culqi.com/3ds-js"></script>
    <script type="text/javascript" src="https://js.culqi.com/checkout-js"></script>
    <script type="text/javascript">
        window.CULQI_PUBLIC_KEY = "<?php echo $culqiPublicKey; ?>";
        window.CULQI_ENABLED = true;
        @if($culqiRsaId && $culqiRsaPublicKey)
        window.CULQI_RSA_ID = "<?php echo $culqiRsaId; ?>";
        window.CULQI_RSA_PUBLIC_KEY = `<?php echo $culqiRsaPublicKey; ?>`;
        @endif
    </script>
    @else
    <script type="text/javascript">
        window.CULQI_ENABLED = false;
    </script>
    @endif

    @php
    $openpayEnabledRaw = $generals->where('correlative', 'checkout_openpay')->first()?->description ?? 'false';
    $openpayEnabled = in_array(strtolower($openpayEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
    $openpayMerchantId = $generals->where('correlative', 'checkout_openpay_merchant_id')->first()?->description ?? '';
    $openpayPublicKey = $generals->where('correlative', 'checkout_openpay_public_key')->first()?->description ?? '';
    $openpayIsSandbox = $generals->where('correlative', 'checkout_openpay_sandbox_mode')->first()?->description ?? 'false';
    $openpayIsSandbox = in_array(strtolower($openpayIsSandbox), ['true', '1', 'on', 'yes', 'si']);
    @endphp
    @if($openpayEnabled && $openpayMerchantId && $openpayPublicKey)
    <script type="text/javascript" src="https://js.openpay.pe/openpay.v1.min.js"></script>
    <script type="text/javascript" src="https://js.openpay.pe/openpay-data.v1.min.js"></script>
    <script type="text/javascript">
        window.OPENPAY_MERCHANT_ID = "<?php echo $openpayMerchantId; ?>";
        window.OPENPAY_PUBLIC_KEY = "<?php echo $openpayPublicKey; ?>";
        window.OPENPAY_SANDBOX_MODE = <?php echo $openpayIsSandbox ? 'true' : 'false'; ?>;
    </script>
    @endif
    @else
    <script type="text/javascript">
        window.CULQI_ENABLED = false;
    </script>
    @endif

    <script src="/lte/assets/js/select2.full.min.js?v=<?php echo $version; ?>" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js" defer></script>
    <script src="/lte/assets/libs/quill/quill.min.js?v=<?php echo $version; ?>" defer></script>

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

</html>