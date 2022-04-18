<script
lang="ts"
context="module"
>
	export async function load({
		url,
	}: LoadInput){
		queryInit(url.host)
		return {}
	}

</script>

<script lang="ts">
	import { queryInit } from "$lib/functions/query";
	import Header from "$lib/header/Header.svelte";
	import "../app.scss";
	import { Title } from "$lib/stores";
import type { LoadInput } from "@sveltejs/kit/types/private";

	queryInit();

	if (!$Title) {
		Title.set("Red Panda LMS");
	}
</script>

<Header />

<main>
	<slot />
</main>

<style>
</style>
