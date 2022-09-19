/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundColor: { nav: '#F8F9FA' },
		},
	},
	plugins: [require('daisyui'), require('@tailwindcss/line-clamp')],

	daisyui: {
		styled: true,
		themes: ['emerald'],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: '',
		darkTheme: 'false',
	},
}
