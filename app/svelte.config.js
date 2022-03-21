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
				},
			},
			server: {
				fs: {
					allow: ["./zeus"],
				},
			},
		},
	},
};

export default config;
