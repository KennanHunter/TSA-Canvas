<script lang="ts">
	import { Title } from "$lib/stores";
	export let Name = "";
	import Logo from "$static/Logo.webp";
	import Dropdown from "./Dropdown.svelte";
</script>

<svelte:head>
	<title>{$Title}</title>
</svelte:head>

<div>
	<div class="bar">
		<a class="left" href="/">
			<img src={Logo} alt="Logo" class="hiddenWhenSmall" />
			<h1 class="title hiddenWhenSmall">{$Title}</h1>
		</a>
		{#if Name}
			<div class="left">
				<h1 class="name hiddenWhenSmall" style="Color:inherit;">
					{Name}
				</h1>
				<Dropdown />
			</div>
		{/if}
	</div>
	<hr />
</div>

<style lang="scss">
	@use "../../app.scss";

	img {
		height: 4.5em;
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
	.left:hover {
		h1 {
			color: app.$secondary-color;
		}
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
