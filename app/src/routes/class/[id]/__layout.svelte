<script context="module" lang="ts">
	import { page } from "$app/stores";
	import { query } from "$lib/functions/query";
	import { setTitle } from "$lib/stores";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	export async function load({
		params,
		fetch,
		session,
		stuff,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				value: (
					await query(
						{
							Class: [
								{ classId: params.id },
								{
									name: true,
									hasPerms: true,
								},
							],
						},
						fetch,
					)
				).Class,
			},
		};
	}
</script>

<script>
	let baseUrl = "/class/" + $page.params.id + "/";
	export let value;
	setTitle(value.name);
</script>

<div class="outer">
	<menu class="hiddenWhenSmall">
		<ul>
			<a href={baseUrl}>
				<li>Class Page</li>
			</a>
			<a href={baseUrl + "assignment"}><li>Assignments</li></a>

			<a href={baseUrl + "grades"}>
				<li>Grades</li>
			</a>
			<a href={baseUrl + "memberlist"}>
				<li>Class Members</li>
			</a>
			{#if value.hasPerms}
				<a href={baseUrl + "settings"}>
					<li>Class Settings</li>
				</a>
				<a href={baseUrl + "invite"}>
					<li>Invites</li>
				</a>
			{/if}
		</ul>
	</menu>
	<div>
		<slot />
	</div>
</div>

<style lang="scss">
	@import "../../../app.scss";
	.outer {
		display: grid;
		grid-template-columns: 14em auto;
		height: 100%;
	}
	@media only screen and (max-width: 600px) {
		.outer {
			grid-template-columns: auto;
		}
	}

	a {
		all: unset;
	}
	menu {
		padding: 0;
		margin: 0;
		height: 100%;
	}
	ul {
		list-style: none;
		padding: 0;
		border-right: 0.1em solid black;
		margin-right: 3em;
	}
	li {
		padding: 0.7em 0 0.7em 0.7em;
	}
	li:hover {
		background-color: $secondary-color;
		font-weight: 700;
	}
</style>
