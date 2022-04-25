<script lang="ts">
	import { plugins } from "$lib/markdownPlugins";
	import { Viewer } from "bytemd";

	export let assignment: {
		name: string;
		dueAt: string;
		description: string;
		maxGrade?: number;
		class?: {
			hasPerms: boolean;
		};
	};
</script>

<div class="top">
	<h1>{assignment.name}</h1>
	{#if assignment.class}
		<a href="submission/">
			<button>
				{assignment.class.hasPerms
					? "View Submissions"
					: "View Submission"}
			</button>
		</a>
	{/if}
</div>
{#if assignment.dueAt}
	<h2>Due At {assignment.dueAt}</h2>
{:else}
	<h2>No Specified Due Date</h2>
{/if}
{#if assignment.maxGrade}
	<h2>Max Grade: {assignment.maxGrade}</h2>
{:else}
	<h2>Ungraded Assignment</h2>
{/if}

<div class="description">
	<Viewer value={assignment.description} {plugins} />
</div>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		padding-right: 1em;
		align-self: center;
	}
</style>
