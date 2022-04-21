<script lang="ts">
	import { plugins } from "$lib/markdownPlugins";
	import { Viewer } from "bytemd";

	export let assignment: {
		name: string;
		dueAt: number;
		description: string;
	};
</script>

<div class="top">
	<h1>{assignment.name}</h1>
	<a href="submission/">
		<button> View Submission </button>
	</a>
</div>
{#if assignment.dueAt}
	<h2>Due At {new Date(assignment.dueAt).toDateString()}</h2>
{:else}
	<h2>No Specified Due Date</h2>
{/if}
<div class="description">
	<Viewer value={assignment.description} {plugins} />
</div>

<style>
	.top {
		display: flex;
		justify-content: space-between;
		padding-right: 1em;
	}
</style>
