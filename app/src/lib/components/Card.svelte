<script lang="ts">
	export let value: {
		Title: string;
		PrimarySubtext?: string;
		SecondarySubtext?: string;
		Color?: string;
	};
</script>

{#if value.Color}
	<div
		style="
    display: none;
    --color: {value.Color}"
	/>
{/if}
<div class="outer">
	<h2>
		{value.Title}
	</h2>
	<div class="bar">
		{#if value.PrimarySubtext}
			<p>
				{value.PrimarySubtext}
			</p>
		{/if}
		{#if value.SecondarySubtext}
			<p>
				{value.SecondarySubtext}
			</p>
		{/if}
	</div>
</div>

<style lang="scss">
	@import "../../app.scss";
	.outer {
		border: 0.2em solid var(--color, $secondary-color);
		border-radius: 0.4em;
		padding: 1em;
		margin: 1em;
		width: 20em;
	}
	.outer:hover {
		h2 {
			font-weight: 900;
		}
		p {
			font-weight: 700;
		}
		border: 0.4em solid var(--color, $secondary-color);
	}
	.bar {
		display: flex;
		justify-content: space-between;
	}
</style>
