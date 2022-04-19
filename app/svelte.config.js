import adapter from "@sveltejs/adapter-node";
import { resolve } from "path";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		trailingSlash: "always",

		vite: {
			resolve: {
				alias: {
					$zeus: resolve("./zeus"),
					$static: resolve("./static"),
					$: resolve("./src"),
				},
			},
			server: {
				fs: {
					allow: ["./zeus", "./static"],
				},
				// proxy: {
				// 	"api": {
				// 		target: "https://localhost/api",
				// 	},
				// },
			},
			optimizeDeps: {
				exclude: ["totalist", "sirv", "local-access"],
			},
		},
	},
};

export default config;
