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
    @endphp

    <title>{{ $data['name'] ?? $ogTitle ?? $siteTitle }} | {{ env('APP_NAME', 'Base Template') }}</title>

    <!-- Favicon -->
      <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ uniqid() }}" type="image/png">

    <!-- Preload recursos críticos -->
    <link rel="preload" href="/assets/resources/logo.png" as="image" type="image/png">
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="dns-prefetch" href="//cdn.tailwindcss.com">

    <!-- Meta básicas -->
    <meta name="description" content="{{ $data['description'] ?? $ogDescription ?? $siteDescription }}">
    @if($siteKeywords || (isset($data['keywords']) && $data['keywords']))
        <meta name="keywords" content="{{ isset($data['keywords']) ? implode(', ', $data['keywords']) : $siteKeywords }}">
    @endif
    <meta name="author" content="Powered by Mundo Web">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{ $canonicalUrl }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $ogUrl }}">
    <meta property="og:title" content="{{ $ogTitle }}">
    <meta property="og:description" content="{{ $ogDescription }}">
    @if($ogImage)
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
    @endif
    <meta property="og:site_name" content="{{ $siteTitle }}">

    <!-- Twitter -->
    <meta property="twitter:card" content="{{ $twitterCard }}">
    <meta property="twitter:url" content="{{ $ogUrl }}">
    <meta property="twitter:title" content="{{ $twitterTitle }}">
    <meta property="twitter:description" content="{{ $twitterDescription }}">
    @if($twitterImage)
        <meta property="twitter:image" content="{{ $twitterImage }}">
    @endif

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
    
    @php
        $pixelScripts = App\Helpers\PixelHelper::getPixelScripts();
    @endphp
    
    {!! $pixelScripts['head'] !!}

    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] !== 'true')
        <link rel="stylesheet" href="{{ $data['fonts']['title']['url'] }}">
    @endif

    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] !== 'true')
        <link rel="stylesheet" href="{{ $data['fonts']['paragraph']['url'] }}">
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

            .ql-editor * {
                /* color: #475569; */
            }

            .ql-editor img {
                border-radius: 8px;
            }
        </style>
    @endif
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

    @if ($data['fonts']['title']['url'] && $data['fonts']['title']['source'] == 'true')
        <style>
            @font-face {
                font-family: "{{ $data['fonts']['title']['name'] }}";
                src: url('{{ $data['fonts']['title']['url'] }}') format('woff2');
            }
        </style>
    @endif
    @if ($data['fonts']['title']['name'])
        <style>
            .font-title {
                font-family: "{{ $data['fonts']['title']['name'] }}", sans-serif;
            }
        </style>
    @endif
    @if ($data['fonts']['paragraph']['url'] && $data['fonts']['paragraph']['source'] == 'true')
        <style>
            @font-face {
                font-family: "{{ $data['fonts']['paragraph']['name'] }}";
                src: url('{{ $data['fonts']['paragraph']['url'] }}') format('woff2');
            }
        </style>
    @endif
    @if ($data['fonts']['paragraph']['name'])
        <style>
            * {
                font-family: "{{ $data['fonts']['paragraph']['name'] }}", sans-serif;
            }
        </style>
    @endif
    @foreach ($data['colors'] as $color)
        <style>
            /* Variables CSS para Tailwind */
            :root {
                --bg-{{ $color->name }}: {{ $color->description }};
            }
            
            /* Clases customtext-* para migración gradual */
            .customtext-{{ $color->name }} {
                color: {{ $color->description }};
            }
            .hover\:customtext-{{ $color->name }}:hover {
                color: {{ $color->description }};
            }
            .active\:customtext-{{ $color->name }}:active {
                color: {{ $color->description }};
            }
            .placeholder\:customtext-{{ $color->name }}::placeholder {
                color: {{ $color->description }};
            }
        </style>
    @endforeach

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

@php
    $bodyCustomHtml = $generals->where('correlative', 'body_custom_html')->first()?->description ?? '';
