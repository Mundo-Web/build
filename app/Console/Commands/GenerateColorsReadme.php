<?php

namespace App\Console\Commands;

use App\Models\SystemColor;
use Illuminate\Console\Command;

class GenerateColorsReadme extends Command
{
    protected $signature = 'generate:colors-readme';
    protected $description = 'Genera un README con todos los colores del sistema desde la base de datos';

    public function handle()
    {
        $this->info('🎨 Generando README de colores del sistema...');

        $colors = SystemColor::orderBy('name')->get();

        if ($colors->isEmpty()) {
            $this->error('❌ No se encontraron colores en la base de datos.');
            return 1;
        }

        $readme = $this->generateReadmeContent($colors);
        
        $filePath = base_path('COLORS_SYSTEM.md');
        file_put_contents($filePath, $readme);

        $this->info("✅ README generado exitosamente en: {$filePath}");
        $this->info("📊 Total de colores: {$colors->count()}");
        
        // Mostrar preview en consola
        $this->newLine();
        $this->info('📋 Colores disponibles:');
        $this->table(
            ['Nombre', 'Código de Color'],
            $colors->map(fn($color) => [$color->name, $color->description])->toArray()
        );

        return 0;
    }

    private function generateReadmeContent($colors)
    {
        $content = "# 🎨 Sistema de Colores - La Petaca\n\n";
        $content .= "Este documento describe todos los colores disponibles en el sistema, extraídos directamente de la base de datos.\n\n";
        $content .= "**Última actualización:** " . now()->format('d/m/Y H:i:s') . "\n\n";
        $content .= "---\n\n";

        $content .= "## 📊 Colores Disponibles\n\n";
        $content .= "Total: **{$colors->count()} colores**\n\n";

        foreach ($colors as $color) {
            $content .= $this->generateColorSection($color);
        }

        $content .= "\n---\n\n";
        $content .= "## 💡 Uso de Colores en el Código\n\n";
        $content .= $this->generateUsageSection();

        $content .= "\n---\n\n";
        $content .= "## 🔧 Clases CSS Personalizadas\n\n";
        $content .= $this->generateCSSClassesSection($colors);

        $content .= "\n---\n\n";
        $content .= "## ⚡ Regenerar este README\n\n";
        $content .= "Para actualizar este documento con los colores más recientes de la base de datos:\n\n";
        $content .= "```bash\n";
        $content .= "php artisan generate:colors-readme\n";
        $content .= "```\n\n";
        $content .= "---\n\n";
        $content .= "*Generado automáticamente por el sistema La Petaca Backend*\n";

        return $content;
    }

    private function generateColorSection($color)
    {
        $section = "### `{$color->name}`\n\n";
        
        // Color swatch visual (usando emoji y código)
        $section .= "**Código:** `{$color->description}`\n\n";
        
        // Preview visual (HTML inline para GitHub)
        $colorValue = $color->description;
        $section .= "<div style='background: {$colorValue}; padding: 20px; border-radius: 8px; margin: 10px 0;'></div>\n\n";
        
        // Ejemplos de uso
        $section .= "**Uso en React/JSX:**\n";
        $section .= "```jsx\n";
        $section .= "// Fondo\n";
        $section .= "<div className=\"bg-{$color->name}\">Contenido</div>\n\n";
        $section .= "// Texto\n";
        $section .= "<span className=\"customtext-{$color->name}\">Texto</span>\n\n";
        $section .= "// Borde\n";
        $section .= "<div className=\"border-{$color->name}\">Con borde</div>\n";
        $section .= "```\n\n";

        return $section;
    }

    private function generateUsageSection()
    {
        $usage = "### Textos\n\n";
        $usage .= "Para aplicar color a textos, usa la clase `customtext-{color-name}`:\n\n";
        $usage .= "```jsx\n";
        $usage .= "<h1 className=\"customtext-primary\">Título principal</h1>\n";
        $usage .= "<p className=\"customtext-secondary\">Párrafo secundario</p>\n";
        $usage .= "```\n\n";

        $usage .= "### Fondos\n\n";
        $usage .= "Para aplicar color de fondo, usa la clase `bg-{color-name}`:\n\n";
        $usage .= "```jsx\n";
        $usage .= "<div className=\"bg-primary\">Contenido con fondo</div>\n";
        $usage .= "<section className=\"bg-sections-color\">Sección</section>\n";
        $usage .= "```\n\n";

        $usage .= "### Bordes\n\n";
        $usage .= "Para aplicar color a bordes, usa la clase `border-{color-name}`:\n\n";
        $usage .= "```jsx\n";
        $usage .= "<div className=\"border border-primary\">Con borde</div>\n";
        $usage .= "```\n\n";

        $usage .= "### Estados Hover\n\n";
        $usage .= "```jsx\n";
        $usage .= "<button className=\"hover:bg-primary hover:customtext-white\">\n";
        $usage .= "  Botón con hover\n";
        $usage .= "</button>\n";
        $usage .= "```\n\n";

        return $usage;
    }

    private function generateCSSClassesSection($colors)
    {
        $section = "El sistema genera automáticamente las siguientes clases CSS para cada color:\n\n";
        
        $section .= "| Tipo | Clase | Ejemplo |\n";
        $section .= "|------|-------|----------|\n";
        $section .= "| Fondo | `bg-{color}` | `bg-primary` |\n";
        $section .= "| Texto | `customtext-{color}` | `customtext-secondary` |\n";
        $section .= "| Borde | `border-{color}` | `border-primary` |\n";
        $section .= "| Hover Fondo | `hover:bg-{color}` | `hover:bg-primary` |\n";
        $section .= "| Hover Texto | `hover:customtext-{color}` | `hover:customtext-secondary` |\n";
        $section .= "| Hover Borde | `hover:border-{color}` | `hover:border-primary` |\n";
        $section .= "| Active | `active:bg-{color}` | `active:bg-primary` |\n";
        $section .= "| Fill SVG | `fill-{color}` | `fill-primary` |\n";
        $section .= "| Stroke SVG | `stroke-{color}` | `stroke-secondary` |\n\n";

        $section .= "### ⚠️ Importante\n\n";
        $section .= "- ❌ **NO usar**: `text-primary` o `text-secondary` (no existen en Tailwind)\n";
        $section .= "- ✅ **SÍ usar**: `customtext-primary` o `customtext-secondary`\n";
        $section .= "- Los colores estándar de Tailwind como `text-white`, `text-gray-400`, etc. funcionan normalmente\n\n";

        $section .= "### Colores Disponibles Actualmente\n\n";
        $section .= "```\n";
        foreach ($colors as $color) {
            $section .= "- {$color->name}\n";
        }
        $section .= "```\n\n";

        return $section;
    }
}
