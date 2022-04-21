<script lang="ts" context="module">
	export async function load({ url, fetch }: LoadInput) {
		queryInit(url.host);
		let selfQuery = await query(
			{
				self: {
					name: true,
				},
			},
			fetch,
			false,
		);

		if (selfQuery?.self?.name) {
			return {
				props: {
					Name: selfQuery.self.name,
				},
			};
		} else {
			return {};
		}
	}
</script>

<script lang="ts">
	import { query, queryInit } from "$lib/functions/query";
	import Header from "$lib/header/Header.svelte";
	import { Title } from "$lib/stores";
	import "../app.scss";
	import "bytemd/dist/index.css";
	import type { LoadInput } from "@sveltejs/kit";

	export let Name = "";
	if (!$Title) {
		Title.set("Red Panda LMS");
	}
</script>

<Header {Name} />

<main>
	<slot />
</main>

<style>
	@media only screen and (max-width: 600px) {
		main {
			margin: 0 1em;
		}
	}
</style>
