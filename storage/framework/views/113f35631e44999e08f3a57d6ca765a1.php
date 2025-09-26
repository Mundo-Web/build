<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banner Preview</title>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: white;
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <div id="banner-preview-container">
        <!-- El banner se renderizará aquí con React -->
    </div>

    <script>
        window.bannerPreviewData = <?php echo json_encode($bannerData, 15, 512) ?>;
        console.log('Banner data:', window.bannerPreviewData);
    </script>
    
    <?php echo app('Illuminate\Foundation\Vite')('resources/js/banner-preview.jsx'); ?>
</body>
</html><?php /**PATH C:\xampp\htdocs\projects\jireh_sport\resources\views/admin/banner-preview.blade.php ENDPATH**/ ?>