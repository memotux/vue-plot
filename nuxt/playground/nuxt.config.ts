export default defineNuxtConfig({
	modules: ["@memotux/vue-plot-nuxt"],
	devtools: {
		enabled: true,

		timeline: {
			enabled: true,
		},
	},
	compatibilityDate: "latest",
});
