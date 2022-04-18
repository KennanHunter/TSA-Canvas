<script lang="ts">
	import { goto } from "$app/navigation";

	import {
		authorizationHeader,
		mutation,
		setAuthorizationHeader,
	} from "$lib/functions/query";
	import { setTitle, Title } from "$lib/stores";
	import zxcvbn, { type ZXCVBNResult } from "zxcvbn";
	import { fade } from "svelte/transition";
	import { tweened } from "svelte/motion";

	setTitle("Signup");

	interface UserSignupData {
		email?: string;
		name?: string;
		password?: string;
		remember?: boolean;
	}

	let zxcvbnResult: ZXCVBNResult;
	let passwordFlavourText: string;

	let progressBar = tweened(0);
	$: if (data.password) {
		zxcvbnResult = zxcvbn(data.password);
		passwordFlavourText = [
			"Very Weak",
			"Weak",
			"Acceptable",
			"Good",
			"Very Good",
		][zxcvbnResult.score];
		progressBar.set(0.2 * (zxcvbnResult.score + 1));
	}

	let data: UserSignupData = {};

	function onSubmit(event) {
		mutation({
			signup: [
				{ email: data.email, name: data.name, password: data.password },
				{ token: true },
			],
		}).then((value) => {
			setAuthorizationHeader(value.signup.token, data.remember);
			goto("/");
		});
	}
</script>

<svelte:head>
	<title>Signup</title>
</svelte:head>
<div id="outer">
	<form>
		<label for="email">Email: </label>
		<input
			type="text"
			name="email"
			id=""
			bind:value={data.email}
			required
		/>
		<label for="name">Name: </label>
		<input type="text" name="name" id="" bind:value={data.name} required />

		<label for="password">Password: </label>
		<input
			type="password"
			name="password"
			bind:value={data.password}
			id=""
			required
		/>
		<div id="remember">
			<label for="remember">Remember Me:</label>
			<input
				type="checkbox"
				name="remember"
				bind:checked={data.remember}
				id=""
			/>
		</div>
		<input
			type="submit"
			value="Signup"
			on:click|preventDefault={onSubmit}
		/>
	</form>
	{#if zxcvbnResult && data.password}
		<div class="strength" in:fade>
			<h2>Password Strength</h2>
			{passwordFlavourText}<br />
			<progress value={$progressBar} />
			<h3>{zxcvbnResult.feedback.warning}</h3>
			{#each zxcvbnResult.feedback.suggestions as suggestion}
				<h3>Maybe {suggestion.toLowerCase()}</h3>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@import "./forms.scss";
	.strength {
		grid-column-start: 3;
		margin-left: 1em;
	}
</style>
