/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundColor: { nav: '#F8F9FA' },
			textColor: { blue: '#2B7EFB' },
			width: {
				'80w': '80vw',
			},
		},
	},
	plugins: [],
}
