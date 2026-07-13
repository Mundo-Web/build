@php
$component = Route::currentRouteName();
$currentUrl = request()->url();
$isCheckout = ($page->correlative ?? '') === 'checkout' || 
              ($page->component ?? '') === 'checkout' || 
              (str_contains($currentUrl, '/checkout') && !str_contains($currentUrl, '/admin'));
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
        $pageDescription = $item->meta_description ?? strip_tags($item->summary ?? $item->description ?? '');
        if (empty($pageDescription)) { $pageDescription = $generals->where('correlative', 'site_description')->first()?->description ?? ''; }
        $pageKeywords = $item->meta_keywords ?? '';
        $modelClass = get_class($item);
        $modelSimpleName = str_replace('App\\Models\\', '', $modelClass);
        $snake_case = Illuminate\Support\Str::snake($modelSimpleName);
        if ($snake_case === 'item_image') { $snake_case = 'item'; }
        $pageImageRaw = $item->image ? asset("storage/images/{$snake_case}/{$item->image}") : ($generals->where('correlative', 'og_image')->first()?->description ?? '');
        $pageImage = $pageImageRaw ? (filter_var($pageImageRaw, FILTER_VALIDATE_URL) ? $pageImageRaw : asset('assets/resources/' . $pageImageRaw)) : '';
        $pageUrl = $item->canonical_url ?? url()->current();
        $pageAuthor = (isset($item->author) && $item->author) ? $item->author : ($generals->where('correlative', 'meta_author')->first()?->description ?? 'Powered by Mundo Web');

        $ogTitle = $pageTitle;
        $ogDescription = $pageDescription;
        $ogImage = $pageImage;
        $ogUrl = $pageUrl;
        $twitterTitle = $pageTitle;
        $twitterDescription = $pageDescription;
        $twitterImage = $pageImage;
        $twitterCard = 'summary_large_image';
        $canonicalUrl = $pageUrl;
        $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? config('app.name', 'Mundo Web');
    } else {
        $siteTitle = $generals->where('correlative', 'site_title')->first()?->description ?? config('app.name', 'Mundo Web');
        $siteDescription = $generals->where('correlative', 'site_description')->first()?->description ?? '';
        $siteKeywords = $generals->where('correlative', 'site_keywords')->first()?->description ?? '';
        $pageTitle = $data['name'] ?? $siteTitle;
        $pageDescription = $data['description'] ?? $siteDescription;
        $pageKeywords = isset($data['keywords']) ? implode(', ', $data['keywords']) : $siteKeywords;
        $pageAuthor = $generals->where('correlative', 'meta_author')->first()?->description ?? 'Powered by Mundo Web';

        $ogTitle = $generals->where('correlative', 'og_title')->first()?->description ?? $pageTitle;
        $ogDescription = $generals->where('correlative', 'og_description')->first()?->description ?? $pageDescription;
        
        $ogImageRaw = $generals->where('correlative', 'og_image')->first()?->description;
        $ogImage = $ogImageRaw ? (filter_var($ogImageRaw, FILTER_VALIDATE_URL) ? $ogImageRaw : asset('assets/resources/' . $ogImageRaw)) : '';
        
        $ogUrl = $generals->where('correlative', 'og_url')->first()?->description ?? url()->current();

        $twitterTitle = $generals->where('correlative', 'twitter_title')->first()?->description ?? $ogTitle;
        $twitterDescription = $generals->where('correlative', 'twitter_description')->first()?->description ?? $ogDescription;
        
        $twitterImageRaw = $generals->where('correlative', 'twitter_image')->first()?->description;
        $twitterImage = $twitterImageRaw ? (filter_var($twitterImageRaw, FILTER_VALIDATE_URL) ? $twitterImageRaw : asset('assets/resources/' . $twitterImageRaw)) : $ogImage;
        
        $twitterCard = $generals->where('correlative', 'twitter_card')->first()?->description ?? 'summary_large_image';
        $canonicalUrl = $generals->where('correlative', 'canonical_url')->first()?->description ?? url()->current();
    }
    $twitterSite = $generals->where('correlative', 'twitter_site')->first()?->description ?? '@rainstarstore';
    $twitterCreator = $generals->where('correlative', 'twitter_creator')->first()?->description ?? '@rainstarstore';

    // FAQs para schema FAQPage (global en todas las páginas)
    $globalFaqs = \Illuminate\Support\Facades\Cache::remember('global_faqs_blade', 3600, function () {
        return \App\Models\Faq::where('status', true)->get(['question', 'answer']);
    });
    @endphp

    @php
    $version = config('app.version', '1.0.1');
    @endphp

    <title><?php echo $pageTitle; ?> | <?php echo $siteTitle; ?></title>

    @php
    $siteName = config('app.name', 'Mundo Web');
    $logoUrl = asset('assets/resources/logo.png');

    // Schema Organization & WebSite
    $isEcommerce = trim($generals->where('correlative', 'is_ecommerce')->first()?->description ?? 'false') === 'true';
    $searchEnabled = (data_get($data, 'search_enabled') == true || data_get($data, 'search_enabled') == 'true');
    $searchPattern = data_get($data, 'search_pattern') ?? '/catalogo?q={search_term_string}';

    // Graph Construction
    $graph = [
        [
            "@type" => "Organization",
            "@id" => url('/'),
            "name" => $siteName,
            "url" => url('/'),
            "logo" => [
                "@type" => "ImageObject",
                "url" => $logoUrl
            ],
            "sameAs" => array_filter([
                $generals->where('correlative', 'facebook')->first()?->description,
                $generals->where('correlative', 'instagram')->first()?->description,
                $generals->where('correlative', 'twitter')->first()?->description,
                $generals->where('correlative', 'linkedin')->first()?->description,
            ])
        ],
        [
            "@type" => "WebSite",
            "@id" => url('/#website'),
            "name" => $siteName,
            "url" => url('/'),
            "publisher" => ["@id" => url('/')]
        ]
    ];

    // Search Action (Only for Home and if enabled)
    if ($isEcommerce && $searchEnabled) {
        $searchUrl = rtrim(url('/'), '/') . (str_starts_with($searchPattern, '/') ? '' : '/') . $searchPattern;
        $graph[1]["potentialAction"] = [
            "@type" => "SearchAction",
            "target" => [
                "@type" => "EntryPoint",
                "urlTemplate" => $searchUrl
            ],
            "query-input" => "required name=search_term_string"
        ];
    }

    // Details/Article/Product
    if ($isDetailPage && isset($item)) {
        if ($modelName === 'Post') {
            $graph[] = [
                "@type" => "NewsArticle",
                "headline" => $pageTitle,
                "description" => $pageDescription,
                "image" => $pageImage,
                "datePublished" => $item->created_at ? $item->created_at->toIso8601String() : null,
                "dateModified" => $item->updated_at ? $item->updated_at->toIso8601String() : null,
                "author" => [
                    "@type" => "Organization",
                    "name" => $item->author ?? $siteName
                ],
                "publisher" => ["@id" => url('/')],
                "mainEntityOfPage" => [
                    "@type" => "WebPage",
                    "@id" => url()->current()
                ]
            ];
        } elseif ($modelName === 'Item') {
            $graph[] = [
                "@type" => "Product",
                "name" => $item->name,
                "image" => $pageImage,
                "description" => $pageDescription,
                "sku" => $item->sku ?? $item->id,
                "brand" => [
                    "@type" => "Brand",
                    "name" => $item->brand->name ?? $siteName
                ],
                "offers" => [
                    "@type" => "Offer",
                    "url" => url()->current(),
                    "priceCurrency" => "PEN",
                    "price" => $item->final_price ?? $item->price ?? 0,
                    "availability" => ($item->stock > 0 || !$item->sold_out) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                ]
            ];
        }
    }

    // Breadcrumbs
    $breadcrumbs = [
        [
            "@type" => "ListItem",
            "position" => 1,
            "name" => "Inicio",
            "item" => url('/')
        ]
    ];

    if ($isDetailPage && isset($item)) {
        if ($modelName === 'Post') {
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 2,
                "name" => "Blogs",
                "item" => url('/blogs')
            ];
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 3,
                "name" => $item->name,
                "item" => url()->current()
            ];
        } elseif ($modelName === 'Item') {
            $breadcrumbs[] = [
                "@type" => "ListItem",
                "position" => 2,
                "name" => "Catálogo",
                "item" => url('/catalogo')
            ];
            if (isset($item->category) && $item->category) {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $item->category->name,
                    "item" => url('/catalogo?category=' . $item->category->id)
                ];
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 4,
                    "name" => $item->name,
                    "item" => url()->current()
                ];
            } else {
                $breadcrumbs[] = [
                    "@type" => "ListItem",
                    "position" => 3,
                    "name" => $item->name,
                    "item" => url()->current()
                ];
            }
        }
    } elseif (isset($data['name']) && $data['name'] !== $siteTitle) {
         $breadcrumbs[] = [
            "@type" => "ListItem",
            "position" => 2,
            "name" => $data['name'],
            "item" => url()->current()
        ];
    }

    if (count($breadcrumbs) > 1) {
        $graph[] = [
            "@type" => "BreadcrumbList",
            "itemListElement" => $breadcrumbs
        ];
    }
    @endphp

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": {!! json_encode($graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
    }
    </script>

    @php
    // FAQs para schema: usar FAQs del producto en páginas de detalle si existen, sino globales
    $faqsToRender = collect([]);
    if ($isDetailPage && isset($item) && $modelName === 'Item') {
        $productFaqs = $item->faqs ?? null;
        if (!empty($productFaqs) && is_array($productFaqs)) {
            $faqsToRender = collect($productFaqs)->filter(fn($f) => !empty($f['question']) && !empty($f['answer']));
        }
    }
    // Fallback: FAQs globales si no hay específicos
    if ($faqsToRender->isEmpty()) {
        $faqsToRender = $globalFaqs->map(fn($f) => ['question' => $f->question, 'answer' => $f->answer]);
    }
    @endphp
    @if($faqsToRender->isNotEmpty())
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": <?php
            $faqEntities = $faqsToRender->map(function ($faq) {
                return [
                    '@type' => 'Question',
                    'name' => $faq['question'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => strip_tags($faq['answer'] ?? '')
                    ]
                ];
            })->values()->all();
            echo json_encode($faqEntities, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        ?>
    }
    </script>
    @endif
    <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ $version }}" type="image/png">
    <link rel="preload" href="/assets/resources/logo.png?v={{ $version }}" as="image" type="image/png">
    
    @if(isset($data['firstActiveSliderImage']) && $data['firstActiveSliderImage'])
    <link rel="preload" as="image" href="/storage/images/slider/{{ $data['firstActiveSliderImage'] }}" fetchpriority="high" media="(min-width: 768px)">
    @endif
    @if(isset($data['firstActiveSliderImageMobile']) && $data['firstActiveSliderImageMobile'])
    <link rel="preload" as="image" href="/storage/images/slider/{{ $data['firstActiveSliderImageMobile'] }}" fetchpriority="high" media="(max-width: 767px)">
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <meta name="title" content="<?php echo $pageTitle; ?>">
    <meta name="description" content="<?php echo $pageDescription; ?>">
    @if($pageKeywords)
    <meta name="keywords" content="<?php echo $pageKeywords; ?>">
    @endif
    <meta name="author" content="<?php echo htmlspecialchars($pageAuthor, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="canonical" href="<?php echo $canonicalUrl; ?>">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="<?php echo $isDetailPage ? 'article' : 'website'; ?>">
    <meta property="og:url" content="<?php echo $ogUrl; ?>">
    <meta property="og:title" content="<?php echo $ogTitle; ?>">
    <meta property="og:description" content="<?php echo $ogDescription; ?>">
    <meta property="og:image" content="<?php echo $ogImage; ?>">
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

    <meta name="twitter:card" content="<?php echo $twitterCard; ?>">
    <meta name="twitter:url" content="<?php echo $ogUrl; ?>">
    <meta name="twitter:title" content="<?php echo $twitterTitle; ?>">
    <meta name="twitter:description" content="<?php echo $twitterDescription; ?>">
    @if($twitterImage)
    <meta name="twitter:image" content="<?php echo $twitterImage; ?>"> @endif
    <meta name="twitter:site" content="<?php echo $twitterSite; ?>">
    <meta name="twitter:creator" content="<?php echo $twitterCreator; ?>">
    <meta name="twitter:domain" content="<?php echo request()->getHost(); ?>">

    <link rel="preload" href="/lte/assets/libs/select2/css/select2.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="/lte/assets/libs/select2/css/select2.min.css" media="print" onload="this.media='all'">
    </noscript>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" media="print" onload="this.media='all'">

    <!-- Google Fonts Combinadas y Asincronas -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Noto+Color+Emoji&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,300..700;1,300..700&family=Rajdhani:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Noto+Color+Emoji&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:ital,wght@0,300..700;1,300..700&family=Rajdhani:wght@300;400;500;600;700&display=swap">
    </noscript>

    <!-- Pixel injection is handled by InjectPixelsMiddleware with cache -->
    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] !== 'true')
    @php
        $titleFontUrl = $data['fonts']['title']['url'];
        if (strpos($titleFontUrl, 'fonts.googleapis.com') !== false && strpos($titleFontUrl, 'display=swap') === false) {
            $titleFontUrl .= (strpos($titleFontUrl, '?') !== false ? '&' : '?') . 'display=swap';
        }
    @endphp
    <link rel="preload" href="<?php echo $titleFontUrl; ?>" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="<?php echo $titleFontUrl; ?>">
    </noscript>
    @endif

    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] !== 'true')
    @php
        $paragraphFontUrl = $data['fonts']['paragraph']['url'];
        if (strpos($paragraphFontUrl, 'fonts.googleapis.com') !== false && strpos($paragraphFontUrl, 'display=swap') === false) {
            $paragraphFontUrl .= (strpos($paragraphFontUrl, '?') !== false ? '&' : '?') . 'display=swap';
        }
    @endphp
    <link rel="preload" href="<?php echo $paragraphFontUrl; ?>" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="<?php echo $paragraphFontUrl; ?>">
    </noscript>
    @endif

    <script src="/lte/assets/libs/moment/min/moment.min.js"></script>
    <script src="/lte/assets/libs/moment/moment-timezone.js"></script>
    <script src="/lte/assets/libs/moment/locale/es.js"></script>

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
            background-image: var(--bg-<?php echo $color->name; ?>) !important;
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
    @if($isCheckout)
    <script src="/lte/assets/js/vendor.min.js?v=<?php echo $version; ?>" defer></script>
    @endif

    @php
    $appColorPrimary = $data['colors']->firstWhere('name', 'primary')?->description ?? '#000000';
    @endphp
    <script type="text/javascript">
        window.APP_URL = "{{url('/')}}";
        window.APP_COLOR_PRIMARY = "<?php echo $appColorPrimary; ?>";
        window.APP_NAME = "<?php echo config('app.name', 'Mi Empresa'); ?>";
    </script>

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

    @if($isCheckout)
    <script src="/lte/assets/libs/select2/js/select2.full.min.js?v=<?php echo $version; ?>" defer></script>
    @endif
 
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