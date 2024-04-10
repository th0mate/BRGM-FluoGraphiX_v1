/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["tailwindcss.html", "./Mecanique/*.js"],
    darkMode : 'selector',
    theme: {
        extend: {
            colors: {
                'orangeBRGM': '#e87b1c',
                'grisFonceBRGM': '#333',
                'jauneBRGM': '#ffc83d',
                'bleuBRGM': '#27B1EA',
                'rouilleBRGM': '#F05A08',
                'vertBRGM': '#9FC512',
                'roseBRGM': '#CE65A5',
                'bleuClairBRGM': '#00AEEF',
            },
            width: {
                '5/6': '83.333333%',
                '100vh' : '100vh',
                '100px': '100px',
                '200px': '200px',
            },
            height: {
                '100vh' : '100vh',
                '5/6': '83.333333%',
                '100px': '100px',
                '200px': '200px',
            },
            fontFamily: {
                'sans': ['Roboto', 'sans-serif'],
            },
            h1: {
                'font-size': '2.25rem',
                'line-height': '2.5rem',
            },

            screens: {
                'sm': {'max' : '640px'},
                'md': {'max' : '768px'},
                'lg': {'max' : '1024px'},
                'xl': {'max' : '1280px'},
                '2xl': {'max' : '1536px'},
            }
        },
    },
    plugins: [],
}