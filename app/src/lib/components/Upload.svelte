<script context="module" lang="ts">
	export async function load({
		params,
		fetch,
		session,
		stuff,
		url,
	}: LoadInput): Promise<LoadOutput<Record<string, any>>> {
		return {
			props: {
				selectFiles: await query(
					{
						allFiles: {
							id: true,
						},
					},
					fetch,
				),
			},
		};
	}
</script>

<script lang="ts">
	import { mutation, query } from "$lib/functions/query";
	import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/internal";

	let uploadFiles: FileList;

	export let selectFiles = [];

	export let returnFunction: (id: string) => void = (value) => {
		console.log(value);
	};

	enum Position {
		select,
		upload,
	}
	let position: Position = Position.select;

	if (!selectFiles) {
		position = Position.upload;
	}

	function uploadNewFile() {
		mutation({
			uploadFile: {
				link: true,
				file: {
					id: true,
				},
			},
		}).then((value) => {
			fetch(value.uploadFile.link, {
				method: "PUT",
				body: uploadFiles[0],
			}).then(() => {
				returnFunction(value.uploadFile.file.id);
			});
		});
	}

	function fileSelected(id: string) {
		// Keeping this as external function for potential future validation of id
		returnFunction(id);
	}
</script>

<div>
	<ul>
		<li on:click={() => (position = Position.select)}>Use Existing File</li>
		<li on:click={() => (position = Position.upload)}>Upload New File</li>
	</ul>
	{#if position === Position.upload}
		<h1>Upload File</h1>
		<input type="file" name="" id="" bind:files={uploadFiles} />
		<br />
		<input type="submit" value="Upload File" on:click={uploadNewFile} />
	{:else if position === Position.select}
		<h1>Select File</h1>
		<ul>
			{#each selectFiles as file}
				<li
					on:click={() => {
						fileSelected(file.id);
					}}
				>
					<p>{file.id}</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	ul {
		display: flexbox;
		flex-direction: row;
	}
	li {
		all: unset;
	}
</style>
