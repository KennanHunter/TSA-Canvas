<script>
	import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<div class="wrap">
	<SvelteToast options={{}} />
</div>

<style lang="scss">
	@use "../../app.scss";
	.wrap {
		font-family: app.$font;
		--toastBackground: app.$background-color;
		--toastBarBackground: #911414;
		--toastContainerTop: auto;
		--toastContainerRight: 3rem;
		--toastContainerBottom: 3rem;
		--toastContainerLeft: auto;
	}
</style>
