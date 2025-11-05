/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
        "./resources/**/*.vue",
    ],
    theme: {
        extend: {
            screens: {
                '3xl': '1400px', 
            },
            maxWidth: {
                '1500': '1500px',
            },
            fontFamily: {
                "font-general": ["Lato", "serif"], //"Lato" "serif" usado para Sala Fabulosa
                "font-primary": ["Rajdhani", "sans-serif"], // usado para Stech Peru
                "font-secondary": ["Open Sans", "serif"],
                "playfair": ["Playfair", "serif"],
                'inter': ['Inter', 'sans-serif'],
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
            fontStyle: {
                'oblique-light': 'oblique 5deg',
            },
            backgroundImage: {
                // Here's your custom gradient
                'primary-gradient': 'linear-gradient(37deg, #F9A519 -0.01%, #ECC774 37.09%, #ECBB0D 68.49%, #C3922E 99.99%)',
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

        // require('tailwind-scrollbar')({
        //     nocompatible: true,
        //     preferredStrategy: 'pseudoelements',
        // }),
        // Otros plugins si los tienes
    ],

};
