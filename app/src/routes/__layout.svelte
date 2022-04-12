<script lang="ts">
	import { queryInit } from "$lib/functions/query";
	import Header from "$lib/header/Header.svelte";
	import "../app.scss";
	import { Title } from "$lib/stores";

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
