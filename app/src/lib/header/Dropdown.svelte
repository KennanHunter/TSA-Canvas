<script lang="ts">
	import { logout } from "$lib/functions/logout";
	import { fade } from "svelte/transition";

	import Menu from "svelte-material-icons/Menu.svelte";
	let dropdown: boolean;

	let dropdownCounter: number = 0;
</script>

<div class="template">
	<button
		on:click={() => {
			dropdown = !dropdown;
			dropdownCounter++;
			let localCounter = dropdownCounter.valueOf();
			setTimeout(() => {
				if (localCounter === dropdownCounter) {
					dropdown = false;
				}
			}, 5000);
		}}
	>
		<Menu size="2.5em" />
	</button>
	{#if dropdown}
		<ul transition:fade={{ duration: 300 }}>
			<a href="/class/"><li>View All Classes</li></a>
			<!-- <a href="/settings/"> <li>Settings</li></a> -->
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
		top: 4em;
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
	button {
		all: unset;
	}
	@media only screen and (max-width: 600px) {
		button {
			position: absolute;
			top: 1em;
			right: 1em;
		}
	}
</style>
