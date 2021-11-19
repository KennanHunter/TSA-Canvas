<script lang="ts">
	export let params = {};
	let apiResult: apiResultObject;

	interface apiResultObject {
		Title: string;
		Date: number;
		Body: string;
		Author: Array<string>;
	}

	async function fetchAssignment() {
		let response = await fetch("/api/test-assignment.json");
		let data = await response.json();
		console.log(data);
		return data;
	}

	let promise = fetchAssignment();
</script>

{#await promise}
	<h2>Loading..</h2>
{:then res}
	<h1>
		{res.Title}
	</h1>
	<h3>
		By:
		{#each res.Author as author, i}
			<strong>{author}</strong>
			<!-- {#if i == res.Author.length - 2}
				, and
			{:else if i < res.Author.length}
				,
			{/if} -->
		{/each}
	</h3>
	<p>
		{res.Body}
	</p>
{/await}
