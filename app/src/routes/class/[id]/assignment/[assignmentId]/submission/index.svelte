<script lang="ts" context="module">
	import { load } from "$lib/functions/load/submission";
	import Check from "svelte-material-icons/Check.svelte";
	import Close from "svelte-material-icons/Close.svelte";
	export { load };
</script>

<script lang="ts">
	interface Submission {
		user: {
			name: string;
		};
		grade: number;
	}
	export let submissions: Submission[] = [
		{
			user: {
				name: "kennan",
			},
			grade: 4,
		},
	];

	submissions.sort((a, b) => {
		if (!!a.grade === !b.grade) {
			// Case if one is completed and one is not
			return a.grade ? 100 : -100;
		} else {
			// Case if both are completed or both are uncompleted
			a.user.name.toLowerCase().charCodeAt(0) -
				b.user.name.toLowerCase().charCodeAt(0);
		}
	});
</script>

<div>
	<nav>
		<ul>
			{#each submissions as submission}
				<li>
					<div>
						{#if submission.grade}
							<Check />
						{:else}
							<Close />
						{/if}
					</div>
					<div>
						<h3>
							{submission.user.name}
						</h3>
					</div>
				</li>
			{/each}
		</ul>
	</nav>
</div>
