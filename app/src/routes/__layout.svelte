<script lang="ts" context="module">
	export async function load({ url, fetch }: LoadInput) {
		queryInit(url.host);
		let selfQuery = await query(
			{
				self: {
					id: true,
					name: true,
				},
			},
			fetch,
			false,
		);

		if (selfQuery?.self?.name) {
			return {
				props: {
					Id: selfQuery.self.id,
					Name: selfQuery.self.name,
				},
			};
		} else {
			return {};
		}
	}
</script>

<script lang="ts">
	import ToastWrapper from "$lib/components/ToastWrapper.svelte";
	import { query, queryInit, userId } from "$lib/functions/query";
	import Header from "$lib/header/Header.svelte";
	import { Title } from "$lib/stores";
	import type { LoadInput } from "@sveltejs/kit";
	import "bytemd/dist/index.css";
	import "../app.scss";

	export let Name = "";
	export let Id = "";

	$: userId.set(Id);

	if (!$Title) {
		Title.set("Red Panda LMS");
	}
</script>

<div>
	<Header {Name} />

	<main>
		<slot />
	</main>

	<ToastWrapper />
</div>

<style>
	div {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}
	main {
		flex-grow: 1;
	}
	@media only screen and (max-width: 600px) {
		main {
			margin: 0 1em;
		}
	}
</style>
