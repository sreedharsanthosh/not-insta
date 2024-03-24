<script lang="ts">
	import { pb, currentUser } from '$lib/pocketbase';
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { fromZodError } from 'zod-validation-error';
	import { Jumper } from 'svelte-loading-spinners';
	/**
	 * @type {string}
	 */
	let username: string;
	/**
	 * @type {string}
	 */
	let password: string;
	let usernameError = '';
	let passwordError = '';
	let formError = '';
	let loggingIn: boolean = false;

	const userSchema = z.object({
		username: z.string().min(8),
		password: z.string().min(8)
	});

	function validate(username: String, password: String) {
		const user = {
			username: username,
			password: password
		};
		const result = userSchema.safeParse(user);
		if (!result.success) {
			const error = result.error.flatten();
			const formError = error.fieldErrors;
			if (formError.username) {
				usernameError = formError.username[0];
			} else if (formError.password) {
				passwordError = formError.password[0];
			}
			return fromZodError(result.error);
		} else {
			return true;
		}
	}

	async function Login() {
		usernameError = '';
		passwordError = '';
		formError = '';
		const validationResult = validate(username, password);
		if (validationResult) {
			try {
				loggingIn = true;
				await pb
					.collection('users')
					.authWithPassword(username, password)
					.then((res) => goto('/'))
					.catch((err) => (formError = 'Incorrect username or password'));
				loggingIn = false;
			} catch (err) {}
		}
	}
	function signOut() {
		pb.authStore.clear();
	}
</script>

{#if loggingIn}
	<div
		class="absolute z-10 flex h-screen w-screen items-center justify-center bg-custom-gray opacity-50"
	>
		<Jumper size="200" unit="px" color="#ffffff" />
	</div>
{/if}

<div class="flex h-screen flex-col items-center justify-center text-white">
	{#if $currentUser}
		<h1>Already logged in</h1>
	{:else}
		<form
			method="post"
			on:submit|preventDefault
			class="flex h-3/5 w-3/4 flex-col items-center justify-around rounded-md bg-custom-gray px-4 md:w-1/2 xl:w-1/4"
		>
			<h1 class="text-3xl font-bold">Login</h1>
			<label for="username" class="w-full self-start text-xl font-bold"
				>Username: <input
					class="my-2 w-full bg-dark-gray p-2"
					type="text"
					name="username"
					bind:value={username}
				/>
				<h6 class="text-xs text-red-500">{usernameError}</h6>
			</label>

			<label for="password" class="w-full self-start text-xl font-bold"
				>Password: <input
					class="my-2 w-full bg-dark-gray p-2"
					type="password"
					name="password"
					bind:value={password}
				/>
				<h6 class="text-xs text-red-500">{passwordError}</h6>
			</label>
			<button class="my-1 rounded-md bg-green-300 px-6 py-2 font-bold text-black" on:click={Login}
				>Log in</button
			>
			<h3>Don't have an account? <a class="text-blue-400" href="/signup">Sign up</a></h3>
			<h6 class="text-xl text-red-500">{formError}</h6>
		</form>
	{/if}
</div>
