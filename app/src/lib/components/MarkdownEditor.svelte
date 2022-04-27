<script lang="ts">
	import { mutation } from "$lib/functions/query";

	import { plugins } from "$lib/markdownPlugins";
	import { Editor } from "bytemd";
	import type { Image } from "mdast";

	export let value = "";

	function handleMarkdownChange(event) {
		value = event.detail.value;
	}

	async function uploadFile(files: File[]): Promise<{ url }[]> {
		let returnValue: { url: string }[];
		files.forEach(async (file) => {
			await mutation({
				uploadFile: {
					link: true,
					file: {
						id: true,
					},
				},
			}).then((value) => {
				fetch(value.uploadFile.link, {
					method: "PUT",
					body: file,
				}).then(() => {
					returnValue.push({
						url: "/minio/upload/" + value.UploadFile.file.id,
					});
				});
			});
		});
		return returnValue;
	}
</script>

<Editor
	{value}
	{plugins}
	on:change={handleMarkdownChange}
	uploadImages={uploadFile}
/>
