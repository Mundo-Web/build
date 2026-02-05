/** @type {import('tailwindcss').Config} */

// Generar safelist dinámico para colores de la DB
const colors = ['page-background','primary', 'secondary', 'accent', 'neutral-light', 'neutral-dark', 'warning', 'info', 'danger', 'success', 'sections-color'];
const colorShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
// Opacidades comunes usadas en Tailwind (5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95)
const opacities = ['5', '10', '15', '20', '25', '30', '40', '50', '60', '70', '75', '80', '90', '95'];
const properties = ['bg', 'text', 'border', 'ring', 'outline', 'shadow'];
const states = ['hover', 'focus', 'active'];

const generateSafelist = () => {
    const safelist = [];
    
    colors.forEach(color => {
        properties.forEach(prop => {
            // Clases base
            safelist.push(`${prop}-${color}`);
            safelist.push(`!${prop}-${color}`);
            
            // Estados (hover, focus, active)
            states.forEach(state => {
                safelist.push(`${state}:${prop}-${color}`);
                safelist.push(`${state}:!${prop}-${color}`);
            });
            
            // Group hover
            safelist.push(`group-hover:${prop}-${color}`);
            
            // Agregar variantes numéricas para todos los colores
            colorShades.forEach(shade => {
                safelist.push(`${prop}-${color}-${shade}`);
                states.forEach(state => {
                    safelist.push(`${state}:${prop}-${color}-${shade}`);
                });
                safelist.push(`group-hover:${prop}-${color}-${shade}`);
                
                // Opacidades para cada shade (ej: bg-primary-500/20)
                opacities.forEach(opacity => {
                    safelist.push(`${prop}-${color}-${shade}/${opacity}`);
                    states.forEach(state => {
                        safelist.push(`${state}:${prop}-${color}-${shade}/${opacity}`);
                    });
                });
            });
            
            // Opacidades para color base (ej: bg-primary/20)
            opacities.forEach(opacity => {
                safelist.push(`${prop}-${color}/${opacity}`);
                states.forEach(state => {
                    safelist.push(`${state}:${prop}-${color}/${opacity}`);
                });
                safelist.push(`group-hover:${prop}-${color}/${opacity}`);
            });
        });
        
        // Extras
        safelist.push(`placeholder:text-${color}`);
        safelist.push(`from-${color}`, `via-${color}`, `to-${color}`);
        safelist.push(`hover:from-${color}`, `hover:via-${color}`, `hover:to-${color}`);
        safelist.push(`divide-${color}`, `caret-${color}`);
        
        // Gradientes con opacidad para color base (ej: from-primary/50)
        opacities.forEach(opacity => {
            safelist.push(`from-${color}/${opacity}`, `via-${color}/${opacity}`, `to-${color}/${opacity}`);
            safelist.push(`hover:from-${color}/${opacity}`, `hover:via-${color}/${opacity}`, `hover:to-${color}/${opacity}`);
        });
        
        // Extras con shades para gradientes (incluyendo estados hover)
        colorShades.forEach(shade => {
            safelist.push(`from-${color}-${shade}`, `via-${color}-${shade}`, `to-${color}-${shade}`);
            safelist.push(`hover:from-${color}-${shade}`, `hover:via-${color}-${shade}`, `hover:to-${color}-${shade}`);
            
            // Gradientes con shade y opacidad (ej: from-secondary-600/50)
            opacities.forEach(opacity => {
                safelist.push(`from-${color}-${shade}/${opacity}`, `via-${color}-${shade}/${opacity}`, `to-${color}-${shade}/${opacity}`);
                safelist.push(`hover:from-${color}-${shade}/${opacity}`, `hover:via-${color}-${shade}/${opacity}`, `hover:to-${color}-${shade}/${opacity}`);
            });
        });
    });
    
    return safelist;
};

// Función helper para generar escala de colores con soporte de opacidad
// Usamos color-mix con transparent para simular opacidades
const generateColorScale = (cssVar) => {
    const scale = {
        DEFAULT: `var(${cssVar})`,
        50: `color-mix(in srgb, var(${cssVar}), white 95%)`,
        100: `color-mix(in srgb, var(${cssVar}), white 90%)`,
        200: `color-mix(in srgb, var(${cssVar}), white 75%)`,
        300: `color-mix(in srgb, var(${cssVar}), white 50%)`,
        400: `color-mix(in srgb, var(${cssVar}), white 25%)`,
        500: `var(${cssVar})`,
        600: `color-mix(in srgb, var(${cssVar}), black 10%)`,
        700: `color-mix(in srgb, var(${cssVar}), black 25%)`,
        800: `color-mix(in srgb, var(${cssVar}), black 40%)`,
        900: `color-mix(in srgb, var(${cssVar}), black 55%)`,
        950: `color-mix(in srgb, var(${cssVar}), black 70%)`,
    };
    
    return scale;
};

