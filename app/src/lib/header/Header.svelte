<script lang="ts">
	import { Title } from "$lib/stores";
	export let Name = "";
</script>

<svelte:head>
	<title>{$Title}</title>
</svelte:head>

<template>
	<div>
		<h1 class="title hiddenWhenSmall">{$Title}</h1>
		<h1 class="name hiddenWhenSmall">{Name}</h1>
	</div>
	<hr />
</template>

<style lang="scss">
	@use "../../app.scss";

	div {
		display: flex;
		justify-content: space-between;
		padding: 0 1em;
	}
	h1 {
		margin: 0.5em;
	}
	.title {
		text-align: left;
		font-size: 2em;
	}
	.name {
		text-align: right;
		font-size: 1.5em;
		align-self: center;
	}

	hr {
		height: 0.5em;
		border-width: 0;
		background-color: app.$secondary-color;
	}
</style>
