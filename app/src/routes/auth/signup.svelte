<script lang="ts">
	import { goto } from "$app/navigation";

	import {
		authorizationHeader,
		mutation,
		setAuthorizationHeader,
	} from "$lib/query";
	import zxcvbn, { type ZXCVBNResult } from "zxcvbn";

	interface UserSignupData {
		email?: string;
		name?: string;
		password?: string;
		remember?: boolean;
	}

	let zxcvbnResult: ZXCVBNResult;
	let passwordFlavourText: string;

	$: if (data.password) {
		zxcvbnResult = zxcvbn(data.password);
		passwordFlavourText = [
			"Very Weak",
			"Weak",
			"Acceptable",
			"Good",
			"Very Good",
		][zxcvbnResult.score];
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

<form>
	<label for="email">Email: </label>
	<input type="text" name="email" id="" bind:value={data.email} required />
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
	{#if zxcvbnResult}
		<div class="strength">
			<h2>Password Strength</h2>
			{passwordFlavourText}
			<h3>{zxcvbnResult.feedback.warning}</h3>
			{#each zxcvbnResult.feedback.suggestions as suggestion}
				<h3>Maybe {suggestion.toLowerCase()}</h3>
			{/each}
		</div>
	{/if}
	<label for="remember">Remember Me:</label>
	<input type="checkbox" name="remember" bind:checked={data.remember} id="" />
	<input type="submit" value="Signup" on:click|preventDefault={onSubmit} />
</form>
