@php
    $route = Route::currentRouteName();
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>@yield('title') | {{ env('APP_NAME', 'Base Template') }}</title>
    <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ uniqid() }}" type="image/png">

    <meta name="csrf_token" content="{{ csrf_token() }}">

    <link href="/lte/assets/libs/mohithg-switchery/switchery.min.css" rel="stylesheet" type="text/css" />
    <link href="/lte/assets/libs/select2/css/select2.min.css" rel="stylesheet" type="text/css" />

    {{-- QuillJs Styles --}}
    <link href="/lte/assets/libs/quill/quill.snow.css" rel="stylesheet" type="text/css" />
    <link href="/lte/assets/libs/quill/quill.bubble.css" rel="stylesheet" type="text/css" />

    <script src="/lte/assets/libs/exceljs/exceljs.min.js"></script>
    <script src="/lte/assets/libs/filesaver/FileSaver.min.js"></script>
    <script src="/lte/assets/libs/jszip//jszip.min.js"></script>

    {{-- DxDataGrid Styles --}}
    <link href="/lte/assets/libs/dxdatagrid/css/dx.light.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
        rel="stylesheet" type="text/css" id="dg-default-stylesheet" />
    <link href="/lte/assets/libs/dxdatagrid/css/dx.dark.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
        rel="stylesheet" type="text/css" id="dg-dark-stylesheet" disabled="disabled" />

    {{-- Bootstrap Styles --}}
    <link href="/lte/assets/css/config/default/bootstrap.min.css" rel="stylesheet" type="text/css"
        id="bs-default-stylesheet" />
    <link href="/lte/assets/css/config/default/bootstrap-dark.min.css" rel="stylesheet" type="text/css"
        id="bs-dark-stylesheet" disabled="disabled" />

    {{-- App Styles --}}
    <link href="/lte/assets/css/config/default/app.css" rel="stylesheet" type="text/css" id="app-default-stylesheet" />
    <link href="/lte/assets/css/config/default/app-dark.css" rel="stylesheet" type="text/css" id="app-dark-stylesheet"
        disabled="disabled" />

    {{-- Icons --}}
    <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />

    @yield('head-content')
</head>

<body class="left-side-menu-dark">
    @yield('content')

    <!-- jQuery -->
    <script src="/lte/assets/libs/jquery/jquery.min.js"></script>
    <script src="/lte/assets/libs/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="/lte/assets/libs/simplebar/simplebar.min.js"></script>
    <script src="/lte/assets/libs/node-waves/waves.min.js"></script>
    <script src="/lte/assets/libs/waypoints/waypoints.min.js"></script>
    <script src="/lte/assets/libs/jquery.counterup/jquery.counterup.min.js"></script>

    {{-- SweetAlert2 --}}
    <script src="/lte/assets/libs/sweetalert2/sweetalert2.min.js"></script>

    {{-- Select 2 --}}
    <script src="/lte/assets/libs/select2/js/select2.min.js"></script>

    {{-- Switchery --}}
    <script src="/lte/assets/libs/mohithg-switchery/switchery.min.js"></script>

    {{-- QuillJs Scripts --}}
    <script src="/lte/assets/libs/quill/quill.min.js"></script>

    {{-- DxDataGrid Scripts --}}
    <script src="/lte/assets/libs/dxdatagrid/js/dx.all.js"></script>

    {{-- App Scripts --}}
    <script src="/lte/assets/js/app.min.js"></script>

    @yield('scripts')
</body>

</html>
