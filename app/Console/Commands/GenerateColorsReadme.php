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
        $content = "# Sistema de Colores Dinámicos\n\n";
        $content .= "## Descripción General\n\n";
        $content .= "Este proyecto implementa un sistema de gestión de colores totalmente dinámico que permite:\n";
        $content .= "- ✅ Administrar colores desde la base de datos (panel admin)\n";
        $content .= "- ✅ Aplicar colores en tiempo real sin recompilar CSS\n";
        $content .= "- ✅ Usar colores con **todas** las utilidades de Tailwind CSS\n";
        $content .= "- ✅ Sistema transparente: defines el color en DB, usas el nombre en Tailwind\n\n";
        $content .= "**Última actualización:** " . now()->format('d/m/Y H:i:s') . "\n\n";
        $content .= "---\n\n";

        $content .= "## 🎨 Colores Disponibles\n\n";
        $content .= "Total: **{$colors->count()} colores**\n\n";
        $content .= "| Color | Código | Preview |\n";
        $content .= "|-------|--------|----------|\n";
        foreach ($colors as $color) {
            $content .= "| `{$color->name}` | `{$color->description}` | ![{$color->name}](https://via.placeholder.com/100x30/{$this->hexToUrl($color->description)}/000000?text=+) |\n";
        }
        $content .= "\n---\n\n";

        $content .= "## 📋 Cómo Funciona\n\n";
        $content .= $this->generateHowItWorksSection();

        $content .= "\n---\n\n";
        $content .= "## 🚀 Uso en Componentes React/JSX\n\n";
        $content .= $this->generateUsageSection($colors);

        $content .= "\n---\n\n";
        $content .= "## 🎯 Propiedades Disponibles\n\n";
        $content .= $this->generatePropertiesSection();

        $content .= "\n---\n\n";
        $content .= "## 🔧 Agregar Nuevos Colores\n\n";
        $content .= $this->generateAddColorSection();

        $content .= "\n---\n\n";
        $content .= "## 🎓 Best Practices\n\n";
        $content .= $this->generateBestPracticesSection();

        $content .= "\n---\n\n";
        $content .= "## ⚡ Regenerar este README\n\n";
        $content .= "Para actualizar este documento con los colores más recientes de la base de datos:\n\n";
        $content .= "```bash\n";
        $content .= "php artisan generate:colors-readme\n";
        $content .= "```\n\n";
        $content .= "---\n\n";
        $content .= "*Generado automáticamente por el sistema*\n";

        return $content;
    }

    private function hexToUrl($hex)
    {
        return str_replace('#', '', $hex);
    }

    private function generateHowItWorksSection()
    {
        $section = "### 1. Base de Datos\n";
        $section .= "Los colores se almacenan en la tabla `generals` con:\n";
        $section .= "```sql\n";
        $section .= "name: 'primary'\n";
        $section .= "description: '#003087' -- Código hexadecimal del color\n";
        $section .= "```\n\n";

        $section .= "### 2. Generación de Variables CSS (Backend)\n";
        $section .= "En `public.blade.php`, Laravel genera automáticamente variables CSS:\n\n";
        $section .= "```php\n";
        $section .= "@foreach (\$data['colors'] as \$color)\n";
        $section .= "    <style>\n";
        $section .= "        :root {\n";
        $section .= "            --bg-{{ \$color->name }}: {{ \$color->description }};\n";
        $section .= "        }\n";
        $section .= "    </style>\n";
        $section .= "@endforeach\n";
        $section .= "```\n\n";

        $section .= "### 3. Configuración de Tailwind\n";
        $section .= "En `tailwind.config.js`, los colores se mapean a variables CSS:\n\n";
        $section .= "```javascript\n";
        $section .= "theme: {\n";
        $section .= "    extend: {\n";
        $section .= "        colors: {\n";
        $section .= "            primary: 'var(--bg-primary)',\n";
        $section .= "            secondary: 'var(--bg-secondary)',\n";
        $section .= "            // ...\n";
        $section .= "        }\n";
        $section .= "    }\n";
        $section .= "}\n";
        $section .= "```\n\n";

        $section .= "### 4. Uso Directo en Componentes\n";
        $section .= "**¡Eso es todo!** Ahora solo usa las clases normales de Tailwind con el nombre del color:\n\n";
        $section .= "```jsx\n";
        $section .= "// Define el color \"primary\" como #003087 en la DB\n";
        $section .= "// Úsalo directamente en cualquier clase Tailwind\n";
        $section .= "<div className=\"bg-primary text-white\">\n";
        $section .= "  Color desde la base de datos\n";
        $section .= "</div>\n";
        $section .= "```\n\n";

        return $section;
    }

    private function generateUsageSection($colors)
    {
        $usage = "### Regla Simple\n";
        $usage .= "**Usa las clases normales de Tailwind + nombre del color de la DB**\n\n";
        $usage .= "```jsx\n";
        $usage .= "// Si en la DB tienes un color llamado \"primary\"\n";
        $usage .= "// Puedes usarlo en TODAS las utilidades de Tailwind:\n\n";
        $usage .= "<div className=\"bg-primary\">         {/* Fondo */}\n";
        $usage .= "<h1 className=\"text-primary\">        {/* Texto */}\n";
        $usage .= "<div className=\"border-primary\">     {/* Borde */}\n";
        $usage .= "<div className=\"ring-primary\">       {/* Ring */}\n";
        $usage .= "```\n\n";

        $usage .= "### Ejemplos con Colores Actuales\n\n";
        $firstColor = $colors->first();
        if ($firstColor) {
            $usage .= "```jsx\n";
            $usage .= "// Fondos\n";
            $usage .= "<div className=\"bg-{$firstColor->name}\">Fondo</div>\n\n";
            $usage .= "// Textos\n";
            $usage .= "<h1 className=\"text-{$firstColor->name}\">Título</h1>\n\n";
            $usage .= "// Bordes\n";
            $usage .= "<button className=\"border-2 border-{$firstColor->name}\">Botón</button>\n\n";
            $usage .= "// Estados hover/focus/active\n";
            $usage .= "<button className=\"bg-{$firstColor->name} hover:bg-secondary\">\n";
            $usage .= "  Botón con hover\n";
            $usage .= "</button>\n";
            $usage .= "```\n\n";
        }

        $usage .= "### Ejemplos Avanzados\n\n";
        $usage .= "```jsx\n";
        $usage .= "// Gradientes\n";
        $usage .= "<div className=\"bg-gradient-to-r from-primary via-secondary to-accent\">\n";
        $usage .= "  Gradiente personalizado\n";
        $usage .= "</div>\n\n";
        $usage .= "// Sombras con colores\n";
        $usage .= "<div className=\"shadow-lg shadow-primary/50\">Card con sombra</div>\n\n";
        $usage .= "// Ring/Outline\n";
        $usage .= "<button className=\"ring-2 ring-primary ring-offset-2\">\n";
        $usage .= "  Botón con ring\n";
        $usage .= "</button>\n\n";
        $usage .= "// Group hover\n";
        $usage .= "<div className=\"group\">\n";
        $usage .= "  <div className=\"bg-neutral-light group-hover:bg-primary\">\n";
        $usage .= "    Hover en el padre\n";
        $usage .= "  </div>\n";
        $usage .= "</div>\n";
        $usage .= "```\n\n";

        return $usage;
    }

    private function generatePropertiesSection()
    {
        $section = "Cada color puede usarse con las siguientes propiedades de Tailwind:\n\n";
        
        $section .= "### Backgrounds\n";
        $section .= "```jsx\n";
        $section .= "<div className=\"bg-primary\">Fondo</div>\n";
        $section .= "<div className=\"!bg-primary\">Fondo forzado</div>\n";
        $section .= "<div className=\"hover:bg-primary\">Hover</div>\n";
        $section .= "<div className=\"focus:bg-primary\">Focus</div>\n";
        $section .= "```\n\n";

        $section .= "### Text\n";
        $section .= "```jsx\n";
        $section .= "<p className=\"text-primary\">Texto</p>\n";
        $section .= "<p className=\"hover:text-primary\">Hover</p>\n";
        $section .= "<input className=\"placeholder:text-primary\" />\n";
        $section .= "```\n\n";

        $section .= "### Borders\n";
        $section .= "```jsx\n";
        $section .= "<div className=\"border border-primary\">Borde</div>\n";
        $section .= "<div className=\"border-2 border-primary\">Borde grueso</div>\n";
        $section .= "<div className=\"hover:border-primary\">Hover</div>\n";
        $section .= "```\n\n";

        $section .= "### Ring/Outline\n";
        $section .= "```jsx\n";
        $section .= "<input className=\"ring-2 ring-primary\" />\n";
        $section .= "<button className=\"outline outline-primary\" />\n";
        $section .= "```\n\n";

        $section .= "### Gradientes\n";
        $section .= "```jsx\n";
        $section .= "<div className=\"bg-gradient-to-r from-primary to-secondary\">\n";
        $section .= "<div className=\"bg-gradient-to-b from-primary via-accent to-secondary\">\n";
        $section .= "```\n\n";

        return $section;
    }

    private function generateAddColorSection()
    {
        $section = "### 1. En la Base de Datos (Admin Panel)\n";
        $section .= "Agrega un nuevo registro en la tabla `generals`:\n";
        $section .= "```sql\n";
        $section .= "INSERT INTO generals (correlative, name, description) \n";
        $section .= "VALUES ('color', 'mi-nuevo-color', '#FF5733');\n";
        $section .= "```\n\n";

        $section .= "### 2. En tailwind.config.js\n";
        $section .= "Agrega el nombre del color al array:\n";
        $section .= "```javascript\n";
        $section .= "const colors = [\n";
        $section .= "    'primary', \n";
        $section .= "    'secondary', \n";
        $section .= "    // ...\n";
        $section .= "    'mi-nuevo-color' // ← Agregar aquí\n";
        $section .= "];\n\n";
        $section .= "theme: {\n";
        $section .= "    extend: {\n";
        $section .= "        colors: {\n";
        $section .= "            'mi-nuevo-color': 'var(--bg-mi-nuevo-color)',\n";
        $section .= "        }\n";
        $section .= "    }\n";
        $section .= "}\n";
        $section .= "```\n\n";

        $section .= "### 3. Reiniciar servidor\n";
        $section .= "```bash\n";
        $section .= "npm run dev\n";
        $section .= "```\n\n";

        $section .= "### 4. Usar inmediatamente\n";
        $section .= "```jsx\n";
        $section .= "<div className=\"bg-mi-nuevo-color\">Fondo nuevo</div>\n";
        $section .= "<p className=\"text-mi-nuevo-color\">Texto nuevo</p>\n";
        $section .= "```\n\n";

        return $section;
    }

    private function generateBestPracticesSection()
    {
        $section = "### ✅ Hacer\n";
        $section .= "```jsx\n";
        $section .= "// Usar clases Tailwind normales con nombres de color de la DB\n";
        $section .= "<div className=\"bg-primary text-white\">Correcto</div>\n\n";
        $section .= "// Aprovechar todos los estados de Tailwind\n";
        $section .= "<button className=\"bg-primary hover:bg-secondary focus:ring-2\">\n";
        $section .= "  Botón interactivo\n";
        $section .= "</button>\n";
        $section .= "```\n\n";

        $section .= "### ❌ Evitar\n";
        $section .= "```jsx\n";
        $section .= "// NO hardcodear colores inline\n";
        $section .= "<div style={{backgroundColor: '#003087'}}>Incorrecto</div>\n\n";
        $section .= "// NO usar colores arbitrarios de Tailwind\n";
        $section .= "<div className=\"bg-[#003087]\">Incorrecto</div>\n";
        $section .= "```\n\n";

        $section .= "### 💡 Filosofía del Sistema\n";
        $section .= "**Principio fundamental**: Define una vez en la base de datos, usa en todas partes con Tailwind\n\n";
        $section .= "**Ventajas**:\n";
        $section .= "- 🎨 Cambias el color en el admin, se actualiza toda la aplicación\n";
        $section .= "- 🚀 No necesitas recompilar CSS para cambiar colores\n";
        $section .= "- 🧩 Funciona con TODAS las utilidades de Tailwind\n";
        $section .= "- 📦 Zero configuration en los componentes: solo usa el nombre\n";
        $section .= "- ✨ Totalmente transparente: trabajas como si fueran colores nativos de Tailwind\n\n";

        return $section;
    }

    private function generateColorSection($color)
    {
        // Ya no se usa, pero lo mantenemos por compatibilidad
        return "";
    }

    private function generateCSSClassesSection($colors)
    {
        // Ya no se usa, pero lo mantenemos por compatibilidad
        return "";
    }
}
