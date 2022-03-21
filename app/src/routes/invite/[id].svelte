<script lang="ts">
	import { page } from "$app/stores";

	import { mutation, query } from "$lib/query";
	import { onMount } from "svelte";

	interface ClassInformation {
		name: String;
	}

	let classInformation: ClassInformation = {
		name: "",
	};

	onMount(async () => {
		classInformation = (
			await query({
				getInvite: [
					{
						inviteId: $page.params.id,
					},
					{
						name: true,
					},
				],
			})
		).getInvite;
	});

	function acceptInvite() {
		mutation({
			acceptInvite: [
				{
					inviteId: $page.params.id,
				},
				{},
			],
		});
	}
</script>

<h1>You've been invited to: {classInformation.name || ""}</h1>

<button on:click={acceptInvite}>Accept</button>
