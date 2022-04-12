<script lang="ts">
	import { host } from "$lib/functions/query";
	export let id: string;
</script>

<img src={host + ":9000/upload/" + id} alt="User Generated" />

<style>
	img {
		width: 20em;
		object-fit: contain;
	}
</style>