@endphp
<body class="font-paragraph relative" style="background: var(--bg-page-background);">
    @if($bodyCustomHtml)
        {!! $bodyCustomHtml !!}
    @endif
    <!-- Loading Screen Nativo (aparece ANTES de que React cargue) -->
  
    <div id="native-loader" style="position:fixed;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;background:var(--bg-page-background);z-index:9999;transition:opacity 0.5s ease-out,visibility 0.5s ease-out;">
        <style>
            @keyframes pulse-loader{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(0.98)}}
            #native-loader img{animation:pulse-loader 2s ease-in-out infinite}
        </style>
        <div style="position:relative;">
            <div style="position:absolute;inset:0;margin:-2rem;border-radius:50%;opacity:0.05;animation:pulse-loader 2s ease-in-out infinite;"></div>
            <img src="/assets/resources/loading.png?v={{ uniqid() }}" alt="Cargando..." style="width:300px;max-width:80vw;height:auto;position:relative;" onerror="this.src='/assets/resources/logo.png?v={{ uniqid() }}';this.style.background='white';this.style.padding='0.5rem';this.style.borderRadius='8px';">
        </div>
    </div>
    <script>
        (function(){
            window.addEventListener('load',function(){
                setTimeout(function(){
                    var loader=document.getElementById('native-loader');
                    if(loader){loader.style.opacity='0';loader.style.visibility='hidden';}
                    setTimeout(function(){if(loader&&loader.parentNode)loader.parentNode.removeChild(loader);},500);
                },300);
            });
        })();
    </script>

    @php
        $pixelScripts = App\Helpers\PixelHelper::getPixelScripts();
    @endphp
    
    {!! $pixelScripts['body'] !!}

    @inertia

    <!-- Vendor js (diferido para no bloquear) -->
    <script src="/lte/assets/js/vendor.min.js" defer></script>

    <!-- Culqi SDK -->
    @php
        $culqiEnabledRaw = $generals->where('correlative', 'checkout_culqi')->first()?->description ?? 'false';
        $culqiEnabled = in_array(strtolower($culqiEnabledRaw), ['true', '1', 'on', 'yes', 'si', 'enabled']);
        $culqiPublicKey = $generals->where('correlative', 'checkout_culqi_public_key')->first()?->description ?? '';
        $culqiRsaId = $generals->where('correlative', 'checkout_culqi_rsa_id')->first()?->description ?? '';
        $culqiRsaPublicKey = $generals->where('correlative', 'checkout_culqi_rsa_public_key')->first()?->description ?? '';
    @endphp
    @if($culqiEnabled && $culqiPublicKey)
        <script type="text/javascript" src="https://js.culqi.com/checkout-js"></script>
        <script type="text/javascript">
            // Configurar Culqi globalmente ANTES de que React se monte
            window.CULQI_PUBLIC_KEY = "{{ $culqiPublicKey }}";
            window.CULQI_ENABLED = true;
            @if($culqiRsaId && $culqiRsaPublicKey)
            window.CULQI_RSA_ID = "{{ $culqiRsaId }}";
            window.CULQI_RSA_PUBLIC_KEY = `{{ $culqiRsaPublicKey }}`;
            @endif
            
            // Log de configuración (solo desarrollo)
            console.log("✅ Culqi configurado:", {
                publicKey: window.CULQI_PUBLIC_KEY ? window.CULQI_PUBLIC_KEY.substring(0, 8) + "..." : "N/A",
                hasRSA: !!(window.CULQI_RSA_ID && window.CULQI_RSA_PUBLIC_KEY),
                checkoutReady: typeof CulqiCheckout !== 'undefined'
            });
        </script>
    @else
        <script type="text/javascript">
            window.CULQI_ENABLED = false;
            console.log("⚠️ Culqi no está configurado correctamente:", {
                enabledRaw: "{{ $culqiEnabledRaw ?? 'undefined' }}",
                enabled: {{ isset($culqiEnabled) && $culqiEnabled ? 'true' : 'false' }},
                hasPublicKey: {{ isset($culqiPublicKey) && $culqiPublicKey ? 'true' : 'false' }}
            });
        </script>
    @endif

    <!-- OpenPay SDK -->
    @php
        $openpayEnabledRaw = $generals->where('correlative', 'checkout_openpay')->first()?->description ?? 'false';
        // Verificar múltiples formatos: 'true', '1', 'on', 'yes', etc.
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
            // Configurar OpenPay globalmente ANTES de que React se monte
            window.OPENPAY_MERCHANT_ID = "{{ $openpayMerchantId }}";
            window.OPENPAY_PUBLIC_KEY = "{{ $openpayPublicKey }}";
            window.OPENPAY_SANDBOX_MODE = {{ $openpayIsSandbox ? 'true' : 'false' }};
            
            // Log de configuración (solo desarrollo)
            console.log("✅ OpenPay configurado:", {
                merchantId: window.OPENPAY_MERCHANT_ID,
                publicKey: window.OPENPAY_PUBLIC_KEY ? window.OPENPAY_PUBLIC_KEY.substring(0, 8) + "..." : "N/A",
                sandbox: window.OPENPAY_SANDBOX_MODE
            });
        </script>
    @else
        <script type="text/javascript">
            console.log("⚠️ OpenPay no está configurado correctamente:", {
                enabledRaw: "{{ $openpayEnabledRaw }}",
                enabled: {{ $openpayEnabled ? 'true' : 'false' }},
                hasMerchantId: {{ $openpayMerchantId ? 'true' : 'false' }},
                hasPublicKey: {{ $openpayPublicKey ? 'true' : 'false' }},
                merchantId: "{{ $openpayMerchantId ? substr($openpayMerchantId, 0, 5) . '...' : 'VACÍO' }}",
                publicKey: "{{ $openpayPublicKey ? substr($openpayPublicKey, 0, 5) . '...' : 'VACÍO' }}"
            });
        </script>
    @endif

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
