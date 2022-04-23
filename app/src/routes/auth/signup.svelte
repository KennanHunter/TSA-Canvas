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
	import { signupAsGuest } from "$lib/functions/signupAsGuest";
	import { toast } from "@zerodevx/svelte-toast";

	setTitle("Signup");

	interface UserSignupData {
		email?: string;
		name?: string;
		password?: string;
		remember?: boolean;
	}

	let zxcvbnResult: ZXCVBNResult;
	let passwordFlavourText: string = "";

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