// Plugin para agregar utilidades de opacidad con color-mix
const opacityPlugin = require('tailwindcss/plugin');

const colorOpacityPlugin = opacityPlugin(function({ addUtilities, matchUtilities, theme }) {
    const newUtilities = {};
    
    // Generar utilidades de shadow color que funcionen con cualquier tamaño de shadow
    colors.forEach(color => {
        const cssVar = `--bg-${color}`;
        
        // shadow-{color} base
        newUtilities[`.shadow-${color}`] = {
            '--tw-shadow-color': `var(${cssVar}) !important`,
            '--tw-shadow': 'var(--tw-shadow-colored) !important',
        };
        
        // shadow-{color}/{opacity} - color base con opacidad
        opacities.forEach(opacity => {
            const opacityValue = parseInt(opacity);
            newUtilities[`.shadow-${color}\\/${opacity}`] = {
                '--tw-shadow-color': `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent) !important`,
                '--tw-shadow': 'var(--tw-shadow-colored) !important',
            };
        });
        
        // shadow-{color}-{shade}
        colorShades.forEach(shade => {
            let shadeValue;
            if (shade === '500') {
                shadeValue = `var(${cssVar})`;
            } else if (parseInt(shade) < 500) {
                const whiteMix = shade === '50' ? 95 : shade === '100' ? 90 : shade === '200' ? 75 : shade === '300' ? 50 : 25;
                shadeValue = `color-mix(in srgb, var(${cssVar}), white ${whiteMix}%)`;
            } else {
                const blackMix = shade === '600' ? 10 : shade === '700' ? 25 : shade === '800' ? 40 : shade === '900' ? 55 : 70;
                shadeValue = `color-mix(in srgb, var(${cssVar}), black ${blackMix}%)`;
            }
            
            newUtilities[`.shadow-${color}-${shade}`] = {
                '--tw-shadow-color': `${shadeValue} !important`,
                '--tw-shadow': 'var(--tw-shadow-colored) !important',
            };
            
            // shadow-{color}-{shade}/{opacity} - shade con opacidad
            opacities.forEach(opacity => {
                const opacityValue = parseInt(opacity);
                newUtilities[`.shadow-${color}-${shade}\\/${opacity}`] = {
                    '--tw-shadow-color': `color-mix(in srgb, ${shadeValue} ${opacityValue}%, transparent) !important`,
                    '--tw-shadow': 'var(--tw-shadow-colored) !important',
                };
            });
        });
    });
    
    colors.forEach(color => {
        const cssVar = `--bg-${color}`;
        
        // Opacidades para color base
        opacities.forEach(opacity => {
            const opacityValue = parseInt(opacity);
            const transparentPercent = 100 - opacityValue;
            
            // bg-{color}/{opacity}
            newUtilities[`.bg-${color}\\/${opacity}`] = {
                backgroundColor: `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent)`
            };
            
            // text-{color}/{opacity}
            newUtilities[`.text-${color}\\/${opacity}`] = {
                color: `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent)`
            };
            
            // border-{color}/{opacity}
            newUtilities[`.border-${color}\\/${opacity}`] = {
                borderColor: `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent)`
            };
            
            // ring-{color}/{opacity}
            newUtilities[`.ring-${color}\\/${opacity}`] = {
                '--tw-ring-color': `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent)`
            };
            
            // Gradientes: from-{color}/{opacity}, via-{color}/{opacity}, to-{color}/{opacity}
            newUtilities[`.from-${color}\\/${opacity}`] = {
                '--tw-gradient-from': `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent) var(--tw-gradient-from-position)`,
                '--tw-gradient-to': `color-mix(in srgb, var(${cssVar}) 0%, transparent) var(--tw-gradient-to-position)`,
                '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
            };
            
            newUtilities[`.via-${color}\\/${opacity}`] = {
                '--tw-gradient-to': `color-mix(in srgb, var(${cssVar}) 0%, transparent) var(--tw-gradient-to-position)`,
                '--tw-gradient-stops': `var(--tw-gradient-from), color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent) var(--tw-gradient-via-position), var(--tw-gradient-to)`
            };
            
            newUtilities[`.to-${color}\\/${opacity}`] = {
                '--tw-gradient-to': `color-mix(in srgb, var(${cssVar}) ${opacityValue}%, transparent) var(--tw-gradient-to-position)`
            };
        });
        
        // Opacidades para cada shade
        colorShades.forEach(shade => {
            let shadeVar;
            if (shade === '500') {
                shadeVar = `var(${cssVar})`;
            } else if (parseInt(shade) < 500) {
                const whiteMix = shade === '50' ? 95 : shade === '100' ? 90 : shade === '200' ? 75 : shade === '300' ? 50 : 25;
                shadeVar = `color-mix(in srgb, var(${cssVar}), white ${whiteMix}%)`;
            } else {
                const blackMix = shade === '600' ? 10 : shade === '700' ? 25 : shade === '800' ? 40 : shade === '900' ? 55 : 70;
                shadeVar = `color-mix(in srgb, var(${cssVar}), black ${blackMix}%)`;
            }
            
            opacities.forEach(opacity => {
                const opacityValue = parseInt(opacity);
                
                // bg-{color}-{shade}/{opacity}
                newUtilities[`.bg-${color}-${shade}\\/${opacity}`] = {
                    backgroundColor: `color-mix(in srgb, ${shadeVar} ${opacityValue}%, transparent)`
                };
                
                // text-{color}-{shade}/{opacity}
                newUtilities[`.text-${color}-${shade}\\/${opacity}`] = {
                    color: `color-mix(in srgb, ${shadeVar} ${opacityValue}%, transparent)`
                };
                
                // border-{color}-{shade}/{opacity}
                newUtilities[`.border-${color}-${shade}\\/${opacity}`] = {
                    borderColor: `color-mix(in srgb, ${shadeVar} ${opacityValue}%, transparent)`
                };
                
                // Gradientes con shade: from-{color}-{shade}/{opacity}
                newUtilities[`.from-${color}-${shade}\\/${opacity}`] = {
                    '--tw-gradient-from': `color-mix(in srgb, ${shadeVar} ${opacityValue}%, transparent) var(--tw-gradient-from-position)`,
                    '--tw-gradient-to': `color-mix(in srgb, ${shadeVar} 0%, transparent) var(--tw-gradient-to-position)`,
                    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
                };
                
                newUtilities[`.via-${color}-${shade}\\/${opacity}`] = {
                    '--tw-gradient-to': `color-mix(in srgb, ${shadeVar} 0%, transparent) var(--tw-gradient-to-position)`,
                    '--tw-gradient-stops': `var(--tw-gradient-from), color-mix(in srgb, ${shadeVar} ${opacityValue}%, transparent) var(--tw-gradient-via-position), var(--tw-gradient-to)`
                };
                
                newUtilities[`.to-${color}-${shade}\\/${opacity}`] = {
                    '--tw-gradient-to': `color-mix(in srgb, ${shadeVar} ${opacityValue}%, transparent) var(--tw-gradient-to-position)`
                };
            });
        });
    });
    
    addUtilities(newUtilities);
});

