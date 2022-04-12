<script lang="ts">
	import { Title } from "$lib/stores";
</script>

<svelte:head>
	<title>{$Title}</title>
</svelte:head>

<template>
	<h1>{$Title}</h1>
	<hr />
</template>

<style lang="scss">
	@use "../../app.scss";

	h1 {
		padding-left: 1em;
		margin: 0.5em;
	}

	hr {
		height: 0.5em;
		border-width: 0;
		background-color: app.$secondary-color;
	}
</style>
