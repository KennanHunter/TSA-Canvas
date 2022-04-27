<script context="module">
	export let prerender = true;
</script>

<script lang="ts">
	import { goto } from "$app/navigation";
	import { mutation, setAuthorizationHeader } from "$lib/functions/query";
	import { signupAsGuest } from "$lib/functions/signupAsGuest";
	import { setTitle } from "$lib/stores";
	import { toast } from "@zerodevx/svelte-toast";
	import { tweened } from "svelte/motion";
	import { fade } from "svelte/transition";
	import type { ZXCVBNResult } from "zxcvbn";

	setTitle("Signup");

	interface UserSignupData {
		email?: string;
		name?: string;
		password?: string;
		repeat?: string;
		remember?: boolean;
	}

	let zxcvbnResult: ZXCVBNResult;
	let passwordFlavourText: string = "";

	let progressBar = tweened(0);

	let zxcvbn: Function;

	import("zxcvbn").then(({ default: importedFunc }) => {
		zxcvbn = importedFunc;
	});

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

	let data: UserSignupData = { remember: true };

	function onSubmit(event) {
		mutation({
			signup: [
				{ email: data.email, name: data.name, password: data.password },
				{
					token: true,
					user: {
						name: true,
					},
				},
			],
		}).then((value) => {
			setAuthorizationHeader(value.signup.token, data.remember);
			toast.push("Signed up as " + value.signup.user.name);
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
		{#if data.password}
			<label for="password">Repeat Password: </label>
			<input
				type="password"
				name="password"
				bind:value={data.repeat}
				id=""
				required
			/>
		{/if}
		{#if data.password !== data.repeat}
			<p style="color: red;">Passwords do not match</p>
		{/if}
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
		<input
			type="submit"
			value="Signup As Guest"
			on:click|preventDefault={signupAsGuest}
		/>
		<a href="/auth/login"><input type="button" value="Log In Instead" /></a>
	</form>

	<div class="strength" in:fade>
		<h2>Password Strength</h2>
		<label for="progress">{passwordFlavourText}</label> <br />
		<progress id="progress" value={$progressBar} />
		{#if zxcvbnResult && data.password}
			<h3 transition:fade>{zxcvbnResult.feedback.warning}</h3>
			{#each zxcvbnResult.feedback.suggestions as suggestion}
				<h3 transition:fade>{suggestion}</h3>
			{/each}
		{/if}
	</div>
</div>

<style lang="scss">
	@import "./forms.scss";
	@import "../../app.scss";
	.strength {
		grid-column-start: 3;
		margin-left: 1em;
	}
	progress {
		width: 15rem;
	}
	::-webkit-progress-bar {
		background-color: $secondary-color;
	}
	::-moz-progress-bar {
		background-color: $secondary-color;
	}
</style>
