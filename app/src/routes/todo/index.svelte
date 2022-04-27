<script context="module" lang="ts">
	import type { LoadInput, LoadOutput } from "@sveltejs/kit";

	export async function load({}: LoadInput): Promise<
		LoadOutput<Record<string, any>>
	> {
		return {
			status: 300,
			redirect: "/",
		};
	}
</script>