export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    safelist: generateSafelist(),
    theme: {
        extend: {
            fontFamily: {
                'arial': ['"Arial"', 'Gadget', 'sans-serif'],
            },
            colors: {
                // Colores dinámicos desde la DB usando variables CSS con escala completa
                'page-background': generateColorScale('--bg-page-background'),
                primary: generateColorScale('--bg-primary'),
                secondary: generateColorScale('--bg-secondary'),
                accent: generateColorScale('--bg-accent'),
                'neutral-light': generateColorScale('--bg-neutral-light'),
                'neutral-dark': generateColorScale('--bg-neutral-dark'),
                warning: generateColorScale('--bg-warning'),
                info: generateColorScale('--bg-info'),
                danger: generateColorScale('--bg-danger'),
                success: generateColorScale('--bg-success'),
                'sections-color': generateColorScale('--bg-sections-color'),
            },
            boxShadowColor: {
                'page-background': 'var(--bg-page-background)',
                primary: 'var(--bg-primary)',
                secondary: 'var(--bg-secondary)',
                accent: 'var(--bg-accent)',
                'neutral-light': 'var(--bg-neutral-light)',
                'neutral-dark': 'var(--bg-neutral-dark)',
                warning: 'var(--bg-warning)',
                info: 'var(--bg-info)',
                danger: 'var(--bg-danger)',
                success: 'var(--bg-success)',
                'sections-color': 'var(--bg-sections-color)',
            },
            
            margin: {
                primary: "5%",
            },
            padding: {
                primary: "5%",
            },
            objectPosition: {
                "right-25": "75% center", // Esto desplaza la imagen 75% a la derecha y la centra verticalmente
                "right-10": "90% center", // Esto desplaza la imagen 90% a la derecha y la centra verticalmente
            },

            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'bounce': 'bounce 1s infinite',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        require("tailwindcss-animated"),
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        colorOpacityPlugin,
    ],

};
