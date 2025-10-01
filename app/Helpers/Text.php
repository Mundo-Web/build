<?php
namespace App\Helpers;

class Text
{
    public static function replaceData($content, $data)
    {
        // Procesar bloques repetibles y condicionales
        foreach ($data as $key => $value) {
            if (is_array($value) && !empty($value)) {
                // Es un array con elementos - bloque repetible
                $content = self::processBlock($content, $key, $value);
            } elseif (is_bool($value)) {
                // Es un booleano - condicional
                $content = self::processConditional($content, $key, $value);
            } elseif (is_string($value) && !empty($value)) {
                // Es un string no vacío - puede ser condicional también
                $content = self::processConditional($content, $key, true);
            } else {
                // Valor vacío o false - remover el bloque condicional
                $content = self::processConditional($content, $key, false);
            }
        }

        // Reemplazar variables simples
        foreach ($data as $key => $value) {
            if (!is_array($value)) {
                $content = str_replace("{{{$key}}}", htmlspecialchars($value), $content);
            }
        }

        return $content;
    }

    protected static function processBlock($content, $blockName, $items)
    {
        $pattern = '/{{#'.$blockName.'}}(.*?){{\/'.$blockName.'}}/s';
        preg_match($pattern, $content, $matches);
        
        if (!$matches) return $content;

        $blockContent = '';
        $template = $matches[1];

        foreach ($items as $item) {
            $processed = $template;
            foreach ($item as $key => $value) {
                $processed = str_replace(
                    "{{{$key}}}", 
                    htmlspecialchars($value), 
                    $processed
                );
            }
            $blockContent .= $processed;
        }

        return str_replace($matches[0], $blockContent, $content);
    }

    protected static function processConditional($content, $blockName, $condition)
    {
        $pattern = '/{{#'.$blockName.'}}(.*?){{\/'.$blockName.'}}/s';
        
        if ($condition) {
            // Si la condición es verdadera, mantener el contenido pero quitar las etiquetas
            $content = preg_replace_callback($pattern, function($matches) {
                return $matches[1];
            }, $content);
        } else {
            // Si la condición es falsa, eliminar todo el bloque
            $content = preg_replace($pattern, '', $content);
        }
        
        return $content;
    }
}