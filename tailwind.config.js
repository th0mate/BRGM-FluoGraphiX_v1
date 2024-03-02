/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["tailwindcss.html", "./Mecanique/*.js"],
    darkMode : 'selector',
    theme: {
        extend: {
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
            }
        },
    },
    plugins: [],
}