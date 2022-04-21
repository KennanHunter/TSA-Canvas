<script lang="ts">
	import { logout } from "$lib/functions/logout";

	import Menu from "svelte-material-icons/Menu.svelte";
	let dropdown: boolean;
</script>

<div class="template">
	<button
		style="all: unset"
		on:click={() => {
			dropdown = !dropdown;
		}}
	>
		<Menu size="2.5em" />
	</button>
	{#if dropdown}
		<ul>
			<a href="/class/"><li>View All Classes</li></a>
			<a href="/settings/"> <li>Settings</li></a>
			<li on:click={logout}>Logout</li>
		</ul>
	{/if}
</div>

<style lang="scss">
	@use "../../app.scss";
	.template {
		margin: 1em;
	}
	ul {
		position: fixed;
		right: 1em;
		background-color: app.$background-color;
		border: 0.3em app.$secondary-color solid;
		border-radius: 1em;
		padding: 0.3em;
		width: 10em;
	}
	li {
		list-style: none;
		border-radius: 1em;
		padding: 1em 1em;
	}
	li:hover {
		background-color: app.$primary-color;
		font-weight: 700;
	}
</style>
