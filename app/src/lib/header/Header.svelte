<script lang="ts">
	import { Title } from "$lib/stores";
	export let Name = "";
	import Logo from "$static/Logo.png";
</script>

<svelte:head>
	<title>{$Title}</title>
</svelte:head>

<template>
	<div class="bar">
		<div class="left">
			<img src={Logo} alt="Logo" class="hiddenWhenSmall" />
			<h1 class="title hiddenWhenSmall">{$Title}</h1>
		</div>
		<h1 class="name hiddenWhenSmall">{Name}</h1>
	</div>
	<hr />
</template>

<style lang="scss">
	@use "../../app.scss";

	img {
		height: 5em;
		margin: 0.5em;
	}
	.bar {
		display: flex;
		justify-content: space-between;
		padding: 0 0.5em;
	}
	h1 {
		display: inline;
		vertical-align: middle;
	}
	.left {
		margin: 0.5em;
		display: flex;
		align-items: center;
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
